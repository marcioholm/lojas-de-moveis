import { DollarSign, Wallet, Package, ClipboardCheck, ArrowUpRight } from 'lucide-react'

function formatMoney(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

export default function DashboardPage() {
  return (
    <div>
      <div className="page-head">
        <div>
          <h2>Visão Geral</h2>
          <p>Resumo das suas vendas e métricas do dia</p>
        </div>
      </div>

      <div className="dash-hero">
        <div className="revenue-card">
          <div className="revenue-eyebrow">FATURAMENTO MENSAL</div>
          <div className="revenue-amount">{formatMoney(24870)}</div>
          <div className="revenue-delta">
            <b>+14%</b> em relação ao mês passado
          </div>
          <div className="revenue-bars">
            <i style={{ height: '40%' }}></i>
            <i style={{ height: '60%' }}></i>
            <i style={{ height: '30%' }}></i>
            <i style={{ height: '80%' }}></i>
            <i style={{ height: '50%' }}></i>
            <i style={{ height: '90%' }}></i>
            <i style={{ height: '100%' }}></i>
          </div>
        </div>

        <div className="goal-card">
          <div className="goal-header">
            <small>META DO MÊS</small>
            <b>78%</b>
          </div>
          <div className="goal-track">
            <div className="goal-fill" style={{ width: '78%' }}></div>
          </div>
          <div className="goal-footer flex justify-between mt-1">
            <span>Falta {formatMoney(7130)}</span>
            <span>Meta: {formatMoney(32000)}</span>
          </div>
        </div>
      </div>

      <div className="kpis">
        <div className="kpi">
          <div className="kpi-icon green">
            <DollarSign size={20} />
          </div>
          <div>
            <div className="kpi-label">Vendas hoje</div>
            <div className="kpi-value">{formatMoney(1850)}</div>
            <div className="kpi-detail">3 pedidos finalizados</div>
          </div>
        </div>
        <div className="kpi">
          <div className="kpi-icon blue">
            <ClipboardCheck size={20} />
          </div>
          <div>
            <div className="kpi-label">Aprovação</div>
            <div className="kpi-value">2</div>
            <div className="kpi-detail">Pedidos pendentes</div>
          </div>
        </div>
        <div className="kpi">
          <div className="kpi-icon gold">
            <Package size={20} />
          </div>
          <div>
            <div className="kpi-label">Valor em estoque</div>
            <div className="kpi-value">{formatMoney(124000)}</div>
            <div className="kpi-detail">648 unidades</div>
          </div>
        </div>
        <div className="kpi">
          <div className="kpi-icon red">
            <Wallet size={20} />
          </div>
          <div>
            <div className="kpi-label">Crediário atrasado</div>
            <div className="kpi-value">4</div>
            <div className="kpi-detail">Parcelas vencidas</div>
          </div>
        </div>
      </div>
    </div>
  )
}
