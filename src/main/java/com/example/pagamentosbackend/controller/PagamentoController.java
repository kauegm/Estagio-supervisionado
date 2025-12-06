package com.example.pagamentosbackend.controller;

import com.example.pagamentosbackend.dto.BoletoPagamentoResponse;
import com.example.pagamentosbackend.dto.CardPaymentRequest;
import com.example.pagamentosbackend.dto.PagamentoRequest;
import com.example.pagamentosbackend.dto.PagamentoResponse;
import com.example.pagamentosbackend.dto.PixPagamentoResponse;
import com.example.pagamentosbackend.service.PagamentoService;
import com.mercadopago.MercadoPagoConfig;
import com.mercadopago.exceptions.MPApiException;
import com.mercadopago.resources.payment.Payment;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.OPTIONS})
public class PagamentoController {

    private final PagamentoService service;

    public PagamentoController(PagamentoService service) {
        this.service = service;
    }

    // CARTÃO
    @PostMapping("/card")
    public PagamentoResponse payCard(@RequestBody CardPaymentRequest req) throws Exception {
        try {
            return service.payWithCard(req);
        } catch (MPApiException e) {
            System.out.println("Erro Mercado Pago: " + e.getApiResponse().toString());
            throw e;
        }
    }

    // PIX
    @PostMapping("/pix")
    public PixPagamentoResponse payPix(@RequestParam Double amount) throws Exception {
        try {
            System.out.println("TOKEN DO MERCADO PAGO SENDO USADO: " + MercadoPagoConfig.getAccessToken());
            return service.payWithPix(amount);
        } catch (MPApiException e) {
            System.out.println("Erro Mercado Pago: " + e.getApiResponse().toString());
            throw e;
        }
    }

    // BOLETO
    @PostMapping("/boleto")
    public BoletoPagamentoResponse payBoleto(@RequestParam Double amount) throws Exception {
        try {
            return service.payWithBoleto(amount);
        } catch (MPApiException e) {
            System.out.println("Erro Mercado Pago: " + e.getApiResponse().toString());
            throw e;
        }
    }
}