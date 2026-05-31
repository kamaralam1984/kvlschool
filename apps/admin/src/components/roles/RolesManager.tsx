'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Shield, Edit, Trash2, Users, Lock, Unlock, Check, X } from 'lucide-react'

const PERMISSION_GROUPS = {
  'Students': ['students:view','students:create','students:edit','students:delete','students:export'],
  'Teachers': ['teachers:view','teachers:create','teachers:edit','teachers:delete'],
  'Attendance': ['attendance:view','attendance:mark','attendance:reports'],
  'Examinations': ['exam:view','exam:create','exam:edit','exam:delete','exam:publish','exam:evaluate','exam:analytics'],
  'Finance': ['finance:view','finance:create','finance:collect','finance:reports','finance:refund'],
  'LMS': ['lms:view','lms:create','lms:edit','lms:publish'],
  'Library': ['library:view','library:issue','library:return','library:manage'],
  'Transport': ['transport:view','transport:manage','transport:track'],
  'Hostel': ['hostel:view','hostel:manage','hostel:allocate'],
  'HR & Payroll': ['hr:view','hr:manage','hr:payroll','hr:leave'],
  'E-Commerce': ['store:view','store:manage','store:orders'],
  'AI Center': ['ai:chat','ai:analytics','ai:marketing'],
  'Analytics': ['analytics:view','analytics:export'],
  'Notifications': ['notifications:send','notifications:manage'],
  'Settings': ['settings:view','settings:edit'],
  'Roles': ['roles:view','roles:create','roles:edit','roles:delete'],
}

const DEFAULT_ROLES = [
  { id: '1', name: 'Super Admin', color: '#7b1d1d', isSystem: true, userCount: 2, permissions: Object.values(PERMISSION_GROUPS).flat() },
  { id: '2', name: 'Principal', color: '#1e3a5f', isSystem: true, userCount: 1, permissions: Object.values(PERMISSION_GROUPS).flat().filter(p => !p.includes('roles:delete')) },
  { id: '3', name: 'Admin', color: '#162d4a', isSystem: false, userCount: 3, permissions: ['students:view','students:create','students:edit','attendance:view','attendance:mark','finance:view','finance:create','exam:view','exam:create'] },
  { id: '4', name: 'Accountant', color: '#c9922a', isSystem: false, userCount: 2, permissions: ['finance:view','finance:create','finance:collect','finance:reports','students:view'] },
  { id: '5', name: 'Teacher', color: '#166534', isSystem: false, userCount: 86, permissions: ['students:view','attendance:mark','exam:create','exam:evaluate','lms:create','lms:edit'] },
  { id: '6', name: 'Librarian', color: '#6b21a8', isSystem: false, userCount: 2, permissions: ['library:view','library:issue','library:return','students:view'] },
  { id: '7', name: 'Transport Manager', color: '#92400e', isSystem: false, userCount: 1, permissions: ['transport:view','transport:manage','transport:track','students:view'] },
  { id: '8', name: 'Hostel Manager', color: '#0e7490', isSystem: false, userCount: 1, permissions: ['hostel:view','hostel:manage','hostel:allocate','students:view'] },
]

interface Role {
  id: string
  name: string
  color: string
  isSystem: boolean
  userCount: number
  permissions: string[]
}

