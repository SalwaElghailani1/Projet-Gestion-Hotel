package faculte.service_interne.repository;

import faculte.service_interne.entities.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserProfileRepository extends JpaRepository<UserProfile, Integer> {
    // Recherche d'un profil par le userId (lié au Security Service)
    UserProfile findByUserId(Integer userId);
    List<UserProfile> findByDepartement(String departement);
    List<UserProfile> findByDisponibleTrue();
    // Vérifier si un profil existe pour un userId donné
    boolean existsByUserId(Integer userId);
}
