import { usePlans, useCurrentSubscription, useCheckout } from '../hooks/useSubscription'
import { useToast } from '../components/common/Toast'
import { EmptyState } from '../components/common/EmptyState'
import { Skeleton } from '../components/common/SkeletonLoader'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card, CardBody, CardHeader } from '../components/ui/Card'
import { CheckCircle, CreditCard, Zap } from 'lucide-react'
import { formatDate } from '../utils/formatters'

export function SubscriptionPage() {
  const { showToast } = useToast()
  const { plans, isLoading: plansLoading } = usePlans()
  const { subscription, isLoading: subLoading } = useCurrentSubscription()
  const { checkout, isLoading: checkoutLoading } = useCheckout()

  const handleSubscribe = async (planId: string) => {
    try {
      await checkout({
        planId,
        returnUrl: `${window.location.origin}/subscription`,
        cancelUrl: `${window.location.origin}/subscription`,
      })
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Checkout failed', 'error')
    }
  }

  const isLoading = plansLoading || subLoading

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-surface-900">Subscription</h1>
        <p className="text-sm text-surface-500">Manage your plan and billing</p>
      </div>

      {subscription && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100">
                  <Zap className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-surface-800">Current Plan</h2>
                  <p className="text-sm text-surface-500">{subscription.planName}</p>
                </div>
              </div>
              <Badge variant={subscription.status === 'ACTIVE' ? 'success' : 'warning'}>{subscription.status}</Badge>
            </div>
          </CardHeader>
          <CardBody className="text-sm text-surface-600">
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <p className="text-xs text-surface-500">Started</p>
                <p className="font-medium text-surface-800">{formatDate(subscription.startDate)}</p>
              </div>
              {subscription.renewalDate && (
                <div>
                  <p className="text-xs text-surface-500">Renews</p>
                  <p className="font-medium text-surface-800">{formatDate(subscription.renewalDate)}</p>
                </div>
              )}
            </div>
          </CardBody>
        </Card>
      )}

      <div>
        <h2 className="text-lg font-semibold text-surface-800">Available Plans</h2>
      </div>

      {isLoading && (
        <div className="grid gap-6 sm:grid-cols-2">
          <Skeleton className="h-80 w-full rounded-xl" />
          <Skeleton className="h-80 w-full rounded-xl" />
        </div>
      )}

      {!isLoading && plans.length === 0 && (
        <EmptyState
          icon={CreditCard}
          title="No plans available"
          description="Subscription plans are currently unavailable. Please check back later."
        />
      )}

      {!isLoading && plans.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2">
          {plans.map((plan) => {
            const isCurrent = subscription?.planId === plan.id
            return (
              <Card
                key={plan.id}
                className={isCurrent ? 'ring-2 ring-primary-500' : ''}
              >
                <CardHeader>
                  <div className="flex items-baseline justify-between">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-surface-500">{plan.name}</h3>
                    {isCurrent && <Badge variant="success">Active</Badge>}
                  </div>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-surface-900">
                      ${plan.price}
                    </span>
                    <span className="text-sm text-surface-500">/{plan.billingCycle || 'month'}</span>
                  </div>
                </CardHeader>
                <CardBody className="space-y-4">
                  <ul className="space-y-2">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm text-surface-600">
                        <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {plan.limits && (
                    <div className="rounded-lg bg-surface-50 p-3 text-xs text-surface-600 space-y-1">
                      <p className="font-medium text-surface-800">Limits</p>
                      <p>Audio conversions: {plan.limits.audioConversions}</p>
                      <p>Max upload Info: {plan.limits.maxUploadSizeInfo}</p>
                      <p>Max upload Book: {plan.limits.maxUploadSizeBook}</p>
                      <p>Max upload Graphical: {plan.limits.maxUploadSizeGraphical}</p>
                    </div>
                  )}

                  <Button
                    variant={isCurrent ? 'secondary' : 'primary'}
                    fullWidth
                    isLoading={checkoutLoading && !isCurrent}
                    disabled={isCurrent}
                    onClick={() => handleSubscribe(plan.id)}
                  >
                    {isCurrent ? 'Current Plan' : 'Subscribe'}
                  </Button>
                </CardBody>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
