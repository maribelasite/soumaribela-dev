import AdminPageClient from './AdminPageClient'
import { requireAdminPage } from '@/core/lib/admin-access'

export default async function Page() {
  await requireAdminPage()
  return <AdminPageClient />
}
