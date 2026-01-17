package faculte.microservice_security.service.impl;

import faculte.microservice_security.dto.UserRequestDTO;
import faculte.microservice_security.dto.UserResponseDTO;
import faculte.microservice_security.entities.Role;
import faculte.microservice_security.entities.User;
import faculte.microservice_security.mapper.UserMapper;
import faculte.microservice_security.repository.RoleRepository;
import faculte.microservice_security.repository.UserRepository;
import faculte.microservice_security.service.UserService;
import jakarta.transaction.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository userRepository,
                           RoleRepository roleRepository,
                           UserMapper userMapper,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public UserResponseDTO createUser(UserRequestDTO request) {
        // Vérifier si email existe déjà
        if(userRepository.existsByEmail(request.getEmail())){
            UserResponseDTO response = new UserResponseDTO();
            response.setEmail(request.getEmail());
            response.setActive(false);
            return response;
        }

        // Créer un nouvel utilisateur
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setActive(true);
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());

        // Assigner le rôle si fourni
        if(request.getRole() != null && !request.getRole().isEmpty()){
            for (String roleName : request.getRole()) {
                Role role = roleRepository.findByName(roleName)
                        .orElseThrow(() -> new RuntimeException("Role non trouvé: " + roleName));
                user.getRoles().add(role);
            }
        }

        // Sauvegarder en base
        User savedUser = userRepository.save(user);

        // UTILISER LE MAPPER COMME DANS getAllUsers() POUR AVOIR LA MÊME STRUCTURE
        return userMapper.Entity_to_DTO(savedUser);
    }

    @Override
    public UserResponseDTO getUserById(Integer id) {
        User user = userRepository.findById(id.intValue())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return userMapper.Entity_to_DTO(user);
    }

    @Override
    public List<UserResponseDTO> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(userMapper::Entity_to_DTO)
                .toList();
    }

    @Override
    public void deleteUser(Integer id) {
        userRepository.deleteById(id.intValue());
    }

    @Override
    public UserResponseDTO assignRoleToUser(Integer userId, String roleName) {
        User user = userRepository.findById(userId.intValue())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Role role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new RuntimeException("Role not found"));

        user.getRoles().add(role);
        userRepository.save(user); // Sauvegarder les changements

        return userMapper.Entity_to_DTO(user);
    }
    @Override
    public UserResponseDTO updateUserStatus(Integer id, Boolean active) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setActive(active);
        User updatedUser = userRepository.save(user);

        return userMapper.Entity_to_DTO(updatedUser);
    }
}