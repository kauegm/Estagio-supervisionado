package com.example.pagamentosbackend.dto;

import lombok.Data;

@Data
public class PagamentoRequest {
    private String token;
    private Double transactionAmount;
    private Integer installments;
    private String description;
    private String paymentMethodId;
    private String email;
}