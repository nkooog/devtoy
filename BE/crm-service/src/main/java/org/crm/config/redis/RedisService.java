package org.crm.config.redis;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.crm.config.jwt.JwtToken;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import java.util.concurrent.TimeUnit;

@Component
public class RedisService {

	private RedisTemplate redisTemplate;
	private ObjectMapper objectMapper;

	@Autowired
	public RedisService(RedisTemplate redisTemplate,ObjectMapper objectMapper) {
		this.redisTemplate = redisTemplate;
		this.objectMapper = objectMapper;
	}

	public void create(JwtToken jwtToken, long timeout) throws JsonProcessingException {

		JSONObject jsonObj = new JSONObject();
		jsonObj.put("accessToken", jwtToken.getAccessToken());
		jsonObj.put("refreshToken", jwtToken.getRefreshToken());

		this.redisTemplate.opsForValue().set(jwtToken.getTokenKey(), this.objectMapper.writeValueAsString(jsonObj));
		this.redisTemplate.expire(jwtToken.getRefreshToken(), timeout, TimeUnit.SECONDS);
	}

	public String read(String key) {
		return (String) this.redisTemplate.opsForValue().get(key);
	}

	private void update(JwtToken jwtToken, long timeout) throws JsonProcessingException {
		this.create(jwtToken, timeout);
	}

	private void delete(String key) {
		this.redisTemplate.delete(key);
	}

}
