'use client'

import { Target, Trophy, TrendingUp } from 'lucide-react'

export default function MetasPage() {
  return (
    <div className="space-y-6 fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-serif text-[var(--text-primary)]">Metas da Loja</h1>
          <p className="text-[var(--text-muted)] text-sm">Acompanhamento de objetivos de vendas do mês</p>
        </div>
        <div className="flex gap-3">
          <select className="bg-white/50 border border-[var(--border)] text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-[var(--primary)]">
            <option>Outubro 2023</option>
            <option>Novembro 2023</option>
          </select>
        </div>
      </div>

      <div className="glass-panel p-6 flex flex-col md:flex-row gap-8 items-center justify-between bg-gradient-to-r from-[var(--bg-inset)] to-[var(--bg-raised)] border-l-4 border-l-[var(--primary)]">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Target className="text-[var(--primary)]" size={24} />
            <h2 className="text-xl font-bold text-[var(--text-primary)]">Meta Global da Loja</h2>
          </div>
          <p className="text-sm text-[var(--text-muted)] mb-6">Faturamento total esperado para o mês atual.</p>
          
          <div className="flex justify-between items-end mb-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">Atingido</p>
              <p className="text-2xl font-bold font-serif text-[var(--primary)]">R$ 84.300,00</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">Objetivo</p>
              <p className="text-xl font-bold text-[var(--text-muted)]">R$ 150.000,00</p>
            </div>
          </div>
          
          <div className="w-full bg-black/10 rounded-full h-4 overflow-hidden relative">
            <div className="bg-[var(--primary)] h-4 rounded-full transition-all duration-1000 ease-out" style={{ width: '56.2%' }}></div>
            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white drop-shadow-md">56.2%</span>
          </div>
        </div>

        <div className="w-full md:w-auto flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-sm border border-[var(--border)]">
          <Trophy size={48} className="text-[var(--warning)] mb-2" />
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] text-center">Faltam</p>
          <p className="text-xl font-bold text-[var(--text-primary)]">R$ 65.700,00</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-6">
          <h3 className="font-bold text-[var(--text-primary)] border-b border-[var(--border)] pb-2 mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-[var(--info)]" />
            Metas Individuais (Vendedores)
          </h3>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-[var(--text-primary)]">Ana Beatriz</span>
                <span className="text-[var(--text-secondary)]">R$ 52.000 / R$ 60.000</span>
              </div>
              <div className="w-full bg-black/10 rounded-full h-2">
                <div className="bg-[var(--info)] h-2 rounded-full" style={{ width: '86%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-[var(--text-primary)]">Carlos Silva</span>
                <span className="text-[var(--text-secondary)]">R$ 45.000 / R$ 50.000</span>
              </div>
              <div className="w-full bg-black/10 rounded-full h-2">
                <div className="bg-[var(--success)] h-2 rounded-full" style={{ width: '90%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-[var(--text-primary)]">Roberto Oliveira</span>
                <span className="text-[var(--text-secondary)]">R$ 28.000 / R$ 40.000</span>
              </div>
              <div className="w-full bg-black/10 rounded-full h-2">
                <div className="bg-[var(--warning)] h-2 rounded-full" style={{ width: '70%' }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-panel p-6">
          <h3 className="font-bold text-[var(--text-primary)] border-b border-[var(--border)] pb-2 mb-4">Campanhas Ativas</h3>
          <div className="space-y-4">
            <div className="p-4 border border-[var(--success)]/30 bg-[var(--success-bg)] rounded-lg">
              <h4 className="font-bold text-[var(--success)] mb-1">Bônus de Estofados</h4>
              <p className="text-sm text-[var(--text-secondary)]">Venda 10 sofás da linha premium e ganhe R$ 500 extras. (Válido até 31/10)</p>
            </div>
            <div className="p-4 border border-[var(--border)] bg-[var(--bg-inset)] rounded-lg">
              <h4 className="font-bold text-[var(--text-primary)] mb-1">Queima de Estoque (Painéis)</h4>
              <p className="text-sm text-[var(--text-secondary)]">Comissão dobrada para a linha de painéis ripados.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
