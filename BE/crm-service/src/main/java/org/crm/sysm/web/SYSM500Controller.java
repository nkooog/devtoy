package org.crm.sysm.web;

import org.crm.lgin.VO.LGIN000VO;
import org.crm.sysm.VO.SYSM500VO;
import org.crm.sysm.service.SYSM500Service;
import org.crm.util.json.JsonUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;
import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/***********************************************************************************************
* Program Name : 실시간운영메시지관리 Controller
* Creator      : jrlee
* Create Date  : 2022.06.08
* Description  : 실시간운영메시지관리
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.06.08     jrlee           최초생성
************************************************************************************************/
@Slf4j
@Controller
@RequestMapping("/sysm/*")
public class SYSM500Controller {
	private static final Logger LOGGER = LoggerFactory.getLogger(SYSM500Controller.class);


	@Resource(name = "SYSM500Service")
	private SYSM500Service sysm500Service;

	@Autowired
	private ObjectMapper objectMapper;
	/**
	 * @Method Name : SYSM500M
	 * @작성일      : 2022.06.07
	 * @작성자      : jrlee
	 * @변경이력    : 
	 * @Method 설명 : sysm/SYSM500M 웹 페이지 열기
	 * @param       :  
	 * @return      : sysm/SYSM500M.jsp
	 */
	@RequestMapping("/SYSM500M")
	public String SYSM500M(HttpSession session, Model model) {
		LGIN000VO sessionVO = (LGIN000VO) session.getAttribute("user");
        model.addAttribute("user", sessionVO);
		return "th/sysm/SYSM500M";
	}

	/**
	 * @Method Name : SYSM500SEL01
	 * @작성일      : 2022.06.07
	 * @작성자      : jrlee
	 * @변경이력    :
	 * @Method 설명 : 실시간운영메시지 조회
	 * @param       : ModelAndView
	 * @return      : ModelAndView HashMap
	 */
	@RequestMapping(value = "/SYSM500SEL01", method = RequestMethod.POST)
	@ResponseBody
	public Map<String, Object> SYSM500SEL01( @RequestBody String request) {
		HashMap<String, Object> resultMap = new HashMap<>();

		try {
			List<SYSM500VO> list = sysm500Service.SYSM500SEL01( this.objectMapper.readValue( request , SYSM500VO.class ));

			resultMap.put("list", new ObjectMapper().writeValueAsString(list));
			resultMap.put("msg", "정상적으로 조회하였습니다.");

		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}

		return resultMap;
	}

	/**
	 * @Method Name : SYSM500INS01
	 * @작성일      : 2022.06.14
	 * @작성자      : jrlee
	 * @변경이력    :
	 * @Method 설명 : 실시간운영메시지 저장
	 * @param       : ModelAndView
	 * @return : ModelAndView HashMap
	 */
	@RequestMapping(value = "/SYSM500INS01", method = RequestMethod.POST)
	@ResponseBody
	public Map<String, Object> SYSM500INS01( @RequestBody String request) {
		HashMap<String, Object> resultMap = new HashMap<>();

		try {
			Integer rtn = sysm500Service.SYSM500INS01(this.objectMapper.readValue(request , SYSM500VO.class) );

			if (rtn > 0) {
				resultMap.put("msg", "정상적으로 저장되었습니다.");
			}
		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}
		return resultMap;
	}

	/**
	 * @Method Name : SYSM500DEL01
	 * @작성일      : 2022.06.13
	 * @작성자      : jrlee
	 * @변경이력    :
	 * @Method 설명 : 실시간운영메시지 삭제
	 * @param       : ModelAndView
	 * @return : ModelAndView HashMap
	 */
	@RequestMapping(value = "/SYSM500DEL01", method = RequestMethod.POST)
	@ResponseBody
	public Map<String, Object> SYSM500DEL01(@RequestBody String request) {
		HashMap<String, Object> resultMap = new HashMap<>();

		try {
			Integer rtn = sysm500Service.SYSM500DEL01(this.objectMapper.readValue(request , SYSM500VO.class));

			if (rtn > 0) {
				resultMap.put("msg", "정상적으로 삭제되었습니다.");
			}
		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}
		return resultMap;
	}
}
