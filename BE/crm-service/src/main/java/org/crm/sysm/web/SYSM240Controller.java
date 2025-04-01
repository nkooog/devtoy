package org.crm.sysm.web;

import org.crm.config.spring.config.PropertiesService;
import org.crm.lgin.VO.LGIN000VO;
import org.crm.sysm.VO.SYSM240VO;
import org.crm.sysm.service.SYSM240Service;
import org.crm.util.com.ComnFun;
import org.crm.util.file.FileUtils;
import org.crm.util.xlsx.ExcelRead;
import org.crm.util.xlsx.ExcelReadOption;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.support.SessionStatus;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.servlet.ModelAndView;

import java.io.File;
import java.nio.file.Files;
import java.util.*;

/***********************************************************************************************
* Program Name : 메타공통코드관리 Main Controller
* Creator      : 허해민
* Create Date  : 2022.01.17
* Description  : 메타공통코드관리
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.01.17     허해민           최초생성
************************************************************************************************/
@Slf4j
@Controller
@RequestMapping("/sysm/*")
public class SYSM240Controller {

	@Resource(name = "SYSM240Service")
	private SYSM240Service SYSM240Service;

	@Resource( name = "propertiesService" )
	private PropertiesService propertiesService;

	private MessageSource messageSource;
	private ObjectMapper objectMapper;

	@Autowired
	public SYSM240Controller(MessageSource messageSource, ObjectMapper objectMapper) {
		this.messageSource = messageSource;
		this.objectMapper = objectMapper;
	}

	/**
	 * @Method Name : SYSM240M
	 * @작성일      	: 2022.01.17
	 * @작성자      	: 허해민
	 * @변경이력    	:
	 * @Method 설명 	: sysm/SYSM240M 웹 페이지 열기
	 * @param       :
	 * @return      : sysm/SYSM240M.jsp
	 */
	@RequestMapping("/SYSM240M")
	public String empPage(Model model) {
		return "th/sysm/SYSM240M";
	}
	
	/**
	 * @Method Name : SYSM240SEL01
	 * @작성일      	: 2022.01.17
	 * @작성자      	: 허해민
	 * @변경이력    	:
	 * @Method 설명  : 메타공통코드관리 전체조회
	 * @param       : HttpServletRequest Restful param
	 * @return      : ModelAndView HashMap
	 */
	@PostMapping(value = "/SYSM240SEL01")
	@ResponseBody
	public Map<String, Object> SYSM240SEL01(ModelAndView mav, @RequestBody String req) {
		HashMap<String, Object> hashMap = new HashMap<String, Object>();
		try {

			List<SYSM240VO> SYSM240SEL01List = SYSM240Service.SYSM240SEL01(this.objectMapper.readValue(req, SYSM240VO.class));

			hashMap.put("SYSM240SEL01List", this.objectMapper.writeValueAsString(SYSM240SEL01List));
			hashMap.put("SYSM240SEL01ListCount", SYSM240SEL01List.size());
			
    	}catch(Exception e) {
			e.printStackTrace();
    		log.error("["+e.getClass()+"] Exception : " + e.getMessage());
    	}
		return hashMap;
	}
	
	/**
	 * @Method Name : SYSM240M
	 * @작성일      	: 2022.04.18
	 * @작성자      	: 강동우
	 * @변경이력    	:
	 * @Method      : sysm/SYSM240M 관리항목한글명 중복체크
	 * @param       :
	 * @return      : sysm/SYSM240M.jsp
	 */
	@PostMapping(value ="/SYSM240SEL02")
	@ResponseBody  
	public Map<String, Object> SYSM240SEL02(ModelAndView mav, @RequestBody String req) throws Exception {

		HashMap<String, Object> hashMap = new HashMap<String, Object>();
		try {
			int chkCdNm = SYSM240Service.SYSM240SEL02(this.objectMapper.readValue(req, SYSM240VO.class));
			hashMap.put("flag",chkCdNm);
		}catch(Exception e) {
			log.error("["+e.getClass()+"] Exception : " + e.getMessage());
		}
		return hashMap;
	}
	
	/**
	 * @Method Name : SYSM240M
	 * @작성일      	: 2022.04.18
	 * @작성자      	: 강동우
	 * @변경이력    	:
	 * @Method 		: sysm/SYSM240M 관리항목영문명 중복체크
	 * @param       :
	 * @return      : sysm/SYSM240M.jsp
	 */
	@RequestMapping(value ="/SYSM240SEL03", method = RequestMethod.POST)
	@ResponseBody  
	public Map<String, Object> SYSM240SEL03(ModelAndView mav, @RequestBody String req) throws Exception {
		HashMap<String, Object> hashMap = new HashMap<String, Object>();
		try {
			int chkEnNm = SYSM240Service.SYSM240SEL03(this.objectMapper.readValue(req, SYSM240VO.class));
			hashMap.put("flag",chkEnNm);

		}catch(Exception e) {
			log.error("["+e.getClass()+"] Exception : " + e.getMessage());
		}
		return hashMap;
	}
	