export function RolesManager() {
  const [roles, setRoles] = useState<Role[]>(DEFAULT_ROLES)
  const [selected, setSelected] = useState<Role | null>(roles[0])
  const [creating, setCreating] = useState(false)
  const [newRoleName, setNewRoleName] = useState('')
  const [newRoleColor, setNewRoleColor] = useState('#1e3a5f')

  function togglePermission(permission: string) {
    if (!selected || selected.isSystem) return
    setSelected((prev) => {
      if (!prev) return prev
      const has = prev.permissions.includes(permission)
      return { ...prev, permissions: has ? prev.permissions.filter((p) => p !== permission) : [...prev.permissions, permission] }
    })
    setRoles((prev) => prev.map((r) => r.id === selected.id
      ? { ...r, permissions: r.permissions.includes(permission) ? r.permissions.filter(p => p !== permission) : [...r.permissions, permission] }
      : r
    ))
  }

  function toggleGroup(group: string) {
    if (!selected || selected.isSystem) return
    const groupPerms = PERMISSION_GROUPS[group as keyof typeof PERMISSION_GROUPS]
    const allHave = groupPerms.every(p => selected.permissions.includes(p))
    const newPerms = allHave
      ? selected.permissions.filter(p => !groupPerms.includes(p))
      : [...new Set([...selected.permissions, ...groupPerms])]
    setSelected(prev => prev ? { ...prev, permissions: newPerms } : prev)
    setRoles(prev => prev.map(r => r.id === selected.id ? { ...r, permissions: newPerms } : r))
  }

  function createRole() {
    if (!newRoleName.trim()) return
    const newRole: Role = { id: Date.now().toString(), name: newRoleName, color: newRoleColor, isSystem: false, userCount: 0, permissions: [] }
    setRoles(prev => [...prev, newRole])
    setSelected(newRole)
    setCreating(false)
    setNewRoleName('')
  }

  function deleteRole(id: string) {
    setRoles(prev => prev.filter(r => r.id !== id))
    if (selected?.id === id) setSelected(roles[0])
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
      {/* Roles list */}
      <div className="lg:col-span-1 space-y-3">
        <button
          onClick={() => setCreating(true)}
          className="w-full flex items-center gap-2 px-4 py-3 bg-navy-700 text-white rounded-xl text-sm font-medium hover:bg-navy-600 transition-colors"
        >
          <Plus className="w-4 h-4" /> Create New Role
        </button>

        <AnimatePresence>
          {creating && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white border border-gray-200 rounded-xl p-4 space-y-3"
            >
              <input
                value={newRoleName}
                onChange={(e) => setNewRoleName(e.target.value)}
                placeholder="Role name"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-navy-400"
                onKeyDown={(e) => e.key === 'Enter' && createRole()}
              />
              <div className="flex items-center gap-2">
                <input type="color" value={newRoleColor} onChange={(e) => setNewRoleColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer" />
                <span className="text-xs text-gray-500">Role color</span>
              </div>
              <div className="flex gap-2">
                <button onClick={createRole} className="flex-1 py-2 bg-navy-700 text-white rounded-lg text-xs font-medium hover:bg-navy-600 transition-colors">
                  <Check className="w-3.5 h-3.5 inline mr-1" />Create
                </button>
                <button onClick={() => setCreating(false)} className="px-3 py-2 bg-gray-100 rounded-lg text-xs hover:bg-gray-200 transition-colors">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-1.5">
          {roles.map((role) => (
            <button
              key={role.id}
              onClick={() => setSelected(role)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-150 text-left ${
                selected?.id === role.id ? 'bg-navy-50 border border-navy-200' : 'bg-white border border-gray-100 hover:border-gray-200'
              }`}
            >
              <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: role.color }} />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{role.name}</p>
                <p className="text-xs text-gray-400">{role.userCount} users · {role.permissions.length} permissions</p>
              </div>
              {role.isSystem && <Lock className="w-3 h-3 text-gray-300 flex-shrink-0" />}
              {!role.isSystem && (
                <button onClick={(e) => { e.stopPropagation(); deleteRole(role.id) }} className="p-1 hover:text-red-500 text-gray-300 transition-colors">
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Permissions panel */}
      {selected && (
        <div className="lg:col-span-3 bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${selected.color}20` }}>
                <Shield className="w-4 h-4" style={{ color: selected.color }} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{selected.name}</h3>
                <p className="text-xs text-gray-400">{selected.permissions.length} permissions assigned</p>
              </div>
            </div>
            {selected.isSystem && (
              <span className="flex items-center gap-1.5 text-xs text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full">
                <Lock className="w-3 h-3" />
                System role — read only
              </span>
            )}
          </div>

          <div className="p-6 overflow-y-auto max-h-[calc(100vh-300px)]">
            <div className="space-y-6">
              {Object.entries(PERMISSION_GROUPS).map(([group, perms]) => {
                const allGranted = perms.every(p => selected.permissions.includes(p))
                const someGranted = perms.some(p => selected.permissions.includes(p))
                return (
                  <div key={group}>
                    <div className="flex items-center gap-3 mb-3">
                      <button
                        onClick={() => toggleGroup(group)}
                        disabled={selected.isSystem}
                        className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-all ${
                          allGranted ? 'bg-navy-700 border-navy-700' : someGranted ? 'bg-navy-200 border-navy-400' : 'border-gray-200'
                        } disabled:cursor-not-allowed`}
                      >
                        {allGranted && <Check className="w-3 h-3 text-white" />}
                        {someGranted && !allGranted && <div className="w-2 h-0.5 bg-navy-600" />}
                      </button>
                      <h4 className="font-semibold text-gray-700 text-sm">{group}</h4>
                    </div>
                    <div className="flex flex-wrap gap-2 ml-8">
                      {perms.map((perm) => {
                        const granted = selected.permissions.includes(perm)
                        return (
                          <button
                            key={perm}
                            onClick={() => togglePermission(perm)}
                            disabled={selected.isSystem}
                            className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-150 border disabled:cursor-not-allowed ${
                              granted
                                ? 'bg-navy-100 text-navy-800 border-navy-200'
                                : 'bg-gray-50 text-gray-400 border-gray-100 hover:border-gray-200'
                            }`}
                          >
                            {granted && <Check className="w-2.5 h-2.5 inline mr-1" />}
                            {perm.split(':')[1]}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
