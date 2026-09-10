-- Add new roles to user_role enum
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'entregador';

-- Add new columns to tenants for Onboarding and Settings
ALTER TABLE tenants 
ADD COLUMN IF NOT EXISTS cnpj TEXT,
ADD COLUMN IF NOT EXISTS telefone_principal TEXT,
ADD COLUMN IF NOT EXISTS limite_desconto_padrao NUMERIC(5, 2) DEFAULT 10.00,
ADD COLUMN IF NOT EXISTS comissao_padrao NUMERIC(5, 2) DEFAULT 5.00,
ADD COLUMN IF NOT EXISTS setup_concluido BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS tier TEXT DEFAULT 'completo';

-- Add new columns to profiles
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS telefone TEXT;

-- Update deliveries table to support entregador_id
ALTER TABLE deliveries
ADD COLUMN IF NOT EXISTS motorista_id UUID REFERENCES profiles(id) ON DELETE SET NULL;
