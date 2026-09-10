import { createClient } from '@/utils/supabase/server'
import PDVMovelClient from './PDVMovelClient'

export default async function PDVMovelPage() {
  const supabase = await createClient()

  // Fetch only necessary data (Preço de Venda). Cost is omitted.
  const { data: products } = await supabase
    .from('products')
    .select('id, nome, categoria, preco_venda, estoque_atual, imagem_url')
    .order('nome')

  const { data: customers } = await supabase
    .from('customers')
    .select('id, nome, whatsapp')
    .order('nome')

  const { data: { user } } = await supabase.auth.getUser()
  let limitDiscount = 10 // default 10%
  
  if (user) {
    const { data: profile } = await supabase.from('profiles').select('tenant_id').eq('id', user.id).single()
    if (profile?.tenant_id) {
      try {
        const { data: tenant } = await supabase.from('tenants').select('limite_desconto_padrao').eq('id', profile.tenant_id).single()
        if (tenant) {
          limitDiscount = tenant.limite_desconto_padrao || 10
        }
      } catch (e) {
        // ignore if migration not applied
      }
    }
  }

  return (
    <div className="max-w-md mx-auto min-h-[calc(100vh-4rem)] bg-gray-50 -m-4 md:-m-8 p-4 relative pb-24">
      <div className="mb-4">
        <h1 className="text-xl font-bold font-serif text-[var(--primary)]">PDV Móvel</h1>
        <p className="text-sm text-gray-500">Adicione itens ao carrinho</p>
      </div>

      <PDVMovelClient 
        products={products || []} 
        customers={customers || []} 
        limitDiscount={limitDiscount} 
      />
    </div>
  )
}
