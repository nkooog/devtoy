package org.crm.config.security;

import lombok.extern.slf4j.Slf4j;
import org.crm.config.security.jwt.JwtAuthencationEntryPoint;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

@Slf4j
@Configuration
@EnableWebSecurity
public class SecurityConfig {

	private final JwtAuthencationEntryPoint entryPoint;
	private final String[] AUTH = {"/auth/login", "/auth/health","/auth/swagger-ui/**", "/auth/v3/api-docs/**", "/auth/swagger.html"};

	public SecurityConfig(JwtAuthencationEntryPoint entryPoint) {
		this.entryPoint = entryPoint;
	}

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		http
				.httpBasic( httpBasic -> httpBasic.disable())
				.csrf(csrfConfigurer -> csrfConfigurer.disable())
				.headers(headerConfig -> headerConfig.frameOptions(frameOptionsConfig -> frameOptionsConfig.disable()))
				.authorizeHttpRequests(
						auth -> auth.requestMatchers(AUTH)
								.permitAll()
								.anyRequest().authenticated()
				)
				.sessionManagement(session ->
				session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
				)
				.exceptionHandling(exception -> {
					exception.authenticationEntryPoint(this.entryPoint);
				});

		return http.build();
	}

}
