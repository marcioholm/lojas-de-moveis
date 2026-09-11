import { createClient } from '@/utils/supabase/server'
import { DollarSign, Wallet, Package, ClipboardCheck, TrendingUp, TrendingDown, ChevronRight } from 'lucide-react'
import Link from 'next/link'

function formatMoney(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

export default async function DashboardPage() {
  const supabase = await createClient()

  // Get current month boundaries
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString()
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString()
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0).toISOString()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()

  // Fetch this month's sales
  const { data: monthSales } = await supabase
    .from('sales')
    .select('total, created_at, status')
    .gte('created_at', startOfMonth)
    .lte('created_at', endOfMonth)
    .in('status', ['aprovado', 'finalizado'])

  // Fetch last month's sales for comparison
  const { data: lastMonthSales } = await supabase
    .from('sales')
    .select('total')
    .gte('created_at', startOfLastMonth)
    .lte('created_at', endOfLastMonth)
    .in('status', ['aprovado', 'finalizado'])

  // Fetch today's sales
  const { data: todaySales } = await supabase
    .from('sales')
    .select('total')
    .gte('created_at', todayStart)
    .in('status', ['aprovado', 'finalizado'])

  // Fetch pending approval orders
  const { data: pendingOrders } = await supabase
    .from('sales')
    .select('id')
    .eq('status', 'pendente_aprovacao')

  // Fetch stock summary
  const { data: products } = await supabase
    .from('products')
    .select('preco_venda, estoque_atual')

  // Fetch overdue installments
  const { data: overdueInstallments } = await supabase
    .from('installments')
    .select('id')
    .eq('status', 'pendente')
    .lt('data_vencimento', now.toISOString().split('T')[0])

  // Calculate metrics
  const faturamentoMensal = (monthSales || []).reduce((sum, s) => sum + Number(s.total), 0)
  const faturamentoMesPassado = (lastMonthSales || []).reduce((sum, s) => sum + Number(s.total), 0)
  const percentChange = faturamentoMesPassado > 0
    ? Math.round(((faturamentoMensal - faturamentoMesPassado) / faturamentoMesPassado) * 100)
    : 0

  const vendasHoje = (todaySales || []).reduce((sum, s) => sum + Number(s.total), 0)
  const pedidosHoje = (todaySales || []).length

  const pendingCount = (pendingOrders || []).length

  const totalEstoqueValor = (products || []).reduce((sum, p) => sum + (Number(p.preco_venda) * Number(p.estoque_atual)), 0)
  const totalEstoqueUnidades = (products || []).reduce((sum, p) => sum + Number(p.estoque_atual), 0)

  const overdueCount = (overdueInstallments || []).length

  // Get tenant goal from config
  const { data: tenant } = await supabase.from('tenants').select('config').single()
  const meta = tenant?.config?.meta_mensal || 30000
  const percentMeta = meta > 0 ? Math.min(Math.round((faturamentoMensal / meta) * 100), 100) : 0
  const faltaMeta = Math.max(meta - faturamentoMensal, 0)

  // Days left in month
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
  const daysLeft = lastDay - now.getDate()

  // Weekly chart data (simplified: group current month sales by week)
  const weeklyData = [0, 0, 0, 0, 0]
  ;(monthSales || []).forEach(s => {
    const day = new Date(s.created_at).getDate()
    const week = Math.min(Math.floor((day - 1) / 7), 4)
    weeklyData[week] += Number(s.total)
  })
  const maxWeekly = Math.max(...weeklyData, 1)
  const weeklyPercents = weeklyData.map(v => Math.round((v / maxWeekly) * 100))

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
                <h3 className="text-4xl font-bold text-gray-900 tracking-tight">{formatMoney(faturamentoMensal)}</h3>
                {percentChange !== 0 && (
                  <span className={`flex items-center gap-1 text-sm font-medium px-2 py-0.5 rounded-full ${
                    percentChange >= 0
                      ? 'text-green-600 bg-green-50'
                      : 'text-red-600 bg-red-50'
                  }`}>
                    {percentChange >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                    {percentChange >= 0 ? '+' : ''}{percentChange}%
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-1">em relação ao mês passado</p>
            </div>

            {/* Weekly Chart Bars */}
            <div className="flex items-end gap-2 h-24 mt-8 pt-4 border-t border-gray-50">
              {weeklyPercents.map((height, i) => (
                <div key={i} className="flex-1 bg-gray-100 rounded-t-sm hover:bg-[var(--primary)]/20 transition-colors cursor-pointer group relative">
                  <div
                    className="absolute bottom-0 w-full bg-[var(--primary)] rounded-t-sm transition-all duration-500 ease-out group-hover:bg-[var(--accent)]"
                    style={{ height: `${Math.max(height, 4)}%` }}
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
              <span className="text-2xl font-bold text-[var(--primary)]">{percentMeta}%</span>
            </div>

            {/* Progress Bar */}
            <div className="relative w-full h-4 bg-gray-100 rounded-full overflow-hidden mb-4">
              <div
                className="absolute top-0 left-0 h-full bg-[var(--primary)] rounded-full transition-all duration-1000"
                style={{ width: `${percentMeta}%` }}
              ></div>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Falta <strong className="text-gray-900">{formatMoney(faltaMeta)}</strong></span>
              <span className="text-gray-500">Meta: {formatMoney(meta)}</span>
            </div>
          </div>

          {daysLeft <= 10 && (
            <div className="mt-8 p-4 bg-orange-50 rounded-xl border border-orange-100">
              <p className="text-sm font-medium text-orange-800">
                {daysLeft === 0 ? 'Último dia do mês!' : `Faltam apenas ${daysLeft} dias para o fim do mês.`}
              </p>
            </div>
          )}
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
            <h4 className="text-xl font-bold text-gray-900">{formatMoney(vendasHoje)}</h4>
            <p className="text-xs text-gray-500 mt-1">{pedidosHoje} pedido{pedidosHoje !== 1 ? 's' : ''} finalizado{pedidosHoje !== 1 ? 's' : ''}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <ClipboardCheck size={24} />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase mb-1">Aprovação</p>
            <h4 className="text-xl font-bold text-gray-900">{pendingCount}</h4>
            <p className="text-xs text-gray-500 mt-1">Pedido{pendingCount !== 1 ? 's' : ''} pendente{pendingCount !== 1 ? 's' : ''}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Package size={24} />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase mb-1">Valor em estoque</p>
            <h4 className="text-xl font-bold text-gray-900">{formatMoney(totalEstoqueValor)}</h4>
            <p className="text-xs text-gray-500 mt-1">{totalEstoqueUnidades} unidades</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
            <Wallet size={24} />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase mb-1">Crediário atrasado</p>
            <h4 className="text-xl font-bold text-gray-900">{overdueCount}</h4>
            <p className="text-xs text-gray-500 mt-1">Parcela{overdueCount !== 1 ? 's' : ''} vencida{overdueCount !== 1 ? 's' : ''}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
