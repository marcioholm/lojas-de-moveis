-- Fix leads table: add status column if only status_funil exists, add product_id if missing
DO $$
BEGIN
  -- If status_funil exists but status doesn't, rename it
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'status_funil')
     AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'status') THEN
    ALTER TABLE leads RENAME COLUMN status_funil TO status;
  END IF;

  -- Add product_id if missing
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'product_id') THEN
    ALTER TABLE leads ADD COLUMN product_id UUID REFERENCES products(id);
  END IF;

  -- Add cor_primaria to tenants if missing
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tenants' AND column_name = 'cor_primaria') THEN
    ALTER TABLE tenants ADD COLUMN cor_primaria TEXT DEFAULT '#1a332a';
  END IF;
END $$;
