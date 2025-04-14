package org.crm.config.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
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
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.UUID;

@Slf4j
@Component
public class JwtTokenProvider {
	private final SecretKey KEY;
	private final String SEPARATOR = ":";

	private RedisService redisService;

	private Date accessTokenExpiration = getTokenDate(1);
	private Date refreshTokenExpiration = getTokenDate(60);

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

		// Access Token 생성
		String accessToken = generateAccessToken(lgin000VO);
		// Refresh Token 생성
		String refreshToken = generateRefreshToken();

		String redisKey = lgin000VO.getTenantId() + ":" + lgin000VO.getUsrId();

		JwtToken jwtToken = JwtToken.builder()
				.tokenKey(redisKey)
				.accessToken(accessToken)
				.refreshToken(refreshToken)
				.build();

		this.redisService.create(jwtToken, 1);

		return JwtToken.builder()
				.grantType(this.type.trim())
				.accessToken(accessToken)
				.refreshToken(refreshToken)
				.accessTokenExpiration(accessTokenExpiration.toString())
				.refreshTokenExpiration(refreshTokenExpiration.toString())
				.build();
	}

	public Claims parseClaims(String accessToken) throws Exception{

		JSONParser parser = new JSONParser();
		JSONObject jsonObj = (JSONObject) parser.parse(accessToken);

		try {
			// 토큰 파싱
			return Jwts.parserBuilder()
					.setSigningKey(KEY)
					.build()
					.parseClaimsJws(jsonObj.get("accessToken").toString())
					.getBody();
		} catch (ExpiredJwtException e) {
			throw e;
		} catch (Exception e) {
			// 기타 예외 처리
			throw new RuntimeException("토큰 파싱 오류", e);
		}
	}


	public JSONObject isValidToken(LGIN000VO lgin000VO) throws Exception{

		StringBuffer buffer = new StringBuffer();
		JSONObject jsonObj = new JSONObject();
		String auth = null;

		try {

			if(lgin000VO != null) {
				buffer.append(lgin000VO.getTenantId());
				buffer.append(SEPARATOR);
				buffer.append(lgin000VO.getUsrId());

				auth = this.redisService.read(buffer.toString());
			}

			if(auth != null) {
				Claims claims = this.parseClaims(auth);
				jsonObj.put("status", HttpStatus.OK);
				jsonObj.put("auth", auth);
			}else{
				jsonObj.put("status", HttpStatus.CREATED);
				jsonObj.put("auth", this.generateToken(lgin000VO));
			}

		}catch (ExpiredJwtException e) {
			jsonObj.put("status", HttpStatus.UNAUTHORIZED);
			jsonObj.put("auth", auth);
		}

		return jsonObj;
	}

	// LocalDateTime To Date
	public Date getTokenDate(Integer minutes) {
		return Timestamp.valueOf(LocalDateTime.now().plusMinutes(minutes).format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
	}

	public String generateAccessToken (LGIN000VO lgin000VO) throws Exception {
		StringBuffer subject = new StringBuffer();

		subject.append(lgin000VO.getTenantId());
		subject.append(SEPARATOR);
		subject.append(lgin000VO.getUsrId());

		// Access Token 생성
		return Jwts.builder()
				.signWith(this.KEY)
				.setSubject(subject.toString())
				.setId(UUID.randomUUID().toString())
				.claim(this.header, lgin000VO.getUsrGrd())
				.setExpiration(this.accessTokenExpiration)
				.compact();
	}

	public String generateRefreshToken () throws Exception {
		return Jwts.builder()
				.signWith(this.KEY)
				.setId(UUID.randomUUID().toString())
				.setExpiration(this.refreshTokenExpiration)
				.compact();
	}

}
