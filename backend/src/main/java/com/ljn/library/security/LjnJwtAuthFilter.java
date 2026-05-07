package com.ljn.library.security;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Collections;

@Component
public class LjnJwtAuthFilter extends OncePerRequestFilter {

    private static final Logger ljnLogger = LoggerFactory.getLogger(LjnJwtAuthFilter.class);

    private final LjnJwtUtil ljnJwtUtil;

    public LjnJwtAuthFilter(LjnJwtUtil ljnJwtUtil) {
        this.ljnJwtUtil = ljnJwtUtil;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        String ljnToken = extractToken(request);

        if (StringUtils.hasText(ljnToken) && ljnJwtUtil.validateToken(ljnToken)) {
            try {
                String ljnUsername = ljnJwtUtil.getUsername(ljnToken);
                Long ljnUserId = ljnJwtUtil.getUserId(ljnToken);
                Integer ljnRole = ljnJwtUtil.getRole(ljnToken);

                String ljnAuthority = ljnRole == 0 ? "ROLE_ADMIN" : "ROLE_USER";

                UsernamePasswordAuthenticationToken ljnAuth = new UsernamePasswordAuthenticationToken(
                        ljnUserId, null,
                        Collections.singletonList(new SimpleGrantedAuthority(ljnAuthority))
                );

                SecurityContextHolder.getContext().setAuthentication(ljnAuth);
                ljnLogger.debug("用户认证成功: username={}, role={}", ljnUsername, ljnAuthority);
            } catch (Exception e) {
                ljnLogger.warn("JWT token解析失败: {}", e.getMessage());
                SecurityContextHolder.clearContext();
            }
        }

        filterChain.doFilter(request, response);
    }

    private String extractToken(HttpServletRequest request) {
        String ljnBearer = request.getHeader("Authorization");
        if (StringUtils.hasText(ljnBearer) && ljnBearer.startsWith("Bearer ")) {
            return ljnBearer.substring(7);
        }
        return null;
    }
}
