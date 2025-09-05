import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingCart, Star, Heart } from "lucide-react";
import { Product, supabase, isSupabaseConfigured } from "../lib/supabase";
import { useCart } from "../contexts/CartContext";

export function ProductGrid() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    if (!isSupabaseConfigured()) {
      setError(
        'Supabase connection not configured. Please click "Connect to Supabase" in the top right corner to set up your database connection.'
      );
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Supabase error:", error);
        if (
          error.code === "PGRST116" ||
          error.message.includes("Could not find the table")
        ) {
          throw new Error(
            "Products table not found. Please create the products table in your Supabase database."
          );
        }
        throw new Error(`Database error: ${error.message}`);
      }
      setProducts(data || []);
      setError(null);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError(
        error instanceof Error ? error.message : "Failed to fetch products"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product);
  };

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  if (error) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Featured Products
            </h2>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-2xl mx-auto">
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                {error.includes("Products table not found")
                  ? "Database Setup Required"
                  : "Configuration Required"}
              </h3>
              <p className="text-yellow-700 mb-4">{error}</p>
              {error.includes("Products table not found") ? (
                <div className="text-sm text-yellow-600 space-y-2">
                  <p className="font-medium">To create the products table:</p>
                  <ol className="list-decimal list-inside space-y-1 ml-4">
                    <li>Go to your Supabase project dashboard</li>
                    <li>Navigate to the "SQL Editor" section</li>
                    <li>Run the SQL migration from the project files</li>
                  </ol>
                  <p className="mt-2">
                    The migration file is located at:{" "}
                    <code className="bg-yellow-100 px-1 rounded">
                      supabase/migrations/create_products_table.sql
                    </code>
                  </p>
                </div>
              ) : (
                <p className="text-sm text-yellow-600">
                  Please click "Connect to Supabase" in the top right corner to
                  set up your database connection.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array(6)
          .fill(0)
          .map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-gray-300 h-64 rounded-lg mb-4"></div>
              <div className="bg-gray-300 h-4 w-3/4 rounded mb-2"></div>
              <div className="bg-gray-300 h-4 w-1/2 rounded"></div>
            </div>
          ))}
      </div>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Featured Products
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our carefully curated selection of premium tech gadgets
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group cursor-pointer"
              onClick={() => handleProductClick(product.id)}
            >
              <div className="relative overflow-hidden">
                <img
                  src={product.image_url || "/api/placeholder/400/300"}
                  alt={product.name}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="bg-white/90 p-2 rounded-full hover:bg-red-50 transition-colors duration-200">
                    <Heart className="w-5 h-5 text-gray-600 hover:text-red-500" />
                  </button>
                </div>
                <div className="absolute top-4 left-4">
                  <div className="flex items-center bg-white/90 rounded-full px-3 py-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium ml-1">4.8</span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                  {product.name}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {product.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-gray-800">
                    ₦{product.price.toLocaleString()}
                  </div>
                  <button
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(product);
                    }}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
