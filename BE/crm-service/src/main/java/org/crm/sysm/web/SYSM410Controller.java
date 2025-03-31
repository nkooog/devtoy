package org.crm.sysm.web;

import org.crm.sysm.VO.SYSM410VO;
import org.crm.sysm.service.SYSM410Service;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.Resource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

/***********************************************************************************************
* Program Name : 작업스케줄처리이력 controller
* Creator      : sukim
* Create Date  : 2022.06.21
* Description  : 작업스케줄처리이력
* Modify Desc  : 
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.06.21     sukim            최초생성
************************************************************************************************/
@Controller
@RequestMapping("/sysm/*")
public class SYSM410Controller {

	private MessageSource messageSource;
	private ObjectMapper objectMapper;

	@Autowired
	public SYSM410Controller(MessageSource messageSource, ObjectMapper objectMapper) {
		this.messageSource = messageSource;
		this.objectMapper = objectMapper;
	}

	private static final Logger LOGGER = LoggerFactory.getLogger(SYSM200Controller.class);

	@Resource(name = "SYSM410Service")
	private SYSM410Service SYSM410Service;
	
	/**
	 * @Method Name     : SYSM410M
	 * @작성일      	: 2022.06.21
	 * @작성자      	: sukim
	 * @변경이력    	:
	 * @Method 설명 	: sysm/SYSM410M 웹 페이지 열기
	 * @param           :
	 * @return          : sysm/SYSM410M.jsp
	 */
	@RequestMapping("/SYSM410M")
	public String SYSM410M(Model model) {
		LOGGER.info("SYSM410M 페이지 열기");
		return "th/sysm/SYSM410M";
	}
	
	/**
	 * @Method Name     : SYSM410SEL01
	 * @작성일      	: 2022.06.21
	 * @작성자      	: sukim
	 * @변경이력    	:
	 * @Method 설명 	: 작업 스케줄 처리이력 목록 조회
	 * @param           : @RequestBody String request Restful param
	 * @return          : ModelAndView HashMap
	 * @throws Exception 
	 */   
	@RequestMapping(value ="/SYSM410SEL01", method = RequestMethod.POST)
	@ResponseBody  
	public Map<String, Object> SYSM410SEL01(Locale locale, ModelAndView mav, @RequestBody String request) throws Exception {
		HashMap<String, Object> sys410hashMap = new HashMap<String, Object>();
		try {
			SYSM410VO sys410vo = this.objectMapper.readValue(request, SYSM410VO.class);

			List<SYSM410VO> sys410sel01list = SYSM410Service.SYSM410SEL01(sys410vo);

			sys410hashMap.put("SYSM410SEL01List"     , this.objectMapper.writeValueAsString(sys410sel01list));
			sys410hashMap.put("SYSM410SEL01ListCount", sys410sel01list.size());
		}catch(Exception e) {
			LOGGER.error("["+e.getClass()+"] Exception : " + e.getMessage());
		}
		return sys410hashMap;
	}		
	
}
