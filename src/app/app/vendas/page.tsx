'use client'

import { useState, useEffect } from 'react'
import { Search, Plus, Filter, FileText, ArrowUpRight } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'

export default function VendasPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [sales, setSales] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSales() {
      const supabase = createClient()
      // Real life: JOIN with customers to get the name, and profiles to get the seller name.
      const { data, error } = await supabase
        .from('sales')
        .select(`
          id,
          total,
          forma_pagamento,
          status,
          created_at,
          customers ( nome ),
          profiles ( nome )
        `)
        .order('created_at', { ascending: false })
      
      if (!error && data) {
        // Map data to match the UI structure
        const formatted = data.map((item: any) => ({
          id: item.id.substring(0, 8).toUpperCase(),
          real_id: item.id,
          cliente: item.customers?.nome || 'Cliente não encontrado',
          vendedor: item.profiles?.nome || 'Não atribuído',
          data: new Date(item.created_at).toLocaleString('pt-BR'),
          valor: Number(item.total),
          formaPagamento: item.forma_pagamento || 'N/A',
          status: item.status === 'pendente_aprovacao' ? 'Aguardando Análise' : 
                  item.status === 'aprovado' ? 'Aprovada' :
                  item.status === 'rejeitado' ? 'Cancelada' : 'Finalizado'
        }))
        setSales(formatted)
      }
      setLoading(false)
    }
    fetchSales()
  }, [])

  const filteredSales = sales.filter(s => 
    s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.cliente.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-serif text-[var(--text-primary)]">Gestão de Vendas</h1>
          <p className="text-[var(--text-muted)] text-sm">Acompanhamento e aprovação de vendas</p>
        </div>
        <div className="flex gap-3">
          <button className="btn-secondary flex items-center gap-2">
            <Filter size={18} />
            <span className="hidden sm:inline">Filtros</span>
          </button>
          <button className="btn-primary flex items-center gap-2">
            <Plus size={18} />
            <span>Nova Venda Manual</span>
          </button>
        </div>
      </div>

      {/* Stats Cards - for now static numbers until we build the real dashboard logic */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-panel p-4 flex flex-col gap-2 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <FileText size={64} />
          </div>
          <p className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Vendas Hoje</p>
          <h3 className="text-2xl font-bold font-serif text-[var(--text-primary)]">{sales.length}</h3>
        </div>
        <div className="glass-panel p-4 flex flex-col gap-2 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <FileText size={64} />
          </div>
          <p className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Faturamento Hoje</p>
          <h3 className="text-2xl font-bold font-serif text-[var(--text-primary)]">
            R$ {sales.reduce((acc, curr) => acc + curr.valor, 0).toFixed(2).replace('.', ',')}
          </h3>
        </div>
        <div className="glass-panel p-4 flex flex-col gap-2 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <FileText size={64} />
          </div>
          <p className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Ticket Médio</p>
          <h3 className="text-2xl font-bold font-serif text-[var(--text-primary)]">
            R$ {(sales.length > 0 ? (sales.reduce((acc, curr) => acc + curr.valor, 0) / sales.length) : 0).toFixed(2).replace('.', ',')}
          </h3>
        </div>
        <div className="glass-panel p-4 flex flex-col gap-2 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <FileText size={64} />
          </div>
          <p className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Aguardando Análise</p>
          <h3 className="text-2xl font-bold font-serif text-[var(--warning)]">
            {sales.filter(s => s.status === 'Aguardando Análise').length}
          </h3>
        </div>
      </div>

      {/* Glass Panel */}
      <div className="glass-panel p-0 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-[var(--border)] flex items-center gap-4 bg-[var(--bg-inset)]">
          <div className="relative flex-1 max-w-md">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input 
              type="text" 
              placeholder="Buscar por ID, Cliente..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/50 border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--border)] bg-black/5 text-[11px] uppercase tracking-wider text-[var(--text-muted)]">
                <th className="p-4 font-semibold">ID</th>
                <th className="p-4 font-semibold">Cliente</th>
                <th className="p-4 font-semibold">Vendedor</th>
                <th className="p-4 font-semibold">Data/Hora</th>
                <th className="p-4 font-semibold">Pagamento</th>
                <th className="p-4 font-semibold text-right">Valor</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-[var(--text-muted)]">Carregando vendas...</td>
                </tr>
              ) : filteredSales.map((sale) => (
                <tr key={sale.real_id} className="border-b border-[var(--border)] hover:bg-black/5 transition-colors group">
                  <td className="p-4">
                    <span className="font-mono text-sm font-medium text-[var(--primary)]">VD-{sale.id}</span>
                  </td>
                  <td className="p-4">
                    <p className="text-sm font-medium text-[var(--text-primary)]">{sale.cliente}</p>
                  </td>
                  <td className="p-4 text-sm text-[var(--text-secondary)]">
                    {sale.vendedor}
                  </td>
                  <td className="p-4 text-sm text-[var(--text-secondary)]">
                    {sale.data}
                  </td>
                  <td className="p-4 text-sm text-[var(--text-secondary)]">
                    {sale.formaPagamento}
                  </td>
                  <td className="p-4 text-sm font-bold text-[var(--text-primary)] text-right">
                    R$ {sale.valor.toFixed(2).replace('.', ',')}
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border
                      ${sale.status === 'Aprovada' ? 'bg-[var(--success-bg)] text-[var(--success)] border-[var(--success)]/20' : 
                        sale.status === 'Aguardando Análise' ? 'bg-[var(--warning-bg)] text-[var(--warning)] border-[var(--warning)]/20' : 
                        'bg-[var(--danger-bg)] text-[var(--danger)] border-[var(--danger)]/20'}
                    `}>
                      {sale.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 text-[var(--text-muted)] hover:text-[var(--primary)] hover:bg-[var(--primary)]/10 rounded-md transition-colors" title="Ver Detalhes">
                        <FileText size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {!loading && filteredSales.length === 0 && (
            <div className="p-12 text-center text-[var(--text-muted)]">
              Nenhuma venda encontrada no sistema.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
