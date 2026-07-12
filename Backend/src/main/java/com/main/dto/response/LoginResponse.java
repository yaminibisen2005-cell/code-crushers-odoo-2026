package com.main.dto.response;

import com.main.enums.Role;
import lombok.*;

@Data
@AllArgsConstructor
public class LoginResponse {

    private String token;
    private String name;
    private String email;
    private Role role;
}