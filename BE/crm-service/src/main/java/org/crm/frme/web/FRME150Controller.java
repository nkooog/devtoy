package org.crm.frme.web;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.crm.frme.model.vo.FRME150VO;
import org.crm.frme.service.FRME150Service;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

/***********************************************************************************************
* Program Name : 즐겨찾기메뉴 팝업 Controller
* Creator      : 이민호
* Create Date  : 2022.02.03
* Description  : 즐겨찾기메뉴 팝업
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.02.03     이민호           최초생성
* 2022.02.17	 이민호		      erd_0.71 반영
*                                 FRME150SEL01 param 추가 (usrId)
*                                 FRME150DEL01 컬럼 변경 - menu_no -> menuId
* 2022.05.16	 이민호			  FRME150INS01 - 즐겨찾기 추가 기능 생성
************************************************************************************************/
@Slf4j
@Controller
@RequestMapping("/frme/*")
public class FRME150Controller {

	@Resource(name = "FRME150Service")
	private FRME150Service frme150Service;

	@Autowired
	private ObjectMapper objectMapper;

	@Autowired
	private MessageSource messageSource;

	@RequestMapping("/FRME150P")
	public String FRME150P() {
		return "th/frme/FRME150P";
	}
	
	
	/**
     * @Method Name : FRME150SEL01
     * @작성일      : 2022.02.03
     * @작성자      : 이민호
     * @변경이력    : 2022.02.17 - param (usrID) 추가
     * @Method 설명 : restful 방식 즐겨찾기메뉴 조회
	 * @param       : ModelAndView HttpServletRequest Restful param(usrId)
	 * @return      : ModelAndView HashMap 
     */ 
	
	@PostMapping(value ="/FRME150SEL01")
    @ResponseBody 
    public Map<String, Object> FRME150SEL01(ModelAndView mav, @RequestBody String request, Locale locale) {

		HashMap<String, Object> hashMap = new HashMap<String, Object>();
		JSONParser parser = new JSONParser();

    	try {
		    JSONObject jsonObject = (JSONObject) parser.parse(request);
		    List<FRME150VO> FRME150List = frme150Service.FRME150SEL01(this.objectMapper.convertValue(jsonObject, FRME150VO.class));

		    hashMap.put("FRME150P", this.objectMapper.writeValueAsString(FRME150List));
		    hashMap.put("msg", messageSource.getMessage("success.common.select", null, "success select", locale));
		    
    	}catch(Exception e) {
			e.printStackTrace();
		    log.error("["+e.getClass()+"] Exception : " + e.getMessage());
		    hashMap.put("msg", messageSource.getMessage("fail.request.msg", null, "select fail", locale));
    	}
		return hashMap;
    }

	/**
	 * @Method Name : FRME150INS01
	 * @작성일      : 2022.05.16
	 * @작성자      : 이민호
	 * @변경이력    :
	 * @Method 설명 : restful 방식 즐겨찾기메뉴 추가
	 * @param       : ModelAndView, HttpServletRequest Restful param(tenantId, usrId, menuId)
	 * @return      : ModelAndView HashMap
	 */

	@PostMapping(value ="/FRME150INS01")
	@ResponseBody
	public Map<String, Object> FRME150INS01(ModelAndView mav, @RequestBody String request, Locale locale){
		HashMap<String, Object> hashMap = new HashMap<String, Object>();
		JSONParser parser = new JSONParser();
		try {
			JSONObject jsonObject = (JSONObject) parser.parse(request);

			int rtn = frme150Service.FRME150INS01(this.objectMapper.convertValue(jsonObject, FRME150VO.class));

			String result = "";
			if(rtn > 0) {
				result = messageSource.getMessage("success.common.insert", null, "success insert", locale);
			}
			hashMap.put("result", result);
		}catch(Exception e) {
			log.error("["+e.getClass()+"] Exception : " + e.getMessage());
			hashMap.put("msg", messageSource.getMessage("fail.request.msg", null, "select fail", locale));
		}
		return hashMap;
	}

	/**
     * @Method Name : FRME150DEL01
     * @작성일      : 2022.02.07
     * @작성자      : 이민호
     * @변경이력    : 2022.02.17 변경 - menu_no -> menuId
     * @Method 설명 : restful 방식 즐겨찾기메뉴 삭제
	 * @param       : ModelAndView, HttpServletRequest Restful param(tenantId, usrId, menuId)
	 * @return      : ModelAndView HashMap
     */

	@PostMapping("/FRME150DEL01")
	@ResponseBody
	public Map<String, Object> FRME150DEL01(ModelAndView mav, @RequestBody String request, Locale locale){
		HashMap<String, Object> hashMap = new HashMap<String, Object>();
		JSONParser parser = new JSONParser();
		try {

			JSONObject jsonObject = (JSONObject) parser.parse(request);
			int rtn = frme150Service.FRME150DEL01(this.objectMapper.convertValue(jsonObject, FRME150VO.class));

			String result = "";
			if(rtn > 0) {
				mav.setStatus(HttpStatus.OK);
				result = messageSource.getMessage("success.common.delete", null, "success delete", locale);
			}
			hashMap.put("result", result);
		}catch(Exception e) {
			log.error("["+e.getClass()+"] Exception : " + e.getMessage());
			hashMap.put("msg", messageSource.getMessage("fail.request.msg", null, "select fail", locale));
		}
		return hashMap;
	}
	
}
