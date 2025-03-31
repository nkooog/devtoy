package org.crm.frme.web;

import org.crm.frme.VO.FRME100VO;
import org.crm.frme.service.FRME100Service;
import org.crm.sysm.VO.SYSM310VO;
import org.crm.sysm.VO.SYSM500VO;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

/***********************************************************************************************
* Program Name : 프레임 Main Controller
* Creator      : jrlee
* Create Date  : 2022.02.10
* Description  : 프레임 Main
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.02.10     jrlee            최초생성
************************************************************************************************/
@Slf4j
@Controller
@RequestMapping("/frme/*")
public class FRME100Controller {

	private static final Logger LOGGER = LoggerFactory.getLogger(FRME100Controller.class);

	@Resource(name = "FRME100Service")
	private FRME100Service frme100Service;

	@Autowired
	private ObjectMapper objectMapper;

	@Autowired
	private MessageSource messageSource;

	/**
	 * @Method Name : FRME100M
	 * @작성일      : 2022.02.10
	 * @작성자      : jrlee
	 * @변경이력    :
	 * @Method 설명 : frme/FRME100M 웹 페이지 열기
	 * @param       :
	 * @return      : frme/FRME100M.jsp
	 */
	@RequestMapping("/FRME100M")
	public ModelAndView FRME100M() {
		LOGGER.info("FRME100M 페이지 열기");
		return new ModelAndView("frme/FRME100M");
	}

	/**
	 * @Method Name : sessionCheck
	 * @작성일      : 2022.02.14
	 * @작성자      : jrlee
	 * @변경이력    :
	 * @Method 설명 : 프레임 세션 체크
	 * @param       : ModelAndView
	 * @return      : ModelAndView HashMap
	 */
	@PostMapping(value ="/sessionCheck")
	public @ResponseBody Map<String, Object> sessionCheck(ModelAndView mav, HttpServletRequest request, HttpSession session) {
		HashMap<String, Object> resultMap = new HashMap<>();

		try {
			if (session.getAttribute("user") == null || !request.isRequestedSessionIdValid()) {
				resultMap.put("result", 0);
			} else {
				resultMap.put("result", 1);
				resultMap.put("user", session.getAttribute("user"));
			}
		} catch (Exception e) {
			log.error("["+e.getClass()+"] Exception : " + e.getMessage());
		}

		return resultMap;
	}

	/**
	 * @Method Name : FRME100SEL01
	 * @작성일      : 2022.02.14
	 * @작성자      : jrlee
	 * @변경이력    :
	 * @Method 설명 : 메뉴 전체조회
	 * @param       : ModelAndView
	 * @return      : ModelAndView HashMap
	 */
	@PostMapping(value ="/FRME100SEL01")
	@ResponseBody
	public HashMap<String, Object> FRME100SEL01(@RequestBody String request, HttpSession session, Locale locale) {
		LOGGER.info("=== 메뉴 조회 ===");
		HashMap<String, Object> resultMap = new HashMap<>();

		try {
			JSONParser parser = new JSONParser();
			JSONObject jsonObj = (JSONObject) parser.parse(request);

			resultMap.put("list", this.objectMapper.writeValueAsString(frme100Service.FRME100SEL01(this.objectMapper.convertValue(jsonObj, FRME100VO.class))));
			resultMap.put("msg", messageSource.getMessage("success.common.select", null, "success select", locale));

		} catch (Exception e) {
			LOGGER.error("["+e.getClass()+"] Exception : " + e.getMessage());
			resultMap.put("msg", messageSource.getMessage("fail.request.msg", null, "select fail", locale));
		}

		return resultMap;
	}

	/**
	 * @Method Name : FRME100SEL02
	 * @작성일      : 2022.06.09
	 * @작성자      : jrlee
	 * @변경이력    :
	 * @Method 설명 : 알림 메시지 조회
	 * @param       : ModelAndView
	 * @return      : ModelAndView HashMap
	 */
	@PostMapping(value ="/FRME100SEL02")
	@ResponseBody
	public HashMap<String, Object> FRME100SEL02(@RequestBody String request, Locale locale) {
		HashMap<String, Object> resultMap = new HashMap<>();

		try {
			JSONParser parser = new JSONParser();
			JSONObject jsonObject = (JSONObject) parser.parse(request);
			resultMap.put("list", this.objectMapper.writeValueAsString(frme100Service.FRME100SEL02(this.objectMapper.convertValue(jsonObject, SYSM500VO.class))));
			resultMap.put("msg", messageSource.getMessage("success.common.select", null, "success select", locale));
		} catch (Exception e) {
			resultMap.put("msg", messageSource.getMessage("fail.request.msg", null, "select fail", locale));
			LOGGER.error("["+e.getClass()+"] Exception : " + e.getMessage());
		}

		return resultMap;
	}

	/**
	 * @Method Name : FRME100SEL03
	 * @작성일      : 2022.06.09
	 * @작성자      : jrlee
	 * @변경이력    :
	 * @Method 설명 : 등급별버튼권한 조회
	 * @param       : ModelAndView
	 * @return      : ModelAndView HashMap
	 */
	@PostMapping(value ="/FRME100SEL03")
	@ResponseBody
	public Map<String, Object> FRME100SEL03(@RequestBody String request, Locale locale) {
		HashMap<String, Object> resultMap = new HashMap<>();
		JSONParser parser = new JSONParser();

		try {
			JSONObject jsonObject = (JSONObject) parser.parse(request);
			resultMap.put("list", new ObjectMapper().writeValueAsString(frme100Service.FRME100SEL03(this.objectMapper.convertValue(jsonObject, SYSM310VO.class))));
			resultMap.put("msg", messageSource.getMessage("success.common.select", null, "success select", locale));
		} catch (Exception e) {
			LOGGER.error("["+e.getClass()+"] Exception : " + e.getMessage());
			resultMap.put("msg", messageSource.getMessage("fail.request.msg", null, "select fail", locale));
		}

		return resultMap;
	}
}
