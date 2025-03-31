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
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fasterxml.jackson.databind.ObjectMapper;

import org.crm.sysm.VO.SYSM437VO;
import org.crm.sysm.service.SYSM437Service;
import lombok.extern.slf4j.Slf4j;

/***********************************************************************************************
* Program Name : 상담그룹코드 관리 Controller
* Creator      : wkim
* Create Date  : 2023.02.13
* Description  : 상담그룹코드 관리
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2023.02.13     wkim             최초생성
************************************************************************************************/
@Slf4j
@Controller
@RequestMapping("/sysm/*")
public class SYSM437Controller {
	private static final Logger LOGGER = LoggerFactory.getLogger(SYSM437Controller.class);

	@Resource(name = "SYSM437Service")
	private SYSM437Service SYSM437Service;

	@Autowired
	private ObjectMapper objectMapper;
	
	/**
	 * @Method Name : SYSM437M
	 * @작성일      	: 2023.03.02
	 * @작성자      	: wkim
	 * @변경이력    	: 
	 * @Method 설명 	: sysm/SYSM437M 웹 페이지 열기
	 * @param       :  
	 * @return      : sysm/SYSM437M.jsp
	 */
	@GetMapping("/SYSM437M")
	public String SYSM437M() {
        return "th/sysm/SYSM437M";
	}

	/**
	 * @Method Name : SYSM437SEL01
	 * @작성일      	: 2023.03.23
	 * @작성자      	: wkim
	 * @변경이력   	:
	 * @Method 설명 	: 템플릿 조회(콤보박스)
	 * @param       : ModelAndView
	 * @return      : ModelAndView HashMap
	 */
	@PostMapping(value ="/SYSM437SEL01")
	@ResponseBody
	public ResponseEntity<String> SYSM437SEL01(@RequestBody String request, Locale locale) {
		
		HashMap<String, Object> resultMap = new HashMap<>();
		String resultStr = null;

		try {
			
			JSONParser parser1 = new JSONParser();
			JSONObject obj = (JSONObject) parser1.parse(request);
			
			List<SYSM437VO> list = SYSM437Service.SYSM437SEL01(this.objectMapper.convertValue(obj, SYSM437VO.class));

			resultMap.put("list", list);
			resultMap.put("msg", "정상적으로 조회하였습니다.");

			resultStr = this.objectMapper.writeValueAsString(resultMap);
			
		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}

		return ResponseEntity.ok().body(resultStr);
	}
	
	/**
	 * @Method Name : SYSM437SEL02
	 * @작성일      	: 2023.03.02
	 * @작성자      	: wkim
	 * @변경이력   	:
	 * @Method 설명 	: SMS 발송이력 조회
	 * @param       : ModelAndView
	 * @return      : ModelAndView HashMap
	 */
	
	@PostMapping(value ="/SYSM437SEL02")
	@ResponseBody
	public ResponseEntity<String> SYSM437SEL02(@RequestBody String request, Locale locale) {
		HashMap<String, Object> resultMap = new HashMap<>();
		String resultStr = null;
		
		try {
			
			JSONParser parser1 = new JSONParser();
			JSONObject obj = (JSONObject) parser1.parse(request);
			
			List<SYSM437VO> list = SYSM437Service.SYSM437SEL02(this.objectMapper.convertValue(obj, SYSM437VO.class));

			resultMap.put("list", new ObjectMapper().writeValueAsString(list));
			resultMap.put("msg", "정상적으로 조회하였습니다.");

			resultStr = this.objectMapper.writeValueAsString(resultMap);
		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}
		return ResponseEntity.ok().body(resultStr);
	}
}
