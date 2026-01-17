package faculte.service_interne.mapper;

import faculte.service_interne.dto.UserProfileRequest;
import faculte.service_interne.dto.UserProfileResponse;
import faculte.service_interne.entities.UserProfile;
import org.springframework.stereotype.Component;

@Component
public class UserProfileMapper {

    // Mapper de Request DTO vers Entity
    public UserProfile RequesttoEntity(UserProfileRequest request, Integer userId) {
        UserProfile profile = new UserProfile();
        profile.setUserId(userId);
        //profile.setNom(request.getNom());
       // profile.setPrenom(request.getPrenom());
        profile.setTelephone(request.getTelephone());
        profile.setAdresse(request.getAdresse());
        profile.setCin(request.getCin());
        profile.setMetierRole(request.getMetierRole());
        profile.setDepartement(request.getDepartement());
        profile.setDateEmbauche(request.getDateEmbauche());
        profile.setSuperviseurId(request.getSuperviseurId());
        profile.setDisponible(true);
        profile.setStatus(faculte.service_interne.entities.ProfileStatus.DRAFT);
        profile.setCreatedAt(java.time.LocalDateTime.now());
        return profile;
    }

    // Mapper de Entity vers Response DTO
    public UserProfileResponse EntitytoResponse(UserProfile profile) {
        UserProfileResponse response = new UserProfileResponse();
        response.setUserId(profile.getUserId());
        response.setNom(profile.getNom());
        response.setPrenom(profile.getPrenom());
        response.setTelephone(profile.getTelephone());
        response.setAdresse(profile.getAdresse());
        response.setCin(profile.getCin());
        response.setMetierRole(profile.getMetierRole());
        response.setDepartement(profile.getDepartement());
        response.setDateEmbauche(profile.getDateEmbauche());
        response.setSuperviseurId(profile.getSuperviseurId());
        response.setDisponible(profile.getDisponible());
        response.setStatus(profile.getStatus());
        response.setCreatedAt(profile.getCreatedAt());
        response.setUpdatedAt(profile.getUpdatedAt());
        response.setValidatedAt(profile.getValidatedAt());
        response.setValidatedBy(profile.getValidatedBy());
        return response;
    }

    // Mise à jour d'une Entity existante avec les données du Request
//    public void updateEntity(UserProfile profile, UserProfileRequest request) {
//        profile.setNom(request.getNom());
//        profile.setPrenom(request.getPrenom());
//        profile.setTelephone(request.getTelephone());
//        profile.setAdresse(request.getAdresse());
//        profile.setCin(request.getCin());
//        profile.setMetierRole(request.getMetierRole());
//        profile.setDepartement(request.getDepartement());
//        profile.setDateEmbauche(request.getDateEmbauche());
//        profile.setSuperviseurId(request.getSuperviseurId());
//        profile.setUpdatedAt(java.time.LocalDateTime.now());
//    }
}
