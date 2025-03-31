package org.crm.sysm.web;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;

import jakarta.annotation.Resource;

import org.json.simple.JSONObject;
import org.json.simple.JSONArray;
import java.util.ArrayList;
import org.json.simple.parser.JSONParser;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.support.SessionStatus;

import com.fasterxml.jackson.databind.ObjectMapper;

import org.crm.config.spring.config.PropertiesService;
import org.crm.sysm.VO.SYSM433VO;
import org.crm.sysm.service.SYSM433Service;
import org.crm.util.crypto.AES256Crypt;
import org.crm.util.sms.SMSUtil;
import org.crm.util.sms.jsonObject.SendObject;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Controller
@RequestMapping("/sysm/*")
public class SYSM433Controller {
	
	@Autowired
	private PropertiesService propertiesService;
	
	@Autowired
	private MessageSource messageSource;
	
	@Resource(name = "SYSM433Service")
	private SYSM433Service sysm433Service;
	
	@Autowired
	private ObjectMapper objectMapper;
	
	private static final Logger LOGGER = LoggerFactory.getLogger(SYSM433Controller.class);
	
	@GetMapping("/SYSM433P")
	public String SYSM433P() {
        return "th/sysm/SYSM433P";
	}
	
	/**
	 * @Method Name : SYSM433SEL01
	 * @작성일      	: 2022.07.11
	 * @작성자      	: 강동우
	 * @변경이력    	:
	 * @Method 설명 	: 발송대상 조회
	 * @param       : HttpServletRequest Restful param
	 * @return      : ModelAndView HashMap
	 */
	@PostMapping(value ="/SYSM433SEL01")
	@ResponseBody
	public ResponseEntity<String> SYSM433SEL01(@RequestBody String request, Locale locale) {
		LOGGER.info("=== SYSM433SEL01 호출 ===");
		
		HashMap<String, Object> resultMap = new HashMap<String, Object>();
		String resultStr = null;

		try {
			JSONParser parser1 = new JSONParser();
			JSONObject obj = (JSONObject) parser1.parse(request);

			List<SYSM433VO> list = sysm433Service.SYSM433SEL01(this.objectMapper.convertValue(obj, SYSM433VO.class));

			resultMap.put("count", list.size());
			resultMap.put("list", objectMapper.writeValueAsString(list));
			resultMap.put("totalList", objectMapper.writeValueAsString(list));
			resultMap.put("msg", messageSource.getMessage("success.common.select", null, "success.common.select", locale));

			resultStr = this.objectMapper.writeValueAsString(resultMap);
			
		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}
		return ResponseEntity.ok().body(resultStr);
	}
	
	/**
	 * @Method Name : SYSM433SEL02
	 * @작성일      	: 2022.07.12
	 * @작성자      	: 강동우
	 * @변경이력    	:
	 * @Method 설명 	: 발송대상 조회
	 * @param       : HttpServletRequest Restful param
	 * @return      : ModelAndView HashMap
	 */
	@PostMapping(value ="/SYSM433SEL02")
	@ResponseBody
	public ResponseEntity<String> SYSM433SEL02(@RequestBody String request, Locale locale) {
		LOGGER.info("=== SYSM433SEL02 호출 ===");
		
		HashMap<String, Object> resultMap = new HashMap<String, Object>();
		String resultStr = null;
		try {
			JSONParser parser1 = new JSONParser();
			JSONObject obj = (JSONObject) parser1.parse(request);

			List<SYSM433VO> list = sysm433Service.SYSM433SEL02(this.objectMapper.convertValue(obj, SYSM433VO.class));

			resultMap.put("count", list.size());
			resultMap.put("list", objectMapper.writeValueAsString(list));
			resultMap.put("totalList", objectMapper.writeValueAsString(list));
			resultMap.put("msg", messageSource.getMessage("success.common.select", null, "success.common.select", locale));

			resultStr = this.objectMapper.writeValueAsString(resultMap);
		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}
		return ResponseEntity.ok().body(resultStr);
	}
	
