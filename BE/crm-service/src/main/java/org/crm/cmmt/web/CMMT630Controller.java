package org.crm.cmmt.web;

import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;


/***********************************************************************************************
 * Program Name : 뉴스레터 상세 페이지 Controller
 * Creator      : wkim
 * Create Date  : 2023.11.15
 * Description  : 뉴스레터 상세 페이지
 * Modify Desc  :
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2023.11.15      wkim          	최초생성
 * 2024.12.09      jypark          	egov->boot mig
 ************************************************************************************************/
@Slf4j
@Controller
@RequestMapping("/cmmt/*")
public class CMMT630Controller {

	/**
	 * @Method Name : CMMT630P
	 * @작성일      	: 2023.11.15
	 * @작성자      	: wkim
	 * @변경이력    	:
	 * @Method 설명 	: cmmt/CMMT630P 웹 페이지 열기
	 * @param       :
	 * @return      : cmmt/CMMT630P.jsp
	 */
	@PostMapping(value = "/CMMT630P")
	public String CMMT630P(@RequestBody String request, ModelMap model, HttpSession session) throws Exception {
		session.setAttribute("params", request);
		model.addAttribute("params", request);
		return "th/cmmt/CMMT630P";
	}

	@GetMapping(value = "/CMMT630P")
	public String CMMT630P(ModelMap model, HttpSession session) {
		model.addAttribute("params", session.getAttribute("params"));
		return "th/cmmt/CMMT630P";
	}

}
