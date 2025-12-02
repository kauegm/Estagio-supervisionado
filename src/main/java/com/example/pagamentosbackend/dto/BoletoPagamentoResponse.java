package com.example.pagamentosbackend.dto;

import lombok.Data;

@Data
public class BoletoPagamentoResponse {
    private String barcode;
    private String pdfLink;

    public String getBarcode() { return barcode; }
    public void setBarcode(String barcode) { this.barcode = barcode; }

    public String getPdfLink() { return pdfLink; }
    public void setPdfLink(String pdfLink) { this.pdfLink = pdfLink; }
}
