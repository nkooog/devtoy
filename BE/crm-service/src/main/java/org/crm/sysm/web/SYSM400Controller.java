package org.crm.sysm.web;

import org.crm.sysm.VO.SYSM400VO;
import org.crm.sysm.service.SYSM400Service;
import org.crm.util.crypto.AES256Crypt;
import org.crm.util.string.StringUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.Resource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.support.SessionStatus;
import org.springframework.web.servlet.ModelAndView;

import java.util.*;

/***********************************************************************************************
* Program Name : 작업스케줄관리 controller
* Creator      : sukim
* Create Date  : 2022.06.21
* Description  : 작업스케줄관리
* Modify Desc  : 
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.06.21     sukim            최초생성
************************************************************************************************/
@Controller
@RequestMapping("/sysm/*")
public class SYSM400Controller {

	private MessageSource messageSource;
	private ObjectMapper objectMapper;

	private static final Logger LOGGER = LoggerFactory.getLogger(SYSM200Controller.class);

	@Autowired
	public SYSM400Controller(MessageSource messageSource, ObjectMapper objectMapper) {
		this.messageSource = messageSource;
		this.objectMapper = objectMapper;
	}

	@Resource(name = "SYSM400Service")
	private SYSM400Service SYSM400Service;
	
	/**
	 * @Method Name     : SYSM400M
	 * @작성일      	: 2022.06.21
	 * @작성자      	: sukim
	 * @변경이력    	:
	 * @Method 설명 	: sysm/SYSM400M 웹 페이지 열기
	 * @param           :
	 * @return          : sysm/SYSM400M.jsp
	 */
	@RequestMapping("/SYSM400M")
	public String SYSM400M(Model model) {
		LOGGER.info("SYSM400M 페이지 열기");
		return "th/sysm/SYSM400M";
	}
	
