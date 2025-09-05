import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Save, X, Shield, Upload, Image } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Product, supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  image_url: string;
}

export function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const { isAdmin } = useAuth();
  
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<ProductFormData>();

  useEffect(() => {
    if (isAdmin) {
      fetchProducts();
    }
  }, [isAdmin]);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        if (error.code === 'PGRST116' || error.message.includes('Could not find the table')) {
          console.error('Products table not found:', error);
          return;
        }
        throw error;
      }
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB');
        return;
      }
      
      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImageToSupabase = async (file: File): Promise<string> => {
    setUploadingImage(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(fileName, file);
      
      if (error) {
        throw error;
      }
      
      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName);
      
      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error('Failed to upload image. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  };

  const onSubmit = async (data: ProductFormData) => {
    try {
      let imageUrl = data.image_url;
      
      // If user uploaded a new image, upload it to Supabase
      if (imageFile) {
        imageUrl = await uploadImageToSupabase(imageFile);
      }
      
      const productData = {
        ...data,
        image_url: imageUrl
      };
      
      if (editingProduct) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingProduct.id);
        
        if (error) throw error;
        setEditingProduct(null);
      } else {
        const { error } = await supabase
          .from('products')
          .insert([productData]);
        
        if (error) throw error;
        setShowAddForm(false);
      }
      
      reset();
      setImageFile(null);
      setImagePreview(null);
      fetchProducts();
      
      // Show success message
      const message = editingProduct ? 'Product updated successfully!' : 'Product added successfully!';
      alert(message);
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error saving product. Please try again.');
    }
  };

  const deleteProduct = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      fetchProducts();
      alert('Product deleted successfully!');
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error deleting product. Please try again.');
    }
  };

  const startEdit = (product: Product) => {
    setEditingProduct(product);
    setValue('name', product.name);
    setValue('description', product.description || '');
    setValue('price', product.price);
    setValue('image_url', product.image_url || '');
  };

  const cancelEdit = () => {
    setEditingProduct(null);
    setShowAddForm(false);
    setImageFile(null);
    setImagePreview(null);
    reset();
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="bg-red-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Shield className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Admin Access Required</h2>
            <p className="text-gray-600 mb-6">You need admin privileges to access this page.</p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
              <h3 className="font-semibold text-blue-800 mb-2">To become an admin:</h3>
              <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
                <li>Go to your Supabase project dashboard</li>
                <li>Navigate to "SQL Editor"</li>
                <li>Run the script: <code className="bg-blue-100 px-1 rounded">supabase/migrations/setup_admin_user.sql</code></li>
                <li>Replace the email with your account email</li>
                <li>Refresh this page</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your store products</p>
        </div>
        
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Product Management</h2>
              <p className="text-gray-600">Add, edit, or remove products from your store</p>
            </div>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-4 rounded-xl font-semibold flex items-center gap-2 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Add Product
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Products</p>
                <p className="text-2xl font-bold text-gray-800">{products.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Plus className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Average Price</p>
                <p className="text-2xl font-bold text-gray-800">
                  ₦{products.length > 0 ? Math.round(products.reduce((sum, p) => sum + p.price, 0) / products.length).toLocaleString() : '0'}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <span className="text-green-600 font-bold text-lg">₦</span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Status</p>
                <p className="text-2xl font-bold text-green-600">Active</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>
        {(showAddForm || editingProduct) && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-6 mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button
                onClick={cancelEdit}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name *
                </label>
                <input
                  {...register('name', { required: 'Product name is required' })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter product name"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price (₦) *
                </label>
                <input
                  {...register('price', { 
                    required: 'Price is required',
                    min: { value: 0, message: 'Price must be positive' }
                  })}
                  type="number"
                  step="0.01"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="0.00"
                />
                {errors.price && (
                  <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  {...register('description')}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter product description"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Image
                </label>
                
                <div className="space-y-4">
                  {/* Image Upload */}
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-2 text-gray-400" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG, JPEG (MAX. 5MB)</p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                    </label>
                  </div>
                  
                  {/* Image Preview */}
                  {imagePreview && (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImageFile(null);
                          setImagePreview(null);
                        }}
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  
                  {/* OR divider */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">OR</span>
                    </div>
                  </div>
                  
                  {/* URL Input */}
                  <div>
                    <input
                      {...register('image_url')}
                      type="url"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Or paste image URL here..."
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      You can either upload an image or provide a URL
                    </p>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={uploadingImage}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-400 text-white px-8 py-4 rounded-xl font-semibold flex items-center gap-2 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:transform-none disabled:hover:scale-100"
                >
                  {uploadingImage ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Uploading Image...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      {editingProduct ? 'Update Product' : 'Add Product'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {products.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-auto">
              <Plus className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No Products Yet</h3>
              <p className="text-gray-600 mb-6">Start building your store by adding your first product!</p>
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300"
              >
                Add Your First Product
              </button>
            </div>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              <img
                src={product.image_url || '/api/placeholder/400/200'}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {product.name}
                </h3>
                <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                  {product.description}
                </p>
                <div className="text-xl font-bold text-gray-800 mb-4">
                  ₦{product.price.toLocaleString()}
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(product)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => deleteProduct(product.id)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}