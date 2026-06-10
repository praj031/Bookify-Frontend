import { useCallback, useEffect, useState } from 'react'
import type { Plan, Subscription, CheckoutRequest } from '../types/subscription'
import { getPlans, getCurrentSubscription, createCheckoutSession } from '../api/subscriptions'

export function usePlans() {
  const [plans, setPlans] = useState<Plan[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)
    getPlans()
      .then((data) => {
        if (!cancelled) setPlans(data)
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err : new Error('Failed to load plans'))
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return { plans, isLoading, error }
}

export function useCurrentSubscription() {
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const refetch = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getCurrentSubscription()
      setSubscription(data)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load subscription'))
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { subscription, isLoading, error, refetch }
}

export function useCheckout() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const checkout = useCallback(async (payload: CheckoutRequest) => {
    setIsLoading(true)
    setError(null)
    try {
      const { sessionUrl } = await createCheckoutSession(payload)
      window.location.href = sessionUrl
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Checkout failed'))
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { checkout, isLoading, error }
}
