'use client'

import { useState } from 'react'
import Link from 'next/link'
import { login } from './actions'

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    
    const result = await login(formData)
    if (result?.error) {
      setError(result.error)
    }
    setLoading(false)
  }

  return (
    <div className="flex min-h-screen bg-[#f8f6f0]">
      {/* Coluna Esquerda - Formulário com Glassmorphism leve */}
      <div className="w-full lg:w-[45%] flex flex-col justify-center px-8 sm:px-16 lg:px-24 z-10 bg-[#f8f6f0] shadow-2xl relative">
        <div className="max-w-md w-full mx-auto">
          <div className="mb-12 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[var(--primary)] flex items-center justify-center text-white font-serif font-bold text-xl shadow-md">
              V
            </div>
            <div>
              <b className="block text-gray-900 text-lg font-bold tracking-wider uppercase">Vitrina</b>
              <small className="block text-[10px] tracking-[0.3em] uppercase text-gray-500">Hub</small>
            </div>
          </div>
          
          <div className="flex gap-6 mb-10 border-b border-gray-200">
            <button 
              type="button"
              className="pb-3 font-semibold text-sm border-b-2 transition-all border-[var(--primary)] text-gray-900"
            >
              Entrar
            </button>
            <Link 
              href="/signup"
              className="pb-3 font-semibold text-sm border-b-2 transition-all border-transparent text-gray-400 hover:text-gray-600"
            >
              Criar Conta
            </Link>
          </div>

          <h1 className="font-sans text-3xl font-bold tracking-tight mb-2 text-gray-900">
            Bem-vindo ao VitrinaHub
          </h1>
          <p className="text-gray-500 text-sm mb-10">
            A gestão da sua loja de móveis de forma inteligente.
          </p>
          
          <form action={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-medium text-gray-600">E-mail Corporativo</label>
              <input
                type="email"
                name="email"
                required
                className="w-full px-4 py-3.5 border border-gray-200 rounded-xl bg-white/50 backdrop-blur-sm text-gray-900 text-sm outline-none focus:bg-white focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 transition-all shadow-sm"
                placeholder="exemplo@loja.com"
              />
            </div>
            
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-medium text-gray-600">Senha Secreta</label>
              <input
                type="password"
                name="password"
                required
                className="w-full px-4 py-3.5 border border-gray-200 rounded-xl bg-white/50 backdrop-blur-sm text-gray-900 text-sm outline-none focus:bg-white focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 transition-all shadow-sm"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl font-medium border border-red-100">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full py-4 px-4 bg-[var(--primary)] text-white font-medium text-[15px] rounded-xl hover:bg-[var(--primary-hover)] transition-all shadow-lg shadow-[var(--primary)]/20 disabled:opacity-70 flex justify-center active:scale-[0.98]"
            >
              {loading ? 'Processando...' : 'Entrar no Sistema'}
            </button>
          </form>
          
          <p className="text-sm font-medium text-gray-600 mt-6 text-center cursor-pointer hover:text-gray-900 transition-colors">
            Esqueceu sua senha?
          </p>
        </div>
      </div>

      {/* Coluna Direita - Imagem Fotográfica de Fundo */}
      <div 
        className="hidden lg:block lg:w-[55%] bg-cover bg-center relative"
        style={{ backgroundImage: "url('/login-bg.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/10"></div>
      </div>
    </div>
  )
}
