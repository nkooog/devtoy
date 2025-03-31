package org.crm.sysm.web;

import org.crm.sysm.VO.SYSM250VO;
import org.crm.sysm.VO.SYSM260VO;
import org.crm.sysm.service.SYSM250Service;
import org.crm.sysm.service.SYSM260Service;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.Resource;
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
* Program Name : 그룹별 메뉴권한관리 Controller
* Creator      : jrlee
* Create Date  : 2022.03.30
* Description  : 그룹별 메뉴권한관리
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.03.30     jrlee           최초생성
************************************************************************************************/
@Controller
@RequestMapping("/sysm/*")
public class SYSM260Controller {
	private static final Logger LOGGER = LoggerFactory.getLogger(SYSM260Controller.class);

	@Resource(name = "SYSM250Service")
	private SYSM250Service sysm250Service;

	@Resource(name = "SYSM260Service")
	private SYSM260Service sysm260Service;

	private ObjectMapper objectMapper;

	@Autowired
	public SYSM260Controller(ObjectMapper objectMapper) {
		this.objectMapper = objectMapper;
	}

	/**
	 * @Method Name : SYSM260M
	 * @작성일      : 2022.03.30
	 * @작성자      : jrlee
	 * @변경이력    :
	 * @Method 설명 : sysm/SYSM260M 웹 페이지 열기
	 * @param       :
	 * @return      : sysm/SYSM260M.jsp
	 */
	@RequestMapping("/SYSM260M")
	public String SYSM260M() {
		return "th/sysm/SYSM260M";
	}

	/**
	 * @Method Name : SYSM260SEL01
	 * @작성일      : 2022.04.06
	 * @작성자      : jrlee
	 * @변경이력    :
	 * @Method 설명 : restful 등급별 메뉴 조회
	 * @param       : ModelAndView
	 * @return      : ModelAndView HashMap
	 */
	@PostMapping(value = "/SYSM260SEL01")
	@ResponseBody
	public Map<String, Object> SYSM260SEL01(ModelAndView mav, @RequestBody String request) {
		HashMap<String, Object> resultMap = new HashMap<>();

		try {
			List<SYSM260VO> list = sysm260Service.SYSM260SEL01(this.objectMapper.readValue(request, SYSM260VO.class));
			List<SYSM250VO> totalList = sysm250Service.SYSM250SEL01(this.objectMapper.readValue(request, SYSM250VO.class));

			resultMap.put("list", new ObjectMapper().writeValueAsString(list));
			resultMap.put("totalList", new ObjectMapper().writeValueAsString(totalList));
			resultMap.put("msg", "정상적으로 조회하였습니다.");

		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}

		return resultMap;
	}

	/**
	 * @Method Name : SYSM260SEL02
	 * @작성일      : 2022.04.12
	 * @작성자      : jrlee
	 * @변경이력    :
	 * @Method 설명 : restful 데이터프레임 버튼 조회
	 * @param       : ModelAndView
	 * @return      : ModelAndView HashMap
	 */
	@RequestMapping(value = "/SYSM260SEL02", method = RequestMethod.POST)
	@ResponseBody
	public Map<String, Object> SYSM260SEL02(ModelAndView mav, @RequestBody String request) {
		HashMap<String, Object> resultMap = new HashMap<>();

		try {
			List<SYSM260VO> list = sysm260Service.SYSM260SEL02(this.objectMapper.readValue(request, SYSM260VO.class));

			resultMap.put("list", new ObjectMapper().writeValueAsString(list));
			resultMap.put("msg", "정상적으로 조회하였습니다.");

		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}

		return resultMap;
	}

	/**
	 * @Method Name : SYSM260INS01
	 * @작성일      : 2022.04.07
	 * @작성자      : jrlee
	 * @변경이력    :
	 * @Method 설명 : restful 메뉴 추가
	 * @param       : ModelAndView
	 * @return : ModelAndView HashMap
	 */
	@RequestMapping(value = "/SYSM260INS01", method = RequestMethod.POST)
	@ResponseBody
	public Map<String, Object> SYSM260INS01(ModelAndView mav, @RequestBody String request) {
		HashMap<String, Object> resultMap = new HashMap<>();
		JSONParser parser = new JSONParser();
		try {
			JSONObject jsonObject = (JSONObject) parser.parse(request);
			JSONArray jsonArray = (JSONArray) jsonObject.get("list");

			sysm260Service.SYSM260DEL01(this.objectMapper.readValue(request, SYSM260VO.class));
			Integer rtn = sysm260Service.SYSM260INS01(this.objectMapper.convertValue(jsonArray, new TypeReference<List<SYSM260VO>>() {}));
			if (rtn > 0) {
				resultMap.put("msg", "정상적으로 저장되었습니다.");
			}

		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}
		return resultMap;
	}

	/**
	 * @Method Name : SYSM260DEL02
	 * @작성일      : 2022.04.07
	 * @작성자      : jrlee
	 * @변경이력    :
	 * @Method 설명 : restful 메뉴 삭제
	 * @param       : ModelAndView
	 * @return : ModelAndView HashMap
	 */
	@RequestMapping(value = "/SYSM260DEL02", method = RequestMethod.POST)
	@ResponseBody
	public Map<String, Object> SYSM260DEL02(ModelAndView mav, @RequestBody String request) {
		HashMap<String, Object> resultMap = new HashMap<>();
		JSONParser parser = new JSONParser();
		try {
			JSONObject jsonObject = (JSONObject) parser.parse(request);
			JSONArray jsonArray = (JSONArray) jsonObject.get("list");

			Integer rtn = sysm260Service.SYSM260DEL02(this.objectMapper.convertValue(jsonArray, new TypeReference<List<SYSM260VO>>() {}));
			if (rtn > 0) {
				resultMap.put("msg", "정상적으로 삭제되었습니다.");
			}

		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}
		return resultMap;
	}
}
