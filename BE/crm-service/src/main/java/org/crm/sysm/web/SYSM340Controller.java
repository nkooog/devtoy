package org.crm.sysm.web;

import org.crm.dash.VO.DASH110VO;
import org.crm.sysm.VO.SYSM340VO;
import org.crm.sysm.service.SYSM340Service;
import org.crm.util.json.JsonUtil;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.reflect.TypeToken;
import jakarta.annotation.Resource;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/***********************************************************************************************
* Program Name : 공통코드관리 Controller
* Creator      : jrlee
* Create Date  : 2022.05.02
* Description  : 공통코드관리
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.05.02     jrlee           최초생성
************************************************************************************************/
@Controller
@RequestMapping("/sysm/*")
public class SYSM340Controller {
	private static final Logger LOGGER = LoggerFactory.getLogger(SYSM340Controller.class);

	@Resource(name = "SYSM340Service")
	private SYSM340Service sysm340Service;

	private ObjectMapper objectMapper;

	@Autowired
	public SYSM340Controller(ObjectMapper objectMapper) {
		this.objectMapper = objectMapper;
	}

	/**
	 * @Method Name : SYSM340M
	 * @작성일      : 2022.05.02
	 * @작성자      : jrlee
	 * @변경이력    : 
	 * @Method 설명 : sysm/SYSM340M 웹 페이지 열기
	 * @param       :  
	 * @return      : sysm/SYSM340M.jsp
	 */
	@RequestMapping("/SYSM340M")
	public String SYSM340M() {
		return "th/sysm/SYSM340M";
	}

	/**
	 * @Method Name : SYSM340SEL01
	 * @작성일      : 2022.05.02
	 * @작성자      : jrlee
	 * @변경이력    :
	 * @Method 설명 : 관리항목 조회
	 * @param       : ModelAndView
	 * @return      : ModelAndView HashMap
	 */
	@PostMapping(value = "/SYSM340SEL01")
	@ResponseBody
	public Map<String, Object> SYSM340MSEL01(ModelAndView mav, @RequestBody String request) {
		HashMap<String, Object> resultMap = new HashMap<>();

		try {
			List<SYSM340VO> list = sysm340Service.SYSM340SEL01(this.objectMapper.readValue(request, SYSM340VO.class));

			resultMap.put("list", new ObjectMapper().writeValueAsString(list));
			resultMap.put("msg", "정상적으로 조회하였습니다.");

		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}

		return resultMap;
	}

	/**
	 * @Method Name : SYSM340SEL02
	 * @작성일      : 2022.05.02
	 * @작성자      : jrlee
	 * @변경이력    :
	 * @Method 설명 : 공통코드 조회
	 * @param       : ModelAndView
	 * @return      : ModelAndView HashMap
	 */
	@RequestMapping(value = "/SYSM340SEL02", method = RequestMethod.POST)
	@ResponseBody
	public Map<String, Object> SYSM340SEL02(ModelAndView mav, @RequestBody String request) {
		HashMap<String, Object> resultMap = new HashMap<>();

		try {
			List<SYSM340VO> list = sysm340Service.SYSM340SEL02(this.objectMapper.readValue(request, SYSM340VO.class));

			resultMap.put("list", new ObjectMapper().writeValueAsString(list));
			resultMap.put("msg", "정상적으로 조회하였습니다.");

		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}

		return resultMap;
	}

