package org.crm.sysm.web;

import java.io.File;
import java.util.ArrayList;
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
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.servlet.ModelAndView;

import com.fasterxml.jackson.databind.ObjectMapper;

import org.crm.comm.VO.COMM120VO;
import org.crm.config.spring.config.PropertiesService;
import org.crm.sysm.VO.SYSM430VO;
import org.crm.sysm.service.SYSM430Service;
import org.crm.util.file.FileUtils;
import lombok.extern.slf4j.Slf4j;
/***********************************************************************************************
* Program Name : SMS탬플릿관리 controller
* Creator      : 강동우
* Create Date  : 2022.04.28
* Description  : SMS탬플릿관리
* Modify Desc  : 
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.04.28     강동우           최초생성
************************************************************************************************/
@Slf4j
@Controller
@RequestMapping("/sysm/*")
public class SYSM430Controller {

	@Autowired
	private PropertiesService propertiesService;
	
	@Resource(name = "SYSM430Service")
	private SYSM430Service sysm430Service;
	
	@Autowired
	MessageSource messageSource;
	
	@Autowired
	private ObjectMapper objectMapper;
	
	private static final Logger LOGGER = LoggerFactory.getLogger(SYSM430Controller.class);
	
	@GetMapping("/SYSM430M")
	public String SYSM430M() {
        return "th/sysm/SYSM430M";
	}

		
	/**
	 * @Method Name : SYSM430SEL01
	 * @작성일      	: 2022.04.28
	 * @작성자      	: 강동우
	 * @변경이력    	:
	 * @Method 설명 	: SMS 템플릿 조회
	 * @param       : HttpServletRequest Restful param
	 * @return      : ModelAndView HashMap
	 */
	@PostMapping(value ="/SYSM430SEL01")
	@ResponseBody
	public ResponseEntity<String> SYSM430SEL01(@RequestBody String request, Locale locale) {

		HashMap<String, Object> resultMap = new HashMap<String, Object>();
		String resultStr = null;

		try {

			JSONParser parser1 = new JSONParser();
			JSONObject obj = (JSONObject) parser1.parse(request);

			List<SYSM430VO> list = sysm430Service.SYSM430SEL01(this.objectMapper.convertValue(obj, SYSM430VO.class));
			

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
	 * @Method Name : SYSM430SEL02
	 * @작성일      	: 2022.04.29
	 * @작성자      	: 강동우
	 * @변경이력    	:
	 * @Method 설명 	: SMS 템플릿 구성항목 조회
	 * @param       : HttpServletRequest Restful param
	 * @return      : ModelAndView HashMap
	 */
	
	@PostMapping(value ="/SYSM430SEL02")
	@ResponseBody
	public ResponseEntity<String> SYSM430SEL02(@RequestBody String request, Locale locale) {
		
		HashMap<String, Object> resultMap = new HashMap<String, Object>();
		String resultStr = null;

		try {
			JSONParser parser1 = new JSONParser();
			JSONObject obj = (JSONObject) parser1.parse(request);

			List<SYSM430VO> list = sysm430Service.SYSM430SEL02(this.objectMapper.convertValue(obj, SYSM430VO.class));
			
			// SMS템플릿 첨부파일 정보
			List<SYSM430VO> fileList = sysm430Service.SYSM430SEL04(this.objectMapper.convertValue(obj, SYSM430VO.class));
			
			resultMap.put("count", list.size());
			resultMap.put("list", objectMapper.writeValueAsString(list));
			resultMap.put("files", objectMapper.writeValueAsString(fileList));
			resultMap.put("totalList", objectMapper.writeValueAsString(fileList));
			resultMap.put("msg", messageSource.getMessage("success.common.select", null, "success.common.select", locale));

			resultStr = this.objectMapper.writeValueAsString(resultMap);
		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}
		return ResponseEntity.ok().body(resultStr);
	}
	
	/**
	 * @Method Name : SYSM430INS01
	 * @작성일      : 2022.05.02
	 * @작성자      : 강동우
	 * @변경이력    :
	 * @Method 설명 : SMS 템플릿 추가
	 * @param       : ModelAndView
	 * @return : ModelAndView HashMap
	 */
	
	@PostMapping(value ="/SYSM430INS01")
	@ResponseBody
	public ResponseEntity<String> SYSM430INS01(@RequestBody String request, Locale locale) {
		
		HashMap<String, Object> resultMap = new HashMap<String, Object>();
		String resultStr = null;

		try {
			JSONParser parser1 = new JSONParser();
			JSONObject obj = (JSONObject) parser1.parse(request);
			
			JSONArray listArray = (JSONArray) obj.get("list");

			// VO를 List로 변환
			List<SYSM430VO> list = new ArrayList<SYSM430VO>();
	        for (Object item : listArray) {
	            SYSM430VO vo = this.objectMapper.convertValue(item, SYSM430VO.class);
	            list.add(vo);
	        }
	        
			Integer rtn = sysm430Service.SYSM430INS01(list);
			
			if (rtn > 0) {
				resultMap.put("msg", messageSource.getMessage("success.common.select", null, "success.common.add", locale));
			}

			resultStr = this.objectMapper.writeValueAsString(resultMap);

		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}
		return ResponseEntity.ok().body(resultStr);
	}
	
	/**
	 * @Method Name : SYSM430INS02
	 * @작성일      : 2022.05.02
	 * @작성자      : 강동우
	 * @변경이력    :
	 * @Method 설명 : SMS 템플릿 구성 항목 추가
	 * @param       : ModelAndView
	 * @return : ModelAndView HashMap
	 */
	
	@PostMapping(value ="/SYSM430INS02")
	@ResponseBody
	public ResponseEntity<String> SYSM430INS02(@RequestBody String request, Locale locale) {

		HashMap<String, Object> resultMap = new HashMap<String, Object>();
		String resultStr = null;

		try {
			JSONParser parser1 = new JSONParser();
			JSONObject obj = (JSONObject) parser1.parse(request);
			
			JSONArray listArray = (JSONArray) obj.get("list");

			// VO를 List로 변환
			List<SYSM430VO> list = new ArrayList<SYSM430VO>();
	        for (Object item : listArray) {
	            SYSM430VO vo = this.objectMapper.convertValue(item, SYSM430VO.class);
	            list.add(vo);
	        }
	        
			Integer rtn = sysm430Service.SYSM430INS02(list);
			
			if (rtn > 0) {
				resultMap.put("msg", messageSource.getMessage("success.common.select", null, "success.common.add", locale));
			}

			resultStr = this.objectMapper.writeValueAsString(resultMap);

		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}
		return ResponseEntity.ok().body(resultStr);
	}
	
	/**
	 * @Method Name : SYSM430DEL01
	 * @작성일      : 2022.05.02
	 * @작성자      : 강동우
	 * @변경이력    :
	 * @Method 설명 : SMS 템플릿 삭제
	 * @param       :  ModelAndView
	 * @return      : ModelAndView HashMap
	 */
	
	@PostMapping(value ="/SYSM430DEL01")
	@ResponseBody
	public ResponseEntity<String> SYSM430DEL01(@RequestBody String request, Locale locale) {
		
		HashMap<String, Object> resultMap = new HashMap<String, Object>();
		String resultStr = null;

		try {
			JSONParser parser1 = new JSONParser();
			JSONObject obj = (JSONObject) parser1.parse(request);
			
			JSONArray listArray = (JSONArray) obj.get("list");

			// VO를 List로 변환
			List<SYSM430VO> list = new ArrayList<SYSM430VO>();
	        for (Object item : listArray) {
	            SYSM430VO vo = this.objectMapper.convertValue(item, SYSM430VO.class);
	            list.add(vo);
	        }

			Integer rtn = sysm430Service.SYSM430DEL01(list);
			
			if (rtn > 0) {
				Integer rtn2 = sysm430Service.SYSM430DEL02(list);
				
			}else {
				resultMap.put("msg", messageSource.getMessage("fail.common.delete", null, "fail.common.delete", locale));
			}
			resultMap.put("msg", messageSource.getMessage("success.common.delete", null, "success.common.delete", locale));
			
			resultStr = this.objectMapper.writeValueAsString(resultMap);
		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}
		return ResponseEntity.ok().body(resultStr);
	}
	
	/**
	 * @Method Name : SYSM430DEL03
	 * @작성일      : 2022.05.02
	 * @작성자      : 강동우
	 * @변경이력    :
	 * @Method 설명 : SMS 템플릿 구성 항목 삭제
	 * @param       :  ModelAndView
	 * @return      : ModelAndView HashMap
	 */
	@PostMapping(value ="/SYSM430DEL03")
	@ResponseBody
	public ResponseEntity<String> SYSM430DEL03(@RequestBody String request, Locale locale) {
		
		HashMap<String, Object> resultMap = new HashMap<String, Object>();
		String resultStr = null;

		try {
			JSONParser parser1 = new JSONParser();
			JSONObject obj = (JSONObject) parser1.parse(request);
			
			JSONArray listArray = (JSONArray) obj.get("list");

			// VO를 List로 변환
			List<SYSM430VO> list = new ArrayList<SYSM430VO>();
	        for (Object item : listArray) {
	            SYSM430VO vo = this.objectMapper.convertValue(item, SYSM430VO.class);
	            list.add(vo);
	        }

			Integer rtn = sysm430Service.SYSM430DEL03(list);
			if (rtn > 0) {
				resultMap.put("msg", messageSource.getMessage("success.common.delete", null, "success.common.delete", locale));
			}

			resultStr = this.objectMapper.writeValueAsString(resultMap);
			
		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}
		return ResponseEntity.ok().body(resultStr);
	}
	
	@PostMapping(value ="/SYSM430INS03")
	@ResponseBody
	public ResponseEntity<String> SYSM430INS03(@ModelAttribute("SYSM430VO") SYSM430VO vo, MultipartHttpServletRequest request, ModelAndView model, Locale locale) {

		
		HashMap<String, Object> resultMap = new HashMap<String, Object>();
		String resultStr = null;
		
		boolean isSuc = true;
		
		try {
			String jsondata = this.objectMapper.writeValueAsString(vo);
			
			// SMS템플릿별 첨부파일
			List<MultipartFile> attachFileList = request.getFiles("attachFiles");
			
			if(vo.getDelFiles()!=null && vo.getDelFiles().length > 0) {
				
				for(String delfile : vo.getDelFiles()) {
					SYSM430VO param = new SYSM430VO();
					param.setTenantId(vo.getTenantId());
					param.setFile_id(Integer.parseInt(delfile));

					String path = sysm430Service.SYSM430SEL05(param);
					
					if(path!=null && !"".equals(path)) {
						File f = new File(path);
						
						if(f.exists()) {
							f.delete();
							sysm430Service.SYSM430DEL04(param);
						}else {
//							throw new FileNotFoundException();
							isSuc = false;
						}
					}
					
					param = null;
				}
				
			}
			
			if(attachFileList!=null && attachFileList.size() > 0) {
				List<COMM120VO> resultList = FileUtils.uploadPreJob(propertiesService.getString(vo.getFile_path()), jsondata, attachFileList);
				
				for(COMM120VO result : resultList) {
					vo.setFile_path(result.getApndFilePsn());
					vo.setOrign_file_nm(result.getApndFileNm());
					vo.setUpload_file_nm(result.getApndFileIdxNm());
					
					sysm430Service.SYSM430INS03(vo);
				}
			}
			
			resultMap.put("result", isSuc);
			resultMap.put("msg", messageSource.getMessage( (isSuc) ? "success.common.save" : "fail.common.msg" , null, "success.common.add", locale));
			
			resultStr = this.objectMapper.writeValueAsString(resultMap);
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		
		return ResponseEntity.ok().body(resultStr);

	}
}
