package org.crm.lgin.web;


import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.crm.lgin.VO.LGIN000VO;
import org.crm.lgin.service.LGIN000Service;
import org.crm.util.com.ComnFun;
import org.crm.util.crypto.AES256Crypt;
import org.crm.util.json.JsonUtil;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.util.HashMap;
import java.util.Locale;

/***********************************************************************************************
* Program Name : 로그인 Controller
* Creator      : sukim
* Create Date  : 2022.02.03
* Description  : 로그인
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.02.03     sukim            최초생성
************************************************************************************************/
@Slf4j
@Controller
@RequestMapping("/lgin/*")
public class LGIN000Controller {

	private final String SEPARATOR = ":";

	@Resource(name = "LGIN000Service")
	private LGIN000Service lgin000Service;

	private MessageSource messageSource;
	private ObjectMapper objectMapper;
	private RedisTemplate redisTemplate;

	@Autowired
	public LGIN000Controller(MessageSource messageSource, ObjectMapper objectMapper, RedisTemplate redisTemplate) {
		this.messageSource = messageSource;
		this.objectMapper = objectMapper;
		this.redisTemplate = redisTemplate;
	}

	/**
     * @Method Name : login
     * @작성일      : 2024.11.29
     * @작성자      : jypark
     * @변경이력    : 
     * @Method 설명 : th/lgin/login 전단계 연결 웹 페이지 열기
	 * @param       :  
	 * @return      : th/lgin/login.html
     */	
	@GetMapping("/LGIN000M")
	public String login(HttpServletRequest request) {
		return "/th/lgin/LGIN000M";
	}

	/**
	 * @Method Name : LGIN000SEL01, LGIN000SEL02
	 * @작성일      : 2022.02.04
	 * @작성자      : sukim
	 * @변경이력    :
	 * @Method 설명 : 로그인 체크 및 로그인 사용자정보 조회
	 * @param       :
	 * @return      : 성공시 : 성공 상태, 성공 메시지
	 *                실패시 : 실패 상태, 실패 메시지
	 */
	@PostMapping(value = "/LGIN000SEL01")
	public ResponseEntity LGIN000SEL01(@RequestBody @Valid LGIN000VO lgin000VO, BindingResult bindingResult){

		if(bindingResult.hasErrors()) {

		}


		return null;
	}

	/**
	 * @Method Name : 태넌트 다국어코드 조회(LGIN000SEL03)
	 * @작성일      : 2022.03.21
	 * @작성자      : sukim
	 * @변경이력    :
	 * @Method 설명 : 태넌트 다국어코드 조회
	 * @param       : 태넌트ID(tenantId)
	 * @return      : ModelAndView HashMap
	 */
	@PostMapping("/LGIN000SEL03")
	@ResponseBody
	public ResponseEntity<String> LGIN000SEL03(@RequestBody String request, Locale locale) {

		HashMap<String, Object> LGIN000SEL03_hashMap = new HashMap<String, Object>();
		JSONParser parser = new JSONParser();
		String result = null;

		try {
			JSONObject jsonObject = (JSONObject) parser.parse(request);
			LGIN000VO vo = new LGIN000VO();
			vo.setTenantId((String) jsonObject.get("tenantId"));

			LGIN000VO mlingCd = lgin000Service.LGIN000SEL03(vo);

			String rtnMsg =
					(mlingCd != null) ? messageSource.getMessage("success.common.select", null, "success select", locale)
							: messageSource.getMessage("LGIN000M.error.tenantId", null, "error tenantId", locale);

			LGIN000SEL03_hashMap.put("result", this.objectMapper.writeValueAsString(mlingCd));
			LGIN000SEL03_hashMap.put("msg"   , rtnMsg);

			result = this.objectMapper.writeValueAsString(LGIN000SEL03_hashMap);

		}catch(Exception e) {
			log.error("["+e.getClass()+"] Exception : " + e.getMessage());
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(messageSource.getMessage("LGIN000M.error.loginBlock", null, "server error", locale));
		}
		return ResponseEntity.ok().body(result);
	}

}