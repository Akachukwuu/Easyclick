import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ShoppingCart,
  ArrowLeft,
  Star,
  Heart,
  Shield,
  Truck,
  RotateCcw,
} from "lucide-react";
import { Product, supabase } from "../lib/supabase";
import { useCart } from "../contexts/CartContext";

export function ProductDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const { addToCart } = useCart();

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (id) fetchProduct(id);
  }, [id]);

  // Reset carousel index when product changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [product?.id]);

  const fetchProduct = async (productId: string) => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*, product_images(image_url)")
        .eq("id", productId)
        .single();

      if (error) {
        if ((error as any).code === "PGRST116") {
          throw new Error("Product not found");
        }
        throw error;
      }

      // Map to your simplified type: { url: string }
      const images = (data.product_images || []).map((img: any) => ({
        url: img.image_url,
      }));

      setProduct({ ...data, product_images: images });
    } catch (err) {
      console.error("Error fetching product:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch product");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    for (let i = 0; i < quantity; i++) addToCart(product);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= 10) setQuantity(newQuantity);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Product Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            {error || "The product you're looking for doesn't exist."}
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  // Build the carousel source list from mapped urls
  const images = product.product_images?.length
    ? product.product_images.map((img) => img.url)
    : [product.image_url || "/api/placeholder/600/600"];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-6">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Products
        </button>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Image Carousel */}
            <div className="relative">
              <motion.img
                key={images[currentIndex]}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                src={images[currentIndex]}
                alt={product.name}
                className="w-full h-96 lg:h-full object-cover"
              />

              {images.length > 1 && (
                <>
                  <button
                    onClick={handlePrev}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full shadow"
                  >
                    ‹
                  </button>
                  <button
                    onClick={handleNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full shadow"
                  >
                    ›
                  </button>

                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {images.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentIndex(i)}
                        className={`w-3 h-3 rounded-full ${
                          i === currentIndex ? "bg-blue-600" : "bg-gray-300"
                        }`}
                        aria-label={`Show image ${i + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}

              {/* Floating Icons */}
              <div className="absolute top-4 right-4">
                <button className="bg-white/90 p-3 rounded-full hover:bg-red-50 transition-colors duration-200 shadow-lg">
                  <Heart className="w-6 h-6 text-gray-600 hover:text-red-500" />
                </button>
              </div>
              <div className="absolute top-4 left-4">
                <div className="flex items-center bg-white/90 rounded-full px-4 py-2 shadow-lg">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium ml-1">
                    4.8 (124 reviews)
                  </span>
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div className="p-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                  {product.name}
                </h1>

                <div className="text-4xl font-bold text-blue-600 mb-6">
                  ₦{product.price.toLocaleString()}
                </div>

                <p className="text-gray-600 text-lg leading-relaxed mb-8">
                  {product.description}
                </p>

                {/* Quantity Selector */}
                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Quantity
                  </label>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleQuantityChange(quantity - 1)}
                      className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                    >
                      -
                    </button>
                    <span className="text-xl font-semibold w-8 text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(quantity + 1)}
                      className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <motion.button
                  onClick={handleAddToCart}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-3 transition-all duration-300 ${
                    addedToCart
                      ? "bg-green-600 text-white"
                      : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl"
                  }`}
                >
                  <ShoppingCart className="w-6 h-6" />
                  {addedToCart ? "Added to Cart!" : `Add ${quantity} to Cart`}
                </motion.button>

                {/* Features */}
                <div className="mt-8 space-y-4">
                  <div className="flex items-center gap-3 text-gray-600">
                    <Truck className="w-5 h-5 text-green-600" />
                    <span>Free shipping on orders over ₦50,000</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <RotateCcw className="w-5 h-5 text-blue-600" />
                    <span>30-day return policy</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <Shield className="w-5 h-5 text-purple-600" />
                    <span>2-year warranty included</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
