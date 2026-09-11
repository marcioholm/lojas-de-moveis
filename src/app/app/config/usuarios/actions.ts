'use server'

import { createClient } from '@/utils/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'

export async function inviteUser(formData: FormData) {
  const email = formData.get('email') as string
  const nome = formData.get('nome') as string || email.split('@')[0]
  const role = formData.get('role') as string || 'vendedor'
  const telefone = formData.get('telefone') as string || ''

  if (!email) {
    return { error: 'O e-mail é obrigatório' }
  }

  // Get current user's tenant_id
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Usuário não autenticado' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('tenant_id, role')
    .eq('id', user.id)
    .single()

  if (!profile?.tenant_id) return { error: 'Perfil sem tenant associado' }
  if (profile.role !== 'dono') return { error: 'Apenas o dono pode convidar usuários' }

  // Use the service role key to invite users
  const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(email)

  if (error) {
    return { error: error.message }
  }

  // Create profile for the invited user
  if (data?.user) {
    const { error: profileError } = await supabaseAdmin.from('profiles').insert({
      id: data.user.id,
      tenant_id: profile.tenant_id,
      nome,
      email,
      role,
      telefone
    })

    if (profileError) {
      return { error: 'Convite enviado, mas houve erro ao criar o perfil: ' + profileError.message }
    }
  }

  return { success: `Convite enviado com sucesso para ${email} (${role})` }
}
