package org.crm.sysm.web;

import org.crm.sysm.VO.SYSM520VO;
import org.crm.sysm.service.SYSM520Service;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
public class SYSM520Controller {
	private static final Logger LOGGER = LoggerFactory.getLogger(SYSM520Controller.class);

	@Resource(name = "SYSM520Service")
	private SYSM520Service SYSM520Service;

	private ObjectMapper objectMapper;

	@Autowired
	public SYSM520Controller(ObjectMapper objectMapper) {
		this.objectMapper = objectMapper;
	}

	/**
	 * @Method Name : SYSM520M
	 * @작성일      : 2022.06.07
	 * @작성자      : jrlee
	 * @변경이력    : 
	 * @Method 설명 : sysm/SYSM520M 웹 페이지 열기
	 * @param       :  
	 * @return      : sysm/SYSM520M.jsp
	 */
	@RequestMapping("/SYSM520M")
	public String SYSM520M() {
		log.debug("SYSM520M");
		return "th/sysm/SYSM520M";
	}

	/**
	 * @Method Name : SYSM520SEL01
	 * @작성일      : 2022.06.07
	 * @작성자      : jrlee
	 * @변경이력    :
	 * @Method 설명 : 데이터프레임 조회
	 * @param       : ModelAndView
	 * @return      : ModelAndView HashMap
	 */
	@PostMapping(value = "/SYSM520SEL01")
	@ResponseBody
	public Map<String, Object> SYSM520SEL01(ModelAndView mav, @RequestBody String request) {
		HashMap<String, Object> resultMap = new HashMap<>();

		try {
			List<SYSM520VO> list = SYSM520Service.SYSM520SEL01(this.objectMapper.readValue(request, SYSM520VO.class));

			resultMap.put("list", new ObjectMapper().writeValueAsString(list));
			resultMap.put("msg", "정상적으로 조회하였습니다.");

		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}

		return resultMap;
	}
	
	/**
	 * @Method Name : SYSM520SEL02
	 * @작성일      : 2022.03.23
	 * @작성자      : jrlee
	 * @변경이력    :
	 * @Method 설명 : restful MenuId 체크
	 * @param       :  ModelAndView
	 * @return      : ModelAndView HashMap
	 */
	@RequestMapping(value = "/SYSM520SEL02", method = RequestMethod.POST)
	@ResponseBody
	public Map<String, Object> SYSM520SEL02(ModelAndView mav, @RequestBody String request) {
		HashMap<String, Object> resultMap = new HashMap<>();

		try {
			List<SYSM520VO> list = SYSM520Service.SYSM520SEL02(this.objectMapper.readValue(request, SYSM520VO.class));

			resultMap.put("list", new ObjectMapper().writeValueAsString(list));
			resultMap.put("msg", "정상적으로 조회하였습니다.");

		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}
		return resultMap;
	}
	
	/**
	 * @Method Name : SYSM520SEL02
	 * @작성일      : 2022.03.23
	 * @작성자      : jrlee
	 * @변경이력    :
	 * @Method 설명 : restful MenuId 체크
	 * @param       :  ModelAndView
	 * @return      : ModelAndView HashMap
	 */
	@RequestMapping(value = "/SYSM520SEL03", method = RequestMethod.POST)
	@ResponseBody
	public Map<String, Object> SYSM520SEL03(ModelAndView mav, @RequestBody String request) {
		HashMap<String, Object> resultMap = new HashMap<>();

		try {
			List<SYSM520VO> list = SYSM520Service.SYSM520SEL03(this.objectMapper.readValue(request, SYSM520VO.class));

			resultMap.put("list", new ObjectMapper().writeValueAsString(list));
			resultMap.put("msg", "정상적으로 조회하였습니다.");

		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}
		mav.setViewName("jsonView");
		return resultMap;
	}

	/**
	 * @Method Name : SYSM520INS01
	 * @작성일      : 2022.07.11
	 * @작성자      : jrlee
	 * @변경이력    :
	 * @Method 설명 : 데이터프레임 추가
	 * @param       : ModelAndView
	 * @return : ModelAndView HashMap
	 */
	@RequestMapping(value = "/SYSM520INS01", method = RequestMethod.POST)
	@ResponseBody
	public Map<String, Object> SYSM520INS01(ModelAndView mav, @RequestBody String request) {
		HashMap<String, Object> resultMap = new HashMap<>();
		JSONParser parser = new JSONParser();

		try {

			JSONObject jsonObject = (JSONObject) parser.parse(request);
			JSONArray jsonArray = (JSONArray) jsonObject.get("list");

			Integer rtn = SYSM520Service.SYSM520INS01(this.objectMapper.convertValue(jsonArray, new TypeReference<List<SYSM520VO>>() {}));
			if (rtn > 0) {
				resultMap.put("msg", "정상적으로 저장되었습니다.");
			}
		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}

		return resultMap;
	}

	/**
	 * @Method Name : SYSM520UPT01
	 * @작성일      : 2022.07.11
	 * @작성자      : jrlee
	 * @변경이력    :
	 * @Method 설명 : 데이터프레임 수정
	 * @param       : ModelAndView
	 * @return : ModelAndView HashMap
	 */
	@RequestMapping(value = "/SYSM520UPT01", method = RequestMethod.POST)
	@ResponseBody
	public Map<String, Object> SYSM520UPT01(ModelAndView mav, @RequestBody String request) {
		HashMap<String, Object> resultMap = new HashMap<>();
		JSONParser parser = new JSONParser();

		try {
			JSONObject jsonObject = (JSONObject) parser.parse(request);
			JSONArray jsonArray = (JSONArray) jsonObject.get("list");

			Integer rtn = SYSM520Service.SYSM520UPT01(this.objectMapper.convertValue(jsonArray, new TypeReference<List<SYSM520VO>>() {}));
			
			if (rtn >= 0) {
				resultMap.put("msg", "정상적으로 저장되었습니다.");
			}
		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}

		return resultMap;
	}

	/**
	 * @Method Name : SYSM520DEL01
	 * @작성일      : 2022.07.11
	 * @작성자      : jrlee
	 * @변경이력    :
	 * @Method 설명 : 데이터프레임 삭제
	 * @param       : ModelAndView
	 * @return : ModelAndView HashMap
	 */
	@RequestMapping(value = "/SYSM520DEL01", method = RequestMethod.POST)
	@ResponseBody
	public Map<String, Object> SYSM520DEL01(ModelAndView mav, @RequestBody String request) {
		HashMap<String, Object> resultMap = new HashMap<>();
		JSONParser parser = new JSONParser();

		try {

			JSONObject jsonObject = (JSONObject) parser.parse(request);
			JSONArray jsonArray = (JSONArray) jsonObject.get("list");

			Integer rtn = SYSM520Service.SYSM520DEL01(this.objectMapper.convertValue(jsonArray, new TypeReference<List<SYSM520VO>>() {}));
			if (rtn > 0) {
				resultMap.put("msg", "정상적으로 삭제되었습니다.");
			}

		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}
		return resultMap;
	}

}
