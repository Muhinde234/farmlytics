const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse'); // For parsing CSV data

const baseDataFolder = path.join(__dirname, '../../data'); // Path to your 'data' folder

// --- CropPlannerService (JavaScript adaptation of CropPlannerModel) ---
class CropPlannerService {
    constructor(data) {
        this.data = data;
        // Ensure data types are correct for calculations
        this.data.forEach(row => {
            row.Avg_Area_ha = parseFloat(row.Avg_Area_ha) || 0;
            row.Avg_Yield_Kg_per_Ha = parseFloat(row.Avg_Yield_Kg_per_Ha) || 0;
            row.Total_Production_Kg = parseFloat(row.Total_Production_Kg) || 0;
            row.Num_Observations = parseInt(row.Num_Observations) || 0;
        });
        // Filter out records with no meaningful area
        this.data = this.data.filter(row => row.Avg_Area_ha > 0);
        console.log(`CropPlannerService initialized with ${this.data.length} records.`);
    }

    get_crop_recommendations(district_name, farm_size_ha, top_n = 3, season = null) {
        let districtData = this.data.filter(row => row.DistrictName === district_name);

        if (districtData.length === 0) {
            return []; // No data for this district
        }

        // Filter by specific season if provided
        if (season) {
            const seasonSpecificData = districtData.filter(row => row.Season === season);
            if (seasonSpecificData.length > 0) {
                districtData = seasonSpecificData;
            } else {
                // Fallback: if specific season has no data for the district, use overall district data
                console.warn(`Falling back to overall seasonal averages for ${district_name} as no data for ${season}.`);
            }
        }

        // Aggregate data (if season not specified or fallback occurred)
        // Group by CropName and calculate mean for averages, sum for totals
        const aggregatedMap = new Map();
        districtData.forEach(row => {
            if (!aggregatedMap.has(row.CropName)) {
                aggregatedMap.set(row.CropName, {
                    CropName: row.CropName,
                    Avg_Area_ha_Sum: 0,
                    Avg_Yield_Kg_per_Ha_Sum: 0,
                    Total_Production_Kg_Sum: 0, // This is already summed in aggregated CSV, so sum again to get overall sum
                    Observation_Count: 0, // To count how many entries contributed to the average
                    Overall_Num_Observations_Accumulated: 0 // Sum of original Num_Observations
                });
            }
            const agg = aggregatedMap.get(row.CropName);
            agg.Avg_Area_ha_Sum += row.Avg_Area_ha;
            agg.Avg_Yield_Kg_per_Ha_Sum += row.Avg_Yield_Kg_per_Ha;
            agg.Total_Production_Kg_Sum += row.Total_Production_Kg;
            agg.Overall_Num_Observations_Accumulated += row.Num_Observations;
            agg.Observation_Count++;
        });

        let districtDataAgg = Array.from(aggregatedMap.values()).map(agg => ({
            CropName: agg.CropName,
            Avg_Area_ha: agg.Avg_Area_ha_Sum / agg.Observation_Count,
            Avg_Yield_Kg_per_Ha: agg.Avg_Yield_Kg_per_Ha_Sum / agg.Observation_Count,
            Total_Overall_Production_Kg: agg.Total_Production_Kg_Sum,
            Overall_Num_Observations: agg.Overall_Num_Observations_Accumulated
        }));

        // Filter out crops with very low average area or yield (noise)
        districtDataAgg = districtDataAgg.filter(row => row.Avg_Area_ha > 0.01 && row.Avg_Yield_Kg_per_Ha > 0);
        
        // Sort by average yield for recommendation
        districtDataAgg.sort((a, b) => b.Avg_Yield_Kg_per_Ha - a.Avg_Yield_Kg_per_Ha);

        const recommendedCrops = districtDataAgg.slice(0, top_n);

        if (recommendedCrops.length === 0) {
            return []; // No suitable crops found
        }

        // Calculate proportional area allocation
        const totalHistoricalAreaForTopCrops = recommendedCrops.reduce((sum, crop) => sum + crop.Avg_Area_ha, 0);

        return recommendedCrops.map(crop => {
            let allocatedArea;
            if (totalHistoricalAreaForTopCrops === 0) {
                // If no historical area, distribute evenly
                allocatedArea = farm_size_ha / recommendedCrops.length;
            } else {
                allocatedArea = (crop.Avg_Area_ha / totalHistoricalAreaForTopCrops) * farm_size_ha;
            }
            const estimatedTotalProduction = allocatedArea * crop.Avg_Yield_Kg_per_Ha;

            return {
                CropName: crop.CropName,
                Recommended_Area_ha: parseFloat(allocatedArea.toFixed(2)),
                Estimated_Yield_Kg_per_Ha: parseFloat(crop.Avg_Yield_Kg_per_Ha.toFixed(2)),
                Estimated_Total_Production_Kg: parseFloat(estimatedTotalProduction.toFixed(2))
            };
        });
    }
}

