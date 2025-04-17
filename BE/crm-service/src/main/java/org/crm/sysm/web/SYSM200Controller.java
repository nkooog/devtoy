package org.crm.sysm.web;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;
import org.crm.config.spring.config.PropertiesService;
import org.crm.frme.model.vo.FRME160VO;
import org.crm.frme.service.FRME160Service;
import org.crm.lgin.model.vo.LGIN000VO;
import org.crm.sysm.model.service.SYSM200Service;
import org.crm.sysm.model.vo.SYSM200VO;
import org.crm.util.com.ComnFun;
import org.crm.util.crypto.AES256Crypt;
import org.crm.util.crypto.SHA256Util;
import org.crm.util.date.DateUtil;
import org.crm.util.file.FileUtils;
import org.crm.util.string.StringUtil;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.support.SessionStatus;
import org.springframework.web.servlet.ModelAndView;

import java.sql.Timestamp;
import java.util.*;

/***********************************************************************************************
* Program Name : 사용자 정보관리 Main Controller
* Creator      : 허해민
* Create Date  : 2022.01.17
* Description  : 사용자 정보관리
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.01.17     허해민           최초생성
************************************************************************************************/
@Slf4j
@Controller
@RequestMapping("/sysm/*")
public class SYSM200Controller {

	@Resource(name = "SYSM200Service")
	private SYSM200Service SYSM200Service;
	
	@Resource(name = "FRME160Service")
	private FRME160Service FRME160Service;

	@Autowired
	private PropertiesService propertiesService;

	private ObjectMapper objectMapper;
	private MessageSource messageSource;

	@Autowired
	public SYSM200Controller(ObjectMapper objectMapper, MessageSource messageSource) {
		this.objectMapper = objectMapper;
		this.messageSource = messageSource;
	}

	private static final Logger LOGGER = LoggerFactory.getLogger(SYSM200Controller.class);

	/**
	 * @Method Name : SYSM200M
	 * @작성일      	: 2022.01.17
	 * @작성자      	: 허해민
	 * @변경이력    	:
	 * @Method 설명 	: sysm/SYSM200M 웹 페이지 열기
	 * @param           :
	 * @return          : sysm/SYSM200M.jsp
	 */
	@RequestMapping("/SYSM200M")
	public String SYSM200M(Model model) {
		LOGGER.info("SYSM200M 페이지 열기");
		model.addAttribute("usrIp", ComnFun.getClientIP());
		return "th/sysm/SYSM200M";
	}

	/**
	 * @Method Name : SYSM210T
	 * @작성일      	: 2022.04.19
	 * @작성자      	: sukim
	 * @변경이력    	:
	 * @Method 설명 	: sysm/SYSM210T 웹 페이지 열기
	 * @param           :
	 * @return          : sysm/SYSM210T.jsp
	 */	
	@RequestMapping("/SYSM210T")
	public String SYSM210T(Model model) {
		ModelAndView mav = new ModelAndView("sysm/SYSM210T");
		return "th/sysm/SYSM210T";
	}	

	/**
	 * @Method Name : SYSM220T
	 * @작성일      	: 2022.04.19
	 * @작성자      	: sukim
	 * @변경이력    	:
	 * @Method 설명 	: sysm/SYSM220T 웹 페이지 열기
	 * @param           :
	 * @return          : sysm/SYSM220T.jsp
	 */	
	@RequestMapping("/SYSM220T")
	public String SYSM220T(Model model) {
		ModelAndView mav = new ModelAndView("th/sysm/SYSM220T");
		return "th/sysm/SYSM220T";
	}	
	
	/**
	 * @Method Name : SYSM200SEL01
	 * @작성일      	: 2022.01.17
	 * @작성자      	: 허해민
	 * @변경이력    	:
	 * @Method 설명 	: 사용자정보 목록조회
	 * @param           : HttpServletRequest Restful param
	 * @return          : ModelAndView HashMap
	 */
	@PostMapping(value = "/SYSM200SEL01")
	@ResponseBody
	public Map<String, Object> SYSM200SEL01(Locale locale, ModelMap model, @RequestBody String request) {

		HashMap<String, Object> sys200hashMap = new HashMap<String, Object>();
		JSONParser parser = new JSONParser();

		try {
			JSONObject obj = (JSONObject) parser.parse(request);
			JSONArray grdListArray = (JSONArray) obj.get("usrGrd");
			JSONArray orgListArray = (JSONArray) obj.get("orgList");
			JSONArray usrListArray = (JSONArray) obj.get("usrList");

			SYSM200VO vo = SYSM200VO.builder()
					.tenantId((String) obj.get("tenantId"))
					.retireYn((String) obj.get("retireYn"))
					.originUsrGrd((String) obj.get("originUsrGrd")) // 2023. 05. 25 사용자 등급 900,910 이하에서는 시스템관리자, 개발자 조회 X
					.build();

			if(orgListArray.size()>0) {
				List<String> orgList = new ArrayList<>();
				for(int i=0; i< orgListArray.size(); i++){
					orgList.add(orgListArray.get(i).toString());
				}
				vo.setOrgList(orgList);
			}
			if(usrListArray.size()>0) {
				List<String> usrList = new ArrayList<>();
				for(int i=0; i< usrListArray.size(); i++){
					usrList.add(usrListArray.get(i).toString());
				}
				vo.setUsrList(usrList);
			}
			if(grdListArray.size()>0) {
				List<String> grdList = new ArrayList<>();
				for(int i=0; i< grdListArray.size(); i++){
					grdList.add(grdListArray.get(i).toString());
				}
				vo.setGrdList(grdList);
			}
			
			//목록조회
			List<SYSM200VO> SYSM200SEL01List = SYSM200Service.SYSM200SEL01(vo);
			//복호화처리
			SYSM200VO SYSM200M_userVO = new SYSM200VO();
			List<SYSM200VO> SYSM200M_SEL01List = new ArrayList<SYSM200VO>();

			for(int i=0; i<SYSM200SEL01List.size(); i++) {

				SYSM200M_userVO = SYSM200VO.builder()
						.tenantId(SYSM200SEL01List.get(i).getTenantId())
						.usrId(SYSM200SEL01List.get(i).getUsrId())
						.decUsrNm(AES256Crypt.decrypt(SYSM200SEL01List.get(i).getUsrNm()))
						.orgCd(SYSM200SEL01List.get(i).getOrgCd())
						.orgPath(SYSM200SEL01List.get(i).getOrgPath())
						.acStCdNm(SYSM200SEL01List.get(i).getAcStCd())
						.usrGrdNm(SYSM200SEL01List.get(i).getUsrGrdNm())
						.acStCdNm(SYSM200SEL01List.get(i).getAcStCdNm())
						.build();

				SYSM200M_SEL01List.add(SYSM200M_userVO);
			}

			sys200hashMap.put("SYSM200SEL01List"     , this.objectMapper.writeValueAsString(SYSM200M_SEL01List));
			sys200hashMap.put("SYSM200SEL01ListCount", SYSM200M_SEL01List.size());

    	}catch(Exception e) {
			e.printStackTrace();
    		LOGGER.error("["+e.getClass()+"] Exception : " + e.getMessage());
    	}
		return sys200hashMap;
	}

