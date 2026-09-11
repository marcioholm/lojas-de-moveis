'use client'

import { useState, useEffect } from 'react'
import { Search, Plus, Filter, CalendarDays, Wrench, FileText, CheckCircle } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'

export default function OrdensPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [ordens, setOrdens] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchOrdens() {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('service_orders')
        .select(`
          id,
          tipo,
          data_agendada,
          equipe,
          status,
          customers ( nome ),
          products ( nome )
        `)
        .order('data_agendada', { ascending: true })
      
      if (!error && data) {
        const formatted = data.map((o: any) => ({
          id: o.id.substring(0, 8).toUpperCase(),
          real_id: o.id,
          cliente: o.customers?.nome || 'Cliente não encontrado',
          servico: o.tipo === 'montagem' ? 'Montagem' : o.tipo === 'assistencia' ? 'Assistência' : o.tipo === 'entrega' ? 'Entrega' : 'Outro',
          produto: o.products?.nome || 'Não especificado',
          dataAgendada: new Date(o.data_agendada).toLocaleDateString('pt-BR'),
          equipe: o.equipe || 'A Definir',
          status: o.status === 'pendente' ? 'Agendado' : o.status === 'em_andamento' ? 'Em Andamento' : o.status === 'concluida' ? 'Concluído' : 'Cancelada'
        }))
        setOrdens(formatted)
      }
      setLoading(false)
    }
    fetchOrdens()
  }, [])

  const filteredOrdens = ordens.filter(o => 
    o.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.id.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6 fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-serif text-[var(--text-primary)]">Ordens de Serviço</h1>
          <p className="text-[var(--text-muted)] text-sm">Controle de montagens e assistências técnicas</p>
        </div>
        <div className="flex gap-3">
          <button className="btn-secondary flex items-center gap-2">
            <Filter size={18} />
            <span className="hidden sm:inline">Filtros</span>
          </button>
          <button className="btn-primary flex items-center gap-2">
            <Plus size={18} />
            <span>Nova OS</span>
          </button>
        </div>
      </div>

      <div className="glass-panel p-0 overflow-hidden">
        <div className="p-4 border-b border-[var(--border)] flex items-center gap-4 bg-[var(--bg-inset)]">
          <div className="relative flex-1 max-w-md">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input 
              type="text" 
              placeholder="Buscar por cliente, OS..." 
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
                <th className="p-4 font-semibold">OS ID</th>
                <th className="p-4 font-semibold">Cliente / Produto</th>
                <th className="p-4 font-semibold">Serviço</th>
                <th className="p-4 font-semibold">Data Agendada</th>
                <th className="p-4 font-semibold">Equipe</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-[var(--text-muted)]">Carregando ordens de serviço...</td>
                </tr>
              ) : filteredOrdens.map((os) => (
                <tr key={os.real_id} className="border-b border-[var(--border)] hover:bg-black/5 transition-colors group">
                  <td className="p-4">
                    <span className="font-mono text-sm font-bold text-[var(--primary)]">OS-{os.id}</span>
                  </td>
                  <td className="p-4">
                    <p className="text-sm font-medium text-[var(--text-primary)]">{os.cliente}</p>
                    <p className="text-xs text-[var(--text-secondary)]">{os.produto}</p>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1.5 text-sm text-[var(--text-secondary)]">
                      <Wrench size={14} />
                      {os.servico}
                    </div>
                  </td>
                  <td className="p-4 text-sm font-medium text-[var(--text-secondary)]">{os.dataAgendada}</td>
                  <td className="p-4 text-sm text-[var(--text-secondary)]">{os.equipe}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border
                      ${os.status === 'Concluído' ? 'bg-[var(--success-bg)] text-[var(--success)] border-[var(--success)]/20' : 
                        os.status === 'Agendado' ? 'bg-[var(--info-bg)] text-[var(--info)] border-[var(--info)]/20' :
                        os.status === 'Em Andamento' ? 'bg-[var(--warning-bg)] text-[var(--warning)] border-[var(--warning)]/20' :
                        'bg-[var(--danger-bg)] text-[var(--danger)] border-[var(--danger)]/20'}
                    `}>
                      {os.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {os.status !== 'Concluído' && (
                        <button className="p-1.5 text-[var(--text-muted)] hover:text-[var(--success)] hover:bg-[var(--success-bg)] rounded-md transition-colors" title="Marcar como Concluído">
                          <CheckCircle size={16} />
                        </button>
                      )}
                      <button className="p-1.5 text-[var(--text-muted)] hover:text-[var(--primary)] hover:bg-[var(--primary)]/10 rounded-md transition-colors" title="Ver Detalhes">
                        <FileText size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {!loading && filteredOrdens.length === 0 && (
            <div className="p-12 text-center text-[var(--text-muted)]">
              Nenhuma ordem de serviço agendada.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
