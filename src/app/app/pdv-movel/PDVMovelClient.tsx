'use client'

import { useState } from 'react'
import { Search, ShoppingCart, Plus, Minus, Check, X, AlertTriangle } from 'lucide-react'
import { createSale } from '@/app/app/actions'
import { useRouter } from 'next/navigation'

export default function PDVMovelClient({ products, customers, limitDiscount }: { products: any[], customers: any[], limitDiscount: number }) {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [cart, setCart] = useState<{ product: any, quantity: number }[]>([])
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  
  // Checkout states
  const [selectedCustomer, setSelectedCustomer] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('Pix')
  const [installments, setInstallments] = useState(1)
  const [discountPercent, setDiscountPercent] = useState(0)
  const [loading, setLoading] = useState(false)

  const filteredProducts = products.filter(p => p.nome.toLowerCase().includes(search.toLowerCase()))
  
  const subtotal = cart.reduce((acc, item) => acc + (item.product.preco_venda * item.quantity), 0)
  const discountAmount = subtotal * (discountPercent / 100)
  const total = subtotal - discountAmount

  const needsApproval = discountPercent > limitDiscount

  function addToCart(product: any) {
    setCart(prev => {
      const existing = prev.find(i => i.product.id === product.id)
      if (existing) {
        return prev.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i)
      }
      return [...prev, { product, quantity: 1 }]
    })
  }

  function removeFromCart(productId: string) {
    setCart(prev => {
      const existing = prev.find(i => i.product.id === productId)
      if (existing && existing.quantity > 1) {
        return prev.map(i => i.product.id === productId ? { ...i, quantity: i.quantity - 1 } : i)
      }
      return prev.filter(i => i.product.id !== productId)
    })
  }

  async function handleFinalize() {
    if (!selectedCustomer) {
      alert("Selecione um cliente")
      return
    }

    setLoading(true)
    try {
      const formData = new FormData()
      formData.set('customer_id', selectedCustomer)
      formData.set('forma_pagamento', paymentMethod)
      formData.set('total', total.toString())
      if (paymentMethod === 'Crediário') {
        formData.set('parcelas', installments.toString())
      }
      // Pass all product ids
      cart.forEach(item => {
        for(let i=0; i<item.quantity; i++) {
          formData.append('produto_id', item.product.id)
        }
      })
      
      // If needsApproval is true, we should theoretically change the status to 'pendente' instead of 'aprovado'. 
      // The current action sets it to 'aprovado'. For this mock, we can pass a flag if we update the action.
      // Let's pass a flag just in case the action is updated later.
      formData.set('needs_approval', needsApproval ? 'true' : 'false')

      await createSale(formData)
      alert(needsApproval ? 'Pedido enviado para aprovação do gerente!' : 'Venda finalizada com sucesso!')
      
      setCart([])
      setIsCheckoutOpen(false)
      router.refresh()
      
    } catch(e: any) {
      alert("Erro ao finalizar: " + e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input 
          type="text" 
          placeholder="Buscar produtos..." 
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-[var(--primary)] focus:border-[var(--primary)]"
        />
      </div>

      <div className="space-y-3">
        {filteredProducts.map(p => {
          const inCart = cart.find(i => i.product.id === p.id)
          return (
            <div key={p.id} className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex items-center gap-3">
              <div className="w-16 h-16 bg-gray-100 rounded-lg shrink-0 flex items-center justify-center">
                {/* placeholder image */}
                <ShoppingCart className="text-gray-300" size={24} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">{p.nome}</h3>
                <div className="text-[11px] text-gray-500">{p.categoria} • Estq: {p.estoque_atual}</div>
                <div className="font-bold text-[var(--primary)] mt-1">
                  R$ {p.preco_venda.toFixed(2)}
                </div>
              </div>
              
              <div className="flex flex-col items-center gap-1">
                {inCart ? (
                  <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1 border border-gray-200">
                    <button onClick={() => removeFromCart(p.id)} className="w-7 h-7 flex items-center justify-center text-gray-600 active:bg-gray-200 rounded">
                      <Minus size={14} />
                    </button>
                    <span className="text-sm font-semibold w-4 text-center">{inCart.quantity}</span>
                    <button onClick={() => addToCart(p)} className="w-7 h-7 flex items-center justify-center text-gray-600 active:bg-gray-200 rounded">
                      <Plus size={14} />
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => addToCart(p)}
                    className="w-10 h-10 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center active:bg-[var(--primary)] active:text-white transition-colors"
                  >
                    <Plus size={20} />
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Floating Cart Button */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-40 md:hidden">
          <button 
            onClick={() => setIsCheckoutOpen(true)}
            className="w-full bg-[var(--primary)] text-white rounded-xl py-3.5 font-bold flex items-center justify-between px-6 active:scale-[0.98] transition-transform"
          >
            <div className="flex items-center gap-2">
              <div className="bg-white/20 px-2 py-0.5 rounded-md text-sm">{cart.reduce((a,b)=>a+b.quantity,0)} itens</div>
            </div>
            <div>
              Finalizar (R$ {subtotal.toFixed(2)})
            </div>
          </button>
        </div>
      )}

      {/* Desktop Cart Button (since max-w-md is used, it mimics mobile on desktop) */}
      {cart.length > 0 && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-full max-w-md px-4 z-40 hidden md:block">
          <button 
            onClick={() => setIsCheckoutOpen(true)}
            className="w-full bg-[var(--primary)] text-white rounded-xl py-3.5 font-bold flex items-center justify-between px-6 shadow-lg hover:brightness-110 transition-all"
          >
            <div className="flex items-center gap-2">
              <div className="bg-white/20 px-2 py-0.5 rounded-md text-sm">{cart.reduce((a,b)=>a+b.quantity,0)} itens</div>
            </div>
            <div>
              Finalizar (R$ {subtotal.toFixed(2)})
            </div>
          </button>
        </div>
      )}

      {/* Checkout Drawer */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/60" onClick={() => setIsCheckoutOpen(false)} />
          <div className="relative bg-white rounded-t-2xl h-[85vh] flex flex-col overflow-hidden max-w-md mx-auto w-full">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <h2 className="font-bold text-lg">Resumo do Pedido</h2>
              <button onClick={() => setIsCheckoutOpen(false)} className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full text-gray-600">
                <X size={18} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Cliente *</label>
                <select 
                  value={selectedCustomer}
                  onChange={e => setSelectedCustomer(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg py-2.5 px-3 focus:ring-[var(--primary)] focus:border-[var(--primary)]"
                >
                  <option value="">Selecione o cliente...</option>
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>{c.nome}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Forma de Pagamento</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Pix', 'Cartão', 'Dinheiro', 'Crediário'].map(method => (
                    <button
                      key={method}
                      onClick={() => setPaymentMethod(method)}
                      className={`py-2 rounded-lg border text-sm font-medium transition-colors ${
                        paymentMethod === method 
                        ? 'border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)]' 
                        : 'border-gray-200 text-gray-600 bg-white'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              {paymentMethod === 'Crediário' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Parcelas</label>
                  <select 
                    value={installments}
                    onChange={e => setInstallments(Number(e.target.value))}
                    className="w-full border border-gray-300 rounded-lg py-2 px-3"
                  >
                    {[1,2,3,4,5,6,10,12,24].map(n => (
                      <option key={n} value={n}>{n}x de R$ {(total/n).toFixed(2)}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-medium">R$ {subtotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between items-center text-sm mb-3">
                  <span className="text-gray-500">Desconto (%)</span>
                  <input 
                    type="number" 
                    min="0" max="100"
                    value={discountPercent}
                    onChange={e => setDiscountPercent(Number(e.target.value))}
                    className="w-20 border border-gray-300 rounded px-2 py-1 text-right"
                  />
                </div>

                {needsApproval && (
                  <div className="bg-yellow-50 text-yellow-800 text-xs p-2 rounded flex gap-2 items-start mb-3 border border-yellow-200">
                    <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                    <p>O desconto de {discountPercent}% supera seu limite de {limitDiscount}%. O pedido exigirá aprovação do gerente.</p>
                  </div>
                )}

                <div className="border-t border-gray-200 pt-3 mt-1 flex justify-between items-center">
                  <span className="font-bold text-gray-900">Total a pagar</span>
                  <span className="font-bold text-xl text-[var(--primary)]">R$ {total.toFixed(2)}</span>
                </div>
              </div>

            </div>

            <div className="p-4 bg-white border-t border-gray-100">
              <button 
                onClick={handleFinalize}
                disabled={loading}
                className={`w-full text-white rounded-xl py-3.5 font-bold flex items-center justify-center gap-2 transition-all ${
                  needsApproval ? 'bg-yellow-500 active:bg-yellow-600' : 'bg-[var(--primary)] active:brightness-90'
                }`}
              >
                {loading ? 'Processando...' : (
                  <>
                    <Check size={20} />
                    {needsApproval ? 'Enviar para Aprovação' : 'Confirmar Pedido'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
