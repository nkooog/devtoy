package org.crm.sysm.web;

import org.crm.sysm.VO.SYSM100VO;
import org.crm.sysm.service.SYSM100Service;
import org.crm.util.com.ComnFun;
import org.crm.util.crypto.AES256Crypt;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.support.SessionStatus;
import org.springframework.web.servlet.ModelAndView;

import jakarta.annotation.Resource;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/***********************************************************************************************
* Program Name : 태넌트 정보관리 Main Controller
* Creator      : 김보영
* Create Date  : 2022.01.10
* Description  : 태넌트 정보관리
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.01.10    김보영           최초생성
************************************************************************************************/
@Controller
@RequestMapping("/sysm/*")
public class SYSM100Controller {

	@Resource(name = "SYSM100Service")
	private SYSM100Service SYSM100Service;

	@Autowired
	private ObjectMapper objectMapper;

	private static final Logger LOGGER = LoggerFactory.getLogger(SYSM100Controller.class);

	/**
	 * @Method Name : SYSM100M
	 * @작성일      : 2022.01.10
	 * @작성자      : bykim
	 * @변경이력    : 
	 * @Method 설명 : sysm/SYSM100M 웹 페이지 열기
	 * @param       :  
	 * @return      : sysm/SYSM100M.jsp 
	 */	
	@RequestMapping("/SYSM100M")
	public String SYSM100M() {
		LOGGER.info("SYSM100M 페이지 열기");
		return "th/sysm/SYSM100M";
	}	


	/**
	 * @Method Name : SYSM100SEL01
	 * @작성일      : 2022.01.10
	 * @작성자      : bykim
	 * @변경이력    : 
	 * @Method 설명 : 태넌트 목록조회
	 * @param       : HttpServletRequest Restful param
	 * @return      : ModelAndView HashMap
	 */    
	@PostMapping(value ="/SYSM100SEL01")
	@ResponseBody    
	public Map<String, Object> SYSM100SEL01(ModelAndView mav, @RequestBody String req){

		HashMap<String, Object> hashMap = new HashMap<String, Object>();
		JSONParser parser = new JSONParser();
		try {

			ComnFun cf = new ComnFun();
			JSONObject object = (JSONObject) parser.parse(req);
			SYSM100VO vo = this.objectMapper.convertValue(object, SYSM100VO.class);
			List<SYSM100VO> SYSM100VOInfo = SYSM100Service.SYSM100SEL01(vo);
			

			for(SYSM100VO SYSM100VO : SYSM100VOInfo) {
				if(!cf.isStringEmpty(SYSM100VO.getEmlSndGrpsAddr())){
					SYSM100VO.setEmlSndGrpsAddr(AES256Crypt.decrypt(SYSM100VO.getEmlSndGrpsAddr()));
				}
				if(!cf.isStringEmpty(SYSM100VO.getReprNm())){
					SYSM100VO.setReprNm(AES256Crypt.decrypt(SYSM100VO.getReprNm()));
				}
				if(!cf.isStringEmpty(SYSM100VO.getReprNmEng())){
					SYSM100VO.setReprNmEng(AES256Crypt.decrypt(SYSM100VO.getReprNmEng()));
				}

			}

			String json = this.objectMapper.writeValueAsString(SYSM100VOInfo);
			
			LOGGER.info("SYSM100M 페이지 열기  : "+json);

			hashMap.put("SYSM100VOInfo", json);
			hashMap.put("SYSM100VOListCount", SYSM100VOInfo.size());

			hashMap.put("msg", "정상적으로 조회하였습니다.");

		}catch(Exception e) {
			e.printStackTrace();
			LOGGER.error("["+e.getClass()+"] Exception : " + e.getMessage());
		}
		return hashMap;
	}


	/**
	 * @Method Name : SYSM100UPT03
	 * @작성일      : 2022.01.10
	 * @작성자      : bykim
	 * @변경이력    : 
	 * @Method 설명 : 태넌트목록정보 태넌트상태 변경
	 * @param       : HttpServletRequest - json 배열   "list" :  [{id : "", name : ""},{id : "", name : ""}] 구조
	 * @return      : ModelAndView HashMap
	 */      
	@RequestMapping(value ="/SYSM100UPT02", method = RequestMethod.POST)
	@ResponseBody 
	public Map<String, Object>  SYSM100UPT02(ModelAndView mav, @RequestBody String req, SessionStatus status) {

		HashMap<String, Object> hashMap = new HashMap<String, Object>();
		JSONParser parser = new JSONParser();

		try {
			JSONObject obj = (JSONObject) parser.parse(req);
			JSONArray jsonArray = (JSONArray) obj.get("SYSM100VOList");

			List<SYSM100VO> SYSM100VOList = (List<SYSM100VO>) jsonArray.stream()
					.map(o -> this.objectMapper.convertValue(o, SYSM100VO.class))
					.collect(Collectors.toList());

			Integer result = SYSM100Service.SYSM100UPT02(SYSM100VOList);
			String message = "";
			if (result > 0) {
				status.setComplete();
				message = "정상적으로 변경하였습니다.";
			}else {
				message = "변경 실패하였습니다.";
			}
			hashMap.put("result", message);
			hashMap.put("msg"   , message);

		}catch(Exception e) {
			e.printStackTrace();
			LOGGER.error("["+e.getClass()+"] Exception : " + e.getMessage());
		}
		
		return hashMap;
	}

}
