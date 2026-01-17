package faculte.service_interne.service;

import faculte.service_interne.dto.UserProfileRequest;
import faculte.service_interne.dto.UserProfileResponse;

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
    List<UserProfileResponse> getAllUserProfiles();
    // Supprimer un profil interne par userId
    void deleteUserProfile(Integer userId);
    // Changer le status du profil (ex: DRAFT → PENDING → VALIDATED → REJECTED)
    UserProfileResponse changeProfileStatus(Integer userId, String status, Integer adminId, String rejectionReason);
}
