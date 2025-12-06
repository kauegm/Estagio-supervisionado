import { Product } from "../App";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ShoppingCart, Star } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface HomePageProps {
  onBuyNow: (product: Product) => void;
}

const products: Product[] = [
  {
    id: 1,
    name: "Fones de ouvido sem fio",
    description: "Fones de ouvido premium com cancelamento de ruído e bateria com duração de até 30 horas.",
    price: 299.99,
    image: "https://images.unsplash.com/photo-1622986416229-fc8233af2ae6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aXJlbGVzcyUyMGhlYWRwaG9uZXMlMjBwcm9kdWN0fGVufDF8fHx8MTc2MDA4MzE1NXww&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Audio",
  },
  {
    id: 2,
    name: "Smart Watch Pro",
    description: "Monitoramento avançado de condicionamento físico com monitor de frequência cardíaca e GPS.",
    price: 399.99,
    image: "https://images.unsplash.com/photo-1739287700815-7eef4abaab4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHdhdGNoJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NjAxNDc0NzJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Wearables",
  },
  {
    id: 3,
    name: "Ultra Laptop",
    description: "Notebook potente com 16 GB de RAM e SSD de 512 GB para profissionais.",
    price: 1299.99,
    image: "https://images.unsplash.com/photo-1511385348-a52b4a160dc2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXB0b3AlMjBjb21wdXRlcnxlbnwxfHx8fDE3NjAwNTQzODl8MA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Computers",
  },
  {
    id: 4,
    name: "Pro Camera",
    description: "Câmera profissional sem espelho com gravação de vídeo em 4K",
    price: 1899.99,
    image: "https://images.unsplash.com/photo-1579535984712-92fffbbaa266?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYW1lcmElMjBwaG90b2dyYXBoeXxlbnwxfHx8fDE3NjAwODU0MTB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Photography",
  },
  {
    id: 5,
    name: "Smartphone X",
    description: "O mais recente smartphone com 5G, câmera tripla e bateria para o dia todo.",
    price: 999.99,
    image: "https://images.unsplash.com/photo-1636308093602-b1f355e8720d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHBob25lJTIwbW9iaWxlfGVufDF8fHx8MTc2MDA2MzMwMHww&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Mobile",
  },
  {
    id: 6,
    name: "Tablet Pro",
    description: "Tablet de alto desempenho perfeito para trabalho e entretenimento.",
    price: 799.99,
    image: "https://images.unsplash.com/photo-1672239069328-dd1535c0d78a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0YWJsZXQlMjBkZXZpY2V8ZW58MXx8fHwxNzYwMDY0Mzg1fDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Tablets",
  },
];

export default function HomePage({ onBuyNow }: HomePageProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="mb-12 text-center">
        <h1 className="text-slate-900 mb-4">Bem-vindo à TechStore</h1>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Descubra os mais recentes produtos tecnológicos com os melhores preços e diversas opções de pagamento.
        </p>
      </section>

      {/* Products Grid */}
      <section>
        <h2 className="text-slate-800 mb-6">Produtos em destaque</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-square overflow-hidden bg-slate-100">
                <ImageWithFallback
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="line-clamp-1">{product.name}</CardTitle>
                  <Badge variant="secondary">{product.category}</Badge>
                </div>
                <CardDescription className="line-clamp-2">
                  {product.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-slate-900">${product.price.toFixed(2)}</span>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={() => onBuyNow(product)}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Comprar agora
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="text-center p-6">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingCart className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-slate-800 mb-2">Compra fácil</h3>
          <p className="text-slate-600">Navegue e compre produtos com apenas alguns cliques</p>
        </div>
        <div className="text-center p-6">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-slate-800 mb-2">Múltiplas opções de pagamento</h3>
          <p className="text-slate-600">Aceitamos cartões de crédito, débito, PIX e boleto.</p>
        </div>
        <div className="text-center p-6">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h3 className="text-slate-800 mb-2">Pagamentos Seguros</h3>
          <p className="text-slate-600">Suas informações de pagamento são criptografadas e seguras.</p>
        </div>
      </section>
    </div>
  );
}
