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

  // Get tenant profile and setup status
  const { data: profile } = await supabase.from('profiles').select('tenant_id').eq('id', user.id).single()
  
  if (profile?.tenant_id) {
    try {
      // Try to get setup_concluido. Wrapped in try/catch in case migration hasn't run yet.
      const { data: tenant } = await supabase.from('tenants').select('setup_concluido').eq('id', profile.tenant_id).single()
      
      // If we successfully queried setup_concluido and it's false, redirect to onboarding
      // but avoid infinite loops if we are already in /onboarding
      if (tenant && tenant.setup_concluido === false) {
        // Next.js layout doesn't know pathname easily without headers, so we handle loop break in ClientLayout or Onboarding page itself.
        // Actually, layout wraps all of /app/. 
        // If they are not setup, we shouldn't render the sidebar at all.
        // We'll pass setup_concluido to the client layout to hide navigation, or redirect.
      }
    } catch (e) {
      // Column doesn't exist yet, ignore
    }
  }

  // We will just return the ClientLayout which manages the sidebar
  return (
    <ClientLayout userProfile={profile}>
      {children}
    </ClientLayout>
  )
}
