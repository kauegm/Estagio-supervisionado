package com.example.pagamentosbackend.dto;

import lombok.Data;

@Data
public class PixPagamentoResponse {
    private String qrCode;
    private String qrBase64;

    public String getQrCode() { return qrCode; }
    public void setQrCode(String qrCode) { this.qrCode = qrCode; }

    public String getQrBase64() { return qrBase64; }
    public void setQrBase64(String qrBase64) { this.qrBase64 = qrBase64; }
}
