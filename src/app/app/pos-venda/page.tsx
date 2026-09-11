'use client'

import { useState, useEffect } from 'react'
import { Search, Filter, PhoneCall, Star } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'

export default function PosVendaPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [afterSales, setAfterSales] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAfterSales() {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('after_sales')
        .select(`
          id,
          data_contato_previsto,
          nota_satisfacao,
          status,
          sales ( id, created_at ),
          customers ( nome )
        `)
        .order('data_contato_previsto', { ascending: true })
      
      if (!error && data) {
        const formatted = data.map((pv: any) => ({
          id: pv.id.substring(0, 8).toUpperCase(),
          real_id: pv.id,
          cliente: pv.customers?.nome || 'Cliente não encontrado',
          venda: `VD-${(pv.sales?.id || '00000000').substring(0, 8).toUpperCase()}`,
          dataVenda: pv.sales?.created_at ? new Date(pv.sales.created_at).toLocaleDateString('pt-BR') : '-',
          contatoPrevisto: new Date(pv.data_contato_previsto).toLocaleDateString('pt-BR'),
          status: pv.status === 'pendente' ? 'Pendente' : 'Realizado',
          nota: pv.nota_satisfacao
        }))
        setAfterSales(formatted)
      }
      setLoading(false)
    }
    fetchAfterSales()
  }, [])

  const filteredAfterSales = afterSales.filter(pv => 
    pv.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pv.venda.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6 fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-serif text-[var(--text-primary)]">Pós-Venda</h1>
          <p className="text-[var(--text-muted)] text-sm">Fidelização e acompanhamento de satisfação</p>
        </div>
        <div className="flex gap-3">
          <button className="btn-secondary flex items-center gap-2">
            <Filter size={18} />
            <span className="hidden sm:inline">Filtros</span>
          </button>
        </div>
      </div>

      <div className="glass-panel p-0 overflow-hidden">
        <div className="p-4 border-b border-[var(--border)] flex items-center gap-4 bg-[var(--bg-inset)]">
          <div className="relative flex-1 max-w-md">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input 
              type="text" 
              placeholder="Buscar cliente, venda..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/50 border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--border)] bg-black/5 text-[11px] uppercase tracking-wider text-[var(--text-muted)]">
                <th className="p-4 font-semibold">Cliente</th>
                <th className="p-4 font-semibold">Venda Ref.</th>
                <th className="p-4 font-semibold">Data da Venda</th>
                <th className="p-4 font-semibold">Contato Previsto</th>
                <th className="p-4 font-semibold">Satisfação</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-[var(--text-muted)]">Carregando contatos de pós-venda...</td>
                </tr>
              ) : filteredAfterSales.map((pv) => (
                <tr key={pv.real_id} className="border-b border-[var(--border)] hover:bg-black/5 transition-colors group">
                  <td className="p-4 font-medium text-sm text-[var(--text-primary)]">{pv.cliente}</td>
                  <td className="p-4 text-sm text-[var(--primary)] font-mono">{pv.venda}</td>
                  <td className="p-4 text-sm text-[var(--text-secondary)]">{pv.dataVenda}</td>
                  <td className="p-4 text-sm font-medium text-[var(--text-secondary)]">{pv.contatoPrevisto}</td>
                  <td className="p-4">
                    {pv.nota ? (
                      <div className="flex items-center gap-1 text-[var(--warning)]">
                        {[...Array(pv.nota)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                      </div>
                    ) : (
                      <span className="text-xs text-[var(--text-muted)]">-</span>
                    )}
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border
                      ${pv.status === 'Realizado' ? 'bg-[var(--success-bg)] text-[var(--success)] border-[var(--success)]/20' : 
                        'bg-[var(--warning-bg)] text-[var(--warning)] border-[var(--warning)]/20'}
                    `}>
                      {pv.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 text-[var(--text-muted)] hover:text-[var(--primary)] hover:bg-[var(--primary)]/10 rounded-md transition-colors" title="Registrar Contato">
                        <PhoneCall size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {!loading && filteredAfterSales.length === 0 && (
            <div className="p-12 text-center text-[var(--text-muted)]">
              Nenhum pós-venda agendado.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
