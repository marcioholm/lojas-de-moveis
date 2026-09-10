'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { CheckCircle2, Store, Users, Loader2, ChevronRight } from 'lucide-react'

export default function SetupWizard() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const nextStep = () => {
    if (step < 3) setStep(step + 1)
    else finishSetup()
  }

  const finishSetup = () => {
    setLoading(true)
    setTimeout(() => {
      router.push('/app/dashboard')
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-[var(--border-light)] overflow-hidden">
        {/* Header */}
        <div className="bg-[var(--primary)] p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center border border-white/20">
              <Store className="text-[var(--accent)]" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-serif font-bold">Configuração Inicial</h1>
              <p className="text-white/70 text-sm">Vamos preparar a sua loja no VitrinaHub</p>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-8 flex gap-2">
            {[1, 2, 3].map(s => (
              <div key={s} className={`h-1.5 flex-1 rounded-full ${s <= step ? 'bg-[var(--accent)]' : 'bg-white/20'}`} />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-8 md:p-12">
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Bem-vindo(a) ao VitrinaHub! 🎉</h2>
              <p className="text-[var(--text-secondary)] mb-8">
                Estamos muito felizes em ter você conosco. Para começarmos com o pé direito, que tal adicionarmos a logomarca da sua loja? Assim seus clientes já verão sua marca na Vitrine Digital.
              </p>
              
              <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer mb-8">
                <div className="w-16 h-16 bg-[var(--primary)]/10 text-[var(--primary)] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Store size={28} />
                </div>
                <p className="font-bold text-gray-900">Clique para enviar a logo</p>
                <p className="text-sm text-gray-500 mt-1">PNG ou JPG até 5MB</p>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Convide seus vendedores</h2>
              <p className="text-[var(--text-secondary)] mb-8">
                O VitrinaHub fica ainda melhor com a equipe toda. Envie convites para seus vendedores começarem a usar o PDV Mobile.
              </p>
              
              <div className="space-y-4 mb-8">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex gap-4 items-center">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 font-bold">
                      {i}
                    </div>
                    <input 
                      type="email" 
                      placeholder="E-mail do vendedor (opcional)" 
                      className="flex-1 px-4 py-3 rounded-xl border border-gray-200 bg-white focus:border-[var(--primary)] outline-none"
                    />
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-400 text-center">Não se preocupe, você pode adicionar mais pessoas depois no painel.</p>
            </div>
          )}

          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500 text-center py-8">
              <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={48} />
              </div>
              <h2 className="text-3xl font-bold font-serif text-gray-900 mb-4">Tudo Pronto!</h2>
              <p className="text-[var(--text-secondary)] mb-8 max-w-sm mx-auto">
                Sua loja está configurada e o sistema está pronto para receber sua primeira venda.
              </p>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-between mt-12 pt-6 border-t border-gray-100">
            {step > 1 && step < 3 ? (
              <button onClick={() => setStep(step - 1)} className="text-gray-500 font-medium hover:text-gray-900 transition-colors">
                Voltar
              </button>
            ) : <div></div>}

            <button 
              onClick={nextStep} 
              disabled={loading}
              className="bg-[var(--cta)] text-white px-8 py-3 rounded-xl font-bold hover:bg-[var(--cta-hover)] shadow-md flex items-center gap-2 transition-all active:scale-95 disabled:opacity-70"
            >
              {loading ? (
                <><Loader2 className="animate-spin" size={20} /> Preparando Painel...</>
              ) : step === 3 ? (
                <>Acessar Painel <ChevronRight size={20} /></>
              ) : (
                'Continuar'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
