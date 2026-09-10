import { createClient } from '@/utils/supabase/server'
import { Plus, Printer, Check, Receipt, CheckCircle, AlertTriangle, DollarSign } from 'lucide-react'
import { payInstallment } from '@/app/app/actions'

function formatMoney(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

export default async function CrediarioPage() {
  const supabase = await createClient()

  // Fetch sales that have forma_pagamento = 'Crediário' or have installments, along with their installments
  const { data: salesWithInstallments } = await supabase
    .from('sales')
    .select(`
      id,
      total,
      customers ( nome ),
      installments (
        id,
        valor,
        data_vencimento,
        status,
        data_pagamento
      )
    `)
    .eq('forma_pagamento', 'Crediário')
    .order('created_at', { ascending: false })

  let totalReceber = 0
  let emDiaCount = 0
  let vencendoCount = 0
  let atrasoCount = 0
  
  const carnes = (salesWithInstallments || []).map(sale => {
    const sortedInstallments = (sale.installments || []).sort((a, b) => new Date(a.data_vencimento).getTime() - new Date(b.data_vencimento).getTime())
    
    let paidCount = 0
    let nextValue = 0
    let nextDate = ''
    let carneStatus = 'Em dia'

    const today = new Date().toISOString().split('T')[0]

    for (const inst of sortedInstallments) {
      if (inst.status === 'pago') {
        paidCount++
      } else {
        if (nextValue === 0) {
          nextValue = inst.valor
          nextDate = inst.data_vencimento
        }
        totalReceber += inst.valor
        
        if (inst.status === 'atrasado' || inst.data_vencimento < today) {
          carneStatus = 'Em atraso'
        } else if (inst.data_vencimento === today) {
          if (carneStatus !== 'Em atraso') carneStatus = 'Vencendo'
        }
      }
    }

    if (carneStatus === 'Em dia') emDiaCount++
    if (carneStatus === 'Vencendo') vencendoCount++
    if (carneStatus === 'Em atraso') atrasoCount++

    return {
      id: sale.id as string,
      customer: (sale.customers as any)?.nome || 'Cliente Removido',
      total: sale.total,
      installments: sortedInstallments,
      paidCount,
      nextValue,
      nextDate,
      status: carneStatus
    }
  }).filter(c => c.installments.length > 0)

  return (
    <div>
      <div className="page-head">
        <div>
          <h2>Carnê / Crediário</h2>
          <p>Controle de carnês da loja: parcelas, vencimentos, baixa de pagamentos e impressão.</p>
        </div>
        <button className="btn btn-primary bg-[var(--primary)] text-white">
          <Plus size={16} /> Novo carnê
        </button>
      </div>

      <div className="carne-stats">
        <div className="kpi">
          <div className="kpi-icon green"><Receipt size={20} /></div>
          <div>
            <div className="kpi-label">Total a receber</div>
            <div className="kpi-value">{formatMoney(totalReceber)}</div>
            <div className="kpi-detail">{carnes.length} carnês ativos</div>
          </div>
        </div>
        <div className="kpi">
          <div className="kpi-icon blue"><CheckCircle size={20} /></div>
          <div>
            <div className="kpi-label">Em dia</div>
            <div className="kpi-value">{emDiaCount}</div>
            <div className="kpi-detail">carnês</div>
          </div>
        </div>
        <div className="kpi">
          <div className="kpi-icon red"><AlertTriangle size={20} /></div>
          <div>
            <div className="kpi-label">Vencendo / Atrasado</div>
            <div className="kpi-value">{vencendoCount + atrasoCount}</div>
            <div className="kpi-detail">precisam de atenção</div>
          </div>
        </div>
        <div className="kpi">
          <div className="kpi-icon gold"><DollarSign size={20} /></div>
          <div>
            <div className="kpi-label">Recebido este mês</div>
            <div className="kpi-value">{formatMoney(0)}</div>
            <div className="kpi-detail">0 parcelas baixadas</div>
          </div>
        </div>
      </div>

      <div className="carne-list">
        {carnes.length > 0 ? carnes.map(c => {
          const badgeClass = c.status === 'Em dia' ? 'badge-success' : c.status === 'Vencendo' ? 'badge-warning' : 'badge-danger'
          
          return (
            <div key={c.id} className="carne-card">
              <div className="carne-header">
                <div className="carne-customer">
                  <b>{c.customer}</b>
                  <small>Venda {c.id.split('-')[0].toUpperCase()}</small>
                </div>
                <div className="carne-meta">
                  <div className="carne-id">Contrato {c.id.substring(0,8).toUpperCase()}</div>
                  <div className="carne-total">{formatMoney(c.total)}</div>
                </div>
              </div>

              <div className="carne-parcelas">
                {c.installments.map((inst, i) => {
                  let sClass = 'upcoming'
                  if (inst.status === 'pago') sClass = 'paid'
                  else if (i === c.paidCount && c.status === 'Em atraso') sClass = 'overdue'
                  else if (i === c.paidCount && c.status === 'Vencendo') sClass = 'current'
                  else if (i === c.paidCount) sClass = 'current'
                  
                  return (
                    <div key={inst.id} className={`parcela ${sClass}`} title={`Parcela ${i + 1}`}>
                      {i + 1}
                    </div>
                  )
                })}
              </div>

              <div className="carne-footer">
                <div className="carne-footer-info">
                  {c.nextValue > 0 ? (
                    <>
                      Próxima parcela: <b>{formatMoney(c.nextValue)}</b> em {new Date(c.nextDate + 'T12:00:00Z').toLocaleDateString('pt-BR')}
                    </>
                  ) : (
                    <b>Quitado</b>
                  )}
                  &nbsp;&nbsp;<span className={`badge ${badgeClass}`}>{c.status}</span>
                </div>
                <div className="carne-actions">
                  <button className="btn btn-outline btn-sm text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                    <Printer size={14} /> Imprimir
                  </button>
                  <form action={payInstallment.bind(null, c.installments[c.paidCount]?.id || '')}>
                    <button type="submit" className="btn btn-primary btn-sm bg-[var(--primary)] text-white" disabled={c.nextValue === 0}>
                      <Check size={14} /> Dar baixa
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )
        }) : (
          <div className="text-center py-10 text-[var(--text-muted)] border border-dashed border-[var(--border)] rounded-[var(--radius)]">
            Nenhum carnê em andamento.
          </div>
        )}
      </div>
    </div>
  )
}
