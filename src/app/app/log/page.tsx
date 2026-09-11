'use client'

import { useState } from 'react'
import { Search, Terminal, Activity, ShieldAlert } from 'lucide-react'

const mockLogs = [
  { id: 'LOG-001', usuario: 'Márcio Holm', acao: 'Acesso ao Sistema', detalhes: 'Login realizado com sucesso', ip: '192.168.1.45', data: '10/11/2023 09:30:15', nivel: 'info' },
  { id: 'LOG-002', usuario: 'Carlos Silva', acao: 'Exclusão de Registro', detalhes: 'Venda VD-1025 cancelada manualmente', ip: '192.168.1.102', data: '10/11/2023 09:15:22', nivel: 'warning' },
  { id: 'LOG-003', usuario: 'Sistema', acao: 'Sincronização Falhou', detalhes: 'Timeout ao conectar com servidor de NFe', ip: 'localhost', data: '10/11/2023 08:00:00', nivel: 'error' },
]

export default function LogsPage() {
  const [searchTerm, setSearchTerm] = useState('')

  return (
    <div className="space-y-6 fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-serif text-[var(--text-primary)]">Logs de Sistema</h1>
          <p className="text-[var(--text-muted)] text-sm">Auditoria e rastreamento de ações</p>
        </div>
      </div>

      <div className="glass-panel p-0 overflow-hidden">
        <div className="p-4 border-b border-[var(--border)] flex items-center gap-4 bg-[var(--bg-inset)]">
          <div className="relative flex-1 max-w-md">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input 
              type="text" 
              placeholder="Buscar por usuário, ação..." 
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
                <th className="p-4 font-semibold w-10 text-center"></th>
                <th className="p-4 font-semibold">Data / Hora</th>
                <th className="p-4 font-semibold">Usuário</th>
                <th className="p-4 font-semibold">Ação / Detalhes</th>
                <th className="p-4 font-semibold">Endereço IP</th>
              </tr>
            </thead>
            <tbody>
              {mockLogs.map((log) => (
                <tr key={log.id} className="border-b border-[var(--border)] hover:bg-black/5 transition-colors font-mono text-xs">
                  <td className="p-4 text-center">
                    {log.nivel === 'info' && <Activity size={16} className="text-[var(--info)] mx-auto" />}
                    {log.nivel === 'warning' && <ShieldAlert size={16} className="text-[var(--warning)] mx-auto" />}
                    {log.nivel === 'error' && <Terminal size={16} className="text-[var(--danger)] mx-auto" />}
                  </td>
                  <td className="p-4 text-[var(--text-secondary)]">{log.data}</td>
                  <td className="p-4 font-bold text-[var(--text-primary)] font-sans">{log.usuario}</td>
                  <td className="p-4">
                    <span className="font-bold text-[var(--text-primary)]">{log.acao}</span>
                    <p className="text-[var(--text-muted)] mt-1">{log.detalhes}</p>
                  </td>
                  <td className="p-4 text-[var(--text-secondary)]">{log.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
