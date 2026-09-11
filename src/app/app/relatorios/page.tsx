'use client'

import { useState, useEffect } from 'react'
import { BarChart2, TrendingUp, PieChart, Download } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'

export default function RelatoriosPage() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real scenario, this would trigger multiple complex Supabase RPCs or edge functions
    // Since this is just the UI skeleton fetching real initial structures, we just simulate loading
    const timer = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="space-y-6 fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-serif text-[var(--text-primary)]">Relatórios Gerenciais</h1>
          <p className="text-[var(--text-muted)] text-sm">BI e análise de performance da loja</p>
        </div>
        <div className="flex gap-3">
          <button className="btn-secondary flex items-center gap-2">
            <Download size={18} />
            <span className="hidden sm:inline">Exportar Excel</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-panel p-6 flex flex-col items-center justify-center text-center gap-3 cursor-pointer hover:border-[var(--primary)] transition-colors group border-[var(--primary)] bg-[var(--primary)]/5">
          <div className="w-12 h-12 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center group-hover:scale-110 transition-transform">
            <TrendingUp size={24} />
          </div>
          <div>
            <h3 className="font-bold text-[var(--text-primary)]">Curva ABC</h3>
            <p className="text-xs text-[var(--text-muted)] mt-1">Produtos mais vendidos e rentáveis</p>
          </div>
        </div>

        <div className="glass-panel p-6 flex flex-col items-center justify-center text-center gap-3 cursor-pointer hover:border-[var(--info)] transition-colors group">
          <div className="w-12 h-12 rounded-full bg-[var(--info-bg)] text-[var(--info)] flex items-center justify-center group-hover:scale-110 transition-transform">
            <BarChart2 size={24} />
          </div>
          <div>
            <h3 className="font-bold text-[var(--text-primary)]">Vendas por Vendedor</h3>
            <p className="text-xs text-[var(--text-muted)] mt-1">Performance individual da equipe</p>
          </div>
        </div>

        <div className="glass-panel p-6 flex flex-col items-center justify-center text-center gap-3 cursor-pointer hover:border-[var(--warning)] transition-colors group">
          <div className="w-12 h-12 rounded-full bg-[var(--warning-bg)] text-[var(--warning)] flex items-center justify-center group-hover:scale-110 transition-transform">
            <PieChart size={24} />
          </div>
          <div>
            <h3 className="font-bold text-[var(--text-primary)]">Inadimplência</h3>
            <p className="text-xs text-[var(--text-muted)] mt-1">Relatório de carnês atrasados e acordos</p>
          </div>
        </div>
      </div>

      <div className="glass-panel p-6 flex flex-col gap-4">
        <h3 className="font-bold text-[var(--text-primary)] border-b border-[var(--border)] pb-2">Visualização do Relatório (Curva ABC)</h3>
        
        {loading ? (
          <div className="h-96 flex items-center justify-center border border-dashed border-[var(--border)] bg-black/5 rounded-lg text-[var(--text-muted)]">
            Processando bases de dados (Supabase)...
          </div>
        ) : (
          <div className="h-96 flex items-center justify-center border border-dashed border-[var(--border)] bg-black/5 rounded-lg text-[var(--text-muted)] flex-col gap-2 relative overflow-hidden">
            <div className="absolute inset-0 flex items-end p-8 gap-4 opacity-10">
              <div className="w-full h-[60%] bg-[var(--primary)] rounded-t-sm"></div>
              <div className="w-full h-[40%] bg-[var(--primary)] rounded-t-sm"></div>
              <div className="w-full h-[85%] bg-[var(--primary)] rounded-t-sm"></div>
              <div className="w-full h-[30%] bg-[var(--primary)] rounded-t-sm"></div>
              <div className="w-full h-[100%] bg-[var(--primary)] rounded-t-sm"></div>
            </div>
            <TrendingUp size={32} className="opacity-50 relative z-10" />
            <p className="relative z-10 text-center px-4">Os dados completos de BI serão extraídos via Supabase Edge Functions na versão final.<br/>(Exemplo ilustrativo do layout)</p>
          </div>
        )}
      </div>
    </div>
  )
}
