package org.crm.frme.web;

import org.crm.config.spring.config.PropertiesService;
import org.crm.lgin.VO.LGIN000VO;
import org.crm.lgin.service.LGIN000Service;
import org.crm.sysm.VO.SYSM200VO;
import org.crm.sysm.service.SYSM200Service;
import org.crm.util.crypto.SHA256Util;
import org.crm.util.date.DateUtil;
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
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import java.sql.Timestamp;
import java.util.*;

/***********************************************************************************************
* Program Name : 비밀번호변경 Controller
* Creator      : sukim
* Create Date  : 2022.08.25
* Description  : 비밀번호변경 - POP
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.08.25     sukim            최초생성
* 2022.08.25     bykim
* 2024.12.11     jypark           egov->boot mig
************************************************************************************************/
@Slf4j
@Controller
@RequestMapping("/frme/*")
public class FRME310Controller {
	@Resource(name = "LGIN000Service")
	private LGIN000Service lgin000Service;
	
	@Resource( name = "propertiesService" )
	private PropertiesService propertiesService;

	@Autowired
	private MessageSource messageSource;

	@Resource(name = "SYSM200Service")
	private SYSM200Service SYSM200Service;

	@Autowired
	private ObjectMapper objectMapper;

	private static final Logger LOGGER = LoggerFactory.getLogger(FRME180Controller.class);
	
	/**
	 * @Method Name		: FRME310P
	 * @작성일      	: 2022.08.25
	 * @작성자      	: sukim
	 * @변경이력    	:
	 * @Method 설명 	: frme/FRME310P 웹 페이지 열기
	 * @param           :
	 * @return          : frme/FRME310P.jsp
	 */
	@PostMapping("/FRME310P")
	public String FRME310P(Model model) {
		LOGGER.info("FRME310P 페이지 열기");
		return "th/frme/FRME310P";
	}		
	
	/**
	 * @Method Name		: FRME310UPT01
	 * @작성일      	: 2022.08.25
	 * @작성자      	: bykim
	 * @변경이력    	:
	 * @Method 설명 	: 비밀번호 변경
	 * @param           :
	 */
	@PostMapping(value ="/FRME310UPT01")
	@ResponseBody    
	public Map<String, Object> FRME310UPT01(ModelAndView mav, @RequestBody String req, HttpSession session, Locale locale){
		HashMap<String, Object> resultMap = new HashMap<>();
		JSONParser parser = new JSONParser();
		
		String result = "";
		String msg = "";
		
		try {
			JSONObject obj = (JSONObject) parser.parse(req);

			LGIN000VO vo = LGIN000VO.builder()
					.tenantId(obj.get("tenantId").toString())
					.usrId(obj.get("usrId").toString())
					.scrtNo(obj.get("newPwd").toString())
					.build();
			
			//현재 패스워드 일치 확인을 위한 정보 조회
			LGIN000VO userInfo = lgin000Service.LGIN000SEL07(vo);
			String curSaltKey = SHA256Util.genSaltKey(userInfo);
			
			if(!userInfo.getScrtNo().equals(SHA256Util.encrypt(curSaltKey, obj.get("curPwd").toString()))) {
				result = "fail";
				msg = messageSource.getMessage("fail.password.compare", null, "fail.password.compare", locale);
			}

			// 패스워드 정보 없이 최근 1년 패스워드 이력 조회			
			if(!"fail".equals(result)) {
		    	List<LGIN000VO> list = lgin000Service.LGIN000SEL12(vo);
	
		    	for (Iterator iterator = list.iterator(); iterator.hasNext();) {
		    		LGIN000VO listVo = (LGIN000VO) iterator.next();	    		
					String oldSaltKey = SHA256Util.genSaltKey(vo.getTenantId(), vo.getUsrId(), DateUtil.TimestampTostr(listVo.getRegDtm(), locale));
					
					//히스토리 이력 중 동일한 패스워드 사용이력이 있다면
					String oPwd = listVo.getScrtNo();
					String nPwd = SHA256Util.encrypt(oldSaltKey,vo.getScrtNo());
	
					if(oPwd.equals(nPwd)) {
						result = "fail";
						msg = messageSource.getMessage("fail.password.expiration", null, "fail.password.expiration", locale);
						break;
					}
				}
			}
			
			//패스워드 변경 이력 기록 및 사용자 정보 변경 처리
			if(!"fail".equals(result)) {
				
				//사용자 정보 및 패스워드 변경이력의 업데이트 시간 일치를 위해 현재 시간 설정				
				Timestamp scrtNoLstUpdDtm = DateUtil.getTimeStamp(locale);
				vo.setScrtNoLstUpdDtm(scrtNoLstUpdDtm);
				vo.setOrgCd(userInfo.getOrgCd());
				vo.setScrtNo(SHA256Util.encrypt(SHA256Util.genSaltKey(vo), vo.getScrtNo()));
				
				int usrInfoUpate = lgin000Service.LGIN000UPT05(vo);

				if(usrInfoUpate > 0) {
					SYSM200VO sys200vo = new SYSM200VO();
					
					sys200vo.setTenantId(vo.getTenantId());
					sys200vo.setUsrId(vo.getUsrId());
					sys200vo.setScrtNo(vo.getScrtNo());
					sys200vo.setRegDtm(DateUtil.TimestampTostr(scrtNoLstUpdDtm));
					sys200vo.setRegrId(vo.getUsrId());
					sys200vo.setRegrOrgCd(userInfo.getOrgCd());
					sys200vo.setLstCorcDtm(DateUtil.TimestampTostr(scrtNoLstUpdDtm));
					sys200vo.setLstCorprId(vo.getUsrId());
					sys200vo.setLstCorprOrgCd(userInfo.getOrgCd());
	
					// 패스워드 이력정보
					SYSM200Service.SYSM200INS04(sys200vo);
				}
				
				result = "success";
				msg = messageSource.getMessage("success.user.passwordUpdate", null, "success.user.passwordUpdate", locale);
			}

		}catch(Exception e) {
			mav.setStatus(HttpStatus.EXPECTATION_FAILED);
			e.printStackTrace();
			LOGGER.error("["+e.getClass()+"] Exception : " + e.getMessage());
		}

		
		resultMap.put("msg", msg);
		resultMap.put("result", result);
		return resultMap;
	}
}
