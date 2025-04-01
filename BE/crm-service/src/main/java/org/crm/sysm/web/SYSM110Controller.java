package org.crm.sysm.web;

import org.crm.config.spring.config.PropertiesService;
import org.crm.sysm.VO.SYSM100VO;
import org.crm.sysm.VO.SYSM110VO;
import org.crm.sysm.VO.SYSM120VO;
import org.crm.sysm.service.SYSM110Service;
import org.crm.sysm.service.SYSM120Service;
import org.crm.util.com.ComnFun;
import org.crm.util.crypto.AES256Crypt;
import org.crm.util.date.DateUtil;
import org.crm.util.string.StringUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.support.SessionStatus;
import org.springframework.web.servlet.ModelAndView;

import java.util.*;
/***********************************************************************************************
* Program Name : 태넌트 기본정보 Controller
* Creator      : 김보영
* Create Date  : 2022.01.10
* Description  : 태넌트 기본정보
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.01.10     김보영           최초생성
************************************************************************************************/
@Slf4j
@Controller
@RequestMapping("/sysm/*")
public class SYSM110Controller {

	@Resource(name = "SYSM110Service")
	private SYSM110Service SYSM110Service;		
	
	@Resource(name = "SYSM120Service")
	private SYSM120Service SYSM120Service;		

	@Autowired
	private PropertiesService propertiesService;

	private ObjectMapper objectMapper;
	private MessageSource messageSource;
	private ComnFun cf;

	@Autowired
	public SYSM110Controller(ObjectMapper objectMapper, MessageSource messageSource, ComnFun cf) {
		this.objectMapper = objectMapper;
		this.messageSource = messageSource;
		this.cf = cf;
	}

	private static final Logger LOGGER = LoggerFactory.getLogger(SYSM110Controller.class);

	/**
	 * @Method Name : SYSM110T
	 * @작성일      : 2022.01.10
	 * @작성자      : bykim
	 * @변경이력    : 
	 * @Method 설명 : sysm/SYSM110T 웹 페이지 열기
	 * @param       :  
	 * @return      : sysm/SYSM110T.jsp 
	 */
	@RequestMapping("/SYSM110T")
	public String SYSM200M(Model model) {
		LOGGER.info("SYSM110T 페이지 열기");
		return "th/sysm/SYSM110T";
	}
	
	/**
	 * @Method Name : SYSM110SEL02
	 * @작성일      : 2022.01.10
	 * @작성자      : bykim
	 * @변경이력    : 
	 * @Method 설명 : 태넌트 기본정보조회
	 * @param       : HttpServletRequest Restful param
	 */    
	@PostMapping(value ="/SYSM110SEL02")
	@ResponseBody  
	public Map<String, Object> SYSM110SEL02(Locale locale, @RequestBody String request) throws Exception {
		HashMap<String, Object> sys110hashMap = new HashMap<String, Object>();
		JSONParser parser = new JSONParser();
		try {
			JSONObject sys110obj = (JSONObject) parser.parse(request);
			SYSM100VO sysm100vo = SYSM100VO.builder()
					.tenantId(String.valueOf(sys110obj.get("tenantId")))
					.build();
			
			List<SYSM110VO> SYSM110VOInfo = SYSM110Service.SYSM110SEL02(sysm100vo);

			ObjectMapper mapper = new ObjectMapper();
			String json = mapper.writeValueAsString(SYSM110VOInfo);

			sys110hashMap.put("SYSM110VOInfo", json);
			sys110hashMap.put("msg", messageSource.getMessage("success.common.select", null, "success.common.select", locale));
		}catch(Exception e) {
			LOGGER.error("["+e.getClass()+"] Exception : " + e.getMessage());
		}
		return sys110hashMap;	
	}
	
	
	//=============================== 아래는 작업 안됨 =========================================================

