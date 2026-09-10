'use client'

import { useState } from 'react'
import { ShoppingBag, X, Send } from 'lucide-react'

// Mocking server action for leads
async function submitLead(formData: FormData) {
  // In a real implementation this would call a server action to insert into 'leads' table
  // with tenant_id, product_id, nome, whatsapp.
  return new Promise(resolve => setTimeout(resolve, 500))
}

export default function LeadModalClient({ product, tenantWhatsApp }: { product: any, tenantWhatsApp?: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    try {
      await submitLead(formData)
      setSuccess(true)
      // Optional: redirect to whatsapp directly after capturing lead
      if (tenantWhatsApp) {
        const text = `Olá, tenho interesse no produto ${product.nome}!`
        window.open(`https://wa.me/${tenantWhatsApp.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`, '_blank')
      }
    } catch(err) {
      alert("Erro ao enviar interesse.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="mt-2 flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-[var(--brand)] border border-[var(--brand)] font-medium hover:bg-[var(--brand)] hover:text-white transition-colors"
      >
        <ShoppingBag size={18} />
        Tenho Interesse
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsOpen(false)} />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-sm p-6 overflow-hidden">
            <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
            
            <h3 className="text-xl font-bold font-serif mb-2" style={{ color: 'var(--brand)' }}>Tenho Interesse</h3>
            <p className="text-sm text-gray-600 mb-4">
              Ótima escolha! Preencha seus dados rápidos e te chamaremos no WhatsApp para negociar o <strong>{product.nome}</strong>.
            </p>

            {success ? (
              <div className="bg-green-50 text-green-700 p-4 rounded-lg border border-green-100 text-center">
                <p className="font-semibold mb-1">Enviado com sucesso!</p>
                <p className="text-sm">Um de nossos vendedores entrará em contato em breve.</p>
                <button onClick={() => setIsOpen(false)} className="mt-4 btn btn-outline w-full text-sm">Fechar</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Seu Nome</label>
                  <input type="text" name="nome" required className="w-full border border-gray-300 rounded-md p-2 focus:ring-[var(--brand)] focus:border-[var(--brand)] outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Seu WhatsApp</label>
                  <input type="tel" name="whatsapp" required placeholder="(11) 99999-9999" className="w-full border border-gray-300 rounded-md p-2 focus:ring-[var(--brand)] focus:border-[var(--brand)] outline-none" />
                </div>
                
                <input type="hidden" name="product_id" value={product.id} />
                
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full text-white rounded-lg py-2.5 font-bold flex items-center justify-center gap-2 mt-2 transition-opacity hover:opacity-90 disabled:opacity-50"
                  style={{ backgroundColor: 'var(--brand)' }}
                >
                  <Send size={18} />
                  {loading ? 'Enviando...' : 'Enviar e Falar no WhatsApp'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  )
}
