package com.ljn.library.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ljn.library.common.LjnResult;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class LjnSecurityConfig {

    private final LjnJwtAuthFilter ljnJwtAuthFilter;
    private final ObjectMapper ljnObjectMapper;

    public LjnSecurityConfig(LjnJwtAuthFilter ljnJwtAuthFilter, ObjectMapper ljnObjectMapper) {
        this.ljnJwtAuthFilter = ljnJwtAuthFilter;
        this.ljnObjectMapper = ljnObjectMapper;
    }

    @Bean
    public PasswordEncoder ljnPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain ljnFilterChain(HttpSecurity http) throws Exception {
        http
            .cors().configurationSource(ljnCorsConfigurationSource())
            .and()
            .csrf().disable()
            .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            .and()
            .authorizeRequests()
                .antMatchers("/api/ljn/auth/**").permitAll()
                .antMatchers("/api/ljn/upload/**").authenticated()
                .antMatchers("/uploads/**").permitAll()
                .antMatchers("/covers/**").permitAll()
                .antMatchers(HttpMethod.GET, "/api/ljn/books/**").permitAll()
                .antMatchers(HttpMethod.GET, "/api/ljn/book-types/**").permitAll()
                .anyRequest().authenticated()
            .and()
            .exceptionHandling()
                .authenticationEntryPoint((request, response, authException) -> {
                    response.setStatus(401);
                    response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                    response.setCharacterEncoding("UTF-8");
                    response.getWriter().write(
                        ljnObjectMapper.writeValueAsString(LjnResult.error(401, "登录已过期，请重新登录"))
                    );
                })
                .accessDeniedHandler((request, response, accessDeniedException) -> {
                    response.setStatus(403);
                    response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                    response.setCharacterEncoding("UTF-8");
                    response.getWriter().write(
                        ljnObjectMapper.writeValueAsString(LjnResult.error(403, "权限不足，无法执行此操作"))
                    );
                })
            .and()
            .addFilterBefore(ljnJwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource ljnCorsConfigurationSource() {
        CorsConfiguration ljnConfig = new CorsConfiguration();
        ljnConfig.setAllowedOriginPatterns(Arrays.asList("*"));
        ljnConfig.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        ljnConfig.setAllowedHeaders(Arrays.asList("*"));
        ljnConfig.setAllowCredentials(true);
        ljnConfig.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource ljnSource = new UrlBasedCorsConfigurationSource();
        ljnSource.registerCorsConfiguration("/**", ljnConfig);
        return ljnSource;
    }
}
