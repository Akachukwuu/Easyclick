/*
  # Create products table for tech store

  1. New Tables
    - `products`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `description` (text, optional)
      - `price` (numeric, required)
      - `image_url` (text, optional)
      - `created_at` (timestamp)
      
  2. Security
    - Enable RLS on `products` table
    - Add policy for public read access
    - Add policy for admin-only write access
*/

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price numeric(10,2) NOT NULL,
  image_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read products
CREATE POLICY "Anyone can read products"
  ON products
  FOR SELECT
  USING (true);

-- Only authenticated admin users can insert products
CREATE POLICY "Admin can insert products"
  ON products
  FOR INSERT
  TO authenticated
  WITH CHECK (
    (SELECT auth.jwt() ->> 'user_metadata')::jsonb ->> 'is_admin' = 'true'
  );

-- Only authenticated admin users can update products
CREATE POLICY "Admin can update products"
  ON products
  FOR UPDATE
  TO authenticated
  USING (
    (SELECT auth.jwt() ->> 'user_metadata')::jsonb ->> 'is_admin' = 'true'
  );

-- Only authenticated admin users can delete products
CREATE POLICY "Admin can delete products"
  ON products
  FOR DELETE
  TO authenticated
  USING (
    (SELECT auth.jwt() ->> 'user_metadata')::jsonb ->> 'is_admin' = 'true'
  );

-- Insert sample laptop products
INSERT INTO products (name, description, price, image_url) VALUES
  ('MacBook Pro 16"', 'Powerful laptop with M3 Pro chip, perfect for professionals and creatives.', 2399.00, 'https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=800'),
  ('Dell XPS 13', 'Ultra-portable premium laptop with stunning InfinityEdge display.', 1299.00, 'https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=800'),
  ('Gaming Laptop RTX 4080', 'High-performance gaming laptop with latest RTX graphics.', 1899.00, 'https://images.pexels.com/photos/777001/pexels-photo-777001.jpeg?auto=compress&cs=tinysrgb&w=800'),
  ('ThinkPad X1 Carbon', 'Business-grade laptop with military-grade durability and performance.', 1599.00, 'https://images.pexels.com/photos/5240446/pexels-photo-5240446.jpeg?auto=compress&cs=tinysrgb&w=800'),
  ('Surface Laptop Studio', 'Versatile 2-in-1 laptop perfect for creative professionals.', 1699.00, 'https://images.pexels.com/photos/1229861/pexels-photo-1229861.jpeg?auto=compress&cs=tinysrgb&w=800'),
  ('ASUS ROG Zephyrus', 'Ultra-thin gaming laptop with exceptional performance.', 2199.00, 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=800');