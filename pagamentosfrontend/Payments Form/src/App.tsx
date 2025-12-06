import { useState } from "react";
import Header from "./components/Header";
import HomePage from "./components/HomePage";
import CheckoutPage from "./components/CheckoutPage";
import AboutPage from "./components/AboutPage";
import { Toaster } from "./components/ui/sonner";

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<"home" | "checkout" | "about">("home");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleBuyNow = (product: Product) => {
    setSelectedProduct(product);
    setCurrentPage("checkout");
  };

  const navigateTo = (page: "home" | "checkout" | "about") => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header currentPage={currentPage} onNavigate={navigateTo} />
      
      <main>
        {currentPage === "home" && (
          <HomePage onBuyNow={handleBuyNow} />
        )}
        {currentPage === "checkout" && (
          <CheckoutPage product={selectedProduct} onBackToHome={() => navigateTo("home")} />
        )}
        {currentPage === "about" && (
          <AboutPage />
        )}
      </main>
      
      <Toaster />
    </div>
  );
}