	/**
	 * @Method Name : SYSM433SEL03
	 * @작성일      	: 2022.07.12
	 * @작성자      	: 강동우
	 * @변경이력    	:
	 * @Method 설명 	: 발송이력 조회
	 * @param       : HttpServletRequest Restful param
	 * @return      : ModelAndView HashMap
	 */
	@PostMapping(value ="/SYSM433SEL03")
	@ResponseBody
	public ResponseEntity<String> SYSM433SEL03(@RequestBody String request, Locale locale) {
		
		LOGGER.info("=== SYSM433SEL03 호출 ===");
		
		HashMap<String, Object> resultMap = new HashMap<String, Object>();
		String resultStr = null;

		try {
			JSONParser parser1 = new JSONParser();
			JSONObject obj = (JSONObject) parser1.parse(request);

			List<SYSM433VO> list = sysm433Service.SYSM433SEL03(this.objectMapper.convertValue(obj, SYSM433VO.class));

			resultMap.put("count", list.size());
			resultMap.put("list", list);
			resultMap.put("totalList", objectMapper.writeValueAsString(list));
			resultMap.put("msg", messageSource.getMessage("success.common.select", null, "success.common.select", locale));

			resultStr = this.objectMapper.writeValueAsString(resultMap);
		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}

		return ResponseEntity.ok().body(resultStr);
	}
	
	/**
	 * @Method Name : SYSM433SEL04
	 * @작성일      	: 2022.07.13
	 * @작성자      	: 강동우
	 * @변경이력    	:
	 * @Method 설명 	: 템플릿 조회
	 * @param       : HttpServletRequest Restful param
	 * @return      : ModelAndView HashMap
	 */
	@PostMapping(value ="/SYSM433SEL04")
	@ResponseBody
	public ResponseEntity<String> SYSM433SEL04(@RequestBody String request, Locale locale) {
		LOGGER.info("=== SYSM433SEL04 호출 ===");
		
		HashMap<String, Object> resultMap = new HashMap<String, Object>();
		String resultStr = null;

		try {
			JSONParser parser1 = new JSONParser();
			JSONObject obj = (JSONObject) parser1.parse(request);

			List<SYSM433VO> list = sysm433Service.SYSM433SEL04(this.objectMapper.convertValue(obj, SYSM433VO.class));
			
			// SMS템플릿 첨부파일 정보
			List<SYSM433VO> fileList = sysm433Service.SYSM433SEL06(this.objectMapper.convertValue(obj, SYSM433VO.class));
			
			resultMap.put("count", list.size());
			resultMap.put("list", objectMapper.writeValueAsString(list));
			resultMap.put("totalList", objectMapper.writeValueAsString(list));
			resultMap.put("msg", messageSource.getMessage("success.common.select", null, "success.common.select", locale));

			resultStr = this.objectMapper.writeValueAsString(resultMap);
		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}
		return ResponseEntity.ok().body(resultStr);
	}
	
	/**
	 * @Method Name : SYSM433SEL05
	 * @작성일      	: 2022.07.13
	 * @작성자      	: 강동우
	 * @변경이력    	:
	 * @Method 설명 	: 템플릿 항목 조회
	 * @param       : HttpServletRequest Restful param
	 * @return      : ModelAndView HashMap
	 */
	@PostMapping(value ="/SYSM433SEL05")
	@ResponseBody
	public ResponseEntity<String> SYSM433SEL05(@RequestBody String request, Locale locale) {
		
		LOGGER.info("=== SYSM433SEL05 호출 ===");
		
		HashMap<String, Object> resultMap = new HashMap<String, Object>();
		String resultStr = null;

		try {
			JSONParser parser1 = new JSONParser();
			JSONObject obj = (JSONObject) parser1.parse(request);

			List<SYSM433VO> list = sysm433Service.SYSM433SEL05(this.objectMapper.convertValue(obj, SYSM433VO.class));
			
			// SMS템플릿 첨부파일 정보
			List<SYSM433VO> fileList = sysm433Service.SYSM433SEL06(this.objectMapper.convertValue(obj, SYSM433VO.class));
			
			resultMap.put("count", list.size());
			resultMap.put("list", objectMapper.writeValueAsString(list));
			resultMap.put("files", objectMapper.writeValueAsString(fileList));
			resultMap.put("totalList", objectMapper.writeValueAsString(list));
			resultMap.put("msg", messageSource.getMessage("success.common.select", null, "success.common.select", locale));

			resultStr = this.objectMapper.writeValueAsString(resultMap);
		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}
		return ResponseEntity.ok().body(resultStr);
	}
	
