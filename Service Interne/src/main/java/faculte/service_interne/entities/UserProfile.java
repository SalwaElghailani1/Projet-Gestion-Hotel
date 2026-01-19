package faculte.service_interne.entities;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_profiles")
public class UserProfile {

    @Id
    private Integer userId;

    private String nom;
    private String prenom;
    private String telephone;
    private String email;
    private String adresse;
    private String cin;
    private LocalDate dateNaissance;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private MetierRole metierRole = MetierRole.DEFOULT;

    private String departement;
    private LocalDate dateEmbauche;
    private Integer superviseurId;
    private Boolean disponible = true;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private ProfileStatus status = ProfileStatus.DRAFT;

    private String rejectionReason;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime validatedAt;
    private Integer validatedBy;

    // ===== Constructors =====
    public UserProfile() {}

    public UserProfile(Integer userId, String nom, String prenom, String telephone, String email,
                       String adresse, String cin, LocalDate dateNaissance,
                       MetierRole metierRole, String departement, LocalDate dateEmbauche,
                       Integer superviseurId, Boolean disponible, ProfileStatus status,
                       String rejectionReason, LocalDateTime createdAt,
                       LocalDateTime updatedAt, LocalDateTime validatedAt, Integer validatedBy) {
        this.userId = userId;
        this.nom = nom;
        this.prenom = prenom;
        this.telephone = telephone;
        this.email = email;
        this.adresse = adresse;
        this.cin = cin;
        this.dateNaissance = dateNaissance;
        this.metierRole = metierRole;
        this.departement = departement;
        this.dateEmbauche = dateEmbauche;
        this.superviseurId = superviseurId;
        this.disponible = disponible;
        this.status = status;
        this.rejectionReason = rejectionReason;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.validatedAt = validatedAt;
        this.validatedBy = validatedBy;
    }

    // ===== Getters & Setters =====
    public Integer getUserId() { return userId; }
    public void setUserId(Integer userId) { this.userId = userId; }

    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }

    public String getPrenom() { return prenom; }
    public void setPrenom(String prenom) { this.prenom = prenom; }

    public String getTelephone() { return telephone; }
    public void setTelephone(String telephone) { this.telephone = telephone; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getAdresse() { return adresse; }
    public void setAdresse(String adresse) { this.adresse = adresse; }

    public String getCin() { return cin; }
    public void setCin(String cin) { this.cin = cin; }

    public LocalDate getDateNaissance() { return dateNaissance; }
    public void setDateNaissance(LocalDate dateNaissance) { this.dateNaissance = dateNaissance; }

    public MetierRole getMetierRole() { return metierRole; }
    public void setMetierRole(MetierRole metierRole) { this.metierRole = metierRole; }

    public String getDepartement() { return departement; }
    public void setDepartement(String departement) { this.departement = departement; }

    public LocalDate getDateEmbauche() { return dateEmbauche; }
    public void setDateEmbauche(LocalDate dateEmbauche) { this.dateEmbauche = dateEmbauche; }

    public Integer getSuperviseurId() { return superviseurId; }
    public void setSuperviseurId(Integer superviseurId) { this.superviseurId = superviseurId; }

    public Boolean getDisponible() { return disponible; }
    public void setDisponible(Boolean disponible) { this.disponible = disponible; }

    public ProfileStatus getStatus() { return status; }
    public void setStatus(ProfileStatus status) { this.status = status; }

    public String getRejectionReason() { return rejectionReason; }
    public void setRejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public LocalDateTime getValidatedAt() { return validatedAt; }
    public void setValidatedAt(LocalDateTime validatedAt) { this.validatedAt = validatedAt; }

    public Integer getValidatedBy() { return validatedBy; }
    public void setValidatedBy(Integer validatedBy) { this.validatedBy = validatedBy; }
}
