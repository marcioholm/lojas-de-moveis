import { createClient } from '@/utils/supabase/server'
import { Truck, Check, PackageOpen, ChevronRight } from 'lucide-react'

export default async function EntregasPage() {
  const supabase = await createClient()

  // Fetch deliveries with customer and product information via sales
  const { data: deliveries } = await supabase
    .from('deliveries')
    .select(`
      id,
      status,
      created_at,
      motorista,
      sales (
        id,
        customers (
          nome,
          endereco
        ),
        sale_items (
          quantidade,
          products ( nome )
        )
      )
    `)
    .order('created_at', { ascending: false })

  const separacaoCount = deliveries?.filter(d => d.status === 'separacao').length || 0
  const rotaCount = deliveries?.filter(d => d.status === 'rota').length || 0
  const entregueCount = deliveries?.filter(d => d.status === 'entregue').length || 0

  const statusLabel = { separacao: 'Em separação', rota: 'Em trânsito', entregue: 'Entregue' }
  const statusBadge = { separacao: 'badge-info', rota: 'badge-warning', entregue: 'badge-success' }
  const statusIconClass = { separacao: 'bg-[var(--info-bg)] text-[var(--info)]', rota: 'bg-[var(--warning-bg)] text-[var(--warning)]', entregue: 'bg-[var(--success-bg)] text-[var(--success)]' }
  
  const steps = ['separacao', 'rota', 'entregue']

  return (
    <div>
      <div className="page-head">
        <div>
          <h2>Controle de entregas</h2>
          <p>Acompanhe o status das entregas dos móveis: separação, rota e confirmação.</p>
        </div>
      </div>

      <div className="kpis" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        <div className="kpi">
          <div className="kpi-icon blue"><PackageOpen size={20} /></div>
          <div>
            <div className="kpi-label">Em Separação</div>
            <div className="kpi-value">{separacaoCount}</div>
            <div className="kpi-detail">Aguardando saída</div>
          </div>
        </div>
        <div className="kpi">
          <div className="kpi-icon gold"><Truck size={20} /></div>
          <div>
            <div className="kpi-label">Em trânsito</div>
            <div className="kpi-value">{rotaCount}</div>
            <div className="kpi-detail">A caminho</div>
          </div>
        </div>
        <div className="kpi">
          <div className="kpi-icon green"><Check size={20} /></div>
          <div>
            <div className="kpi-label">Entregues</div>
            <div className="kpi-value">{entregueCount}</div>
            <div className="kpi-detail">Concluídas</div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 mt-5">
        {deliveries && deliveries.length > 0 ? (
          deliveries.map((d: any) => {
            const customer = d.sales?.customers?.nome || 'Cliente não informado'
            const address = d.sales?.customers?.endereco || 'Endereço não informado'
            
            // Format products list
            const items = d.sales?.sale_items || []
            const productNames = items.map((i: any) => `${i.quantidade}x ${i.products?.nome}`).join(', ') || 'Produtos da Venda'
            
            const currentIdx = steps.indexOf(d.status)

            return (
              <div key={d.id} className="delivery-card" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
                <div className="flex items-center gap-4">
                  <div className={`delivery-status-icon ${statusIconClass[d.status as keyof typeof statusIconClass]}`}>
                    <Truck size={18} />
                  </div>
                  <div className="delivery-info">
                    <b>{customer}</b>
                    <small>{productNames}</small>
                    <small className="text-[var(--text-muted)]">{address}</small>
                  </div>
                  <div className="delivery-right">
                    <span className={`badge ${statusBadge[d.status as keyof typeof statusBadge]}`}>
                      {statusLabel[d.status as keyof typeof statusLabel]}
                    </span>
                    <div className="text-[11px] text-[var(--text-muted)] mt-1">
                      {new Date(d.created_at).toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                </div>

                <div className="delivery-steps">
                  {steps.map((s, i) => {
                    const done = i <= currentIdx
                    const active = i === currentIdx
                    return (
                      <div key={s} className="flex items-center" style={{ flex: i === 0 ? '0' : '1' }}>
                        {i > 0 && <div className={`delivery-line ${done ? 'done' : ''}`} style={{ width: '100%' }}></div>}
                        <div className={`delivery-step ${done && !active ? 'done' : ''} ${active ? 'active' : ''}`} title={statusLabel[s as keyof typeof statusLabel]}>
                          {done ? '✓' : i + 1}
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="flex gap-2 justify-end mt-2">
                  {d.status === 'separacao' && (
                    <button className="btn btn-primary btn-sm bg-[var(--primary)] text-white">
                      <Truck size={14} /> Marcar saída
                    </button>
                  )}
                  {d.status === 'rota' && (
                    <button className="btn btn-primary btn-sm bg-[var(--success)] border-[var(--success)] text-white hover:bg-[var(--success-bg)] hover:text-[var(--success)]">
                      <Check size={14} /> Confirmar entrega
                    </button>
                  )}
                  {d.status === 'entregue' && (
                    <span className="text-[11px] text-[var(--success)] font-semibold flex items-center gap-1">
                      <Check size={14} /> Entrega concluída
                    </span>
                  )}
                </div>
              </div>
            )
          })
        ) : (
          <div className="text-center py-10 text-[var(--text-muted)] border border-dashed border-[var(--border)] rounded-[var(--radius)]">
            Nenhuma entrega agendada.
          </div>
        )}
      </div>
    </div>
  )
}
