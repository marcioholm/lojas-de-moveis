import { createClient } from '@/utils/supabase/server'
import { ExternalLink, Inbox, Globe, Copy, Box } from 'lucide-react'
import { headers } from 'next/headers'
import Link from 'next/link'

function formatMoney(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

export default async function VitrineAdminPage() {
  const supabase = await createClient()

  // Get current user's tenant
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('tenant_id')
    .eq('id', user.id)
    .single()

  let tenant: any = null
  if (profile?.tenant_id) {
    const { data } = await supabase
      .from('tenants')
      .select('*')
      .eq('id', profile.tenant_id)
      .single()
    tenant = data
  }

  // Get public products for this tenant
  const { data: vitrineProducts } = await supabase
    .from('products')
    .select('*')
    .eq('publico', true)
    .gt('estoque_atual', 0)
    .order('nome')

  // Build public URL using headers (SSR-safe)
  const headersList = await headers()
  const host = headersList.get('host') || 'localhost:3000'
  const proto = headersList.get('x-forwarded-proto') || 'http'
  const publicUrl = `${proto}://${host}/loja/${tenant?.slug || 'demo'}`

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Vitrine Digital</h2>
          <p className="text-sm text-gray-500 mt-1">Gerencie sua loja virtual, acompanhe produtos publicados e configure a experiência do cliente.</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <a
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
            href={`/loja/${tenant?.slug}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLink size={16} /> Abrir vitrine
          </a>
          <Link
            href="/app/leads"
            className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg text-sm font-medium hover:bg-[var(--primary-hover)] transition-colors flex items-center gap-2"
          >
            <Inbox size={16} /> Ver leads
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="border-b border-gray-100 p-4 flex justify-between items-center bg-gray-50/50">
              <b className="text-sm">Preview da vitrine pública</b>
              <span className="text-xs font-semibold bg-green-100 text-green-700 px-2.5 py-1 rounded-full">ATIVA</span>
            </div>

            <div className="p-6 bg-gray-50/50">
              <div className="text-center mb-8">
                <div className="text-lg font-bold text-[var(--primary)] mb-1">
                  {tenant?.nome || 'Sua Loja'}
                </div>
                <div className="text-sm text-gray-500 italic">
                  Móveis exclusivos e pronta entrega
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {vitrineProducts && vitrineProducts.length > 0 ? (
                  vitrineProducts.map(p => (
                    <div key={p.id} className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 text-center">
                      <div className="bg-gray-100 h-32 rounded-lg flex items-center justify-center text-gray-400 mb-3">
                        {p.foto_url ? (
                          <img src={p.foto_url} alt="" className="w-full h-full object-cover rounded-lg" />
                        ) : (
                          <Box size={24} strokeWidth={1.5} />
                        )}
                      </div>
                      <div className="font-semibold text-sm leading-tight line-clamp-2 mb-2 h-8">
                        {p.nome}
                      </div>
                      <div className="text-xs text-gray-400">
                        Consulte preço na loja
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-10 text-gray-400">
                    Nenhum produto habilitado para a vitrine.<br />
                    Ative produtos na aba Estoque.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h4 className="flex items-center gap-2 font-semibold text-sm mb-4">
              <Globe size={18} className="text-gray-400" /> Link público
            </h4>
            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-100">
              <span className="text-xs truncate mr-3 text-gray-600" title={publicUrl}>
                {publicUrl}
              </span>
              <button className="px-2 py-1 border border-gray-200 rounded text-xs hover:bg-gray-100 transition-colors shrink-0" title="Copiar link">
                <Copy size={14} />
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h4 className="font-semibold text-sm mb-3">Estatísticas</h4>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Produtos na vitrine</span>
                <span className="font-bold">{vitrineProducts?.length || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