	/**
	 * @Method Name     : SYSM200SEL03
	 * @작성일      	: 2022.04.12
	 * @작성자      	: sukim
	 * @변경이력    	:
	 * @Method 설명 	: 사용자 상세정보 조회 - 상담채널권한, 메뉴권한, 부가솔루션권한 제외
	 * @param           : HttpServletRequest Restful param
	 * @return          : ModelAndView HashMap
	 * @throws Exception 
	 */   
	@PostMapping(value ="/SYSM200SEL02")
	@ResponseBody  
	public Map<String, Object> SYSM200SEL02(Locale locale, @RequestBody String request) throws Exception {

		HashMap<String, Object> sys200hashMap = new HashMap<String, Object>();
		JSONParser parser = new JSONParser();

		try {
			JSONObject sys200obj = (JSONObject) parser.parse(request);
			ComnFun cf = new ComnFun();

			SYSM200VO sys200sel02vo = SYSM200VO.builder()
					.tenantId(String.valueOf(sys200obj.get("tenantId")))
					.usrId(String.valueOf(sys200obj.get("usrId")))
					.orgCd(String.valueOf(sys200obj.get("orgCd")))
					.build();

			SYSM200VO usrBascInfo = SYSM200Service.SYSM200SEL02(sys200sel02vo);
			
			//복호화 처리
//			if(!cf.isStringEmpty(usrBascInfo.getScrtNo())){
//				usrBascInfo.setDecScrtNo(AES256Crypt.decrypt(usrBascInfo.getScrtNo()));
//			}
			
			usrBascInfo.setDecScrtNo(usrBascInfo.getScrtNo());
			
			if(!cf.isStringEmpty(usrBascInfo.getUsrNm())){
				usrBascInfo.setDecUsrNm(AES256Crypt.decrypt(usrBascInfo.getUsrNm()));
			}
			if(!cf.isStringEmpty(usrBascInfo.getMbphNo())){
				usrBascInfo.setDecMbphNo(AES256Crypt.decrypt(usrBascInfo.getMbphNo()));
			}
			if(!cf.isStringEmpty(usrBascInfo.getEmlAddrIsd())){
				usrBascInfo.setDecEmlAddrIsd(AES256Crypt.decrypt(usrBascInfo.getEmlAddrIsd()));
			}
			if(!cf.isStringEmpty(usrBascInfo.getEmlAddrExtn())){
				usrBascInfo.setDecEmlAddrExtn(AES256Crypt.decrypt(usrBascInfo.getEmlAddrExtn()));
			}			

			sys200hashMap.put("SYSM200SEL02Result", this.objectMapper.writeValueAsString(usrBascInfo));
			sys200hashMap.put("SYSM200SEL02Msg"   , this.messageSource.getMessage("success.common.select", null, "success select", locale));

		}catch(Exception e) {
			e.printStackTrace();
			LOGGER.error("["+e.getClass()+"] Exception : " + e.getMessage());
		}
		
		return sys200hashMap;
	}		
	
	/**
	 * @Method Name     : SYSM200SEL03
	 * @작성일      	: 2022.01.17
	 * @작성자      	: 허해민
	 * @변경이력    	:
	 * @Method 설명 	: 아이디 중복 체크 
	 * @param           : HttpServletRequest Restful param
	 * @return          : ModelAndView HashMap
	 * @throws Exception 
	 */   
	@PostMapping(value ="/SYSM200SEL03")
	@ResponseBody  
	public Map<String, Object> SYSM200SEL03(Locale locale, @RequestBody String request) throws Exception {

		HashMap<String, Object> sys200hashMap = new HashMap<String, Object>();
		JSONParser parser = new JSONParser();

		try {
			JSONObject sys200obj = (JSONObject) parser.parse(request);
			SYSM200VO sys200vo = SYSM200VO.builder()
					.tenantId(String.valueOf(sys200obj.get("tenantId")))
					.usrId(String.valueOf(sys200obj.get("usrId")))
					.build();

			int chkUsrId = SYSM200Service.SYSM200SEL03(sys200vo);
			sys200hashMap.put("chkusrIdcnt",chkUsrId);
		}catch(Exception e) {
			e.printStackTrace();
			LOGGER.error("["+e.getClass()+"] Exception : " + e.getMessage());
		}
		return sys200hashMap;
	}	

