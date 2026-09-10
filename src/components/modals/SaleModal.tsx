'use client'

import { createSale } from '@/app/app/actions'
import { useRouter, useSearchParams } from 'next/navigation'
import { X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'

export function SaleModal() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [customers, setCustomers] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  
  const [formaPagamento, setFormaPagamento] = useState('Pix')
  const [selectedProductId, setSelectedProductId] = useState('')
  const [total, setTotal] = useState(0)

  useEffect(() => {
    if (searchParams.get('modal') === 'sale') {
      const supabase = createClient()
      supabase.from('customers').select('id, nome').order('nome').then(({ data }) => {
        if (data) setCustomers(data)
      })
      supabase.from('products').select('id, nome, preco_venda, estoque_atual').gt('estoque_atual', 0).order('nome').then(({ data }) => {
        if (data) setProducts(data)
      })
    }
  }, [searchParams])
  
  if (searchParams.get('modal') !== 'sale') return null

  function closeModal() {
    router.back()
  }

  function handleProductChange(e: any) {
    const pid = e.target.value
    setSelectedProductId(pid)
    const p = products.find(prod => prod.id === pid)
    if (p) setTotal(p.preco_venda)
    else setTotal(0)
  }

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    try {
      formData.set('total', total.toString())
      await createSale(formData)
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
          <h3 className="font-semibold text-lg">Nova Venda</h3>
          <button onClick={closeModal} className="text-gray-400 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        
        <form action={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
            <select name="customer_id" required className="w-full border border-gray-300 rounded-md p-2 focus:ring-[var(--primary)] focus:border-[var(--primary)]">
              <option value="">Selecione um cliente...</option>
              {customers.map(c => (
                <option key={c.id} value={c.id}>{c.nome}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Produto (1 un.)</label>
            <select name="produto_id" required value={selectedProductId} onChange={handleProductChange} className="w-full border border-gray-300 rounded-md p-2 focus:ring-[var(--primary)] focus:border-[var(--primary)]">
              <option value="">Selecione o produto...</option>
              {products.map(p => (
                <option key={p.id} value={p.id}>{p.nome} - R$ {p.preco_venda} ({p.estoque_atual} em estoque)</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Forma de pagamento</label>
            <select name="forma_pagamento" required value={formaPagamento} onChange={(e) => setFormaPagamento(e.target.value)} className="w-full border border-gray-300 rounded-md p-2 focus:ring-[var(--primary)] focus:border-[var(--primary)]">
              <option value="Pix">Pix</option>
              <option value="Cartão">Cartão</option>
              <option value="Dinheiro">Dinheiro</option>
              <option value="Crediário">Crediário (Carnê)</option>
            </select>
          </div>
          
          {formaPagamento === 'Crediário' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Número de Parcelas</label>
              <input type="number" name="parcelas" defaultValue="3" min="1" max="24" required className="w-full border border-gray-300 rounded-md p-2 focus:ring-[var(--primary)] focus:border-[var(--primary)]" />
            </div>
          )}

          <div className="flex items-center gap-2 mt-2">
            <input type="checkbox" id="precisa_entrega" name="precisa_entrega" defaultChecked className="rounded text-[var(--primary)] focus:ring-[var(--primary)]" />
            <label htmlFor="precisa_entrega" className="text-sm font-medium text-gray-700">Agendar entrega</label>
          </div>
          
          <div className="pt-4 flex justify-between items-center border-t border-gray-100 mt-2">
            <div className="font-semibold text-lg text-[var(--primary)]">
              R$ {total.toFixed(2)}
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={closeModal} className="btn btn-outline text-gray-600">Cancelar</button>
              <button type="submit" disabled={loading} className="btn btn-primary bg-[var(--primary)] text-white">
                {loading ? 'Finalizando...' : 'Finalizar Venda'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
