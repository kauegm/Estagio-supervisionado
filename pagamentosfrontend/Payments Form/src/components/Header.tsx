import { ShoppingBag, Home, Info, LogIn, User, LogOut } from "lucide-react";
import { Button } from "./ui/button";

interface HeaderProps {
  currentPage: "home" | "checkout" | "about" | "login" | "signup";
  onNavigate: (page: "home" | "checkout" | "about" | "login" | "signup") => void;
  user: { email: string; name: string } | null;
  onLogout: () => void;
}

export default function Header({ currentPage, onNavigate, user, onLogout }: HeaderProps) {
  return (
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate("home")}>
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
                Página Inicial
              </Button>
              <Button
                  variant={currentPage === "about" ? "default" : "ghost"}
                  onClick={() => onNavigate("about")}
                  className="flex items-center gap-2"
              >
                <Info className="w-4 h-4" />
                Sobre
              </Button>

              {user ? (
                  <>
                    <div className="flex items-center gap-2 px-3 py-2 text-slate-700 bg-slate-100 rounded-md">
                      <User className="w-4 h-4" />
                      <span className="text-sm hidden sm:inline">{user.name}</span>
                    </div>
                    <Button
                        variant="ghost"
                        onClick={onLogout}
                        className="flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="hidden sm:inline">Sair</span>
                    </Button>
                  </>
              ) : (
                  <Button
                      variant={currentPage === "login" ? "default" : "ghost"}
                      onClick={() => onNavigate("login")}
                      className="flex items-center gap-2"
                  >
                    <LogIn className="w-4 h-4" />
                    Login
                  </Button>
              )}
            </nav>
          </div>
        </div>
      </header>
  );
}