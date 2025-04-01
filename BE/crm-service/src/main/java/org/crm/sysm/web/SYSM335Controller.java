package org.crm.sysm.web;

import org.crm.sysm.VO.SYSM335VO;
import org.crm.sysm.service.SYSM335Service;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/***********************************************************************************************
* Program Name : 공통코드찾기 팝업 Controller
* Creator      : jrlee
* Create Date  : 2022.04.25
* Description  : 공통코드찾기 팝업
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.04.25     jrlee           최초생성
************************************************************************************************/
@Slf4j
@Controller
@RequestMapping("/sysm/*")
public class SYSM335Controller {
	private static final Logger LOGGER = LoggerFactory.getLogger(SYSM335Controller.class);

	@Resource(name = "SYSM335Service")
	private SYSM335Service sysm335Service;

	@Autowired
	private ObjectMapper objectMapper;

	/**
	 * @Method Name : SYSM335P
	 * @작성일      : 2022.04.25
	 * @작성자      : jrlee
	 * @변경이력    : 
	 * @Method 설명 : sysm/SYSM335P 웹 페이지 열기
	 * @param       :  
	 * @return      : sysm/SYSM335P.jsp
	 */
	@RequestMapping("/SYSM335P")
	public String SYSM335P() {
		return "th/sysm/SYSM335P";
	}

	/**
	 * @Method Name : SYSM335SEL01
	 * @작성일      : 2022.04.25
	 * @작성자      : jrlee
	 * @변경이력    :
	 * @Method 설명 : 공통코드 조회
	 * @param       : ModelAndView
	 * @return      : ModelAndView HashMap
	 */
	@RequestMapping(value = "/SYSM335SEL01", method = RequestMethod.POST)
	@ResponseBody
	public Map<String, Object> SYSM335SEL01(ModelAndView mav, @RequestBody String request) {
		HashMap<String, Object> resultMap = new HashMap<>();

		try {
			List<SYSM335VO> list = sysm335Service.SYSM335SEL01(this.objectMapper.readValue(request, SYSM335VO.class));

			resultMap.put("list", new ObjectMapper().writeValueAsString(list));
			resultMap.put("msg", "정상적으로 조회하였습니다.");

		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}

		return resultMap;
	}
}
