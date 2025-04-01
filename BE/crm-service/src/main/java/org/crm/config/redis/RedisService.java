package org.crm.config.redis;

import org.crm.config.jwt.JwtToken;
import org.crm.config.security.jwt.JwtToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import java.util.concurrent.TimeUnit;

@Component
public class RedisService {

	private RedisTemplate redisTemplate;

	@Autowired
	public RedisService(RedisTemplate redisTemplate) {
		this.redisTemplate = redisTemplate;
	}

	public void create(JwtToken jwtToken, long timeout) {
		this.redisTemplate.opsForValue().set(jwtToken.getRefreshKey(), jwtToken.getRefreshToken());
		this.redisTemplate.expire(jwtToken.getRefreshToken(), timeout, TimeUnit.SECONDS);
	}

	public String read(String key) {
		return (String) this.redisTemplate.opsForValue().get(key);
	}

	private void update(JwtToken jwtToken, long timeout) {
		this.create(jwtToken, timeout);
	}

	private void delete(String key) {
		this.redisTemplate.delete(key);
	}

}
