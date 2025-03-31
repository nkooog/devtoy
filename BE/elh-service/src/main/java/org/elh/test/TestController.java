package org.elh.test;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/elh")
public class TestController {


	@RequestMapping("/test")
	public String SYSM100M() {
		return "th/test/TestPage";
	}

}
