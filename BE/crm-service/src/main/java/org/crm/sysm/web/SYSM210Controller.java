package org.crm.sysm.web;


import org.crm.sysm.VO.SYSM210VO;
import org.crm.sysm.VO.SYSM213VO;
import org.crm.sysm.service.SYSM210Service;
import org.crm.util.json.JsonUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.Resource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

/***********************************************************************************************
* Program Name : 조직찾기 팝업 Controller
* Creator      : djjung
* Create Date  : 2022.04.15
* Description  : 조직찾기 팝업
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.04.15     djjung           최초생성
************************************************************************************************/
@Controller
@RequestMapping("/sysm/*")
public class SYSM210Controller {

	@Resource(name = "SYSM210Service")
	private SYSM210Service SYSM210Service;

	@Autowired
	private ObjectMapper objectMapper;

	private static final Logger LOGGER = LoggerFactory.getLogger(SYSM210Controller.class);

	
	@Autowired
	private MessageSource messageSource;
	
	/**
	 * @Method Name : SYSM210P
	 * @작성일      : 2022.04.18
	 * @작성자      : djjugn
	 * @변경이력    :
	 * @Method 설명 : sysm/SYSM210P 웹 페이지 열기
	 * @param       :
	 * @return      : sysm/SYSM210P.jsp
	 */
	@RequestMapping("/SYSM210P")
	public String SYSM210P() {
		return "th/sysm/SYSM210P";
	}

	/**
	 * @Method Name : SYSM213P
	 * @작성일      : 2022.04.19
	 * @작성자      : djjugn
	 * @변경이력    :
	 * @Method 설명 : sysm/SYSM213P 웹 페이지 열기
	 * @param       :
	 * @return      : sysm/SYSM213P.jsp
	 */
	@RequestMapping("/SYSM213P")
	public String SYSM213P() {
		return "th/sysm/SYSM213P";
	}

	/**
	 * @Method Name     : SYSM210SEL01
	 * @작성일      	: 2022.01.17
	 * @작성자      	: 허해민
	 * @변경이력    	    :
	 * @Method 설명 	: 소속조직 찿기 조회 - 팝업
	 * @param           : HttpServletRequest Restful param
	 * @return          : ModelAndView HashMap
	 */
	@RequestMapping(value = "/SYSM210SEL01", method = RequestMethod.POST)
	@ResponseBody
	public Map<String, Object> SYSM210SEL01(Locale locale, ModelAndView mav, @RequestBody String req) {
		HashMap<String, Object> hashMap = new HashMap<>();
    	try {
		    SYSM210VO vo = this.objectMapper.readValue(req, SYSM210VO.class);
			hashMap.put("tree", SYSM210Service.SYSM210SEL01(vo));
			hashMap.put("msg", messageSource.getMessage("success.common.select", null, "success.common.select", locale));
			
		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}
		return hashMap;
	}
	
	/**
	 * @Method Name : SYSM210SEL02
	 * @작성일      	: 2023.01.30
	 * @작성자      	: sjyang
	 * @변경이력    	:
	 * @Method 설명 	: 상담그룹 정보 조회
	 * @param       :
	 * @return      :
	 */
    @RequestMapping(value ="/SYSM210SEL02", method = RequestMethod.POST)
    @ResponseBody    
    public Map<String, Object> SYSM210SEL02(Locale locale, ModelAndView mav, @RequestBody String request) {
		HashMap<String, Object> hashMap = new HashMap<>();
		try {
			List<SYSM213VO> cdList = SYSM210Service.SYSM210SEL02(this.objectMapper.readValue(request, SYSM213VO.class));
			
			hashMap.put("cdList", cdList);
			hashMap.put("msg", messageSource.getMessage("success.common.select", null, "success.common.select", locale));
		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
			e.printStackTrace();
		}
		return hashMap;
    }  	
    
}
