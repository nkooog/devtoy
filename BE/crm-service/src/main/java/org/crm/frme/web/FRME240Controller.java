package org.crm.frme.web;

import org.crm.frme.VO.FRME240VO;
import org.crm.frme.service.FRME240Service;
import org.crm.lgin.VO.LGIN000VO;
import org.crm.util.com.ComnFun;
import org.crm.util.crypto.AES256Crypt;
import org.crm.util.masking.MaskingUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpSession;
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

import java.util.HashMap;
import java.util.List;
import java.util.Map;


/**
 * @Class Name   : FRME240Controller.java
 * @Description  : 웹프레임 통화예약 콜백 controller
 * @Modification 
 * @ -------------------------------------------------------------------------
 * @  수정일                  수정자              수정내용
 * @ -------------------------------------------------------------------------
 * @ 2022.03.03   김보영             최초생성
 * @ 2024.12.11   jypark           egov->boot mig
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
public class FRME240Controller {

	@Resource(name = "FRME240Service")
	private FRME240Service frme240Service;

	@Autowired
	private ObjectMapper objectMapper;

	@RequestMapping("/FRME240P")
	public String FRME240P() {
		return "th/frme/FRME240P";
	}	
	
	
	/**
     * @Method Name : FRME240SEL01
     * @작성일 : 2022.03.03
     * @작성자 : 김보영
     * @Method 설명 : 웹프레임 통화예약 목록 조회
	 * @param :  ModelAndView HttpServletRequest 
	 * @return : ModelAndView HashMap 
     */ 
	
	@PostMapping(value ="/FRME240SEL01")
    @ResponseBody 
    public Map<String, Object> FRME240SEL01(@RequestBody String req, HttpSession session) {

		HashMap<String, Object> hashMap = new HashMap<String, Object>();
		JSONParser parser = new JSONParser();

    	try {			
    		ComnFun cf = new ComnFun();
		    JSONObject obj = (JSONObject) parser.parse(req);
			
			FRME240VO vo = new FRME240VO();
			vo.setTenantId(String.valueOf(obj.get("tenantId"))); 
			
			if(!cf.isStringEmpty((String.valueOf(obj.get("srchDtFrom"))))){
				vo.setSrchDtFrom(String.valueOf(obj.get("srchDtFrom")));
			}if(!cf.isStringEmpty((String.valueOf(obj.get("srchDtTo"))))){
				vo.setSrchDtTo(String.valueOf(obj.get("srchDtTo")));
			}
			vo.setSrchDt(String.valueOf(obj.get("srchDt")));
			vo.setSrchCond(String.valueOf(obj.get("srchCond"))); 
			
			String srchText = String.valueOf(obj.get("srchText"));
	        String cipherText = AES256Crypt.encrypt(srchText);
			vo.setSrchText(cipherText);
			//vo.setSrchText(String.valueOf(obj.get("srchText"))); 
			vo.setProcStCd(String.valueOf(obj.get("procStCd"))); 
			vo.setUsrId(String.valueOf(obj.get("usrId"))); 
			
			
			List<FRME240VO> FRME240List = frme240Service.FRME240SEL01(vo);
		    LGIN000VO user = (LGIN000VO) session.getAttribute("user");

			for(FRME240VO FRME240VO : FRME240List) {
				if(!cf.isStringEmpty(FRME240VO.getCntcCustNm())){
					FRME240VO.setCntcCustNm(AES256Crypt.decrypt(FRME240VO.getCntcCustNm()));
					if(!ComnFun.isEmpty(FRME240VO.getCntcCustNm())){
						String name = "";
						if(!ComnFun.isEmpty(user.getPersonInfoMask()) && "N".equals(user.getPersonInfoMask())){
							name = FRME240VO.getCntcCustNm();
						}else{
							name = MaskingUtil.nameMasking(FRME240VO.getCntcCustNm());
						}
						FRME240VO.setCntcCustNmMsk(name);
					}
				}
				if(!cf.isStringEmpty(FRME240VO.getCntcTelNo())){
					String phoneNo = MaskingUtil.SwichingPhone(AES256Crypt.decrypt(FRME240VO.getCntcTelNo()));
					if(!ComnFun.isEmpty(user.getPersonInfoMask()) && "N".equals(user.getPersonInfoMask())){
						phoneNo =  AES256Crypt.decrypt(FRME240VO.getCntcTelNo());
					}
					FRME240VO.setCntcTelNo(phoneNo);
				}
			}
			
	        ObjectMapper mapper = new ObjectMapper();
			String json = mapper.writeValueAsString(FRME240List);
			
			hashMap.put("FRME240PInfo", json);
			hashMap.put("msg", "정상적으로 조회하였습니다.");
		    
    	}catch(Exception e) {
    		log.error("["+e.getClass()+"] Exception : " + e.getMessage());
    	}
		return hashMap;
    }

	@PostMapping(value ="/FRME240SEL02")
	@ResponseBody
	public Map<String, Object> FRME240SEL02(@RequestBody String req, SessionStatus status) {
		HashMap<String, Object> hashMap = new HashMap<>();
		JSONParser jsonParser = new JSONParser();
		try {

			JSONObject jsonObject = (JSONObject) jsonParser.parse(req);

			List<FRME240VO> list = frme240Service.FRME240SEL02(this.objectMapper.convertValue(jsonObject, FRME240VO.class));
			for(FRME240VO vo : list){
				vo.setCntcTelNo(AES256Crypt.decrypt(vo.getCntcTelNo()));
			}
			hashMap.put("list", this.objectMapper.writeValueAsString(list));
			hashMap.put("count", list.size());
			hashMap.put("msg", "정상적으로 조회하였습니다.");

		}catch(Exception e) {
			log.error("["+e.getClass()+"] Exception : " + e.getMessage());
		}
		return hashMap;
	}

	@PostMapping(value ="/FRME240UPT01")
	@ResponseBody
	public Map<String, Object> FRME240UPT02(@RequestBody String req, SessionStatus status) {
		HashMap<String, Object> hashMap = new HashMap<>();
		JSONParser parser = new JSONParser();
		try {

			JSONObject jsonObject = (JSONObject) parser.parse(req);
			int result = frme240Service.FRME240UPT01(this.objectMapper.convertValue(jsonObject, FRME240VO.class));

			if(result> 0){
				hashMap.put("msg", "정상적으로 수정하였습니다.");
			}else{
				hashMap.put("msg", "수정에 실패 하였습니다.");
			}
			hashMap.put("result", result);
		}catch(Exception e) {
			log.error("["+e.getClass()+"] Exception : " + e.getMessage());
		}
		return hashMap;
	}
	
}