	/**
	 * @Method Name : SYSM240M
	 * @작성일      	: 2022.04.19
	 * @작성자      	: 강동우
	 * @변경이력    	:
	 * @Method 		: sysm/SYSM240M 관리항목상세조회 수정
	 * @param       :
	 * @return      : sysm/SYSM240M.jsp
	 */
	@RequestMapping(value = "/SYSM240UPT01", method = RequestMethod.POST)
	@ResponseBody
	public Map<String, Object> SYSM240UPT01(ModelAndView mav, @RequestBody String req, SessionStatus status, Locale locale) {
		HashMap<String, Object> hashMap = new HashMap<String, Object>();
		try {

			int result = SYSM240Service.SYSM240UPT01(this.objectMapper.readValue(req, SYSM240VO.class));
	        if (result > 0) {
				status.setComplete();
				hashMap.put("msg"   , messageSource.getMessage("success.common.update", null, "success update", locale));
			}else {
				hashMap.put("msg"   , messageSource.getMessage("fail.common.update", null, "fail update", locale));
			}

    	}catch(Exception e) {
    		log.error("["+e.getClass()+"] Exception : " + e.getMessage());
    	}
		return hashMap;
	}
	
	/**
	 * @Method Name : SYSM240M
	 * @작성일      	: 2022.04.19
	 * @작성자      	: 강동우
	 * @변경이력    	:
	 * @Method 설명 	: sysm/SYSM240M 관리항목상세조회 삭제
	 * @param       :
	 * @return      : sysm/SYSM240M.jsp
	 */
	@RequestMapping(value = "/SYSM240UPT02", method = RequestMethod.POST)
	@ResponseBody
	public Map<String, Object> SYSM240UPT02(ModelAndView mav, @RequestBody String req, SessionStatus status, Locale locale) {
		HashMap<String, Object> hashMap = new HashMap<String, Object>();
		try {

	        int result = SYSM240Service.SYSM240UPT02(this.objectMapper.readValue(req, SYSM240VO.class));

	        if (result > 0) {
				status.setComplete();
				hashMap.put("msg"   , messageSource.getMessage("success.common.delete", null, "success delete", locale));
			}else {
				hashMap.put("msg"   , messageSource.getMessage("fail.common.delete", null, "fail delete", locale));
			}

    	}catch(Exception e) {
    		log.error("["+e.getClass()+"] Exception : " + e.getMessage());
    	}
		return hashMap;
	}
	
	/**
	 * @Method Name : SYSM240M
	 * @작성일      	: 2022.04.19
	 * @작성자      	: 강동우
	 * @변경이력    	:
	 * @Method 설명 	: sysm/SYSM240M 관리항목 신규등록
	 * @param       :
	 * @return      : sysm/SYSM240M.jsp
	 */
	@RequestMapping(value = "/SYSM240INS01", method = RequestMethod.POST)
	@ResponseBody
	public Map<String, Object> SYSM240INS01(ModelAndView mav, @RequestBody String req, SessionStatus status, Locale locale) {
		log.info("SYSM240INS01 페이지 호출");
		HashMap<String, Object> hashMap = new HashMap<String, Object>();
		try {

	        int result = SYSM240Service.SYSM240INS01(this.objectMapper.readValue(req, SYSM240VO.class));

	        if (result > 0) {
				status.setComplete();
				hashMap.put("msg"   , messageSource.getMessage("success.common.insert", null, "fail insert", locale));
			}else {
				hashMap.put("msg"   , messageSource.getMessage("fail.common.insert", null, "fail insert", locale));
			}

    	}catch(Exception e) {
    		log.error("["+e.getClass()+"] Exception : " + e.getMessage());
    	}
		return hashMap;
	}
	
