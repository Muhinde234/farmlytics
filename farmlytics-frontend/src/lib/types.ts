export type UserRole = 'FARMER' | 'BUYER'

// ─── Auth ────────────────────────────────────────────────────────────────────

export interface RegisterRequest {
  firstName: string
  lastName: string
  email: string
  role: UserRole
  password: string
}

export interface VerifyEmailRequest {
  token: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  message: string
  accessToken: string
  user: LocalStorageUser
  expiresIn: number
}

export interface MessageResponse {
  message: string
}

export interface ApiError {
  type: string
  title: string
  status: number
  detail: string
  timestamp: string
  instance: string
  violations?: ValidationError[]
}

export interface ValidationError {
  field: string
  message: string
  rejectedValue: string
  code: string
}

export interface RoleStatsResponse {
  roleCounts: Record<UserRole, number>
}

// ─── User ────────────────────────────────────────────────────────────────────

export interface LocalStorageUser {
  id: string
  email?: string
  phone?: string
  name?: string
  fullName?: string
  district?: string
  sector?: string
  farmSize?: string
  language?: 'en' | 'fr' | 'rw'
  role?: UserRole
  createdAt?: string
  updatedAt?: string
}

// ─── Crop Plans ──────────────────────────────────────────────────────────────

export interface CropPlan {
  _id: string
  user: string
  cropName: string
  districtName: string
  actualAreaPlantedHa: number
  plantingDate: string
  estimatedHarvestDate?: string
  estimatedYieldKgPerHa?: number
  estimatedTotalProductionKg?: number
  estimatedPricePerKgRwf?: number
  estimatedRevenueRwf?: number
  actualHarvestDate?: string
  actualYieldKgPerHa?: number
  actualTotalProductionKg?: number
  actualSellingPricePerKgRwf?: number
  actualRevenueRwf?: number
  harvestNotes?: string
  status: string
  createdAt?: string
}

export interface CreateCropPlanDTO {
  cropName: string
  districtName: string
  actualAreaPlantedHa: number
  plantingDate: string
  status: string
}

export interface RecordHarvestDTO {
  actualHarvestDate: string
  actualYieldKgPerHa: number
  actualSellingPricePerKgRwf: number
  harvestNotes?: string
}

// ─── Crop Recommendations ────────────────────────────────────────────────────

export interface CropRecommendation {
  CropName: string
  Recommended_Area_ha: number
  Estimated_Yield_Kg_per_Ha: number
  Estimated_Total_Production_Kg: number
}

// ─── Reference Data ──────────────────────────────────────────────────────────

/** Returned by /crops/list */
export interface CropRef {
  name: string
  averageMaturityDays: number
}

export interface CropListResponse {
  success: boolean
  data: CropRef[]
}

export interface District {
  id?: number | string
  code: number | string
  name: string
}

export interface Province {
  code: number | string
  name: string
}

// ─── Market ──────────────────────────────────────────────────────────────────

/** /market/demand */
export interface MarketConsumption {
  CropName: string
  Total_Weighted_Consumption_Qty_Kg: number
  Total_Weighted_Consumption_Value_Rwf: number
}

/** /market/cooperatives, /market/exporters, partial of buyers */
export interface BusinessEntity {
  ISIC_Section_Name: string
  Total_workers: number
  Annual_Turnover_2022: number
  Employed_Capital: number
}

/** /market/buyers-processors */
export interface BuyersProcessorsResponse {
  Potential_Buyers: BusinessEntity[]
  Food_Processors: BusinessEntity[]
}

// ─── ML Predictions ──────────────────────────────────────────────────────────

export interface YieldPredictionRequest {
  district: string
  crop: string
}

export interface YieldPredictionResponse {
  predicted_yield_kg_per_ha: number
  confidence: number
  factors_considered: { district: string; crop: string }
  message: string
}

export interface DiseaseRiskRequest {
  district: string
  crop: string
  season?: string
}

export interface DiseaseRiskResponse {
  prediction: string
  risk_score: number
  common_diseases_pests: string[]
  preventive_measures: string[]
  message: string
}

export interface PlantingWindowRequest {
  district: string
  crop: string
}

export interface PlantingWindowResponse {
  optimal_start_date: string
  optimal_end_date: string
  rationale: string
  message: string
}

// ─── Notifications ────────────────────────────────────────────────────────────

export interface SendNotificationRequest {
  deviceToken: string
  title: string
  body: string
  data?: Record<string, string>
  sendToAdminSelf?: boolean
}

export interface SendNotificationResponse {
  success: boolean
  message: string
  details: { data: string[] }
}

// ─── Shared ───────────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean
  data: T
}
