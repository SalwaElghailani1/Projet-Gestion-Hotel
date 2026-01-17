package com.example.roomservice.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class ResponseDtoRoom {

    private Integer id;
    private String numero;
    private String type;
    private double prix;
    private String etat;
    private String description;
    private String image;
    private Double taux;
    private Double lit_long;
    private Double lit_large;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getNumero() {
        return numero;
    }

    public void setNumero(String numero) {
        this.numero = numero;
    }
    public String getType() {
        return type;
    }
    public void setType(String type) {
        this.type = type;
    }
    public double getPrix() {
        return prix;
    }
    public void setPrix(double prix) {
        this.prix = prix;
    }
    public String getEtat() {
        return etat;
    }

    public void setEtat(String etat) {
        this.etat = etat;
    }

    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }

    public String getImage() {
        return image;
    }
    public void setImage(String image) {
        this.image = image;
    }
    public Double getTaux() {
        return taux;
    }
    public void setTaux(Double taux) {
        this.taux = taux;
    }
    public Double getLit_long() {
        return lit_long;
    }

    public void setLit_long(Double lit_long) {
        this.lit_long = lit_long;
    }

    public Double getLit_large() {
        return lit_large;
    }

    public void setLit_large(Double lit_large) {
        this.lit_large = lit_large;
    }
}
