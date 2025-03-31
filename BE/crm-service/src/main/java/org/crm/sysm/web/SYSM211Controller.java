package org.crm.sysm.web;

import org.crm.sysm.VO.SYSM211VO;
import org.crm.sysm.service.SYSM211Service;
import org.crm.util.com.ComnFun;
import org.crm.util.crypto.AES256Crypt;
import org.crm.util.string.StringUtil;
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

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/***********************************************************************************************
* Program Name : 사용자찾기 팝업 Controller
* Creator      : sukim
* Create Date  : 2022.04.15
* Description  : 사용자찾기 팝업
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.04.15     sukim            최초생성
************************************************************************************************/
@Controller
@RequestMapping("/sysm/*")
public class SYSM211Controller {

	@Resource(name = "SYSM211Service")
	private SYSM211Service SYSM211Service;
	
	@Autowired
	private ObjectMapper objectMapper;

	private static final Logger LOGGER = LoggerFactory.getLogger(SYSM211Controller.class);
	
	/**
	 * @Method Name : SYSM211P
	 * @작성일      	: 2022.04.19
	 * @작성자      	: sukim
	 * @변경이력    	:
	 * @Method 설명 	: sysm/SYSM211P 웹 페이지 열기
	 * @param           :
	 * @return          : sysm/SYSM211P.jsp
	 */
	@RequestMapping("/SYSM211P")
	public String SYSM211P() {
		LOGGER.info("SYSM211P 페이지 열기");
		return "th/sysm/SYSM211P";
	}

	/**
	 * @Method Name : SYSM214P
	 * @작성일      	: 2022.04.20
	 * @작성자      	: sukim
	 * @변경이력    	:
	 * @Method 설명 	: sysm/SYSM214P 웹 페이지 열기
	 * @param           :
	 * @return          : sysm/SYSM214P.jsp
	 */
	@RequestMapping("/SYSM214P")
	public String SYSM214P() {
		LOGGER.info("SYSM214P 페이지 열기");
		return "th/sysm/SYSM214P";
	}
	
	/**
	 * @Method Name     : SYSM211SEL01
	 * @작성일      	: 2022.01.17
	 * @작성자      	: sukim
	 * @변경이력    	:
	 * @Method 설명 	: 사용자 찿기 조회 - 팝업
	 * @param           : HttpServletRequest Restful param
	 * @return          : ModelAndView HashMap
	 */
	@RequestMapping(value = "/SYSM211SEL01", method = RequestMethod.POST)
	@ResponseBody
	public Map<String, Object> SYSM211SEL01(ModelAndView mav, @RequestBody String request) {
		JSONParser parser = new JSONParser();
		HashMap<String, Object> hashMap = new HashMap<String, Object>();
    	try {
			JSONObject obj = (JSONObject) parser.parse(request);
			ComnFun cf = new ComnFun();
			SYSM211VO vo = new SYSM211VO();
			
			String SYSM211_usrNm = String.valueOf(obj.get("usrNm"));
		    vo.setTenantId(String.valueOf(obj.get("tenantId")));
			//LOGGER.info("=== SYSM211SEL01 사용자명 길이 : " + SYSM211_usrNm.length() + ", SYSM211_usrNm : " + SYSM211_usrNm);
		    vo.setCmmtSetlmnYn(String.valueOf(obj.get("cmmtSetlmnYn")));
		    vo.setKldMgntSetlmnYn(String.valueOf(obj.get("kldMgntSetlmnYn")));
		    vo.setUsrGrd(StringUtil.nullToBlank(obj.get("usrGrd")));

		    if(!cf.isStringEmpty(SYSM211_usrNm)){
				//성(family name)으로 검색
				if( SYSM211_usrNm.length() == 1) {
					vo.setSrchKeyword1(AES256Crypt.encrypt(String.valueOf(obj.get("usrNm"))));
					vo.setKeywordLen(1);
				}
				//성(family name)+ 가운데 字로 검색
				if( SYSM211_usrNm.length() == 2) {
					vo.setSrchKeyword2(AES256Crypt.encrypt(String.valueOf(obj.get("usrNm"))));
					vo.setKeywordLen(2);
				}
				//full name으로 검색
				if( SYSM211_usrNm.length() >= 3) {
					vo.setUsrNm(AES256Crypt.encrypt(String.valueOf(obj.get("usrNm"))));
					vo.setKeywordLen(3);
				}				
			}
			
	        List<SYSM211VO> SYSM211SEL01List = SYSM211Service.SYSM211SEL01(vo);
	        
	        SYSM211VO SYSM211P_userVO = new SYSM211VO();
	        List<SYSM211VO> SYSM211_SEL01List = new ArrayList<SYSM211VO>();
	        
			for(int i=0; i<SYSM211SEL01List.size(); i++) {
				SYSM211P_userVO = new SYSM211VO();
				SYSM211P_userVO.setTenantId(SYSM211SEL01List.get(i).getTenantId());
				SYSM211P_userVO.setFmnm(SYSM211SEL01List.get(i).getFmnm());
				SYSM211P_userVO.setUsrId(SYSM211SEL01List.get(i).getUsrId());
				SYSM211P_userVO.setDecUsrNm(AES256Crypt.decrypt(SYSM211SEL01List.get(i).getUsrNm()));
				SYSM211P_userVO.setOrgCd(SYSM211SEL01List.get(i).getOrgCd());
				SYSM211P_userVO.setOrgNm(SYSM211SEL01List.get(i).getOrgNm());
				SYSM211P_userVO.setUsrGrdNm(SYSM211SEL01List.get(i).getUsrGrdNm());
				SYSM211P_userVO.setAcStCdNm(SYSM211SEL01List.get(i).getAcStCdNm());
				SYSM211P_userVO.setAcStRsnCdNm(SYSM211SEL01List.get(i).getAcStRsnCdNm());
				SYSM211_SEL01List.add(SYSM211P_userVO);
			}
	        
			hashMap.put("SYSM211SEL01List"     , this.objectMapper.writeValueAsString(SYSM211_SEL01List));
			hashMap.put("SYSM211SEL01ListCount", SYSM211_SEL01List.size());
    	}catch(Exception e) {
    		LOGGER.error("["+e.getClass()+"] Exception : " + e.getMessage());
    	}
		return hashMap;
	}	
	
}
