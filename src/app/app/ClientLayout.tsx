'use client'

import { ReactNode, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  Wallet,
  FileText,
  Truck,
  Store,
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react'
import { logout } from '../login/actions'

const navigation = [
  { name: 'Visão Geral', href: '/app/dashboard', icon: LayoutDashboard },
  { name: 'Leads', href: '/app/leads', icon: Users },
  { name: 'Estoque', href: '/app/estoque', icon: Package },
  { name: 'Clientes', href: '/app/clientes', icon: Users },
  { name: 'PDV Móvel', href: '/app/pdv-movel', icon: ShoppingCart },
  { name: 'Gestão Vendas (Caixa)', href: '/app/pdv', icon: ShoppingCart },
  { name: 'Pedidos', href: '/app/pedidos', icon: FileText },
  { name: 'Crediário', href: '/app/crediario', icon: Wallet },
  { name: 'NF-e', href: '/app/nfe', icon: FileText },
  { name: 'Entregas', href: '/app/entregas', icon: Truck },
  { name: 'Vitrine', href: '/app/vitrine', icon: Store },
  { name: 'Configurações', href: '/app/config', icon: Settings },
]

export default function ClientLayout({ children, userProfile }: { children: ReactNode, userProfile?: any }) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (pathname === '/app/onboarding') {
    return <>{children}</> // Oculta o layout inteiro se for a tela de onboarding
  }

  return (
    <div className="flex min-h-screen bg-[var(--bg)] text-[var(--text-primary)] font-body">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 md:hidden" 
          onClick={() => setSidebarOpen(false)} 
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-[240px] bg-[var(--sidebar-bg)] text-[var(--sidebar-text)] flex flex-col
        transition-transform duration-300 md:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full border-[1.5px] border-[var(--sidebar-accent)] flex items-center justify-center text-[var(--sidebar-accent)] font-serif font-bold text-lg">
              M
            </div>
            <div className="ml-3 transition-all duration-300">
              <b className="block text-white text-sm font-bold tracking-wider uppercase">Vitrina</b>
              <small className="block text-white/60 text-[9px] tracking-[0.3em] uppercase">Hub</small>
            </div>
          </div>
          <button className="md:hidden text-white" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 flex flex-col gap-1">
          <div className="text-[9px] font-bold tracking-widest uppercase opacity-60 px-3 mb-2 mt-2">Menu Principal</div>
          {navigation.map((item) => {
            const isActive = pathname.startsWith(item.href)
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-colors relative
                  ${isActive 
                    ? 'bg-white/10 text-[var(--sidebar-active)]' 
                    : 'hover:bg-white/5 hover:text-[var(--sidebar-active)]'}
                `}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-[var(--sidebar-accent)] rounded-r-sm" />
                )}
                <item.icon size={18} className="shrink-0" />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[var(--sidebar-accent)] text-[var(--sidebar-bg)] flex items-center justify-center font-bold text-[11px]">
              US
            </div>
            <div>
              <b className="block text-white text-[11px]">Usuário</b>
              <small className="block text-[9px] opacity-80">Vendedor</small>
            </div>
          </div>
          <button 
            onClick={() => logout()}
            className="text-[var(--sidebar-text)] hover:text-white"
            title="Sair"
          >
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-[240px] flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 bg-[var(--bg-raised)] border-b border-[var(--border)] flex items-center justify-between px-4 md:px-8 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button className="md:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu size={22} />
            </button>
            <div className="text-[11px] text-[var(--text-muted)] hidden sm:block">
              Visão Geral / <strong className="text-[var(--text-primary)] font-semibold">Dashboard</strong>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-xs text-[var(--text-muted)] hidden sm:block">
              {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
            </div>
          </div>
        </header>

        <div className="p-4 md:p-8 max-w-[1440px] mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  )
}
