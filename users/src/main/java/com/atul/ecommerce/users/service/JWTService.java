package com.atul.ecommerce.users.service;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.SecureDigestAlgorithm;
import org.springframework.stereotype.Service;
import java.nio.file.*;
import java.security.*;
import java.security.spec.*;
import java.time.Instant;
import java.util.Date;

@Service
public class JWTService {
    
    private final PrivateKey privateKey;

    // Constructor to load the RSA private key from a PEM file
    public JWTService() {
        try {
            String pem = Files.readString(Path.of("src/main/resources/private.pem"))
                    .replace("-----BEGIN PRIVATE KEY-----","")
                    .replace("-----END PRIVATE KEY-----","")
                    .replaceAll("\\s","");
            byte[] bytes = java.util.Base64.getDecoder().decode(pem);
            KeyFactory kf = KeyFactory.getInstance("RSA");
            privateKey = kf.generatePrivate(new PKCS8EncodedKeySpec(bytes));
        } catch(Exception e) { throw new IllegalStateException("Could not load RSA private key", e); }
    }
    
    // Method to generate a JWT token for a given user ID and role
    public String generateToken(String userEmail, String role) {
        Instant now = Instant.now();
        return Jwts.builder()
                .subject(userEmail)
                .claim("email", userEmail)
                .claim("role", role)
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plusSeconds(900)))
                .signWith(privateKey, Jwts.SIG.RS256)
                .compact();
    }
}
