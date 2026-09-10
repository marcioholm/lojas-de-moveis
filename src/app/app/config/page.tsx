import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { Settings, Save, AlertCircle } from 'lucide-react'

export default async function ConfigPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null

  const { data: profile } = await supabase.from('profiles').select('tenant_id').eq('id', user.id).single()
  
  let tenant: any = null
  if (profile?.tenant_id) {
    try {
      const res = await supabase.from('tenants').select('*').eq('id', profile.tenant_id).single()
      tenant = res.data
    } catch(e) {}
  }

  async function updateConfig(formData: FormData) {
    'use server'
    const db = await createClient()
    const { data: u } = await db.auth.getUser()
    const { data: p } = await db.from('profiles').select('tenant_id').eq('id', u.user?.id).single()
    
    if (p?.tenant_id) {
      await db.from('tenants').update({
        nome: formData.get('nome') as string,
        cnpj: formData.get('cnpj') as string,
        telefone_principal: formData.get('telefone_principal') as string,
        cor_primaria: formData.get('cor_primaria') as string,
        slug: formData.get('slug') as string,
        limite_desconto_padrao: Number(formData.get('limite_desconto_padrao')),
        comissao_padrao: Number(formData.get('comissao_padrao'))
      }).eq('id', p.tenant_id)
      
      revalidatePath('/app/config')
      revalidatePath('/loja/[slug]', 'page')
    }
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="mb-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-[var(--primary)]/10 text-[var(--primary)] rounded-lg flex items-center justify-center">
          <Settings size={20} />
        </div>
        <div>
          <h1 className="text-2xl font-bold font-serif text-[var(--text-primary)]">Configurações da Loja</h1>
          <p className="text-sm text-[var(--text-secondary)]">Gerencie regras de negócio, limites e visual da vitrine</p>
        </div>
      </div>

      {!tenant ? (
        <div className="bg-yellow-50 text-yellow-800 p-4 rounded-lg flex items-center gap-3 border border-yellow-200">
          <AlertCircle size={20} />
          <p>As configurações estarão disponíveis após a aplicação das atualizações de banco de dados.</p>
        </div>
      ) : (
        <form action={updateConfig} className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <h3 className="font-semibold text-gray-800">1. Dados Básicos</h3>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Loja</label>
                <input type="text" name="nome" defaultValue={tenant.nome} required className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-[var(--primary)] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CNPJ</label>
                <input type="text" name="cnpj" defaultValue={tenant.cnpj} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-[var(--primary)] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp (Principal)</label>
                <input type="text" name="telefone_principal" defaultValue={tenant.telefone_principal} required className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-[var(--primary)] outline-none" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <h3 className="font-semibold text-gray-800">2. Regras de Negócio e PDV</h3>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Limite de Desconto (%)</label>
                <p className="text-xs text-gray-500 mb-2">Pedidos acima desse limite exigirão aprovação.</p>
                <input type="number" step="0.01" name="limite_desconto_padrao" defaultValue={tenant.limite_desconto_padrao || 10} required className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-[var(--primary)] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Comissão Padrão (%)</label>
                <p className="text-xs text-gray-500 mb-2">Aplicado sobre o valor final dos pedidos.</p>
                <input type="number" step="0.01" name="comissao_padrao" defaultValue={tenant.comissao_padrao || 5} required className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-[var(--primary)] outline-none" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <h3 className="font-semibold text-gray-800">3. Vitrine Pública</h3>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug (URL)</label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                    /loja/
                  </span>
                  <input type="text" name="slug" defaultValue={tenant.slug} required className="flex-1 border border-gray-300 rounded-r-lg p-2.5 outline-none focus:ring-[var(--primary)]" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cor Primária</label>
                <div className="flex gap-3 items-center">
                  <input type="color" name="cor_primaria" defaultValue={tenant.cor_primaria || '#1E40AF'} className="h-10 w-16 rounded cursor-pointer border border-gray-300 p-0" />
                  <span className="text-sm text-gray-500">Altera botões e menus da vitrine</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button type="submit" className="btn btn-primary bg-[var(--primary)] text-white px-8 py-3 rounded-lg flex items-center gap-2 hover:brightness-110 transition-all font-semibold">
              <Save size={18} />
              Salvar Configurações
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
