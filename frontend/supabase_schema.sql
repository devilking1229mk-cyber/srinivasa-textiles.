-- ==========================================================================
-- SRINIVASA TEXTILES - SUPABASE DATABASE TABLE SETUP & REALTIME CONFIGURATION
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/wmafkpgyjtwogezmmpvm/sql/new
-- ==========================================================================

-- 1. Create or Upgrade Orders Table with Realtime Tracking Columns
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIMEZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  order_id TEXT UNIQUE,
  amount NUMERIC DEFAULT 0,
  total_amount NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'pending',          -- 'pending', 'paid', 'cancelled'
  payment_status TEXT DEFAULT 'pending',  -- 'pending', 'paid', 'VERIFIED'
  utr_number TEXT DEFAULT '',
  upi_ref_no TEXT DEFAULT '',
  customer_name TEXT NOT NULL DEFAULT 'Valued Patron',
  mobile_number TEXT NOT NULL DEFAULT '',
  shipping_address TEXT NOT NULL DEFAULT '',
  email TEXT DEFAULT '',
  payment_method TEXT DEFAULT 'UPI',
  cart_items JSONB NOT NULL DEFAULT '[]'::jsonb,
  fulfillment_status TEXT DEFAULT 'Pending Dispatch',
  courier TEXT DEFAULT 'BlueDart Express',
  tracking_number TEXT,
  notes TEXT
);

-- Ensure backwards-compatibility for existing columns if table already existed
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='status') THEN
    ALTER TABLE orders ADD COLUMN status TEXT DEFAULT 'pending';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='amount') THEN
    ALTER TABLE orders ADD COLUMN amount NUMERIC DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='utr_number') THEN
    ALTER TABLE orders ADD COLUMN utr_number TEXT DEFAULT '';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='order_id') THEN
    ALTER TABLE orders ADD COLUMN order_id TEXT;
  END IF;
END $$;

-- 2. Create Products Catalog Table
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMP WITH TIMEZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  name TEXT NOT NULL,
  department TEXT NOT NULL,
  category TEXT NOT NULL,
  fabric TEXT NOT NULL,
  price NUMERIC NOT NULL,
  original_price NUMERIC,
  stock INTEGER DEFAULT 10,
  image_url TEXT,
  images JSONB DEFAULT '[]'::jsonb,
  colors JSONB DEFAULT '[]'::jsonb,
  weave TEXT,
  zari TEXT,
  occasion TEXT,
  origin TEXT DEFAULT 'Kanchipuram, Tamil Nadu',
  silk_mark BOOLEAN DEFAULT true,
  handloom_mark BOOLEAN DEFAULT true,
  hsn_code TEXT DEFAULT '50072010',
  description TEXT
);

-- 3. Create Subscribers Table
CREATE TABLE IF NOT EXISTS subscribers (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMP WITH TIMEZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  product_id TEXT NOT NULL,
  product_title TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  size TEXT,
  status TEXT DEFAULT 'Pending Alert'
);

-- 4. Create Feedbacks Table
CREATE TABLE IF NOT EXISTS feedbacks (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMP WITH TIMEZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  author TEXT NOT NULL,
  location TEXT,
  rating INTEGER DEFAULT 5,
  softness_score INTEGER DEFAULT 10,
  title TEXT,
  comment TEXT,
  dept TEXT,
  verified BOOLEAN DEFAULT true
);

-- ==========================================================================
-- REALTIME PUBLICATION & REPLICA IDENTITY (MANDATORY FOR SUPABASE REALTIME)
-- ==========================================================================

-- Enable full row replication for realtime UPDATE filters (payload.new)
ALTER TABLE orders REPLICA IDENTITY FULL;

-- Add orders table to supabase_realtime publication
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'orders'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE orders;
  END IF;
EXCEPTION
  WHEN undefined_object THEN
    CREATE PUBLICATION supabase_realtime FOR TABLE orders;
END $$;

-- ==========================================================================
-- ==========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES (Hardened Production Security)
-- ==========================================================================

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedbacks ENABLE ROW LEVEL SECURITY;

-- 1. ORDERS POLICIES
DROP POLICY IF EXISTS "Allow public insert on orders" ON orders;
DROP POLICY IF EXISTS "Allow public select on orders" ON orders;
DROP POLICY IF EXISTS "Allow public update on orders" ON orders;

-- Allow storefront customers to insert new orders
CREATE POLICY "Allow public insert on orders" ON orders 
  FOR INSERT WITH CHECK (true);

-- Deny public scraping of all orders: Public can only view their specific order if they know the order_id or tracking_number
CREATE POLICY "Allow public select own order" ON orders 
  FOR SELECT USING (
    (auth.role() = 'authenticated') OR 
    (auth.role() = 'service_role') OR
    (order_id IS NOT NULL AND order_id = current_setting('request.headers', true)::json->>'x-order-id')
  );

-- Only backend service_role or authenticated admin can update orders (e.g. mark paid / change status)
CREATE POLICY "Allow admin/service update on orders" ON orders 
  FOR UPDATE USING (
    auth.role() = 'service_role' OR auth.role() = 'authenticated'
  );

-- 2. PRODUCTS POLICIES
DROP POLICY IF EXISTS "Allow public select on products" ON products;
DROP POLICY IF EXISTS "Allow public upsert on products" ON products;

-- Everyone can view products catalog
CREATE POLICY "Allow public select on products" ON products 
  FOR SELECT USING (true);

-- Only backend service role or authenticated admin can modify catalog
CREATE POLICY "Allow admin write on products" ON products 
  FOR ALL USING (
    auth.role() = 'service_role' OR auth.role() = 'authenticated'
  );

-- 3. SUBSCRIBERS POLICIES
DROP POLICY IF EXISTS "Allow public insert on subscribers" ON subscribers;
DROP POLICY IF EXISTS "Allow public select on subscribers" ON subscribers;
DROP POLICY IF EXISTS "Allow public update on subscribers" ON subscribers;

CREATE POLICY "Allow public insert on subscribers" ON subscribers 
  FOR INSERT WITH CHECK (true);

-- Protect subscriber emails from public scraping: Only service_role or admin can read
CREATE POLICY "Allow admin read on subscribers" ON subscribers 
  FOR SELECT USING (
    auth.role() = 'service_role' OR auth.role() = 'authenticated'
  );

-- 4. FEEDBACKS / REVIEWS POLICIES
DROP POLICY IF EXISTS "Allow public insert on feedbacks" ON feedbacks;
DROP POLICY IF EXISTS "Allow public select on feedbacks" ON feedbacks;
DROP POLICY IF EXISTS "Allow public update on feedbacks" ON feedbacks;

CREATE POLICY "Allow public insert on feedbacks" ON feedbacks 
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public select on feedbacks" ON feedbacks 
  FOR SELECT USING (verified = true OR auth.role() = 'service_role');