	/**
	 * @Method Name     : SYSM210INS01
	 * @작성일      	: 2022.04.29
	 * @작성자      	: sukim
	 * @변경이력    	: 
	 * @Method 설명  	: 사용자기본정보 신규등록/변경
	 * @param           : HttpServletRequest Restful param
	 * @return          : ModelAndView HashMap
	 */   
	@PostMapping(value ="/SYSM210INS01")
	@ResponseBody 
	public Map<String, Object> SYSM210INS01(Locale locale, @RequestBody String request, SessionStatus status)  {

		HashMap<String, Object> sys200hashMap = new HashMap<String, Object>();
		JSONParser parser = new JSONParser();

		try {
			ComnFun cf = new ComnFun();
			JSONObject sys200obj = (JSONObject) parser.parse(request);
			SYSM200VO sys200vo = new SYSM200VO();

			String cnslGrpCd = StringUtil.nullToBlank(sys200obj.get("cnslGrpCd"));
			
			sys200vo.setUsrId(String.valueOf(sys200obj.get("usrId"))); 							
			sys200vo.setTenantId(String.valueOf(sys200obj.get("tenantId")));
			sys200vo.setCnslGrpCd(cnslGrpCd);
			sys200vo.setUsrAlnm(String.valueOf(sys200obj.get("usrAlnm")));
			sys200vo.setUsrAlnmUseYn(String.valueOf(sys200obj.get("usrAlnmUseYn")));
			sys200vo.setAcStCd(String.valueOf(sys200obj.get("acStCd")));
			sys200vo.setOrgCd(String.valueOf(sys200obj.get("orgCd"))); 
			sys200vo.setUsrGrd(String.valueOf(sys200obj.get("usrGrd"))); 
			sys200vo.setCntyCd(String.valueOf(sys200obj.get("cntyCd")));
			sys200vo.setEmlAddrIsdDmn(String.valueOf(sys200obj.get("emlAddrIsdDmn"))); 
			sys200vo.setEmlAddrIsdDmnCd(String.valueOf(sys200obj.get("emlAddrIsdDmnCd")));
			sys200vo.setEmlAddrExtnDmn(String.valueOf(sys200obj.get("emlAddrExtnDmn"))); 
			sys200vo.setEmlAddrExtnDmnCd(String.valueOf(sys200obj.get("emlAddrExtnDmnCd")));
			//AES256 암호화처리 :사용자명, 휴대폰번호, 이메일아이디
			sys200vo.setUsrNm(AES256Crypt.encrypt(String.valueOf(sys200obj.get("usrNm"))));
			sys200vo.setSrchKeyword1(AES256Crypt.encrypt(cf.subStringBytes(String.valueOf(sys200obj.get("usrNm")),4,3)));
			sys200vo.setSrchKeyword2(AES256Crypt.encrypt(cf.subStringBytes(String.valueOf(sys200obj.get("usrNm")),6,3)));
			sys200vo.setMbphNo(AES256Crypt.encrypt(String.valueOf(sys200obj.get("mbphNo"))));
	        if(!cf.isStringEmpty((String.valueOf(sys200obj.get("emlAddrIsd"))))){
	        	sys200vo.setEmlAddrIsd(AES256Crypt.encrypt(String.valueOf(sys200obj.get("emlAddrIsd"))));
	        }
	        if(!cf.isStringEmpty((String.valueOf(sys200obj.get("emlAddrExtn"))))){
	        	sys200vo.setEmlAddrExtn(AES256Crypt.encrypt(String.valueOf(sys200obj.get("emlAddrExtn"))));
	        }

	        if(!cf.isStringEmpty((String.valueOf(sys200obj.get("qualAcqsDd"))))){
	        	sys200vo.setQualAcqsDd(String.valueOf(sys200obj.get("qualAcqsDd")));
			}
			if(!cf.isStringEmpty((String.valueOf(sys200obj.get("qualLossDd"))))){
				sys200vo.setQualLossDd(String.valueOf(sys200obj.get("qualLossDd")));
			}
			//텔레셋정보
			sys200vo.setCtiUseYn(String.valueOf(sys200obj.get("ctiUseYn"))); 					
			sys200vo.setCtiAgenId(String.valueOf(sys200obj.get("ctiAgenId")));					
			sys200vo.setUseTermIpAddr(String.valueOf(sys200obj.get("useTermIpAddr"))); 						
			sys200vo.setExtNo(String.valueOf(sys200obj.get("extNo"))); 
			//권한설정
			sys200vo.setUnfyBlbdCreAthtYn(String.valueOf(sys200obj.get("unfyBlbdCreAthtYn")));
			sys200vo.setKldCtgrCreAtht(String.valueOf(sys200obj.get("kldCtgrCreAtht")));
			sys200vo.setAthtLvlOrgCd(String.valueOf(sys200obj.get("athtLvlOrgCd")));
			sys200vo.setAthtLvlDtCd(String.valueOf(sys200obj.get("athtLvlDtCd")));
			sys200vo.setChatChnlPmssCntCd(String.valueOf(sys200obj.get("chatChnlPmssCntCd")));
			sys200vo.setKldScwdSaveYn(String.valueOf(sys200obj.get("kldScwdSaveYn")));
			sys200vo.setAutoPfcnUseYn(String.valueOf(sys200obj.get("autoPfcnUseYn")));
			sys200vo.setCmmtSetlmnYn(String.valueOf(sys200obj.get("cmmtSetlmnYn")));
			sys200vo.setKldMgntSetlmnYn(String.valueOf(sys200obj.get("kldMgntSetlmnYn")));
			sys200vo.setRegrId(String.valueOf(sys200obj.get("regrId")));
			sys200vo.setRegrOrgCd(String.valueOf(sys200obj.get("regrOrgCd")));
			sys200vo.setLstCorprId(String.valueOf(sys200obj.get("lstCorprId")));
			sys200vo.setLstCorprOrgCd(String.valueOf(sys200obj.get("lstCorprOrgCd")));
			
			String isNew = StringUtil.nullToBlank(sys200obj.get("isNew"));
			
			SYSM200VO sysm200ChnVo = new SYSM200VO();
			List<SYSM200VO> sysm200ChnVolist = new ArrayList<SYSM200VO>();
			sysm200ChnVo.setTenantId(sys200vo.getTenantId().toString());
			sysm200ChnVo.setUsrId(sys200vo.getUsrId().toString());
			sysm200ChnVo.setCnslChnlDvCd("C11");	//초기값으로 C11 고정
			sysm200ChnVo.setChatChnlPmssCntCd(sys200vo.getChatChnlPmssCntCd().toString());
			sysm200ChnVo.setRegrId(sys200vo.getRegrId().toString());
			sysm200ChnVo.setRegrOrgCd(sys200vo.getRegrOrgCd().toString());
			sysm200ChnVo.setLstCorprId(sys200vo.getLstCorprId().toString());
			sysm200ChnVo.setLstCorprOrgCd(sys200vo.getLstCorprOrgCd().toString());
			sysm200ChnVo.setUsrGrd(sys200vo.getUsrGrd().toString());
			sysm200ChnVolist.add(sysm200ChnVo);
			
			
			//패스워드 단방향 가변 salt 적용
			String scrtNoLstUpdDtm = DateUtil.getTimeStampString(locale);
			String secretKey = SHA256Util.genSaltKey(sys200vo.getTenantId(), sys200vo.getUsrId(), scrtNoLstUpdDtm);
			sys200vo.setScrtNoLstUpdDtm(scrtNoLstUpdDtm);
			sys200vo.setScrtNo(SHA256Util.encrypt(secretKey, String.valueOf(sys200obj.get("scrtNo"))));

			int isSYSM200Count = SYSM200Service.SYSM200SEL04(sys200vo);
			if(isSYSM200Count > 0) {
				if("Y".equals(isNew)) {
					SYSM200Service.SYSM200INS01(sys200vo);				//T_USR_INFO_MGNT
					SYSM200Service.SYSM200INS02(sys200vo);				//T_TELE_SET_INF
					SYSM200Service.SYSM200INS03(sys200vo);				//T_ENVR_STGUP
					
					//확장정보 상담채널
					SYSM200Service.SYSM220DEL01(sysm200ChnVo);			//T_CNSL_CHNL_ATHT
					SYSM200Service.SYSM220INS01(sysm200ChnVolist);		//T_CNSL_CHNL_ATHT
					SYSM200Service.SYSM220UPT01(sysm200ChnVo);			//T_CNSL_CHNL_ATHT
					
					//확장정보 > 메뉴권한
					SYSM200Service.SYSM220DEL02(sysm200ChnVo);			//T_USR_MENU_ATHT
					SYSM200Service.SYSM220INS02(sysm200ChnVolist);		//T_USR_MENU_ATHT
					SYSM200Service.SYSM220UPT02(sysm200ChnVo);			//T_USR_MENU_ATHT
					
					//환결설정 기본
					FRME160VO frme160vo = new FRME160VO();
					frme160vo.setTenantId(sys200vo.getTenantId());
					frme160vo.setUsrId(sys200vo.getUsrId());
					frme160vo.setRegrId(sys200vo.getUsrId());
					frme160vo.setRegrOrgCd(sys200vo.getRegrOrgCd());
					frme160vo.setLstCorprId(sys200vo.getLstCorprId());
					frme160vo.setLstCorcOrgCd(sys200vo.getLstCorprOrgCd());					
					frme160vo.setAlrmEffctUseYn("Y");			//알림효과 사용
					frme160vo.setAlrmUseYn("Y");				//알림 사용
					frme160vo.setAlrmPoupEffctUseYn("Y");		//알림 팝업 효과 사용					
					frme160vo.setMsgrUseYn("Y");				//부가서비스
					frme160vo.setSmsUseYn("Y");					//SMS
					frme160vo.setKldSrchUseYn("Y");				//KMS
					frme160vo.setQLnkUseYn("Y");				//Quick Link
					frme160vo.setFavrlistUseYn("Y");			//Favorit List
					frme160vo.setHlpdkUseYn("Y");				//핼프데스크
					frme160vo.setMiniDashUseYn("N");			//미니전광판사용여부
					frme160vo.setSoftPnUseYn("Y");				//소프트폰 사용여부
					frme160vo.setMcqUseYn("N");					//MCQ사용 여부
					frme160vo.setDaulMoniUseYn("N");			//듀얼 모니터 사용 여부
					frme160vo.setSknCd("E");					//기본 테마 (색상)					
					FRME160Service.FRME160UPT01(frme160vo);
					
					//최근 패스워드 변경 이력 검증용 추가
					sys200vo.setRegDtm(scrtNoLstUpdDtm);				
					SYSM200Service.SYSM200INS04(sys200vo);				//T_USR_PASS_HIST
					
				} else {
					SYSM200Service.SYSM200UPT03(sys200vo);
				}
				
				sys200hashMap.put("result", "1");        //1:성공 그외:에러
				sys200hashMap.put("msg", messageSource.getMessage("success.common.insert", null, "success.common.insert", locale));		
			}else {
				sys200hashMap.put("result", "9"); 
				sys200hashMap.put("msg", messageSource.getMessage("aicrm.error.tenantInfo", null, "aicrm.error.tenantInfo", locale));		
			}
		}catch(Exception e) {
			LOGGER.error("["+e.getClass()+"] Exception : " + e.getMessage());
			e.printStackTrace();
		}
		return sys200hashMap;
	}
	
