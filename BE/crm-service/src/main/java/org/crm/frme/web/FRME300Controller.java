package org.crm.frme.web;

import org.crm.frme.VO.FRME300VO;
import org.crm.frme.service.FRME300Service;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
* Program Name : 부가서비스 팝업 Controller
* Creator      : jrlee
* Create Date  : 2022.08.09
* Description  : 부가서비스 팝업
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.08.09     jrlee            최초생성
************************************************************************************************/
@Slf4j
@Controller
@RequestMapping("/frme/*")
public class FRME300Controller {

	private static final Logger LOGGER = LoggerFactory.getLogger(FRME300Controller.class);

	@Resource(name = "FRME300Service")
	private FRME300Service frme300Service;

	@Autowired
	private ObjectMapper objectMapper;

	/**
	 * @Method Name : FRME300P
	 * @작성일      : 2022.08.09
	 * @작성자      : jrlee
	 * @변경이력    :
	 * @Method 설명 : frme/FRME300P 페이지 열기
	 * @param       :
	 * @return      : frme/FRME300P.jsp
	 */
	@PostMapping("/FRME300P")
	public String FRME300P() {
		return "th/frme/FRME300P";
	}

	/**
	 * @Method Name : FRME300SEL01
	 * @작성일      : 2022.05.10
	 * @작성자      : jrlee
	 * @변경이력    :
	 * @Method 설명 : 부가서비스 리스트 조회
	 * @param       : ModelAndView
	 * @return      : ModelAndView HashMap
	 */
	@PostMapping(value = "/FRME300SEL01")
	@ResponseBody
	public Map<String, Object> FRME300SEL01(@RequestBody String request) {
		HashMap<String, Object> resultMap = new HashMap<>();
		JSONParser parser = new JSONParser();
		try {
			JSONObject jsonObject = (JSONObject) parser.parse(request);
			List<FRME300VO> list = frme300Service.FRME300SEL01(this.objectMapper.convertValue(jsonObject, FRME300VO.class));

			resultMap.put("list", this.objectMapper.writeValueAsString(list));
			resultMap.put("msg", "정상적으로 조회하였습니다.");

		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}

		return resultMap;
	}
}
