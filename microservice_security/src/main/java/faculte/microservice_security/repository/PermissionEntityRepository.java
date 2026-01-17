package faculte.microservice_security.repository;

import faculte.microservice_security.entities.PermissionEntity;
import faculte.microservice_security.entities.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PermissionEntityRepository extends JpaRepository<PermissionEntity, Integer> {
    Optional<PermissionEntity> findByName(String permissionname);
    boolean existsByName(String name);

}
