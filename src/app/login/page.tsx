'use client'

import { useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { login, signUp } from './actions'

export default function LoginPage() {
  const [tab, setTab] = useState<'login' | 'signup'>('login')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    setSuccess(null)
    
    if (tab === 'login') {
      const result = await login(formData)
      if (result?.error) {
        setError(result.error)
      }
    } else {
      const result = await signUp(formData)
      if (result?.error) {
        setError(result.error)
      } else if (result?.success) {
        setSuccess(result.success)
      }
    }
    setLoading(false)
  }

  return (
    <div className="flex min-h-screen bg-white">
      {/* Coluna Esquerda - Formulário */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 lg:px-24">
        <div className="max-w-md w-full mx-auto">
          <div className="mb-10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border-2 border-[var(--primary)] flex items-center justify-center text-[var(--primary)] font-serif font-bold text-xl">
              M
            </div>
            <div>
              <b className="block text-gray-900 text-lg font-bold tracking-wider uppercase">Vitrina</b>
              <small className="block text-[10px] tracking-[0.3em] uppercase text-gray-500">Hub</small>
            </div>
          </div>
          
          <div className="flex gap-6 mb-8 border-b border-gray-100">
            <button 
              type="button"
              onClick={() => setTab('login')}
              className={`pb-3 font-semibold text-sm border-b-2 transition-all ${tab === 'login' ? 'border-[var(--primary)] text-gray-900' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
            >
              Entrar
            </button>
            <button 
              type="button"
              onClick={() => setTab('signup')}
              className={`pb-3 font-semibold text-sm border-b-2 transition-all ${tab === 'signup' ? 'border-[var(--primary)] text-gray-900' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
            >
              Criar Conta
            </button>
          </div>

          <h1 className="font-serif text-3xl mb-2 text-gray-900">
            {tab === 'login' ? 'Bem-vindo de volta' : 'Comece agora'}
          </h1>
          <p className="text-gray-500 text-sm mb-8">
            {tab === 'login' 
              ? 'Acesse o painel da sua loja para gerenciar vendas, estoque e equipe.' 
              : 'Crie seu acesso administrativo para configurar a sua loja no sistema.'}
          </p>
          
          <form action={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">E-mail Corporativo</label>
              <input
                type="email"
                name="email"
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 text-sm outline-none focus:bg-white focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 transition-all"
                placeholder="exemplo@loja.com"
              />
            </div>
            
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Senha Secreta</label>
              <input
                type="password"
                name="password"
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 text-sm outline-none focus:bg-white focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 transition-all"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg font-medium border border-red-100">
                {error}
              </div>
            )}
            
            {success && (
              <div className="p-3 bg-green-50 text-green-700 text-sm rounded-lg font-medium border border-green-200">
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-4 w-full py-3.5 px-4 bg-[var(--primary)] text-white font-bold text-[14px] rounded-lg hover:bg-[var(--primary-hover)] transition-all shadow-lg shadow-[var(--primary)]/30 disabled:opacity-70 flex justify-center active:scale-[0.98]"
            >
              {loading 
                ? 'Processando...' 
                : tab === 'login' ? 'Entrar no Sistema' : 'Criar minha conta'}
            </button>
          </form>
          
          <p className="text-xs text-gray-400 mt-8 text-center">
            Problemas com acesso? Entre em contato com o suporte ou fale com o administrador da sua loja.
          </p>
        </div>
      </div>

      {/* Coluna Direita - Ilustração / Cover */}
      <div className="hidden lg:flex w-1/2 relative bg-[var(--primary)] overflow-hidden">
        {/* Abstract Pattern Background */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent opacity-30"></div>
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#D4AF37]/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4"></div>

        <div className="relative z-10 flex flex-col justify-center px-20 text-white h-full w-full">
          <div className="max-w-lg">
            <h2 className="font-serif text-5xl font-bold leading-tight mb-6">
              O ecossistema definitivo para a sua loja de móveis.
            </h2>
            <ul className="space-y-4 mb-8 text-white/80">
              <li className="flex items-center gap-3">
                <CheckCircle2 className="text-[#D4AF37]" size={20} />
                <span>Integração total entre Estoque, PDV e Entregas</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="text-[#D4AF37]" size={20} />
                <span>Vitrine digital com captação direta de leads pro WhatsApp</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="text-[#D4AF37]" size={20} />
                <span>Gestão avançada de crediário próprio e carnês</span>
              </li>
            </ul>
            
            <div className="p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
              <p className="italic text-sm text-white/90">
                "Desde que implementamos o VitrinaHub, reduzimos nossas perdas de estoque a zero e dobramos a captação de leads online."
              </p>
              <div className="mt-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full"></div>
                <div>
                  <p className="text-xs font-bold text-white">Roberto Almeida</p>
                  <p className="text-[10px] text-white/60 uppercase tracking-widest">Almeida Móveis (CEO)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
