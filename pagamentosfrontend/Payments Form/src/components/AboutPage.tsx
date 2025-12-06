import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import { ShoppingBag, Shield, CreditCard, Smartphone, Receipt, Zap } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center">
            <ShoppingBag className="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 className="text-slate-900 mb-4">Sobre TechStore</h1>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Seu destino confiável para os mais recentes produtos de tecnologia com opções de pagamento flexíveis.
        </p>
      </div>

      {/* Mission Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Nossa Missão</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-slate-600">
            A TechStore é uma plataforma de comércio eletrônico moderna, projetada para oferecer aos clientes os melhores produtos de tecnologia
            a preços competitivos. Acreditamos que todos devem ter acesso à tecnologia de ponta e estamos
            comprometidos em tornar a experiência de compra a mais tranquila e segura possível.
          </p>
          <p className="text-slate-600">
            Este projeto demonstra uma solução completa de comércio eletrônico com múltiplos métodos de pagamento, incluindo
            pagamentos tradicionais com cartão e opções de pagamento brasileiras como Pix e Boleto, tornando-a acessível
            a uma gama mais ampla de clientes.
          </p>
        </CardContent>
      </Card>

      {/* Features Section */}
      <div className="mb-8">
        <h2 className="text-slate-800 mb-6">Principais recursos</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CreditCard className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-slate-800 mb-2">Pagamentos com cartão</h3>
                  <p className="text-sm text-slate-600">
                    Aceite cartões de crédito e débito com processamento e validação de pagamentos seguros.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Smartphone className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-slate-800 mb-2">Integração Pix</h3>
                  <p className="text-sm text-slate-600">
                    Pagamentos instantâneos via Pix com geração de código QR para transações rápidas e fáceis.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Receipt className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-slate-800 mb-2">Suporte a Boleto</h3>
                  <p className="text-sm text-slate-600">
                    Gere boleto bancário para clientes que preferem pagar em bancos ou caixas eletrônicos.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-slate-800 mb-2">Check-out seguro</h3>
                  <p className="text-sm text-slate-600">
                    Todas as informações de pagamento são criptografadas e processadas com segurança para proteger seus dados.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Separator className="my-8" />

      {/* Technology Stack */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Tecnologia Stack
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-slate-700 mb-2">Frontend</h4>
              <ul className="text-sm text-slate-600 space-y-1">
                <li>• React com TypeScript</li>
                <li>• Tailwind CSS para estilização</li>
                <li>• Shadcn/ui components</li>
                <li>• React Hook Form para validação</li>
                <li>• Lucide icons</li>
              </ul>
            </div>
            <div>
              <h4 className="text-slate-700 mb-2">Características</h4>
              <ul className="text-sm text-slate-600 space-y-1">
                <li>• Navegação em várias páginas</li>
                <li>• Catálogo de produtos</li>
                <li>• Integração do carrinho de compras</li>
                <li>• Vários métodos de pagamento</li>
                <li>• Design responsivo</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator className="my-8" />

      {/* Contact Info */}
      <div className="text-center">
        <h3 className="text-slate-800 mb-4">Entre em contato</h3>
        <p className="text-slate-600 mb-6">
          Este é um projeto de demonstração que apresenta um fluxo de pagamento completo para comércio eletrônico.
          Para perguntas ou comentários, entre em contato!
        </p>
        <div className="flex justify-center gap-4 text-sm text-slate-500">
          <span>Construído com Figma Make</span>
          <span>•</span>
          <span>2025</span>
        </div>
      </div>
    </div>
  );
}
