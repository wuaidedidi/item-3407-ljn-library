package com.ljn.library.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class LjnJwtUtil {

    @Value("${ljn.jwt.secret}")
    private String ljnSecret;

    @Value("${ljn.jwt.expiration}")
    private Long ljnExpiration;

    public String generateToken(Long ljnUserId, String ljnUsername, Integer ljnRole) {
        Map<String, Object> ljnClaims = new HashMap<>();
        ljnClaims.put("ljnUserId", ljnUserId);
        ljnClaims.put("ljnUsername", ljnUsername);
        ljnClaims.put("ljnRole", ljnRole);

        return Jwts.builder()
                .setClaims(ljnClaims)
                .setSubject(ljnUsername)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + ljnExpiration))
                .signWith(SignatureAlgorithm.HS512, ljnSecret)
                .compact();
    }

    public Claims parseToken(String ljnToken) {
        return Jwts.parser()
                .setSigningKey(ljnSecret)
                .parseClaimsJws(ljnToken)
                .getBody();
    }

    public boolean validateToken(String ljnToken) {
        try {
            Claims ljnClaims = parseToken(ljnToken);
            return !ljnClaims.getExpiration().before(new Date());
        } catch (Exception e) {
            return false;
        }
    }

    public Long getUserId(String ljnToken) {
        Claims ljnClaims = parseToken(ljnToken);
        return ((Number) ljnClaims.get("ljnUserId")).longValue();
    }

    public String getUsername(String ljnToken) {
        return parseToken(ljnToken).getSubject();
    }

    public Integer getRole(String ljnToken) {
        Claims ljnClaims = parseToken(ljnToken);
        return (Integer) ljnClaims.get("ljnRole");
    }
}
