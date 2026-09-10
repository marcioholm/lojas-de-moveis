import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import PlanosClient from './PlanosClient'

export default async function PlanosPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/signup')
  }

  // Fetch store to get employee count
  const { data: store } = await supabase
    .from('stores')
    .select('employees')
    .eq('owner_id', user.id)
    .single()

  const employees = store?.employees || ''

  return <PlanosClient employeeRange={employees} />
}
