import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { CheckCircle } from 'lucide-react'

export default async function OnboardingPage() {
  const supabase = await createClient()

  // Verify if setup is already complete
  const { data: tenant } = await supabase.from('tenants').select('setup_concluido').single()
  
  if (tenant?.setup_concluido) {
    redirect('/app/dashboard')
  }

  async function completeSetup(formData: FormData) {
    'use server'
    const db = await createClient()
    
    const updates = {
      cnpj: formData.get('cnpj') as string,
      telefone_principal: formData.get('telefone_principal') as string,
      cor_primaria: formData.get('cor_primaria') as string,
      slug: formData.get('slug') as string,
      setup_concluido: true
    }

    const { data: currentTenant } = await db.from('tenants').select('id').single()
    if (currentTenant) {
      await db.from('tenants').update(updates).eq('id', currentTenant.id)
    }
    
    redirect('/app/dashboard')
  }

  return (
    <div className="min-h-screen bg-[var(--bg-inset)] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl overflow-hidden">
        <div className="bg-[var(--primary)] p-8 text-white text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} />
          </div>
          <h1 className="text-2xl font-bold font-serif">Bem-vindo ao Marka Gestão</h1>
          <p className="opacity-90 mt-2">Vamos configurar os dados iniciais da sua loja para começarmos.</p>
        </div>

        <form action={completeSetup} className="p-8 space-y-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2">1. Dados da Loja</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CNPJ</label>
                <input type="text" name="cnpj" placeholder="00.000.000/0001-00" className="w-full border border-gray-300 rounded-md p-2 focus:ring-[var(--primary)] focus:border-[var(--primary)]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp (Principal) *</label>
                <input type="text" name="telefone_principal" required placeholder="(11) 99999-9999" className="w-full border border-gray-300 rounded-md p-2 focus:ring-[var(--primary)] focus:border-[var(--primary)]" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2">2. Identidade Visual (Vitrine)</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug da Vitrine *</label>
                <div className="flex rounded-md shadow-sm">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                    /loja/
                  </span>
                  <input type="text" name="slug" required placeholder="minha-loja" className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 focus:ring-[var(--primary)] focus:border-[var(--primary)] sm:text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cor Primária *</label>
                <div className="flex gap-2 items-center">
                  <input type="color" name="cor_primaria" defaultValue="#1E40AF" className="h-9 w-9 rounded border border-gray-300 p-0" />
                  <span className="text-sm text-gray-500">Usada nos botões e vitrine</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button type="submit" className="btn btn-primary bg-[var(--primary)] text-white w-full sm:w-auto px-8">
              Concluir Setup e Acessar o Sistema
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