	/**
	 * @Method Name     : SYSM200UPT01
	 * @작성일      	: 2022.01.17
	 * @작성자      	: sukim
	 * @변경이력    	:
	 * @Method 설명 	: 비밀번호 초기화
	 * @param           : HttpServletRequest Restful param
	 * @return          : ModelAndView HashMap
	 */
	@PostMapping(value = "/SYSM210UPT01")
	@ResponseBody
	public Map<String, Object> SYSM210UPT01(Locale locale, ModelAndView mav, @RequestBody String request, SessionStatus status) {

		HashMap<String, Object> sys200hashMap = new HashMap<String, Object>();
		JSONParser parser = new JSONParser();

		try {
			JSONObject sys200obj = (JSONObject) parser.parse(request);

			SYSM200VO sys200vo = SYSM200VO.builder()
					.tenantId(String.valueOf(sys200obj.get("tenantId")))
					.usrId(String.valueOf(sys200obj.get("usrId")))
					.lstCorprId(String.valueOf(sys200obj.get("lstCorprId")))
					.lstCorprOrgCd(String.valueOf(sys200obj.get("lstCorprOrgCd")))
					.build();

			String scrtNoLstUpdDtm = DateUtil.getTimeStampString(locale);
			String newPw = SHA256Util.encrypt(
					SHA256Util.genSaltKey(sys200vo.getTenantId(), sys200vo.getUsrId(), scrtNoLstUpdDtm),
					AES256Crypt.decrypt(propertiesService.getString("newPw")));
			
			sys200vo.setScrtNo(newPw);	 //2023.01.27 암호화된 초기비밀번호
			sys200vo.setScrtNoLstUpdDtm(scrtNoLstUpdDtm);
			
	        int result = 0;
	        int hisResult = 0;
	        
	        result = SYSM200Service.SYSM200UPT01(sys200vo);
	        
	        //pwd 변경 이력 업데이트
	        if(result > 0) {
	        	hisResult = SYSM200Service.SYSM200UPT05(sys200vo);
	        	
	        	//패스워드 변경 히스토리 기록 : 등록자 정보 추가
		        sys200vo.setRegDtm(scrtNoLstUpdDtm);
		        sys200vo.setRegrId(sys200vo.getLstCorprId());
		        sys200vo.setRegrOrgCd(sys200vo.getLstCorprOrgCd());
		        sys200vo.setLstCorcDtm(scrtNoLstUpdDtm);
		        
		        hisResult = SYSM200Service.SYSM200INS04(sys200vo);
	        }
	        
	        String message = "";
	        if (hisResult > 0) {
				status.setComplete();
				message = messageSource.getMessage("success.common.update", null, "success.common.update", locale);
			}else {
				message = messageSource.getMessage("fail.common.update", null, "fail.common.update", locale);
			}
	        sys200hashMap.put("result", message);
	        sys200hashMap.put("msg", message);
    	}catch(Exception e) {
			e.printStackTrace();
    		LOGGER.error("["+e.getClass()+"] Exception : " + e.getMessage());
    	}
		return sys200hashMap;
	}	

