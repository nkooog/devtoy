package org.crm.frme.web;

import org.crm.comm.VO.COMM120VO;
import org.crm.config.spring.config.PropertiesService;
import org.crm.frme.VO.FRME180VO;
import org.crm.frme.service.FRME180Service;
import org.crm.lgin.VO.LGIN000VO;
import org.crm.lgin.service.LGIN000Service;
import org.crm.util.com.ComnFun;
import org.crm.util.crypto.AES256Crypt;
import org.crm.util.file.FileUtils;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.support.SessionStatus;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.servlet.ModelAndView;

import java.util.*;

/***********************************************************************************************
* Program Name : 사용자정보조회(사진, 출/퇴근 등록) Controller
* Creator      : sukim
* Create Date  : 2022.05.09
* Description  : 사용자정보조회 - POP
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.05.09     sukim            최초생성
************************************************************************************************/
@Slf4j
@Controller
@RequestMapping("/frme/*")
public class FRME180Controller {
	
	@Resource(name = "FRME180Service")
	private FRME180Service FRME180Service;
	
	@Resource(name = "LGIN000Service")
	private LGIN000Service lgin000Service;

	@Autowired
	private PropertiesService propertiesService;

	@Autowired
	private MessageSource messageSource;

	@Autowired
	private ObjectMapper objectMapper;

	private final Logger LOGGER = LoggerFactory.getLogger(FRME180Controller.class);

	/**
	 * @Method Name : FRME180P
	 * @작성일      	: 2022.05.09
	 * @작성자      	: sukim
	 * @변경이력    	:
	 * @Method 설명 	: frme/FRME180P 웹 페이지 열기
	 * @param           :
	 * @return          : frme/FRME180P.jsp
	 */
	@PostMapping("/FRME180P")
	public String FRME180P(Model model) {
		LOGGER.info("FRME180P 페이지 열기");
		return "th/frme/FRME180P";
	}	
	
    /**
     * @Method Name : FRME180SEL01
     * @작성일      : 2022.05.12
     * @작성자      : sukim
     * @변경이력    : 
     * @Method 설명 : 근태 체크용 건수조회 (0 : 근태 미등록, 1 : 출근 등록,  2 : 퇴근 등록)
	 * @param       :  
	 * @return      : 성공시 : 건수, 메시지
	 *                실패시 : 실패 상태, 실패 메시지 
     */		
	@PostMapping(value = "/FRME180SEL01")
	public @ResponseBody Map<String , Object> FRME180SEL01(ModelAndView mav, @RequestBody String request, Locale locale){
    	LOGGER.info("=== FRME180SEL01(근태상태체크) ==============================================");

		HashMap<String, Object> FRME180SEL01_HashMap = new HashMap<String, Object>();
		JSONParser parser = new JSONParser();

    	try {
    		JSONObject jsonObject = (JSONObject) parser.parse(request);
    		FRME180VO frme180Vo = this.objectMapper.convertValue(jsonObject, FRME180VO.class);
    		int checkCnt = FRME180Service.FRME180SEL01(frme180Vo);
    		FRME180SEL01_HashMap.put("FRME180SEL01_result", checkCnt);
		    LOGGER.info("\n=== end ===");
    	}catch(Exception e) {
    		LOGGER.error("["+e.getClass()+"] Exception : " + e.getMessage());
    	}
    	return FRME180SEL01_HashMap;
	}	
	
    /**
     * @Method Name : FRME180SEL02
     * @작성일      : 2022.05.12
     * @작성자      : sukim
     * @변경이력    : 
     * @Method 설명 : 근태시간조회 (dgindDvCd 1 : 출근,  2 : 퇴근)
	 * @param       :  
	 * @return      : 성공시 : 건수, 메시지
	 *                실패시 : 실패 상태, 실패 메시지 
     */		
	@PostMapping(value = "/FRME180SEL02")
	public @ResponseBody Map<String , Object> FRME180SEL02(ModelAndView mav, @RequestBody String request, Locale locale){
    	LOGGER.info("=== FRME180SEL02(근태시간조회) ==============================================");
		HashMap<String, Object> FRME180SEL02_HashMap = new HashMap<String, Object>();
		JSONParser parser = new JSONParser();
    	try {	    	
    		JSONObject jsonObject = (JSONObject) parser.parse(request);
		    FRME180VO frme180Vo = this.objectMapper.convertValue(jsonObject, FRME180VO.class);
    		FRME180VO dgindVO = FRME180Service.FRME180SEL02(frme180Vo);
    		FRME180SEL02_HashMap.put("FRME180SEL02_getCommuteTime", dgindVO.getCommuteTime());
		    LOGGER.info("\n=== end ===");
    	}catch(Exception e) {
    		LOGGER.error("["+e.getClass()+"] Exception : " + e.getMessage());
    	}
    	return FRME180SEL02_HashMap;
	}		

