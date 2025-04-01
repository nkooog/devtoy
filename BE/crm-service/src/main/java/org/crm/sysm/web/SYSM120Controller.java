package org.crm.sysm.web;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import jakarta.annotation.Resource;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.support.SessionStatus;
import org.springframework.web.servlet.ModelAndView;

import com.fasterxml.jackson.databind.ObjectMapper;

import org.crm.config.spring.config.PropertiesService;
import org.crm.sysm.VO.SYSM100VO;
import org.crm.sysm.VO.SYSM120VO;
import org.crm.sysm.service.SYSM120Service;
import org.crm.util.com.ComnFun;
import org.crm.util.json.JsonUtil;
import org.crm.util.string.StringUtil;
/***********************************************************************************************
* Program Name : 태넌트 기준정보 Controller
* Creator      : 김보영
* Create Date  : 2022.01.10
* Description  : 태넌트 기준정보
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.01.10     김보영           최초생성
************************************************************************************************/
@RestController
@RequestMapping("/sysm/*")
public class SYSM120Controller {

	@Resource(name = "SYSM120Service")
	private SYSM120Service SYSM120Service;		

	@Autowired
	private PropertiesService propertiesService;


	private ComnFun cf;
	private ObjectMapper objectMapper;
	private MessageSource messageSource;

	@Autowired
	public SYSM120Controller(ObjectMapper objectMapper, MessageSource messageSource,ComnFun cf) {
		this.objectMapper = objectMapper;
		this.messageSource = messageSource;
		this.cf = cf;
	}
	
	private static final Logger LOGGER = LoggerFactory.getLogger(SYSM120Controller.class);

	/**
	 * @Method Name : SYSM120T
	 * @작성일      : 2022.01.10
	 * @작성자      : bykim
	 * @변경이력    : 
	 * @Method 설명 : sysm/SYSM120T 웹 페이지 열기
	 * @param       :  
	 * @return      : sysm/SYSM120T.jsp 
	 */	
	@RequestMapping("/SYSM120T")
	public String SYSM120T(Model model) {
		LOGGER.info("SYSM110T 페이지 열기");
		return "th/sysm/SYSM120T";
	}
	
	
	/**
	 * @Method Name : SYSM120SEL03
	 * @작성일      : 2022.01.10
	 * @작성자      : bykim
	 * @변경이력    : 
	 * @Method 설명 : 태넌트 기준정보조회
	 * @param       : HttpServletRequest Restful param
	 * @return      : ModelAndView HashMap
	 */
	@PostMapping(value ="/SYSM120SEL03")
	@ResponseBody  
	public Map<String, Object> SYSM120SEL03(Locale locale, @RequestBody String request) throws Exception {
		
		HashMap<String, Object> sys120hashMap = new HashMap<String, Object>();
		JSONParser parser = new JSONParser();
		try {
			JSONObject obj = (JSONObject) parser.parse(request);

			SYSM100VO sysm100vo = SYSM100VO.builder()
					.tenantId(String.valueOf(obj.get("tenantId")))
					.build();
			
			List<SYSM120VO> SYSM120VOInfo = SYSM120Service.SYSM120SEL03(sysm100vo);

			ObjectMapper mapper = new ObjectMapper();
			String json = mapper.writeValueAsString(SYSM120VOInfo);
			
			sys120hashMap.put("SYSM120VOInfo", json);
			sys120hashMap.put("msg", messageSource.getMessage("success.common.select", null, "success.common.select", locale));
			
		}catch(Exception e) {
			LOGGER.error("["+e.getClass()+"] Exception : " + e.getMessage());
		}
		return sys120hashMap;
	}

	//=============================== 아래는 작업 안됨 =========================================================