	/**
	 * @Method Name     : SYSM210UPT02
	 * @작성일      	: 2022.04.29
	 * @작성자      	: sukim
	 * @변경이력    	:
	 * @Method 설명 	: 계정잠김해제
	 * @param           : HttpServletRequest Restful param
	 * @return          : ModelAndView HashMap
	 */
	@PostMapping(value = "/SYSM210UPT02")
	@ResponseBody
	public Map<String, Object> SYSM210UPT02(Locale locale, @RequestBody String request, SessionStatus status) {

		HashMap<String, Object> sys200hashMap = new HashMap<String, Object>();
		JSONParser parser = new JSONParser();

		try {
			JSONObject sys200obj = (JSONObject) parser.parse(request);
			SYSM200VO sys200vo = SYSM200VO.builder()
					.tenantId(String.valueOf(sys200obj.get("tenantId")))
					.usrId(String.valueOf(sys200obj.get("usrId")))
					.lstCorprId(String.valueOf(sys200obj.get("lstCorprId")))
					.lstCorprOrgCd(String.valueOf(sys200obj.get("lstCorprOrgCd")))
					.build();

	        int result = SYSM200Service.SYSM200UPT02(sys200vo);	        
	        String message = "";
	        if (result > 0) {
				status.setComplete();
				message = messageSource.getMessage("success.common.update", null, "success.common.update", locale);
			}else {
				message = messageSource.getMessage("fail.common.update", null, "fail.common.update", locale);
			}
	        
	        sys200hashMap.put("result", message);
	        sys200hashMap.put("msg", message);
    	}catch(Exception e) {
			e.printStackTrace();
    		LOGGER.error("["+e.getClass()+"] Exception : " + e.getMessage());
    	}
		return sys200hashMap;
	}
	
	/**
	 * @Method Name : SYSM210UPT04
	 * @작성일      	: 2025.02.13
	 * @작성자      	: sjyang
	 * @변경이력    	:
	 * @Method 설명 	: 비밀번호 변경 기간 연장 (90일)
	 * @param       : HttpServletRequest Restful param
	 * @return      : ModelAndView HashMap
	 */
	@PostMapping(value = "/SYSM210UPT04")
	@ResponseBody
	public Map<String, Object> SYSM210UPT04(Locale locale, @RequestBody String request, SessionStatus status, HttpSession session) {	    
		HashMap<String, Object> sys200hashMap = new HashMap<String, Object>();
		JSONParser parser = new JSONParser();
		try {
			Timestamp scrtNoLstUpdDtm = DateUtil.getTimeStamp(locale);
			LGIN000VO sessionVo = (LGIN000VO)session.getAttribute("user");
			sessionVo.setScrtNoLstUpdDtm(scrtNoLstUpdDtm);					//saltKey 생성용 날짜 기록
			
			JSONObject sys200obj = (JSONObject) parser.parse(request);
			SYSM200VO sys200vo = SYSM200VO.builder()
					.tenantId(String.valueOf(sys200obj.get("tenantId")))
					.usrId(String.valueOf(sys200obj.get("usrId")))
					.lstCorprId(String.valueOf(sys200obj.get("lstCorprId")))
					.lstCorprOrgCd(String.valueOf(sys200obj.get("lstCorprOrgCd")))
					.build();
			
			sys200vo.setScrtNoLstUpdDtm(DateUtil.TimestampTostr(scrtNoLstUpdDtm));
			sys200vo.setScrtNo(
					SHA256Util.encrypt(SHA256Util.genSaltKey(sessionVo), AES256Crypt.decrypt(sessionVo.getLstLginScrtNo())));
			
	        int result = SYSM200Service.SYSM200UPT04(sys200vo);
			
	        String message = "";
	        if (result > 0) {
				status.setComplete();
				message = messageSource.getMessage("success.common.update", null, "success.common.update", locale);
			}else {
				message = messageSource.getMessage("fail.common.update", null, "fail.common.update", locale);
			}
	        
	        sys200hashMap.put("result", message);
	        sys200hashMap.put("msg", message);
    	}catch(Exception e) {
			e.printStackTrace();
    		LOGGER.error("["+e.getClass()+"] Exception : " + e.getMessage());
    	}
		return sys200hashMap;
	}
	
	
	/**
	 * @Method Name     : SYSM210DEL01
	 * @작성일      	: 2022.01.17
	 * @작성자      	: sukim
	 * @변경이력    	: 
	 * @Method 설명 	: 사용자기본정보 삭제
	 * @param           : HttpServletRequest Restful param
	 * @return          : ModelAndView HashMap
	 * @throws Exception 
	 */     
	@PostMapping(value ="/SYSM210DEL01")
	@ResponseBody  
	public Map<String, Object> SYSM210DEL01(Locale locale, @RequestBody String request,  SessionStatus status){

		HashMap<String, Object> sys200hashMap = new HashMap<String, Object>();
		JSONParser parser = new JSONParser();
		
		try {
			JSONObject sys200obj = (JSONObject) parser.parse(request);
			SYSM200VO sys200vo = this.objectMapper.convertValue(sys200obj, SYSM200VO.class);

    		//기존 사진 제거
    		if(sys200obj.get("potoImgIdxFileNm") !="") {
    			FileUtils.removeFile((String) sys200obj.get("potoImgPsn"), (String) sys200obj.get("potoImgIdxFileNm"));
    		}
    		
    		/*
    		 * foreign key 설정으로 T_사용자정보관리 삭제여부만 판단
    		 */
    		//확장정보:상담채널 삭제
    		SYSM200Service.SYSM220DEL01(sys200vo);
    		
    		//확장정보:메뉴권한 삭제
    		SYSM200Service.SYSM220DEL02(sys200vo);
    		
    		//확장정보:부가솔루션 삭제
    		SYSM200Service.SYSM220DEL03(sys200vo);
    		
    		//텔레셋 정보 삭제
    		SYSM200Service.SYSM210DEL02(sys200vo);
    		
    		//패스워드 변경이력 
    		SYSM200Service.SYSM210DEL03(sys200vo);
    		
    		//T_환경설정
    		SYSM200Service.SYSM210DEL04(sys200vo);
    		
			//기본정보 삭제
    		int rtn = SYSM200Service.SYSM210DEL01(sys200vo);
			 
			if(rtn > 0) {
				status.setComplete();
				sys200hashMap.put("result", "1"); //성공 :1 에러:그외
				sys200hashMap.put("msg", messageSource.getMessage("success.common.delete", null, "success.common.delete", locale));	
			}
		} catch(Exception e) {
			sys200hashMap.put("result", "9"); //성공 :1 에러:그외
			sys200hashMap.put("msg", StringUtil.substringByLength(e.getCause().getMessage(),200));
			e.printStackTrace();
			LOGGER.error("["+e.getClass()+"] Exception : " + e.getMessage());
		}

		return sys200hashMap;
	}
	
