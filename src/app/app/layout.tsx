import { ReactNode } from 'react'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import ClientLayout from './ClientLayout'

export default async function AppLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // Get full profile for the sidebar (nome, role, tenant_id)
  const { data: profile } = await supabase
    .from('profiles')
    .select('tenant_id, nome, role, email')
    .eq('id', user.id)
    .single()

  return (
    <ClientLayout userProfile={profile ? { nome: profile.nome, role: profile.role } : undefined}>
      {children}
    </ClientLayout>
  )
}
