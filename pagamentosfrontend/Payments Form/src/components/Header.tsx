import { ShoppingBag, Home, Info } from "lucide-react";
import { Button } from "./ui/button";

interface HeaderProps {
  currentPage: "home" | "checkout" | "about";
  onNavigate: (page: "home" | "checkout" | "about") => void;
}

export default function Header({ currentPage, onNavigate }: HeaderProps) {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-8 h-8 text-slate-800" />
            <h1 className="text-slate-800">TechStore</h1>
          </div>
          
          <nav className="flex items-center gap-2">
            <Button
              variant={currentPage === "home" ? "default" : "ghost"}
              onClick={() => onNavigate("home")}
              className="flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              Home
            </Button>
            <Button
              variant={currentPage === "about" ? "default" : "ghost"}
              onClick={() => onNavigate("about")}
              className="flex items-center gap-2"
            >
              <Info className="w-4 h-4" />
              Sobre
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
