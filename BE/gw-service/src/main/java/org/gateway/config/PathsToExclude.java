package org.gateway.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.List;

@Setter @Getter
@Component
@ConfigurationProperties(prefix = "spring.cloud.gateway")
public class PathsToExclude {
	private List<String> pathsToExclude;
}
