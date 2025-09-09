export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  message?: string
  error?: string
}
export interface PaginatedResponse<T = unknown> extends ApiResponse {
  data?: {
    items: T[]
    total: number
    page: number
    limit: number
    totalPages: number
  }
}
export interface User {
  id: string
  name: string
  email: string
  role: 'user' | 'admin'
  createdAt: string
  updatedAt: string
}
export interface AuthResponse {
  accessToken: string
  user: User
}
export interface SignInCredentials {
  email: string
  password: string
}
export interface SignUpCredentials extends SignInCredentials {
  name: string
}
export interface UpdateUserPayload {
  name?: string
  email?: string
  password?: string
}
export interface ChangePasswordPayload {
  currentPassword: string
  newPassword: string
}
export interface FileUploadResponse {
  fileUrl: string
}
export interface HashStringOptions {
  length?: number
  charset?: 'alphanumeric' | 'alphabetic' | 'numeric' | 'hex' | string
}
export interface ColorOptions {
  format?: 'hex' | 'rgb' | 'hsl'
  alpha?: boolean
}
export interface DateTimeOptions {
  locale?: string
  timeZone?: string
  dateStyle?: 'full' | 'long' | 'medium' | 'short'
  timeStyle?: 'full' | 'long' | 'medium' | 'short'
  hour12?: boolean
}
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type Maybe<T> = T | null | undefined;
