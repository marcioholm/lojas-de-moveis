'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, CheckCircle2, MonitorSmartphone, Package, FileText, Truck, BarChart3, ChevronDown, ShieldCheck, Tag, Percent, FileCode2, Store, Users } from 'lucide-react'

const APP_NAME = "VitrinaHub"

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const toggleFaq = (index: number) => {
    if (openFaq === index) setOpenFaq(null)
    else setOpenFaq(index)
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] font-sans text-[var(--text-primary)] selection:bg-[var(--accent)] selection:text-white">
      {/* 1. Nav */}
      <nav className="fixed w-full bg-[var(--bg)]/90 backdrop-blur-md z-50 border-b border-[var(--border-light)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[var(--primary)] text-white flex items-center justify-center rounded-lg font-serif font-bold text-xl shadow-md">
                V
              </div>
              <span className="font-bold text-xl tracking-wide">{APP_NAME}</span>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#funcionalidades" className="text-[var(--text-secondary)] hover:text-[var(--primary)] font-medium transition-colors">Funcionalidades</a>
              <a href="#planos" className="text-[var(--text-secondary)] hover:text-[var(--primary)] font-medium transition-colors">Planos</a>
              <a href="#duvidas" className="text-[var(--text-secondary)] hover:text-[var(--primary)] font-medium transition-colors">Dúvidas</a>
              <Link href="/login" className="text-[var(--primary)] font-bold hover:text-[var(--primary-hover)] transition-colors">
                Entrar
              </Link>
              <Link href="/signup" className="bg-[var(--cta)] text-white px-6 py-2.5 rounded-lg font-bold shadow-md hover:bg-[var(--cta-hover)] hover:-translate-y-0.5 transition-all">
                Testar Grátis
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-[var(--text-primary)]">
                {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-4 pt-2 pb-6 space-y-2 shadow-xl absolute w-full">
            <a href="#funcionalidades" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-3 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50">Funcionalidades</a>
            <a href="#planos" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-3 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50">Planos</a>
            <a href="#duvidas" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-3 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50">Dúvidas</a>
            <div className="pt-4 flex flex-col gap-3 px-3">
              <Link href="/login" className="w-full text-center py-3 border border-gray-200 rounded-lg font-bold text-gray-900">Entrar</Link>
              <Link href="/signup" className="w-full text-center py-3 bg-[var(--cta)] text-white rounded-lg font-bold">Testar Grátis</Link>
            </div>
          </div>
        )}
      </nav>

      {/* 2. Hero */}
      <section className="pt-40 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <h1 className="text-5xl md:text-6xl font-bold font-serif text-[var(--primary)] leading-tight mb-6 max-w-4xl mx-auto">
          Sua loja de móveis ainda vive de caderno, WhatsApp e planilha?
        </h1>
        <p className="text-xl md:text-2xl text-[var(--text-secondary)] mb-10 max-w-2xl mx-auto leading-relaxed">
          O {APP_NAME} é o sistema feito exclusivamente para o lojista de móveis que quer vender mais, controlar tudo na palma da mão e parar de perder dinheiro com erro de estoque.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link href="/signup" className="w-full sm:w-auto bg-[var(--cta)] text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg shadow-[var(--cta)]/30 hover:bg-[var(--cta-hover)] hover:-translate-y-1 transition-all">
            Testar grátis por 14 dias
          </Link>
          <a href="#solucao" className="w-full sm:w-auto bg-white border-2 border-[var(--primary)] text-[var(--primary)] px-8 py-4 rounded-xl font-bold text-lg hover:bg-[var(--primary)] hover:text-white transition-all">
            Ver como funciona
          </a>
        </div>
        <p className="mt-4 text-sm text-[var(--text-muted)]">Sem necessidade de cartão de crédito.</p>
      </section>

      {/* 3. Problemas */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-serif text-[var(--primary)] mb-4">
              Você já passou por isso essa semana?
            </h2>
            <p className="text-lg text-[var(--text-secondary)]">Se você é dono de loja de móveis, essas situações são o seu maior ralo de dinheiro.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: 'Vendeu o que não tinha', desc: 'O vendedor fecha o pedido, o cliente paga, mas na hora de entregar... o móvel já tinha sido vendido por outro e ninguém avisou.' },
              { title: 'Carnê no papel de pão', desc: 'O cliente atrasa a parcela, você esquece de cobrar porque o carnê está no fundo da gaveta, e o dinheiro simplesmente não entra.' },
              { title: 'Fotos no WhatsApp', desc: 'O cliente pede pra ver opções de sofá, e o vendedor fica rolando a galeria do celular pra achar fotos, passando pouca credibilidade.' },
              { title: 'Preço desatualizado', desc: 'A tabela da fábrica mudou, mas o vendedor fez o preço antigo. Você só descobre o prejuízo na hora de pagar o fornecedor.' },
              { title: 'Comissão confusa', desc: 'Fim do mês é aquele desespero pra calcular quem vendeu o quê, quem já recebeu vale e quem teve venda cancelada.' },
              { title: 'Caderno perdido', desc: 'Toda a inteligência da sua loja (contatos de clientes, histórico de compras) depende de um caderno que pode ser perdido a qualquer momento.' }
            ].map((problema, i) => (
              <div key={i} className="bg-[var(--bg)] p-8 rounded-2xl border border-[var(--border-light)] hover:border-[var(--accent)] transition-colors">
                <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center mb-6">
                  <X size={24} strokeWidth={3} />
                </div>
                <h3 className="text-xl font-bold text-[var(--primary)] mb-3">{problema.title}</h3>
                <p className="text-[var(--text-secondary)] leading-relaxed">{problema.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Solução (Features) */}
      <section id="funcionalidades" className="py-24 bg-[var(--bg)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-serif text-[var(--primary)] mb-4">
              O sistema desenhado para o balcão da loja
            </h2>
            <p className="text-lg text-[var(--text-secondary)]">Feito para ser simples, rápido e funcionar tanto no computador quanto no celular do vendedor.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            <FeatureCard 
              icon={<MonitorSmartphone />} 
              title="PDV Mobile" 
              desc="Seus vendedores fecham vendas caminhando pela loja. Pelo celular, eles veem estoque, montam o pedido e enviam direto pro caixa." 
            />
            <FeatureCard 
              icon={<Store />} 
              title="Vitrine Digital Integrada" 
              desc="Tenha um link com o catálogo da sua loja. O cliente olha os móveis em casa e clica direto pro WhatsApp do seu vendedor." 
            />
            <FeatureCard 
              icon={<FileText />} 
              title="Gestão de Carnês" 
              desc="Emissão de promissórias com um clique, baixa de parcelas rápida e um painel vermelho te avisando quem está devendo." 
            />
            <FeatureCard 
              icon={<Package />} 
              title="Estoque Blindado" 
              desc="Baixa automática no ato da venda. Ninguém nunca mais vai vender o roupeiro que já foi prometido pra outro cliente." 
            />
            <FeatureCard 
              icon={<Truck />} 
              title="Controle de Entregas" 
              desc="Painel visual para o seu montador/entregador saber exatamente o que levar e onde entregar hoje." 
            />
            <FeatureCard 
              icon={<BarChart3 />} 
              title="Relatórios que importam" 
              desc="Saiba o ticket médio, qual vendedor converte mais, quais móveis estão encalhados e o faturamento real do mês." 
            />
          </div>
        </div>
      </section>

      {/* 5. Por dentro do sistema (Diferenciais) */}
      <section className="py-24 bg-[var(--primary)] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-serif mb-4 text-[var(--accent)]">
              Detalhes que só quem vive de móveis entende
            </h2>
            <p className="text-lg text-white/80">Nós sabemos onde o calo aperta. Veja as proteções que colocamos no sistema.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-x-12 gap-y-10">
            <DiffItem icon={<ShieldCheck />} title="Permissões por Vendedor" desc="O vendedor só vê as vendas dele. O gerente vê tudo. Você decide quem pode aplicar desconto ou cancelar venda." />
            <DiffItem icon={<Percent />} title="Desconto com Trava" desc="Cadastre o valor de custo. O sistema te avisa se o desconto que o vendedor está dando vai zerar sua margem de lucro." />
            <DiffItem icon={<Users />} title="Comissão Descomplicada" desc="Você paga comissão na venda ou no recebimento do carnê? O sistema calcula as duas opções automaticamente." />
            <DiffItem icon={<FileCode2 />} title="Importação de XML" desc="Chegou o caminhão da fábrica? Jogue o XML da nota no sistema e os móveis entram no estoque na hora." />
            <DiffItem icon={<Tag />} title="Vitrine 'Chama no Whats'" desc="A Vitrine Digital pode ocultar preços (para você não entregar o jogo pra concorrência) e forçar o cliente a chamar no WhatsApp." />
            <DiffItem icon={<CheckCircle2 />} title="Funil de Leads (CRM)" desc="O cliente entrou na loja e falou 'vou dar uma voltinha'. O sistema te lembra de mandar mensagem pra ele no dia seguinte." />
          </div>
        </div>
      </section>

      {/* 6. Planos e Preços */}
      <section id="planos" className="py-24 bg-[var(--bg)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-serif text-[var(--primary)] mb-4">
              Planos desenhados para o tamanho do seu negócio
            </h2>
            <p className="text-lg text-[var(--text-secondary)]">Sem contratos longos, sem taxa de adesão, cancele quando quiser.</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 items-center max-w-6xl mx-auto">
            {/* Tier 1 */}
            <div className="bg-white p-8 rounded-3xl border border-[var(--border-light)] shadow-sm relative">
              <h3 className="text-2xl font-bold text-[var(--primary)] mb-2">Vitrine</h3>
              <p className="text-[var(--text-secondary)] text-sm h-10">Ideal para quem já tem ERP mas quer digitalizar o catálogo.</p>
              <div className="my-6">
                <span className="text-4xl font-black text-gray-900">R$97</span>
                <span className="text-gray-500">/mês</span>
              </div>
              <ul className="space-y-4 mb-8">
                <PlanFeature text="2 usuários (Dono + 1)" />
                <PlanFeature text="Catálogo digital completo" />
                <PlanFeature text="Captação de leads pro WhatsApp" />
                <PlanFeature text="Link personalizado da vitrine" />
                <PlanFeature text="NÃO INCLUI: Gestão ERP" negative />
              </ul>
              <Link href="/signup" className="block w-full py-4 text-center rounded-xl font-bold text-[var(--primary)] bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-colors">
                Começar Vitrine
              </Link>
            </div>

            {/* Tier 2 */}
            <div className="bg-[var(--primary)] p-10 rounded-3xl shadow-2xl relative transform lg:scale-105 z-10 border-2 border-[var(--accent)]">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[var(--accent)] text-[var(--primary)] font-black uppercase tracking-wider text-xs px-4 py-1.5 rounded-full">
                Mais Escolhido
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Gestão</h3>
              <p className="text-white/70 text-sm h-10">Para a loja que precisa organizar do estoque à promissória.</p>
              <div className="my-6">
                <span className="text-5xl font-black text-white">R$197</span>
                <span className="text-white/60">/mês</span>
              </div>
              <div className="text-[11px] text-[var(--accent)] font-bold uppercase tracking-wide mb-4 border-b border-white/10 pb-2">Admin + 4 Vendedores inclusos (+R$30 extra)</div>
              <ul className="space-y-4 mb-8 text-white/90">
                <PlanFeature text="Estoque inteligente" light />
                <PlanFeature text="PDV Mobile para vendedores" light />
                <PlanFeature text="Gestão de carnês e promissórias" light />
                <PlanFeature text="Controle de entregas e montagem" light />
                <PlanFeature text="Relatórios financeiros e comissão" light />
                <PlanFeature text="Permissões avançadas de acesso" light />
                <PlanFeature text="NÃO INCLUI: Vitrine Digital" negative light />
              </ul>
              <Link href="/signup" className="block w-full py-4 text-center rounded-xl font-bold text-white bg-[var(--cta)] hover:bg-[var(--cta-hover)] shadow-lg hover:-translate-y-0.5 transition-all">
                Testar 14 dias grátis
              </Link>
            </div>

            {/* Tier 3 */}
            <div className="bg-white p-8 rounded-3xl border border-[var(--border-light)] shadow-sm relative">
              <h3 className="text-2xl font-bold text-[var(--primary)] mb-2">Completo</h3>
              <p className="text-[var(--text-secondary)] text-sm h-10">ERP + Vitrine operando juntos para escalar sua loja.</p>
              <div className="my-6">
                <span className="text-4xl font-black text-gray-900">R$297</span>
                <span className="text-gray-500">/mês</span>
              </div>
              <div className="text-[11px] text-[var(--primary)] font-bold uppercase tracking-wide mb-4 border-b border-gray-100 pb-2">Admin + 5 Vendedores inclusos (+R$10 extra)</div>
              <ul className="space-y-4 mb-8">
                <PlanFeature text="TUDO do plano Gestão" />
                <PlanFeature text="TUDO do plano Vitrine" />
                <PlanFeature text="CRM (Jornada de Leads)" />
                <PlanFeature text="Integração total do catálogo" />
                <PlanFeature text="Prioridade no suporte VIP" />
              </ul>
              <Link href="/signup" className="block w-full py-4 text-center rounded-xl font-bold text-white bg-[var(--primary)] hover:bg-[var(--primary-hover)] shadow-md transition-colors">
                Assinar o Completo
              </Link>
            </div>
          </div>
          
          <div className="mt-12 text-center text-sm text-[var(--text-secondary)] bg-blue-50 border border-blue-100 p-4 rounded-xl max-w-3xl mx-auto">
            <strong className="text-blue-900 block mb-1">Dica de mestre:</strong>
            Para lojas com muitos funcionários, repare que no plano <b>Completo</b> o custo de usuário adicional é apenas R$10. O plano <i>Gestão com 6 vendedores (R$257)</i> custa quase o mesmo que o <i>Completo com 6 (R$307)</i> — mas o Completo te entrega a Vitrine Digital!
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 bg-white border-t border-[var(--border-light)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold font-serif text-[var(--primary)] mb-8">
            Desenvolvido por especialistas em varejo de móveis
          </h2>
          <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16">
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-[var(--accent)]" size={32} />
              <div className="text-left">
                <p className="font-bold text-gray-900">Dados Seguros</p>
                <p className="text-sm text-[var(--text-secondary)]">Criptografia de ponta a ponta</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Users className="text-[var(--accent)]" size={32} />
              <div className="text-left">
                <p className="font-bold text-gray-900">Suporte Humano</p>
                <p className="text-sm text-[var(--text-secondary)]">Atendimento via WhatsApp</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FAQ */}
      <section id="duvidas" className="py-24 bg-white border-t border-[var(--border-light)]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold font-serif text-[var(--primary)] mb-4">
              Perguntas Frequentes
            </h2>
          </div>

          <div className="space-y-4">
            {[
              { 
                q: "Como o sistema funciona no celular?", 
                a: "O sistema roda direto no navegador do celular, igual a um aplicativo, mas sem precisar baixar nada na loja de apps. O vendedor acessa o link, faz o login e já consegue montar o pedido na frente do cliente."
              },
              { 
                q: "Quantos vendedores posso cadastrar?", 
                a: "Cada plano tem uma quantidade de acessos de vendedores já inclusos (veja a tabela de preços). Se você tiver uma equipe maior, poderá adicionar usuários extras pagando um pequeno valor adicional por cada um."
              },
              { 
                q: "A vitrine digital tem carrinho de compras/frete?", 
                a: "Não. Nós somos focados no fluxo real das lojas físicas de móveis: a vitrine serve como um catálogo digital maravilhoso para atrair o cliente. O 'botão de compra' na verdade manda a foto do móvel direto pro WhatsApp do seu vendedor, para que ele negocie frete e montagem."
              },
              { 
                q: "Consigo importar meus produtos atuais?", 
                a: "Sim! Se você tiver uma planilha (Excel) com os seus móveis, nós temos uma ferramenta de importação em massa para você não precisar cadastrar um por um."
              },
              { 
                q: "Meus funcionários vão ver o preço de custo?", 
                a: "Não se você não quiser! O nosso painel de permissões permite que você esconda dados financeiros, preços de custo e comissões dos outros. O vendedor só vê a tabela de preço de venda dele."
              },
              { 
                q: "Se eu cancelar, perco meus dados?", 
                a: "Nunca. Os dados são seus. Se decidir cancelar, você poderá exportar todos os seus clientes, carnês e produtos para uma planilha Excel antes de desativarmos a conta."
              }
            ].map((faq, i) => (
              <div key={i} className="border border-[var(--border-light)] rounded-xl overflow-hidden">
                <button 
                  onClick={() => toggleFaq(i)}
                  className="w-full px-6 py-5 bg-[var(--bg)] hover:bg-gray-100 flex justify-between items-center text-left transition-colors"
                >
                  <span className="font-bold text-gray-900">{faq.q}</span>
                  {openFaq === i ? <ChevronUp className="text-[var(--primary)]" /> : <ChevronDown className="text-gray-400" />}
                </button>
                {openFaq === i && (
                  <div className="px-6 py-5 bg-white text-[var(--text-secondary)] leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. CTA Final */}
      <section className="py-24 bg-[var(--primary)] text-center px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold font-serif text-white mb-8 leading-tight">
            Sua concorrência vai continuar anotando vendas no caderno. <span className="text-[var(--accent)]">E você?</span>
          </h2>
          <p className="text-xl text-white/80 mb-10">O próximo passo para a profissionalização da sua loja está a um clique de distância.</p>
          <Link href="/signup" className="inline-block bg-[var(--cta)] text-white px-10 py-5 rounded-xl font-bold text-xl shadow-2xl hover:bg-[var(--cta-hover)] hover:-translate-y-1 transition-all">
            Criar minha conta agora (14 dias grátis)
          </Link>
        </div>
      </section>

      {/* 9. Footer */}
      <footer className="bg-gray-950 text-gray-400 py-12 text-sm text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center">
          <div className="w-10 h-10 bg-[var(--primary)] text-white flex items-center justify-center rounded-lg font-serif font-bold text-xl shadow-md mb-6 grayscale opacity-50">
            V
          </div>
          <p>&copy; {new Date().getFullYear()} {APP_NAME}. Todos os direitos reservados.</p>
          <p className="mt-2">Sistema vertical ERP e CRM exclusivo para o varejo de móveis.</p>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <a 
        href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5511999999999'}?text=Olá,%20gostaria%20de%20saber%20mais%20sobre%20o%20VitrinaHub!`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-50 animate-pulse"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 16 16">
          <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c-.003 1.396.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c.003-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.004-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
        </svg>
      </a>
    </div>
  )
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="text-center sm:text-left">
      <div className="inline-flex w-14 h-14 bg-white border border-[var(--border-light)] text-[var(--primary)] rounded-2xl items-center justify-center mb-6 shadow-sm">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-[var(--text-secondary)] leading-relaxed">{desc}</p>
    </div>
  )
}

function DiffItem({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 w-12 h-12 bg-white/10 text-[var(--accent)] rounded-xl flex items-center justify-center">
        {icon}
      </div>
      <div>
        <h4 className="text-lg font-bold text-white mb-2">{title}</h4>
        <p className="text-white/60 leading-relaxed text-sm">{desc}</p>
      </div>
    </div>
  )
}

function PlanFeature({ text, negative = false, light = false }: { text: string, negative?: boolean, light?: boolean }) {
  return (
    <li className={`flex items-start gap-3 ${negative ? (light ? 'text-red-300 line-through' : 'text-red-500 line-through') : ''}`}>
      {!negative && <CheckCircle2 className={`flex-shrink-0 mt-0.5 ${light ? 'text-[var(--accent)]' : 'text-[var(--primary)]'}`} size={20} />}
      {negative && <X className="flex-shrink-0 mt-0.5" size={20} />}
      <span className={!negative ? (light ? 'text-white' : 'text-gray-700') : ''}>{text}</span>
    </li>
  )
}
