package org.crm.config.spring.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.Arrays;

//prefix 에는 대문자가 들어갈 수없어서 yml 은 카멜케이스 대신 - 를 사용하는것을 권장
//@Component 는 첫글자가 소문자여야함
@ConfigurationProperties(prefix = "properties-service")
@Component("propertiesService")
public class PropertiesService extends CommProperteis {
    public PropertiesService() {
        setDecryptKeys(Arrays.asList("elkUrl", "elkId", "elkPw"));
    }
}

