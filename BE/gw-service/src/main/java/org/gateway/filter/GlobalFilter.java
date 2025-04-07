package org.gateway.filter;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.gateway.config.PathsToExclude;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

import java.util.List;

@Component
@Slf4j
public class GlobalFilter extends AbstractGatewayFilterFactory<GlobalFilter.Config> {

	private PathsToExclude pathsToExclude;
	private ObjectMapper objectMapper;

	public GlobalFilter(PathsToExclude pathsToExclude, ObjectMapper objectMapper) {
		super(Config.class);
		this.pathsToExclude = pathsToExclude;
		this.objectMapper = objectMapper;
	}

	@Override
	public GatewayFilter apply(Config config) {
		return (exchange, chain) ->{
			ServerHttpRequest request = exchange.getRequest();
			ServerHttpResponse response = exchange.getResponse();
			log.debug("Global Filter baseMessage: -> {}", config.getBaseMessage());

			log.debug("request URL {}", request.getURI().getPath());
			log.debug("request header {}",request.getHeaders());

			// 인증을 건너뛰어야 할 경로를 체크 (예: /bcs/crm/lgin/** 등)
			if (isPathExcluded(request.getURI().getPath())) {
				log.debug("Skipping authentication for path: {}", request.getURI().getPath());
			} else {
				// 인증이 필요한 요청인데 Authorization 헤더가 없을 경우
				if (!request.getHeaders().containsKey(HttpHeaders.AUTHORIZATION)) {
					log.debug("Authorization header is missing. Returning 401 Unauthorized.");

					// 401 Unauthorized 응답을 CRM-Service로 전달
					response.setStatusCode(HttpStatus.UNAUTHORIZED);
					response.getHeaders().set(HttpHeaders.CONTENT_TYPE, "application/json");

					JSONObject json = new JSONObject();
					json.put("status", response.getStatusCode());
					json.put("message", "인증헤더 누락.");

					// 오류 메시지를 CRM-Service로 넘기고, CRM-Service의 응답을 클라이언트로 반환
					try {
						return response.writeWith(Mono.just(response.bufferFactory().wrap(this.objectMapper.writeValueAsBytes(json))));
					} catch (JsonProcessingException e) {
						throw new RuntimeException(e);
					}
				}
			}

			//Custom Post Filter
			return chain.filter(exchange).then(Mono.fromRunnable(()->{
				log.debug("Global Filter End: response status code -> {}", response.getStatusCode());
			}));
		};
	}

	private boolean isPathExcluded(String path) {
		List<String> excludedPaths = this.pathsToExclude.getPathsToExclude();
		for (String excludedPath : excludedPaths) {
			if (path.startsWith(excludedPath)) {
				return true;  // 해당 경로는 인증을 건너뛴다
			}
		}
		return false;  // 다른 경로는 인증이 필요하다
	}

	@Data
	public static class Config{
		private String baseMessage;
		private boolean preLogger;
		private boolean postLogger;
	}
}