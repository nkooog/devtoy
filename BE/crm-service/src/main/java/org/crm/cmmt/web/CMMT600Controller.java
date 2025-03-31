package org.crm.cmmt.web;

import org.crm.cmmt.VO.CMMT600VO;
import org.crm.cmmt.service.CMMT600Service;
import org.crm.config.spring.config.PropertiesService;
import org.crm.lgin.VO.LGIN000VO;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpSession;
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
import java.util.Objects;


/***********************************************************************************************
 * Program Name : 뉴스레터 목록 페이지 Controller
 * Creator      : wkim
 * Create Date  : 2023.11.14
 * Description  : 뉴스레터 목록 페이지
 * Modify Desc  :
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2023.11.14      wkim          	최초생성
 ************************************************************************************************/
@Slf4j
@Controller
@RequestMapping("/cmmt/*")
public class CMMT600Controller {
	
	@Resource(name = "CMMT600Service")
    private CMMT600Service CMMT600Service;

	@Autowired
	private ObjectMapper objectMapper;

	@Resource(name = "propertiesService")
	private PropertiesService propertiesService;

	private static final Logger LOGGER = LoggerFactory.getLogger(CMMT600Controller.class);

	/**
	 * @Method Name : CMMT600M
	 * @작성일      	: 2023.11.14
	 * @작성자      	: wkim
	 * @변경이력    	:
	 * @Method 설명 	: cmmt/CMMT600M 웹 페이지 열기
	 * @param       :
	 * @return      : cmmt/CMMT600M.jsp
	 */
	@RequestMapping("/CMMT600M")
	public String CMMT600M() {
		return "th/cmmt/CMMT600M";
	}

	/**
	 * @Method Name : CMMT600SEL01
	 * @작성일      : 2023.11.15
	 * @작성자      : dwson
	 * @변경이력    : 
	 * @Method 설명 : 뉴스레터 조회
	 * @param       : HttpServletRequest Restful param
	 * @return      : ModelAndView HashMap
	 */    
	@RequestMapping(value ="/CMMT600SEL01", method = RequestMethod.POST)
	@ResponseBody    
	public Map<String, Object> CMMT600SEL01(ModelAndView mav, @RequestBody String request, HttpSession session){
		
		HashMap<String, Object> hashMap = new HashMap<String, Object>();

		try {
			CMMT600VO vo = this.objectMapper.readValue(request, CMMT600VO.class);
			LGIN000VO loginVO = (LGIN000VO) session.getAttribute("user");
			vo.setUsrId(loginVO.getUsrId());
			vo.setUsrGrd(loginVO.getUsrGrd());
			
		    List<CMMT600VO> CMMT600List = CMMT600Service.CMMT600SEL01(vo);
		    
		    hashMap.put("result", this.objectMapper.writeValueAsString(CMMT600List));
		    hashMap.put("msg"     , "성공");

		}catch(Exception e) {
		    LOGGER.error("["+e.getClass()+"] Exception : " + e.getMessage());
		}

		return hashMap;
	}
	
	/**
	 * @Method Name : CMMT600DEL01
	 * @작성일      : 2023.11.17
	 * @작성자      : dwson
	 * @변경이력    :
	 * @Method 설명 : 뉴스레터 삭제
	 * @param       : HttpServletRequest Restful param
	 * @return      : ModelAndView HashMap
	 */
	@RequestMapping(value ="/CMMT600DEL01", method = RequestMethod.POST)
	@ResponseBody
	public Map<String, Object> CMMT600DEL01(ModelAndView mav, @RequestBody String request) {
		HashMap<String, Object> resultMap = new HashMap<>();
		try {

			CMMT600VO cmmt600VO = this.objectMapper.readValue(request, CMMT600VO.class);

			int result1 = CMMT600Service.CMMT600DEL01(cmmt600VO);
			int result2 = CMMT600Service.CMMT600DEL02(cmmt600VO);
			
			resultMap.put("result", result1 + result2);

		}catch(Exception e) {
			if(!Objects.equals(e, new RuntimeException())){
				LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
			}
			resultMap.put("result", "0");
			resultMap.put("msg", "Delete failed : " + e.getMessage());
		}

		return resultMap;
	}
}
