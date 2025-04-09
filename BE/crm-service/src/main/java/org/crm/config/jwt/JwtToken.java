package org.crm.config.jwt;


import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class JwtToken {

	private String tokenKey;
	private String grantType;
	private String accessToken;
	private String refreshToken;
	private String accessTokenExpiration;
	private String refreshTokenExpiration;

}
