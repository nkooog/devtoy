package org.crm.frme.web;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;
import org.crm.frme.model.vo.FRME160VO;
import org.crm.frme.service.FRME160Service;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

/***********************************************************************************************
* Program Name : 환경설정 팝업 Controller
* Creator      : jrlee
* Create Date  : 2022.04.20
* Description  : 환경설정 팝업
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.04.20     jrlee            최초생성
************************************************************************************************/
@Slf4j
@Controller
@RequestMapping("/frme/*")
public class FRME160Controller {

	@Resource(name = "FRME160Service")
	private FRME160Service frme160Service;

	@Autowired
	private ObjectMapper objectMapper;

	@Autowired
	private MessageSource messageSource;

	/**
	 * @Method Name : FRME160P
	 * @작성일      : 2022.04.20
	 * @작성자      : jrlee
	 * @변경이력    :
	 * @Method 설명 : frme/FRME160P 페이지 열기
	 * @param       :
	 * @return      : frme/FRME160P.jsp
	 */
	@RequestMapping("/FRME160P")
	public String FRME160P(HttpSession session, ModelMap model) {
		log.debug("FRME160P 페이지 열기");
		return "th/frme/FRME160P";
	}

	/**
	 * @Method Name : FRME160SEL01
	 * @작성일      : 2022.04.15
	 * @작성자      : jrlee
	 * @변경이력    :
	 * @Method 설명 : 환경설정 조회
	 * @param       : ModelAndView
	 * @return      : ModelAndView HashMap
	 */
	@PostMapping(value = "/FRME160SEL01")
	@ResponseBody
	public Map<String, Object> FRME160SEL01(@RequestBody String request, HttpSession session, Locale locale) {
		HashMap<String, Object> resultMap = new HashMap<>();
		JSONParser parser = new JSONParser();
		try {
			JSONObject jsonStr = (JSONObject) parser.parse(request);
			FRME160VO usrEnvr = frme160Service.FRME160SEL01(this.objectMapper.convertValue(jsonStr, FRME160VO.class));
			session.setAttribute("usrEnvr", usrEnvr);

			resultMap.put("usrEnvr", this.objectMapper.writeValueAsString(usrEnvr));
			resultMap.put("msg", messageSource.getMessage("success.common.select", null, "success select", locale));
		} catch (Exception e) {
			log.error("["+e.getClass()+"] Exception : " + e.getMessage());
			resultMap.put("msg", messageSource.getMessage("fail.request.msg", null, "select fail", locale));
		}

		return resultMap;
	}

	/**
	 * @Method Name : FRME160UPT01
	 * @작성일      : 2022.04.21
	 * @작성자      : jrlee
	 * @변경이력    :
	 * @Method 설명 : 환경설정 수정
	 * @param       : ModelAndView
	 * @return      : ModelAndView HashMap
	 */
	@PostMapping(value = "/FRME160UPT01")
	@ResponseBody
	public Map<String, Object> FRME160UPT01(@RequestBody String request, HttpSession session, Locale locale) {
		HashMap<String, Object> resultMap = new HashMap<>();
		JSONParser parser = new JSONParser();
		try {
			JSONObject jsonStr = (JSONObject) parser.parse(request);
//			String jsonStr = new JsonUtil().readJsonBody(request);
			Integer result = frme160Service.FRME160UPT01(this.objectMapper.convertValue(jsonStr, FRME160VO.class));

			if (result > 0)
				resultMap.put("msg", messageSource.getMessage("success.common.update", null, "success update", locale));

		} catch (Exception e) {
			e.printStackTrace();
			log.error("[" + e.getClass() + "] Exception : " + e.getMessage());
			resultMap.put("msg", messageSource.getMessage("fail.request.msg", null, "select fail", locale));
		}

		return resultMap;
	}
}