// --- MarketDemandService (JavaScript adaptation of MarketDemandModel) ---
class MarketDemandService {
    constructor(data) {
        this.data = data;
        this.data.forEach(row => {
            row.Total_Weighted_Consumption_Qty_Kg = parseFloat(row.Total_Weighted_Consumption_Qty_Kg) || 0;
            row.Total_Weighted_Consumption_Value_Rwf = parseFloat(row.Total_Weighted_Consumption_Value_Rwf) || 0;
            row.Num_Households_Observed = parseInt(row.Num_Households_Observed) || 0;
        });
        this.data = this.data.filter(row => row.Total_Weighted_Consumption_Qty_Kg > 0 || row.Total_Weighted_Consumption_Value_Rwf > 0);
        console.log(`MarketDemandService initialized with ${this.data.length} records.`);
    }

    get_market_demand_insights(location_name, location_type = 'District', top_n = 5, sort_by = 'quantity') {
        let demandData;
        if (location_type === 'District') {
            demandData = this.data.filter(row => row.DistrictName === location_name);
        } else if (location_type === 'Province') {
            let provincialData = this.data.filter(row => row.ProvinceName === location_name);
            // Aggregate provincial data by summing across districts
            const aggregatedMap = new Map();
            provincialData.forEach(row => {
                if (!aggregatedMap.has(row.CropName)) {
                    aggregatedMap.set(row.CropName, {
                        CropName: row.CropName,
                        Total_Weighted_Consumption_Qty_Kg: 0,
                        Total_Weighted_Consumption_Value_Rwf: 0,
                        Num_Households_Observed: 0
                    });
                }
                const agg = aggregatedMap.get(row.CropName);
                agg.Total_Weighted_Consumption_Qty_Kg += row.Total_Weighted_Consumption_Qty_Kg;
                agg.Total_Weighted_Consumption_Value_Rwf += row.Total_Weighted_Consumption_Value_Rwf;
                agg.Num_Households_Observed += row.Num_Households_Observed;
            });
            demandData = Array.from(aggregatedMap.values());
        } else {
            throw new Error("location_type must be 'District' or 'Province'.");
        }

        if (demandData.length === 0) {
            return [];
        }

        let sortedDemand = [...demandData]; // Create a copy for sorting
        if (sort_by === 'quantity') {
            sortedDemand.sort((a, b) => b.Total_Weighted_Consumption_Qty_Kg - a.Total_Weighted_Consumption_Qty_Kg);
        } else if (sort_by === 'value') {
            sortedDemand.sort((a, b) => b.Total_Weighted_Consumption_Value_Rwf - a.Total_Weighted_Consumption_Value_Rwf);
        } else {
            throw new Error("sort_by must be 'quantity' or 'value'.");
        }

        return sortedDemand.slice(0, top_n).map(item => ({
            CropName: item.CropName,
            Total_Weighted_Consumption_Qty_Kg: parseFloat(item.Total_Weighted_Consumption_Qty_Kg.toFixed(0)),
            Total_Weighted_Consumption_Value_Rwf: parseFloat(item.Total_Weighted_Consumption_Value_Rwf.toFixed(0))
        }));
    }
}

// --- MarketConnectionService (JavaScript adaptation of MarketConnectionModel) ---
class MarketConnectionService {
    constructor(data) {
        this.data = data;
        this.data.forEach(row => {
            row.Total_workers = parseInt(row.Total_workers) || 0;
            // q20: Annual_Turnover_2022, q21: Employed_Capital from cleaned CSV
            row.Annual_Turnover_2022 = parseFloat(row.Annual_Turnover_2022) || 0;
            row.Employed_Capital = parseFloat(row.Employed_Capital) || 0;
            row.Is_Agriculture_Related = parseInt(row.Is_Agriculture_Related) || 0;
            row.Is_Food_Processing_Related = parseInt(row.Is_Food_Processing_Related) || 0;
            row.Is_Food_Trade_Related = parseInt(row.Is_Food_Trade_Related) || 0;
            row.Is_Exporter_Goods = parseInt(row.Is_Exporter_Goods) || 0;
        });
        console.log(`MarketConnectionService initialized with ${this.data.length} records.`);
    }

    _filter_by_location(location_name, location_type = 'District') {
        if (location_type === 'District') {
            return this.data.filter(row => row.DistrictName === location_name);
        } else if (location_type === 'Province') {
            return this.data.filter(row => row.ProvinceName === location_name);
        } else {
            throw new Error("location_type must be 'District' or 'Province'.");
        }
    }

