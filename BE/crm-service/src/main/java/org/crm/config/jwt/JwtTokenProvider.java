package org.crm.config.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.crm.config.redis.RedisService;
import org.crm.lgin.model.vo.LGIN000VO;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
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

	public JwtToken generateToken(LGIN000VO lgin000VO) throws Exception{

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

		String redisKey = buffer.toString();

		JwtToken jwtToken = JwtToken.builder()
				.tokenKey(redisKey)
				.accessToken(accessToken)
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

	public Claims parseClaims(String token) throws Exception{

		JSONParser parser = new JSONParser();
		JSONObject obj = (JSONObject) parser.parse(token);

		return Jwts.parserBuilder()
							.setSigningKey(this.KEY)
							.build()
							.parseClaimsJws((String) obj.get("accessToken"))
							.getBody();
	}


	public JSONObject isValidToken(LGIN000VO lgin000VO) throws Exception{

		StringBuffer buffer = new StringBuffer();
		JSONObject jsonObj = new JSONObject();
		Claims claims = null;
		String auth = null;

		if(lgin000VO != null) {
			buffer.append(lgin000VO.getTenantId());
			buffer.append(SEPARATOR);
			buffer.append(lgin000VO.getUsrId());

			auth = this.redisService.read(buffer.toString());
		}

		log.debug("auth > {}", auth);

		if(auth != null) {
			claims = this.parseClaims(auth);

			// TODO: claims Expiration 검증 추가

			if(claims != null) {

				log.debug( " Expiration -> {}" , claims.getExpiration());
				jsonObj.put("status", HttpStatus.OK);
				jsonObj.put("claims", claims);
			}
		}else{
			jsonObj.put("status", HttpStatus.CREATED);
			jsonObj.put("claims", claims);
		}

		return httpStatus;
	}

	// LocalDateTime To Date
	public Date getTokenDate(Integer minutes) {
		return java.sql.Timestamp.valueOf(LocalDateTime.now().plusMinutes(minutes).format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
	}

}
