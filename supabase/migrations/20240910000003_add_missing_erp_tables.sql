-- Create enums for new tables
CREATE TYPE expense_status AS ENUM ('pendente', 'pago', 'atrasado');
CREATE TYPE commission_status AS ENUM ('a_pagar', 'pago');
CREATE TYPE service_order_status AS ENUM ('pendente', 'em_andamento', 'concluida', 'cancelada');
CREATE TYPE service_order_type AS ENUM ('montagem', 'assistencia', 'entrega', 'outro');
CREATE TYPE return_status AS ENUM ('em_analise', 'aprovada', 'rejeitada', 'concluida');
CREATE TYPE log_level AS ENUM ('info', 'warning', 'error');

-- Expenses (Contas a Pagar)
CREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  fornecedor TEXT NOT NULL,
  descricao TEXT,
  valor NUMERIC(10, 2) NOT NULL,
  data_vencimento DATE NOT NULL,
  data_pagamento DATE,
  status expense_status DEFAULT 'pendente',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Commissions
CREATE TABLE commissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  seller_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  mes_referencia DATE NOT NULL,
  total_vendas NUMERIC(10, 2) DEFAULT 0,
  taxa_comissao NUMERIC(5, 2) DEFAULT 0,
  valor_comissao NUMERIC(10, 2) DEFAULT 0,
  premios NUMERIC(10, 2) DEFAULT 0,
  total_receber NUMERIC(10, 2) DEFAULT 0,
  status commission_status DEFAULT 'a_pagar',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Service Orders (Ordens de Serviço)
CREATE TABLE service_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  sale_id UUID REFERENCES sales(id) ON DELETE SET NULL,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  tipo service_order_type NOT NULL,
  data_agendada DATE NOT NULL,
  equipe TEXT,
  status service_order_status DEFAULT 'pendente',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Product Reservations
CREATE TABLE product_reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  seller_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  data_vencimento DATE NOT NULL,
  status TEXT DEFAULT 'ativa',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- After Sales (Pós-Venda)
CREATE TABLE after_sales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  sale_id UUID REFERENCES sales(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  data_contato_previsto DATE NOT NULL,
  nota_satisfacao INTEGER CHECK (nota_satisfacao >= 1 AND nota_satisfacao <= 5),
  status TEXT DEFAULT 'pendente',
  observacoes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Returns (Devoluções)
CREATE TABLE returns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  sale_id UUID REFERENCES sales(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  motivo TEXT NOT NULL,
  valor NUMERIC(10, 2) NOT NULL,
  status return_status DEFAULT 'em_analise',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Goals (Metas)
CREATE TABLE goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  mes_referencia DATE NOT NULL,
  meta_global NUMERIC(10, 2) NOT NULL,
  valor_atingido NUMERIC(10, 2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- System Logs
CREATE TABLE system_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  acao TEXT NOT NULL,
  detalhes TEXT,
  ip_address TEXT,
  nivel log_level DEFAULT 'info',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE after_sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE returns ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies (assuming get_current_tenant_id() exists from init.sql)
CREATE POLICY "Tenant users can manage expenses" ON expenses
  FOR ALL USING (tenant_id = get_current_tenant_id());

CREATE POLICY "Tenant users can manage commissions" ON commissions
  FOR ALL USING (tenant_id = get_current_tenant_id());

CREATE POLICY "Tenant users can manage service_orders" ON service_orders
  FOR ALL USING (tenant_id = get_current_tenant_id());

CREATE POLICY "Tenant users can manage product_reservations" ON product_reservations
  FOR ALL USING (tenant_id = get_current_tenant_id());

CREATE POLICY "Tenant users can manage after_sales" ON after_sales
  FOR ALL USING (tenant_id = get_current_tenant_id());

CREATE POLICY "Tenant users can manage returns" ON returns
  FOR ALL USING (tenant_id = get_current_tenant_id());

CREATE POLICY "Tenant users can manage goals" ON goals
  FOR ALL USING (tenant_id = get_current_tenant_id());

CREATE POLICY "Tenant users can manage system_logs" ON system_logs
  FOR ALL USING (tenant_id = get_current_tenant_id());
