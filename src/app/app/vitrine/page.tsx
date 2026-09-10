import { createClient } from '@/utils/supabase/server'
import { ExternalLink, Inbox, Globe, Copy, Box } from 'lucide-react'

function formatMoney(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

export default async function VitrineAdminPage() {
  const supabase = await createClient()

  // Get current tenant
  const { data: tenant } = await supabase.from('tenants').select('*').single()
  
  // Get public products
  const { data: vitrineProducts } = await supabase
    .from('products')
    .select('*')
    .eq('publico', true)
    .gt('estoque_atual', 0)
    .order('nome')

  const publicUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/loja/${tenant?.slug}` 
    : `https://lojas-de-moveis.vercel.app/loja/${tenant?.slug || 'demo'}`

  return (
    <div>
      <div className="page-head">
        <div>
          <h2>Vitrine Digital</h2>
          <p>Gerencie sua loja virtual, acompanhe produtos publicados e configure a experiência do cliente.</p>
        </div>
        <div className="flex gap-2 mt-4 sm:mt-0 flex-wrap">
          <a 
            className="btn btn-outline text-[var(--text-primary)]" 
            href={`/loja/${tenant?.slug}`} 
            target="_blank"
          >
            <ExternalLink size={16} /> Abrir vitrine
          </a>
          <button className="btn btn-primary bg-[var(--primary)] text-white">
            <Inbox size={16} /> Ver leads
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2">
          <div className="panel p-0 overflow-hidden">
            <div className="border-b border-[var(--border)] p-4 flex justify-between items-center bg-[var(--bg-raised)]">
              <b className="text-[14px]">Preview da vitrine pública</b>
              <span className="badge badge-success text-[0.7rem]">ATIVA</span>
            </div>
            
            <div className="p-6 bg-gray-50/50">
              <div className="text-center mb-8">
                <div className="text-[1.2rem] font-bold text-[var(--primary)] mb-1">
                  {tenant?.nome || 'Marka Móveis'}
                </div>
                <div className="text-[0.85rem] text-[var(--text-muted)] italic">
                  Móveis exclusivos e pronta entrega
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {vitrineProducts && vitrineProducts.length > 0 ? (
                  vitrineProducts.map(p => (
                    <div key={p.id} className="bg-white p-3 rounded-xl shadow-sm border border-[var(--border-light)] text-center">
                      <div className="bg-[var(--bg-inset)] h-32 rounded-lg flex items-center justify-center text-[var(--text-muted)] mb-3">
                        {p.foto_url ? (
                          <img src={p.foto_url} alt="" className="w-full h-full object-cover rounded-lg" />
                        ) : (
                          <Box size={24} strokeWidth={1.5} />
                        )}
                      </div>
                      <div className="font-semibold text-[13px] leading-tight line-clamp-2 mb-2 h-8">
                        {p.nome}
                      </div>
                      <div className="font-bold text-[var(--primary)]">
                        {formatMoney(p.preco_venda)}
                      </div>
                      <div className="text-[11px] text-[var(--text-muted)] mt-1">
                        10x de {formatMoney(p.preco_venda / 10)}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-10 text-[var(--text-muted)]">
                    Nenhum produto habilitado para a vitrine.<br />
                    Ative produtos na aba Estoque.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="panel p-5">
            <h4 className="flex items-center gap-2 font-semibold text-[14px] mb-4">
              <Globe size={18} className="text-[var(--text-muted)]" /> Link público
            </h4>
            <div className="flex items-center justify-between bg-[var(--bg-inset)] p-3 rounded-lg border border-[var(--border-light)]">
              <span className="text-[13px] truncate mr-3" title={publicUrl}>
                {publicUrl}
              </span>
              <button className="btn btn-outline btn-sm shrink-0" title="Copiar link">
                <Copy size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
