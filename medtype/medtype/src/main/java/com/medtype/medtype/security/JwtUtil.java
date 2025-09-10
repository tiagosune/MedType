package com.medtype.medtype.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Map;

@Component
public class JwtUtil {

    // Chave secreta fixa (32 bytes mínimo para HS256)
    private static final String SECRET = "uma-chave-super-secreta-de-32-bytess";
    private static final Key KEY = Keys.hmacShaKeyFor(SECRET.getBytes());

    private static final long EXPIRATION = 60 * 60 * 1000; // 1 hora

    /**
     * Extrai claims do token
     */
    public Claims getClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(KEY)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    /**
     * Retorna roles como lista de strings
     */
    public List<String> getRoles(String token) {
        Claims claims = getClaims(token);
        // Tenta recuperar "roles" (lista), se não houver, usa "role" (string) para compatibilidade
        Object rolesObj = claims.get("roles");
        if (rolesObj instanceof List<?>) {
            return (List<String>) rolesObj;
        } else if (claims.get("role") != null) {
            return List.of((String) claims.get("role"));
        }
        return Collections.emptyList();
    }

    /**
     * Gera token JWT
     */
    public String generateToken(String username, String role) {
        // Sempre cria claim "roles" como lista; mantém "role" para compatibilidade
        return Jwts.builder()
                .setSubject(username)
                .claim("roles", List.of(role))
                .claim("role", role)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION))
                .signWith(KEY, SignatureAlgorithm.HS256)
                .compact();
    }

    /**
     * Extrai username do token
     */
    public String extractUsername(String token) {
        try {
            return getClaims(token).getSubject();
        } catch (JwtException e) {
            // Token inválido
            return null;
        }
    }

    /**
     * Valida token
     */
    public boolean isTokenValid(String token) {
        return extractUsername(token) != null;
    }
}
