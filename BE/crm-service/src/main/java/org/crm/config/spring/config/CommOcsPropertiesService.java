package org.crm.config.spring.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@ConfigurationProperties(prefix = "comm-ocs-properties-service")
@Component("CommOcsPropertiesService")
public class CommOcsPropertiesService extends CommProperteis{
}