	/**
	 * @Method Name : SYSM433SEL06
	 * @작성일 : 2023.04.26
	 * @작성자 : 김운
	 * @변경이력 :
	 * @Method 설명 : 환자정보조회
	 * @param :
	 * @return :
	 */
	@PostMapping(value ="/SYSM433SEL06")
	@ResponseBody
	public ResponseEntity<String> SYSM433SEL06(@RequestBody String request, Locale locale) {
		HashMap<String, Object> resultMap = new HashMap<>();
		String resultStr = null;
		try {			
			// Rest 통신 호출						
			resultMap.put("result", null);			

			resultStr = this.objectMapper.writeValueAsString(resultMap);

		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}
		return ResponseEntity.ok().body(resultStr);
	}
	
	/**
	 * @Method Name : SYSM433SEL07
	 * @작성일 : 2023.04.26
	 * @작성자 : 김운
	 * @변경이력 :
	 * @Method 설명 : 발송이력조회
	 * @param :
	 * @return :
	 */
	@PostMapping(value ="/SYSM433SEL07")
	@ResponseBody
	public ResponseEntity<String> SYSM433SEL07(@RequestBody String request, Locale locale) {
		HashMap<String, Object> resultMap = new HashMap<>();
		String resultStr = null;
		try {			
			// Rest 통신 호출
			resultMap.put("result", null);
			
			resultStr = this.objectMapper.writeValueAsString(resultMap);

		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}
		return ResponseEntity.ok().body(resultStr);
	}
	
	/**
	 * @Method Name : SYSM433UPT01
	 * @작성일      : 2022.07.14
	 * @작성자      : 강동우
	 * @변경이력    :
	 * @Method 설명 : 기타연락처 메모,사용여부 업데이트
	 * @param       : ModelAndView
	 * @return : ModelAndView HashMap
	 */
	@PostMapping(value ="/SYSM433UPT01")
	@ResponseBody
	public ResponseEntity<String> SYSM433UPT01(@RequestBody String request, Locale locale, SessionStatus status) {
		LOGGER.info("=== SYSM433UPT01 호출 ===");
		HashMap<String, Object> resultMap = new HashMap<String, Object>();
		String resultStr = null;

		try {
			JSONParser parser1 = new JSONParser();
			JSONObject obj = (JSONObject) parser1.parse(request);

			// 단일 VO 객체 생성
			SYSM433VO vo = this.objectMapper.convertValue(obj, SYSM433VO.class);

			// VO를 List로 변환
			List<SYSM433VO> list = Collections.singletonList(vo);

			Integer rtn = sysm433Service.SYSM433UPT01(list);
			if (rtn > 0) {
				resultMap.put("msg", messageSource.getMessage("success.common.update", null, "success.common.update", locale));
			}

			resultStr = this.objectMapper.writeValueAsString(resultMap);
			
		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}
		return ResponseEntity.ok().body(resultStr);
	}
	
