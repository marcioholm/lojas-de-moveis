import { createClient } from '@/utils/supabase/server'
import { Plus, Download, ShoppingCart, ClipboardList, DollarSign, Eye } from 'lucide-react'
import Link from 'next/link'
import { SaleModal } from '@/components/modals/SaleModal'

function formatMoney(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

export default async function VendasPage() {
  const supabase = await createClient()

  // Fetch sales joined with customers
  const { data: sales } = await supabase
    .from('sales')
    .select(`
      id,
      status,
      total,
      forma_pagamento,
      created_at,
      customers (
        nome
      )
    `)
    .order('created_at', { ascending: false })

  // Calculate KPIs from real data
  const totalVendido = (sales || [])
    .filter(s => s.status === 'aprovado' || s.status === 'finalizado')
    .reduce((sum, s) => sum + Number(s.total), 0)

  const totalRecebido = (sales || [])
    .filter(s => s.status === 'finalizado')
    .reduce((sum, s) => sum + Number(s.total), 0)

  // Count pending installments
  const { data: pendingInstallments } = await supabase
    .from('installments')
    .select('id')
    .eq('status', 'pendente')

  const boletosAberto = (pendingInstallments || []).length

  return (
    <div>
      <div className="page-head">
        <div>
          <h2>Vendas</h2>
          <p>Registre vendas, acompanhe boletos internos e dê baixa nos recebimentos.</p>
        </div>
        <div className="flex gap-2 flex-wrap mt-4 sm:mt-0">
          <button className="btn btn-outline text-[var(--text-primary)]">
            <Download size={16} /> Exportar
          </button>
          <Link href="?modal=sale" className="btn btn-primary bg-[var(--primary)] text-white no-underline">
            <Plus size={16} /> Nova venda
          </Link>
        </div>
      </div>

      <SaleModal />

      <div className="kpis" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        <div className="kpi">
          <div className="kpi-icon green">
            <ShoppingCart size={20} />
          </div>
          <div>
            <div className="kpi-label">Vendido</div>
            <div className="kpi-value">{formatMoney(totalVendido)}</div>
            <div className="kpi-detail">No período</div>
          </div>
        </div>
        <div className="kpi">
          <div className="kpi-icon blue">
            <ClipboardList size={20} />
          </div>
          <div>
            <div className="kpi-label">Boletos internos</div>
            <div className="kpi-value">{boletosAberto}</div>
            <div className="kpi-detail">Em aberto</div>
          </div>
        </div>
        <div className="kpi">
          <div className="kpi-icon gold">
            <DollarSign size={20} />
          </div>
          <div>
            <div className="kpi-label">Recebido</div>
            <div className="kpi-value">{formatMoney(totalRecebido)}</div>
            <div className="kpi-detail">No período</div>
          </div>
        </div>
      </div>

      <div className="panel table-panel">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID Venda</th>
              <th>Cliente</th>
              <th>Status</th>
              <th>Pagamento</th>
              <th className="num">Total</th>
              <th>Data</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {sales && sales.length > 0 ? (
              sales.map((s) => (
                <tr key={s.id}>
                  <td><b>{(s.id as string).split('-')[0].toUpperCase()}</b></td>
                  <td>{(s.customers as any)?.nome || 'Cliente não informado'}</td>
                  <td>
                    <span className={`badge ${
                      s.status === 'finalizado' ? 'badge-success' :
                      s.status === 'aprovado' ? 'badge-info' :
                      s.status === 'rejeitado' ? 'badge-danger' : 'badge-warning'
                    }`}>
                      {s.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td>{s.forma_pagamento || '—'}</td>
                  <td className="num"><b>{formatMoney(s.total)}</b></td>
                  <td>{new Date(s.created_at).toLocaleDateString('pt-BR')}</td>
                  <td className="text-right">
                    <button className="btn btn-outline btn-sm text-[var(--text-muted)] hover:text-[var(--text-primary)]" title="Ver detalhes">
                      <Eye size={14} /> Detalhes
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center py-10 text-[var(--text-muted)]">
                  Nenhuma venda registrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
