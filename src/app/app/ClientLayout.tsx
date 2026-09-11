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
  X,
  Bell,
  Search,
  Target,
  BarChart,
  UserCog,
  Wrench,
  RotateCcw,
  Receipt,
  PiggyBank,
  HeartHandshake,
  CalendarDays,
  ClipboardList,
  TerminalSquare
} from 'lucide-react'
import { logout } from '../login/actions'

const navigationGroups = [
  {
    name: 'Principal',
    items: [
      { name: 'Dashboard', href: '/app/dashboard', icon: LayoutDashboard },
      { name: 'Vitrine', href: '/app/vitrine', icon: Store },
      { name: 'Estoque', href: '/app/estoque', icon: Package },
      { name: 'Clientes', href: '/app/clientes', icon: Users },
    ]
  },
  {
    name: 'Comercial',
    items: [
      { name: 'PDV Móvel', href: '/app/pdv-movel', icon: ShoppingCart },
      { name: 'Pedidos', href: '/app/pedidos', icon: ClipboardList },
      { name: 'Leads', href: '/app/leads', icon: Target },
      { name: 'Vendas', href: '/app/vendas', icon: Wallet },
      { name: 'Crediário', href: '/app/crediario', icon: FileText },
      { name: 'Reservas', href: '/app/reservas', icon: CalendarDays },
      { name: 'Entregas', href: '/app/entregas', icon: Truck },
    ]
  },
  {
    name: 'Financeiro',
    items: [
      { name: 'Financeiro', href: '/app/financeiro', icon: PiggyBank },
      { name: 'Contas a Pagar', href: '/app/contas-pagar', icon: Receipt },
      { name: 'Comissões', href: '/app/comissoes', icon: Wallet },
    ]
  },
  {
    name: 'Operações',
    items: [
      { name: 'Ordens de Serviço', href: '/app/ordens', icon: Wrench },
      { name: 'Pós-Venda', href: '/app/pos-venda', icon: HeartHandshake },
      { name: 'Devoluções', href: '/app/devolucoes', icon: RotateCcw },
    ]
  },
  {
    name: 'Fiscal & Gestão',
    items: [
      { name: 'NF-e', href: '/app/nfe', icon: FileText },
      { name: 'Relatórios', href: '/app/relatorios', icon: BarChart },
      { name: 'Metas', href: '/app/metas', icon: Target },
      { name: 'Equipe', href: '/app/usuarios', icon: UserCog },
    ]
  },
  {
    name: 'Sistema',
    items: [
      { name: 'Configurações', href: '/app/config', icon: Settings },
      { name: 'Logs', href: '/app/log', icon: TerminalSquare },
    ]
  }
]

// Map paths to breadcrumb labels
function getBreadcrumb(pathname: string) {
  for (const group of navigationGroups) {
    const navItem = group.items.find(item => pathname.startsWith(item.href))
    if (navItem) return navItem.name
  }
  return 'Dashboard'
}

export default function ClientLayout({ children, userProfile }: { children: ReactNode, userProfile?: { nome?: string, role?: string } }) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (pathname === '/app/onboarding') {
    return <>{children}</>
  }

  const currentPage = getBreadcrumb(pathname)
  const initials = userProfile?.nome
    ? userProfile.nome.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : 'US'

  const roleLabels: Record<string, string> = {
    dono: 'Administrador',
    vendedor: 'Vendedor',
    caixa: 'Caixa',
    estoquista: 'Estoquista',
    entregador: 'Entregador',
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
              V
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

        <nav className="flex-1 overflow-y-auto p-4 flex flex-col gap-1 custom-scrollbar">
          {navigationGroups.map((group, i) => (
            <div key={group.name} className={i !== 0 ? 'mt-4' : ''}>
              <div className="text-[9px] font-bold tracking-widest uppercase opacity-50 px-3 mb-2">{group.name}</div>
              {group.items.map((item) => {
                const isActive = pathname.startsWith(item.href)
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`
                      flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors relative mb-1
                      ${isActive
                        ? 'bg-white/10 text-[var(--sidebar-active)]'
                        : 'hover:bg-white/5 hover:text-[var(--sidebar-active)]'}
                    `}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-[var(--sidebar-accent)] rounded-r-sm" />
                    )}
                    <item.icon size={16} className={`shrink-0 ${isActive ? 'text-[var(--sidebar-accent)]' : 'opacity-70'}`} />
                    {item.name}
                  </Link>
                )
              })}
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[var(--sidebar-accent)] text-[var(--sidebar-bg)] flex items-center justify-center font-bold text-[11px]">
              {initials}
            </div>
            <div>
              <b className="block text-white text-[11px]">{userProfile?.nome || 'Usuário'}</b>
              <small className="block text-[9px] opacity-80">{roleLabels[userProfile?.role || ''] || 'Membro'}</small>
            </div>
          </div>
          <button
            onClick={() => logout()}
            className="text-[var(--sidebar-text)] hover:text-white transition-colors"
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
            <div className="text-[12px] text-[var(--text-muted)] hidden sm:block">
              Visão Geral / <strong className="text-[var(--text-primary)] font-semibold">{currentPage}</strong>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative hidden md:block">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input 
                type="text" 
                placeholder="Buscar cliente, pedido, produto..." 
                className="pl-9 pr-4 py-2 bg-[var(--bg-inset)] border border-[var(--border)] rounded-full text-[13px] w-[260px] focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all"
              />
            </div>
            <button className="relative text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[var(--danger)] text-white text-[9px] font-bold rounded-full flex items-center justify-center">3</span>
            </button>
            <div className="text-xs text-[var(--text-muted)] hidden lg:block border-l border-[var(--border)] pl-6">
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
