import { createClient } from '@/utils/supabase/server'
import { Plus, Search, Eye, Edit2, Trash2 } from 'lucide-react'

export default async function ClientesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const supabase = await createClient()
  const resolvedParams = await searchParams
  const query = resolvedParams.q || ''

  let dbQuery = supabase
    .from('customers')
    .select('*')
    .order('created_at', { ascending: false })

  if (query) {
    dbQuery = dbQuery.or(`nome.ilike.%${query}%,whatsapp.ilike.%${query}%`)
  }

  const { data: customers } = await dbQuery

  return (
    <div>
      <div className="page-head">
        <div>
          <h2>Cadastro de clientes</h2>
          <p>Dados completos para vendas, entregas, notas fiscais e crediário.</p>
        </div>
        <div className="flex gap-2 flex-wrap mt-4 sm:mt-0">
          <button className="btn btn-primary bg-[var(--primary)] text-white">
            <Plus size={16} /> Cadastrar cliente
          </button>
        </div>
      </div>

      <div className="search-bar">
        <Search size={16} />
        <input 
          placeholder="Buscar por nome ou telefone..." 
          defaultValue={query}
        />
      </div>

      <div className="panel table-panel">
        <table className="data-table">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Telefone</th>
              <th>Documento</th>
              <th>Endereço</th>
              <th>Cadastro</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {customers && customers.length > 0 ? (
              customers.map((c) => (
                <tr key={c.id}>
                  <td><b>{c.nome}</b></td>
                  <td>{c.whatsapp || '—'}</td>
                  <td>{c.cpf_cnpj || '—'}</td>
                  <td>{c.endereco || '—'}</td>
                  <td>{new Date(c.created_at).toLocaleDateString('pt-BR')}</td>
                  <td className="flex gap-1 flex-nowrap">
                    {c.whatsapp && (
                      <button className="btn btn-whatsapp btn-sm text-white" title="WhatsApp" style={{ background: '#25d366', borderColor: '#25d366' }}>
                        W
                      </button>
                    )}
                    <button className="btn btn-outline btn-sm text-[var(--text-muted)] hover:text-[var(--text-primary)]" title="Histórico">
                      <Eye size={14} />
                    </button>
                    <button className="btn btn-outline btn-sm text-[var(--text-muted)] hover:text-[var(--text-primary)]" title="Editar">
                      <Edit2 size={14} />
                    </button>
                    <button className="btn btn-outline btn-sm text-[var(--danger)] hover:bg-[var(--danger-bg)] border-[var(--border)]" title="Excluir">
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-10 text-[var(--text-muted)]">
                  Nenhum cliente encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
