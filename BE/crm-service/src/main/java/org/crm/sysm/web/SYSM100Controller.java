package org.crm.sysm.web;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Slf4j
@Controller
@RequestMapping(value = "/sysm/*")
public class SYSM100Controller {

	@PostMapping("/test")
	public ResponseEntity test() {
		return ResponseEntity.ok("test");
	}

}
