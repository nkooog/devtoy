package org.crm.sysm.web;

import org.crm.sysm.VO.SYSM550VO;
import org.crm.sysm.service.SYSM550Service;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/***********************************************************************************************
* Program Name : 장애공지관리 Controller
* Creator      : shpark
* Create Date  : 2024.06.14
* Description  : 실시간운영메시지관리
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2024.06.14     shpark           최초생성
************************************************************************************************/
@Slf4j
@Controller
@RequestMapping("/sysm/*")
public class SYSM550Controller {


	@Resource(name = "SYSM550Service")
	private SYSM550Service SYSM550Service;

	@Autowired
	private ObjectMapper objectMapper;

	/**
	 * @Method Name : SYSM550M
	 * @작성일      : 2022.06.07
	 * @작성자      : shpark
	 * @변경이력    : 
	 * @Method 설명 : sysm/SYSM550M 웹 페이지 열기
	 * @param       :  
	 * @return      : sysm/SYSM550M.jsp
	 */
	@RequestMapping("/SYSM550M")
	public String SYSM550M() {
		log.debug("SYSM550M 페이지 열기");
		return "th/sysm/SYSM550M";
	}

	/**
	 * @Method Name : SYSM550SEL01
	 * @작성일      : 2022.06.07
	 * @작성자      : shpark
	 * @변경이력    :
	 * @Method 설명 : 실시간운영메시지 조회
	 * @param       : ModelAndView
	 * @return      : ModelAndView HashMap
	 */
	@PostMapping(value = "/SYSM550SEL01")
	@ResponseBody
	public Map<String, Object> SYSM550SEL01(@RequestBody String request) {
		HashMap<String, Object> resultMap = new HashMap<>();
		JSONParser parser = new JSONParser();
		try {
			JSONObject jsonObject = (JSONObject) parser.parse(request);
			List<SYSM550VO> list = SYSM550Service.SYSM550SEL01(this.objectMapper.convertValue(jsonObject, SYSM550VO.class));

			resultMap.put("list", new ObjectMapper().writeValueAsString(list));
			resultMap.put("msg", "정상적으로 조회하였습니다.");
		} catch (Exception e) {
			log.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}

		return resultMap;
	}


	/**
	 * @Method Name : SYSM550SEL02
	 * @작성일      : 2022.06.17
	 * @작성자      : shpark
	 * @변경이력    :
	 * @Method 설명 : 실시간운영메시지 조회
	 * @param       : ModelAndView
	 * @return      : ModelAndView HashMap
	 */
	@PostMapping(value = "/SYSM550SEL02")
	@ResponseBody
	public Map<String, Object> SYSM550SEL02(@RequestBody String request) {
		HashMap<String, Object> resultMap = new HashMap<>();
		JSONParser parser = new JSONParser();
		try {
			JSONObject jsonObject = (JSONObject) parser.parse(request);
			List<SYSM550VO> list = SYSM550Service.SYSM550SEL02(this.objectMapper.convertValue(jsonObject, SYSM550VO.class));

			resultMap.put("list", new ObjectMapper().writeValueAsString(list));
			resultMap.put("msg", "정상적으로 조회하였습니다.");

		} catch (Exception e) {
			e.printStackTrace();
			log.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}

		return resultMap;
	}


	/**
	 * @Method Name : SYSM550INS01
	 * @작성일      : 2022.06.14
	 * @작성자      : shpark
	 * @변경이력    :
	 * @Method 설명 : 실시간운영메시지 저장
	 * @param       : ModelAndView
	 * @return : ModelAndView HashMap
	 */
	@PostMapping(value = "/SYSM550INS01")
	@ResponseBody
	public Map<String, Object> SYSM550INS01(@RequestBody String request) {
		HashMap<String, Object> resultMap = new HashMap<>();
		JSONParser parser = new JSONParser();
		try {
			JSONObject jsonObject = (JSONObject) parser.parse(request);
			Integer rtn = SYSM550Service.SYSM550INS01(this.objectMapper.convertValue(jsonObject, SYSM550VO.class));

			if (rtn > 0) {
				resultMap.put("msg", "정상적으로 저장되었습니다.");
			}
		} catch (Exception e) {
			log.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}
		return resultMap;
	}

	/**
	 * @Method Name : SYSM550DEL01
	 * @작성일      : 2022.06.13
	 * @작성자      : shpark
	 * @변경이력    :
	 * @Method 설명 : 실시간운영메시지 삭제
	 * @param       : ModelAndView
	 * @return : ModelAndView HashMap
	 */
	@PostMapping(value = "/SYSM550DEL01")
	@ResponseBody
	public Map<String, Object> SYSM550DEL01(@RequestBody String request) {
		HashMap<String, Object> resultMap = new HashMap<>();
		JSONParser parser = new JSONParser();
		try {
			JSONObject jsonObject = (JSONObject) parser.parse(request);
			Integer rtn = SYSM550Service.SYSM550DEL01(this.objectMapper.convertValue(jsonObject, SYSM550VO.class));

			if (rtn > 0) {
				resultMap.put("msg", "정상적으로 삭제되었습니다.");
			}
		} catch (Exception e) {
			log.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}
		return resultMap;
	}
}
