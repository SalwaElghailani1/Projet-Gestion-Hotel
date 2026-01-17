package faculte.service_interne.dto;

import faculte.service_interne.entities.MetierRole;
import faculte.service_interne.entities.ProfileStatus;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileResponse {

    private Integer userId;
    private String nom;
    private String prenom;
    private String telephone;
    private String adresse;
    private String cin;
    private MetierRole metierRole;
    private String departement;
    private LocalDate dateEmbauche;
    private Integer superviseurId;
    private Boolean disponible;
    private ProfileStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime validatedAt;
    private Integer validatedBy;
}