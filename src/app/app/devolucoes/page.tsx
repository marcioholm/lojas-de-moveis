'use client'

import { useState, useEffect } from 'react'
import { Search, Filter, RotateCcw, CheckCircle, XCircle } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'

export default function DevolucoesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [devolucoes, setDevolucoes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDevolucoes() {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('returns')
        .select(`
          id,
          motivo,
          valor,
          status,
          created_at,
          customers ( nome ),
          products ( nome )
        `)
        .order('created_at', { ascending: false })
      
      if (!error && data) {
        const formatted = data.map((d: any) => ({
          id: d.id.substring(0, 8).toUpperCase(),
          real_id: d.id,
          cliente: d.customers?.nome || 'Cliente não encontrado',
          produto: d.products?.nome || 'Produto não encontrado',
          motivo: d.motivo,
          dataSolicitacao: new Date(d.created_at).toLocaleDateString('pt-BR'),
          valor: Number(d.valor),
          status: d.status === 'em_analise' ? 'Em Análise' : 
                  d.status === 'aprovada' ? 'Aprovada' :
                  d.status === 'rejeitada' ? 'Rejeitada' : 'Concluída'
        }))
        setDevolucoes(formatted)
      }
      setLoading(false)
    }
    fetchDevolucoes()
  }, [])

  const filteredDevolucoes = devolucoes.filter(d => 
    d.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.produto.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.id.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6 fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-serif text-[var(--text-primary)]">Devoluções e Trocas</h1>
          <p className="text-[var(--text-muted)] text-sm">Gestão de logística reversa e avarias</p>
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
              placeholder="Buscar cliente, produto, ID..." 
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
                <th className="p-4 font-semibold">ID</th>
                <th className="p-4 font-semibold">Cliente / Produto</th>
                <th className="p-4 font-semibold">Motivo</th>
                <th className="p-4 font-semibold">Solicitação</th>
                <th className="p-4 font-semibold text-right">Valor</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-[var(--text-muted)]">Carregando devoluções...</td>
                </tr>
              ) : filteredDevolucoes.map((dev) => (
                <tr key={dev.real_id} className="border-b border-[var(--border)] hover:bg-black/5 transition-colors group">
                  <td className="p-4 text-sm font-bold font-mono text-[var(--danger)]">DEV-{dev.id}</td>
                  <td className="p-4">
                    <p className="text-sm font-medium text-[var(--text-primary)]">{dev.cliente}</p>
                    <p className="text-xs text-[var(--text-secondary)]">{dev.produto}</p>
                  </td>
                  <td className="p-4 text-sm text-[var(--text-secondary)]">{dev.motivo}</td>
                  <td className="p-4 text-sm text-[var(--text-secondary)]">{dev.dataSolicitacao}</td>
                  <td className="p-4 text-sm font-medium text-[var(--danger)] text-right">R$ {dev.valor.toFixed(2).replace('.', ',')}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border
                      ${dev.status === 'Concluída' || dev.status === 'Aprovada' ? 'bg-[var(--success-bg)] text-[var(--success)] border-[var(--success)]/20' : 
                        dev.status === 'Rejeitada' ? 'bg-[var(--danger-bg)] text-[var(--danger)] border-[var(--danger)]/20' :
                        'bg-[var(--warning-bg)] text-[var(--warning)] border-[var(--warning)]/20'}
                    `}>
                      {dev.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {dev.status === 'Em Análise' && (
                        <>
                          <button className="p-1.5 text-[var(--text-muted)] hover:text-[var(--success)] hover:bg-[var(--success-bg)] rounded-md transition-colors" title="Aprovar">
                            <CheckCircle size={16} />
                          </button>
                          <button className="p-1.5 text-[var(--text-muted)] hover:text-[var(--danger)] hover:bg-[var(--danger-bg)] rounded-md transition-colors" title="Rejeitar">
                            <XCircle size={16} />
                          </button>
                        </>
                      )}
                      <button className="p-1.5 text-[var(--text-muted)] hover:text-[var(--primary)] hover:bg-[var(--primary)]/10 rounded-md transition-colors" title="Detalhes da Troca">
                        <RotateCcw size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {!loading && filteredDevolucoes.length === 0 && (
            <div className="p-12 text-center text-[var(--text-muted)]">
              Nenhuma solicitação de devolução encontrada.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
