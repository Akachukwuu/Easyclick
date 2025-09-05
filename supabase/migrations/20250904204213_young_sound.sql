/*
  # Create products table

  1. New Tables
    - `products`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `description` (text, optional)
      - `price` (numeric, required, must be positive)
      - `image_url` (text, optional)
      - `created_at` (timestamp with timezone, defaults to now)

  2. Security
    - Enable RLS on `products` table
    - Add policy for public read access to products
    - Add policy for authenticated users to manage products (for admin functionality)
*/

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price numeric NOT NULL CHECK (price >= 0),
  image_url text,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (anyone can view products)
CREATE POLICY "Anyone can view products"
  ON products
  FOR SELECT
  TO public
  USING (true);

-- Create policy for authenticated users to insert products (for admin functionality)
CREATE POLICY "Authenticated users can insert products"
  ON products
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create policy for authenticated users to update products (for admin functionality)
CREATE POLICY "Authenticated users can update products"
  ON products
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create policy for authenticated users to delete products (for admin functionality)
CREATE POLICY "Authenticated users can delete products"
  ON products
  FOR DELETE
  TO authenticated
  USING (true);