'use client'

import { PiggyBank, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, DollarSign } from 'lucide-react'

export default function FinanceiroPage() {
  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-serif text-[var(--text-primary)]">Fluxo de Caixa (Dashboard)</h1>
          <p className="text-[var(--text-muted)] text-sm">Visão geral financeira e saldos</p>
        </div>
        <div className="flex gap-3">
          <select className="bg-white/50 border border-[var(--border)] text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-[var(--primary)]">
            <option>Outubro 2023</option>
            <option>Novembro 2023</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-panel p-4 flex flex-col gap-2 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <PiggyBank size={64} />
          </div>
          <p className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Saldo em Contas</p>
          <h3 className="text-2xl font-bold font-serif text-[var(--text-primary)]">R$ 142.500,00</h3>
        </div>
        
        <div className="glass-panel p-4 flex flex-col gap-2 relative overflow-hidden group border-b-4 border-b-[var(--success)]">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity text-[var(--success)]">
            <TrendingUp size={64} />
          </div>
          <p className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Receitas (Mês)</p>
          <h3 className="text-2xl font-bold font-serif text-[var(--text-primary)]">R$ 84.300,00</h3>
          <p className="text-xs text-[var(--success)] flex items-center gap-1 font-medium">
            <ArrowUpRight size={12} />
            +15% vs mês anterior
          </p>
        </div>

        <div className="glass-panel p-4 flex flex-col gap-2 relative overflow-hidden group border-b-4 border-b-[var(--danger)]">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity text-[var(--danger)]">
            <TrendingDown size={64} />
          </div>
          <p className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Despesas (Mês)</p>
          <h3 className="text-2xl font-bold font-serif text-[var(--text-primary)]">R$ 32.150,00</h3>
          <p className="text-xs text-[var(--danger)] flex items-center gap-1 font-medium">
            <ArrowDownRight size={12} />
            -2% vs mês anterior
          </p>
        </div>

        <div className="glass-panel p-4 flex flex-col gap-2 relative overflow-hidden group bg-[var(--primary)] text-white">
          <div className="absolute top-0 right-0 p-4 opacity-10 transition-opacity">
            <DollarSign size={64} />
          </div>
          <p className="text-[11px] font-bold opacity-80 uppercase tracking-wider">Resultado (Lucro)</p>
          <h3 className="text-2xl font-bold font-serif text-white">R$ 52.150,00</h3>
          <p className="text-xs opacity-90 font-medium">Margem Líquida: 61.8%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Placeholder for Charts */}
        <div className="glass-panel p-6 flex flex-col gap-4">
          <h3 className="font-bold text-[var(--text-primary)] border-b border-[var(--border)] pb-2">Receitas vs Despesas (6 meses)</h3>
          <div className="h-64 flex items-center justify-center border border-dashed border-[var(--border)] bg-black/5 rounded-lg text-[var(--text-muted)]">
            [Gráfico de Barras Aqui]
          </div>
        </div>

        <div className="glass-panel p-6 flex flex-col gap-4">
          <h3 className="font-bold text-[var(--text-primary)] border-b border-[var(--border)] pb-2">Despesas por Categoria</h3>
          <div className="h-64 flex items-center justify-center border border-dashed border-[var(--border)] bg-black/5 rounded-lg text-[var(--text-muted)]">
            [Gráfico de Rosca Aqui]
          </div>
        </div>
      </div>
    </div>
  )
}
