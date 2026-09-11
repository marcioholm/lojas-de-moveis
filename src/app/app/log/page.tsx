'use client'

import { useState, useEffect } from 'react'
import { Search, Terminal, Activity, ShieldAlert } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'

export default function LogsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchLogs() {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('system_logs')
        .select(`
          id,
          acao,
          detalhes,
          ip_address,
          nivel,
          created_at,
          profiles ( nome )
        `)
        .order('created_at', { ascending: false })
      
      if (!error && data) {
        const formatted = data.map((log: any) => ({
          id: log.id.substring(0, 8).toUpperCase(),
          real_id: log.id,
          usuario: log.profiles?.nome || 'Sistema',
          acao: log.acao,
          detalhes: log.detalhes,
          ip: log.ip_address || 'localhost',
          data: new Date(log.created_at).toLocaleString('pt-BR'),
          nivel: log.nivel
        }))
        setLogs(formatted)
      }
      setLoading(false)
    }
    fetchLogs()
  }, [])

  const filteredLogs = logs.filter(log => 
    log.usuario.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.acao.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-[var(--text-muted)]">Carregando logs de auditoria...</td>
                </tr>
              ) : filteredLogs.map((log) => (
                <tr key={log.real_id} className="border-b border-[var(--border)] hover:bg-black/5 transition-colors font-mono text-xs">
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
          
          {!loading && filteredLogs.length === 0 && (
            <div className="p-12 text-center text-[var(--text-muted)]">
              Nenhum log registrado.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