	/**
	 * @Method Name : SYSM433SMS01
	 * @작성일      : 2022.07.18
	 * @작성자      : 강동우
	 * @변경이력    : 2023.04.13 첨부파일 관련 추가 - 김운
	 * @Method 설명 : SMS보내기
	 * @param       : 
	 * @return : String
	 * @throws IOException 
	 */
	@PostMapping(value ="/SYSM433SMS01")
	@ResponseBody
	public ResponseEntity<String> SYSM433SMS01(@RequestBody String request, Locale locale, SessionStatus status) {
		
		HashMap<String, Object> resultMap = new HashMap<String, Object>();
		String resultStr = null;
		
		try {
			
			JSONParser parser = new JSONParser();
			JSONObject obj = (JSONObject) parser.parse(request);
            SYSM433VO sysm433VO = this.objectMapper.convertValue(obj, SYSM433VO.class);
			
			//kw---20230413 : 첨부 파일이 있을 경우 java에서 한번 더 검사
			HashMap<String, Object> mapReturn = new HashMap<String, Object>();
			
			if(sysm433VO.getFilePath().length > 0) {
				
				String[] arrFilePath = sysm433VO.getFilePath();
				
				for(int i=0; i<arrFilePath.length; i++) {
					
					 Path path = Paths.get(arrFilePath[i]);
					 
					 long bytes = Files.size(path);
				     long kilobyte = bytes / 1024;
				     long megabyte = kilobyte / 1024;
				     
				     if(megabyte > 0) {
				    	 mapReturn.put("Result", 0);
				    	 mapReturn.put("smsId", messageSource.getMessage("SYSM433P.fileSizeErrMsg", null, "SYSM433P.fileSizeErrMsg", locale));
				    	 
				    	 JSONObject json =  new JSONObject(mapReturn);
				    	 
				    	 resultMap.put("result",  json.toString());
				    	 
				    	 resultStr = this.objectMapper.writeValueAsString(resultMap);
				    	 return ResponseEntity.ok().body(resultStr);

				     }
				}
			}
			
			String tenantPrefix = sysm433VO.getTenantPrefix();
			String sysPrefix 	= sysm433VO.getSysPrefix();
//			String sysPrefix 	= "BONA2";
			String phone 		= sysm433VO.getPhone();
			String[] phoneArr	= sysm433VO.getPhoneArr();
			String callback 	= sysm433VO.getCallback();
			String msg 			= sysm433VO.getMsg();
			String agentId 		= sysm433VO.getAgentId();
			String customerId 	= sysm433VO.getCustomerId();
			String cldDv		= sysm433VO.getCldDv();
			String sitename		= "NCRM";;
			String[] filePath	= sysm433VO.getFilePath();
			String tmplMgntNo	= Integer.toString(sysm433VO.getTmplMgntNo());
			
			String result = "";
			
			if(tmplMgntNo.equals("0")) {
				tmplMgntNo = "";
			}
			
			for(int i=0; i<phoneArr.length; i++) {
				SendObject sendobj = new SendObject();
				sendobj.setTenantPrefix(tenantPrefix);
				sendobj.setSysPrefix(sysPrefix);
				sendobj.setPhone(phoneArr[i]);
				sendobj.setCallback(callback);
				sendobj.setMsg(msg);
				sendobj.setAgentId(agentId);
				sendobj.setTmplMgntNo(tmplMgntNo);
				
				if(customerId != null && customerId != "") {
					sendobj.setCustomerId(customerId);
				} else {
					sendobj.setCustomerId("");
				}
				
				sendobj.setCldDv(cldDv);
				sendobj.setSitename(sitename);
				sendobj.setFilePath(filePath);
				
				String hostUrl = this.propertiesService.getString(cldDv+".sms.url");
				
				
				result = new SMSUtil(AES256Crypt.decrypt(hostUrl)).sendSms(sendobj);
			}

			resultMap.put("result",  result);
			
			resultStr = this.objectMapper.writeValueAsString(resultMap);
			 
		} catch (Exception e) {
			resultMap.put("result", "0");
			e.printStackTrace();
		}
		
		return ResponseEntity.ok().body(resultStr);
	}
	
	/**
	 * @Method Name : SYSM433INS01
	 * @작성일      : 2022.07.14
	 * @작성자      : 강동우
	 * @변경이력    :
	 * @Method 설명 : SMS발송대상정보 등록
	 * @param       : ModelAndView
	 * @return : ModelAndView HashMap
	 */
	@PostMapping(value ="/SYSM433INS01")
	@ResponseBody
	public ResponseEntity<String> SYSM433INS01(@RequestBody String request, Locale locale, SessionStatus status) {
		LOGGER.info("=== SYSM433INS01 호출 ===");

		HashMap<String, Object> resultMap = new HashMap<String, Object>();
		String resultStr = null;

		try {
			JSONParser parser1 = new JSONParser();
			JSONObject obj = (JSONObject) parser1.parse(request);
			
			JSONArray listArray = (JSONArray) obj.get("list");
			
			// VO를 List로 변환
			List<SYSM433VO> list = new ArrayList<SYSM433VO>();
	        for (Object item : listArray) {
	            SYSM433VO vo = this.objectMapper.convertValue(item, SYSM433VO.class);
	            list.add(vo);
	        }
			
			Integer rtn = sysm433Service.SYSM433INS01(list);
			
			if (rtn > 0) {
				resultMap.put("msg", messageSource.getMessage("success.common.insert", null, "success.common.insert", locale));
			}

			resultStr = this.objectMapper.writeValueAsString(resultMap);
		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}
		return ResponseEntity.ok().body(resultStr);
	}
	 
	
}
