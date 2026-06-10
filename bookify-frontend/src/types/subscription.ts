export interface Plan {
  id: string
  name: string
  price: number
  currency: string
  billingCycle?: string
  features: string[]
  limits?: {
    audioConversions: number
    maxUploadSizeInfo: string
    maxUploadSizeBook: string
    maxUploadSizeGraphical: string
  }
}

export interface Subscription {
  id: string
  planId: string
  planName: string
  status: 'ACTIVE' | 'CANCELLED' | 'EXPIRED'
  startDate: string
  endDate?: string
  renewalDate?: string
}

export interface CheckoutRequest {
  planId: string
  returnUrl: string
  cancelUrl: string
}

export interface CheckoutResponse {
  sessionUrl: string
}
