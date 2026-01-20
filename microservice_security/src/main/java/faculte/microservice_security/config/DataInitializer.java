package faculte.microservice_security.config;

import faculte.microservice_security.entities.Role;
import faculte.microservice_security.entities.User;
import faculte.microservice_security.repository.RoleRepository;
import faculte.microservice_security.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Arrays;
import java.util.List;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initData(
            RoleRepository roleRepository,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder
    ) {
        return args -> {
            System.out.println("📦 Début de l'initialisation des données...");
            List<String> roles = Arrays.asList("ADMIN", "CLIENT", "MANAGER",
                    "RECEPTIONNISTE", "HOUSEKEEPING",
                    "MAINTENANCE", "COMPTABLE");

            for (String roleName : roles) {
                if (roleRepository.findByName(roleName).isEmpty()) {
                    Role role = new Role();
                    role.setName(roleName);
                    role.setDescription(roleName);
                    roleRepository.save(role);
                    System.out.println("✅ Role créé: " + roleName);
                } else {
                    System.out.println("⚡ Role existe déjà: " + roleName);
                }
            }
            if (userRepository.findByEmail("admin@hotel.com").isEmpty()) {
                User admin = new User();
                admin.setFirstName("Admin");
                admin.setLastName("System");
                admin.setEmail("admin@hotel.com");
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setActive(true);

                Role adminRole = roleRepository.findByName("ADMIN")
                        .orElseThrow(() -> new RuntimeException("Role ADMIN non trouvé!"));

                admin.getRoles().add(adminRole);
                userRepository.save(admin);

                System.out.println("✅ Admin utilisateur créé: admin@hotel.com / admin123");
            }

            System.out.println("✅ Initialisation des données terminée!");
        };
    }
}