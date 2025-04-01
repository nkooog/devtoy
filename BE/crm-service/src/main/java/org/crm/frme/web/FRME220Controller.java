package org.crm.frme.web;

import org.crm.frme.VO.FRME220VO;
import org.crm.frme.service.FRME220Service;
import org.crm.util.com.ComnFun;
import org.crm.util.crypto.AES256Crypt;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.support.SessionStatus;
import org.springframework.web.servlet.ModelAndView;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


/**
 * @Class Name   : FRME220Controller.java
 * @Description  : My 컨텐츠 controller
 * @Modification 
 * @ -------------------------------------------------------------------------
 * @  수정일                  수정자              수정내용
 * @ -------------------------------------------------------------------------
 * @ 2022.03.03   김보영             최초생성
 * @ -------------------------------------------------------------------------
 * @author CRM Lab실 김보영 연구원
 * @since 2022. 03.03
 * @version 1.0
 * @see
 *
 *  Copyright (C) by BROADC&S All right reserved.
 */

@Slf4j
@Controller
@RequestMapping("/frme/*")
public class FRME220Controller {

	@Resource(name = "FRME220Service")
	private FRME220Service frme220Service;

	@Autowired
	private ObjectMapper objectMapper;

	@RequestMapping("/FRME220P")
	public String FRME220P() {
		return "th/frme/FRME220P";
	}	
	
	
	/**
     * @Method Name : FRME220SEL01
     * @작성일 : 2022.03.03
     * @작성자 : 김보영
     * @Method 설명 : My 컨텐츠 목록 조회
	 * @param :  ModelAndView HttpServletRequest 
	 * @return : ModelAndView HashMap 
     */ 
	
	@PostMapping(value ="/FRME220SEL01")
    @ResponseBody 
    public Map<String, Object> FRME220SEL01(ModelAndView mav, @RequestBody String req, SessionStatus status) {

		HashMap<String, Object> hashMap = new HashMap<String, Object>();
		JSONParser parser = new JSONParser();

    	try {		
    		ComnFun cf = new ComnFun();
    		
    		JSONObject obj = (JSONObject) parser.parse(req);
			
    		List<Integer> ctgrList = new ArrayList<Integer>();
			FRME220VO vo = new FRME220VO();
			vo.setTenantId(String.valueOf(obj.get("tenantId"))); 
			vo.setUsrId(String.valueOf(obj.get("usrId"))); 
			vo.setSrchText(String.valueOf(obj.get("srchText"))); 
			
			if(obj.get("ctgrNo") != null) {
				vo.setCtgrNo(Integer.parseInt(String.valueOf(obj.get("ctgrNo"))));
				ctgrList.add(vo.getCtgrNo());
			}
			if(obj.get("prsLvl") != null) {
				vo.setPrsLvl(Integer.parseInt(String.valueOf(obj.get("prsLvl"))));
				List<Integer> rtnList =  frme220Service.FRME220SEL02(vo);
				for(Integer ctgrNo : rtnList) {
					ctgrList.add(ctgrNo) ;
				}
			}
			
			if(ctgrList.size()>0) {
				vo.setCtgrNoList(ctgrList);
			}
			List<FRME220VO> FRME220List = frme220Service.FRME220SEL01(vo);
			
			for(FRME220VO FRME220VO : FRME220List) {
				if(!cf.isStringEmpty(FRME220VO.getUsrNm())){
					FRME220VO.setUsrNm(AES256Crypt.decrypt(FRME220VO.getUsrNm()));
				}
			}
			
			String json = this.objectMapper.writeValueAsString(FRME220List);
			hashMap.put("FRME220PInfo", json);
			hashMap.put("msg", "정상적으로 조회하였습니다.");

    	}catch(Exception e) {
			e.printStackTrace();
    		log.error("["+e.getClass()+"] Exception : " + e.getMessage());
    	}
		return hashMap;
    }	
	
	/**
     * @Method Name : FRME220INS01
     * @작성일 : 2022.03.03
     * @작성자 : 김보영
     * @Method 설명 : My 컨텐츠 목록 조회
	 * @param :  ModelAndView HttpServletRequest 
	 * @return : ModelAndView HashMap 
     */ 
	
	@PostMapping(value ="/FRME220INS01")
    @ResponseBody 
    public Map<String, Object> FRME220INS01(ModelAndView mav, @RequestBody String req, SessionStatus status) {

		HashMap<String, Object> hashMap = new HashMap<String, Object>();
		JSONParser parser = new JSONParser();

    	try {		
    		ComnFun cf = new ComnFun();

		    JSONObject obj = (JSONObject) parser.parse(req);
			
			FRME220VO vo = this.objectMapper.convertValue(obj, FRME220VO.class);

			Integer FRME220 = frme220Service.FRME220INS01(vo);
			String json = this.objectMapper.writeValueAsString(FRME220);
			
			hashMap.put("FRME220PInfo", json);
			hashMap.put("msg", "정상적으로 조회하였습니다.");

    	}catch(Exception e) {
    		log.error("["+e.getClass()+"] Exception : " + e.getMessage());
    	}
		return hashMap;
    }	
	
	/**
     * @Method Name : FRME220DEL01
     * @작성일 : 2022.03.03
     * @작성자 : 김보영
     * @Method 설명 : My 컨텐츠 목록 조회
	 * @param :  ModelAndView HttpServletRequest 
	 * @return : ModelAndView HashMap 
     */ 
	
	@PostMapping(value ="/FRME220DEL01")
    @ResponseBody 
    public Map<String, Object> FRME220DEL01(ModelAndView mav, @RequestBody String req, SessionStatus status) {

		HashMap<String, Object> hashMap = new HashMap<String, Object>();
		JSONParser parser = new JSONParser();

    	try {		
    		ComnFun cf = new ComnFun();

		    JSONObject obj = (JSONObject) parser.parse(req);
			
			FRME220VO vo = this.objectMapper.convertValue(obj, FRME220VO.class);
			Integer FRME220 = frme220Service.FRME220DEL01(vo);
			
	        ObjectMapper mapper = new ObjectMapper();
			String json = mapper.writeValueAsString(FRME220);
			
			hashMap.put("FRME220PInfo", json);
			hashMap.put("msg", "정상적으로 조회하였습니다.");

    	}catch(Exception e) {
    		log.error("["+e.getClass()+"] Exception : " + e.getMessage());
    	}
		return hashMap;
    }

	/**
	 * @Method Name : FRME220SEL11
	 * @작성일 : 2022.10.20
	 * @작성자 : 이민호
	 * @Method 설명 : 대시보드 My지식 목록 조회
	 * @param :  ModelAndView HttpServletRequest
	 * @return : ModelAndView HashMap
	 */

	@PostMapping(value ="/FRME220SEL11")
	@ResponseBody
	public Map<String, Object> FRME220SEL11(ModelAndView mav, @RequestBody String req, SessionStatus status) {

		HashMap<String, Object> hashMap = new HashMap<String, Object>();
		JSONParser parser = new JSONParser();

		try {

			JSONObject obj = (JSONObject) parser.parse(req);
			FRME220VO vo = this.objectMapper.convertValue(obj, FRME220VO.class);
			List<FRME220VO> list = frme220Service.FRME220SEL11(vo);

			hashMap.put("list", this.objectMapper.writeValueAsString(list));

		}catch(Exception e) {
			log.error("["+e.getClass()+"] Exception : " + e.getMessage());
		}
		return hashMap;
	}
}
