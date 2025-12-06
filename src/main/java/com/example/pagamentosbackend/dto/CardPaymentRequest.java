package com.example.pagamentosbackend.dto;

import lombok.Data;

@Data
public class CardPaymentRequest {
    private Double amount;                 // Valor da compra
    private String token;                  // Token do cartão (gerado no front)
    private String email;                  // Email do pagador

    private String paymentMethodId;        // Bandeira -> visa, mastercard, elo, amex
    private String paymentType;            // credit_card ou debit_card
    private Integer issuerId;              // Banco emissor do cartão
    private Integer installments;          // Número de parcelas (1 para débito)

    private String cpf;                    // CPF do titular do cartão
    private String cardholderName;

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPaymentMethodId() {
        return paymentMethodId;
    }

    public void setPaymentMethodId(String paymentMethodId) {
        this.paymentMethodId = paymentMethodId;
    }


    public void setPaymentType(String paymentType) {
        this.paymentType = paymentType;
    }
    public String getPaymentType(String paymentType) {
        return paymentType;
    }

    public Integer getIssuerId() {
        return issuerId;
    }

    public void setIssuerId(Integer issuerId) {
        this.issuerId = issuerId;
    }

    public Integer getInstallments() {
        return installments;
    }

    public void setInstallments(Integer installments) {
        this.installments = installments;
    }

    public String getCpf() {
        return cpf;
    }

    public void setCpf(String cpf) {
        this.cpf = cpf;
    }

    public String getCardholderName() {
        return cardholderName;
    }

    public void setCardholderName(String cardholderName) {
        this.cardholderName = cardholderName;
    }
}
