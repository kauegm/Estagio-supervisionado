package com.example.pagamentosbackend.service;

import com.example.pagamentosbackend.dto.BoletoPagamentoResponse;
import com.example.pagamentosbackend.dto.CardPaymentRequest;
import com.example.pagamentosbackend.dto.PagamentoRequest;
import com.example.pagamentosbackend.dto.PagamentoResponse;
import com.example.pagamentosbackend.dto.PixPagamentoResponse;
import com.mercadopago.MercadoPagoConfig;
import com.mercadopago.client.common.AddressRequest;
import com.mercadopago.client.common.IdentificationRequest;
import com.mercadopago.client.payment.PaymentClient;
import com.mercadopago.client.payment.PaymentCreateRequest;
import com.mercadopago.client.payment.PaymentPayerAddressRequest;
import com.mercadopago.client.payment.PaymentPayerRequest;
import com.mercadopago.resources.payment.Payment;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class PagamentoService {
    private final PaymentClient paymentClient;

    public PagamentoService() {
        this.paymentClient = new PaymentClient();
    }

    @Value("${mercadopago.access.token}")
    private String accessToken;

    public PagamentoResponse payWithCard(CardPaymentRequest req) throws Exception {

        BigDecimal transactionAmount = BigDecimal.valueOf(req.getAmount());

        PaymentCreateRequest request =
                PaymentCreateRequest.builder()
                        .transactionAmount(transactionAmount)
                        .token(req.getToken())
                        .description("Compra via cartão")
                        .installments(1)
                        .payer(
                                PaymentPayerRequest.builder()
                                        .email(req.getEmail())
                                        .build()
                        )
                        .build();

        Payment payment = paymentClient.create(request);
        return new PagamentoResponse(payment.getStatus(), payment.getStatusDetail());
    }

    public PixPagamentoResponse payWithPix(Double amount) throws Exception {

        PaymentPayerRequest payer = PaymentPayerRequest.builder()
                .email("kauemilhomem@gmail.com")
                .firstName("Kaue")
                .lastName("Milhomem")
                .build();

        PaymentCreateRequest request = PaymentCreateRequest.builder()
                .transactionAmount(BigDecimal.valueOf(amount))
                .description("Pagamento PIX")
                .paymentMethodId("pix")
                .payer(payer)
                .build();

        Payment payment = paymentClient.create(request);

        PixPagamentoResponse response = new PixPagamentoResponse();
        response.setQrCode(payment.getPointOfInteraction().getTransactionData().getQrCode());
        response.setQrBase64(payment.getPointOfInteraction().getTransactionData().getQrCodeBase64());

        return response;
    }

    public BoletoPagamentoResponse payWithBoleto(Double amount) throws Exception {

        IdentificationRequest identification = IdentificationRequest.builder()
                .type("CPF")
                .number("05295359123")
                .build();

        PaymentPayerAddressRequest address = PaymentPayerAddressRequest.builder()
                .zipCode("77000000")
                .streetName("UNITINS")
                .streetNumber("1")
                .neighborhood("Campus Graciosa")
                .city("Palmas")
                .federalUnit("TO")
                .build();

        PaymentPayerRequest payer =
                PaymentPayerRequest.builder()
                        .email("kauemilhomem@gmail.com")
                        .firstName("Kaue")
                        .lastName("Milhomem")
                        .identification(identification)
                        .address(address)
                        .build();

        PaymentCreateRequest request =
                PaymentCreateRequest.builder()
                        .transactionAmount(BigDecimal.valueOf(amount))
                        .description("Pagamento Boleto")
                        .paymentMethodId("bolbradesco")
                        .payer(payer)
                        .build();

        Payment payment = paymentClient.create(request);

        BoletoPagamentoResponse resp = new BoletoPagamentoResponse();
        resp.setPdfLink(payment.getTransactionDetails().getExternalResourceUrl());

        return resp;
    }
}