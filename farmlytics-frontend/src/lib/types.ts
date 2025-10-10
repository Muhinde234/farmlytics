export type UserRole='FARMER'|'BUYER'

export interface User{
    firstName:string;
    lastName:string;
    email:string;
    role:UserRole;
}


export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  role:UserRole;
  password: string;
}


export interface VerifyEmailRequest {
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  accessToken: string;
  user: LocalStorageUser;
  expiresIn: number;
}
export interface MessageResponse {
  message: string;
}
export interface ApiError {
  type: string;
  title: string;
  status: number;
  detail: string;
  timestamp: string;
  instance: string;
  violations?: ValidationError[];
}
export interface ValidationError {
  field: string;
  message: string;
  rejectedValue: string;
  code: string;
}


export interface RoleStatsResponse {
  roleCounts: Record<UserRole, number>;
}

export interface CropPlan {
  _id: string;
  user: string;
  cropName: string;
  districtName: string;
  actualAreaPlantedHa: number;
  plantingDate: string;
  estimatedHarvestDate?: string;
  estimatedYieldKgPerHa?: number;
  estimatedTotalProductionKg?: number;
  estimatedPricePerKgRwf?: number;
  estimatedRevenueRwf?: number;
  actualHarvestDate?: string;
  actualYieldKgPerHa?: number;
  actualTotalProductionKg?: number;
  actualSellingPricePerKgRwf?: number;
  actualRevenueRwf?: number;
  harvestNotes?: string;
  status: string;
  createdAt?: string;
}

export interface CreateCropPlanDTO {
  cropName: string;
  districtName: string;
  actualAreaPlantedHa: number;
  plantingDate: string;
  status: string;
}

export interface RecordHarvestDTO {
  actualHarvestDate: string;
  actualYieldKgPerHa: number;
  actualSellingPricePerKgRwf: number;
  harvestNotes?: string;
}




export interface ApiResponse<T> {
  success: boolean;
  data: T;
}
export interface Crop {
  CropName: string;
  Recommended_Area_ha: number;
  Estimated_Yield_Kg_per_Ha: number;
  Estimated_Total_Production_Kg: number;
}

export interface CropListResponse {
  success: boolean;
  data: Crop[];
}

// src/lib/types.ts
export interface LocalStorageUser {
  id: string;
  email?: string;
  phone?: string;
  name?: string;
  fullName?: string; // ✅ Add this line
  district?: string;
  sector?: string;
  farmSize?: string;
  language?: "en" | "fr" | "rw";
   role?: UserRole;
  createdAt?: string;
  updatedAt?: string
}
export interface District {
  id: number | string
  code: string
  name: string
}

export interface Crop {
  id: number | string
  name?: string
  CropName: string
  MVP?: number
  [key: string]: any
}

export interface MarketDemand {
  id: string
  crop: string
  demandLevel: number
  expectedPrice: number
  region: string
}

export interface Cooperative {
  id: string
  name: string
  location: string
  contact: string
}

export interface Buyer {
  id: string
  name: string
  product: string
  location: string
}

export interface Exporter {
  id: string
  name: string
  country: string
  contact: string
}
