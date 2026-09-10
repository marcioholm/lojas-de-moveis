'use client'

import { useState } from 'react'
import { inviteUser } from './actions'

export default function UsuariosPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    setSuccess(null)

    const result = await inviteUser(formData)

    if (result.error) {
      setError(result.error)
    } else if (result.success) {
      setSuccess(result.success)
    }

    setLoading(false)
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 font-serif">Equipe e Acessos</h1>
        <p className="text-gray-500 mt-1">Gerencie quem tem acesso ao painel da sua loja.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Convidar novo membro</h2>
        <form action={handleSubmit} className="flex items-start gap-4">
          <div className="flex-1">
            <label className="sr-only">E-mail</label>
            <input
              type="email"
              name="email"
              required
              placeholder="E-mail do novo membro"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-[var(--primary)] text-white text-sm font-semibold rounded-lg shadow-sm hover:bg-[var(--primary-hover)] transition-all disabled:opacity-70 whitespace-nowrap"
          >
            {loading ? 'Enviando...' : 'Enviar Convite'}
          </button>
        </form>
        
        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg font-medium border border-red-100">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mt-4 p-3 bg-green-50 text-green-700 text-sm rounded-lg font-medium border border-green-200">
            {success}
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Usuários Ativos</h2>
        </div>
        <div className="p-8 text-center text-gray-500 text-sm">
          A lista de usuários ativos será exibida aqui futuramente.
        </div>
      </div>
    </div>
  )
}
