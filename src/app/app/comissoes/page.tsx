'use client'

import { useState, useEffect } from 'react'
import { Search, Filter, DollarSign, CheckCircle } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'

export default function ComissoesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [comissoes, setComissoes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchComissoes() {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('commissions')
        .select(`
          id,
          mes_referencia,
          total_vendas,
          taxa_comissao,
          valor_comissao,
          premios,
          total_receber,
          status,
          profiles ( nome )
        `)
        .order('mes_referencia', { ascending: false })
      
      if (!error && data) {
        const formatted = data.map((c: any) => {
          const date = new Date(c.mes_referencia)
          const monthStr = date.toLocaleString('pt-BR', { month: 'long', year: 'numeric' })
          
          return {
            id: c.id,
            vendedor: c.profiles?.nome || 'Vendedor não encontrado',
            vendasBrutas: Number(c.total_vendas),
            taxa: Number(c.taxa_comissao),
            comissaoVendas: Number(c.valor_comissao),
            premiosBonus: Number(c.premios),
            totalPagar: Number(c.total_receber),
            status: c.status === 'pago' ? 'Pago' : 'Pendente',
            mes: monthStr.charAt(0).toUpperCase() + monthStr.slice(1)
          }
        })
        setComissoes(formatted)
      }
      setLoading(false)
    }
    fetchComissoes()
  }, [])

  const filteredComissoes = comissoes.filter(c => 
    c.vendedor.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6 fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-serif text-[var(--text-primary)]">Comissões e Premiações</h1>
          <p className="text-[var(--text-muted)] text-sm">Fechamento mensal da equipe de vendas</p>
        </div>
        <div className="flex gap-3">
          <select className="bg-white/50 border border-[var(--border)] text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-[var(--primary)]">
            <option>Outubro 2023</option>
            <option>Novembro 2023</option>
          </select>
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
              placeholder="Buscar por vendedor..." 
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
                <th className="p-4 font-semibold">Vendedor</th>
                <th className="p-4 font-semibold text-right">Vendas Brutas</th>
                <th className="p-4 font-semibold text-center">Taxa Média</th>
                <th className="p-4 font-semibold text-right">Comissão</th>
                <th className="p-4 font-semibold text-right">Prêmios</th>
                <th className="p-4 font-semibold text-right">Total a Pagar</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-[var(--text-muted)]">Carregando comissões...</td>
                </tr>
              ) : filteredComissoes.map((comissao) => (
                <tr key={comissao.id} className="border-b border-[var(--border)] hover:bg-black/5 transition-colors group">
                  <td className="p-4 font-medium text-sm text-[var(--text-primary)]">
                    {comissao.vendedor}
                    <p className="text-xs text-[var(--text-muted)] font-normal">{comissao.mes}</p>
                  </td>
                  <td className="p-4 text-sm text-[var(--text-secondary)] text-right">R$ {comissao.vendasBrutas.toFixed(2).replace('.', ',')}</td>
                  <td className="p-4 text-sm text-[var(--text-secondary)] text-center">{comissao.taxa.toFixed(1)}%</td>
                  <td className="p-4 text-sm text-[var(--text-secondary)] text-right">R$ {comissao.comissaoVendas.toFixed(2).replace('.', ',')}</td>
                  <td className="p-4 text-sm text-[var(--success)] text-right font-medium">+ R$ {comissao.premiosBonus.toFixed(2).replace('.', ',')}</td>
                  <td className="p-4 text-sm font-bold text-[var(--primary)] text-right">R$ {comissao.totalPagar.toFixed(2).replace('.', ',')}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border
                      ${comissao.status === 'Pago' ? 'bg-[var(--success-bg)] text-[var(--success)] border-[var(--success)]/20' : 
                        'bg-[var(--warning-bg)] text-[var(--warning)] border-[var(--warning)]/20'}
                    `}>
                      {comissao.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {comissao.status === 'Pendente' && (
                        <button className="p-1.5 text-[var(--text-muted)] hover:text-[var(--success)] hover:bg-[var(--success-bg)] rounded-md transition-colors" title="Efetuar Pagamento">
                          <CheckCircle size={16} />
                        </button>
                      )}
                      <button className="p-1.5 text-[var(--text-muted)] hover:text-[var(--primary)] hover:bg-[var(--primary)]/10 rounded-md transition-colors" title="Ver Recibo">
                        <DollarSign size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {!loading && filteredComissoes.length === 0 && (
            <div className="p-12 text-center text-[var(--text-muted)]">
              Nenhuma comissão registrada.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
