package org.crm.cmmn.web;

import lombok.extern.slf4j.Slf4j;
import org.crm.cmmn.VO.CMMN100VO;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.Locale;

@Slf4j
@Controller
@RequestMapping("/cmmn")
public class CMMN100Controller {

	@PostMapping("/CMMN100SEL")
	public String CMMN_DSBL_NOTI_POP (@ModelAttribute("CMMN100VO") CMMN100VO vo, ModelMap model, Locale locale) throws Exception {
		model.addAttribute("param", vo);
		return "th/cmmn/CMMN_DSBL_NOTI_POP";
	}
}
