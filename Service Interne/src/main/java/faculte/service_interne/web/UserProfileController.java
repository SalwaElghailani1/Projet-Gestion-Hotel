package faculte.service_interne.web;

import faculte.service_interne.dto.UserProfileRequest;
import faculte.service_interne.dto.UserProfileResponse;
import faculte.service_interne.entities.MetierRole;
import faculte.service_interne.entities.ProfileStatus;
import faculte.service_interne.service.UserProfileService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "User Profiles", description = "API pour la gestion des profils internes")
@RestController
@RequestMapping("/v1/user-profiles")
public class UserProfileController {

    private final UserProfileService service;

    public UserProfileController(UserProfileService service) {
        this.service = service;
    }

    @Operation(
            summary = "Créer un nouveau profil interne (Admin ou user profil)",
            description = "Crée un profil pour l'utilisateur interne connecté (userId extrait du token)"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Profil créé avec succès"),
            @ApiResponse(responseCode = "409", description = "Le profil existe déjà")
    })
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<UserProfileResponse> createUserProfile(
            @AuthenticationPrincipal Jwt jwt,
            @Valid @RequestBody UserProfileRequest request,
            @RequestParam(required = false) Integer userIdParam) {

        Integer userId;
        List<String> roles = jwt.getClaim("roles");
        if (userIdParam != null) { // Admin spécifie un userId
            if (!roles.contains("ADMIN")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            userId = userIdParam;
        } else { // Utilisateur normal
            userId = ((Long) jwt.getClaim("userId")).intValue();

        }
        String nom = jwt.getClaim("nom");
        String prenom = jwt.getClaim("prenom");
        String email = jwt.getClaim("email");
        return ResponseEntity.status(HttpStatus.CREATED).body(service.createUserProfile(userId,nom,prenom,email,request));
    }

    @Operation(summary = "Mettre à jour un profil interne existant (Admin ou user profil)",
            description = "Met à jour les informations personnelles et métier du profil interne")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Profil mis à jour avec succès"),
            @ApiResponse(responseCode = "404", description = "Profil non trouvé")
    })
    @PreAuthorize("hasRole('ADMIN') or ((#userId == authentication.principal.claims['userId']) and (" +
            "authentication.principal.claims['roles'].contains('ADMIN') or " +
            "authentication.principal.claims['roles'].contains('HOUSEKEEPING') or " +
            "authentication.principal.claims['roles'].contains('RECEPTIONNISTE') or " +
            "authentication.principal.claims['roles'].contains('MANAGER') or " +
            "authentication.principal.claims['roles'].contains('MAINTENANCE') or " +
            "authentication.principal.claims['roles'].contains('COMPTABLE')))")
    @PutMapping
    public ResponseEntity<UserProfileResponse> updateUserProfile(
            @AuthenticationPrincipal Jwt jwt,
            @Valid @RequestBody UserProfileRequest request,
            @RequestParam(required = false) Integer userIdParam) {

        Integer userId;
        List<String> roles = jwt.getClaim("roles");
        if (userIdParam != null) {
            if (!roles.contains("ADMIN")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            userId = userIdParam;
        } else {
            userId = ((Long) jwt.getClaim("userId")).intValue();
        }

        return ResponseEntity.ok(service.updateUserProfile(userId, request));
    }

    @Operation(summary = "Obtenir mon profil interne (user profil)",
            description = "Retourne le profil complet de l'utilisateur connecté")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Profil récupéré avec succès"),
            @ApiResponse(responseCode = "404", description = "Profil non trouvé")
    })

    @PreAuthorize(
            "(#userId == authentication.principal.claims['userId']) and " +
                    "(authentication.principal.claims['roles'].contains('ADMIN') or " +
                    " authentication.principal.claims['roles'].contains('HOUSEKEEPING') or " +
                    " authentication.principal.claims['roles'].contains('RECEPTIONNISTE') or " +
                    " authentication.principal.claims['roles'].contains('MANAGER') or " +
                    " authentication.principal.claims['roles'].contains('MAINTENANCE') or " +
                    " authentication.principal.claims['roles'].contains('COMPTABLE'))"
    )
    @GetMapping("/me")
    public ResponseEntity<UserProfileResponse> getMyProfile(@AuthenticationPrincipal Jwt jwt) {

        Integer userId = ((Long) jwt.getClaim("userId")).intValue();
        String nom = jwt.getClaim("nom");
        String prenom = jwt.getClaim("prenom");
        String email = jwt.getClaim("email");

        List<String> roles = jwt.getClaim("roles");

        String mainRole = roles.get(0);
        MetierRole jwtRole = MetierRole.valueOf(mainRole);


        UserProfileResponse profile;

        try {
            profile = service.getUserProfileById(userId);

            // 🔄 synchro role JWT <-> DB
            if (profile.getMetierRole() != jwtRole) {
                service.updateMetierRole(userId, jwtRole);
                profile.setMetierRole(jwtRole);
            }

            // ✅ Si profil en DRAFT ou autre, update status → ON_WORK
            if (profile.getStatus() == ProfileStatus.DRAFT ||
                    profile.getStatus() == null) {
                profile.setStatus(ProfileStatus.ON_WORK);
                service.updateProfileStatus(userId, ProfileStatus.ON_WORK);
            }

        } catch (RuntimeException e) {

            UserProfileRequest request = new UserProfileRequest();
            request.setMetierRole(jwtRole);

            profile = service.createUserProfile(
                    userId,
                    nom != null ? nom : "Inconnu",
                    prenom != null ? prenom : "Inconnu",
                    email,
                    request
            );
        }

        return ResponseEntity.ok(profile);
    }


    @PostMapping("/logout")
    public ResponseEntity<String> logout(@AuthenticationPrincipal Jwt jwt) {
        Integer userId = ((Long) jwt.getClaim("userId")).intValue();

        service.updateProfileStatus(userId, ProfileStatus.OUT_WORK);

        return ResponseEntity.ok("Utilisateur déconnecté, status OUT_WORK");
    }

    @Operation(summary = "Lister tous les profils internes(Admin)",
            description = "Retourne la liste complète des profils internes existants")
    @ApiResponse(responseCode = "200", description = "Liste des profils récupérée avec succès")

    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    @GetMapping
    public ResponseEntity<List<UserProfileResponse>> getAllUserProfiles(
            @AuthenticationPrincipal Jwt jwt
    ) {
        return ResponseEntity.ok(service.getAllUserProfiles(jwt));
    }

    @Operation(summary = "Supprimer profil interne (Admin)",
            description = "Supprime le profil de l'utilisateur connecté")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Profil supprimé avec succès"),
            @ApiResponse(responseCode = "404", description = "Profil non trouvé")
    })
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping
    public ResponseEntity<String> deleteMyProfile(@AuthenticationPrincipal Jwt jwt) {
        Integer userId = jwt.getClaim("userId");
        service.deleteUserProfile(userId);
        return ResponseEntity.ok("Profil interne supprimé avec succès.");
    }

    @Operation(summary = "Changer le statut d'un profil interne (Admin)",
            description = "Permet à un admin de valider ou rejeter un profil interne")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Statut du profil mis à jour"),
            @ApiResponse(responseCode = "400", description = "Status invalide"),
            @ApiResponse(responseCode = "404", description = "Profil non trouvé")
    })


    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{userId}/status")
    public ResponseEntity<UserProfileResponse> changeProfileStatus(
            @PathVariable Integer userId,
            @Parameter(description = "Nouveau statut : DRAFT, PENDING, VALIDATED, REJECTED", required = true)
            @RequestParam String status,
            @Parameter(description = "ID de l'administrateur validant/rejetant le profil", required = true)
            @RequestParam Integer adminId,
            @Parameter(description = "Raison du rejet si applicable")
            @RequestParam(required = false) String rejectionReason) {

        return ResponseEntity.ok(service.changeProfileStatus(userId, status, adminId, rejectionReason));
    }
}