	/**
	 * @Method Name     : SYSM400SEL01
	 * @작성일      	: 2022.06.21
	 * @작성자      	: sukim
	 * @변경이력    	:
	 * @Method 설명 	: 작업 스케줄 목록 조회
	 * @param           : HttpServletRequest Restful param
	 * @return          : ModelAndView HashMap
	 * @throws Exception 
	 */   
	@RequestMapping(value ="/SYSM400SEL01", method = RequestMethod.POST)
	@ResponseBody  
	public Map<String, Object> SYSM400SEL01(Locale locale, ModelAndView mav, @RequestBody String request) throws Exception {
		HashMap<String, Object> sys400hashMap = new HashMap<String, Object>();
		try {
			LOGGER.info("===================== SYSM400SEL01 start=====================");
			SYSM400VO sys400vo = this.objectMapper.readValue(request, SYSM400VO.class);

			List<SYSM400VO> sys400sel01list = SYSM400Service.SYSM400SEL01(sys400vo);
			
			//복호화처리(FULL FOR~LOOP)
			SYSM400VO SYSM400_JobListVO = new SYSM400VO();
			List<SYSM400VO> SYSM400M_SEL01List = new ArrayList<SYSM400VO>();
			for(int i=0; i<sys400sel01list.size(); i++) {
				SYSM400_JobListVO = new SYSM400VO();
				
				String regrUsrNm = sys400sel01list.get(i).getRegrUsrNm();
				String lstCorprUsrNm = sys400sel01list.get(i).getLstCorprUsrNm();
				
				SYSM400_JobListVO.setRegrUsrNm(("".equals(StringUtil.nullToBlank(regrUsrNm))) ? "" : AES256Crypt.decrypt(regrUsrNm));
				SYSM400_JobListVO.setLstCorprUsrNm(("".equals(StringUtil.nullToBlank(lstCorprUsrNm))) ? "" :  AES256Crypt.decrypt(lstCorprUsrNm));
				
				SYSM400_JobListVO.setTenantId(sys400sel01list.get(i).getTenantId());
				SYSM400_JobListVO.setFmnm(sys400sel01list.get(i).getFmnm());
				SYSM400_JobListVO.setJobNo(sys400sel01list.get(i).getJobNo());
				SYSM400_JobListVO.setJobNm(sys400sel01list.get(i).getJobNm());
				SYSM400_JobListVO.setJobCycCd(sys400sel01list.get(i).getJobCycCd());
				SYSM400_JobListVO.setJobCycCdNm(sys400sel01list.get(i).getJobCycCdNm());
				SYSM400_JobListVO.setJobClasCd(sys400sel01list.get(i).getJobClasCd());
				SYSM400_JobListVO.setJobClasCdNm(sys400sel01list.get(i).getJobClasCdNm());
				SYSM400_JobListVO.setJobExecTm(sys400sel01list.get(i).getJobExecTm());
				SYSM400_JobListVO.setFileNm(sys400sel01list.get(i).getFileNm());
				SYSM400_JobListVO.setFilePath(sys400sel01list.get(i).getFilePath());
				SYSM400_JobListVO.setProcPgmKindCd(sys400sel01list.get(i).getProcPgmKindCd());
				SYSM400_JobListVO.setProcPgmKindCdNm(sys400sel01list.get(i).getProcPgmKindCdNm());
				SYSM400_JobListVO.setProcPgmNm(sys400sel01list.get(i).getProcPgmNm());
				SYSM400_JobListVO.setPrcedJobNo(sys400sel01list.get(i).getPrcedJobNo());
				SYSM400_JobListVO.setExecScheDt(sys400sel01list.get(i).getExecScheDt());
				SYSM400_JobListVO.setUseYn(sys400sel01list.get(i).getUseYn());
				SYSM400_JobListVO.setUseYnCdNm(sys400sel01list.get(i).getUseYnCdNm());
				SYSM400_JobListVO.setReptYn(sys400sel01list.get(i).getReptYn());
				SYSM400_JobListVO.setRegDtm(sys400sel01list.get(i).getRegDtm());
				SYSM400_JobListVO.setRegrId(sys400sel01list.get(i).getRegrId());
				SYSM400_JobListVO.setLstCorcDtm(sys400sel01list.get(i).getLstCorcDtm());
				SYSM400_JobListVO.setLstCorprId(sys400sel01list.get(i).getLstCorprId());
				SYSM400_JobListVO.setAbolDtm(sys400sel01list.get(i).getAbolDtm());
				SYSM400_JobListVO.setAbolmnId(sys400sel01list.get(i).getAbolmnId());
				SYSM400_JobListVO.setAbolmnOrgCd(sys400sel01list.get(i).getAbolmnOrgCd());
				SYSM400M_SEL01List.add(SYSM400_JobListVO);
			}
			
			//sys400hashMap.put("SYSM400SEL01List"     , sys400mapper.writeValueAsString(sys400sel01list));
			//sys400hashMap.put("SYSM400SEL01ListCount", sys400sel01list.size());
			sys400hashMap.put("SYSM400SEL01List"     , this.objectMapper.writeValueAsString(SYSM400M_SEL01List));
			sys400hashMap.put("SYSM400SEL01ListCount", SYSM400M_SEL01List.size());
			
		    LOGGER.info("===================== SYSM400SEL01 end=====================");
		}catch(Exception e) {
			LOGGER.error("["+e.getClass()+"] Exception : " + e.getMessage());
			e.printStackTrace();
		}
		return sys400hashMap;
	}	
	
	/**
	 * @Method Name     : SYSM400SEL02
	 * @작성일      	: 2022.07.04
	 * @작성자      	: sukim
	 * @변경이력    	:
	 * @Method 설명 	: 작업번호 중복 체크 
	 * @param           : HttpServletRequest Restful param
	 * @return          : ModelAndView HashMap
	 * @throws Exception 
	 */   
	@RequestMapping(value ="/SYSM400SEL02", method = RequestMethod.POST)
	@ResponseBody  
	public Map<String, Object> SYSM400SEL02(Locale locale, ModelAndView mav, @RequestBody String request) throws Exception {
		HashMap<String, Object> sys400hashMap = new HashMap<String, Object>();
		try {
			SYSM400VO sys400vo = this.objectMapper.readValue(request, SYSM400VO.class);

			int chkJobNo = SYSM400Service.SYSM400SEL02(sys400vo);
			sys400hashMap.put("chkjobNocnt",chkJobNo);
		}catch(Exception e) {
			LOGGER.error("["+e.getClass()+"] Exception : " + e.getMessage());
		}
		return sys400hashMap;
	}
	
