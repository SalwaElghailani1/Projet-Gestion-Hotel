package faculte.microservice_security.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Set;
@AllArgsConstructor
@NoArgsConstructor
@Getter @Setter
public class UserRequestDTO {
        private String firstName;
        private String lastName;
        private String email;
        private String password;
        private Set<String> role;
}

