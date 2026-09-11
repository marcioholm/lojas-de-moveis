import { Construction } from 'lucide-react'

export default function PedidosPage() {
  return (
    <div className="flex flex-col items-center justify-center h-[70vh] text-center px-4">
      <div className="w-20 h-20 bg-[var(--primary)]/10 rounded-full flex items-center justify-center mb-6">
        <Construction size={40} className="text-[var(--primary)]" />
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Pedidos (Em breve)</h1>
      <p className="text-gray-500 max-w-md">
        O módulo de pedidos está sendo construído com as melhores práticas para a sua loja.
      </p>
    </div>
  )
}
