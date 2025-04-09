package org.gateway.filter;

import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.gateway.config.PathsToExclude;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;
import reactor.core.publisher.Mono;

import java.net.URI;
import java.util.List;

@Component
@Slf4j
public class GlobalFilter extends AbstractGatewayFilterFactory<GlobalFilter.Config> {

	@Value("${ncrm.redirect}")
	private String redirectUrl;
	private PathsToExclude pathsToExclude;

	public GlobalFilter(PathsToExclude pathsToExclude) {
		super(Config.class);
		this.pathsToExclude = pathsToExclude;
	}

	@Override
	public GatewayFilter apply(Config config) {
		return (exchange, chain) ->{
			ServerHttpRequest request = exchange.getRequest();
			ServerHttpResponse response = exchange.getResponse();
			log.debug("Global Filter baseMessage: -> {}", config.getBaseMessage());

			// 인증을 건너뛰어야 할 경로를 체크 (예: /bcs/crm/lgin/** 등 yml > spring.cloud.gateway 정의)
			if (isPathExcluded(request.getURI().getPath())) {
				log.debug("Skipping authentication for path: {}", request.getURI().getPath());
			} else {
				// 인증이 필요한 요청인데 Authorization 헤더가 없을 경우
				if (!request.getHeaders().containsKey(HttpHeaders.AUTHORIZATION)
					&& !exchange.getRequest().getCookies().containsKey(HttpHeaders.AUTHORIZATION)) {

					URI redirectUri = UriComponentsBuilder.fromUriString(this.redirectUrl)
							.build().toUri();
					exchange.getResponse().setStatusCode(HttpStatus.FOUND);
					exchange.getResponse().getHeaders().setLocation(redirectUri);
					return exchange.getResponse().setComplete();

				}else{
					//TODO: 인증 header는 있지만 토큰이 만료 된 경우 추가 로직
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
			log.debug(" isPathExcluded path : {}", excludedPath);
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