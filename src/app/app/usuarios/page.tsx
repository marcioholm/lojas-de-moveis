'use client'

import { useState } from 'react'
import { Search, Plus, UserCog, Edit, Trash, Shield } from 'lucide-react'

const mockUsuarios = [
  { id: 'US-01', nome: 'Márcio Holm', email: 'marcio@vitrinahub.com', papel: 'Administrador (Dono)', status: 'Ativo', ultimoAcesso: 'Hoje, 09:30' },
  { id: 'US-02', nome: 'Ana Beatriz', email: 'ana@vitrinahub.com', papel: 'Vendedora', status: 'Ativo', ultimoAcesso: 'Hoje, 08:45' },
  { id: 'US-03', nome: 'Carlos Silva', email: 'carlos@vitrinahub.com', papel: 'Vendedor', status: 'Ativo', ultimoAcesso: 'Ontem, 18:10' },
  { id: 'US-04', nome: 'Roberto Oliveira', email: 'roberto@vitrinahub.com', papel: 'Caixa / Financeiro', status: 'Inativo', ultimoAcesso: '15/10/2023' },
]

export default function UsuariosPage() {
  const [searchTerm, setSearchTerm] = useState('')

  return (
    <div className="space-y-6 fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-serif text-[var(--text-primary)]">Equipe e Acessos</h1>
          <p className="text-[var(--text-muted)] text-sm">Controle de usuários, permissões e filiais</p>
        </div>
        <div className="flex gap-3">
          <button className="btn-primary flex items-center gap-2">
            <Plus size={18} />
            <span>Novo Usuário</span>
          </button>
        </div>
      </div>

      <div className="glass-panel p-0 overflow-hidden">
        <div className="p-4 border-b border-[var(--border)] flex items-center gap-4 bg-[var(--bg-inset)]">
          <div className="relative flex-1 max-w-md">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input 
              type="text" 
              placeholder="Buscar por nome, email..." 
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
                <th className="p-4 font-semibold">Usuário</th>
                <th className="p-4 font-semibold">Papel / Permissão</th>
                <th className="p-4 font-semibold">Último Acesso</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {mockUsuarios.map((user) => (
                <tr key={user.id} className="border-b border-[var(--border)] hover:bg-black/5 transition-colors group">
                  <td className="p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[var(--primary)] text-white flex items-center justify-center font-bold font-serif text-sm">
                      {user.nome.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[var(--text-primary)]">{user.nome}</p>
                      <p className="text-xs text-[var(--text-secondary)]">{user.email}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1.5 text-sm font-medium text-[var(--text-secondary)]">
                      {user.papel.includes('Admin') && <Shield size={14} className="text-[var(--primary)]" />}
                      {user.papel}
                    </div>
                  </td>
                  <td className="p-4 text-sm text-[var(--text-secondary)]">{user.ultimoAcesso}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border
                      ${user.status === 'Ativo' ? 'bg-[var(--success-bg)] text-[var(--success)] border-[var(--success)]/20' : 
                        'bg-black/5 text-[var(--text-secondary)] border-black/10'}
                    `}>
                      {user.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 text-[var(--text-muted)] hover:text-[var(--primary)] hover:bg-[var(--primary)]/10 rounded-md transition-colors" title="Editar Permissões">
                        <UserCog size={16} />
                      </button>
                      <button className="p-1.5 text-[var(--text-muted)] hover:text-[var(--primary)] hover:bg-[var(--primary)]/10 rounded-md transition-colors" title="Editar Dados">
                        <Edit size={16} />
                      </button>
                      <button className="p-1.5 text-[var(--text-muted)] hover:text-[var(--danger)] hover:bg-[var(--danger-bg)] rounded-md transition-colors" title="Desativar">
                        <Trash size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
