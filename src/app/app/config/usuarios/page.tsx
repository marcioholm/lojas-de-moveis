import { createClient } from '@/utils/supabase/server'
import { inviteUser } from './actions'
import { Users, Shield, UserPlus } from 'lucide-react'
import { InviteForm } from './InviteForm'

const roleLabels: Record<string, string> = {
  dono: 'Dono / Admin',
  vendedor: 'Vendedor(a)',
  caixa: 'Caixa',
  estoquista: 'Estoquista',
  entregador: 'Entregador(a)',
}

const roleColors: Record<string, string> = {
  dono: 'bg-purple-100 text-purple-700',
  vendedor: 'bg-blue-100 text-blue-700',
  caixa: 'bg-green-100 text-green-700',
  estoquista: 'bg-orange-100 text-orange-700',
  entregador: 'bg-gray-100 text-gray-700',
}

export default async function UsuariosPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  // Get current user's profile and tenant
  const { data: currentProfile } = await supabase
    .from('profiles')
    .select('tenant_id, role')
    .eq('id', user.id)
    .single()

  if (!currentProfile?.tenant_id) {
    return (
      <div className="p-8 text-center text-gray-500">
        Perfil não encontrado. Complete o onboarding primeiro.
      </div>
    )
  }

  // Fetch all team members from this tenant
  const { data: teamMembers } = await supabase
    .from('profiles')
    .select('id, nome, email, role, telefone, created_at')
    .eq('tenant_id', currentProfile.tenant_id)
    .order('created_at', { ascending: true })

  const isOwner = currentProfile.role === 'dono'

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-[var(--primary)]/10 text-[var(--primary)] rounded-lg flex items-center justify-center">
          <Users size={20} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Equipe e Acessos</h1>
          <p className="text-gray-500 text-sm mt-0.5">Gerencie quem tem acesso ao painel da sua loja.</p>
        </div>
      </div>

      {isOwner && (
        <InviteForm />
      )}

      {/* Team Members List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Usuários Ativos</h2>
          <span className="text-xs text-gray-500">{teamMembers?.length || 0} membro{(teamMembers?.length || 0) !== 1 ? 's' : ''}</span>
        </div>

        {teamMembers && teamMembers.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {teamMembers.map((member) => (
              <div key={member.id} className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[var(--primary)] text-white flex items-center justify-center font-bold text-sm">
                    {member.nome?.substring(0, 2).toUpperCase() || '??'}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">
                      {member.nome}
                      {member.id === user.id && (
                        <span className="ml-2 text-xs text-gray-400">(você)</span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">{member.email}</div>
                    {member.telefone && (
                      <div className="text-xs text-gray-400">{member.telefone}</div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${roleColors[member.role] || 'bg-gray-100 text-gray-700'}`}>
                    {roleLabels[member.role] || member.role}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500 text-sm">
            Nenhum usuário encontrado.
          </div>
        )}
      </div>
    </div>
  )
}