	/**
	 * @Method Name : SYSM120INS02
	 * @작성일      : 2022.01.10
	 * @작성자      : bykim
	 * @변경이력    : 
	 * @Method 설명 : 태넌트기준정보 신규등록
	 * @param       :  HttpServletRequest Restful param
	 * @return      : ModelAndView HashMap
	 */   
	@RequestMapping(value ="/SYSM120INS02", method = RequestMethod.POST)
	@ResponseBody 
	public Map<String, Object> SYSM110INS01(ModelAndView mav, @RequestBody String req, BindingResult bindingResult, Model model,
			SessionStatus status)  {

		JSONParser parser = new JSONParser();
		HashMap<String, Object> hashMap = new HashMap<String, Object>();

		try {
			JSONObject obj = (JSONObject) parser.parse(req);

			// 태넌트 부가서비스  start
			JSONArray jsonArray = (JSONArray) obj.get("SYSM120VOList");
			List<SYSM120VO> list = new ArrayList<SYSM120VO>();
			
			for(int i=0; i<jsonArray.size(); i++){
				JSONObject jsonObject = (JSONObject) jsonArray.get(i);
				SYSM120VO SYSM120VO = new SYSM120VO();

				SYSM120VO.setTenantId(String.valueOf(jsonObject.get("tenantId")));
				SYSM120VO.setBsVlMgntNo(Integer.parseInt(String.valueOf(jsonObject.get("bsVlMgntNo"))));
				SYSM120VO.setBsVlNm(String.valueOf(jsonObject.get("bsVlNm")));
				SYSM120VO.setBascVluDvCd(String.valueOf(jsonObject.get("bascVluDvCd")));
				SYSM120VO.setBascVluUnitCd(String.valueOf(jsonObject.get("bascVluUnitCd")));
				SYSM120VO.setBascVluUseCntCd(String.valueOf(jsonObject.get("bascVluUseCntCd")));
				
				if(!cf.isStringEmpty(String.valueOf(jsonObject.get("dataSzMnriCnt")))){
					SYSM120VO.setDataSzMnriCnt(Integer.parseInt(String.valueOf(jsonObject.get("dataSzMnriCnt"))));
				}
				if(!cf.isStringEmpty(String.valueOf(jsonObject.get("dataSzSmlcntMnriCnt")))){
					SYSM120VO.setDataSzSmlcntMnriCnt(Integer.parseInt(String.valueOf(jsonObject.get("dataSzSmlcntMnriCnt"))));
				}
				
				SYSM120VO.setBsVl1(String.valueOf(jsonObject.get("bsVl1")));
				SYSM120VO.setBsVl2(String.valueOf(jsonObject.get("bsVl2")));
				SYSM120VO.setBsVl3(String.valueOf(jsonObject.get("bsVl3")));
				SYSM120VO.setUseYn(String.valueOf(jsonObject.get("useYn")));
				
				SYSM120VO.setRegrId(String.valueOf(jsonObject.get("regrId")));
				SYSM120VO.setRegrOrgCd(String.valueOf(jsonObject.get("regrOrgCd")));
				SYSM120VO.setLstCorprId(String.valueOf(jsonObject.get("lstCorprId")));
				SYSM120VO.setLstCorprOrgCd(String.valueOf(jsonObject.get("lstCorprOrgCd")));
				
				list.add(SYSM120VO);
			}
			
			// 부가서비스 insert
			Integer adtnRtn = SYSM120Service.SYSM120INS03(list);

			if(adtnRtn > 0) {
				status.setComplete();
				hashMap.put("result", "Insert Success");
				hashMap.put("msg", "정상적으로 등록하였습니다.");		
			}

		}catch(Exception e) {
			LOGGER.error("["+e.getClass()+"] Exception : " + e.getMessage());
		}
		return hashMap;

	}
	
	
	/**
	 * @Method Name : SYSM120UPT02
	 * @작성일      : 2022.01.10
	 * @작성자      : bykim
	 * @변경이력    : 
	 * @Method 설명 : 태넌트기준정보 신규등록
	 * @param       :  HttpServletRequest Restful param
	 * @return      : ModelAndView HashMap
	 */   
	@RequestMapping(value ="/SYSM120UPT03", method = RequestMethod.POST)
	@ResponseBody 
	public Map<String, Object> SYSM120UPT03(ModelAndView mav, @RequestBody String req, BindingResult bindingResult, Model model,
			SessionStatus status)  {

		HashMap<String, Object> hashMap = new HashMap<String, Object>();
		JSONParser parser = new JSONParser();
		try {
			JSONObject obj = (JSONObject) parser.parse(req);
			JSONArray jsonArray = (JSONArray) obj.get("SYSM120VOList");

			List<SYSM120VO> SYSM120VOList = new ArrayList<SYSM120VO>();

			for(int i=0; i<jsonArray.size(); i++){
				JSONObject jsonObject = (JSONObject) jsonArray.get(i);
				SYSM120VO SYSM120VO = new SYSM120VO();
				SYSM120VO.setTenantId(String.valueOf(jsonObject.get("tenantId")));
				SYSM120VO.setBsVlMgntNo(Integer.parseInt(String.valueOf(jsonObject.get("bsVlMgntNo"))));
				SYSM120VO.setBsVlNm(String.valueOf(jsonObject.get("bsVlNm")));
				SYSM120VO.setBascVluDvCd(String.valueOf(jsonObject.get("bascVluDvCd")));
				SYSM120VO.setBascVluUnitCd(String.valueOf(jsonObject.get("bascVluUnitCd")));
				SYSM120VO.setBascVluUseCntCd(String.valueOf(jsonObject.get("bascVluUseCntCd")));
				
				if(!cf.isStringEmpty(String.valueOf(jsonObject.get("dataSzMnriCnt")))){
					SYSM120VO.setDataSzMnriCnt(Integer.parseInt(String.valueOf(jsonObject.get("dataSzMnriCnt"))));
				}
				if(!cf.isStringEmpty(String.valueOf(jsonObject.get("dataSzSmlcntMnriCnt")))){
					SYSM120VO.setDataSzSmlcntMnriCnt(Integer.parseInt(String.valueOf(jsonObject.get("dataSzSmlcntMnriCnt"))));
				}
				
				SYSM120VO.setBsVl1(String.valueOf(jsonObject.get("bsVl1")));
				SYSM120VO.setBsVl2(String.valueOf(jsonObject.get("bsVl2")));
				SYSM120VO.setBsVl3(String.valueOf(jsonObject.get("bsVl3")));
				SYSM120VO.setUseYn(String.valueOf(jsonObject.get("useYn")));
				
				SYSM120VO.setLstCorprId(String.valueOf(jsonObject.get("lstCorprId")));
				SYSM120VO.setLstCorprOrgCd(String.valueOf(jsonObject.get("lstCorprOrgCd")));
				
				SYSM120VOList.add(SYSM120VO);
			}

			Integer result = SYSM120Service.SYSM120UPT03(SYSM120VOList);
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
			LOGGER.error("["+e.getClass()+"] Exception : " + e.getMessage());
		}
		
		return hashMap;
	}
	
