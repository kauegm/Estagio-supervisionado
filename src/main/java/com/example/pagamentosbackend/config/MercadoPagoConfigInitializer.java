package com.example.pagamentosbackend.config;

import com.mercadopago.MercadoPagoConfig;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

// Arquivo de configuração do mercado pago
@Configuration
public class MercadoPagoConfigInitializer {

    // token do application properties
    @Value("${mercadopago.access.token}")
    private String accessToken;

    @PostConstruct
    public void init() {
        MercadoPagoConfig.setAccessToken(accessToken);
        System.out.println("Mercado Pago inicializado com sucesso.");
    }
}
