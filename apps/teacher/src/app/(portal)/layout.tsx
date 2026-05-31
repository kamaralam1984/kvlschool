import TeacherShell from '@/components/TeacherShell'

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return <TeacherShell>{children}</TeacherShell>
}
