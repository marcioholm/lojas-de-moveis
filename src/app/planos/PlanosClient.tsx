'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CheckCircle2, Info, X } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function PlanosClient({ employeeRange }: { employeeRange: string }) {
  const [isAnnual, setIsAnnual] = useState(true)
  const router = useRouter()
  
  // '1-3', '4-6', '7-10', '11-20', '20+'
  const showCompletoRecommendation = ['7-10', '11-20', '20+'].includes(employeeRange) || employeeRange === '4-6'

  const handleSelectPlan = (plan: string) => {
    // In a real app we'd save this to Supabase profile/store
    // For now we just redirect
    router.push('/setup')
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <Link href="/" className="inline-flex items-center gap-3 mb-8 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-[var(--primary)] text-white flex items-center justify-center rounded-md font-serif font-bold shadow-md">
              V
            </div>
            <span className="font-bold tracking-wide text-gray-900">VitrinaHub</span>
          </Link>
          <h1 className="text-4xl font-bold font-serif text-[var(--primary)] mb-4">
            Escolha o plano ideal para sua loja
          </h1>
          <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
            Todos os planos incluem 14 dias de teste grátis. Você não precisa cadastrar cartão de crédito agora.
          </p>
          
          <div className="mt-10 flex items-center justify-center gap-4">
            <span className={`font-medium ${!isAnnual ? 'text-[var(--primary)]' : 'text-gray-400'}`}>Mensal</span>
            <button 
              onClick={() => setIsAnnual(!isAnnual)}
              className="w-16 h-8 bg-[var(--primary)] rounded-full p-1 flex items-center transition-colors relative"
            >
              <div className={`w-6 h-6 bg-[var(--accent)] rounded-full shadow-md transform transition-transform duration-300 ${isAnnual ? 'translate-x-8' : 'translate-x-0'}`} />
            </button>
            <div className="flex items-center gap-2">
              <span className={`font-medium ${isAnnual ? 'text-[var(--primary)]' : 'text-gray-400'}`}>Anual</span>
              <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full animate-pulse">2 meses grátis</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto items-start">
          {/* Vitrine */}
          <div className="bg-white p-8 rounded-3xl border border-[var(--border-light)] shadow-sm relative">
            <h3 className="text-2xl font-bold text-[var(--primary)] mb-2">Vitrine</h3>
            <p className="text-[var(--text-secondary)] text-sm h-10">Catálogo digital e captação de leads</p>
            <div className="my-6">
              <span className="text-4xl font-black text-gray-900">
                R${isAnnual ? '970' : '97'}
              </span>
              <span className="text-gray-500">{isAnnual ? '/ano' : '/mês'}</span>
            </div>
            <div className="text-[12px] text-gray-500 font-bold uppercase tracking-wide mb-4 border-b border-gray-100 pb-2">
              2 Usuários (Dono + 1)
            </div>
            <ul className="space-y-4 mb-8">
              <PlanFeature text="Catálogo digital completo" />
              <PlanFeature text="Captação de leads pro WhatsApp" />
              <PlanFeature text="Link personalizado da vitrine" />
              <PlanFeature text="NÃO INCLUI: Gestão ERP" negative />
            </ul>
            <button onClick={() => handleSelectPlan('vitrine')} className="w-full py-4 rounded-xl font-bold text-[var(--primary)] bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-colors">
              Iniciar Trial de 14 dias
            </button>
          </div>

          {/* Gestão */}
          <div className="bg-[var(--primary)] p-10 rounded-3xl shadow-2xl relative border-2 border-[var(--accent)] transform lg:scale-105 z-10">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[var(--accent)] text-[var(--primary)] font-black uppercase tracking-wider text-xs px-4 py-1.5 rounded-full">
              Mais Escolhido
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Gestão</h3>
            <p className="text-white/70 text-sm h-10">Controle total de estoque, vendas e carnês</p>
            <div className="my-6">
              <span className="text-5xl font-black text-white">
                R${isAnnual ? '1.970' : '197'}
              </span>
              <span className="text-white/60">{isAnnual ? '/ano' : '/mês'}</span>
            </div>
            <div className="text-[12px] text-[var(--accent)] font-bold uppercase tracking-wide mb-4 border-b border-white/10 pb-2 flex justify-between items-center">
              <span>Admin + 4 Vendedores</span>
              <span className="text-white/50 lowercase">+R$30/extra</span>
            </div>
            <ul className="space-y-4 mb-8 text-white/90">
              <PlanFeature text="Estoque inteligente e PDV Mobile" light />
              <PlanFeature text="Gestão de carnês e promissórias" light />
              <PlanFeature text="Controle de entregas e montagem" light />
              <PlanFeature text="Relatórios financeiros e comissão" light />
              <PlanFeature text="NÃO INCLUI: Vitrine Digital" negative light />
            </ul>
            <button onClick={() => handleSelectPlan('gestao')} className="w-full py-4 rounded-xl font-bold text-white bg-[var(--cta)] hover:bg-[var(--cta-hover)] shadow-lg hover:-translate-y-0.5 transition-all">
              Iniciar Trial de 14 dias
            </button>
          </div>

          {/* Completo */}
          <div className={`bg-white p-8 rounded-3xl border shadow-sm relative ${showCompletoRecommendation ? 'border-[var(--accent)] ring-4 ring-[var(--accent)]/10' : 'border-[var(--border-light)]'}`}>
            {showCompletoRecommendation && (
              <div className="absolute -top-4 -right-4 bg-[var(--primary)] text-white text-xs font-bold px-3 py-2 rounded-xl shadow-lg flex items-center gap-2 max-w-[200px] leading-tight z-20 animate-bounce">
                <Info size={16} className="text-[var(--accent)] flex-shrink-0" />
                <span>Com {employeeRange} vendedores, o Completo sai mais em conta!</span>
              </div>
            )}
            <h3 className="text-2xl font-bold text-[var(--primary)] mb-2">Completo</h3>
            <p className="text-[var(--text-secondary)] text-sm h-10">ERP + Vitrine operando juntos</p>
            <div className="my-6">
              <span className="text-4xl font-black text-gray-900">
                R${isAnnual ? '2.970' : '297'}
              </span>
              <span className="text-gray-500">{isAnnual ? '/ano' : '/mês'}</span>
            </div>
            <div className="text-[12px] text-[var(--primary)] font-bold uppercase tracking-wide mb-4 border-b border-gray-100 pb-2 flex justify-between items-center">
              <span>Admin + 5 Vendedores</span>
              <span className="text-gray-400 lowercase">+R$10/extra</span>
            </div>
            <ul className="space-y-4 mb-8">
              <PlanFeature text="TUDO do plano Gestão" />
              <PlanFeature text="TUDO do plano Vitrine" />
              <PlanFeature text="CRM (Jornada de Leads)" />
              <PlanFeature text="Integração total do catálogo" />
            </ul>
            <button onClick={() => handleSelectPlan('completo')} className="w-full py-4 rounded-xl font-bold text-white bg-[var(--primary)] hover:bg-[var(--primary-hover)] shadow-md transition-colors">
              Iniciar Trial de 14 dias
            </button>
          </div>
        </div>

        <div className="mt-16 text-center text-sm text-[var(--text-secondary)] bg-white border border-gray-200 p-6 rounded-2xl max-w-3xl mx-auto shadow-sm">
          <div className="flex items-center justify-center gap-6 text-gray-400 font-medium">
            <span>✓ Sem taxa de adesão</span>
            <span>✓ Cancele quando quiser</span>
            <span>✓ Pagamento via Pix ou Cartão</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function PlanFeature({ text, negative = false, light = false }: { text: string, negative?: boolean, light?: boolean }) {
  return (
    <li className={`flex items-start gap-3 ${negative ? (light ? 'text-red-300 line-through' : 'text-red-500 line-through') : ''}`}>
      {!negative && <CheckCircle2 className={`flex-shrink-0 mt-0.5 ${light ? 'text-[var(--accent)]' : 'text-[var(--primary)]'}`} size={20} />}
      {negative && <X className="flex-shrink-0 mt-0.5" size={20} />}
      <span className={!negative ? (light ? 'text-white' : 'text-gray-700') : ''}>{text}</span>
    </li>
  )
}
