package faculte.service_interne;

import faculte.service_interne.config.RsaKeys;
import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.servers.Server;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;

@OpenAPIDefinition(
        info = @Info(
                title = "Microservice de Users Interne",
                description = "API pour la gestion des Profiles utilisateurs",
                version = "1.0.0",
                contact = @Contact(
                        name = "salwa",
                        email = "salwa.elghailani@etu.uae.ac.ma"
                )
        ),
        servers = {
                @Server(
                        url = "http://localhost:8071",
                        description = "Serveur de développement"
                )
        }
)
@SpringBootApplication
@EnableDiscoveryClient
@EnableEurekaServer
@EnableConfigurationProperties(RsaKeys.class)

public class ServiceInterneApplication {

    public static void main(String[] args) {
        SpringApplication.run(ServiceInterneApplication.class, args);
    }

}
