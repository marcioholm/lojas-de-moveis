import { createClient } from '@/utils/supabase/server'
import { Filter, Users, Phone, Package, Clock, CheckCircle } from 'lucide-react'

export default async function LeadsPage() {
  const supabase = await createClient()

  // Fetch leads
  // Since leads might not exist if migration didn't run, we try/catch
  let leads: any[] = []
  try {
    const { data } = await supabase
      .from('leads')
      .select('*, product:products(nome)')
      .order('created_at', { ascending: false })
    leads = data || []
  } catch (e) {}

  const novos = leads.filter(l => l.status === 'novo')
  const emAtendimento = leads.filter(l => l.status === 'em_atendimento')
  const convertidos = leads.filter(l => l.status === 'convertido')

  const columns = [
    { title: 'Novos Leads', status: 'novo', data: novos, color: 'bg-blue-50 border-blue-200 text-blue-700' },
    { title: 'Em Atendimento', status: 'em_atendimento', data: emAtendimento, color: 'bg-yellow-50 border-yellow-200 text-yellow-700' },
    { title: 'Convertidos', status: 'convertido', data: convertidos, color: 'bg-green-50 border-green-200 text-green-700' }
  ]

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold font-serif text-[var(--primary)]">Gestão de Leads</h1>
          <p className="text-sm text-gray-500 mt-1">Acompanhe os clientes interessados vindos da vitrine online</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map(col => (
          <div key={col.status} className="bg-white border border-gray-200 rounded-xl flex flex-col h-[calc(100vh-12rem)]">
            <div className={`p-4 border-b rounded-t-xl font-bold flex justify-between items-center ${col.color}`}>
              {col.title}
              <span className="bg-white/50 px-2 py-0.5 rounded text-sm">{col.data.length}</span>
            </div>
            
            <div className="p-4 flex-1 overflow-y-auto space-y-3 bg-gray-50/50">
              {col.data.length === 0 ? (
                <div className="text-center text-gray-400 text-sm py-10">Nenhum lead nesta etapa</div>
              ) : (
                col.data.map(lead => (
                  <div key={lead.id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-semibold text-gray-900 flex items-center gap-2">
                        <Users size={14} className="text-gray-400" />
                        {lead.nome}
                      </div>
                      <div className="text-xs text-gray-400 flex items-center gap-1">
                        <Clock size={12} />
                        {new Date(lead.created_at).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-600 flex items-center gap-2 mb-3">
                      <Package size={14} className="text-gray-400" />
                      {lead.product?.nome || 'Produto Indefinido'}
                    </div>

                    <div className="flex gap-2">
                      <a 
                        href={`https://wa.me/${lead.whatsapp.replace(/\D/g, '')}`}
                        target="_blank"
                        className="flex-1 bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 py-1.5 rounded-md text-xs font-semibold flex justify-center items-center gap-1 transition-colors"
                      >
                        <Phone size={12} />
                        WhatsApp
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
