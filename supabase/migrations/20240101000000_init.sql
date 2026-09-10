-- Create enums
CREATE TYPE user_role AS ENUM ('dono', 'vendedor', 'estoquista', 'caixa');
CREATE TYPE sale_status AS ENUM ('pendente_aprovacao', 'aprovado', 'finalizado', 'rejeitado');
CREATE TYPE installment_status AS ENUM ('pendente', 'pago', 'atrasado');
CREATE TYPE delivery_status AS ENUM ('separacao', 'rota', 'entregue');

-- Tenants table
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  nome TEXT NOT NULL,
  logo_url TEXT,
  config JSONB DEFAULT '{"limite_desconto": 10, "comissao_padrao": 5}'::jsonb,
  tier INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Profiles table (linked to auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'vendedor',
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  foto_url TEXT,
  preco_custo NUMERIC(10, 2),
  preco_venda NUMERIC(10, 2) NOT NULL,
  margem NUMERIC(5, 2),
  estoque_atual INTEGER DEFAULT 0,
  estoque_min INTEGER DEFAULT 5,
  categoria TEXT,
  publico BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Customers table
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  cpf_cnpj TEXT,
  whatsapp TEXT,
  limite_credito NUMERIC(10, 2) DEFAULT 0,
  endereco TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sales table
CREATE TABLE sales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  seller_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  status sale_status DEFAULT 'pendente_aprovacao',
  total NUMERIC(10, 2) NOT NULL,
  desconto_aplicado NUMERIC(10, 2) DEFAULT 0,
  forma_pagamento TEXT,
  comissao NUMERIC(10, 2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sale items table
CREATE TABLE sale_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sale_id UUID REFERENCES sales(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE RESTRICT,
  quantidade INTEGER NOT NULL,
  preco_unitario NUMERIC(10, 2) NOT NULL
);

-- Installments (Crediário) table
CREATE TABLE installments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  sale_id UUID REFERENCES sales(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  valor NUMERIC(10, 2) NOT NULL,
  data_vencimento DATE NOT NULL,
  status installment_status DEFAULT 'pendente',
  data_pagamento DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Deliveries table
CREATE TABLE deliveries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  sale_id UUID REFERENCES sales(id) ON DELETE CASCADE,
  status delivery_status DEFAULT 'separacao',
  motorista TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Leads table
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  status_funil TEXT DEFAULT 'novo',
  origem TEXT DEFAULT 'vitrine',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE sale_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE installments ENABLE ROW LEVEL SECURITY;
ALTER TABLE deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Helper function to get current user's tenant_id
CREATE OR REPLACE FUNCTION get_current_tenant_id() RETURNS UUID AS $$
BEGIN
  RETURN (SELECT tenant_id FROM profiles WHERE id = auth.uid());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS Policies

-- Tenants: users can only see their own tenant
CREATE POLICY "Users can view their own tenant" ON tenants
  FOR SELECT USING (id = get_current_tenant_id());

-- Profiles: users can see profiles from their tenant
CREATE POLICY "Users can view profiles from their tenant" ON profiles
  FOR SELECT USING (tenant_id = get_current_tenant_id());

CREATE POLICY "Dono can insert profiles" ON profiles
  FOR INSERT WITH CHECK (
    tenant_id = get_current_tenant_id() AND
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'dono'
  );

-- Products
CREATE POLICY "Tenant users can view and manage products" ON products
  FOR ALL USING (tenant_id = get_current_tenant_id());
  
-- Public products can be viewed by anyone
CREATE POLICY "Public products are visible to all" ON products
  FOR SELECT USING (publico = true);

-- Customers
CREATE POLICY "Tenant users can manage customers" ON customers
  FOR ALL USING (tenant_id = get_current_tenant_id());

-- Sales
CREATE POLICY "Tenant users can manage sales" ON sales
  FOR ALL USING (tenant_id = get_current_tenant_id());

-- Sale Items
CREATE POLICY "Tenant users can manage sale items" ON sale_items
  FOR ALL USING (
    (SELECT tenant_id FROM sales WHERE id = sale_items.sale_id) = get_current_tenant_id()
  );

-- Installments
CREATE POLICY "Tenant users can manage installments" ON installments
  FOR ALL USING (tenant_id = get_current_tenant_id());

-- Deliveries
CREATE POLICY "Tenant users can manage deliveries" ON deliveries
  FOR ALL USING (tenant_id = get_current_tenant_id());

-- Leads
CREATE POLICY "Tenant users can manage leads" ON leads
  FOR ALL USING (tenant_id = get_current_tenant_id());

-- Public can insert leads
CREATE POLICY "Public can insert leads" ON leads
  FOR INSERT WITH CHECK (true);
