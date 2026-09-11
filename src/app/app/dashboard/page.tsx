import { DollarSign, Wallet, Package, ClipboardCheck, TrendingUp, ChevronRight } from 'lucide-react'
import Link from 'next/link'

function formatMoney(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Visão Geral</h2>
          <p className="text-gray-500 text-sm">Resumo das suas vendas e métricas do dia</p>
        </div>
        <div className="flex items-center gap-3">
          <Link 
            href="/app/pdv" 
            className="px-4 py-2 bg-[var(--primary)] text-white text-sm font-medium rounded-lg shadow-sm hover:bg-[var(--primary-hover)] transition-colors flex items-center gap-2"
          >
            Nova Venda
            <ChevronRight size={16} />
          </Link>
        </div>
      </div>

      {/* Hero Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Faturamento Mensal */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-green-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 opacity-50"></div>
          
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              <p className="text-xs font-bold tracking-wider text-gray-500 uppercase mb-2">Faturamento Mensal</p>
              <div className="flex items-baseline gap-4">
                <h3 className="text-4xl font-bold text-gray-900 tracking-tight">{formatMoney(24870)}</h3>
                <span className="flex items-center gap-1 text-sm font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                  <TrendingUp size={14} />
                  +14%
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">em relação ao mês passado</p>
            </div>
            
            {/* Fake Chart Bars */}
            <div className="flex items-end gap-2 h-24 mt-8 pt-4 border-t border-gray-50">
              {[40, 60, 30, 80, 50, 90, 100].map((height, i) => (
                <div key={i} className="flex-1 bg-gray-100 rounded-t-sm hover:bg-[var(--primary)]/20 transition-colors cursor-pointer group relative">
                  <div 
                    className="absolute bottom-0 w-full bg-[var(--primary)] rounded-t-sm transition-all duration-500 ease-out group-hover:bg-[var(--accent)]"
                    style={{ height: `${height}%` }}
                  ></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Meta do Mês */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <p className="text-xs font-bold tracking-wider text-gray-500 uppercase">Meta do Mês</p>
              <span className="text-2xl font-bold text-[var(--primary)]">78%</span>
            </div>
            
            {/* Progress Bar */}
            <div className="relative w-full h-4 bg-gray-100 rounded-full overflow-hidden mb-4">
              <div 
                className="absolute top-0 left-0 h-full bg-[var(--primary)] rounded-full transition-all duration-1000"
                style={{ width: '78%' }}
              ></div>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Falta <strong className="text-gray-900">{formatMoney(7130)}</strong></span>
              <span className="text-gray-500">Meta: {formatMoney(32000)}</span>
            </div>
          </div>
          
          <div className="mt-8 p-4 bg-orange-50 rounded-xl border border-orange-100">
            <p className="text-sm font-medium text-orange-800">
              Faltam apenas 6 dias para o fim do mês. 
            </p>
          </div>
        </div>
      </div>

      {/* KPIs Secundários */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center shrink-0">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase mb-1">Vendas hoje</p>
            <h4 className="text-xl font-bold text-gray-900">{formatMoney(1850)}</h4>
            <p className="text-xs text-gray-500 mt-1">3 pedidos finalizados</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <ClipboardCheck size={24} />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase mb-1">Aprovação</p>
            <h4 className="text-xl font-bold text-gray-900">2</h4>
            <p className="text-xs text-gray-500 mt-1">Pedidos pendentes</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center shrink-0">
            <Package size={24} />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase mb-1">Valor em estoque</p>
            <h4 className="text-xl font-bold text-gray-900">{formatMoney(124000)}</h4>
            <p className="text-xs text-gray-500 mt-1">648 unidades</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
            <Wallet size={24} />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase mb-1">Crediário atrasado</p>
            <h4 className="text-xl font-bold text-gray-900">4</h4>
            <p className="text-xs text-gray-500 mt-1">Parcelas vencidas</p>
          </div>
        </div>
      </div>
    </div>
  )
}