	/**
	 * @Method Name : SYSM120DEL03
	 * @작성일      : 2022.01.10
	 * @작성자      : bykim
	 * @변경이력    : 
	 * @Method 설명 : 태넌트기준정보 삭제
	 * @param       : HttpServletRequest Restful param
	 * @return      : ModelAndView HashMap
	 */     
	@RequestMapping(value ="/SYSM120DEL03", method = RequestMethod.POST)
	@ResponseBody  
	public Map<String, Object> SYSM120DEL03(ModelAndView mav, @RequestBody String req, BindingResult bindingResult, Model model,
			SessionStatus status) {

		HashMap<String, Object> hashMap = new HashMap<String, Object>();
		JSONParser parser = new JSONParser();
		try {
			JSONObject obj = (JSONObject) parser.parse(req);
			JSONArray jsonArray = (JSONArray) obj.get("SYSM120VOList");

			List<SYSM120VO> SYSM120VOList = new ArrayList<SYSM120VO>();

			for(int i=0; i<jsonArray.size(); i++){
				JSONObject jsonObject = (JSONObject) jsonArray.get(i);
				SYSM120VO SYSM120VO = new SYSM120VO();
				
				SYSM120VO.setTenantId(String.valueOf(jsonObject.get("tenantId")));
				SYSM120VO.setBsVlMgntNo(Integer.parseInt(String.valueOf(jsonObject.get("bsVlMgntNo"))));
				
				SYSM120VOList.add(SYSM120VO);
			}

			int rtn = SYSM120Service.SYSM120DEL03(SYSM120VOList);
			
			if(rtn > 0) {
				status.setComplete();
				hashMap.put("result", "Delete Success");
				hashMap.put("msg", "정상적으로 삭제하였습니다.");	
			}		

		}catch(Exception e) {
			hashMap.put("msg", StringUtil.substringByLength(e.getCause().getMessage(),200));
			LOGGER.error("["+e.getClass()+"] Exception : " + e.getMessage());
		}

		return hashMap;
	}	


}
