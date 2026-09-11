'use client'

import { useState } from 'react'
import { inviteUser } from './actions'
import { UserPlus } from 'lucide-react'

export function InviteForm() {
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
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <UserPlus size={20} className="text-gray-400" />
        Convidar novo membro
      </h2>
      <form action={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Nome</label>
          <input
            type="text"
            name="nome"
            required
            placeholder="Nome completo"
            className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] transition-all"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">E-mail</label>
          <input
            type="email"
            name="email"
            required
            placeholder="email@exemplo.com"
            className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] transition-all"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Função</label>
          <select
            name="role"
            className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] transition-all"
          >
            <option value="vendedor">Vendedor(a)</option>
            <option value="caixa">Caixa</option>
            <option value="estoquista">Estoquista</option>
            <option value="entregador">Entregador(a)</option>
          </select>
        </div>
        <div className="flex items-end">
          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-2.5 bg-[var(--primary)] text-white text-sm font-semibold rounded-lg shadow-sm hover:bg-[var(--primary-hover)] transition-all disabled:opacity-70 whitespace-nowrap"
          >
            {loading ? 'Enviando...' : 'Enviar Convite'}
          </button>
        </div>
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
  )
}