	/**
	 * @Method Name     : SYSM400INS01
	 * @작성일      	: 2022.06.29
	 * @작성자      	: sukim
	 * @변경이력    	: 
	 * @Method 설명  	: 작업스케줄정보 신규등록/변경
	 * @param           : HttpServletRequest Restful param
	 * @return          : ModelAndView HashMap
	 */   
	@RequestMapping(value ="/SYSM400INS01",	method = RequestMethod.POST)
	@ResponseBody 
	public Map<String, Object> SYSM400INS01(Locale locale, ModelAndView mav, @RequestBody String request, SessionStatus status)  {
		HashMap<String, Object> sys400hashMap = new HashMap<String, Object>();
		try {
			SYSM400VO sys400vo = this.objectMapper.readValue(request, SYSM400VO.class);
			
			int sys400result=SYSM400Service.SYSM400INS01(sys400vo);
	        String sys400message = "";
	        if (sys400result > 0) {
				status.setComplete();
				sys400message = "작업스케줄 등록/변경 성공";
			}else {
				sys400message = "작업스케줄 등록/변경 실패";
			}		

	        sys400hashMap.put("result", sys400result);
	        sys400hashMap.put("msg", sys400message);
		}catch(Exception e) {
			LOGGER.error("["+e.getClass()+"] Exception : " + e.getMessage());
		}
		return sys400hashMap;
	}
	
	/**
	 * @Method Name     : SYSM400DEL01
	 * @작성일      	: 2022.06.29
	 * @작성자      	: sukim
	 * @변경이력    	: 
	 * @Method 설명 	: 작업스케줄정보 폐기
	 * @param           : HttpServletRequest Restful param
	 * @return          : ModelAndView HashMap
	 */ 
	@RequestMapping(value ="/SYSM400DEL01", method = RequestMethod.POST)
	@ResponseBody  
	public Map<String, Object> SYSM400DEL01(Locale locale, ModelAndView mav, @RequestBody String request, SessionStatus status) {
		
		HashMap<String, Object> sys400hashMap = new HashMap<String, Object>();
	
		try {
			SYSM400VO sys400vo = this.objectMapper.readValue(request, SYSM400VO.class);
	
			int sys400result=SYSM400Service.SYSM400DEL01(sys400vo);
			if(sys400result >0) {
				status.setComplete();
				sys400hashMap.put("result", "1"); //성공 :1 에러:그외
				sys400hashMap.put("msg", messageSource.getMessage("success.common.disposal", null, "success.common.disposal", locale));	
			}	
				
		}catch(Exception e) {
			LOGGER.error("["+e.getClass()+"] Exception : " + e.getMessage());
		}
		return sys400hashMap;
	}
	
	/**
	 * @Method Name     : SYSM400DEL02
	 * @작성일      	: 2022.06.29
	 * @작성자      	: sukim
	 * @변경이력    	: 
	 * @Method 설명 	: 작업스케줄정보 삭제
	 * @param           : HttpServletRequest Restful param
	 * @return          : ModelAndView HashMap
	 */ 
	@RequestMapping(value ="/SYSM400DEL02", method = RequestMethod.POST)
	@ResponseBody  
	public Map<String, Object> SYSM400DEL02(Locale locale, ModelAndView mav, @RequestBody String request, SessionStatus status) {
		
		HashMap<String, Object> sys400hashMap = new HashMap<String, Object>();
		
		try {
			SYSM400VO sys400vo = this.objectMapper.readValue(request, SYSM400VO.class);
			
			int cnt = SYSM400Service.SYSM400SEL03(sys400vo);
			
			if(cnt > 0) {
				status.setComplete();
				sys400hashMap.put("result", "9"); //성공 :1 에러:그외
				sys400hashMap.put("msg", messageSource.getMessage("SYSM400M.alert.exist.his", null, "SYSM400M.alert.exist.his", locale));
			} else {
				int sys400result=SYSM400Service.SYSM400DEL02(sys400vo);
				if(sys400result >0) {
					status.setComplete();
					sys400hashMap.put("result", "1"); //성공 :1 에러:그외
					sys400hashMap.put("msg", messageSource.getMessage("success.common.delete", null, "success.common.delete", locale));	
				}	
			}
			
		}catch(Exception e) {
			LOGGER.error("["+e.getClass()+"] Exception : " + e.getMessage());
			e.printStackTrace();
		}

		return sys400hashMap;
	}

	
}
