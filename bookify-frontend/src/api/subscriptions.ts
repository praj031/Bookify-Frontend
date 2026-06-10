import { client } from './client'
import type { CheckoutRequest, CheckoutResponse, Plan, Subscription } from '../types/subscription'

export async function getPlans(): Promise<Plan[]> {
  const { data } = await client.get<Plan[]>('/subscriptions/plans')
  return data
}

export async function subscribeToPlan(planId: string): Promise<Subscription> {
  const { data } = await client.post<Subscription>('/subscriptions/subscribe', { planId })
  return data
}

export async function getCurrentSubscription(): Promise<Subscription | null> {
  try {
    const { data } = await client.get<Subscription>('/subscriptions/me')
    return data
  } catch (error) {
    if (error instanceof Error && error.message.includes('404')) {
      return null
    }
    throw error
  }
}

export async function createCheckoutSession(payload: CheckoutRequest): Promise<CheckoutResponse> {
  const { data } = await client.post<CheckoutResponse>('/payments/checkout', payload)
  return data
}
