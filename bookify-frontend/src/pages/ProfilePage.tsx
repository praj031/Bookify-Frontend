import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/common/Toast'
import { Card, CardBody, CardHeader } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { User, Mail, Calendar, LogOut, ShieldCheck } from 'lucide-react'
import { formatDate } from '../utils/formatters'

export function ProfilePage() {
  const { user, logout } = useAuth()
  const { showToast } = useToast()

  const handleLogout = () => {
    logout()
    showToast('Logged out successfully', 'info')
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-xl">
        <Card>
          <CardBody>
            <p className="text-center text-sm text-surface-500">Unable to load profile.</p>
          </CardBody>
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-surface-900">Profile</h1>
        <p className="text-sm text-surface-500">Your account information</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-100">
              <User className="h-7 w-7 text-primary-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-surface-900">{user.name}</h2>
              <div className="flex items-center gap-2">
                <Badge variant="info">Active</Badge>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardBody className="space-y-4">
          <div className="flex items-center gap-3 rounded-lg border border-surface-200 bg-surface-50 px-4 py-3">
            <Mail className="h-4 w-4 text-surface-500" />
            <div className="min-w-0">
              <p className="text-xs text-surface-500">Email</p>
              <p className="text-sm font-medium text-surface-800 truncate">{user.username}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-lg border border-surface-200 bg-surface-50 px-4 py-3">
            <ShieldCheck className="h-4 w-4 text-surface-500" />
            <div>
              <p className="text-xs text-surface-500">User ID</p>
              <p className="text-sm font-medium text-surface-800">{user.id}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-lg border border-surface-200 bg-surface-50 px-4 py-3">
            <Calendar className="h-4 w-4 text-surface-500" />
            <div>
              <p className="text-xs text-surface-500">Joined</p>
              <p className="text-sm font-medium text-surface-800">{formatDate(new Date().toISOString())}</p>
            </div>
          </div>
        </CardBody>
      </Card>

      <Card className="border-red-200">
        <CardBody>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-sm font-medium text-surface-800">Account actions</h3>
              <p className="text-xs text-surface-500">Sign out of your account on this device.</p>
            </div>
            <Button variant="danger" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4" /> Log out
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