	/**
	 * @Method Name : SYSM340INS01
	 * @작성일      : 2022.05.04
	 * @작성자      : jrlee
	 * @변경이력    :
	 * @Method 설명 : 공통코드 추가
	 * @param       : ModelAndView
	 * @return : ModelAndView HashMap
	 */
	@RequestMapping(value = "/SYSM340INS01", method = RequestMethod.POST)
	@ResponseBody
	public Map<String, Object> SYSM340INS01(ModelAndView mav, @RequestBody String request) {
		HashMap<String, Object> resultMap = new HashMap<String, Object>();
		JSONParser parser = new JSONParser();
		try {
			JSONObject jsonObject = (JSONObject) parser.parse(request);
			JSONArray jsonArray = (JSONArray) jsonObject.get("list");

			Integer rtn = sysm340Service.SYSM340INS01(this.objectMapper.convertValue(jsonArray, new TypeReference<List<SYSM340VO>>() {}));
			if (rtn > 0) {
				resultMap.put("msg", "정상적으로 추가되었습니다.");
			}

			mav.addAllObjects(resultMap);
			mav.setStatus(HttpStatus.OK);
			mav.setViewName("jsonView");
		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}

		return resultMap;
	}

	/**
	 * @Method Name : SYSM340UPT01
	 * @작성일      : 2022.05.04
	 * @작성자      : jrlee
	 * @변경이력    :
	 * @Method 설명 : 공통코드 변경
	 * @param       :  ModelAndView
	 * @return      : ModelAndView HashMap
	 */
	@RequestMapping(value = "/SYSM340UPT01", method = RequestMethod.POST)
	@ResponseBody
	public Map<String, Object> SYSM340UPT01(ModelAndView mav, @RequestBody String request) {
		HashMap<String, Object> resultMap = new HashMap<String, Object>();
		JSONParser parser = new JSONParser();
		try {
			JSONObject jsonObject = (JSONObject) parser.parse(request);
			JSONArray jsonArray = (JSONArray) jsonObject.get("list");

			Integer rtn = sysm340Service.SYSM340UPT01(this.objectMapper.convertValue(jsonArray, new TypeReference<List<SYSM340VO>>() {}));
			if (rtn > 0) {
				resultMap.put("msg", "정상적으로 변경되었습니다.");
			}

		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}

		return resultMap;
	}

	/**
	 * @Method Name : SYSM340DEL01
	 * @작성일      : 2022.05.04
	 * @작성자      : jrlee
	 * @변경이력    :
	 * @Method 설명 : 공통코드 삭제
	 * @param       :  ModelAndView
	 * @return      : ModelAndView HashMap
	 */
	@RequestMapping(value = "/SYSM340DEL01", method = RequestMethod.POST)
	@ResponseBody
	public Map<String, Object> SYSM340DEL01(ModelAndView mav, @RequestBody String request) {
		HashMap<String, Object> resultMap = new HashMap<String, Object>();
		JSONParser parser = new JSONParser();
		try {
			JSONObject jsonObject = (JSONObject) parser.parse(request);
			JSONArray jsonArray = (JSONArray) jsonObject.get("list");

			Integer rtn = sysm340Service.SYSM340DEL01(this.objectMapper.convertValue(jsonArray, new TypeReference<List<SYSM340VO>>() {}));
			if (rtn > 0) {
				resultMap.put("msg", "정상적으로 삭제되었습니다.");
			}

		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}

		return resultMap;
	}

	/**
	 * @Method Name : SYSM340UPT02
	 * @작성일      : 2022.05.04
	 * @작성자      : jrlee
	 * @변경이력    :
	 * @Method 설명 : 공통코드 변경
	 * @param       :  ModelAndView
	 * @return      : ModelAndView HashMap
	 */
	@RequestMapping(value = "/SYSM340UPT02", method = RequestMethod.POST)
	@ResponseBody
	public Map<String, Object> SYSM340UPT02(ModelAndView mav, @RequestBody String request) {
		HashMap<String, Object> resultMap = new HashMap<String, Object>();
		JSONParser parser = new JSONParser();
		try {
			JSONObject jsonObject = (JSONObject) parser.parse(request);
			JSONArray jsonArray = (JSONArray) jsonObject.get("list");

			Integer rtn = sysm340Service.SYSM340UPT02(this.objectMapper.convertValue(jsonArray, new TypeReference<List<SYSM340VO>>() {}));
			if (rtn > 0) {
				resultMap.put("msg", "정상적으로 변경되었습니다.");
			}

		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}

		return resultMap;
	}

}