    find_cooperatives(location_name, location_type = 'District') {
        const locationData = this._filter_by_location(location_name, location_type);
        return locationData.filter(row => row.Is_Cooperative === 'Yes').map(row => ({
            ISIC_Section_Name: row.ISIC_Section_Name,
            Total_workers: row.Total_workers,
            Annual_Turnover_2022: row.Annual_Turnover_2022,
            Employed_Capital: row.Employed_Capital
        }));
    }

    find_potential_buyers_and_processors(location_name, location_type = 'District', min_workers = 5, min_turnover = 1000000) {
        const locationData = this._filter_by_location(location_name, location_type);

        const potentialBuyers = locationData.filter(row =>
            row.Is_Food_Trade_Related === 1 && (row.Total_workers >= min_workers || row.Annual_Turnover_2022 >= min_turnover)
        ).map(row => ({
            ISIC_Section_Name: row.ISIC_Section_Name,
            Total_workers: row.Total_workers,
            Annual_Turnover_2022: row.Annual_Turnover_2022,
            Employed_Capital: row.Employed_Capital
        }));

        const foodProcessors = locationData.filter(row =>
            row.Is_Food_Processing_Related === 1 && (row.Total_workers >= min_workers || row.Annual_Turnover_2022 >= min_turnover)
        ).map(row => ({
            ISIC_Section_Name: row.ISIC_Section_Name,
            Total_workers: row.Total_workers,
            Annual_Turnover_2022: row.Annual_Turnover_2022,
            Employed_Capital: row.Employed_Capital
        }));

        return { Potential_Buyers: potentialBuyers, Food_Processors: foodProcessors };
    }

    find_exporters(location_name, location_type = 'District') {
        const locationData = this._filter_by_location(location_name, location_type);
        return locationData.filter(row => row.Is_Exporter_Goods === 1).map(row => ({
            ISIC_Section_Name: row.ISIC_Section_Name,
            Total_workers: row.Total_workers,
            Annual_Turnover_2022: row.Annual_Turnover_2022,
            Employed_Capital: row.Employed_Capital
        }));
    }
}

// --- HarvestTrackerService (JavaScript adaptation of Harvest & Revenue Tracker Logic) ---
class HarvestTrackerService {
    constructor(cropPlannerService, marketDemandService) {
        this.cropPlannerService = cropPlannerService;
        this.marketDemandService = marketDemandService;
        // Default values for crops not directly found in analytics data
        this.defaultYields = {
            "Maize": 700.0, "Beans": 1500.0, "Irish potatoes": 10000.0,
            "Cassava": 15000.0, "Tomatoes": 20000.0
        };
        this.defaultPrices = {
            "Maize": 350.0, "Beans": 500.0, "Irish potatoes": 250.0,
            "Cassava": 100.0, "Tomatoes": 400.0
        };
        this.daysToMaturity = {
            "Maize": 120, // ~4 months
            "Beans": 90,  // ~3 months
            "Irish potatoes": 100, // ~3.5 months
            "Cassava": 365, // ~12 months (long cycle)
            "Tomatoes": 75  // ~2.5 months
        };
    }

