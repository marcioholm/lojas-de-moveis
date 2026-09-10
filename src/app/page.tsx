import { Metadata } from 'next'
import LandingClient from './LandingClient'

export const metadata: Metadata = {
  title: 'VitrinaHub - O ERP definitivo para Lojas de Móveis',
  description: 'Sistema completo para gestão de lojas de móveis. Controle estoque, emita carnês, crie sua vitrine digital e venda mais no WhatsApp.',
  openGraph: {
    title: 'VitrinaHub - ERP para Lojas de Móveis',
    description: 'Sistema completo para gestão de lojas de móveis. Pare de perder dinheiro com caderno e planilha.',
    url: 'https://vitrinahub.com.br',
    siteName: 'VitrinaHub',
    locale: 'pt_BR',
    type: 'website',
  },
  alternates: {
    canonical: 'https://vitrinahub.com.br',
  },
}

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "VitrinaHub",
            "applicationCategory": "BusinessApplication",
            "operatingSystem": "Web",
            "offers": {
              "@type": "Offer",
              "price": "97.00",
              "priceCurrency": "BRL"
            }
          })
        }}
      />
      <LandingClient />
    </>
  )
}
