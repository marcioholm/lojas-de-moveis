'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'
import { processSignup } from './actions'
import { validateCPF, maskCPF, maskPhone, maskCNPJ } from '@/lib/utils'

const UFs = ['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO']

export default function SignupPage() {
  const [cpf, setCpf] = useState('')
  const [phone, setPhone] = useState('')
  const [cnpj, setCnpj] = useState('')
  const [cpfError, setCpfError] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [serverError, setServerError] = useState('')
  const [isPending, startTransition] = useTransition()

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = maskCPF(e.target.value)
    setCpf(val)
    if (val.length === 14) {
      setCpfError(validateCPF(val) ? '' : 'CPF inválido')
    } else {
      setCpfError('')
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setServerError('')
    
    if (password !== confirmPassword) {
      setPasswordError('As senhas não coincidem')
      return
    }
    setPasswordError('')
    
    if (!validateCPF(cpf)) {
      setCpfError('CPF inválido')
      return
    }
    
    const formData = new FormData(e.currentTarget)
    
    startTransition(async () => {
      const result = await processSignup(formData)
      if (result?.error) {
        setServerError(result.error)
      }
    })
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] flex flex-col md:flex-row">
      {/* Left Column - Form */}
      <div className="w-full lg:w-[55%] flex flex-col justify-center px-6 sm:px-12 lg:px-20 py-12">
        <div className="max-w-xl w-full mx-auto">
          <div className="mb-10">
            <Link href="/" className="inline-flex items-center gap-3 mb-8 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 bg-[var(--primary)] text-white flex items-center justify-center rounded-md font-serif font-bold shadow-md">
                V
              </div>
              <span className="font-bold tracking-wide text-gray-900">VitrinaHub</span>
            </Link>
            <h1 className="font-serif text-3xl font-bold text-gray-900 mb-2">Crie sua conta em 2 minutos</h1>
            <p className="text-gray-500 text-sm">O primeiro passo para profissionalizar a gestão da sua loja.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Responsável */}
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-2">Dados do Responsável</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <label className="text-[12px] font-medium text-gray-600">Nome completo *</label>
                  <input required name="name" type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white shadow-sm outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 transition-all text-sm" placeholder="João da Silva" />
                </div>
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-medium text-gray-600">CPF *</label>
                  <input required name="cpf" type="text" value={cpf} onChange={handleCpfChange} maxLength={14} className={`w-full px-4 py-3 rounded-xl border ${cpfError ? 'border-red-400 focus:border-red-500 focus:ring-red-500/10' : 'border-gray-200 focus:border-[var(--primary)] focus:ring-[var(--primary)]/10'} bg-white shadow-sm outline-none focus:ring-4 transition-all text-sm`} placeholder="000.000.000-00" />
                  {cpfError && <span className="text-red-500 text-xs mt-1">{cpfError}</span>}
                </div>
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-medium text-gray-600">WhatsApp *</label>
                  <input required name="phone" type="text" value={phone} onChange={(e) => setPhone(maskPhone(e.target.value))} maxLength={15} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white shadow-sm outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 transition-all text-sm" placeholder="(11) 99999-9999" />
                </div>

                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <label className="text-[12px] font-medium text-gray-600">E-mail (Seu login) *</label>
                  <input required name="email" type="email" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white shadow-sm outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 transition-all text-sm" placeholder="exemplo@loja.com" />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-medium text-gray-600">Senha *</label>
                  <input required name="password" type="password" value={password} onChange={e => setPassword(e.target.value)} minLength={6} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white shadow-sm outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 transition-all text-sm" placeholder="••••••••" />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-medium text-gray-600">Confirmar Senha *</label>
                  <input required type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} minLength={6} className={`w-full px-4 py-3 rounded-xl border ${passwordError ? 'border-red-400 focus:border-red-500 focus:ring-red-500/10' : 'border-gray-200 focus:border-[var(--primary)] focus:ring-[var(--primary)]/10'} bg-white shadow-sm outline-none focus:ring-4 transition-all text-sm`} placeholder="••••••••" />
                  {passwordError && <span className="text-red-500 text-xs mt-1">{passwordError}</span>}
                </div>
              </div>
            </div>

            {/* Loja */}
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-2">Dados da Loja</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <label className="text-[12px] font-medium text-gray-600">Nome da Loja *</label>
                  <input required name="storeName" type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white shadow-sm outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 transition-all text-sm" placeholder="Ex: Móveis Silva" />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-medium text-gray-600">CNPJ (Opcional)</label>
                  <input name="cnpj" type="text" value={cnpj} onChange={(e) => setCnpj(maskCNPJ(e.target.value))} maxLength={18} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white shadow-sm outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 transition-all text-sm" placeholder="00.000.000/0000-00" />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-medium text-gray-600">Equipe de Vendas *</label>
                  <select required name="employees" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white shadow-sm outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 transition-all text-sm">
                    <option value="">Selecione...</option>
                    <option value="1-3">1 a 3 vendedores</option>
                    <option value="4-6">4 a 6 vendedores</option>
                    <option value="7-10">7 a 10 vendedores</option>
                    <option value="11-20">11 a 20 vendedores</option>
                    <option value="20+">Mais de 20</option>
                  </select>
                </div>

                <div className="flex gap-4 md:col-span-2">
                  <div className="flex flex-col gap-1.5 w-1/3">
                    <label className="text-[12px] font-medium text-gray-600">UF *</label>
                    <select required name="uf" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white shadow-sm outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 transition-all text-sm">
                      <option value="">...</option>
                      {UFs.map(uf => <option key={uf} value={uf}>{uf}</option>)}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5 w-2/3">
                    <label className="text-[12px] font-medium text-gray-600">Cidade *</label>
                    <input required name="city" type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white shadow-sm outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 transition-all text-sm" placeholder="São Paulo" />
                  </div>
                </div>
              </div>
            </div>

            {serverError && (
              <div className="p-4 bg-red-50 text-red-700 text-sm rounded-xl font-medium border border-red-100">
                {serverError}
              </div>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-4 px-4 bg-[var(--cta)] text-white font-bold text-[15px] rounded-xl hover:bg-[var(--cta-hover)] transition-all shadow-lg shadow-[var(--cta)]/20 disabled:opacity-70 flex justify-center active:scale-[0.98]"
            >
              {isPending ? 'Criando sua conta...' : 'Criar conta e escolher plano'}
            </button>
            
            <p className="text-center text-xs text-gray-400 mt-4">
              Ao continuar, você concorda com nossos Termos de Uso e Política de Privacidade.
            </p>
          </form>
        </div>
      </div>

      {/* Right Column - Presentation */}
      <div className="hidden lg:flex lg:w-[45%] bg-[var(--primary)] text-white p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[var(--accent)]/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4"></div>
        
        <div className="relative z-10 flex-1 flex flex-col justify-center max-w-lg mx-auto">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-8 border border-white/20">
            <CheckCircle2 size={32} className="text-[var(--accent)]" />
          </div>
          <h2 className="text-4xl font-serif font-bold leading-tight mb-6">
            Você está a poucos passos de transformar a gestão da sua loja.
          </h2>
          <ul className="space-y-5 text-white/80">
            <li className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-[var(--accent)]/20 text-[var(--accent)] flex items-center justify-center flex-shrink-0">1</div>
              <span>Crie sua conta administrativa segura</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-[var(--accent)]/20 text-[var(--accent)] flex items-center justify-center flex-shrink-0">2</div>
              <span>Escolha o plano ideal para sua equipe</span>
            </li>
            <li className="flex items-center gap-3 opacity-50">
              <div className="w-6 h-6 rounded-full bg-white/10 text-white flex items-center justify-center flex-shrink-0">3</div>
              <span>Acesse o painel e configure seu estoque</span>
            </li>
          </ul>
        </div>
        
        <div className="relative z-10 text-center mt-auto pt-12">
          <p className="text-sm text-white/60">Já tem uma conta?</p>
          <Link href="/login" className="inline-block mt-2 font-bold text-[var(--accent)] hover:text-white transition-colors">
            Fazer login no sistema &rarr;
          </Link>
        </div>
      </div>
    </div>
  )
}
