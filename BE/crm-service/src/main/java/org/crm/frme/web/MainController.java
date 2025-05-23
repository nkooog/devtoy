package org.crm.frme.web;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Slf4j
@Controller
public class MainController {

	@GetMapping("/main")
	public String main() throws Exception {
		return "/th/main";
	}

	@GetMapping("/auth")
	public String logout() throws Exception {
		return "/th/lgin/logout";
	}

}
