package com.example.pagamentosbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
public class PagamentoResponse {
    private String status;
    private String paymentId;

    public PagamentoResponse() {}

    public PagamentoResponse(String status, String paymentId) {
        this.status = status;
        this.paymentId = paymentId;
    }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getPaymentId() { return paymentId; }
    public void setPaymentId(String paymentId) { this.paymentId = paymentId; }
}