	/**
	 * @Method Name     : SYSM220INS01
	 * @작성일      	: 2022.07.07
	 * @작성자      	: sukim
	 * @변경이력    	: 
	 * @Method 설명	    : 상담채널권한 등록
	 * @param           : HttpServletRequest Restful param
	 * @return          : ModelAndView HashMap
	 */
	@PostMapping(value = "/SYSM220INS01")
	@ResponseBody
	public Map<String, Object> SYSM220INS01(Locale locale, @RequestBody String request, SessionStatus status) {

		HashMap<String, Object> sysm220ins01hashMap = new HashMap<String, Object>();
		JSONParser parser = new JSONParser();

		try {
			LOGGER.info("SYSM220INS01 ==================================== ");
			JSONObject sysm220ins01obj = (JSONObject) parser.parse(request);
			SYSM200VO sysm200ins01vo = new SYSM200VO();
			String SYSM220INS01_tenantId = String.valueOf(sysm220ins01obj.get("tenantId"));
			String SYSM220INS01_usrId = String.valueOf(sysm220ins01obj.get("usrId"));
			String SYSM220INS01_cnslChnlDvCd = String.valueOf(sysm220ins01obj.get("cnslChnlDvCd"));
			String SYSM220INS01_chatChnlPmssCntCd = String.valueOf(sysm220ins01obj.get("chatChnlPmssCntCd"));
			String SYSM220INS01_regrId = String.valueOf(sysm220ins01obj.get("regrId"));
			String SYSM220INS01_regrOrgCd = String.valueOf(sysm220ins01obj.get("regrOrgCd"));
			String SYSM220INS01_lstCorprId = String.valueOf(sysm220ins01obj.get("lstCorprId"));
			String SYSM220INS01_lstCorprOrgCd = String.valueOf(sysm220ins01obj.get("lstCorprOrgCd"));
			String[] arrCode = String.valueOf(sysm220ins01obj.get("chnAuthList")).split(","); 
			
			sysm200ins01vo.setTenantId(SYSM220INS01_tenantId);
			sysm200ins01vo.setUsrId(SYSM220INS01_usrId); 
			sysm200ins01vo.setCnslChnlDvCd(SYSM220INS01_cnslChnlDvCd);
			sysm200ins01vo.setChatChnlPmssCntCd(SYSM220INS01_chatChnlPmssCntCd);
			sysm200ins01vo.setRegrId(SYSM220INS01_regrId);
			sysm200ins01vo.setRegrOrgCd(SYSM220INS01_regrOrgCd);
			sysm200ins01vo.setLstCorprId(SYSM220INS01_lstCorprId);
			sysm200ins01vo.setLstCorprOrgCd(SYSM220INS01_lstCorprOrgCd);
			
			List<SYSM200VO> sysm200volist = new ArrayList<SYSM200VO>();
			for(int i=0; i< arrCode.length; i++){
				SYSM200VO cnslChnVO = new SYSM200VO();
				cnslChnVO.setTenantId(SYSM220INS01_tenantId);
				cnslChnVO.setUsrId(SYSM220INS01_usrId); 
				cnslChnVO.setCnslChnlDvCd(((arrCode[i].replaceAll("\\\"","")).replaceAll("\\[","")).replaceAll("\\]",""));
				cnslChnVO.setRegrId(SYSM220INS01_regrId);
				cnslChnVO.setRegrOrgCd(SYSM220INS01_regrOrgCd);
				cnslChnVO.setLstCorprId(SYSM220INS01_lstCorprId);
				cnslChnVO.setLstCorprOrgCd(SYSM220INS01_lstCorprOrgCd);
				sysm200volist.add(cnslChnVO);
			}
			
			if(sysm200volist.size()>0) {
				int sysm220del01rtn = SYSM200Service.SYSM220DEL01(sysm200ins01vo);
				int sysm220ins01rtn = SYSM200Service.SYSM220INS01(sysm200volist);
				int sysm220upt01rtn = SYSM200Service.SYSM220UPT01(sysm200ins01vo);
				sysm220ins01hashMap.put("sysm220del01rtn", sysm220del01rtn);
				sysm220ins01hashMap.put("sysm220ins01rtn", sysm220ins01rtn);
				sysm220ins01hashMap.put("sysm220upt01rtn", sysm220upt01rtn);
				if(sysm220del01rtn+sysm220ins01rtn+sysm220upt01rtn >=2) {
					status.setComplete();
					sysm220ins01hashMap.put("msg", messageSource.getMessage("success.common.insert", null, "success.common.insert", locale));				
				}else {
					sysm220ins01hashMap.put("msg", messageSource.getMessage("aicrm.error.tenantInfo", null, "aicrm.error.tenantInfo", locale));
				}
		    }
		}catch(Exception e) {
			e.printStackTrace();
			LOGGER.error("["+e.getClass()+"] Exception : " + e.getMessage());
		}
		return sysm220ins01hashMap;

	}
	
