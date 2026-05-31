import type { Metadata } from 'next'
import { RolesManager } from '@/components/roles/RolesManager'

export const metadata: Metadata = { title: 'Roles & Permissions' }

export default function RolesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Roles & Permissions</h1>
        <p className="text-gray-500 text-sm mt-1">
          Create and manage roles. Control every feature, page, API, and action with granular permissions.
        </p>
      </div>
      <RolesManager />
    </div>
  )
}
