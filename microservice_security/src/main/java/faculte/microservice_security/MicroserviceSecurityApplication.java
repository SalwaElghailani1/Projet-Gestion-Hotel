package faculte.microservice_security;

import faculte.microservice_security.config.RsaKeys;
import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.servers.Server;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@OpenAPIDefinition(
        info = @Info(
                title = "Microservice de Sécurité",
                description = "API pour la gestion des utilisateurs, rôles et permissions",
                version = "1.0.0",
                contact = @Contact(
                        name = "salwa",
                        email = "salwa.elghailani@etu.uae.ac.ma"
                )
        ),
        servers = {
                @Server(
                        url = "http://localhost:8070",
                        description = "Serveur de développement"
                )
        }
)
@SpringBootApplication
@EnableDiscoveryClient
@EnableEurekaServer
@EnableConfigurationProperties(RsaKeys.class)
public class MicroserviceSecurityApplication {

    public static void main(String[] args) {
        SpringApplication.run(MicroserviceSecurityApplication.class, args);
    }
    @Bean
    public PasswordEncoder bCryptPasswordEncoder() {

        return new BCryptPasswordEncoder();
    }
}
