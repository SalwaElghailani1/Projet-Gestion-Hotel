package faculte.microservice_security.mapper;

import faculte.microservice_security.dto.UserRequestDTO;
import faculte.microservice_security.dto.UserResponseDTO;
import faculte.microservice_security.entities.PermissionEntity;
import faculte.microservice_security.entities.Role;
import faculte.microservice_security.entities.User;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Component
public class UserMapper {

    public User DTO_to_Entity(UserRequestDTO request) {
        User user = new User();

        user.setPassword(request.getPassword());
        user.setEmail(request.getEmail());
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setActive(true);
        user.setCreatedAt(LocalDateTime.now());

        return user;
    }

    public UserResponseDTO Entity_to_DTO(User user) {
        UserResponseDTO response = new UserResponseDTO();

        response.setId(user.getId());
        response.setEmail(user.getEmail());
        response.setFirstName(user.getFirstName());
        response.setLastName(user.getLastName());
        response.setActive(user.isActive());
        response.setCreatedAt(user.getCreatedAt());
        response.setUpdatedAt(user.getUpdatedAt());

        Set<String> roles = new HashSet<>();
        if (user.getRoles() != null && !user.getRoles().isEmpty()) {
            for (Role role : user.getRoles()) {
                roles.add(role.getName());
            }
        }
        response.setRoles(roles);

        Set<String> permissions = new HashSet<>();

        // Permissions des rôles
        if (user.getRoles() != null) {
            for (Role role : user.getRoles()) {
                if (role.getPermissions() != null) {
                    for (PermissionEntity perm : role.getPermissions()) {
                        permissions.add(perm.getName());
                    }
                }
            }
        }



        return response;
    }
}