    /**
     * @Method Name : FRME180SEL03
     * @작성일      : 2022.05.12
     * @작성자      : sukim
     * @변경이력    : 
     * @Method 설명 : 근태시간조회 (출근시간 + 퇴근시간)
	 * @param       :  
	 * @return      : 성공시 : 건수, 메시지
	 *                실패시 : 실패 상태, 실패 메시지 
     */		
	@PostMapping(value = "/FRME180SEL03")
	@ResponseBody
	public Map<String , Object> FRME180SEL03(ModelAndView mav, @RequestBody String request, Locale locale){
    	LOGGER.info("=== FRME180SEL03(근태시간조회) ==============================================");
		HashMap<String, Object> FRME180SEL03_HashMap = new HashMap<String, Object>();
		JSONParser parser = new JSONParser();
    	try {
		    JSONObject jsonObject = (JSONObject) parser.parse(request);
		    FRME180VO frme180Vo = this.objectMapper.convertValue(jsonObject, FRME180VO.class);

    		FRME180VO dgindVO = FRME180Service.FRME180SEL03(frme180Vo);
    		FRME180SEL03_HashMap.put("FRME180SEL03_getAttendance", dgindVO.getAttendance());
    		FRME180SEL03_HashMap.put("FRME180SEL03_getLeavetheoffice", dgindVO.getLeavetheoffice());
		    LOGGER.info("\n=== end ===");
    	}catch(Exception e) {
    		LOGGER.error("["+e.getClass()+"] Exception : " + e.getMessage());
    	}
    	return FRME180SEL03_HashMap;
	}	
	
    /**
     * @Method Name : FRME180INS01
     * @작성일      : 2021.12.20
     * @작성자      : sukim
     * @변경이력    : 
     * @Method 설명 : 출/퇴근 등록
	 * @param       : HttpServletRequest Restful param
	 * @return      : ModelAndView HashMap
     */     
    @PostMapping(value ="/FRME180INS01")
    @ResponseBody 
	public Map<String , Object> FRME180INS01(Locale locale, ModelAndView mav, @RequestBody String request, SessionStatus status){
	    LOGGER.info("=== FRME180INS01(출/퇴근 등록) ==============================================");

		HashMap<String, Object> FRME180INS01_HashMap = new HashMap<String, Object>();
	    JSONParser parser = new JSONParser();

    	try {
		    JSONObject jsonObject = (JSONObject) parser.parse(request);
		    FRME180VO frme180Vo = this.objectMapper.convertValue(jsonObject, FRME180VO.class);

    		int FRME180INS01_rtn=FRME180Service.FRME180INS01(frme180Vo);
    		if(FRME180INS01_rtn>0) {
    			status.setComplete();
    			FRME180VO dgindVO = FRME180Service.FRME180SEL02(frme180Vo);
    			LOGGER.info("dgindVO.getCommuteTime() : " + dgindVO.getCommuteTime());
    			FRME180INS01_HashMap.put("FRME180INS01_result"   , "1");
    			FRME180INS01_HashMap.put("FRME180INS01_getCommuteTime", dgindVO.getCommuteTime());
    			FRME180INS01_HashMap.put("FRME180INS01_msg"      , messageSource.getMessage("success.common.insert", null, "success.common.insert", locale));
    		}else {
    			FRME180INS01_HashMap.put("FRME180INS01_result"   , "9"); 
    			FRME180INS01_HashMap.put("FRME180INS01_msg"      , messageSource.getMessage("aicrm.error.tenantInfo", null, "aicrm.error.tenantInfo", locale));		   			
    		}
		    LOGGER.info("\n=== end ===");
    	}catch(Exception e) {
    		LOGGER.error("["+e.getClass()+"] Exception : " + e.getMessage());
    	}    
	    return FRME180INS01_HashMap;
	}  
    
