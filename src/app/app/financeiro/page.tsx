'use client'

import { useState, useEffect } from 'react'
import { ArrowUpRight, ArrowDownRight, DollarSign, Wallet, TrendingUp, Download, BarChart2 } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'

export default function FinanceiroPage() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    receitas: 0,
    despesas: 0,
    margem: 0,
    caixa: 0
  })

  useEffect(() => {
    async function fetchStats() {
      const supabase = createClient()
      
      // Fetch Sales for Receitas
      const { data: salesData } = await supabase
        .from('sales')
        .select('total')
        .neq('status', 'rejeitado')
      
      // Fetch Expenses for Despesas
      const { data: expensesData } = await supabase
        .from('expenses')
        .select('valor')

      const receitas = salesData?.reduce((acc, curr) => acc + Number(curr.total), 0) || 0
      const despesas = expensesData?.reduce((acc, curr) => acc + Number(curr.valor), 0) || 0
      const caixa = receitas - despesas
      const margem = receitas > 0 ? (caixa / receitas) * 100 : 0

      setStats({ receitas, despesas, caixa, margem })
      setLoading(false)
    }
    fetchStats()
  }, [])

  return (
    <div className="space-y-6 fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-serif text-[var(--text-primary)]">Visão Financeira</h1>
          <p className="text-[var(--text-muted)] text-sm">Dashboard consolidado do mês</p>
        </div>
        <div className="flex gap-3">
          <select className="bg-white/50 border border-[var(--border)] text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-[var(--primary)]">
            <option>Outubro 2023</option>
            <option>Novembro 2023</option>
          </select>
          <button className="btn-secondary flex items-center gap-2">
            <Download size={18} />
            <span className="hidden sm:inline">Exportar DRE</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-[var(--text-muted)]">Calculando DRE e fluxo de caixa...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass-panel p-6 relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-[var(--success)]/10 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out"></div>
              <div className="flex justify-between items-start mb-4 relative">
                <div className="w-10 h-10 rounded-full bg-[var(--success-bg)] text-[var(--success)] flex items-center justify-center">
                  <ArrowUpRight size={20} />
                </div>
                <span className="text-xs font-bold text-[var(--success)] bg-[var(--success-bg)] px-2 py-1 rounded-full">+12.5%</span>
              </div>
              <p className="text-sm font-medium text-[var(--text-muted)] mb-1 relative">Receitas (Bruto)</p>
              <h3 className="text-3xl font-bold font-serif text-[var(--text-primary)] relative">R$ {stats.receitas.toFixed(2).replace('.', ',')}</h3>
            </div>

            <div className="glass-panel p-6 relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-[var(--danger)]/10 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out"></div>
              <div className="flex justify-between items-start mb-4 relative">
                <div className="w-10 h-10 rounded-full bg-[var(--danger-bg)] text-[var(--danger)] flex items-center justify-center">
                  <ArrowDownRight size={20} />
                </div>
                <span className="text-xs font-bold text-[var(--danger)] bg-[var(--danger-bg)] px-2 py-1 rounded-full">-2.4%</span>
              </div>
              <p className="text-sm font-medium text-[var(--text-muted)] mb-1 relative">Despesas (Total)</p>
              <h3 className="text-3xl font-bold font-serif text-[var(--text-primary)] relative">R$ {stats.despesas.toFixed(2).replace('.', ',')}</h3>
            </div>

            <div className="glass-panel p-6 relative overflow-hidden group border-l-4 border-l-[var(--info)]">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-[var(--info)]/10 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out"></div>
              <div className="flex justify-between items-start mb-4 relative">
                <div className="w-10 h-10 rounded-full bg-[var(--info-bg)] text-[var(--info)] flex items-center justify-center">
                  <Wallet size={20} />
                </div>
              </div>
              <p className="text-sm font-medium text-[var(--text-muted)] mb-1 relative">Resultado (Caixa)</p>
              <h3 className={`text-3xl font-bold font-serif relative ${stats.caixa >= 0 ? 'text-[var(--text-primary)]' : 'text-[var(--danger)]'}`}>
                R$ {stats.caixa.toFixed(2).replace('.', ',')}
              </h3>
            </div>

            <div className="glass-panel p-6 relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-[var(--primary)]/10 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out"></div>
              <div className="flex justify-between items-start mb-4 relative">
                <div className="w-10 h-10 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center">
                  <TrendingUp size={20} />
                </div>
              </div>
              <p className="text-sm font-medium text-[var(--text-muted)] mb-1 relative">Margem Líquida</p>
              <h3 className="text-3xl font-bold font-serif text-[var(--primary)] relative">{stats.margem.toFixed(1)}%</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 glass-panel p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-[var(--text-primary)]">Fluxo de Caixa (Previsão)</h3>
                <BarChart2 size={20} className="text-[var(--text-muted)]" />
              </div>
              <div className="h-64 flex items-center justify-center border border-dashed border-[var(--border)] bg-black/5 rounded-lg">
                <p className="text-sm text-[var(--text-muted)]">Gráfico de barras (Receitas x Despesas por dia) será renderizado aqui.</p>
              </div>
            </div>

            <div className="glass-panel p-6">
              <h3 className="font-bold text-[var(--text-primary)] mb-6">Resumo de Despesas</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-[var(--text-secondary)]">Fornecedores (Estoque)</span>
                    <span className="font-bold">75%</span>
                  </div>
                  <div className="w-full bg-black/10 rounded-full h-2">
                    <div className="bg-[var(--danger)] h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-[var(--text-secondary)]">Comissões e RH</span>
                    <span className="font-bold">15%</span>
                  </div>
                  <div className="w-full bg-black/10 rounded-full h-2">
                    <div className="bg-[var(--warning)] h-2 rounded-full" style={{ width: '15%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-[var(--text-secondary)]">Custos Fixos (Aluguel, Luz)</span>
                    <span className="font-bold">10%</span>
                  </div>
                  <div className="w-full bg-black/10 rounded-full h-2">
                    <div className="bg-[var(--info)] h-2 rounded-full" style={{ width: '10%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
