package faculte.service_interne.service.impl;

import faculte.service_interne.dto.UserProfileRequest;
import faculte.service_interne.dto.UserProfileResponse;
import faculte.service_interne.entities.MetierRole;
import faculte.service_interne.entities.ProfileStatus;
import faculte.service_interne.entities.UserProfile;
import faculte.service_interne.mapper.UserProfileMapper;
import faculte.service_interne.repository.UserProfileRepository;
import faculte.service_interne.service.UserProfileService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserProfileServiceImpl implements UserProfileService {

    private final UserProfileRepository repository;
    private final UserProfileMapper mapper;

    public UserProfileServiceImpl(UserProfileRepository repository, UserProfileMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Override
    public UserProfileResponse createUserProfile(Integer userId,String nom,
                                                 String prenom,String email, UserProfileRequest request) {
        if (repository.existsByUserId(userId)) {
            throw new RuntimeException("Le profil interne existe déjà pour ce userId.");
        }

        UserProfile profile = mapper.RequesttoEntity(request, userId);
        profile.setNom(nom);
        profile.setPrenom(prenom);
        profile.setCreatedAt(LocalDateTime.now());
        if(profile.getMetierRole() == null ) {
            profile.setMetierRole(MetierRole.DEFOULT);
        }
        if(profile.getDepartement() == null || profile.getDepartement().isBlank()) {
            profile.setDepartement("Inconnu");
        }
        repository.save(profile);
        return mapper.EntitytoResponse(profile);
    }

    @Override
    public UserProfileResponse updateUserProfile(Integer userId, UserProfileRequest request) {
        UserProfile profile = repository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Profil interne non trouvé."));
        // Mettre à jour les champs via Mapper
        //profile.setNom(request.getNom());
       // profile.setPrenom(request.getPrenom());
        profile.setTelephone(request.getTelephone());
        profile.setAdresse(request.getAdresse());
        profile.setCin(request.getCin());
        profile.setMetierRole(request.getMetierRole());
        profile.setDepartement(request.getDepartement());
        profile.setDateEmbauche(request.getDateEmbauche());
        profile.setSuperviseurId(request.getSuperviseurId());
        profile.setUpdatedAt(LocalDateTime.now());
        repository.save(profile);
        return mapper.EntitytoResponse(profile);
    }

    @Override
    public UserProfileResponse getUserProfileById(Integer userId) {
        UserProfile profile = repository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Profil interne non trouvé."));
        return mapper.EntitytoResponse(profile);
    }

    @Override
    public List<UserProfileResponse> getAllUserProfiles() {
        return repository.findAll()
                .stream()
                .map(mapper::EntitytoResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteUserProfile(Integer userId) {
        if (!repository.existsById(userId)) {
            throw new RuntimeException("Profil interne non trouvé.");
        }
        repository.deleteById(userId);
    }

    @Override
    public UserProfileResponse changeProfileStatus(Integer userId, String status, Integer adminId, String rejectionReason) {
        UserProfile profile = repository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Profil interne non trouvé."));

        ProfileStatus newStatus;
        try {
            newStatus = ProfileStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Status invalide. Utilisez DRAFT, PENDING, VALIDATED ou REJECTED.");
        }

        profile.setStatus(newStatus);

        if (newStatus == ProfileStatus.VALIDATED) {
            profile.setValidatedAt(LocalDateTime.now());
            profile.setValidatedBy(adminId);
        } else if (newStatus == ProfileStatus.REJECTED) {
            profile.setRejectionReason(rejectionReason);
            profile.setValidatedAt(LocalDateTime.now());
            profile.setValidatedBy(adminId);
        }

        profile.setUpdatedAt(LocalDateTime.now());
        repository.save(profile);

        return mapper.EntitytoResponse(profile);
    }
}
