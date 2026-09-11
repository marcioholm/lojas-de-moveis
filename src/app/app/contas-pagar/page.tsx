'use client'

import { useState, useEffect } from 'react'
import { Search, Plus, Filter, CheckCircle, Trash } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'

export default function ContasPagarPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [despesas, setDespesas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDespesas() {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .order('data_vencimento', { ascending: true })
      
      if (!error && data) {
        const formatted = data.map((d: any) => ({
          id: d.id.substring(0, 8).toUpperCase(),
          real_id: d.id,
          fornecedor: d.fornecedor,
          descricao: d.descricao || '-',
          vencimento: new Date(d.data_vencimento).toLocaleDateString('pt-BR'),
          valor: Number(d.valor),
          status: d.status === 'pago' ? 'Pago' : (new Date(d.data_vencimento) < new Date() ? 'Atrasado' : 'A Vencer')
        }))
        setDespesas(formatted)
      }
      setLoading(false)
    }
    fetchDespesas()
  }, [])

  const filteredDespesas = despesas.filter(d => 
    d.fornecedor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.descricao.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6 fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-serif text-[var(--text-primary)]">Contas a Pagar</h1>
          <p className="text-[var(--text-muted)] text-sm">Controle de despesas fixas e fornecedores</p>
        </div>
        <div className="flex gap-3">
          <button className="btn-secondary flex items-center gap-2">
            <Filter size={18} />
            <span className="hidden sm:inline">Filtros</span>
          </button>
          <button className="btn-primary flex items-center gap-2">
            <Plus size={18} />
            <span>Nova Despesa</span>
          </button>
        </div>
      </div>

      <div className="glass-panel p-0 overflow-hidden">
        <div className="p-4 border-b border-[var(--border)] flex items-center gap-4 bg-[var(--bg-inset)]">
          <div className="relative flex-1 max-w-md">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input 
              type="text" 
              placeholder="Buscar por fornecedor, descrição..." 
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
                <th className="p-4 font-semibold">Fornecedor / Categoria</th>
                <th className="p-4 font-semibold">Descrição</th>
                <th className="p-4 font-semibold">Vencimento</th>
                <th className="p-4 font-semibold text-right">Valor</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-[var(--text-muted)]">Carregando despesas...</td>
                </tr>
              ) : filteredDespesas.map((despesa) => (
                <tr key={despesa.real_id} className="border-b border-[var(--border)] hover:bg-black/5 transition-colors group">
                  <td className="p-4 font-medium text-sm text-[var(--text-primary)]">{despesa.fornecedor}</td>
                  <td className="p-4 text-sm text-[var(--text-secondary)]">{despesa.descricao}</td>
                  <td className="p-4 text-sm font-medium text-[var(--text-secondary)]">{despesa.vencimento}</td>
                  <td className="p-4 text-sm font-bold text-[var(--danger)] text-right">R$ {despesa.valor.toFixed(2).replace('.', ',')}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border
                      ${despesa.status === 'Pago' ? 'bg-[var(--success-bg)] text-[var(--success)] border-[var(--success)]/20' : 
                        despesa.status === 'Atrasado' ? 'bg-[var(--danger-bg)] text-[var(--danger)] border-[var(--danger)]/20' :
                        'bg-[var(--warning-bg)] text-[var(--warning)] border-[var(--warning)]/20'}
                    `}>
                      {despesa.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {despesa.status !== 'Pago' && (
                        <button className="p-1.5 text-[var(--text-muted)] hover:text-[var(--success)] hover:bg-[var(--success-bg)] rounded-md transition-colors" title="Dar Baixa">
                          <CheckCircle size={16} />
                        </button>
                      )}
                      <button className="p-1.5 text-[var(--text-muted)] hover:text-[var(--danger)] hover:bg-[var(--danger-bg)] rounded-md transition-colors" title="Excluir">
                        <Trash size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {!loading && filteredDespesas.length === 0 && (
            <div className="p-12 text-center text-[var(--text-muted)]">
              Nenhuma despesa encontrada.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
