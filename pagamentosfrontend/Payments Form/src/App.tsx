import { useState, useEffect } from "react";
import Header from "./components/Header";
import HomePage from "./components/HomePage";
import CheckoutPage from "./components/CheckoutPage";
import AboutPage from "./components/AboutPage";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<"home" | "checkout" | "about" | "login" | "signup">("home");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [user, setUser] = useState<{ email: string; name: string } | null>(null);

  // Carregar usuário do localStorage ao iniciar
  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleBuyNow = (product: Product) => {
    setSelectedProduct(product);
    setCurrentPage("checkout");
  };

  const navigateTo = (page: "home" | "checkout" | "about" | "login" | "signup") => {
    setCurrentPage(page);
  };

  const handleLoginSuccess = (userData: { email: string; name: string }) => {
    setUser(userData);
    localStorage.setItem("currentUser", JSON.stringify(userData));
  };

  const handleSignupSuccess = (userData: { email: string; name: string }) => {
    setUser(userData);
    localStorage.setItem("currentUser", JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("currentUser");
    toast.success("Logout realizado com sucesso!");
    setCurrentPage("home");
  };

  return (
      <div className="min-h-screen bg-slate-50">
        <Header
            currentPage={currentPage}
            onNavigate={navigateTo}
            user={user}
            onLogout={handleLogout}
        />

        <main>
          {currentPage === "home" && (
              <HomePage onBuyNow={handleBuyNow} onNavigate={navigateTo} />
          )}
          {currentPage === "checkout" && (
              <CheckoutPage product={selectedProduct} onBackToHome={() => navigateTo("home")} />
          )}
          {currentPage === "about" && (
              <AboutPage />
          )}
          {currentPage === "login" && (
              <LoginPage onNavigate={navigateTo} onLoginSuccess={handleLoginSuccess} />
          )}
          {currentPage === "signup" && (
              <SignupPage onNavigate={navigateTo} onSignupSuccess={handleSignupSuccess} />
          )}
        </main>

        <Toaster />
      </div>
  );
}