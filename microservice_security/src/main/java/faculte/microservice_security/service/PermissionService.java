package faculte.microservice_security.service;

import java.util.List;

import faculte.microservice_security.entities.PermissionEntity;

public interface PermissionService {
    PermissionEntity createPermission(String permissionName);

    List<PermissionEntity> getAllPermissions();
    void deletePermission(Integer id);
}
