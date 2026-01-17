package faculte.service_interne.dto;


import faculte.service_interne.entities.MetierRole;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileRequest {

//    @NotBlank
//    private String nom;
//
//    @NotBlank
//    private String prenom;

    @Pattern(regexp = "^(\\+212|0)[5-7][0-9]{8}$")
    private String telephone;
    private String email;
    private String adresse;

    private String cin;

    @NotNull
    private MetierRole metierRole;

    @NotBlank
    private String departement;

    private LocalDate dateEmbauche;

    private Integer superviseurId;
}