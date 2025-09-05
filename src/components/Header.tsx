import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, User, Menu, X, Shield, LogOut } from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { Cart } from "./Cart";
import { AuthModal } from "./AuthModal";

export function Header() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { getTotalItems } = useCart();
  const { user, isAdmin, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <a href="#home" className="flex items-center">
                <img
                  src="/logo.jpg" // 👈 place your logo in the public/ folder (e.g., public/logo.png)
                  alt="EasyClick Gadgets"
                  className="h-16 w-32"
                />
              </a>

              <nav className="hidden md:flex space-x-6">
                <a
                  href="#home"
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Home
                </a>
                <a
                  href="#products"
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Products
                </a>
                <a
                  href="#about"
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                >
                  About
                </a>
                <a
                  href="#contact"
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Contact
                </a>
                {isAdmin && (
                  <a
                    href="/admin"
                    className="text-orange-600 hover:text-orange-700 transition-colors flex items-center gap-1"
                  >
                    <Shield className="w-4 h-4" />
                    Admin Dashboard
                  </a>
                )}
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors"
              >
                <ShoppingCart className="w-6 h-6" />
                {getTotalItems() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {getTotalItems()}
                  </span>
                )}
              </button>

              {user ? (
                <div className="hidden md:flex items-center space-x-2">
                  <span className="text-sm text-gray-600">
                    {user.email} {isAdmin && "(Admin)"}
                  </span>
                  <button
                    onClick={handleSignOut}
                    className="p-2 text-gray-700 hover:text-red-600 transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="hidden md:flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span>Login</span>
                </button>
              )}

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-gray-700"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden border-t border-gray-200 py-4"
              >
                <nav className="flex flex-col space-y-3">
                  <a
                    href="#home"
                    className="text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    Home
                  </a>
                  <a
                    href="#products"
                    className="text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    Products
                  </a>
                  <a
                    href="#about"
                    className="text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    About
                  </a>
                  <a
                    href="#contact"
                    className="text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    Contact
                  </a>
                  {isAdmin && (
                    <a
                      href="#admin"
                      className="text-orange-600 hover:text-orange-700 transition-colors flex items-center gap-1"
                    >
                      <Shield className="w-4 h-4" />
                      Admin Dashboard
                    </a>
                  )}
                  {user ? (
                    <div className="pt-2 border-t border-gray-200">
                      <div className="text-sm text-gray-600 mb-2">
                        {user.email} {isAdmin && "(Admin)"}
                      </div>
                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-2 text-red-600 hover:text-red-700"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setIsAuthModalOpen(true);
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors pt-2 border-t border-gray-200"
                    >
                      <User className="w-5 h-5" />
                      <span>Login</span>
                    </button>
                  )}
                </nav>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
}
