'use client'

import { useState } from 'react'
import { Search, Plus, Filter, MessageSquare, Phone, MoreHorizontal, Edit, FileText } from 'lucide-react'
import { mockClients } from '@/lib/mockData'

export default function ClientesPage() {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredClients = mockClients.filter(c => 
    c.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.cpf.includes(searchTerm)
  )

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-serif text-[var(--text-primary)]">Carteira de Clientes</h1>
          <p className="text-[var(--text-muted)] text-sm">Gerenciamento de CRM e histórico de compras</p>
        </div>
        <div className="flex gap-3">
          <button className="btn-secondary flex items-center gap-2">
            <Filter size={18} />
            <span className="hidden sm:inline">Filtros</span>
          </button>
          <button className="btn-primary flex items-center gap-2">
            <Plus size={18} />
            <span>Novo Cliente</span>
          </button>
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
              placeholder="Buscar por nome, CPF..." 
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
                <th className="p-4 font-semibold">Cliente</th>
                <th className="p-4 font-semibold">Contato</th>
                <th className="p-4 font-semibold">Localização</th>
                <th className="p-4 font-semibold">Última Compra</th>
                <th className="p-4 font-semibold text-right">Total Comprado</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map((client) => (
                <tr key={client.id} className="border-b border-[var(--border)] hover:bg-black/5 transition-colors group">
                  <td className="p-4">
                    <p className="text-sm font-medium text-[var(--text-primary)] group-hover:text-[var(--primary)] transition-colors">{client.nome}</p>
                    <p className="text-xs text-[var(--text-muted)]">CPF: {client.cpf}</p>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Phone size={14} className="text-[var(--text-muted)]" />
                      <span className="text-sm text-[var(--text-secondary)]">{client.telefone}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-[var(--text-secondary)]">
                    {client.cidade}
                  </td>
                  <td className="p-4 text-sm text-[var(--text-secondary)]">
                    {new Date(client.ultimaCompra).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="p-4 text-sm font-medium text-[var(--text-primary)] text-right">
                    R$ {client.totalComprado.toFixed(2).replace('.', ',')}
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border
                      ${client.status === 'Ativo' ? 'bg-[var(--success-bg)] text-[var(--success)] border-[var(--success)]/20' : 
                        client.status === 'Inadimplente' ? 'bg-[var(--danger-bg)] text-[var(--danger)] border-[var(--danger)]/20' : 
                        'bg-black/5 text-[var(--text-secondary)] border-black/10'}
                    `}>
                      {client.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 text-[var(--text-muted)] hover:text-[var(--success)] hover:bg-[var(--success-bg)] rounded-md transition-colors" title="WhatsApp">
                        <MessageSquare size={16} />
                      </button>
                      <button className="p-1.5 text-[var(--text-muted)] hover:text-[var(--info)] hover:bg-[var(--info-bg)] rounded-md transition-colors" title="Histórico Completo">
                        <FileText size={16} />
                      </button>
                      <button className="p-1.5 text-[var(--text-muted)] hover:text-[var(--primary)] hover:bg-[var(--primary)]/10 rounded-md transition-colors" title="Editar">
                        <Edit size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredClients.length === 0 && (
            <div className="p-12 text-center text-[var(--text-muted)]">
              Nenhum cliente encontrado.
            </div>
          )}
        </div>
        
        {/* Pagination */}
        <div className="p-4 border-t border-[var(--border)] flex items-center justify-between bg-[var(--bg-inset)]">
          <p className="text-xs text-[var(--text-muted)]">Mostrando <strong className="text-[var(--text-primary)]">{filteredClients.length}</strong> clientes</p>
          <div className="flex gap-1">
            <button className="px-3 py-1 text-sm border border-[var(--border)] rounded-md bg-white hover:bg-[var(--bg-inset)] disabled:opacity-50" disabled>Anterior</button>
            <button className="px-3 py-1 text-sm border border-[var(--border)] rounded-md bg-white hover:bg-[var(--bg-inset)]">Próxima</button>
          </div>
        </div>
      </div>
    </div>
  )
}
