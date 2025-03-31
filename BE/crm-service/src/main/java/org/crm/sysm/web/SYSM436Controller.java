package org.crm.sysm.web;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;

import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;

import org.json.simple.JSONArray;
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
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.reflect.TypeToken;

import org.crm.sysm.VO.SYSM436VO;
import org.crm.sysm.service.SYSM436Service;
import org.crm.util.json.JsonUtil;
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
public class SYSM436Controller {
	private static final Logger LOGGER = LoggerFactory.getLogger(SYSM436Controller.class);


	@Resource(name = "SYSM436Service")
	private SYSM436Service SYSM436Service;

	@Autowired
	private ObjectMapper objectMapper;
	
	/**
	 * @Method Name : SYSM436M
	 * @작성일      	: 2023.03.02
	 * @작성자      	: wkim
	 * @변경이력    	: 
	 * @Method 설명 	: sysm/SYSM436M 웹 페이지 열기
	 * @param       :  
	 * @return      : sysm/SYSM436M.jsp
	 */
	@GetMapping("/SYSM436M")
	public String SYSM436M() {
        return "th/sysm/SYSM436M";
	}

	/**
	 * @Method Name : SYSM436SEL01
	 * @작성일      	: 2023.03.02
	 * @작성자      	: wkim
	 * @변경이력   	:
	 * @Method 설명 	: 데이터프레임 조회
	 * @param       : ModelAndView
	 * @return      : ModelAndView HashMap
	 */
	
	@PostMapping(value ="/SYSM436SEL01")
	@ResponseBody
	public ResponseEntity<String> SYSM436SEL01(@RequestBody String request, Locale locale) {
		
		HashMap<String, Object> resultMap = new HashMap<>();
		String resultStr = null;
		
		try {
			JSONParser parser1 = new JSONParser();
			JSONObject obj = (JSONObject) parser1.parse(request);
			
			List<SYSM436VO> list = SYSM436Service.SYSM436SEL01(this.objectMapper.convertValue(obj, SYSM436VO.class));

			resultMap.put("list", new ObjectMapper().writeValueAsString(list));
			resultMap.put("msg", "정상적으로 조회하였습니다.");

			resultStr = this.objectMapper.writeValueAsString(resultMap);
			
		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}

		return ResponseEntity.ok().body(resultStr);
	}
	
	/**
	 * @Method Name : SYSM436SEL02
	 * @작성일      	: 2023.03.02
	 * @작성자      	: wkim
	 * @변경이력   	:
	 * @Method 설명 	: 변수코드 중복 조회
	 * @param       : ModelAndView
	 * @return      : ModelAndView HashMap
	 */
	
	@PostMapping(value ="/SYSM436SEL02")
	@ResponseBody
	public ResponseEntity<String> SYSM436SEL02(@RequestBody String request, Locale locale) {
		
		HashMap<String, Object> resultMap = new HashMap<>();
		String resultStr = null;
		
		try {
			JSONParser parser1 = new JSONParser();
			JSONObject obj = (JSONObject) parser1.parse(request);
			
			List<SYSM436VO> list = SYSM436Service.SYSM436SEL02(this.objectMapper.convertValue(obj, SYSM436VO.class));

			resultMap.put("list", new ObjectMapper().writeValueAsString(list));
			resultMap.put("msg", "정상적으로 조회하였습니다.");

			resultStr = this.objectMapper.writeValueAsString(resultMap);
			
		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}
		return ResponseEntity.ok().body(resultStr);
	}
	
	/**
	 * @Method Name : SYSM436INS01
	 * @작성일      	: 2023.03.02
	 * @작성자      	: wkim
	 * @변경이력   	:
	 * @Method 설명 	: 데이터프레임 추가
	 * @param       : ModelAndView
	 * @return      : ModelAndView HashMap
	 */
	@PostMapping(value ="/SYSM436INS01")
	@ResponseBody
	public ResponseEntity<String> SYSM436INS01(@RequestBody String request, Locale locale) {
		HashMap<String, Object> resultMap = new HashMap<>();
		String resultStr = null;

		try {
			JSONParser parser1 = new JSONParser();
			JSONObject obj = (JSONObject) parser1.parse(request);
			
			JSONArray listArray = (JSONArray) obj.get("list");
			
			// VO를 List로 변환
			List<SYSM436VO> list = new ArrayList<SYSM436VO>();
	        for (Object item : listArray) {
	            SYSM436VO vo = this.objectMapper.convertValue(item, SYSM436VO.class);
	            list.add(vo);
	        }

			Integer rtn = SYSM436Service.SYSM436INS01(list);
			if (rtn > 0) {
				resultMap.put("msg", "정상적으로 저장되었습니다.");
			}

			resultStr = this.objectMapper.writeValueAsString(resultMap);
			
		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}

		return ResponseEntity.ok().body(resultStr);
	}

