package com.example.pagamentosbackend.service;

import com.example.pagamentosbackend.dto.BoletoPagamentoResponse;
import com.example.pagamentosbackend.dto.CardPaymentRequest;
import com.example.pagamentosbackend.dto.PagamentoResponse;
import com.example.pagamentosbackend.dto.PixPagamentoResponse;
import com.mercadopago.client.common.IdentificationRequest;
import com.mercadopago.client.payment.PaymentClient;
import com.mercadopago.client.payment.PaymentCreateRequest;
import com.mercadopago.client.payment.PaymentMethodRequest;
import com.mercadopago.client.payment.PaymentPayerAddressRequest;
import com.mercadopago.client.payment.PaymentPayerRequest;
import com.mercadopago.resources.payment.Payment;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;

@Service
public class PagamentoService {
    private final PaymentClient paymentClient;

    public PagamentoService() {
        this.paymentClient = new PaymentClient();
    }

    @Value("${mercadopago.access.token}")
    private String accessToken;

    public PagamentoResponse payWithCard(CardPaymentRequest request) throws Exception {
        PaymentClient client = new PaymentClient();

        PaymentCreateRequest paymentCreateRequest =
                PaymentCreateRequest.builder()
                        .transactionAmount(BigDecimal.valueOf(request.getAmount()))
                        .token(request.getToken())
                        .description("Estágio Supervisionado - Teste Cartão")
                        .installments(request.getInstallments())
                        .payer(
                                PaymentPayerRequest.builder()
                                        .email(request.getEmail())
                                        .firstName(request.getCardholderName())
                                        .identification(
                                                IdentificationRequest.builder()
                                                        .type("CPF")
                                                        .number(request.getCpf())
                                                        .build())
                                        .build())
                        .build();

        Payment payment = client.create(paymentCreateRequest);

        return new PagamentoResponse(payment.getStatus(), payment.getStatusDetail());
    }

    public PixPagamentoResponse payWithPix(Double amount) throws Exception {

        PaymentCreateRequest request = PaymentCreateRequest.builder()
                .externalReference("ext_ref_1234")
                .transactionAmount(BigDecimal.valueOf(amount))
                .description("Pagamento PIX")
                .paymentMethodId("pix")
                .payer(PaymentPayerRequest.builder()
                        .email("test_user_123@example.com")
                        .firstName("TEST")
                        .identification(IdentificationRequest.builder()
                                .type("CPF") // Use "CPF" ou "CNPJ"
                                .number("12345678909") // Número de documento válido de teste
                                .build())
                        .build())
                .build();

        Payment payment = paymentClient.create(request);

        PixPagamentoResponse response = new PixPagamentoResponse();
        response.setQrCode(payment.getPointOfInteraction().getTransactionData().getQrCode());
        response.setQrBase64(payment.getPointOfInteraction().getTransactionData().getQrCodeBase64());

        return response;
    }

    public BoletoPagamentoResponse payWithBoleto(Double amount) throws Exception {

        PaymentClient client = new PaymentClient();

        PaymentCreateRequest paymentCreateRequest =
                PaymentCreateRequest.builder()
                        .transactionAmount(new BigDecimal(amount))
                        .description("Estágio Supervisionado - Teste Boleto")
                        .paymentMethodId("bolbradesco")
                        .dateOfExpiration(OffsetDateTime.of(2026, 1, 1, 10, 10, 10, 0, ZoneOffset.UTC))
                        .payer(
                                PaymentPayerRequest.builder()
                                        .email("test@test.com")
                                        .firstName("apro")
                                        .lastName("User")
                                        .identification(
                                                IdentificationRequest.builder()
                                                        .type("CPF")
                                                        .number("19119119100") // CPF de teste permitido
                                                        .build())
                                        .address(
                                                PaymentPayerAddressRequest.builder()
                                                        .zipCode("06233-903")
                                                        .streetName("Av. das Nações Unidas")
                                                        .streetNumber("3003")
                                                        .neighborhood("Centro")
                                                        .city("Osasco")
                                                        .federalUnit("SP")
                                                        .build()
                                        )
                                        .build())
                        .build();

        Payment payment = client.create(paymentCreateRequest);

        BoletoPagamentoResponse resp = new BoletoPagamentoResponse();
        resp.setPdfLink(payment.getTransactionDetails().getExternalResourceUrl());
        resp.setBarcode(payment.getTransactionDetails().getDigitableLine());

        return resp;
    }
}