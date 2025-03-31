package org.crm.sysm.web;

import java.util.HashMap;
import java.util.List;
import java.util.Locale;

import jakarta.annotation.Resource;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import com.fasterxml.jackson.databind.ObjectMapper;

import org.crm.config.spring.config.PropertiesService;
import org.crm.sysm.VO.SYSM430VO;
import org.crm.sysm.service.SYSM430Service;
import org.crm.sysm.service.SYSM433Service;
import org.crm.util.file.FileUtils;
import lombok.extern.slf4j.Slf4j;
/***********************************************************************************************
* Program Name : SMS 발송변수 찾기 팝업 controller
* Creator      : sukim
* Create Date  : 2022.06.02
* Description  : SMS 발송변수 찾기 팝업
* Modify Desc  : 
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.06.02     sukim            최초생성
************************************************************************************************/
@Slf4j
@Controller
@RequestMapping("/sysm/*")
public class SYSM435Controller {
	
	@Resource(name = "SYSM433Service")
	private SYSM433Service sysm433Service;
	
	//기존 SMS템플릿관리 조회서비스 재활용
	@Resource(name = "SYSM430Service")
	private SYSM430Service SYSM430Service;
	
	@Autowired
	private PropertiesService propertiesService;
	
	@Autowired
	MessageSource messageSource;
	
	@Autowired
	private ObjectMapper objectMapper;
	
	private static final Logger LOGGER = LoggerFactory.getLogger(SYSM435Controller.class);
	
	/**
	 * @Method Name     : SYSM435P
	 * @작성일      	: 2022.06.02
	 * @작성자      	: sukim
	 * @변경이력    	:
	 * @Method 설명 	: sysm/SYSM435P 웹 페이지 열기
	 * @param           :
	 * @return          : sysm/SYSM435P.jsp
	 */	
	@GetMapping("/SYSM435P")
	public String SYSM435P() {
        return "th/sysm/SYSM435P";
	}
	
	/**
	 * @Method Name     : SYSM435SEL01
	 * @작성일      	: 2022.06.16
	 * @작성자      	: sukim
	 * @변경이력    	:
	 * @Method 설명 	: SMS 발송 템플릿 목록 조회
	 * @param           : HttpServletRequest Restful param
	 * @return          : ModelAndView HashMap
	 */
	
	@PostMapping(value ="/SYSM435SEL01")
	@ResponseBody
	public ResponseEntity<String> SYSM435SEL01(@RequestBody String request, Locale locale) {
		
		HashMap<String, Object> resultMap = new HashMap<String, Object>();
		String resultStr = null;
		
    	try {
    		JSONParser parser1 = new JSONParser();
			JSONObject obj = (JSONObject) parser1.parse(request);
			SYSM430VO vo = this.objectMapper.convertValue(obj, SYSM430VO.class);
			
			//기존 SMS템플릿관리 조회서비스 재활용
			List<SYSM430VO> SYSM435SEL01List = SYSM430Service.SYSM430SEL03(vo);

			resultMap.put("SYSM435SEL01List"     , SYSM435SEL01List);
			resultMap.put("SYSM435SEL01ListCount", SYSM435SEL01List.size());

			resultStr = this.objectMapper.writeValueAsString(resultMap);
			
    	}catch(Exception e) {
    		LOGGER.error("["+e.getClass()+"] Exception : " + e.getMessage());
    	}
    	return ResponseEntity.ok().body(resultStr);
	}		
	
	/**
	 * @Method Name     : SYSM435SEL02
	 * @작성일      	: 2022.06.17
	 * @작성자      	: sukim
	 * @변경이력    	:
	 * @Method 설명 	: SMS 발송템플릿 미리보기 조회
	 * @param           : HttpServletRequest Restful param
	 * @return          : ModelAndView HashMap
	 */
	@PostMapping(value ="/SYSM435SEL02")
	@ResponseBody
	public ResponseEntity<String> SYSM435SEL02(@RequestBody String request, Locale locale) {
		
		HashMap<String, Object> resultMap = new HashMap<String, Object>();
		String resultStr = null;
		
    	try {
    		JSONParser parser1 = new JSONParser();
			JSONObject obj = (JSONObject) parser1.parse(request);
			SYSM430VO vo = this.objectMapper.convertValue(obj, SYSM430VO.class);
			
			//기존 SMS템플릿조회서비스 재활용
			List<SYSM430VO> SYSM435SEL02Data = SYSM430Service.SYSM430SEL02(vo);
			
			// SMS템플릿 첨부파일 정보
			List<SYSM430VO> fileList = SYSM430Service.SYSM430SEL04(vo);
			
			resultMap.put("SYSM435SEL02Data"     , SYSM435SEL02Data);
			resultMap.put("SYSM435SEL02DataCount", SYSM435SEL02Data.size());
			resultMap.put("files", fileList);
			
			resultStr = this.objectMapper.writeValueAsString(resultMap);
    	}catch(Exception e) {
    		LOGGER.error("["+e.getClass()+"] Exception : " + e.getMessage());
    	}
    	return ResponseEntity.ok().body(resultStr);
	}	
	
	/**
	 * @Method Name     : SYSM435SEL02
	 * @작성일      	: 2022.06.17
	 * @작성자      	: sukim
	 * @변경이력    	:
	 * @Method 설명 	: SMS 발송템플릿 미리보기 조회
	 * @param           : HttpServletRequest Restful param
	 * @return          : ModelAndView HashMap
	 */
	@PostMapping(value ="/SYSM435FilDel")
	@ResponseBody
	public ResponseEntity<String> SYSM435FilDel(Locale locale, @RequestParam("SYSM435FilDel_data") String jsonData, MultipartHttpServletRequest mpfRequest) {
		
		HashMap<String, Object> resultMap = new HashMap<String, Object>();
		String resultStr = null;
		
    	try {
    		JSONParser parser1 = new JSONParser();
			JSONObject obj = (JSONObject) parser1.parse(jsonData);
			
    		String uploadPath     = propertiesService.getString(String.valueOf(obj.get("uploadPath")));
    		String targetFilePath = uploadPath + obj.get("tenantId");
    		
    		JSONArray arrDelFileName = (JSONArray) obj.get("delFileName");
    		
    		if(arrDelFileName != null && arrDelFileName.size() > 0) {
    			for( int i=0; i< arrDelFileName.size(); i ++){
    				FileUtils.removeFile(targetFilePath, arrDelFileName.get(i).toString());
    			}
    		}

			resultMap.put("msg", messageSource.getMessage("success.common.save", null, "success.common.save", locale));
			
			resultStr = this.objectMapper.writeValueAsString(resultMap);

    	}catch(Exception e) {
    		LOGGER.error("["+e.getClass()+"] Exception : " + e.getMessage());
    	}
    	
    	return ResponseEntity.ok().body(resultStr);
	}
	
}
