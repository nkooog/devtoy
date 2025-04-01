package org.crm.sysm.web;

import java.util.HashMap;
import java.util.List;
import java.util.Locale;

import jakarta.annotation.Resource;

import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fasterxml.jackson.databind.ObjectMapper;

import org.crm.sysm.VO.SYSM431VO;
import org.crm.sysm.service.SYSM431Service;
import lombok.extern.slf4j.Slf4j;
/***********************************************************************************************
* Program Name : SMS 발송변수 템플릿 찾기 팝업 controller
* Creator      : sukim
* Create Date  : 2022.06.02
* Description  : SMS 발송변수 템플릿 찾기 팝업
* Modify Desc  : 
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.06.02     sukim            최초생성
************************************************************************************************/
@Slf4j
@Controller
@RequestMapping("/sysm/*")
public class SYSM431Controller {
	
	@Resource(name = "SYSM431Service")
	private SYSM431Service SYSM431Service;
	
	@Autowired
	MessageSource messageSource;
	
	@Autowired
	private ObjectMapper objectMapper;
	
	private static final Logger LOGGER = LoggerFactory.getLogger(SYSM431Controller.class);
	
	
	/**
	 * @Method Name     : SYSM431P
	 * @작성일      	: 2022.06.02
	 * @작성자      	: sukim
	 * @변경이력    	:
	 * @Method 설명 	: sysm/SYSM431P 웹 페이지 열기
	 * @param           :
	 * @return          : sysm/SYSM431P.jsp
	 */
	@GetMapping("/SYSM431P")
	public String SYSM431P() {
        return "th/sysm/SYSM431P";
	}
	
	/**
	 * @Method Name     : SYSM431SEL01
	 * @작성일      	: 2023.03.06
	 * @작성자      	: sjyang
	 * @변경이력    	:
	 * @Method 설명 	: SMS 발송변수 찾기 팝업
	 * @param           : HttpServletRequest Restful param
	 * @return          : ModelAndView HashMap
	 */
	
	@PostMapping(value ="/SYSM431SEL01")
	@ResponseBody
	public ResponseEntity<String> SYSM431SEL01(@RequestBody String request, Locale locale) {

		HashMap<String, Object> resultMap = new HashMap<String, Object>();
		String resultStr = null;
		
    	try {
    		JSONParser parser1 = new JSONParser();
			JSONObject obj = (JSONObject) parser1.parse(request);
			
			SYSM431VO vo = new SYSM431VO();
			
			vo.setTenantId(String.valueOf(obj.get("tenantId")));
			vo.setVrbsClasCd(String.valueOf(obj.get("vrbsClasCd")));
			vo.setKeyword(String.valueOf(obj.get("keyword")));
			
			List<SYSM431VO> SYSM431SEL01List = SYSM431Service.SYSM431SEL01(vo);

			resultMap.put("SYSM431SEL01List"     , SYSM431SEL01List);
			resultMap.put("SYSM431SEL01ListCount", SYSM431SEL01List.size());

			resultStr = this.objectMapper.writeValueAsString(resultMap);
			
    	}catch(Exception e) {
    		LOGGER.error("["+e.getClass()+"] Exception : " + e.getMessage());
    	}
    	return ResponseEntity.ok().body(resultStr);
	}
}
