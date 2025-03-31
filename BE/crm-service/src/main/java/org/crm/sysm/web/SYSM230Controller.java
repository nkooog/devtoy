package org.crm.sysm.web;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import com.fasterxml.jackson.databind.ObjectMapper;

import org.crm.sysm.VO.SYSM230VO;
import org.crm.sysm.service.SYSM230Service;
import jakarta.annotation.Resource;
import lombok.extern.slf4j.Slf4j;

/***********************************************************************************************
* Program Name : 로그인 이력조회 Main Controller
* Creator      : 이민호
* Create Date  : 2022.02.14
* Description  : 로그인 이력조회
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.02.14     이민호           최초생성
************************************************************************************************/
@Slf4j
@Controller
@RequestMapping("/sysm/*")
public class SYSM230Controller {

	@Resource(name = "SYSM230Service")
	private SYSM230Service sysm230Service;

	private ObjectMapper objectMapper;

	@Autowired
	public SYSM230Controller(ObjectMapper objectMapper) {
		this.objectMapper = objectMapper;
	}

	private static final Logger LOGGER = LoggerFactory.getLogger(SYSM230Controller.class);
	/**
	 * @Method Name : SYSM230M
	 * @작성일      : 2022.02.14
	 * @작성자      : mhlee
	 * @변경이력    : 
	 * @Method 설명 : sysm/SYSM230M 웹 페이지 열기
	 * @param       :  
	 * @return      : sysm/SYSM230M.jsp 
	 */	
	@RequestMapping("/SYSM230M")
	public String SYSM230M() {
		return "th/sysm/SYSM230M";
	}

	/**
	 * @Method Name : SYSM230SEL01
	 * @작성일      : 2022.02.15
	 * @작성자      : 이민호
	 * @변경이력    :
	 * @Method 설명 : restful 로그인 이력조회
	 * @param       :  ModelAndView, HttpServletRequest Restful
	 *                 param(orgCd, nameList(ArrayList), fromDate, toDate / format("yyyy-MM-dd"))
	 * @return      : ModelAndView HashMap
	 */
	@PostMapping(value ="/SYSM230SEL01")
	@ResponseBody
	public Map<String, Object> SYSM230SEL01(ModelAndView mav, @RequestBody String req) {
		HashMap<String, Object> hashMap = new HashMap<String, Object>();
		try {
			List<SYSM230VO> SYSM230List = sysm230Service.SYSM230SEL01(this.objectMapper.readValue(req, SYSM230VO.class));

			hashMap.put("SYSM230M", this.objectMapper.writeValueAsString(SYSM230List));
		}catch(Exception e) {
			LOGGER.error("["+e.getClass()+"] Exception : " + e.getMessage());
		}
		return hashMap;
	}

}
