'use client'

import { useActionState, useState } from 'react'
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
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg-inset)] px-4">
      <div className="w-full max-w-md bg-[var(--bg-raised)] border border-[var(--border)] rounded-[var(--radius)] shadow-[var(--shadow-md)] overflow-hidden">
        <div className="p-8 text-center border-b border-[var(--border-light)]">
          <div className="mx-auto w-12 h-12 rounded-full border-2 border-[var(--sidebar-accent)] flex items-center justify-center text-[var(--sidebar-accent)] font-serif font-bold text-2xl mb-4">
            M
          </div>
          <h1 className="font-serif text-3xl mb-1 text-[var(--text-primary)]">Marka Gestão</h1>
          <p className="text-[var(--text-secondary)] text-sm">Acesse o sistema da sua loja</p>
        </div>
        
        <div className="p-8">
          <form action={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold text-[var(--text-secondary)]">E-MAIL</label>
              <input
                type="email"
                name="email"
                required
                className="w-full px-3 py-2.5 border border-[var(--border)] rounded-[var(--radius-sm)] bg-[var(--bg-raised)] text-[var(--text-primary)] text-[13px] outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10"
                placeholder="exemplo@loja.com"
              />
            </div>
            
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold text-[var(--text-secondary)]">SENHA</label>
              <input
                type="password"
                name="password"
                required
                className="w-full px-3 py-2.5 border border-[var(--border)] rounded-[var(--radius-sm)] bg-[var(--bg-raised)] text-[var(--text-primary)] text-[13px] outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10"
                placeholder="Sua senha secreta"
              />
            </div>

            {error && (
              <div className="p-3 bg-[var(--danger-bg)] text-[var(--danger)] text-sm rounded-[var(--radius-sm)] font-medium">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full py-3 px-4 bg-[var(--primary)] text-white font-semibold text-[14px] rounded-[var(--radius-sm)] hover:bg-[var(--primary-hover)] transition-colors disabled:opacity-70 flex justify-center"
            >
              {loading ? 'Entrando...' : 'Entrar no Sistema'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
