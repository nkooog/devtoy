package org.crm.test;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RequestMapping;

@Slf4j
@Controller
@RequestMapping("/crm")
public class TestController {


	@RequestMapping("/test")
	public String SYSM100M() {
		log.debug(" #################################################### ");
		return "/th/test/TestPage";
	}

	@ExceptionHandler(Exception.class)
	public String handleException(Exception e) {
		System.out.println(" ####### exception ");
		log.debug(" ####### exception ");
		return "errorPage"; // 이곳에 오류 페이지 경로를 지정
	}

}
