import { Product } from "../App";
import PaymentForm from "./PaymentForm";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { ArrowLeft, Package, Tag } from "lucide-react";
import { Separator } from "./ui/separator";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface CheckoutPageProps {
  product: Product | null;
  onBackToHome: () => void;
}

export default function CheckoutPage({ product, onBackToHome }: CheckoutPageProps) {
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-slate-600 mb-4">No product selected</p>
        <Button onClick={onBackToHome}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar para Home
        </Button>
      </div>
    );
  }

  const tax = product.price * 0.1;
  const total = product.price + tax;

  return (
    <div className="container mx-auto px-4 py-8">
      <Button 
        variant="ghost" 
        onClick={onBackToHome}
        className="mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Voltar para Produtos
      </Button>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Order Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Resumo do pedido
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex gap-4">
                <div className="w-24 h-24 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                  <ImageWithFallback
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-slate-800 mb-1">{product.name}</h3>
                  <p className="text-sm text-slate-600 mb-2">{product.description}</p>
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-500">{product.category}</span>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-600">Subtotal</span>
                  <span className="text-slate-900">${product.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Taxa (10%)</span>
                  <span className="text-slate-900">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Envio</span>
                  <span className="text-green-600">GRÁTIS</span>
                </div>
                
                <Separator />
                
                <div className="flex justify-between">
                  <span className="text-slate-900">Total</span>
                  <span className="text-slate-900">${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  ✓ Frete grátis em todos os pedidos<br />
                  ✓ Garantia de reembolso de 30 dias<br />
                  ✓ Garantia de 1 ano incluída
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Form */}
        <div>
          <PaymentForm productTotal={total} />
        </div>
      </div>
    </div>
  );
}
