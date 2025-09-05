/*
  # Create storage bucket for product images

  1. Storage
    - Create a public bucket called 'product-images'
    - Allow public access for reading images
    - Allow authenticated users to upload images

  2. Security
    - Enable RLS on storage.objects
    - Add policies for public read access
    - Add policies for authenticated upload access
*/

-- Create the storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public access to view images
CREATE POLICY "Public Access for Product Images"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload product images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'product-images');

-- Allow authenticated users to update their uploaded images
CREATE POLICY "Authenticated users can update product images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'product-images')
WITH CHECK (bucket_id = 'product-images');

-- Allow authenticated users to delete product images
CREATE POLICY "Authenticated users can delete product images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'product-images');