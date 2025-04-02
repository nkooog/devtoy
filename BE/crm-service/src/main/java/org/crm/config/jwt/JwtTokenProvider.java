package org.crm.config.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.crm.config.redis.RedisService;
import org.crm.lgin.model.vo.LGIN000VO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Date;

@Slf4j
@Component
public class JwtTokenProvider {

	private final SecretKey KEY;
	private final String SEPARATOR = ":";

	private RedisService redisService;

	@Value("${jwt.header}")
	private String header;

	@Value("${jwt.type}")
	private String type;

	@Autowired
	public JwtTokenProvider(RedisTemplate redisTemplate, @Value("${jwt.secret}") String KEY, RedisService redisService ) {
		byte[] keyBytes = Decoders.BASE64.decode(KEY);
		this.KEY = Keys.hmacShaKeyFor(keyBytes);
		this.redisService = redisService;
	}

	public JwtToken generateToken(LGIN000VO lgin000VO) {

		// 테넌트명:사용자ID
		StringBuffer buffer = new StringBuffer();

		buffer.append(lgin000VO.getTenantId());
		buffer.append(SEPARATOR);
		buffer.append(lgin000VO.getUsrId());

		Date accessTokenExpiration = getTokenDate(10);
		Date refreshTokenExpiration = getTokenDate(60);

		// Access Token 생성
		String accessToken = Jwts.builder()
				.signWith(this.KEY)
				.setSubject(buffer.toString())
				.claim(this.header, lgin000VO.getUsrGrd())
				.setExpiration(accessTokenExpiration)
				.compact();

		// Refresh Token 생성
		String refreshToken = Jwts.builder()
				.signWith(this.KEY)
				.setExpiration(refreshTokenExpiration)
				.compact();

		String refreshKey = buffer.toString();

		JwtToken jwtToken = JwtToken.builder()
				.refreshKey(refreshKey)
				.refreshToken(refreshToken)
				.build();

		this.redisService.create(jwtToken, 20);

		return JwtToken.builder()
				.grantType(this.type.trim())
				.accessToken(accessToken)
				.refreshToken(refreshToken)
				.accessTokenExpiration(accessTokenExpiration.toString())
				.refreshTokenExpiration(refreshTokenExpiration.toString())
				.build();
	}

	public Claims parseClaims(String token) {
		return Jwts.parserBuilder()
							.setSigningKey(this.KEY)
							.build()
							.parseClaimsJws(token)
							.getBody();
	}


	public HttpStatus isValidToken(LGIN000VO lgin000VO) {

		StringBuffer buffer = new StringBuffer();
		JwtToken jwtToken = null;
		Claims claims = null;
		HttpStatus httpStatus = null;
		String refresh = null;

		if(lgin000VO != null) {
			buffer.append(lgin000VO.getTenantId());
			buffer.append(SEPARATOR);
			buffer.append(lgin000VO.getUsrId());

			refresh = this.redisService.read(buffer.toString());
		}

		if(refresh != null) {
			claims = this.parseClaims(refresh);
			if(claims != null) {
				httpStatus = HttpStatus.OK;
			}
		}else{
			httpStatus = HttpStatus.CREATED;
		}

		return httpStatus;
	}

	// LocalDateTime To Date
	public Date getTokenDate(Integer minutes) {
		return java.sql.Timestamp.valueOf(LocalDateTime.now().plusMinutes(minutes).format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
	}

}
