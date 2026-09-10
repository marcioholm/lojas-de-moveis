import { createClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'
import { Box, ShoppingBag } from 'lucide-react'

function formatMoney(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

export default async function VitrinePublicaPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const resolvedParams = await params
  
  // Use service role key to bypass RLS for the public route to fetch the tenant by slug
  // In a real production app with proper RLS, we could just allow public read on tenants and public products
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: tenant } = await supabaseAdmin
    .from('tenants')
    .select('id, nome, cor_primaria')
    .eq('slug', resolvedParams.slug)
    .single()

  if (!tenant) {
    notFound()
  }

  // Fetch public products for this tenant
  const { data: products } = await supabaseAdmin
    .from('products')
    .select('*')
    .eq('tenant_id', tenant.id)
    .eq('publico', true)
    .gt('estoque_atual', 0)
    .order('nome')

  return (
    <div style={{ '--brand': tenant.cor_primaria || '#1E40AF' } as React.CSSProperties} className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white border-b border-gray-200 py-6 text-center shadow-sm sticky top-0 z-10">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--brand)' }}>{tenant.nome}</h1>
        <p className="text-sm text-gray-500 italic mt-1">Móveis exclusivos e pronta entrega</p>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products && products.length > 0 ? (
            products.map((p) => (
              <div key={p.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full">
                <div className="h-48 bg-gray-100 flex items-center justify-center text-gray-400">
                  {p.foto_url ? (
                    <img src={p.foto_url} alt={p.nome} className="w-full h-full object-cover" />
                  ) : (
                    <Box size={40} strokeWidth={1} />
                  )}
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="font-semibold text-gray-900 line-clamp-2">{p.nome}</h3>
                  <div className="mt-auto pt-3">
                    <div className="text-xl font-bold" style={{ color: 'var(--brand)' }}>
                      {formatMoney(p.preco_venda)}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      10x de {formatMoney(p.preco_venda / 10)} sem juros
                    </div>
                  </div>
                  <a 
                    href={`https://wa.me/?text=Olá, tenho interesse no produto ${encodeURIComponent(p.nome)} que vi na vitrine!`}
                    target="_blank"
                    className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-white font-medium hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: 'var(--brand)' }}
                  >
                    <ShoppingBag size={18} />
                    Comprar
                  </a>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-20 text-gray-500">
              <Box size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-lg">Nenhum produto disponível no momento.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