	/**
	 * @Method Name     : SYSM220INS02
	 * @작성일      	: 2022.07.07
	 * @작성자      	: sukim
	 * @변경이력    	: 
	 * @Method 설명	    : 메뉴권한 등록
	 * @param           : HttpServletRequest Restful param
	 * @return          : ModelAndView HashMap
	 */
	@PostMapping(value = "/SYSM220INS02")
	@ResponseBody
	public Map<String, Object> SYSM220INS02(Locale locale, @RequestBody String request, SessionStatus status) {

		HashMap<String, Object> sysm220ins02hashMap = new HashMap<String, Object>();
		JSONParser parser = new JSONParser();

		try {
			LOGGER.info("SYSM220INS02 ==================================== ");
			JSONObject sysm220ins02obj = (JSONObject) parser.parse(request);
			SYSM200VO sysm200ins02vo = new SYSM200VO();
			String SYSM220INS02_tenantId = String.valueOf(sysm220ins02obj.get("tenantId"));
			String SYSM220INS02_usrId = String.valueOf(sysm220ins02obj.get("usrId"));
			String SYSM220INS02_usrGrd = String.valueOf(sysm220ins02obj.get("usrGrd"));
			String SYSM220INS02_regrId = String.valueOf(sysm220ins02obj.get("regrId"));
			String SYSM220INS02_regrOrgCd = String.valueOf(sysm220ins02obj.get("regrOrgCd"));
			String SYSM220INS02_lstCorprId = String.valueOf(sysm220ins02obj.get("lstCorprId"));
			String SYSM220INS02_lstCorprOrgCd = String.valueOf(sysm220ins02obj.get("lstCorprOrgCd"));
			String[] arrCode = String.valueOf(sysm220ins02obj.get("grdAuthList")).split(","); 
			
			sysm200ins02vo.setTenantId(SYSM220INS02_tenantId);
			sysm200ins02vo.setUsrId(SYSM220INS02_usrId); 
			sysm200ins02vo.setUsrGrd(SYSM220INS02_usrGrd);
			sysm200ins02vo.setRegrId(SYSM220INS02_regrId);
			sysm200ins02vo.setRegrOrgCd(SYSM220INS02_regrOrgCd);
			sysm200ins02vo.setLstCorprId(SYSM220INS02_lstCorprId);
			sysm200ins02vo.setLstCorprOrgCd(SYSM220INS02_lstCorprOrgCd);
			
			List<SYSM200VO> sysm200volist = new ArrayList<SYSM200VO>();
			for(int i=0; i< arrCode.length; i++){
				SYSM200VO mnuAuthVO = new SYSM200VO();
				mnuAuthVO.setTenantId(SYSM220INS02_tenantId);
				mnuAuthVO.setUsrId(SYSM220INS02_usrId); 
				mnuAuthVO.setUsrGrd(((arrCode[i].replaceAll("\\\"","")).replaceAll("\\[","")).replaceAll("\\]",""));
				mnuAuthVO.setRegrId(SYSM220INS02_regrId);
				mnuAuthVO.setRegrOrgCd(SYSM220INS02_regrOrgCd);
				mnuAuthVO.setLstCorprId(SYSM220INS02_lstCorprId);
				mnuAuthVO.setLstCorprOrgCd(SYSM220INS02_lstCorprOrgCd);
				sysm200volist.add(mnuAuthVO);
			}
			
			if(sysm200volist.size()>0) {
				int sysm220del02rtn = SYSM200Service.SYSM220DEL02(sysm200ins02vo);
				int sysm220ins02rtn = SYSM200Service.SYSM220INS02(sysm200volist);
				int sysm220upt02rtn = SYSM200Service.SYSM220UPT02(sysm200ins02vo);
				//int sysm220upt03rtn = SYSM200Service.SYSM220UPT03(sysm200ins02vo); //2022.11.29 막음
				sysm220ins02hashMap.put("sysm220del02rtn", sysm220del02rtn);
				sysm220ins02hashMap.put("sysm220ins02rtn", sysm220ins02rtn);
				sysm220ins02hashMap.put("sysm220upt02rtn", sysm220upt02rtn);
				//sysm220ins02hashMap.put("sysm220upt03rtn", sysm220upt03rtn);
				if(sysm220del02rtn+sysm220ins02rtn+sysm220upt02rtn >=2) {
					status.setComplete();
					sysm220ins02hashMap.put("msg", messageSource.getMessage("success.common.insert", null, "success.common.insert", locale));				
				}else {
					sysm220ins02hashMap.put("msg", messageSource.getMessage("aicrm.error.tenantInfo", null, "aicrm.error.tenantInfo", locale));
				}
		    }
		}catch(Exception e) {
			e.printStackTrace();
			LOGGER.error("["+e.getClass()+"] Exception : " + e.getMessage());
		}
		return sysm220ins02hashMap;

	}	

	/**
	 * @Method Name     : SYSM220INS03
	 * @작성일      	: 2022.07.07
	 * @작성자      	: sukim
	 * @변경이력    	: 
	 * @Method 설명	    : 부가솔루션권한 등록
	 * @param           : HttpServletRequest Restful param
	 * @return          : ModelAndView HashMap
	 */
	@PostMapping(value = "/SYSM220INS03")
	@ResponseBody
	public Map<String, Object> SYSM220INS03(Locale locale, @RequestBody String request, SessionStatus status) {

		HashMap<String, Object> sysm220ins03hashMap = new HashMap<String, Object>();
		JSONParser parser = new JSONParser();

		try {
			LOGGER.info("SYSM220INS03 ==================================== ");
			JSONObject sysm220ins03obj = (JSONObject) parser.parse(request);
			SYSM200VO sysm200ins03vo = new SYSM200VO();
			String SYSM220INS03_tenantId = String.valueOf(sysm220ins03obj.get("tenantId"));
			String SYSM220INS03_usrId = String.valueOf(sysm220ins03obj.get("usrId"));
			String SYSM220INS03_regrId = String.valueOf(sysm220ins03obj.get("regrId"));
			String SYSM220INS03_regrOrgCd = String.valueOf(sysm220ins03obj.get("regrOrgCd"));
			String SYSM220INS03_lstCorprId = String.valueOf(sysm220ins03obj.get("lstCorprId"));
			String SYSM220INS03_lstCorprOrgCd = String.valueOf(sysm220ins03obj.get("lstCorprOrgCd"));
			String[] arrCode = String.valueOf(sysm220ins03obj.get("solAuthList")).split(",");

			sysm200ins03vo.setTenantId(SYSM220INS03_tenantId);
			sysm200ins03vo.setUsrId(SYSM220INS03_usrId);
			sysm200ins03vo.setRegrId(SYSM220INS03_regrId);
			sysm200ins03vo.setRegrOrgCd(SYSM220INS03_regrOrgCd);
			sysm200ins03vo.setLstCorprId(SYSM220INS03_lstCorprId);
			sysm200ins03vo.setLstCorprOrgCd(SYSM220INS03_lstCorprOrgCd);

			List<SYSM200VO> sysm200volist = new ArrayList<SYSM200VO>();
			for(int i=0; i< arrCode.length; i++){
				SYSM200VO solAuthVO = new SYSM200VO();
				solAuthVO.setTenantId(SYSM220INS03_tenantId);
				solAuthVO.setUsrId(SYSM220INS03_usrId);
				solAuthVO.setSolBizChoYnCd(((arrCode[i].replaceAll("\\\"","")).replaceAll("\\[","")).replaceAll("\\]",""));
				solAuthVO.setRegrId(SYSM220INS03_regrId);
				solAuthVO.setRegrOrgCd(SYSM220INS03_regrOrgCd);
				solAuthVO.setLstCorprId(SYSM220INS03_lstCorprId);
				solAuthVO.setLstCorprOrgCd(SYSM220INS03_lstCorprOrgCd);
				sysm200volist.add(solAuthVO);
			}

			if(sysm200volist.size()>0) {
				int sysm220del03rtn = SYSM200Service.SYSM220DEL03(sysm200ins03vo);
				int sysm220ins03rtn = SYSM200Service.SYSM220INS03(sysm200volist);
				sysm220ins03hashMap.put("sysm220del03rtn", sysm220del03rtn);
				sysm220ins03hashMap.put("sysm220ins03rtn", sysm220ins03rtn);
				if(sysm220del03rtn+sysm220ins03rtn >=1) {
					status.setComplete();
					sysm220ins03hashMap.put("msg", messageSource.getMessage("success.common.insert", null, "success.common.insert", locale));
				}else {
					sysm220ins03hashMap.put("msg", messageSource.getMessage("aicrm.error.tenantInfo", null, "aicrm.error.tenantInfo", locale));
				}
			}
		}catch(Exception e) {
			LOGGER.error("["+e.getClass()+"] Exception : " + e.getMessage());
		}
		return sysm220ins03hashMap;
	}	
	
