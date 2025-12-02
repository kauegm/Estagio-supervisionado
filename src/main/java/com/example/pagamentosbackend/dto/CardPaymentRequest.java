package com.example.pagamentosbackend.dto;

import lombok.Data;

@Data
public class CardPaymentRequest {
    private Double transactionAmount;
    private String token;
    private String email;

    public Double getAmount() { return transactionAmount; }
    public void setAmount(Double amount) { this.transactionAmount = amount; }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}
