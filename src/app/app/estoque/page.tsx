'use client'

import { useState, useEffect } from 'react'
import { Search, Plus, Filter, MoreHorizontal, Edit, Trash, MessageSquare } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'

export default function EstoquePage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProducts() {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (!error && data) {
        setProducts(data)
      }
      setLoading(false)
    }
    fetchProducts()
  }, [])

  const filteredProducts = products.filter(p => 
    p.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.id?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-serif text-[var(--text-primary)]">Gestão de Estoque</h1>
          <p className="text-[var(--text-muted)] text-sm">Controle de mercadorias e catálogo de produtos</p>
        </div>
        <div className="flex gap-3">
          <button className="btn-secondary flex items-center gap-2">
            <Filter size={18} />
            <span className="hidden sm:inline">Filtros</span>
          </button>
          <button className="btn-primary flex items-center gap-2">
            <Plus size={18} />
            <span>Novo Produto</span>
          </button>
        </div>
      </div>

      {/* Glass Panel */}
      <div className="glass-panel p-0 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-[var(--border)] flex items-center gap-4 bg-[var(--bg-inset)]">
          <div className="relative flex-1 max-w-md">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input 
              type="text" 
              placeholder="Buscar por nome..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/50 border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--border)] bg-black/5 text-[11px] uppercase tracking-wider text-[var(--text-muted)]">
                <th className="p-4 font-semibold w-12"></th>
                <th className="p-4 font-semibold">Produto</th>
                <th className="p-4 font-semibold text-right">Preço</th>
                <th className="p-4 font-semibold text-center">Estoque</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-[var(--text-muted)]">Carregando estoque...</td>
                </tr>
              ) : filteredProducts.map((product) => (
                <tr key={product.id} className="border-b border-[var(--border)] hover:bg-black/5 transition-colors group">
                  <td className="p-4">
                    <img src={product.foto_url || 'https://via.placeholder.com/150'} alt={product.nome} className="w-10 h-10 rounded-md object-cover border border-[var(--border)]" />
                  </td>
                  <td className="p-4">
                    <p className="text-sm font-medium text-[var(--text-primary)] group-hover:text-[var(--primary)] transition-colors">{product.nome}</p>
                    <p className="text-xs text-[var(--text-muted)]">{product.categoria || 'Sem categoria'}</p>
                  </td>
                  <td className="p-4 text-sm font-medium text-[var(--text-primary)] text-right">
                    R$ {Number(product.preco_venda).toFixed(2).replace('.', ',')}
                  </td>
                  <td className="p-4 text-center">
                    <div className="inline-flex flex-col items-center">
                      <span className="text-sm font-bold text-[var(--text-primary)]">{product.estoque_atual}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border
                      ${product.estoque_atual > product.estoque_min ? 'bg-[var(--success-bg)] text-[var(--success)] border-[var(--success)]/20' : 
                        product.estoque_atual > 0 ? 'bg-[var(--warning-bg)] text-[var(--warning)] border-[var(--warning)]/20' : 
                        'bg-[var(--danger-bg)] text-[var(--danger)] border-[var(--danger)]/20'}
                    `}>
                      {product.estoque_atual > product.estoque_min ? 'Em Estoque' : product.estoque_atual > 0 ? 'Baixo Estoque' : 'Sem Estoque'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 text-[var(--text-muted)] hover:text-[var(--success)] hover:bg-[var(--success-bg)] rounded-md transition-colors" title="Enviar p/ Cliente">
                        <MessageSquare size={16} />
                      </button>
                      <button className="p-1.5 text-[var(--text-muted)] hover:text-[var(--primary)] hover:bg-[var(--primary)]/10 rounded-md transition-colors" title="Editar">
                        <Edit size={16} />
                      </button>
                      <button className="p-1.5 text-[var(--text-muted)] hover:text-[var(--danger)] hover:bg-[var(--danger-bg)] rounded-md transition-colors" title="Excluir">
                        <Trash size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {!loading && filteredProducts.length === 0 && (
            <div className="p-12 text-center text-[var(--text-muted)]">
              Nenhum produto encontrado.
            </div>
          )}
        </div>
        
        {/* Pagination */}
        <div className="p-4 border-t border-[var(--border)] flex items-center justify-between bg-[var(--bg-inset)]">
          <p className="text-xs text-[var(--text-muted)]">Mostrando <strong className="text-[var(--text-primary)]">{filteredProducts.length}</strong> produtos</p>
          <div className="flex gap-1">
            <button className="px-3 py-1 text-sm border border-[var(--border)] rounded-md bg-white hover:bg-[var(--bg-inset)] disabled:opacity-50" disabled>Anterior</button>
            <button className="px-3 py-1 text-sm border border-[var(--border)] rounded-md bg-white hover:bg-[var(--bg-inset)]" disabled>Próxima</button>
          </div>
        </div>
      </div>
    </div>
  )
}
