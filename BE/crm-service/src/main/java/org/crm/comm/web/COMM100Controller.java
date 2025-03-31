package org.crm.comm.web;

import org.crm.comm.VO.COMM100VO;
import org.crm.comm.VO.COMM120VO;
import org.crm.comm.service.COMM100Service;
import org.crm.config.spring.config.PropertiesService;
import org.crm.sysm.VO.SYSM430VO;
import org.crm.sysm.service.SYSM430Service;
import org.crm.util.file.FileUtils;
import org.crm.util.json.JsonUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.disk.DiskFileItem;
import org.apache.commons.io.IOUtils;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.servlet.ModelAndView;

import java.io.*;
import java.nio.file.Files;
import java.util.*;

/***********************************************************************************************
* Program Name : 공통 서비스 Controller
* Creator      : sukim
* Create Date  : 2022.02.03
* Description  : 공통 서비스
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.02.03     sukim            최초생성
************************************************************************************************/
@Slf4j
@Controller
@RequestMapping("/comm/*")
public class COMM100Controller {
	
	private static final Logger LOGGER = LoggerFactory.getLogger(COMM100Controller.class);

	@Resource(name = "COMM100Service")
	private COMM100Service COMM100Service;
	
	@Resource(name = "SYSM430Service")
	private SYSM430Service sysm430Service;
	
	@Resource( name = "propertiesService" )
	PropertiesService propertiesService;

	@Autowired
	private MessageSource messageSource;

	@Autowired
	private ObjectMapper objectMapper;

    /**
     * @Method Name : COMM100SEL01
     * @작성일      : 2022.02.08
     * @작성자      : sukim
     * @변경이력    : 
     * @Method 설명 : 공통코드 목록조회
     *                대분류코드리스트에 해당하는 공통코드 리스트 조회
	 * @param       : ModelAndView, HttpServletRequest Restful param(대분류코드리스트)
	 * @return      : ModelAndView HashMap
     */    
    @PostMapping(value ="/COMM100SEL01")
    @ResponseBody    
    public Map<String, Object> COMM100SEL01(Locale locale, ModelMap model, @RequestBody String request) {
		log.debug(" ############################################################## ");
	    HashMap<String, Object> hashMap = new HashMap<String, Object>();
	    JSONParser parser = new JSONParser();
    	try {
            JSONObject jsonObject = (JSONObject) parser.parse(request);
            JSONArray codeArray = (JSONArray) jsonObject.get("codeList");
            String usrGrd = (jsonObject.containsKey("usrGrd")) ? jsonObject.get("usrGrd").toString() : "";
            String lang = this.propertiesService.getString("MlingCd");
	    	
            Map<String, Object> param = new HashMap<String, Object>();
            List<String> codeList = new ArrayList<String>();
            for(int i=0 ; i<codeArray.size() ; i++){
            	JSONObject tempObj = (JSONObject) codeArray.get(i);
            	codeList.add((String)tempObj.get("mgntItemCd"));
            }
            param.put("mgntItemCdListMap"	, codeList);
            param.put("mlingCd"          	, lang    );
            param.put("usrGrd"				, usrGrd);	
            
	        List<COMM100VO> commCodeList = COMM100Service.COMM100SEL01(param);

			hashMap.put("codeList"  , this.objectMapper.writeValueAsString(commCodeList));
			hashMap.put("result"    , "0"); //성공이면 0, 에러이면 1을 넣는다.
			hashMap.put("msg"       , this.messageSource.getMessage("success.common.select", null, "success select", locale)); //다국어 처리결과 메시지 리턴
    	}catch(Exception e) {
    		LOGGER.error("["+e.getClass()+"] Exception : " + e.getMessage());
    	}
		return hashMap;
    }  	