	/**
	 * @Method Name : SYSM240M
	 * @작성일      	: 2022.04.20
	 * @작성자      	: 강동우
	 * @변경이력    	:
	 * @Method 설명 	: sysm/SYSM240M 엑셀 form 다운로드
	 * @param       :
	 * @return      : sysm/SYSM240M.jsp
	 */
	@RequestMapping(value ="/download")
	@ResponseBody
    public  ResponseEntity<byte[]> download(@RequestParam HashMap<Object, Object> params) {
		try {
			File file = FileUtils.downloadFileInfo(params);
			byte[] fileContent = Files.readAllBytes(file.toPath());

			HttpHeaders headers = new HttpHeaders();
			headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
			headers.setContentDispositionFormData("attachment", file.getName());

			return new ResponseEntity<>(fileContent, headers, HttpStatus.OK);
		} catch (Exception e) {
			log.error("["+e.getClass()+"] Exception : " + e.getMessage());
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	/**
	 * @Method Name : SYSM240P
	 * @작성일      	: 2022.04.20
	 * @작성자      	: 강동우
	 * @변경이력    	:
	 * @Method 설명 	: sysm/SYSM240P 엑셀 업로드 후 upsert
	 * @param       :
	 * @return      : sysm/SYSM240P.jsp
	 */
	@RequestMapping(value ="/SYSM240INS02", method = RequestMethod.POST)
	@ResponseBody 
	public Map<String, Object> SYSM240INS02(ModelAndView mav, MultipartHttpServletRequest request, SessionStatus status, HttpSession session) {
	  	log.info("\n === SYSM240INS02 ==============================================");
		HashMap<String, Object> hashMap = new HashMap<String, Object>();
	  	String message = "";
	  	try {
	  		
	  		String uploadFilePath	= propertiesService.getString("EXL");
	  		String tenantId 		= request.getParameter("tenantId");
		  	String saveFileName		= "";
		  	
		  	uploadFilePath = uploadFilePath + tenantId;
		  	
		  	ExcelReadOption exRead = new ExcelReadOption();
		  	Integer keyCount = 0;
		  	ComnFun cf = new ComnFun();
		  	
		  	MultipartHttpServletRequest multi = request;
		  	// input type="file" id
		  	MultipartFile file = multi.getFile("fileInput01");
		  	
		    if(file!=null){
		       saveFileName=UUID.randomUUID().toString().replaceAll("-", "") + "-" + file.getOriginalFilename();
		       //서버의 엑셀 업로드 지정 경로에 저장
		       File convFile = new File(uploadFilePath + "/" + saveFileName);
		       file.transferTo(convFile); 
		       log.info("\n === file upload 완료~");
		    }
		    log.info("\n ========== 엑셀 파일 읽어서 DB에 일괄 저장 ==========");
	        exRead.setFilePath(uploadFilePath + "/" + saveFileName);
	        exRead.setOutputColumns("A", "B", "C", "D", "E", "F", "G", "H", "I", "J"); // 출력할 칼럼 정의
	        exRead.setStartRow(2);  //타이틀 제외 여부(1라인부터는 title 포함의미)
	      
	        List<Map<String, Object>> list = new ArrayList<Map<String, Object>>(); // DB에 엑셀 데이터를 저장할 리스트 맵 
	        
	        int xlsCount = 0;   //엑셀건수
	        int basCount = 1000;//insert 기준 건수
	        int rowCount = 0;   //index 카운트
	        int insCount = 0;   //insert 카운트
	        int totCount = 0;   //누적카운트
	        
	        try { 
				List<Map<String, String>> o_result = ExcelRead.read(exRead);
				xlsCount = o_result.size(); 

				for(Map<String, String> map : o_result) {
					
					rowCount++;
					insCount++;
					
					//DB 일괄저장 처리 부
					Map<String, Object> mapdata = new HashMap<String, Object>();

					mapdata.put("mgntItemCd", String.valueOf(map.get("A")));  //숫자가 포함된 문자

					//cell 값  공백(빈값), "null", null, " " 인 경우  체크
					if(cf.isStringEmpty(String.valueOf(map.get("A")))) //키값이  true이면 진행 불가
						keyCount ++;
					else
						mapdata.put("mgntItemCd", String.valueOf(map.get("A")));
						
					
					if(cf.isStringEmpty(String.valueOf(map.get("B")))) 
						mapdata.put("mlingCd", null);
					else mapdata.put("mlingCd",map.get("B"));
					 
					
					if(cf.isStringEmpty(String.valueOf(map.get("C"))))
						mapdata.put("mgntItemTypCd", null); 
					else
						mapdata.put("mgntItemTypCd",map.get("C"));		
						
					if(cf.isStringEmpty(String.valueOf(map.get("D"))))
						mapdata.put("mgntItemCdNm", null); 
					else
						mapdata.put("mgntItemCdNm",map.get("D")); 
					
					if(cf.isStringEmpty(String.valueOf(map.get("E"))))
						mapdata.put("mgntItemCdEngnm", null); 
					else
						mapdata.put("mgntItemCdEngnm",map.get("E")); 		
			
					if(cf.isStringEmpty(String.valueOf(map.get("F"))))
						mapdata.put("dataSzIntMnriCnt", null); 
					else
						mapdata.put("dataSzIntMnriCnt", Integer.parseInt(String.valueOf(map.get("F")))); 				
					
					if(cf.isStringEmpty(String.valueOf(map.get("G"))))
						mapdata.put("dataSzSmlcntMnriCnt", null); 
					else
						mapdata.put("dataSzSmlcntMnriCnt", Integer.parseInt(String.valueOf(map.get("G")))); 
					
					if(cf.isStringEmpty(String.valueOf(map.get("H"))))
						mapdata.put("dmnCd", null); 
					else
						mapdata.put("dmnCd", map.get("H")); 			
					
					if(cf.isStringEmpty(String.valueOf(map.get("I"))))
						mapdata.put("linkTblId", null); 
					else
						mapdata.put("linkTblId",map.get("I"));
					
					if(cf.isStringEmpty(String.valueOf(map.get("J"))))
						mapdata.put("mgntItemDesc", null); 
					else
						mapdata.put("mgntItemDesc",map.get("J"));
					
					if(cf.isStringEmpty(String.valueOf(map.get("K"))))
						mapdata.put("crypTgtYn", null); 
					else
						mapdata.put("crypTgtYn",map.get("K"));
					
					// 세션의 정보로 등록자ID,등록자,최종수정자,최종수정자ID
					if (!Objects.isNull(session.getAttribute("user"))) {
						LGIN000VO user = (LGIN000VO)session.getAttribute("user");
						
						mapdata.put("regrOrgCd",String.valueOf(user.getOrgCd()));
						mapdata.put("regrId",String.valueOf(user.getUsrId()));
						mapdata.put("lstCorprId",String.valueOf(user.getUsrId()));
						mapdata.put("lstCorprOrgCd",String.valueOf(user.getOrgCd()));
					}	
					
					//건 수 만큼 리스트에 담음
					list.add(mapdata);
					
					if(insCount==basCount || xlsCount == rowCount) {
						SYSM240Service.SYSM240INS02(list); //일괄등록 서비스 호출
						totCount = totCount + insCount;
						insCount = 0; //초기화
						list = new ArrayList<Map<String, Object>>(); 
						//log.info("\n ***** 누적 입력 totCount : " + totCount + ", ***** list 초기화 확인 : " + list.size());
					}
				}
	        } catch (Exception e) {
	        	log.error("["+e.getClass()+"] Exception : " + e.getMessage());
	        }
	        
	        //엑셀건수와 토탈입력건수가 같다면~
			if (xlsCount == totCount) {
				status.setComplete();
	    		message = "일괄등록성공";
	    	}else {
	    		message = "일괄등록실패";
	    	}

			hashMap.put("result", message);
			hashMap.put("msg"   , message);
			
		    log.info("\n=== end ===");
		    
	  	}catch(Exception e) {
    		log.error("["+e.getClass()+"] Exception : " + e.getMessage());
    	} 
  	
  	    return hashMap;
	}



	/**
	 * @Method Name : SYSM240DEL01
	 * @작성일      	: 2022.04.19
	 * @작성자      	: 강동우
	 * @변경이력    	:
	 * @Method 		: sysm/SYSM240M 관리항목상세조회 수정
	 * @param       :
	 * @return      : sysm/SYSM240M.jsp
	 */
	@RequestMapping(value = "/SYSM240DEL01", method = RequestMethod.POST)
	@ResponseBody
	public Map<String, Object> SYSM240DEL01(ModelAndView mav, @RequestBody String req, SessionStatus status, Locale locale) {
		HashMap<String, Object> hashMap = new HashMap<String, Object>();
		try {

			int result = SYSM240Service.SYSM240DEL01(this.objectMapper.readValue(req, SYSM240VO.class));
			if (result > 0) {
				status.setComplete();
				hashMap.put("msg"   , messageSource.getMessage("success.common.update", null, "success update", locale));
			}else {
				hashMap.put("msg"   , messageSource.getMessage("fail.common.update", null, "fail update", locale));
			}

		}catch(Exception e) {
			log.error("["+e.getClass()+"] Exception : " + e.getMessage());
		}
		return hashMap;
	}

	/**
	 * @Method Name : SYSM240SEL04
	 * @작성일      	: 2022.11.04
	 * @작성자      	: 김보영
	 * @변경이력    	:
	 * @Method 설명  : 관리항목 하위 공통코드 유무 조회
	 * @param       : HttpServletRequest Restful param
	 * @return      : ModelAndView HashMap
	 */
	@RequestMapping(value = "/SYSM240SEL04", method = RequestMethod.POST)
	@ResponseBody
	public Map<String, Object> SYSM240SEL04(ModelAndView mav, @RequestBody String req) {
		HashMap<String, Object> hashMap = new HashMap<String, Object>();
		try {
			Integer result = SYSM240Service.SYSM240SEL04(this.objectMapper.readValue(req, SYSM240VO.class));
			hashMap.put("result", result);
		}catch(Exception e) {
			log.error("["+e.getClass()+"] Exception : " + e.getMessage());
		}
		return hashMap;
	}
}