	/**
	 * @Method Name     : SYSM220SEL01
	 * @작성일      	: 2022.04.12
	 * @작성자      	: sukim
	 * @변경이력    	:
	 * @Method 설명 	: 사용자 부가정보 리스트 조회 - 상담채널권한, 메뉴권한, 부가솔루션권한 
	 * @param           : HttpServletRequest Restful param
	 * @return          : ModelAndView HashMap
	 * @throws Exception 
	 */   
	@PostMapping(value ="/SYSM220SEL01")
	@ResponseBody  
	public Map<String, Object> SYSM220SEL01(Locale locale, @RequestBody String request) throws Exception {

		HashMap<String, Object> sys220sel01hashMap = new HashMap<String, Object>();
		JSONParser parser = new JSONParser();

		try {
			JSONObject sys220obj = (JSONObject) parser.parse(request);
			SYSM200VO sys220sel01vo = new SYSM200VO();
			sys220sel01vo.setTenantId(String.valueOf(sys220obj.get("tenantId")));
			sys220sel01vo.setUsrId(String.valueOf(sys220obj.get("usrId")));
			sys220sel01vo.setUsrGrd(String.valueOf(sys220obj.get("usrGrd")));

			List<SYSM200VO> chnAuthlist = SYSM200Service.SYSM200SEL05(sys220sel01vo);
			List<SYSM200VO> mnuAuthlist = SYSM200Service.SYSM200SEL06(sys220sel01vo);
			List<SYSM200VO> solAuthlist = SYSM200Service.SYSM200SEL07(sys220sel01vo);

			sys220sel01hashMap.put("sys220sel02chnAuthlist", this.objectMapper.writeValueAsString(chnAuthlist));
			sys220sel01hashMap.put("sys220sel02mnuAuthlist", this.objectMapper.writeValueAsString(mnuAuthlist));
			sys220sel01hashMap.put("sys220sel02solAuthlist", this.objectMapper.writeValueAsString(solAuthlist));
			sys220sel01hashMap.put("SYSM220SEL01Msg"   , messageSource.getMessage("success.common.select", null, "success select", locale));
		}catch(Exception e) {
			LOGGER.error("["+e.getClass()+"] Exception : " + e.getMessage());
		}
		return sys220sel01hashMap;
	}			
	
	/**
	 * @Method Name     : SYSM220DEL01
	 * @작성일      	: 2022.04.12
	 * @작성자      	: sukim
	 * @변경이력    	:
	 * @Method 설명 	: 사용자 부가정보 삭제 - 상담채널권한, 메뉴권한, 부가솔루션권한 
	 * @param           : HttpServletRequest Restful param
	 * @return          : ModelAndView HashMap
	 * @throws Exception 
	 */   
	@PostMapping(value ="/SYSM220DEL01")
	@ResponseBody  
	public Map<String, Object> SYSM220DEL01(Locale locale, @RequestBody String request, SessionStatus status) throws Exception {

		HashMap<String, Object> sys220del01hashMap = new HashMap<String, Object>();
		JSONParser parser = new JSONParser();

		try {
			JSONObject sys220obj = (JSONObject) parser.parse(request);
			SYSM200VO sys220del01vo = new SYSM200VO();
			sys220del01vo.setTenantId(String.valueOf(sys220obj.get("tenantId")));
			sys220del01vo.setUsrId(String.valueOf(sys220obj.get("usrId")));
			sys220del01vo.setLstCorprId(String.valueOf(sys220obj.get("lstCorprId")));
			sys220del01vo.setLstCorprOrgCd(String.valueOf(sys220obj.get("lstCorprOrgCd")));

			int rtn = 0;
			String flag = String.valueOf(sys220obj.get("delflag"));
			if(flag.equals("1")) {
				rtn = SYSM200Service.SYSM220DEL01(sys220del01vo);
			}else if(flag.equals("2")) {
				rtn = SYSM200Service.SYSM220DEL02(sys220del01vo);
				try {
					SYSM200Service.SYSM220UPT04(sys220del01vo);
				}catch(Exception e){
					LOGGER.error("["+e.getClass()+"] Exception : " + e.getMessage());
				}
			}else {
				rtn = SYSM200Service.SYSM220DEL03(sys220del01vo);
			}

			if(rtn > 0) {
				sys220del01hashMap.put("result", "1"); //성공 :1, 에러:그외
				sys220del01hashMap.put("msg", messageSource.getMessage("success.common.delete", null, "success.common.delete", locale));
			}

		}catch(Exception e) {
			LOGGER.error("["+e.getClass()+"] Exception : " + e.getMessage());
		}
		return sys220del01hashMap;
	}
	
	/**
	 * @Method Name : SYSM200SEL08
	 * @작성일      	: 2023.11.23
	 * @작성자      	: wkim
	 * @변경이력   	:
	 * @Method 설명 	: 비밀번호 업데이트 기간 구하기
	 * @param       : ModelAndView
	 * @return      : ModelAndView HashMap
	 */
	@PostMapping(value = "/SYSM200SEL08")
	@ResponseBody
	public Map<String, Object> SYSM200SEL08(@RequestBody String request) {
		HashMap<String, Object> resultMap = new HashMap<>();
		JSONParser parser = new JSONParser();
		try {

			JSONObject object = (JSONObject) parser.parse(request);
			SYSM200VO vo = this.objectMapper.convertValue(object, SYSM200VO.class);

			List<SYSM200VO> SYSM200SEL01List = SYSM200Service.SYSM200SEL08(vo);

			resultMap.put("list", new ObjectMapper().writeValueAsString(SYSM200SEL01List));
			resultMap.put("msg", "정상적으로 조회하였습니다.");

		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}
		return resultMap;
	}

}
