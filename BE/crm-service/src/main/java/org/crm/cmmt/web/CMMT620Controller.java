package org.crm.cmmt.web;

import org.crm.cmmt.VO.CMMT620VO;
import org.crm.cmmt.service.CMMT620Service;
import org.crm.config.spring.config.PropertiesService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpSession;
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
 * Program Name : 뉴스레터 확인내역 페이지 Controller
 * Creator      : wkim
 * Create Date  : 2023.11.15
 * Description  : 뉴스레터 확인내역 페이지
 * Modify Desc  :
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2023.11.15      wkim          	최초생성
 ************************************************************************************************/
@Controller
@RequestMapping("/cmmt/*")
public class CMMT620Controller {
	
	@Resource(name = "CMMT620Service")
    private CMMT620Service CMMT620Service;

	private ObjectMapper objectMapper;
	private PropertiesService propertiesService;

	private static final Logger LOGGER = LoggerFactory.getLogger(CMMT620Controller.class);
	public static final String PATH = "NOTE";

	@Autowired
	public CMMT620Controller(ObjectMapper objectMapper, PropertiesService propertiesService) {
		this.objectMapper = objectMapper;
		this.propertiesService = propertiesService;
	}

	/**
	 * @Method Name : CMMT620P
	 * @작성일      	: 2023.11.15
	 * @작성자      	: wkim
	 * @변경이력    	:
	 * @Method 설명 	: cmmt/CMMT620P 웹 페이지 열기
	 * @param       :
	 * @return      : cmmt/CMMT620P.jsp
	 */
	@RequestMapping("/CMMT620P")
	public String CMMT620P() {
		return "th/cmmt/CMMT620P";
	}
	
	/**
	 * @Method Name : CMMT620SEL01
	 * @작성일      : 2023.11.17
	 * @작성자      : dwson
	 * @변경이력    : 
	 * @Method 설명 : 뉴스레터 확인내역 조회
	 * @param       : HttpServletRequest Restful param
	 * @return      : ModelAndView HashMap
	 */    
	@RequestMapping(value ="/CMMT620SEL01", method = RequestMethod.POST)
	@ResponseBody    
	public Map<String, Object> CMMT620SEL01(ModelAndView mav, @RequestBody String request, HttpSession session){
		
		HashMap<String, Object> hashMap = new HashMap<String, Object>();

		try {
		    List<CMMT620VO> CMMT620List = CMMT620Service.CMMT620SEL01(this.objectMapper.readValue(request, CMMT620VO.class));
		    
		    hashMap.put("result", this.objectMapper.writeValueAsString(CMMT620List));
		    hashMap.put("msg"     , "성공");

		}catch(Exception e) {
		    LOGGER.error("["+e.getClass()+"] Exception : " + e.getMessage());
		}
		return hashMap;
	}
}
