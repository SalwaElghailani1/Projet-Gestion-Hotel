package faculte.microservice_security.service.impl;

import faculte.microservice_security.entities.PermissionEntity;
import faculte.microservice_security.entities.Role;
import faculte.microservice_security.repository.PermissionEntityRepository;
import faculte.microservice_security.repository.RoleRepository;
import faculte.microservice_security.service.RoleService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional

public class RoleServiceImpl implements RoleService {

    private final RoleRepository roleRepository;
    private final PermissionEntityRepository permissionRepository;

    public RoleServiceImpl(RoleRepository roleRepository,
                           PermissionEntityRepository permissionRepository) {
        this.roleRepository = roleRepository;
        this.permissionRepository = permissionRepository;
    }

    @Override
    public Role createRole(String roleName) {
        Role role = new Role();
        role.setName(roleName);
        return roleRepository.save(role);
    }

    @Override
    public void assignPermissionToRole(String roleName, String permissionName) {

        Role role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new RuntimeException("Role not found"));

        PermissionEntity permission = permissionRepository.findByName(permissionName)
                .orElseThrow(() -> new RuntimeException("Permission not found"));

        role.getPermissions().add(permission);
        roleRepository.save(role); // ⭐ مهم بزاف
    }

    @Override
    public void removePermissionFromRole(String roleName, String permissionName) {

        Role role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new RuntimeException("Role not found"));

        PermissionEntity permission = permissionRepository.findByName(permissionName)
                .orElseThrow(() -> new RuntimeException("Permission not found"));

        role.getPermissions().remove(permission);
        roleRepository.save(role);
    }

    @Override
    public void deleteRoleByName(String roleName) {

        Role role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new RuntimeException("Role not found"));

        role.getPermissions().clear(); // حل مشكلة FK
        roleRepository.delete(role);
    }

    @Override
    public List<Role> getAllRoles() {
        return roleRepository.findAll();
    }
}