    /**
     * @Method Name : FRME180INS02
     * @작성일      : 2021.12.20
     * @작성자      : sukim
     * @변경이력    : 
     * @Method 설명 : 사진 등록
	 * @param       : HttpServletRequest Restful param
	 * @return      : ModelAndView HashMap
     */     
    @PostMapping(value ="/FRME180INS02", headers=("content-type=multipart/*"))
    @ResponseBody 
	public Map<String , Object> FRME180INS02(Locale locale, MultipartHttpServletRequest mpfRequest,
			@RequestParam("FRME180P_key") String jsonData, HttpSession session) {
    	LOGGER.info("=== FRME180INS01(사진 등록) ==============================================");
    	HashMap<String, Object> FRME180INS01_HashMap = new HashMap<String, Object>();
	    JSONParser parser = new JSONParser();
    	try {
		    JSONObject jsonObject = (JSONObject) parser.parse(jsonData);
	        String uploadPath     = this.propertiesService.getString("POTO");
	        
    		FRME180VO frme180Vo = this.objectMapper.convertValue(jsonObject, FRME180VO.class);

    		List<COMM120VO> comm120List = new ArrayList<COMM120VO>();
    		List<MultipartFile> fileList = mpfRequest.getFiles("FRME180P_mtpPoto");
    		
    		long fileSize = fileList.get(0).getSize();
    		if(fileSize <= Long.parseLong(propertiesService.getString("MaxFileSize"))){
        		//기존 사진 제거
        		if((String) jsonObject.get("potoImgIdxFileNm") !="") {
        			FileUtils.removeFile((String) jsonObject.get("potoImgPsn"), (String) jsonObject.get("potoImgIdxFileNm"));
        		}
    			comm120List=FileUtils.uploadPreJob(uploadPath, jsonObject, fileList);
    			
        		for(int i=0; i<comm120List.size(); i++) {
        			frme180Vo.setPotoImgFileNm(comm120List.get(i).getApndFileNm());
    				frme180Vo.setPotoImgIdxFileNm(comm120List.get(i).getApndFileIdxNm());
    				frme180Vo.setPotoImgPsn(comm120List.get(i).getApndFilePsn());
        		}

        		int FRME180INS01_rtn=FRME180Service.FRME180INS02(frme180Vo);
        		if(FRME180INS01_rtn>0) {

        			//성공시 세션정보 재설정
        			LGIN000VO selectVo = new LGIN000VO();
        			LGIN000VO sessionVO = new LGIN000VO(); 
        			selectVo.setTenantId(frme180Vo.getTenantId());
        			selectVo.setUsrId(frme180Vo.getUsrId());
        			selectVo.setMlingCd(frme180Vo.getMlingCd());
        		
        			sessionVO = lgin000Service.LGIN000SEL02(selectVo);
        			sessionVO.setExtNoUseYn(frme180Vo.getExtNoUseYn());  //내선번호사용여부 : 로그인시 조회하지 않는 항목 별도 set
        			//복호화 Set
        			sessionVO.setDecUsrNm(AES256Crypt.decrypt(sessionVO.getUsrNm()));
        			if(!ComnFun.isEmptyObj(sessionVO.getEmlAddrIsd())) {
        				sessionVO.setDecEmlAddrIsd(AES256Crypt.decrypt(sessionVO.getEmlAddrIsd()));
        			}
        			if(!ComnFun.isEmptyObj(sessionVO.getDecEmlAddrExtn())) {
        				sessionVO.setDecEmlAddrExtn(AES256Crypt.decrypt(sessionVO.getDecEmlAddrExtn()));
        			}

			        sessionVO.setOriginTenantId(sessionVO.getTenantId());
			        sessionVO.setOriginUsrGrd(sessionVO.getUsrGrd());

        			session.setAttribute("user", sessionVO);

        			FRME180INS01_HashMap.put("FRME180INS01_result", "1");
        			FRME180INS01_HashMap.put("FRME180INS01_msg"   , this.messageSource.getMessage("success.common.insert", null, "success.common.insert", locale));
        		}else {
        			FRME180INS01_HashMap.put("FRME180INS01_result", "9"); 
        			FRME180INS01_HashMap.put("FRME180INS01_msg"   , this.messageSource.getMessage("aicrm.error.tenantInfo", null, "aicrm.error.tenantInfo", locale));
        		}    			
    			
    		}else {
    			FRME180INS01_HashMap.put("FRME180INS01_result", "9"); 
    			FRME180INS01_HashMap.put("FRME180INS01_msg"   , "파일사이즈 초과(100MB 이하만 가능), " + fileSize);   			
    		}

		    LOGGER.info("\n=== end ===");
    	}catch(Exception e) {
    		LOGGER.error("["+e.getClass()+"] Exception : " + e.getMessage());
    	}    
	    return FRME180INS01_HashMap;
	}      
	
}
