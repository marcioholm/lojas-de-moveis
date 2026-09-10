'use client'

import { createCustomer } from '@/app/app/actions'
import { useRouter, useSearchParams } from 'next/navigation'
import { X } from 'lucide-react'
import { useState } from 'react'

export function CustomerModal() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  
  if (searchParams.get('modal') !== 'customer') return null

  function closeModal() {
    router.back()
  }

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    try {
      await createCustomer(formData)
      closeModal()
    } catch (e: any) {
      alert(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-[var(--border-light)]">
          <h3 className="font-semibold text-lg">Cadastrar Cliente</h3>
          <button onClick={closeModal} className="text-gray-400 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        
        <form action={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome completo *</label>
            <input type="text" name="nome" required className="w-full border border-gray-300 rounded-md p-2 focus:ring-[var(--primary)] focus:border-[var(--primary)]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
            <input type="text" name="whatsapp" className="w-full border border-gray-300 rounded-md p-2 focus:ring-[var(--primary)] focus:border-[var(--primary)]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">CPF ou CNPJ</label>
            <input type="text" name="cpf_cnpj" className="w-full border border-gray-300 rounded-md p-2 focus:ring-[var(--primary)] focus:border-[var(--primary)]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Endereço (para entrega)</label>
            <textarea name="endereco" rows={2} className="w-full border border-gray-300 rounded-md p-2 focus:ring-[var(--primary)] focus:border-[var(--primary)]" />
          </div>
          
          <div className="pt-4 flex justify-end gap-2">
            <button type="button" onClick={closeModal} className="btn btn-outline text-gray-600">Cancelar</button>
            <button type="submit" disabled={loading} className="btn btn-primary bg-[var(--primary)] text-white">
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
