import { Link } from 'react-router-dom'
import { useAudioUsage } from '../hooks/useAudio'
import { EmptyState } from '../components/common/EmptyState'
import { Skeleton } from '../components/common/SkeletonLoader'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { Card, CardBody, CardHeader } from '../components/ui/Card'
import { Headphones, Wand2, Play, AlertTriangle } from 'lucide-react'

export function AudioLibraryPage() {
  const { usage, isLoading } = useAudioUsage()

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Audio Library</h1>
          <p className="text-sm text-surface-500">Manage your AI audiobooks and conversions</p>
        </div>
        <Link to="/audio/convert">
          <Button>
            <Wand2 className="h-4 w-4" /> New Conversion
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>Usage</CardHeader>
        <CardBody>
          {isLoading && <Skeleton className="h-20 w-full rounded-lg" />}
          {!isLoading && usage && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-surface-700">Plan</span>
                <Badge variant={usage.plan === 'PREMIUM' ? 'success' : 'default'}>{usage.plan}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-surface-700">Conversions used</span>
                <span className="text-sm text-surface-800">{usage.used} / {usage.totalAllowed}</span>
              </div>
              <div className="h-2 w-full rounded-full bg-surface-100">
                <div
                  className="h-2 rounded-full bg-primary-500 transition-all"
                  style={{ width: `${(usage.used / usage.totalAllowed) * 100}%` }}
                />
              </div>
              {usage.plan === 'FREE' && usage.remaining === 0 && (
                <div className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800 border border-amber-200">
                  <AlertTriangle className="inline h-3.5 w-3.5 mr-1" />
                  You've used all free conversions.{' '}
                  <Link to="/subscription" className="font-semibold underline">Upgrade to Premium</Link>.
                </div>
              )}
            </div>
          )}
        </CardBody>
      </Card>

      <EmptyState
        icon={Headphones}
        title="Your audiobooks"
        description="Converted audiobooks will appear here. Start by converting a book."
        action={
          <Link to="/audio/convert">
            <Button variant="outline">
              <Play className="h-4 w-4" /> Convert a book
            </Button>
          </Link>
        }
      />
    </div>
  )
}
