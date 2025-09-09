package com.medtype.medtype.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    // Chave secreta fixa (32 bytes mínimo para HS256)
    private static final String SECRET = "uma_chave_super_secreta_de_32_bytes!";
    private static final Key KEY = Keys.hmacShaKeyFor(SECRET.getBytes());

    private static final long EXPIRATION = 60 * 60 * 1000; // 1 hora

    public String generateToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION))
                .signWith(KEY, SignatureAlgorithm.HS256)
                .compact();
    }

    public String extractUsername(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(KEY)
                    .build()
                    .parseClaimsJws(token)
                    .getBody()
                    .getSubject();
        } catch (JwtException e) {
            // Token inválido
            return null;
        }
    }

    public boolean isTokenValid(String token) {
        return extractUsername(token) != null;
    }
}
