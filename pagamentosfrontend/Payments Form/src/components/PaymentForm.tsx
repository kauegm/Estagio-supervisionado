import {useState, useEffect} from "react";
import {useForm} from 'react-hook-form';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "./ui/card";
import {Input} from "./ui/input";
import {Label} from "./ui/label";
import {Button} from "./ui/button";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "./ui/select";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "./ui/tabs";
import {CheckCircle2, Copy, CreditCard, Lock, QrCode, Receipt, Smartphone, Wallet} from "lucide-react";
import {toast} from "sonner";
import { apiRequest } from "./apiClient";

interface CardFormData {
  cardNumber: string;
  cardholderName: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  email: string;
  billingAddress: string;
  city: string;
  zipCode: string;
  country: string;
}

interface PixFormData {
  pixKey: string;
  cpf: string;
  name: string;
  email: string;
}

interface BoletoFormData {
  cpf: string;
  name: string;
  email: string;
  address: string;
}

interface PaymentFormProps {
  productTotal?: number;
}

export default function PaymentForm({ productTotal }: PaymentFormProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("credit");
  const [pixQrCode, setPixQrCode] = useState<string | null>(null);
  const [pixQrBase64, setPixQrBase64] = useState<string | null>(null);
  const [boletoCode, setBoletoCode] = useState<string | null>(null);
  const [pdfLink, setPdfLink] = useState(null);

  const creditForm = useForm<CardFormData>();
  const debitForm = useForm<CardFormData>();
  const pixForm = useForm<PixFormData>();
  const boletoForm = useForm<BoletoFormData>();

  const getCurrentForm = () => {
    switch (paymentMethod) {
      case "credit":
        return creditForm;
      case "debit":
        return debitForm;
      case "pix":
        return pixForm;
      case "boleto":
        return boletoForm;
      default:
        return creditForm;
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(" ");
    } else {
      return value;
    }
  };

  async function gerarPixPagamento(amount: number) {
    const response = await apiRequest(`/api/payments/pix?amount=${amount}`, "POST");

    if (!response.ok) {
      toast.error("Erro ao gerar pagamento PIX");
      return;
    }

    return await response.json(); // { qrCode, qrBase64 }
  }

  async function gerarBoletoPagamento(amount: number) {
    const response = await apiRequest(`/api/payments/boleto?amount=${amount}`, "POST");

    if (!response.ok) {
      toast.error("Erro ao gerar boleto");
      return;
    }

    return await response.json();
  }

  async function gerarPagamentoCartao(paymentMethod: string, data: any, amount: number) {
      const payload = {
          card_number: data.cardNumber.replace(/\s/g, ""),
          expiration_month: Number(data.expiryMonth),
          expiration_year: Number(data.expiryYear),
          security_code: data.cvv,
          cardholder: {
              name: data.cardholderName,
              identification: {
                  type: "CPF",
                  number: data.cpf.replace(/\D/g, "")
              }
          }
      }

      const tokenResponse = await fetch(
          "https://api.mercadopago.com/v1/card_tokens?public_key=TEST-e1f74b17-2b5f-4f27-b21e-dba1ea353524",
          {
              method: "POST",
              headers: {
                  "Content-Type": "application/json"
              },
              body: JSON.stringify(payload),
          }
      );

      const tokenData = await tokenResponse.json();
      console.log(payload)
      console.log("TOKEN DATA:", tokenData);

      const response = await fetch("http://localhost:8080/api/payments/card", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
              token: tokenData.id,
              amount: Number(productTotal.toFixed(2)),
              installments: data.installments,
              paymentMethodId: data.paymentMethodId,
              paymentType: paymentMethod,
              email: data.email,
              cpf: data.cpf,
              cardholderName: data.cardholderName,
          }),
      });

      if (!response.ok) {
          toast.error("Erro ao processar cartão de crédito");
          return;
      }

      return await response.json();
  }

  const onSubmit = async (data: any) => {
    setIsProcessing(true);

    if (paymentMethod === "pix") {
      const pix = await gerarPixPagamento(Number(productTotal.toFixed(2)));
      if(pix) {
        setPixQrCode(pix.qrCode);
        setPixQrBase64(pix.qrBase64);
        toast.success("Pix gerado!");
      }
    } else if (paymentMethod === "boleto") {
      const boleto = await gerarBoletoPagamento(Number(productTotal.toFixed(2)));
      if(boleto) {
        setBoletoCode(boleto.barcode);
        setPdfLink(boleto.pdfLink);
        toast.success("Boleto gerado!");
      }
    } else if (paymentMethod === "credit") {
        const credit = await gerarPagamentoCartao( "credit_card", data, Number(productTotal.toFixed(2)))
        if(credit) {
            setIsSuccess(true);
            toast.success("Cartão de crédito processado com sucesso!");
        }
    } else if (paymentMethod === "debit") {
        const debit = await gerarPagamentoCartao("debit_card", data, Number(productTotal.toFixed(2)))
        if (debit) {
            setIsSuccess(true);
            toast.success("Cartão de débito processado com sucesso!");
        }
    } else {
      setIsProcessing(false);
      toast.error("Ocorreu um erro ao processar o pagamento!");
    }

    setIsProcessing(false);
  };

  if (isSuccess) {
    return (
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <CheckCircle2 className="w-16 h-16 text-green-500" />
              </div>
              <h3 className="text-green-600">Pagamento realizado com sucesso!</h3>
              <p className="text-slate-600">
                  Seu pagamento foi processado corretamente.
              </p>
              <Button
                  onClick={() => {
                    setIsSuccess(false);
                    setPixQrCode(null);
                    setBoletoCode(null);
                  }}
                  variant="outline"
                  className="mt-4"
              >
                Fazer outro pagamento
              </Button>
            </div>
          </CardContent>
        </Card>
    );
  }

  const { register, handleSubmit, formState: { errors }, setValue } = getCurrentForm();

  return (
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader className="space-y-1">
          <CardTitle className="flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            Informações de pagamento
          </CardTitle>
          <CardDescription>
            Escolha seu método de pagamento e conclua a transação.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="credit" className="flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Credit
              </TabsTrigger>
              <TabsTrigger value="debit" className="flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Debit
              </TabsTrigger>
              <TabsTrigger value="pix" className="flex items-center gap-2">
                <Smartphone className="w-4 h-4" />
                Pix
              </TabsTrigger>
              <TabsTrigger value="boleto" className="flex items-center gap-2">
                <Receipt className="w-4 h-4" />
                Boleto
              </TabsTrigger>
            </TabsList>

              <TabsContent value="credit">
                  <form onSubmit={creditForm.handleSubmit(onSubmit)} className="space-y-6">

                      {/* CARD NUMBER */}
                      <div className="space-y-2">
                          <Label htmlFor="credit-cardNumber">Número do Cartão</Label>
                          <Input
                              id="credit-cardNumber"
                              placeholder="1234 5678 9012 3456"
                              maxLength={19}
                              {...creditForm.register("cardNumber", {
                                  required: "Número do cartão é obrigatório",
                                  minLength: { value: 19, message: "Número inválido" }
                              })}
                              onChange={(e) => {
                                  const formatted = formatCardNumber(e.target.value);
                                  creditForm.setValue("cardNumber", formatted);
                              }}
                          />
                      </div>

                      {/* CARDHOLDER NAME */}
                      <div className="space-y-2">
                          <Label htmlFor="credit-cardholderName">Nome impresso no cartão</Label>
                          <Input
                              id="credit-cardholderName"
                              placeholder="JOÃO SILVA"
                              {...creditForm.register("cardholderName", {
                                  required: "Nome do titular é obrigatório"
                              })}
                          />
                      </div>

                      {/* EXPIRATION AND CVV */}
                      <div className="grid grid-cols-3 gap-4">

                          {/* MONTH */}
                          <div className="space-y-2">
                              <Label>Mês</Label>
                              <Select onValueChange={(value) => creditForm.setValue("expiryMonth", value)}>
                                  <SelectTrigger>
                                      <SelectValue placeholder="MM" />
                                  </SelectTrigger>
                                  <SelectContent>
                                      {Array.from({ length: 12 }, (_, i) => i + 1).map(month =>
                                          <SelectItem key={month} value={month.toString().padStart(2, "0")}>
                                              {month.toString().padStart(2, "0")}
                                          </SelectItem>
                                      )}
                                  </SelectContent>
                              </Select>
                          </div>

                          {/* YEAR */}
                          <div className="space-y-2">
                              <Label>Ano</Label>
                              <Select onValueChange={(value) => creditForm.setValue("expiryYear", value)}>
                                  <SelectTrigger>
                                      <SelectValue placeholder="YY" />
                                  </SelectTrigger>
                                  <SelectContent>
                                      {Array.from({ length: 10 }, (_, i) => {
                                          const year = new Date().getFullYear() + i;
                                          return (
                                              <SelectItem key={year} value={year.toString()}>
                                                  {year}
                                              </SelectItem>
                                          );
                                      })}
                                  </SelectContent>
                              </Select>
                          </div>

                          {/* CVV */}
                          <div className="space-y-2">
                              <Label htmlFor="credit-cvv">CVV</Label>
                              <Input
                                  id="credit-cvv"
                                  placeholder="123"
                                  maxLength={4}
                                  {...creditForm.register("cvv", {
                                      required: "CVV é obrigatório",
                                      minLength: { value: 3, message: "CVV inválido" }
                                  })}
                                  onChange={(e) => {
                                      const v = e.target.value.replace(/\D/g, "");
                                      creditForm.setValue("cvv", v);
                                  }}
                              />
                          </div>
                      </div>

                      {/* EMAIL */}
                      <div className="space-y-2">
                          <Label>Email</Label>
                          <Input
                              type="email"
                              placeholder="cliente@email.com"
                              {...creditForm.register("email", {
                                  required: "Email obrigatório"
                              })}
                          />
                      </div>

                      {/* CPF */}
                      <div className="space-y-2">
                          <Label>CPF</Label>
                          <Input
                              placeholder="000.000.000-00"
                              {...creditForm.register("cpf", {
                                  required: "CPF é obrigatório"
                              })}
                              onChange={(e) => creditForm.setValue("cpf", e.target.value.replace(/\D/g, ""))}
                          />
                      </div>

                      {/* INSTALLMENTS (opcional mas útil) */}
                      <div className="space-y-2">
                          <Label>Parcelas</Label>
                          <Select onValueChange={(value) => creditForm.setValue("installments", Number(value))}>
                              <SelectTrigger>
                                  <SelectValue placeholder="1x" />
                              </SelectTrigger>
                              <SelectContent>
                                  <SelectItem value="1">1x</SelectItem>
                                  <SelectItem value="2">2x</SelectItem>
                                  <SelectItem value="3">3x</SelectItem>
                              </SelectContent>
                          </Select>
                      </div>

                      {/* BUTTON */}
                      <Button type="submit" className="w-full" disabled={isProcessing}>
                          {isProcessing ? "Processando..." : "Pagar com Cartão"}
                      </Button>

                  </form>
              </TabsContent>

              {/* Debit Card */}
            <TabsContent value="debit">
              <form onSubmit={debitForm.handleSubmit(onSubmit)} className="space-y-6">
                {/* Card Information */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="debit-cardNumber">Card Number</Label>
                    <div className="relative">
                      <Input
                          id="debit-cardNumber"
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                          {...debitForm.register("cardNumber", {
                            required: "Card number is required",
                            minLength: {
                              value: 19,
                              message: "Please enter a valid card number",
                            },
                          })}
                          onChange={(e) => {
                            const formatted = formatCardNumber(e.target.value);
                            debitForm.setValue("cardNumber", formatted);
                          }}
                      />
                      <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    </div>
                    {debitForm.formState.errors.cardNumber && (
                        <p className="text-sm text-red-500">{debitForm.formState.errors.cardNumber.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="debit-cardholderName">Cardholder Name</Label>
                    <Input
                        id="debit-cardholderName"
                        placeholder="John Doe"
                        {...debitForm.register("cardholderName", {
                          required: "Cardholder name is required",
                        })}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="debit-expiryMonth">Month</Label>
                      <Select onValueChange={(value) => debitForm.setValue("expiryMonth", value)}>
                        <SelectTrigger id="debit-expiryMonth">
                          <SelectValue placeholder="MM" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                              <SelectItem key={month} value={month.toString().padStart(2, "0")}>
                                {month.toString().padStart(2, "0")}
                              </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="debit-expiryYear">Year</Label>
                      <Select onValueChange={(value) => debitForm.setValue("expiryYear", value)}>
                        <SelectTrigger id="debit-expiryYear">
                          <SelectValue placeholder="YY" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 10 }, (_, i) => {
                            const year = new Date().getFullYear() + i;
                            return (
                                <SelectItem key={year} value={year.toString()}>
                                  {year}
                                </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="debit-cvv">CVV</Label>
                      <Input
                          id="debit-cvv"
                          placeholder="123"
                          maxLength={4}
                          {...debitForm.register("cvv", {
                            required: "CVV is required",
                            minLength: {
                              value: 3,
                              message: "CVV must be 3-4 digits",
                            },
                          })}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, "");
                            debitForm.setValue("cvv", value);
                          }}
                      />
                    </div>
                  </div>
                </div>

                {/* Billing Information */}
                <div className="space-y-4 pt-4 border-t">
                  <h3 className="text-slate-700">Billing Information</h3>

                  <div className="space-y-2">
                    <Label htmlFor="debit-email">Email</Label>
                    <Input
                        id="debit-email"
                        type="email"
                        placeholder="john@example.com"
                        {...debitForm.register("email", {
                          required: "Email is required",
                        })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="debit-billingAddress">Street Address</Label>
                    <Input
                        id="debit-billingAddress"
                        placeholder="123 Main Street"
                        {...debitForm.register("billingAddress", {
                          required: "Billing address is required",
                        })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="debit-city">City</Label>
                      <Input
                          id="debit-city"
                          placeholder="São Paulo"
                          {...debitForm.register("city", {
                            required: "City is required",
                          })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="debit-zipCode">ZIP Code</Label>
                      <Input
                          id="debit-zipCode"
                          placeholder="01310-100"
                          {...debitForm.register("zipCode", {
                            required: "ZIP code is required",
                          })}
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="space-y-4 pt-4">
                  <Button type="submit" className="w-full" disabled={isProcessing}>
                    {isProcessing ? (
                        <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </span>
                    ) : (
                        <span className="flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      Pay with Debit Card
                    </span>
                    )}
                  </Button>

                  <p className="text-center text-sm text-slate-500">
                    Your payment information is encrypted and secure
                  </p>
                </div>
              </form>
            </TabsContent>

            {/* Pix */}
            <TabsContent value="pix">
              {pixQrCode ? (
                  <div className="space-y-6">
                    <div className="text-center space-y-4">
                      <div className="flex justify-center">
                        <div className="p-4 bg-white rounded-lg border-2 border-slate-200">
                            {pixQrBase64 ? (
                                <img
                                    src={`data:image/png;base64,${pixQrBase64}`}
                                    className="w-48 h-48"
                                    alt="Pix QR Code"
                                />
                            ) : (
                                <QrCode className="w-48 h-48 text-slate-700" />
                            )}
                        </div>
                      </div>
                      <p className="text-slate-600">
                          Escaneie o QR Code com o aplicativo do seu banco para concluir o pagamento.
                      </p>

                      <div className="space-y-2">
                        <Label>Or copy the Pix code:</Label>
                        <div className="flex gap-2">
                          <Input
                              value={pixQrCode}
                              readOnly
                              className="text-xs"
                          />
                          <Button
                              type="button"
                              variant="outline"
                              onClick={() => {
                                navigator.clipboard.writeText(pixQrCode);
                                toast.success("Código pix copiado!");
                              }}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <Button
                          onClick={() => {
                            setPixQrCode(null);
                            setIsSuccess(true);
                          }}
                          className="mt-4"
                      >
                          Pagamento realizado
                      </Button>
                    </div>
                  </div>
              ) : (
                  <form onSubmit={pixForm.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <p className="text-sm text-blue-800">
                        Após clicar em "Gerar Código Pix", você vai receber um QR Code para escanear com o seu banco.
                      </p>
                    </div>

                    <Button type="submit" className="w-full" disabled={isProcessing}>
                      {isProcessing ? (
                          <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Generating...
                    </span>
                      ) : (
                          <span className="flex items-center gap-2">
                      <QrCode className="w-4 h-4" />
                      Gerar Código Pix
                    </span>
                      )}
                    </Button>
                  </form>
              )}
            </TabsContent>

            {/* Boleto */}
            <TabsContent value="boleto">
              {boletoCode ? (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div className="text-center">
                        <Receipt className="w-16 h-16 mx-auto text-slate-600" />
                        <p className="mt-4 text-slate-600">
                          Seu boleto foi gerado.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label>Número do código de barras:</Label>
                        <div className="flex gap-2">
                          <Input
                              value={boletoCode}
                              readOnly
                              className="font-mono"
                          />
                          <Button
                              type="button"
                              variant="outline"
                              onClick={() => {
                                navigator.clipboard.writeText(boletoCode);
                                toast.success("Código de barras copiado!");
                              }}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                        <p className="text-sm text-amber-800">
                          Pague este boleto em qualquer banco, caixa eletrônico ou internet banking. O pagamento pode levar até 2 dias úteis para ser processado.
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => {
                              if (pdfLink) {
                                window.open(pdfLink, "_blank");
                              } else {
                                toast.error("PDF not available.");
                              }
                            }}
                        >
                          Download PDF
                        </Button>
                        <Button
                            className="flex-1"
                            onClick={() => {
                              setBoletoCode(null);
                              setIsSuccess(true);
                            }}
                        >
                          Concluir
                        </Button>
                      </div>
                    </div>
                  </div>
              ) : (
                  <form onSubmit={boletoForm.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="boleto-name">Full Name</Label>
                        <Input
                            id="boleto-name"
                            placeholder="João Silva"
                            {...boletoForm.register("name", {
                              required: "Name is required",
                            })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="boleto-cpf">CPF</Label>
                        <Input
                            id="boleto-cpf"
                            placeholder="000.000.000-00"
                            maxLength={14}
                            {...boletoForm.register("cpf", {
                              required: "CPF is required",
                            })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="boleto-email">Email</Label>
                        <Input
                            id="boleto-email"
                            type="email"
                            placeholder="joao@example.com"
                            {...boletoForm.register("email", {
                              required: "Email is required",
                            })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="boleto-address">Address</Label>
                        <Input
                            id="boleto-address"
                            placeholder="Rua Example, 123 - São Paulo"
                            {...boletoForm.register("address", {
                              required: "Address is required",
                            })}
                        />
                      </div>
                    </div>

                    <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                      <p className="text-sm text-amber-800">
                        O boleto será válido por 3 dias. Após a geração, você pode pagá-lo em qualquer banco ou pelo internet banking.
                      </p>
                    </div>

                    <Button type="submit" className="w-full" disabled={isProcessing}>
                      {isProcessing ? (
                          <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Gerando...
                    </span>
                      ) : (
                          <span className="flex items-center gap-2">
                      <Receipt className="w-4 h-4" />
                      Gerar Boleto
                    </span>
                      )}
                    </Button>
                  </form>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
  );
}