    /**
     * @Method Name : COMM100SEL02
     * @작성일      : 2022.03.03
     * @작성자      : sukim
     * @변경이력    : 
     * @Method 설명 : 공통 태넌트명 조회
	 * @param       : 태넌트ID
	 * @return      : ModelAndView HashMap
     */    
    @PostMapping(value ="/COMM100SEL02")
    @ResponseBody    
    public Map<String, Object> COMM100SEL02(Locale locale, @RequestBody String request) {

	    HashMap<String, Object> hashMap = new HashMap<String, Object>();
	    JSONParser parser = new JSONParser();
    	try {
        	JSONObject jsonObject = (JSONObject) parser.parse(request);
            COMM100VO vo = new COMM100VO();

	    	vo.setTenantId((String) jsonObject.get("tenantId"));
	    	String rtnObjName = (String) jsonObject.get("objName"); //테넌트명을 세팅할 객체
		    String rtnObjLvl = (String) jsonObject.get("objLvl"); //테넌트 레벨을 세팅할 객체
	    	
	    	COMM100VO tenantInfo = COMM100Service.COMM100SEL02(vo);
			hashMap.put("result"    , this.objectMapper.writeValueAsString(tenantInfo));
			hashMap.put("ObjName"   , rtnObjName);
		    hashMap.put("ObjLvl"    , rtnObjLvl);
			hashMap.put("msg"       , this.messageSource.getMessage("success.common.select", null, "success select", locale));
    	}catch(Exception e) {
    		LOGGER.error("["+e.getClass()+"] Exception : " + e.getMessage());
    	}
		return hashMap;
    }     

    /**
     * @Method Name : COMM100SEL03
     * @작성일      : 2022.04.12
     * @작성자      : sukim
     * @변경이력    : 
     * @Method 설명 : 공통 조직명, 조직경로 조회
	 * @param       : 태넌트ID, 조직코드
	 * @return      : ModelAndView HashMap
     */    
    @PostMapping(value ="/COMM100SEL03")
    @ResponseBody    
    public Map<String, Object> COMM100SEL03(Locale locale, @RequestBody String request) {

	    HashMap<String, Object> hashMap = new HashMap<String, Object>();
	    JSONParser parser = new JSONParser();

    	try {
		    JSONObject jsonObject = (JSONObject) parser.parse(request);
            COMM100VO vo = new COMM100VO();
	    	vo.setTenantId((String) jsonObject.get("tenantId"));
	    	vo.setOrgCd((String) jsonObject.get("orgCd"));
	    	
	    	COMM100VO orgPath = COMM100Service.COMM100SEL03(vo);
			hashMap.put("result"    , this.objectMapper.writeValueAsString(orgPath));
			hashMap.put("msg"       , this.messageSource.getMessage("success.common.select", null, "success select", locale));
    	}catch(Exception e) {
    		LOGGER.error("["+e.getClass()+"] Exception : " + e.getMessage());
    	}
		return hashMap;
    }
    
    /**
     * @Method Name : COMM100SEL04
     * @작성일      : 2022.04.12
     * @작성자      : sukim
     * @변경이력 : 
     * @Method 설명 : 리스트 형태 코드 조회
     * @param :
     * @return :
     */
   @PostMapping(value ="/COMM100SEL04")
   @ResponseBody    
   public Map<String, Object> COMM100SEL04(ModelAndView mav, @RequestBody String request) {

	   HashMap<String, Object> resultMap = new HashMap<String, Object>();
	   JSONParser parser = new JSONParser();

	    try {
			JSONObject jsonObject = (JSONObject) parser.parse(request);
	        List<COMM100VO> list = COMM100Service.COMM100SEL04(this.objectMapper.convertValue(jsonObject, COMM100VO.class));

	        resultMap.put("count", list.size());
			resultMap.put("list", new ObjectMapper().writeValueAsString(list));
			resultMap.put("msg", "정상적으로 조회하였습니다.");

	    }catch(Exception e) {
	        LOGGER.error("["+e.getClass()+"] Exception : " + e.getMessage());
	    }
		return resultMap;
   }
   
   
    /**
      * @Method Name : COMM100SEL05
      * @작성일 : 2023. 1. 9
      * @작성자 : sjyang
      * @변경이력 : 
      * @Method 설명 : 부모코드 (mgntItemCd), 자식코드(comCd) 를 조합하여 자식코드의 코드리스트 조회
      * @param :
      * @return :
      */
    @PostMapping(value ="/COMM100SEL05")
    @ResponseBody    
    public Map<String, Object> COMM100SEL05(ModelAndView mav, @RequestBody String request) {

	    HashMap<String, Object> resultMap = new HashMap<String, Object>();
	    JSONParser parser = new JSONParser();

    	try {
		    JSONObject jsonObject = (JSONObject) parser.parse(request);
    		List<COMM100VO> list = COMM100Service.COMM100SEL05(this.objectMapper.convertValue(jsonObject, COMM100VO.class));
    		
    		resultMap.put("count", list.size());
			resultMap.put("list", new ObjectMapper().writeValueAsString(list));
			resultMap.put("msg", "정상적으로 조회하였습니다.");
    	}catch(Exception e) {
    		LOGGER.error("["+e.getClass()+"] Exception : " + e.getMessage());
    	}
		return resultMap;
    }

