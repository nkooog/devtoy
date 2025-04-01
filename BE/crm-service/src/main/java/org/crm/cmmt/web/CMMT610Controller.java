package org.crm.cmmt.web;

import org.crm.cmmt.VO.CMMT600VO;
import org.crm.cmmt.service.CMMT610Service;
import org.crm.config.spring.config.PropertiesService;
import org.crm.lgin.VO.LGIN000VO;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
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
import java.util.Map;
import java.util.Objects;


/***********************************************************************************************
 * Program Name : 뉴스레터 등록 페이지 Controller
 * Creator      : wkim
 * Create Date  : 2023.11.14
 * Description  : 뉴스레터 등록 페이지
 * Modify Desc  :
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2023.11.14      wkim          	최초생성
 * 2024.12.09      jypark          	egov->boot mig
 ************************************************************************************************/
@Slf4j
@Controller
@RequestMapping("/cmmt/*")
public class CMMT610Controller {
	
	@Resource(name = "CMMT610Service")
    private CMMT610Service CMMT610Service;

	@Resource(name = "propertiesService")
	private PropertiesService propertiesService;

	@Autowired
	private ObjectMapper objectMapper;

	private static final Logger LOGGER = LoggerFactory.getLogger(CMMT610Controller.class);
	public static final String PATH = "NOTE";
	
	/**
	 * @Method Name : CMMT610P
	 * @작성일      	: 2023.11.14
	 * @작성자      	: wkim
	 * @변경이력    	:
	 * @Method 설명 	: cmmt/CMMT610P 웹 페이지 열기
	 * @param       :
	 * @return      : cmmt/CMMT610P.jsp
	 */
	@RequestMapping("/CMMT610P")
	public String CMMT610P() {
		return "th/cmmt/CMMT610P";
	}
	
	/**
	 * @Method Name : CMMT610SEL01
	 * @작성일      : 2023.11.17
	 * @작성자      : dwson
	 * @변경이력    :
	 * @Method 설명 : 단일 뉴스레터 조회
	 * @param       : HttpServletRequest Restful param
	 * @return      : ModelAndView HashMap
	 */
	@RequestMapping("/CMMT610SEL01")
	public @ResponseBody Map<String, Object> CMMT610SEL01(ModelAndView mav, @RequestBody String req, HttpSession session) {
		HashMap<String, Object> resultMap = new HashMap<>();
		JSONParser parser = new JSONParser();
		try {

			JSONObject jsonObject = (JSONObject) parser.parse(req);
			CMMT600VO vo = this.objectMapper.convertValue(jsonObject, CMMT600VO.class);
			LGIN000VO loginVO = (LGIN000VO) session.getAttribute("user");
			vo.setUsrId(loginVO.getUsrId());
			vo.setUsrGrd(loginVO.getUsrGrd());
			
			CMMT600VO info = CMMT610Service.CMMT610SEL01(vo);

			resultMap.put("info", this.objectMapper.writeValueAsString(info));
			resultMap.put("msg", "정상적으로 조회하였습니다.");

		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}
		return resultMap;
	}
	
	/**
	 * @Method Name : CMMT610P
	 * @작성일      	: 2023.11.16
	 * @작성자      	: dwson
	 * @변경이력    	:
	 * @Method 설명 	: cmmt/CMMT610P 뉴스레터 신규등록
	 * @param       :
	 * @return      : result
	 */
	@RequestMapping(value = "/CMMT610INS01", method = RequestMethod.POST)
	public @ResponseBody Map<String, Object> INHB041INS01(ModelAndView mav, @RequestBody String request) {
		HashMap<String, Object> resultMap = new HashMap<>();
		JSONParser parser = new JSONParser();
		try {
			JSONObject jsonObject = (JSONObject) parser.parse(request);
			CMMT600VO vo = this.objectMapper.convertValue(jsonObject, CMMT600VO.class);
	        int result = CMMT610Service.CMMT610INS01(vo);

			if(result == 0) {
				resultMap.put("msg", "[ERROR] 등록을 실패하였습니다.");
			}
			
			resultMap.put("result", result);

		} catch (Exception e) {
			if(!Objects.equals(e, new RuntimeException())){
				LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
			}
			resultMap.put("result", "0");
			resultMap.put("msg", "Add failed : " + e.getMessage());
		}

		return resultMap;
	}
	
	/**
	 * @Method Name : CMMT610UPT01
	 * @작성일      : 2023.11.17
	 * @작성자      : dwson
	 * @변경이력    :
	 * @Method 설명 : 뉴스레터 수정
	 * @param       : ModelAndView
	 * @return : ModelAndView HashMap
	 */
	@RequestMapping(value = "/CMMT610UPT01", method = RequestMethod.POST)
	public @ResponseBody Map<String, Object> CMMT610UPT01(ModelAndView mav, @RequestBody String request) {
		HashMap<String, Object> resultMap = new HashMap<>();
		JSONParser parser = new JSONParser();
		try {
			JSONObject jsonObject = (JSONObject) parser.parse(request);
			CMMT600VO vo = this.objectMapper.convertValue(jsonObject, CMMT600VO.class);
			int result = CMMT610Service.CMMT610UPT01(vo);

			if(result == 0){
				resultMap.put("msg", "[ERROR] 수정을 실패하였습니다.");
			}
			
			resultMap.put("result", result);

		} catch (Exception e) {
			if(!Objects.equals(e, new RuntimeException())){
				LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
			}
			resultMap.put("result", "0");
			resultMap.put("msg", "Update failed : " + e.getMessage());
		}
		return resultMap;
	}

}
