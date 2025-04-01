package org.crm.frme.web;

import org.crm.dash.VO.DASH120VO;
import org.crm.frme.VO.FRME140VO;
import org.crm.frme.service.FRME140Service;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
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
* Program Name : 퀵링크 팝업 Controller
* Creator      : 이민호
* Create Date  : 2022.02.10
* Description  : 퀵링크 팝업
* Modify Desc  : 
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.01.26     이민호           최초생성
* 2022.03.08	 이민호		      FRME140SEL01 param 추가 (tenantId)
* 2022.03.29	 이민호			 다국어 적용
************************************************************************************************/
@Slf4j
@Controller
@RequestMapping("/frme/*")
public class FRME140Controller {

	@Resource(name = "FRME140Service")
	private FRME140Service frme140Service;

	@Autowired
	private ObjectMapper objectMapper;

	@Autowired
	private MessageSource messageSource;

	@PostMapping("/FRME140P")
	public String FRME140P() {
		return "th/frme/FRME140P";
	}	
	
	/**
     * @Method Name : FRME140SEL01
     * @작성일      : 2022.01.26
     * @작성자      : 이민호
     * @변경이력    : 2022.03.08 - param (tenantId) 추가
     * @Method 설명 : QuickLink 전체조회
	 * @param       : ModelAndView HttpServletRequest Restful param(tenantId)
	 * @return      : ModelAndView HashMap
     */ 
	@PostMapping(value ="/FRME140SEL01")
    @ResponseBody 
    public Map<String, Object> FRME140SEL01(ModelAndView mav, @RequestBody String req, Locale locale) {
		HashMap<String, Object> hashMap = new HashMap<String, Object>();
    	try {
			List<DASH120VO> FRME140List = frme140Service.FRME140SEL01(this.objectMapper.readValue(req, FRME140VO.class));

			hashMap.put("FRME140P", this.objectMapper.writeValueAsString(FRME140List));
			hashMap.put("msg"     , this.messageSource.getMessage("success.common.select", null, "success msg", locale));

    	}catch(Exception e) {
    		log.error("["+e.getClass()+"] Exception : " + e.getMessage());
    	}
		return hashMap;
    }

	/**
	 * @Method Name : FRME140SEL02
	 * @작성일      : 2022.09.20
	 * @작성자      : 이민호
	 * @변경이력    :
	 * @Method 설명 : QuickLink 대시보드 선택 조건 조회
	 * @param       : ModelAndView HttpServletRequest Restful param(tenantId)
	 * @return      : ModelAndView HashMap
	 */
	@PostMapping(value ="/FRME140SEL02")
	@ResponseBody
	public Map<String, Object> FRME140SEL02(ModelAndView mav, @RequestBody String req, Locale locale) {
		HashMap<String, Object> hashMap = new HashMap<String, Object>();
		JSONParser parser = new JSONParser();
		try {
			JSONObject jsonObject = (JSONObject) parser.parse(req);
			List<FRME140VO> FRME140List = frme140Service.FRME140SEL02(this.objectMapper.convertValue(jsonObject, FRME140VO.class));

			hashMap.put("FRME140P", this.objectMapper.writeValueAsString(FRME140List));
			hashMap.put("msg"     , this.messageSource.getMessage("success.common.select", null, "success msg", locale));

		}catch(Exception e) {
			log.error("["+e.getClass()+"] Exception : " + e.getMessage());
		}
		return hashMap;
	}

	/**
	 * @Method Name : getMaxLnkSeq
	 * @작성일      : 2023.01.24
	 * @작성자      : 이민호
	 * @변경이력    :
	 * @Method 설명 : 퀵링크 Max Lnk_Seq 가져오기
	 * @param       : ModelAndView HttpServletRequest Restful param(tenantId)
	 * @return      : ModelAndView HashMap
	 */
	@PostMapping(value ="/FRME140getMaxLnkSeq")
	public @ResponseBody Map<String, Object> FRME140getMaxLnkSeq(ModelAndView mav, @RequestBody String req, Locale locale) {
		HashMap<String, Object> hashMap = new HashMap<String, Object>();
		JSONParser parser = new JSONParser();
		try {
			JSONObject jsonObject = (JSONObject) parser.parse(req);
			int maxLnkSeq = frme140Service.FRME140getMaxLnkSeq(this.objectMapper.convertValue(jsonObject, FRME140VO.class));

			hashMap.put("maxLnkSeq", maxLnkSeq);
			hashMap.put("msg"     , this.messageSource.getMessage("success.common.select", null, "success msg", locale));

		}catch(Exception e) {
			log.error("["+e.getClass()+"] Exception : " + e.getMessage());
		}
		return hashMap;
	}

}