	@RequestMapping("/COMM120P")
	public ModelAndView COMM120P() {
		return new ModelAndView("comm/COMM120P");
	}
	
	
	/**
	 * @Method Name : CMMT300INS01
	 * @작성일      : 2022.01.10
	 * @작성자      : bykim
	 * @변경이력    : 
	 * @Method 설명 : 게시글 등록
	 * @param       : HttpServletRequest Restful param
	 * @return      : ModelAndView HashMap
	 */    
	
	@PostMapping(value ="/COMM100INS01")
	@ResponseBody    
	public ResponseEntity<String> COMM100INS01(Locale locale, 
			@RequestParam("COMM100INS01_data") String jsonData, MultipartHttpServletRequest mpfRequest) {
		
		HashMap<String, Object> resultMap = new HashMap<>();
		String resultStr = null;
		try {
			JSONObject obj = JsonUtil.parseJSONString(jsonData);
			JSONArray jsonArray = JsonUtil.parseJSONArray(jsonData, "tmplFiles");
			String uploadPath     = propertiesService.getString(String.valueOf(obj.get("uploadPath")));
			
			
			List<COMM120VO> comm120List = new ArrayList<>();
			List<MultipartFile> fileList = mpfRequest.getFiles("img_files");
			List<MultipartFile> tmplFileList = new ArrayList<MultipartFile>();
			
			if( jsonArray!=null && jsonArray.size() > 0 ) {
				SYSM430VO param = new SYSM430VO();
				
				// file 객체에서 multipart 객체로 변환
				for(Object object :jsonArray) {
					String tenantId = (String) obj.get("tenantId");
					long tmplMgntNo = (long) obj.get("tmplMgntNo");
					long file_id = (long) object;
					
					param.setTenantId(tenantId);
					param.setTmplMgntNo((int)tmplMgntNo);
					param.setFile_id((int)file_id);
					
					String path = sysm430Service.SYSM430SEL05(param);
					
					LOGGER.debug(path);

					if(path!=null && !"".equals(path)) {
						File f = new File(path);
						FileItem fileItem = null;
						if(f!=null) {
							fileItem = new DiskFileItem("file"
													,   Files.probeContentType(f.toPath())
													,	false
													,	f.getName()
													,	(int)f.length()
													,	f.getParentFile()
									);
							try (
									InputStream input = new FileInputStream(f);
									OutputStream out = fileItem.getOutputStream(); 
								)
							{
								IOUtils.copy(input, out);
								// TODO:: 수정필요
								MultipartFile multipartFile = new CustomMultipartFile(f);
								tmplFileList.add(multipartFile);
								multipartFile = null;
							} catch (IOException e) {
								// TODO: handle exception
								resultMap.put("msg", messageSource.getMessage("fail.common.msg", null, "fail.common.msg", locale));
								e.printStackTrace();
							}
							fileItem = null;
						}
						
					}
				}
			}
			
			LOGGER.debug(" list len :" + fileList.size());
			
			// file객체에서 multipart로 변환 된 list와 multipart로 받은 list 병합 
			tmplFileList.addAll(fileList);
			
			if(tmplFileList.size() > 0) {
				comm120List= FileUtils.uploadPreJob(uploadPath, obj, tmplFileList);
			}
			
			resultMap.put("jsonData", new ObjectMapper().writeValueAsString(jsonData));
			resultMap.put("info", new ObjectMapper().writeValueAsString(comm120List));
			resultMap.put("msg", messageSource.getMessage("success.common.save", null, "success.common.save", locale));
			
			resultStr = this.objectMapper.writeValueAsString(resultMap);
			
		} catch (Exception e) {
			e.printStackTrace();
		}
		return ResponseEntity.ok().body(resultStr);
	}
	
}