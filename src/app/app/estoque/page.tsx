import { createClient } from '@/utils/supabase/server'
import { Plus, Search, Box, Download, Eye, Share2, Edit2, Trash2, EyeOff } from 'lucide-react'
import Link from 'next/link'
import { ProductModal } from '@/components/modals/ProductModal'
import { deleteProduct } from '@/app/app/actions'

function formatMoney(value: number | null) {
  if (!value) return 'R$ 0,00'
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

export default async function EstoquePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const supabase = await createClient()
  const resolvedParams = await searchParams
  const query = resolvedParams.q || ''

  // Fetch products from database
  let dbQuery = supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  if (query) {
    dbQuery = dbQuery.or(`nome.ilike.%${query}%,categoria.ilike.%${query}%`)
  }

  const { data: products, error } = await dbQuery

  return (
    <div>
      <div className="page-head">
        <div>
          <h2>Controle de estoque</h2>
          <p>Acompanhe entradas, disponibilidade, custos e margem de cada produto.</p>
        </div>
        <div className="flex gap-2 flex-wrap mt-4 sm:mt-0">
          <button className="btn btn-outline text-[var(--text-primary)]">
            <Download size={16} /> Exportar
          </button>
          <Link href="?modal=product" className="btn btn-primary bg-[var(--primary)] text-white no-underline">
            <Plus size={16} /> Cadastrar produto
          </Link>
        </div>
      </div>

      <ProductModal />

      <div className="search-bar">
        <Search size={16} />
        <input 
          placeholder="Buscar por produto ou categoria..." 
          defaultValue={query}
          // In a real app, you would wire this to router.push('?q=' + val) on client
        />
      </div>

      <div className="panel table-panel">
        <table className="data-table">
          <thead>
            <tr>
              <th>Produto</th>
              <th>Categoria</th>
              <th>Estoque</th>
              <th className="num">Custo</th>
              <th className="num">Venda</th>
              <th className="num">Margem</th>
              <th style={{ textAlign: 'center' }}>Vitrine</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products && products.length > 0 ? (
              products.map((p) => {
                const margin = p.preco_custo ? Math.round(((p.preco_venda - p.preco_custo) / p.preco_venda) * 100) : 100;
                return (
                  <tr key={p.id}>
                    <td className="flex items-center gap-2.5">
                      {p.foto_url ? (
                        <img src={p.foto_url} className="w-9 h-9 rounded-md object-cover shrink-0" alt="" />
                      ) : (
                        <div className="w-9 h-9 rounded-md bg-[var(--bg-inset)] flex items-center justify-center shrink-0 text-[var(--text-muted)]">
                          <Box size={20} />
                        </div>
                      )}
                      <div>
                        <b>{p.nome}</b>
                        {/* SKU could be added later, prototype had it */}
                        <small className="text-[10px] text-[var(--text-muted)]">Cód: {p.id.split('-')[0]}</small>
                      </div>
                    </td>
                    <td>{p.categoria || '—'}</td>
                    <td>
                      <span className={`badge ${p.estoque_atual <= p.estoque_min ? 'badge-danger' : 'badge-success'}`}>
                        {p.estoque_atual} un.
                      </span>
                    </td>
                    <td className="num">{formatMoney(p.preco_custo)}</td>
                    <td className="num"><b>{formatMoney(p.preco_venda)}</b></td>
                    <td className={`num margin-col ${margin >= 40 ? 'high' : 'mid'}`}>
                      {margin}%
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button className={`btn btn-sm ${p.publico ? 'btn-primary' : 'btn-outline'}`} style={{ minWidth: '32px', opacity: p.publico ? 1 : 0.5 }}>
                        {p.publico ? <Eye size={14} /> : '—'}
                      </button>
                    </td>
                    <td className="flex gap-1">
                      <button className="btn btn-outline btn-sm text-[var(--text-muted)] hover:text-[var(--text-primary)]" title="Editar">
                        <Edit2 size={14} />
                      </button>
                      <form action={deleteProduct.bind(null, p.id)}>
                        <button type="submit" className="btn btn-outline btn-sm text-[var(--danger)] hover:bg-[var(--danger-bg)] border-[var(--border)]" title="Excluir">
                          <Trash2 size={14} />
                        </button>
                      </form>
                    </td>
                  </tr>
                )
              })
            ) : (
              <tr>
                <td colSpan={8} className="text-center py-10 text-[var(--text-muted)]">
                  Nenhum produto encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
