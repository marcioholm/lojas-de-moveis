'use client'

import { useState, useEffect } from 'react'
import { Search, Plus, Filter, Printer, CheckCircle, AlertCircle } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'

export default function CrediarioPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [parcelas, setParcelas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchParcelas() {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('installments')
        .select(`
          id,
          valor,
          data_vencimento,
          status,
          sales ( id ),
          customers ( nome )
        `)
        .order('data_vencimento', { ascending: true })
      
      if (!error && data) {
        const formatted = data.map((p: any) => {
          const isLate = p.status === 'pendente' && new Date(p.data_vencimento) < new Date()
          const venc = new Date(p.data_vencimento)
          const hoje = new Date()
          const diffTime = Math.abs(hoje.getTime() - venc.getTime())
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
          
          return {
            id: p.id.substring(0, 8).toUpperCase(),
            real_id: p.id,
            vendaRef: `VD-${(p.sales?.id || '00000000').substring(0, 8).toUpperCase()}`,
            cliente: p.customers?.nome || 'Cliente não encontrado',
            vencimento: venc.toLocaleDateString('pt-BR'),
            valor: Number(p.valor),
            status: p.status === 'pago' ? 'Pago' : isLate ? 'Atrasado' : 'A Vencer',
            diasAtraso: isLate ? diffDays : 0
          }
        })
        setParcelas(formatted)
      }
      setLoading(false)
    }
    fetchParcelas()
  }, [])

  const filteredParcelas = parcelas.filter(p => 
    p.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.vendaRef.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6 fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-serif text-[var(--text-primary)]">Crediário e Carnês</h1>
          <p className="text-[var(--text-muted)] text-sm">Gestão de parcelas e recebimentos da loja</p>
        </div>
        <div className="flex gap-3">
          <button className="btn-secondary flex items-center gap-2">
            <Filter size={18} />
            <span className="hidden sm:inline">Filtros</span>
          </button>
          <button className="btn-primary flex items-center gap-2">
            <Plus size={18} />
            <span>Gerar Carnê</span>
          </button>
        </div>
      </div>

      <div className="glass-panel p-0 overflow-hidden">
        <div className="p-4 border-b border-[var(--border)] flex items-center gap-4 bg-[var(--bg-inset)]">
          <div className="relative flex-1 max-w-md">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input 
              type="text" 
              placeholder="Buscar por cliente, venda..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/50 border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--border)] bg-black/5 text-[11px] uppercase tracking-wider text-[var(--text-muted)]">
                <th className="p-4 font-semibold">Cliente</th>
                <th className="p-4 font-semibold">Venda Ref.</th>
                <th className="p-4 font-semibold">Vencimento</th>
                <th className="p-4 font-semibold text-right">Valor</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-[var(--text-muted)]">Carregando crediário...</td>
                </tr>
              ) : filteredParcelas.map((parcela) => (
                <tr key={parcela.real_id} className={`border-b border-[var(--border)] hover:bg-black/5 transition-colors group ${parcela.status === 'Atrasado' ? 'bg-[var(--danger-bg)]/20' : ''}`}>
                  <td className="p-4 font-medium text-sm text-[var(--text-primary)]">{parcela.cliente}</td>
                  <td className="p-4 text-sm text-[var(--primary)] font-mono">{parcela.vendaRef}</td>
                  <td className="p-4 text-sm font-medium text-[var(--text-secondary)]">{parcela.vencimento}</td>
                  <td className="p-4 text-sm font-bold text-[var(--text-primary)] text-right">R$ {parcela.valor.toFixed(2).replace('.', ',')}</td>
                  <td className="p-4">
                    {parcela.status === 'Atrasado' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border bg-[var(--danger-bg)] text-[var(--danger)] border-[var(--danger)]/20">
                        <AlertCircle size={12} />
                        Atrasado ({parcela.diasAtraso} dias)
                      </span>
                    ) : (
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border
                        ${parcela.status === 'Pago' ? 'bg-[var(--success-bg)] text-[var(--success)] border-[var(--success)]/20' : 
                          'bg-[var(--warning-bg)] text-[var(--warning)] border-[var(--warning)]/20'}
                      `}>
                        {parcela.status}
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {parcela.status !== 'Pago' && (
                        <button className="p-1.5 text-[var(--text-muted)] hover:text-[var(--success)] hover:bg-[var(--success-bg)] rounded-md transition-colors" title="Baixar Parcela">
                          <CheckCircle size={16} />
                        </button>
                      )}
                      <button className="p-1.5 text-[var(--text-muted)] hover:text-[var(--primary)] hover:bg-[var(--primary)]/10 rounded-md transition-colors" title="Imprimir Recibo">
                        <Printer size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {!loading && filteredParcelas.length === 0 && (
            <div className="p-12 text-center text-[var(--text-muted)]">
              Nenhuma parcela encontrada.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
