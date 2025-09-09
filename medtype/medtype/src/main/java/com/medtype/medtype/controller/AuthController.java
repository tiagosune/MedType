package com.medtype.medtype.controller;

import com.medtype.medtype.model.Usuario;
import com.medtype.medtype.repository.UsuarioRepository;
import com.medtype.medtype.security.JwtUtil;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private final AuthenticationManager authManager;
    private final JwtUtil jwtUtil;
    private final UsuarioRepository usuarioRepository;



    public AuthController(AuthenticationManager authManager, JwtUtil jwtUtil, UsuarioRepository usuarioRepository) {
        this.authManager = authManager;
        this.jwtUtil = jwtUtil;
        this.usuarioRepository = usuarioRepository;
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        try {
            authManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );

            Usuario usuario = usuarioRepository.findByUsername(request.getUsername()).get();
            String token = jwtUtil.generateToken(usuario.getUsername());
            return new LoginResponse(token);
        } catch (AuthenticationException e) {
            throw new RuntimeException("Usuário ou senha inválidos");
        }
    }

    @Data
    public static class LoginRequest {
        private String username;
        private String password;
    }

    @Data
    public static class LoginResponse {
        private final String token;
    }
}
