package org.crm.sysm.web;


import org.crm.sysm.VO.SYSM212VO;
import org.crm.sysm.service.SYSM212Service;
import org.crm.util.json.JsonUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.Resource;
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
import java.util.List;
import java.util.Map;

/***********************************************************************************************
* Program Name : 사용자 ID 찾기 Main Controller
* Creator      : 이민호
* Create Date  : 2022.02.07
* Description  : 사용자 ID 찾기
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.02.07     이민호           최초생성
* 2022.03.30     이민호            화면이름변경 (사용자ID찾기 -> 조직사용자찾기)
************************************************************************************************/
@Controller
@RequestMapping("/sysm/*")
public class SYSM212Controller {

	@Resource(name = "SYSM212Service")
	private SYSM212Service sysm212Service;

	@Autowired
	private ObjectMapper objectMapper;

	private static final Logger LOGGER = LoggerFactory.getLogger(SYSM212Controller.class);

	/**
	 * @Method Name : SYSM212P
	 * @작성일      : 2022.02.07
	 * @작성자      : mhlee
	 * @변경이력    : 
	 * @Method 설명 : sysm/SYSM212P 웹 페이지 열기
	 * @param       :  
	 * @return      : sysm/SYSM212P.jsp 
	 */	
	@RequestMapping("/SYSM212P")
	public String SYSM212P() {
		return "th/sysm/SYSM212P";
	}	
	
	/**
     * @Method Name : SYSM212PSEL01
     * @작성일      : 2022.02.09
     * @작성자      : 이민호
     * @변경이력    : 
     * @Method 설명 : restful 조직사용자찾기
	 * @param       : ModelAndView
	 * @return      : ModelAndView HashMap
     */ 	
	@RequestMapping(value ="/SYSM212SEL01", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> SYSM212SEL01(ModelAndView mav, @RequestBody String req) {

		JSONParser parser = new JSONParser();
		HashMap<String, Object> hashMap = new HashMap<String, Object>();

    	try {
			JSONObject jsonObject = (JSONObject) parser.parse(req);
			SYSM212VO vo = this.objectMapper.convertValue(jsonObject, SYSM212VO.class);

    		List<SYSM212VO> SYSM212VOList = sysm212Service.SYSM212SEL01(vo);

			ObjectMapper mapper = new ObjectMapper();
			String json = mapper.writeValueAsString(SYSM212VOList);

			hashMap.put("SYSM212P", json);
			hashMap.put("msg", "정상적으로 조회하였습니다.");

    	}catch(Exception e) {
    		LOGGER.error("["+e.getClass()+"] Exception : " + e.getMessage());
    	}
		return hashMap;
    }	
	
	/**
     * @Method Name : SYSM212PSEL02
     * @작성일      : 2022.02.09
     * @작성자      : 이민호
     * @변경이력    : 
     * @Method 설명 : restful 사용자 ID 등록일자별 조회
	 * @param       :  ModelAndView, HttpServletRequest Restful param(fromDate, toDate / format("yyyy-MM-dd"))
	 * @return      : ModelAndView HashMap
     */ 
	@RequestMapping(value ="/SYSM212SEL02", method = RequestMethod.POST)
	@ResponseBody    
	public Map<String, Object> SYSM212SEL02(ModelAndView mav, @RequestBody String req){

		JSONParser parser = new JSONParser();
		HashMap<String, Object> hashMap = new HashMap<String, Object>();

		try {
			JSONObject jsonObject = (JSONObject) parser.parse(req);
			SYSM212VO vo = this.objectMapper.convertValue(jsonObject, SYSM212VO.class);
			List<SYSM212VO> orgList = sysm212Service.SYSM212SEL01(vo);
			List<SYSM212VO> usrList = sysm212Service.SYSM212SEL02(vo);

			String orgJson = this.objectMapper.writeValueAsString(orgList);
			String usrJson = this.objectMapper.writeValueAsString(usrList);

			String mergedOrgAndUsr = orgJson.toString().substring(0, orgJson.length() - 1) + "," +
					usrJson.toString().substring(1);

			hashMap.put("SYSM212P", mergedOrgAndUsr);
			hashMap.put("msg", "정상적으로 조회하였습니다.");

		}catch(Exception e) {
			LOGGER.error("["+e.getClass()+"] Exception : " + e.getMessage());
		}
		return hashMap;
	}
}
