package org.crm.test;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RequestMapping;

@Slf4j
@Controller
public class TestController {

	@RequestMapping("/")
	public String Test() {
		return "/th/test/TestPage";
	}

}
