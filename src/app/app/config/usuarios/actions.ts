'use server'

import { createClient } from '@supabase/supabase-js'

export async function inviteUser(formData: FormData) {
  const email = formData.get('email') as string

  if (!email) {
    return { error: 'O e-mail é obrigatório' }
  }

  // Use the service role key to invite users (bypasses RLS and allows admin actions)
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(email)

  if (error) {
    return { error: error.message }
  }

  return { success: 'Convite enviado com sucesso para ' + email }
}