	/**
	 * @Method Name : SYSM436UPT01
	 * @작성일      	: 2023.03.02
	 * @작성자      	: wkim
	 * @변경이력   	:
	 * @Method 설명 	: 데이터 프레임 수정
	 * @param       : ModelAndView
	 * @return      : ModelAndView HashMap
	 */
	@PostMapping(value ="/SYSM436UPT01")
	@ResponseBody
	public ResponseEntity<String> SYSM436UPT01(@RequestBody String request, Locale locale) {
		HashMap<String, Object> resultMap = new HashMap<>();
		String resultStr = null;

		try {
			JSONParser parser1 = new JSONParser();
			JSONObject obj = (JSONObject) parser1.parse(request);
			
			JSONArray listArray = (JSONArray) obj.get("list");
			
			// VO를 List로 변환
			List<SYSM436VO> list = new ArrayList<SYSM436VO>();
	        for (Object item : listArray) {
	            SYSM436VO vo = this.objectMapper.convertValue(item, SYSM436VO.class);
	            list.add(vo);
	        }
			
			Integer rtn = SYSM436Service.SYSM436UPT01(list);
			
			if (rtn >= 0) {
				resultMap.put("msg", "정상적으로 저장되었습니다.");
			}

			resultStr = this.objectMapper.writeValueAsString(resultMap);
			
		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}

		return ResponseEntity.ok().body(resultStr);
	}
	
	/**
	 * @Method Name : SYSM436UPT02
	 * @작성일      	: 2023.03.02
	 * @작성자      	: wkim
	 * @변경이력   	:
	 * @Method 설명 	: 변수코드 폐기
	 * @param       : ModelAndView
	 * @return      : ModelAndView HashMap
	 */
	@PostMapping(value ="/SYSM436UPT02")
	@ResponseBody
	public ResponseEntity<String> SYSM436UPT02(@RequestBody String request, Locale locale) {

		HashMap<String, Object> resultMap = new HashMap<>();
		String resultStr = null;

		try {
			JSONParser parser1 = new JSONParser();
			JSONObject obj = (JSONObject) parser1.parse(request);
			
			JSONArray listArray = (JSONArray) obj.get("list");
			
			// VO를 List로 변환
			List<SYSM436VO> list = new ArrayList<SYSM436VO>();
	        for (Object item : listArray) {
	            SYSM436VO vo = this.objectMapper.convertValue(item, SYSM436VO.class);
	            list.add(vo);
	        }
	        
			Integer rtn = SYSM436Service.SYSM436UPT02(list);
			
			if (rtn >= 0) {
				resultMap.put("msg", "정상적으로 폐기되었습니다.");
			}

			resultStr = this.objectMapper.writeValueAsString(resultMap);
			
		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}

		return ResponseEntity.ok().body(resultStr);
	}

	/**
	 * @Method Name : SYSM436DEL01
	 * @작성일      	: 2023.03.02
	 * @작성자      	: wkim
	 * @변경이력   	:
	 * @Method 설명 	: 데이터프레임 항목 삭제
	 * @param       : ModelAndView
	 * @return      : ModelAndView HashMap
	 */
	
	@PostMapping(value ="/SYSM436DEL01")
	@ResponseBody
	public ResponseEntity<String> SYSM436DEL01(@RequestBody String request, Locale locale) {

		HashMap<String, Object> resultMap = new HashMap<>();
		String resultStr = null;

		try {
			JSONParser parser1 = new JSONParser();
			JSONObject obj = (JSONObject) parser1.parse(request);
			
			JSONArray listArray = (JSONArray) obj.get("list");
			
			// VO를 List로 변환
			List<SYSM436VO> list = new ArrayList<SYSM436VO>();
	        for (Object item : listArray) {
	            SYSM436VO vo = this.objectMapper.convertValue(item, SYSM436VO.class);
	            list.add(vo);
	        }

			Integer rtn = SYSM436Service.SYSM436DEL01(list);
			if (rtn > 0) {
				resultMap.put("msg", "정상적으로 삭제되었습니다.");
			}

			resultStr = this.objectMapper.writeValueAsString(resultMap);
			
		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}

		return ResponseEntity.ok().body(resultStr);
	}

}
