'use client'

import { useState, useEffect } from 'react'
import { Target, Trophy, TrendingUp } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'

export default function MetasPage() {
  const [loading, setLoading] = useState(true)
  const [metaGlobal, setMetaGlobal] = useState({ objetivo: 150000, atingido: 0 })
  const [vendedores, setVendedores] = useState<any[]>([])

  useEffect(() => {
    async function fetchMetas() {
      const supabase = createClient()
      
      // Meta global
      const { data: goalData } = await supabase
        .from('goals')
        .select('*')
        .order('mes_referencia', { ascending: false })
        .limit(1)
        .single()
      
      // Somar vendas do mês atual
      const date = new Date()
      const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).toISOString()
      
      const { data: salesData } = await supabase
        .from('sales')
        .select('total, seller_id, profiles (nome)')
        .gte('created_at', firstDay)
        .neq('status', 'rejeitado')

      const totalAtingido = salesData?.reduce((acc, curr) => acc + Number(curr.total), 0) || 0
      
      setMetaGlobal({
        objetivo: goalData ? Number(goalData.meta_global) : 150000,
        atingido: totalAtingido
      })

      // Agrupar por vendedor
      const salesBySeller: Record<string, { nome: string, total: number }> = {}
      salesData?.forEach((s: any) => {
        const id = s.seller_id
        if (!id) return
        if (!salesBySeller[id]) {
          salesBySeller[id] = { nome: s.profiles?.nome || 'Desconhecido', total: 0 }
        }
        salesBySeller[id].total += Number(s.total)
      })

      const sellersList = Object.values(salesBySeller).map(s => ({
        nome: s.nome,
        atingido: s.total,
        meta: 50000 // Placeholder for individual meta (could be a new table or user config)
      }))

      setVendedores(sellersList)
      setLoading(false)
    }
    fetchMetas()
  }, [])

  const porcentagemGlobal = Math.min((metaGlobal.atingido / metaGlobal.objetivo) * 100, 100) || 0
  const faltaGlobal = Math.max(metaGlobal.objetivo - metaGlobal.atingido, 0)

  return (
    <div className="space-y-6 fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-serif text-[var(--text-primary)]">Metas da Loja</h1>
          <p className="text-[var(--text-muted)] text-sm">Acompanhamento de objetivos de vendas do mês</p>
        </div>
        <div className="flex gap-3">
          <select className="bg-white/50 border border-[var(--border)] text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-[var(--primary)]">
            <option>Mês Atual</option>
            <option>Mês Anterior</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-[var(--text-muted)]">Calculando metas...</div>
      ) : (
        <>
          <div className="glass-panel p-6 flex flex-col md:flex-row gap-8 items-center justify-between bg-gradient-to-r from-[var(--bg-inset)] to-[var(--bg-raised)] border-l-4 border-l-[var(--primary)]">
            <div className="flex-1 w-full">
              <div className="flex items-center gap-2 mb-2">
                <Target className="text-[var(--primary)]" size={24} />
                <h2 className="text-xl font-bold text-[var(--text-primary)]">Meta Global da Loja</h2>
              </div>
              <p className="text-sm text-[var(--text-muted)] mb-6">Faturamento total esperado para o mês atual.</p>
              
              <div className="flex justify-between items-end mb-2">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">Atingido</p>
                  <p className="text-2xl font-bold font-serif text-[var(--primary)]">R$ {metaGlobal.atingido.toFixed(2).replace('.', ',')}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">Objetivo</p>
                  <p className="text-xl font-bold text-[var(--text-muted)]">R$ {metaGlobal.objetivo.toFixed(2).replace('.', ',')}</p>
                </div>
              </div>
              
              <div className="w-full bg-black/10 rounded-full h-4 overflow-hidden relative">
                <div className="bg-[var(--primary)] h-4 rounded-full transition-all duration-1000 ease-out" style={{ width: `${porcentagemGlobal}%` }}></div>
                <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white drop-shadow-md">
                  {porcentagemGlobal.toFixed(1)}%
                </span>
              </div>
            </div>

            <div className="w-full md:w-auto flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-sm border border-[var(--border)] min-w-[200px]">
              <Trophy size={48} className={faltaGlobal === 0 ? "text-[var(--success)] mb-2" : "text-[var(--warning)] mb-2"} />
              <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] text-center">
                {faltaGlobal === 0 ? 'Meta Batida!' : 'Faltam'}
              </p>
              <p className={`text-xl font-bold ${faltaGlobal === 0 ? 'text-[var(--success)]' : 'text-[var(--text-primary)]'}`}>
                R$ {faltaGlobal.toFixed(2).replace('.', ',')}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-panel p-6">
              <h3 className="font-bold text-[var(--text-primary)] border-b border-[var(--border)] pb-2 mb-4 flex items-center gap-2">
                <TrendingUp size={18} className="text-[var(--info)]" />
                Metas Individuais (Vendedores)
              </h3>
              
              <div className="space-y-6">
                {vendedores.length === 0 ? (
                  <p className="text-sm text-[var(--text-muted)]">Nenhuma venda registrada neste mês por vendedores.</p>
                ) : (
                  vendedores.map((v, idx) => {
                    const pct = Math.min((v.atingido / v.meta) * 100, 100)
                    const color = pct >= 100 ? 'bg-[var(--success)]' : pct > 70 ? 'bg-[var(--info)]' : 'bg-[var(--warning)]'
                    
                    return (
                      <div key={idx}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium text-[var(--text-primary)]">{v.nome}</span>
                          <span className="text-[var(--text-secondary)]">R$ {v.atingido.toFixed(2)} / R$ {v.meta.toFixed(2)}</span>
                        </div>
                        <div className="w-full bg-black/10 rounded-full h-2">
                          <div className={`${color} h-2 rounded-full transition-all duration-1000`} style={{ width: `${pct}%` }}></div>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </div>

            <div className="glass-panel p-6">
              <h3 className="font-bold text-[var(--text-primary)] border-b border-[var(--border)] pb-2 mb-4">Campanhas Ativas</h3>
              <div className="space-y-4">
                <div className="p-4 border border-[var(--success)]/30 bg-[var(--success-bg)] rounded-lg">
                  <h4 className="font-bold text-[var(--success)] mb-1">Bônus de Estofados</h4>
                  <p className="text-sm text-[var(--text-secondary)]">Venda 10 sofás da linha premium e ganhe R$ 500 extras. (Válido até fim do mês)</p>
                </div>
                <div className="p-4 border border-[var(--border)] bg-[var(--bg-inset)] rounded-lg">
                  <h4 className="font-bold text-[var(--text-primary)] mb-1">Queima de Estoque (Painéis)</h4>
                  <p className="text-sm text-[var(--text-secondary)]">Comissão dobrada para a linha de painéis ripados.</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