    async get_harvest_and_revenue_estimates(crop_name, actual_area_planted_ha, planting_date_str, district_name) {
        let plantingDate;
        try {
            plantingDate = new Date(planting_date_str);
            if (isNaN(plantingDate.getTime())) {
                 throw new Error("Invalid planting_date_str format. Use YYYY-MM-DD.");
            }
        } catch (error) {
            throw new Error(`Invalid planting_date_str format. Use YYYY-MM-DD. Error: ${error.message}`);
        }
        

        // 1. Get Estimated Yield (from CropPlannerService or default)
        let estimatedYieldKgPerHa = 0.0;
        const cropRecommendations = this.cropPlannerService.get_crop_recommendations(
            district_name,
            actual_area_planted_ha, // Pass farmer's area for a dummy query, though logic focuses on crop yield
            1, // Only need data for the specific crop
            null // Consider all seasons for yield estimation if not specified by caller
        );

        const foundRecommendation = cropRecommendations.find(rec => rec.CropName === crop_name);
        if (foundRecommendation) {
            estimatedYieldKgPerHa = foundRecommendation.Estimated_Yield_Kg_per_Ha;
        } else {
            console.warn(`Warning: Could not get specific yield for '${crop_name}' in '${district_name}' from CropPlannerService. Using default.`);
            estimatedYieldKgPerHa = this.defaultYields[crop_name] || 500.0;
        }

        if (estimatedYieldKgPerHa === 0) {
            throw new Error(`Unable to estimate yield for '${crop_name}' in '${district_name}'. Estimated yield is 0.`);
        }

        // 2. Estimated Total Production
        const estimatedTotalProductionKg = actual_area_planted_ha * estimatedYieldKgPerHa;

        // 3. Estimated Market Price per Kg (from MarketDemandService or default)
        let estimatedPricePerKgRwf = 0.0;
        const marketDemandInsights = this.marketDemandService.get_market_demand_insights(
            district_name,
            'District',
            1,
            'value' // Prioritize value to get a price
        );

        const foundDemand = marketDemandInsights.find(demand => demand.CropName === crop_name);
        if (foundDemand && foundDemand.Total_Weighted_Consumption_Qty_Kg > 0) {
            estimatedPricePerKgRwf = foundDemand.Total_Weighted_Consumption_Value_Rwf / foundDemand.Total_Weighted_Consumption_Qty_Kg;
        } else {
            console.warn(`Warning: Could not get specific market price for '${crop_name}' in '${district_name}' from MarketDemandService. Using default.`);
            estimatedPricePerKgRwf = this.defaultPrices[crop_name] || 200.0;
        }

        if (estimatedPricePerKgRwf === 0) {
            throw new Error(`Unable to estimate market price for '${crop_name}' in '${district_name}'. Estimated price is 0.`);
        }

        // 4. Estimated Revenue
        const estimatedRevenueRwf = estimatedTotalProductionKg * estimatedPricePerKgRwf;

        // 5. Estimated Harvest Date (simplified based on fixed days to maturity)
        const maturityDays = this.daysToMaturity[crop_name] || 90;
        const estimatedHarvestDate = new Date(plantingDate);
        estimatedHarvestDate.setDate(plantingDate.getDate() + maturityDays);

        return {
            CropName: crop_name,
            Actual_Area_Planted_ha: parseFloat(actual_area_planted_ha.toFixed(2)),
            Planting_Date: planting_date_str,
            Estimated_Yield_Kg_per_Ha: parseFloat(estimatedYieldKgPerHa.toFixed(2)),
            Estimated_Total_Production_Kg: parseFloat(estimatedTotalProductionKg.toFixed(2)),
            Estimated_Price_Per_Kg_Rwf: parseFloat(estimatedPricePerKgRwf.toFixed(2)),
            Estimated_Revenue_Rwf: parseFloat(estimatedRevenueRwf.toFixed(2)),
            Estimated_Harvest_Date: estimatedHarvestDate.toISOString().split('T')[0] // Format to YYYY-MM-DD
        };
    }
}


// --- Data Loading Utility ---
function loadCsv(filePath) {
    return new Promise((resolve, reject) => {
        const records = [];
        fs.createReadStream(filePath)
            .pipe(parse({
                columns: true,
                skip_empty_lines: true
            }))
            .on('data', (record) => records.push(record))
            .on('end', () => {
                console.log(`Loaded ${records.length} records from ${path.basename(filePath)}`);
                resolve(records);
            })
            .on('error', (err) => reject(err));
    });
}

// --- Service Instances (Singleton) ---
let cropPlannerServiceInstance;
let marketDemandServiceInstance;
let marketConnectionServiceInstance;
let harvestTrackerServiceInstance;

const initAnalyticsServices = async () => {
    try {
        console.log('Initializing analytics services...');
        const sasData = await loadCsv(path.join(baseDataFolder, 'farmlytics_sas_production_cleaned_aggregated.csv'));
        cropPlannerServiceInstance = new CropPlannerService(sasData);

        const eicvData = await loadCsv(path.join(baseDataFolder, 'farmlytics_eicv_consumption_cleaned_aggregated.csv'));
        marketDemandServiceInstance = new MarketDemandService(eicvData);

        const establishmentData = await loadCsv(path.join(baseDataFolder, 'farmlytics_establishment_census_cleaned.csv'));
        marketConnectionServiceInstance = new MarketConnectionService(establishmentData);

        harvestTrackerServiceInstance = new HarvestTrackerService(cropPlannerServiceInstance, marketDemandServiceInstance);

        console.log('All analytics services initialized successfully.');
    } catch (error) {
        console.error('CRITICAL ERROR: Failed to load analytics data or initialize services:', error.message);
        process.exit(1); // Exit if critical data cannot be loaded
    }
};

module.exports = {
    init: initAnalyticsServices,
    getCropPlannerService: () => cropPlannerServiceInstance,
    getMarketDemandService: () => marketDemandServiceInstance,
    getMarketConnectionService: () => marketConnectionServiceInstance,
    getHarvestTrackerService: () => harvestTrackerServiceInstance
};