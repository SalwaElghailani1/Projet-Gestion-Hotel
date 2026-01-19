package faculte.service_interne.dto;

import faculte.service_interne.entities.MetierRole;
import jakarta.validation.constraints.*;
import java.time.LocalDate;

public class UserProfileRequest {

    @Pattern(regexp = "^(\\+212|0)[5-7][0-9]{8}$")
    private String telephone;

    private String email;
    private String adresse;
    private LocalDate dateNaissance;
    private String cin;

    @NotNull
    private MetierRole metierRole;

    @NotBlank
    private String departement;

    private LocalDate dateEmbauche;
    private Integer superviseurId;

    public UserProfileRequest() {}

    public UserProfileRequest(String telephone, String email, String adresse,
                              LocalDate dateNaissance, String cin,
                              MetierRole metierRole, String departement,
                              LocalDate dateEmbauche, Integer superviseurId) {
        this.telephone = telephone;
        this.email = email;
        this.adresse = adresse;
        this.dateNaissance = dateNaissance;
        this.cin = cin;
        this.metierRole = metierRole;
        this.departement = departement;
        this.dateEmbauche = dateEmbauche;
        this.superviseurId = superviseurId;
    }

    // Getters & Setters
    public String getTelephone() { return telephone; }
    public void setTelephone(String telephone) { this.telephone = telephone; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getAdresse() { return adresse; }
    public void setAdresse(String adresse) { this.adresse = adresse; }

    public LocalDate getDateNaissance() { return dateNaissance; }
    public void setDateNaissance(LocalDate dateNaissance) { this.dateNaissance = dateNaissance; }

    public String getCin() { return cin; }
    public void setCin(String cin) { this.cin = cin; }

    public MetierRole getMetierRole() { return metierRole; }
    public void setMetierRole(MetierRole metierRole) { this.metierRole = metierRole; }

    public String getDepartement() { return departement; }
    public void setDepartement(String departement) { this.departement = departement; }

    public LocalDate getDateEmbauche() { return dateEmbauche; }
    public void setDateEmbauche(LocalDate dateEmbauche) { this.dateEmbauche = dateEmbauche; }

    public Integer getSuperviseurId() { return superviseurId; }
    public void setSuperviseurId(Integer superviseurId) { this.superviseurId = superviseurId; }
}
