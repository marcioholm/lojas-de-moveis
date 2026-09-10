CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES tenants(id) NOT NULL,
  product_id UUID REFERENCES products(id),
  nome TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  status TEXT DEFAULT 'novo',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tenants can manage their own leads" 
ON leads FOR ALL USING (
  tenant_id = (SELECT tenant_id FROM profiles WHERE id = auth.uid())
);
