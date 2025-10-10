const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse'); 

const baseDataFolder = path.join(__dirname, '../../data/Cleaned_Aggregated_CSVs'); 
// --- CropPlannerService (JavaScript adaptation of CropPlannerModel, now using historical data) ---
class CropPlannerService {
    constructor(historicalData) {
        this.historicalData = historicalData;
        this.historicalData.forEach(row => {
            row.Year = parseInt(row.Year) || 0;
            row.Avg_Area_ha = parseFloat(row.Avg_Area_ha) || 0;
            row.Avg_Yield_Kg_per_Ha = parseFloat(row.Avg_Yield_Kg_per_Ha) || 0;
            row.Total_Production_Kg = parseFloat(row.Total_Production_Kg) || 0;
            row.Num_Observations = parseInt(row.Num_Observations) || 0;
        });
        // Filter out records with no meaningful area or production
        this.historicalData = this.historicalData.filter(row => row.Avg_Area_ha > 0 && row.Total_Production_Kg > 0);
        console.log(`CropPlannerService initialized with ${this.historicalData.length} historical SAS records.`);
    }

    // get_crop_recommendations updated to optionally consider historical year and season
    get_crop_recommendations(district_name, farm_size_ha, top_n = 3, season = null, year = null) {
        let relevantData = this.historicalData.filter(row => row.DistrictName === district_name);

        if (relevantData.length === 0) {
            return []; 
        }

        // Filter by specific year if provided
        if (year) {
            const yearSpecificData = relevantData.filter(row => row.Year === year);
            if (yearSpecificData.length > 0) {
                relevantData = yearSpecificData;
            } else {
                console.warn(`Falling back to all available years for ${district_name} as no data for Year ${year}.`);
                // If specific year has no data, fall back to overall data for the district
            }
        } else {
            // If no specific year, use the most recent year's data for recommendations by default
            const mostRecentYear = Math.max(...relevantData.map(row => row.Year));
            relevantData = relevantData.filter(row => row.Year === mostRecentYear);
            console.log(`Using data from most recent year (${mostRecentYear}) for recommendations in ${district_name}.`);
        }

      
        if (season) {
            const seasonSpecificData = relevantData.filter(row => row.Season === season);
            if (seasonSpecificData.length > 0) {
                relevantData = seasonSpecificData;
            } else {
                console.warn(`Falling back to all seasons for ${district_name} in Year ${year || 'most recent'} as no data for Season ${season}.`);
                // If specific season has no data for the year/district, fall back to all seasons for that year/district
            }
        }

        
        const aggregatedMap = new Map();
        relevantData.forEach(row => {
            if (!aggregatedMap.has(row.CropName)) {
                aggregatedMap.set(row.CropName, {
                    CropName: row.CropName,
                    Avg_Area_ha_Sum: 0,
                    Avg_Yield_Kg_per_Ha_Sum: 0,
                    Total_Production_Kg_Sum: 0,
                    Observation_Count: 0,
                });
            }
            const agg = aggregatedMap.get(row.CropName);
            agg.Avg_Area_ha_Sum += row.Avg_Area_ha;
            agg.Avg_Yield_Kg_per_Ha_Sum += row.Avg_Yield_Kg_per_Ha;
            agg.Total_Production_Kg_Sum += row.Total_Production_Kg;
            agg.Observation_Count++; 
        });

        let districtDataAgg = Array.from(aggregatedMap.values()).map(agg => ({
            CropName: agg.CropName,
            Avg_Area_ha: agg.Avg_Area_ha_Sum / agg.Observation_Count,
            Avg_Yield_Kg_per_Ha: agg.Avg_Yield_Kg_per_Ha_Sum / agg.Observation_Count,
            Total_Overall_Production_Kg: agg.Total_Production_Kg_Sum, 
        }));

        
        districtDataAgg = districtDataAgg.filter(row => row.Avg_Area_ha > 0.01 && row.Avg_Yield_Kg_per_Ha > 0);
        
        
        districtDataAgg.sort((a, b) => b.Avg_Yield_Kg_per_Ha - a.Avg_Yield_Kg_per_Ha);

        const recommendedCrops = districtDataAgg.slice(0, top_n);

        if (recommendedCrops.length === 0) {
            return []; 
        }

        
        const totalHistoricalAreaForTopCrops = recommendedCrops.reduce((sum, crop) => sum + crop.Avg_Area_ha, 0);

        return recommendedCrops.map(crop => {
            let allocatedArea;
            if (totalHistoricalAreaForTopCrops === 0) {
                
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

    // New: get_yield_trends_historical (uses the full historical SAS data)
    get_yield_trends_historical(district_name, crop_name, year_start = null, year_end = null) {
        let trendsData = this.historicalData.filter(row => 
            row.DistrictName === district_name && row.CropName === crop_name
        );

        if (year_start) {
            trendsData = trendsData.filter(row => row.Year >= year_start);
        }
        if (year_end) {
            trendsData = trendsData.filter(row => row.Year <= year_end);
        }

        // Aggregate by Year and Crop (and Season if needed, but for overall trend, sum across seasons)
        const aggregatedMap = new Map();
        trendsData.forEach(row => {
            const key = `${row.Year}-${row.CropName}`;
            if (!aggregatedMap.has(key)) {
                aggregatedMap.set(key, {
                    Year: row.Year,
                    CropName: row.CropName,
                    Total_Production_Kg_Sum: 0,
                    Avg_Yield_Kg_per_Ha_Sum: 0,
                    Observation_Count: 0, 
                    Total_Area_ha_Sum: 0
                });
            }
            const agg = aggregatedMap.get(key);
            agg.Total_Production_Kg_Sum += row.Total_Production_Kg;
            agg.Avg_Yield_Kg_per_Ha_Sum += row.Avg_Yield_Kg_per_Ha * row.Avg_Area_ha; 
            agg.Total_Area_ha_Sum += row.Avg_Area_ha;
            agg.Observation_Count++;
        });

        return Array.from(aggregatedMap.values()).map(agg => ({
            year: agg.Year,
            crop: agg.CropName,
            district: district_name,
            average_yield_kg_per_ha: parseFloat((agg.Avg_Yield_Kg_per_Ha_Sum / agg.Total_Area_ha_Sum).toFixed(2)) || 0,
            total_production_kg: parseFloat(agg.Total_Production_Kg_Sum.toFixed(2)),
        })).sort((a, b) => a.year - b.year);
    }
}

// --- MarketDemandService (JavaScript adaptation of MarketDemandModel, now using historical data) ---
class MarketDemandService {
    constructor(historicalData) {
        this.historicalData = historicalData;
        this.historicalData.forEach(row => {
            row.Year = parseInt(row.Year) || 0;
            row.Total_Weighted_Consumption_Qty_Kg = parseFloat(row.Total_Weighted_Consumption_Qty_Kg) || 0;
            row.Total_Weighted_Consumption_Value_Rwf = parseFloat(row.Total_Weighted_Consumption_Value_Rwf) || 0;
            row.Num_Households_Observed = parseInt(row.Num_Households_Observed) || 0;
        });
        this.historicalData = this.historicalData.filter(row => row.Total_Weighted_Consumption_Qty_Kg > 0 || row.Total_Weighted_Consumption_Value_Rwf > 0);
        console.log(`MarketDemandService initialized with ${this.historicalData.length} historical EICV records.`);
    }
    get_market_demand_insights(location_name, location_type = 'District', top_n = 5, sort_by = 'quantity', year = null) {
        let demandData;
        let filteredByLocation = [];

        if (location_type === 'District') {
            filteredByLocation = this.historicalData.filter(row => row.DistrictName === location_name);
        } else if (location_type === 'Province') {
            filteredByLocation = this.historicalData.filter(row => row.ProvinceName === location_name);
        } else {
            throw new Error("location_type must be 'District' or 'Province'.");
        }

        if (filteredByLocation.length === 0) {
            return [];
        }

        // Filter by specific year if provided
        if (year) {
            const yearSpecificData = filteredByLocation.filter(row => row.Year === year);
            if (yearSpecificData.length > 0) {
                demandData = yearSpecificData;
            } else {
                console.warn(`Falling back to all available years for ${location_name} as no data for Year ${year}.`);

                demandData = filteredByLocation;
            }
        } else {
            const mostRecentYear = Math.max(...filteredByLocation.map(row => row.Year));
            demandData = filteredByLocation.filter(row => row.Year === mostRecentYear);
            console.log(`Using data from most recent year (${mostRecentYear}) for demand insights in ${location_name}.`);
        }


        // Aggregate demand data (sum across different records within the filtered set)
        const aggregatedMap = new Map();
        demandData.forEach(row => {
            if (!aggregatedMap.has(row.CropName)) {
                aggregatedMap.set(row.CropName, {
                    CropName: row.CropName,
                    Total_Weighted_Consumption_Qty_Kg: 0,
                    Total_Weighted_Consumption_Value_Rwf: 0,
                });
            }
            const agg = aggregatedMap.get(row.CropName);
            agg.Total_Weighted_Consumption_Qty_Kg += row.Total_Weighted_Consumption_Qty_Kg;
            agg.Total_Weighted_Consumption_Value_Rwf += row.Total_Weighted_Consumption_Value_Rwf;
        });
        
        let sortedDemand = Array.from(aggregatedMap.values()); 

        if (sortedDemand.length === 0) {
            return [];
        }

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

    //  get_demand_trends_historical (uses the full historical EICV data)
    get_demand_trends_historical(location_name, location_type = 'District', crop_name, year_start = null, year_end = null) {
        let trendsData = [];

        if (location_type === 'District') {
            trendsData = this.historicalData.filter(row => row.DistrictName === location_name && row.CropName === crop_name);
        } else if (location_type === 'Province') {
            trendsData = this.historicalData.filter(row => row.ProvinceName === location_name && row.CropName === crop_name);
        } else {
            throw new Error("location_type must be 'District' or 'Province'.");
        }

        if (year_start) {
            trendsData = trendsData.filter(row => row.Year >= year_start);
        }
        if (year_end) {
            trendsData = trendsData.filter(row => row.Year <= year_end);
        }

        // Aggregate by Year and Crop for trends
        const aggregatedMap = new Map();
        trendsData.forEach(row => {
            const key = `${row.Year}-${row.CropName}`;
            if (!aggregatedMap.has(key)) {
                aggregatedMap.set(key, {
                    Year: row.Year,
                    CropName: row.CropName,
                    Total_Weighted_Consumption_Qty_Kg_Sum: 0,
                    Total_Weighted_Consumption_Value_Rwf_Sum: 0,
                });
            }
            const agg = aggregatedMap.get(key);
            agg.Total_Weighted_Consumption_Qty_Kg_Sum += row.Total_Weighted_Consumption_Qty_Kg;
            agg.Total_Weighted_Consumption_Value_Rwf_Sum += row.Total_Weighted_Consumption_Value_Rwf;
        });

        return Array.from(aggregatedMap.values()).map(agg => ({
            year: agg.Year,
            crop: agg.CropName,
            location: location_name,
            location_type: location_type,
            total_weighted_consumption_qty_kg: parseFloat(agg.Total_Weighted_Consumption_Qty_Kg_Sum.toFixed(0)),
            total_weighted_consumption_value_rwf: parseFloat(agg.Total_Weighted_Consumption_Value_Rwf_Sum.toFixed(0)),
        })).sort((a, b) => a.year - b.year);
    }
}

class MarketConnectionService {
    constructor(data) {
        this.data = data;
        this.data.forEach(row => {
            row.Total_workers = parseInt(row.Total_workers) || 0;
            row.Annual_Turnover_2022 = parseFloat(row.Annual_Turnover_2022) || 0;
            row.Employed_Capital = parseFloat(row.Employed_Capital) || 0;
            row.Is_Agriculture_Related = parseInt(row.Is_Agriculture_Related) || 0;
            row.Is_Food_Processing_Related = parseInt(row.Is_Food_Processing_Related) || 0;
            row.Is_Food_Trade_Related = parseInt(row.Is_Food_Trade_Related) || 0;
            row.Is_Exporter_Goods = parseInt(row.Is_Exporter_Goods) || 0;
        });
        console.log(`MarketConnectionService initialized with ${this.data.length} establishment census records.`);
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
class HarvestTrackerService {
    constructor(cropPlannerService, marketDemandService) {
        this.cropPlannerService = cropPlannerService;
        this.marketDemandService = marketDemandService;
       
        this.defaultYields = {
            "Maize": 700.0, "Beans": 1500.0, "Irish potatoes": 10000.0,
            "Cassava": 15000.0, "Tomatoes": 20000.0
        };
        this.defaultPrices = {
            "Maize": 350.0, "Beans": 500.0, "Irish potatoes": 250.0,
            "Cassava": 100.0, "Tomatoes": 400.0
        };
        this.daysToMaturity = {
            "Maize": 120, 
            "Beans": 90,  
            "Irish potatoes": 100,
            "Cassava": 365,
            "Tomatoes": 75  
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
        

        // 1. Get Estimated Yield 
        let estimatedYieldKgPerHa = 0.0;
        const cropRecommendations = this.cropPlannerService.get_crop_recommendations(
            district_name,
            actual_area_planted_ha,
            1, 
            null 
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

        // 3. Estimated Market Price per Kg
        let estimatedPricePerKgRwf = 0.0;
        const marketDemandInsights = this.marketDemandService.get_market_demand_insights(
            district_name,
            'District',
            1,
            'value'
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

        // 5. Estimated Harvest Date 
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
            Estimated_Harvest_Date: estimatedHarvestDate.toISOString().split('T')[0]
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
        
        // Load historical SAS data
        const historicalSasData = await loadCsv(path.join(baseDataFolder, 'farmlytics_sas_production_cleaned_aggregated_historical.csv'));
        cropPlannerServiceInstance = new CropPlannerService(historicalSasData);

        // Load historical EICV data
        const historicalEicvData = await loadCsv(path.join(baseDataFolder, 'farmlytics_eicv_consumption_cleaned_aggregated_historical.csv'));
        marketDemandServiceInstance = new MarketDemandService(historicalEicvData);

        // Load establishment data 
        const establishmentData = await loadCsv(path.join(__dirname, '../../data', 'farmlytics_establishment_census_cleaned.csv'));
        marketConnectionServiceInstance = new MarketConnectionService(establishmentData);

        harvestTrackerServiceInstance = new HarvestTrackerService(cropPlannerServiceInstance, marketDemandServiceInstance);

        console.log('All analytics services initialized successfully with historical data.');
    } catch (error) {
        console.error('CRITICAL ERROR: Failed to load analytics data or initialize services:', error.message);
        process.exit(1); 
    }
};

module.exports = {
    init: initAnalyticsServices,
    getCropPlannerService: () => cropPlannerServiceInstance,
    getMarketDemandService: () => marketDemandServiceInstance,
    getMarketConnectionService: () => marketConnectionServiceInstance,
    getHarvestTrackerService: () => harvestTrackerServiceInstance
};