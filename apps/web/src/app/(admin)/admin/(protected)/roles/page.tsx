import { RolesManager } from '@/components/admin/roles/RolesManager'

export default function RolesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Roles & Permissions</h1>
        <p className="text-gray-500 text-sm mt-1">Create unlimited roles. Control every feature, page, API, and action with granular permissions.</p>
      </div>
      <RolesManager />
    </div>
  )
}
