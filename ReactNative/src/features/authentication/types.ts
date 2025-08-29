// Authentication types
export interface AuthUser {
  id: string
  email: string
  name?: string
}

export interface SignInData {
  email: string
  password: string
}

export interface SignUpData {
  email: string
  password: string
  name?: string
}