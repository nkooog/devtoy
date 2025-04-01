package org.crm.config.spring.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Slf4j
@Configuration
public class ResourcesConfig implements WebMvcConfigurer {

	private PropertiesService propertiesService;

	@Autowired
	public ResourcesConfig(PropertiesService propertiesService) {
		this.propertiesService = propertiesService;
	}

	private final String fileHeader = "file:///" ;

	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {

		log.debug(propertiesService.getString("POTO"));

		registry.addResourceHandler("/photo/**")
				.addResourceLocations(fileHeader + propertiesService.getString("POTO"));

		registry.addResourceHandler("/dash/**")
				.addResourceLocations(fileHeader + propertiesService.getString("DASH"));

		registry.addResourceHandler("/dashimg/**")
				.addResourceLocations(fileHeader + propertiesService.getString("DASH_IMG"));

		registry.addResourceHandler("/cmmtphoto/**")
				.addResourceLocations(fileHeader + propertiesService.getString("CMMT"));
		registry.addResourceHandler("/cmmtphotoimg/**")
				.addResourceLocations(fileHeader + propertiesService.getString("CMMT_IMG"));
		registry.addResourceHandler("/cmmtphotocnts/**")
				.addResourceLocations(fileHeader + propertiesService.getString("CMMT_CNTS"));

		registry.addResourceHandler("/kmstphoto/**")
				.addResourceLocations(fileHeader + propertiesService.getString("KLD"));
		registry.addResourceHandler("/kmstphotoimg/**")
				.addResourceLocations(fileHeader + propertiesService.getString("KLD_IMG"));
		registry.addResourceHandler("/kmstphotocnts/**")
				.addResourceLocations(fileHeader + propertiesService.getString("KLD_CNTS"));

		registry.addResourceHandler("/cmmtphotocntstmp/**")
				.addResourceLocations(fileHeader + propertiesService.getString("CMMT_CNTS_TMP"));
		
		registry.addResourceHandler("/cmmtnlphotocntstmp/**")
				.addResourceLocations(fileHeader + propertiesService.getString("CMMT_NL_CNTS_TMP"));
		
		registry.addResourceHandler("/mmsimg/**")
				.addResourceLocations(fileHeader + propertiesService.getString("MMS_IMG"));
	}
}