	/**
	 * @Method Name : SYSM110INS01
	 * @작성일      : 2022.01.10
	 * @작성자      : bykim
	 * @변경이력    : 
	 * @Method 설명 : 태넌트기본정보 신규등록
	 * @param       : HttpServletRequest Restful param
	 * @return      : ModelAndView HashMap
	 */   
	@RequestMapping(value ="/SYSM110INS01", method = RequestMethod.POST)
	@ResponseBody
	public Map<String, Object> SYSM110INS01(ModelAndView mav, @RequestBody String req, BindingResult bindingResult, Model model,
	                                 SessionStatus status)  {

		HashMap<String, Object> hashMap = new HashMap<String, Object>();
		JSONParser parser = new JSONParser();
		try {
			JSONObject obj = (JSONObject) parser.parse(req);
			SYSM100VO vo = new SYSM100VO();
			
			//태넌트 기본정보  start
			vo.setTenantId(String.valueOf(obj.get("tenantId")));
			vo.setDmnCd(String.valueOf(obj.get("dmnCd")));
			vo.setSpTypCd(String.valueOf(obj.get("spTypCd")));
			vo.setTenantStCd(String.valueOf(obj.get("tenantStCd")));
			vo.setFmnm(String.valueOf(obj.get("fmnm")));
			vo.setFmnmEng(String.valueOf(obj.get("fmnmEng")));
			vo.setReprNm(String.valueOf(obj.get("reprNm")));

			if(!this.cf.isStringEmpty(String.valueOf(obj.get("reprNm")))){
				vo.setReprNm(AES256Crypt.encrypt(String.valueOf(obj.get("reprNm"))));
			}
			if(!this.cf.isStringEmpty(String.valueOf(obj.get("reprNmEng")))){
				vo.setReprNmEng(AES256Crypt.encrypt(String.valueOf(obj.get("reprNmEng"))));
			}
			vo.setSvcTypCd(String.valueOf(obj.get("svcTypCd")));
			vo.setOrgLvlCd(String.valueOf(obj.get("orgLvlCd")));
			vo.setMlingCd(String.valueOf(obj.get("mlingCd")));
			vo.setSpTypCd(String.valueOf(obj.get("spTypCd")));

	    	String emlSndGrpAddr = String.valueOf(obj.get("emlSndGrpsAddr"));
	        String cipherText = AES256Crypt.encrypt(emlSndGrpAddr);
			vo.setEmlSndGrpsAddr(cipherText);
			vo.setUsrAcCnt(String.valueOf(obj.get("usrAcCnt")));

			if(obj.get("tenantStRsnCd") != null) {
				vo.setTenantStRsnCd(String.valueOf(obj.get("tenantStRsnCd")));
			}

			DateUtil du = new DateUtil();
			if(!this.cf.isStringEmpty((String.valueOf(obj.get("svcContDd"))))){
				vo.setSvcContDd(du.getDate(String.valueOf(obj.get("svcContDd"))));
			}
			if(!this.cf.isStringEmpty((String.valueOf(obj.get("svcBltnDd"))))){
				vo.setSvcBltnDd(du.getDate(String.valueOf(obj.get("svcBltnDd"))));
			}
			if(!this.cf.isStringEmpty((String.valueOf(obj.get("svcExpryDd"))))){
				vo.setSvcExpryDd(du.getDate(String.valueOf(obj.get("svcExpryDd"))));
			}
			if(!this.cf.isStringEmpty((String.valueOf(obj.get("svcTrmnDd"))))){
				vo.setSvcTrmnDd(du.getDate(String.valueOf(obj.get("svcTrmnDd"))));
			}

			vo.setRegrId(String.valueOf(obj.get("regrId")));
			vo.setRegrOrgCd(String.valueOf(obj.get("regrOrgCd")));
			vo.setLstCorprId(String.valueOf(obj.get("lstCorprId")));
			vo.setLstCorprOrgCd(String.valueOf(obj.get("lstCorprOrgCd")));

			// 태넌트 기본정보 등록
			Integer rtn = SYSM110Service.SYSM110INS01(vo);

			// 신규 생성 시 태넌트 기준정보 DMO 복사
			SYSM100VO vo2 = new SYSM100VO();
			vo2.setTenantId("DMO");
			List<SYSM120VO> SYSM120VOInfo = SYSM120Service.SYSM120SEL03(vo2);
			for(SYSM120VO vo3 : SYSM120VOInfo){
				vo3.setTenantId(vo.getTenantId());
				vo3.setRegrId(vo.getRegrId());
				vo3.setRegrOrgCd(vo.getRegrOrgCd());
				vo3.setLstCorprId(vo.getLstCorprId());
				vo3.setLstCorprOrgCd(vo.getLstCorprOrgCd());
			}
			// 기준정보 insert
			Integer adtnRtn = SYSM120Service.SYSM120INS03(SYSM120VOInfo);

			if(rtn > 0) {
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
	 * @Method Name : SYSM110INS02
	 * @작성일      : 2022.01.10
	 * @작성자      : bykim
	 * @변경이력    : 
	 * @Method 설명 : 태넌트기본정보 신규등록
	 * @param       : HttpServletRequest Restful param
	 * @return      : ModelAndView HashMap
	 */   
	@RequestMapping(value ="/SYSM110INS02", method = RequestMethod.POST)
	@ResponseBody 
	public Map<String, Object> SYSM110INS02(ModelAndView mav, @RequestBody String req, BindingResult bindingResult, Model model,
			SessionStatus status)  {

		HashMap<String, Object> hashMap = new HashMap<String, Object>();
		JSONParser parser = new JSONParser();

		try {
			JSONObject obj = (JSONObject) parser.parse(req);
			Integer rtn = 0;
			
			// 태넌트 부가서비스  start
			JSONArray jsonArray = (JSONArray) obj.get("SYSM110VOList");
			List<SYSM110VO> list = new ArrayList<SYSM110VO>();
	
			for(int i=0; i<jsonArray.size(); i++){
				JSONObject jsonObject = (JSONObject) jsonArray.get(i);
				SYSM110VO SYSM110VO = new SYSM110VO();
	
				SYSM110VO.setTenantId(String.valueOf(jsonObject.get("tenantId")));
				SYSM110VO.setUseDvCd(String.valueOf(jsonObject.get("useDvCd")));
				SYSM110VO.setConnAddr(String.valueOf(jsonObject.get("connAddr")));
				SYSM110VO.setLcnsCunt(String.valueOf(jsonObject.get("lcnsCunt")));
				SYSM110VO.setAdtnSvcCd(String.valueOf(jsonObject.get("adtnSvcCd")));
				SYSM110VO.setRegrId(String.valueOf(jsonObject.get("regrId")));
				SYSM110VO.setRegrOrgCd(String.valueOf(jsonObject.get("regrOrgCd")));
				SYSM110VO.setLstCorprId(String.valueOf(jsonObject.get("lstCorprId")));
				SYSM110VO.setLstCorprOrgCd(String.valueOf(jsonObject.get("lstCorprOrgCd")));
				
				list.add(SYSM110VO);
			}
			// 부가서비스 insert
			if(list.size()>0) {
				rtn = SYSM110Service.SYSM110INS02(list);
			}

			if(rtn > 0) {
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
	 * @Method Name : SYSM110UPT01
	 * @작성일      : 2022.01.10
	 * @작성자      : bykim
	 * @변경이력    : 
	 * @Method 설명 : 태넌트기본정보 수정
	 * @param       : HttpServletRequest Restful param
	 * @return      : ModelAndView HashMap
	 */     
	@RequestMapping(value ="/SYSM110UPT01", method = RequestMethod.POST)
	@ResponseBody 
	public Map<String, Object> SYSM110UPT01(ModelAndView mav, @RequestBody String req, BindingResult bindingResult, Model model,
			SessionStatus status) {

		HashMap<String, Object> hashMap = new HashMap<String, Object>();
		JSONParser parser = new JSONParser();

		try {
			JSONObject obj = (JSONObject) parser.parse(req);

			SYSM100VO vo = new SYSM100VO();

			//태넌트 기본정보 start
			vo.setTenantId(String.valueOf(obj.get("tenantId")));
			vo.setDmnCd(String.valueOf(obj.get("dmnCd")));
			vo.setSpTypCd(String.valueOf(obj.get("spTypCd")));
			vo.setTenantStCd(String.valueOf(obj.get("tenantStCd")));
			vo.setFmnm(String.valueOf(obj.get("fmnm")));
			vo.setFmnmEng(String.valueOf(obj.get("fmnmEng")));
			vo.setSvcTypCd(String.valueOf(obj.get("svcTypCd")));
			vo.setOrgLvlCd(String.valueOf(obj.get("orgLvlCd")));
			vo.setMlingCd(String.valueOf(obj.get("mlingCd")));
			
	    	String emlSndGrpAddr = String.valueOf(obj.get("emlSndGrpsAddr"));
	        String cipherText = AES256Crypt.encrypt(emlSndGrpAddr);
			vo.setEmlSndGrpsAddr(cipherText);
			vo.setUsrAcCnt(String.valueOf(obj.get("usrAcCnt")));

			if(!cf.isStringEmpty(String.valueOf(obj.get("reprNm")))){
				vo.setReprNm(AES256Crypt.encrypt(String.valueOf(obj.get("reprNm"))));
			}
			if(!cf.isStringEmpty(String.valueOf(obj.get("reprNmEng")))){
				vo.setReprNmEng(AES256Crypt.encrypt(String.valueOf(obj.get("reprNmEng"))));
			}

			if(obj.get("tenantStRsnCd") != null) {
				vo.setTenantStRsnCd(String.valueOf(obj.get("tenantStRsnCd")));
			}

			DateUtil du = new DateUtil();
			if(!cf.isStringEmpty((String.valueOf(obj.get("svcContDd"))))){
				vo.setSvcContDd(du.getDate(String.valueOf(obj.get("svcContDd"))));
			}
			if(!cf.isStringEmpty((String.valueOf(obj.get("svcBltnDd"))))){
				vo.setSvcBltnDd(du.getDate(String.valueOf(obj.get("svcBltnDd"))));
			}
			if(!cf.isStringEmpty((String.valueOf(obj.get("svcExpryDd"))))){
				vo.setSvcExpryDd(du.getDate(String.valueOf(obj.get("svcExpryDd"))));
			}
			if(!cf.isStringEmpty((String.valueOf(obj.get("svcTrmnDd"))))){
				vo.setSvcTrmnDd(du.getDate(String.valueOf(obj.get("svcTrmnDd"))));
			}

			vo.setLstCorprId(String.valueOf(obj.get("lstCorprId")));
			vo.setLstCorprOrgCd(String.valueOf(obj.get("lstCorprOrgCd")));
			
			Integer rtn = SYSM110Service.SYSM110UPT01(vo);

			if(rtn > 0) {
				status.setComplete();
				hashMap.put("result", "Update Success");
				hashMap.put("msg", "정상적으로 변경하였습니다.");
			}

		}catch(Exception e) {
			LOGGER.error("["+e.getClass()+"] Exception : " + e.getMessage());
		}
		return hashMap;
	}
	
	
	/**
	 * @Method Name : SYSM110INS02
	 * @작성일      : 2022.01.10
	 * @작성자      : bykim
	 * @변경이력    : 
	 * @Method 설명 : 태넌트기본정보 신규등록
	 * @param       : HttpServletRequest Restful param
	 * @return      : ModelAndView HashMap
	 */   
	@RequestMapping(value ="/SYSM110UPT02", method = RequestMethod.POST)
	@ResponseBody 
	public Map<String, Object> SYSM110UPT02(ModelAndView mav, @RequestBody String req, BindingResult bindingResult, Model model,
			SessionStatus status)  {

		HashMap<String, Object> hashMap = new HashMap<String, Object>();
		JSONParser parser = new JSONParser();

		try {
			JSONObject obj = (JSONObject) parser.parse(req);
			Integer rtn = 0;
			
			// 태넌트 부가서비스  start
			JSONArray jsonArray = (JSONArray) obj.get("SYSM110VOList");
			List<SYSM110VO> list = new ArrayList<SYSM110VO>();
	
			for(int i=0; i<jsonArray.size(); i++){
				JSONObject jsonObject = (JSONObject) jsonArray.get(i);
				SYSM110VO SYSM110VO = new SYSM110VO();
	
				SYSM110VO.setTenantId(String.valueOf(jsonObject.get("tenantId")));
				SYSM110VO.setAdtnSvcSeq(Integer.parseInt(String.valueOf(jsonObject.get("adtnSvcSeq"))));
				SYSM110VO.setUseDvCd(String.valueOf(jsonObject.get("useDvCd")));
				SYSM110VO.setConnAddr(String.valueOf(jsonObject.get("connAddr")));
				SYSM110VO.setLcnsCunt(String.valueOf(jsonObject.get("lcnsCunt")));
				SYSM110VO.setAdtnSvcCd(String.valueOf(jsonObject.get("adtnSvcCd")));
				SYSM110VO.setRegrId(String.valueOf(jsonObject.get("regrId")));
				SYSM110VO.setRegrOrgCd(String.valueOf(jsonObject.get("regrOrgCd")));
				SYSM110VO.setLstCorprId(String.valueOf(jsonObject.get("lstCorprId")));
				SYSM110VO.setLstCorprOrgCd(String.valueOf(jsonObject.get("lstCorprOrgCd")));
				
				list.add(SYSM110VO);
			}
			// 부가서비스 insert
			if(list.size()>0) {
				rtn = SYSM110Service.SYSM110UPT02(list);
			}

			if(rtn > 0) {
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
	 * @Method Name : SYSM110DEL01
	 * @작성일      : 2022.01.10
	 * @작성자      : bykim
	 * @변경이력    : 
	 * @Method 설명 : 태넌트기본정보 삭제
	 * @param       : HttpServletRequest Restful param
	 * @return      : ModelAndView HashMap
	 */     
	@RequestMapping(value ="/SYSM110DEL01", method = RequestMethod.POST)
	@ResponseBody  
	public Map<String, Object> SYSM110DEL01(ModelAndView mav, @RequestBody String req, BindingResult bindingResult, Model model, 
			SessionStatus status) {

		HashMap<String, Object> hashMap = new HashMap<String, Object>();
		JSONParser parser = new JSONParser();

		try {
			JSONObject obj = (JSONObject) parser.parse(req);

			SYSM100VO vo = new SYSM100VO();
			vo.setTenantId(String.valueOf(obj.get("tenantId")));

			// 태넌트 기준정보 삭제
			 SYSM120Service.SYSM120DEL04(vo);
			// 태넌트 부가서비스 삭제
			SYSM110Service.SYSM110DEL02(vo);
			// 태넌트 기본정보 삭제
			int rtn = SYSM110Service.SYSM110DEL01(vo);

			if(rtn > 0) {
				status.setComplete();
				hashMap.put("result", "Delete Success");
				hashMap.put("msg", "정상적으로 삭제하였습니다.");
			}

		}catch(Exception e) {
			LOGGER.error("["+e.getClass()+"] Exception : " + e.getMessage());
			hashMap.put("msg", StringUtil.substringByLength(e.getCause().getMessage(),200));
		}


		return hashMap;
	}	
	
	/**
	 * @Method Name : SYSM110DEL02
	 * @작성일      : 2022.01.10
	 * @작성자      : bykim
	 * @변경이력    : 
	 * @Method 설명 : 태넌트기본정보 신규등록
	 * @param       : HttpServletRequest Restful param
	 * @return      : ModelAndView HashMap
	 */   
	@RequestMapping(value ="/SYSM110DEL02", method = RequestMethod.POST)
	@ResponseBody 
	public Map<String, Object> SYSM110DEL02(ModelAndView mav, @RequestBody String req, BindingResult bindingResult, Model model, 
			SessionStatus status)  {

		HashMap<String, Object> hashMap = new HashMap<String, Object>();
		JSONParser parser = new JSONParser();

		try {
			JSONObject obj = (JSONObject) parser.parse(req);
			Integer rtn = 0;
			
			// 태넌트 부가서비스  start
			JSONArray jsonArray = (JSONArray) obj.get("SYSM110VOList");
			List<SYSM110VO> list = new ArrayList<SYSM110VO>();
	
			for(int i=0; i<jsonArray.size(); i++){
				JSONObject jsonObject = (JSONObject) jsonArray.get(i);
				SYSM110VO SYSM110VO = new SYSM110VO();
	
				SYSM110VO.setTenantId(String.valueOf(jsonObject.get("tenantId")));
				SYSM110VO.setAdtnSvcSeq(Integer.parseInt(String.valueOf(jsonObject.get("adtnSvcSeq"))));
				
				list.add(SYSM110VO);
			}
			// 부가서비스 insert
			if(list.size()>0) {
				rtn = SYSM110Service.SYSM110DEL03(list);
			}

			if(rtn > 0) {
				status.setComplete();
				hashMap.put("result", "Insert Success");
				hashMap.put("msg", "정상적으로 등록하였습니다.");
			}

		}catch(Exception e) {
			LOGGER.error("["+e.getClass()+"] Exception : " + e.getMessage());
		}


		return hashMap;

	}


}
