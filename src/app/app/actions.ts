'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

// Helper: get the current user's tenant_id
async function getCurrentTenantId() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Usuário não autenticado')

  const { data: profile } = await supabase
    .from('profiles')
    .select('tenant_id')
    .eq('id', user.id)
    .single()

  if (!profile?.tenant_id) throw new Error('Perfil sem tenant associado')
  return { supabase, tenantId: profile.tenant_id, userId: user.id }
}

// Product Actions
export async function createProduct(formData: FormData) {
  const { supabase, tenantId } = await getCurrentTenantId()

  const nome = formData.get('nome') as string
  const categoria = formData.get('categoria') as string
  const preco_custo = parseFloat(formData.get('preco_custo') as string || '0')
  const preco_venda = parseFloat(formData.get('preco_venda') as string || '0')
  const estoque_atual = parseInt(formData.get('estoque_atual') as string || '0')
  const estoque_min = parseInt(formData.get('estoque_min') as string || '2')
  const publico = formData.get('publico') === 'on'

  const { error } = await supabase.from('products').insert({
    tenant_id: tenantId,
    nome,
    categoria,
    preco_custo,
    preco_venda,
    estoque_atual,
    estoque_min,
    publico,
    margem: preco_custo > 0 ? ((preco_venda - preco_custo) / preco_venda) * 100 : 100
  })

  if (error) throw new Error(error.message)

  revalidatePath('/app/estoque')
}

export async function deleteProduct(id: string) {
  const { supabase } = await getCurrentTenantId()
  const { error } = await supabase.from('products').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/app/estoque')
}

// Customer Actions
export async function createCustomer(formData: FormData) {
  const { supabase, tenantId } = await getCurrentTenantId()

  const nome = formData.get('nome') as string
  const whatsapp = formData.get('whatsapp') as string
  const cpf_cnpj = formData.get('cpf_cnpj') as string
  const endereco = formData.get('endereco') as string

  const { error } = await supabase.from('customers').insert({
    tenant_id: tenantId,
    nome,
    whatsapp,
    cpf_cnpj,
    endereco
  })

  if (error) throw new Error(error.message)

  revalidatePath('/app/clientes')
}

export async function deleteCustomer(id: string) {
  const { supabase } = await getCurrentTenantId()
  const { error } = await supabase.from('customers').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/app/clientes')
}

// Sales Actions
export async function createSale(formData: FormData) {
  const { supabase, tenantId, userId } = await getCurrentTenantId()

  const customer_id = formData.get('customer_id') as string
  const forma_pagamento = formData.get('forma_pagamento') as string
  const produto_ids = formData.getAll('produto_id') as string[]
  const total = parseFloat(formData.get('total') as string || '0')

  // 1. Create sale
  const { data: sale, error: saleError } = await supabase.from('sales').insert({
    tenant_id: tenantId,
    seller_id: userId,
    customer_id: customer_id || null,
    total,
    forma_pagamento,
    status: 'aprovado'
  }).select().single()

  if (saleError) throw new Error(saleError.message)

  // 2. Add sale items and deduct stock
  for (const pid of produto_ids) {
    if (!pid) continue;

    const { data: product } = await supabase.from('products').select('preco_venda').eq('id', pid).single()
    if (!product) continue;

    await supabase.from('sale_items').insert({
      sale_id: sale.id,
      product_id: pid,
      quantidade: 1,
      preco_unitario: product.preco_venda
    })

    // Deduct stock
    const { data: currentStock } = await supabase.from('products').select('estoque_atual').eq('id', pid).single()
    if (currentStock) {
      await supabase.from('products').update({ estoque_atual: currentStock.estoque_atual - 1 }).eq('id', pid)
    }
  }

  // 3. Create Installments (Carnê) if Crediário
  if (forma_pagamento === 'Crediário') {
    const parcelas = parseInt(formData.get('parcelas') as string || '1')
    const valorParcela = total / parcelas

    for (let i = 1; i <= parcelas; i++) {
      const dataVencimento = new Date()
      dataVencimento.setMonth(dataVencimento.getMonth() + i)

      await supabase.from('installments').insert({
        tenant_id: tenantId,
        sale_id: sale.id,
        customer_id: customer_id,
        valor: valorParcela,
        data_vencimento: dataVencimento.toISOString().split('T')[0],
        status: 'pendente'
      })
    }
  }

  // 4. Create Delivery if needed
  const precisaEntrega = formData.get('precisa_entrega') === 'on'
  if (precisaEntrega) {
    await supabase.from('deliveries').insert({
      tenant_id: tenantId,
      sale_id: sale.id,
      status: 'separacao'
    })
  }

  revalidatePath('/app/pdv')
  revalidatePath('/app/estoque')
  revalidatePath('/app/crediario')
  revalidatePath('/app/entregas')
}

export async function payInstallment(id: string) {
  const { supabase } = await getCurrentTenantId()
  const { error } = await supabase.from('installments').update({
    status: 'pago',
    data_pagamento: new Date().toISOString().split('T')[0]
  }).eq('id', id)

  if (error) throw new Error(error.message)
  revalidatePath('/app/crediario')
}

export async function updateDeliveryStatus(id: string, newStatus: string) {
  const { supabase } = await getCurrentTenantId()
  const { error } = await supabase.from('deliveries').update({
    status: newStatus
  }).eq('id', id)

  if (error) throw new Error(error.message)
  revalidatePath('/app/entregas')
}

export async function createPublicLead(formData: FormData, tenantId: string, productId: string) {
  const supabase = await createClient()
  const nome = formData.get('nome') as string
  const whatsapp = formData.get('whatsapp') as string

  const { error } = await supabase.from('leads').insert({
    tenant_id: tenantId,
    product_id: productId,
    nome,
    whatsapp,
    status: 'novo',
    origem: 'vitrine_virtual'
  })

  if (error) throw new Error(error.message)
}
