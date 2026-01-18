package faculte.service_interne.service;

import faculte.service_interne.dto.UserProfileRequest;
import faculte.service_interne.dto.UserProfileResponse;
import faculte.service_interne.entities.MetierRole;
import faculte.service_interne.entities.ProfileStatus;
import org.springframework.security.oauth2.jwt.Jwt;

import java.util.List;

public interface UserProfileService {

    // Créer un profil interne pour un userId donné
    UserProfileResponse createUserProfile(Integer userId,String nom,
                                          String prenom,String email, UserProfileRequest request);
    // Mettre à jour le profil interne existant
    UserProfileResponse updateUserProfile(Integer userId, UserProfileRequest request);
    // Récupérer un profil interne par userId
    UserProfileResponse getUserProfileById(Integer userId);
    // Récupérer la liste de tous les profils internes
    List<UserProfileResponse> getAllUserProfiles(Jwt jwt);
    // Supprimer un profil interne par userId
    void deleteUserProfile(Integer userId);
    // Changer le status du profil (ex: DRAFT → PENDING → VALIDATED → REJECTED)
    UserProfileResponse changeProfileStatus(Integer userId, String status, Integer adminId, String rejectionReason);
    public void updateMetierRole(Integer userId, MetierRole role);

    public void updateProfileStatus(Integer userId, ProfileStatus status);
}
