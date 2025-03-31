package org.crm.sysm.web;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.crm.sysm.VO.SYSM241VO;
import org.crm.sysm.service.SYSM241Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/***********************************************************************************************
* Program Name : 관리항목찾기 팝업 Controller
* Creator      : jrlee
* Create Date  : 2022.04.28
* Description  : 관리항목찾기 팝업
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.04.28     jrlee           최초생성
************************************************************************************************/
@Slf4j
@Controller
@RequestMapping("/sysm/*")
public class SYSM241Controller {

	@Resource(name = "SYSM241Service")
	private SYSM241Service sysm241Service;

	private ObjectMapper objectMapper;

	@Autowired
	public SYSM241Controller(ObjectMapper objectMapper) {
		this.objectMapper = objectMapper;
	}

	/**
	 * @Method Name : SYSM241P
	 * @작성일      : 2022.04.28
	 * @작성자      : jrlee
	 * @변경이력    : 
	 * @Method 설명 : sysm/SYSM241P 웹 페이지 열기
	 * @param       :  
	 * @return      : sysm/SYSM241P.jsp
	 */
	@RequestMapping("/SYSM241P")
	public String SYSM241P() {
		return "th/sysm/SYSM241P";
	}

	/**
	 * @Method Name : SYSM241SEL01
	 * @작성일      : 2022.04.28
	 * @작성자      : jrlee
	 * @변경이력    :
	 * @Method 설명 : 관리항목 조회
	 * @param       : ModelAndView
	 * @return      : ModelAndView HashMap
	 */
	@PostMapping(value = "/SYSM241SEL01")
	@ResponseBody
	public Map<String, Object> SYSM241SEL01(ModelAndView mav, @RequestBody String request) {
		HashMap<String, Object> resultMap = new HashMap<>();

		try {
			List<SYSM241VO> list = sysm241Service.SYSM241SEL01(this.objectMapper.readValue(request, SYSM241VO.class));

			resultMap.put("list", this.objectMapper.writeValueAsString(list));
			resultMap.put("msg", "정상적으로 조회하였습니다.");

		} catch (Exception e) {
			log.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}

		return resultMap;
	}
}