package org.crm.frme.web;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;

import java.nio.file.AccessDeniedException;

@Slf4j
@Controller
public class MainController {

	@GetMapping("/main")
	public String main() throws Exception {
		return "/th/main";
	}

	@GetMapping("/auth")
	public String logout(@RequestHeader(value = "X-GW-REASON", required = false) String reason) throws Exception {
		log.debug("test header: {}", reason);

		if(reason == null) {
			throw new AccessDeniedException("비정상");
		}

		return "/th/lgin/logout";
	}

}
