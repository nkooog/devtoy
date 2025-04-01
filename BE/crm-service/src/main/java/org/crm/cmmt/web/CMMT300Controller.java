package org.crm.cmmt.web;

import org.crm.cmmt.VO.CMMT210VO;
import org.crm.cmmt.VO.CMMT230VO;
import org.crm.cmmt.VO.CMMT300VO;
import org.crm.cmmt.service.CMMT230Service;
import org.crm.cmmt.service.CMMT300Service;
import org.crm.util.crypto.AES256Crypt;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

/***********************************************************************************************
* Program Name : 공지사항상세 팝업 Controller
* Creator      : 김보영
* Create Date  : 2022.01.10
* Description  : 통합계시글관리
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.01.10    김보영           최초생성
************************************************************************************************/
@Slf4j
@Controller
@RequestMapping("/cmmt/*")
public class CMMT300Controller {

	@Resource(name = "CMMT300Service")
	private CMMT300Service CMMT300Service;
	
	@Resource(name = "CMMT230Service")
	private CMMT230Service CMMT230Service;

	@Autowired
	private ObjectMapper objectMapper;

	private static final Logger LOGGER = LoggerFactory.getLogger(CMMT300Controller.class);

	/**
	 * @Method Name : CMMT300P
	 * @작성일      : 2022.01.10
	 * @작성자      : bykim
	 * @변경이력    : 
	 * @Method 설명 : CMMT/CMMT300P 웹 페이지 열기
	 * @param       :  
	 * @return      : CMMT/CMMT300P.jsp 
	 */	
	@RequestMapping("/CMMT300P")
	public String CMMT300P() {
		LOGGER.info("CMMT300P 페이지 열기");
		return "th/cmmt/CMMT300P";
	}	
	
	
	/**
	 * @Method Name : CMMT301P
	 * @작성일      : 2022.01.10
	 * @작성자      : bykim
	 * @변경이력    : 
	 * @Method 설명 : CMMT/CMMT321P 웹 페이지 열기
	 * @param       :  
	 * @return      : CMMT/CMMT321P.jsp 
	 */	
	@RequestMapping("/CMMT301P")
	public String CMMT301P() {
		LOGGER.info("CMMT301P 페이지 열기");
		return "th/cmmt/CMMT301P";
	}	
	
	/**
	 * @Method Name : CMMT321P
	 * @작성일      : 2022.01.10
	 * @작성자      : bykim
	 * @변경이력    : 
	 * @Method 설명 : CMMT/CMMT321P 웹 페이지 열기
	 * @param       :  
	 * @return      : CMMT/CMMT321P.jsp 
	 */	
	@RequestMapping("/CMMT321P")
	public String CMMT321P() {
		LOGGER.info("CMMT321P 페이지 열기");
		return "th/cmmt/CMMT321P";
	}	
	
	
	/**
	 * @Method Name : CMMT322P
	 * @작성일      : 2022.01.10
	 * @작성자      : bykim
	 * @변경이력    : 
	 * @Method 설명 : CMMT/CMMT322P 웹 페이지 열기
	 * @param       :  
	 * @return      : CMMT/CMMT322P.jsp 
	 */	
	@RequestMapping("/CMMT322P")
	public String CMMT322P() {
		LOGGER.info("CMMT322P 페이지 열기");
		return "th/cmmt/CMMT322P";
	}	
	
	/**
	 * @Method Name : CMMT323P
	 * @작성일      : 2022.01.10
	 * @작성자      : bykim
	 * @변경이력    : 
	 * @Method 설명 : CMMT/CMMT323P 웹 페이지 열기
	 * @param       :  
	 * @return      : CMMT/CMMT323P.jsp 
	 */	
	@RequestMapping("/CMMT323P")
	public String CMMT323P() {
		LOGGER.info("CMMT323P 페이지 열기");
		return "th/cmmt/CMMT323P";
	}	


	/**
	 * @Method Name : CMMT300SEL01
	 * @작성일      : 2022.01.10
	 * @작성자      : bykim
	 * @변경이력    : 
	 * @Method 설명 : 게시판 조직권한 조회
	 * @param       : HttpServletRequest Restful param
	 * @return      : ModelAndView HashMap
	 */    
	@PostMapping(value ="/CMMT300SEL01")
	@ResponseBody
	public Map<String, Object> CMMT300SEL01(ModelAndView mav, @RequestBody String req){
		HashMap<String, Object> hashMap = new HashMap<String, Object>();
		JSONParser parser = new JSONParser();
		try {
			JSONObject obj = (JSONObject) parser.parse(req);
			
			CMMT300VO vo = this.objectMapper.convertValue(obj, CMMT300VO.class);
			List<CMMT300VO> CMMT300VOInfo = CMMT300Service.CMMT300SEL01(vo);
			
			String json = this.objectMapper.writeValueAsString(CMMT300VOInfo);
			           
			LOGGER.info("CMMT300M 페이지 열기  : "+json);

			hashMap.put("CMMT300VOInfo", json);
			hashMap.put("CMMT300VOListCount", CMMT300VOInfo.size());

		}catch(Exception e) {
			e.printStackTrace();
			LOGGER.error("["+e.getClass()+"] Exception : " + e.getMessage());
		}
		return hashMap;
	}
	
	/**
	 * @Method Name : CMMT300SEL05
	 * @작성일      : 2022.01.10
	 * @작성자      : bykim
	 * @변경이력    : 
	 * @Method 설명 : 게시판 상세조회
	 * @param       : HttpServletRequest Restful param
	 * @return      : ModelAndView HashMap
	 */    
	@PostMapping(value ="/CMMT300SEL05")
	@ResponseBody    
	public Map<String, Object> CMMT300SEL05(ModelAndView mav, @RequestBody String req){

		HashMap<String, Object> hashMap = new HashMap<String, Object>();
		JSONParser parser = new JSONParser();

		try {
			JSONObject obj = (JSONObject) parser.parse(req);
			
			CMMT210VO vo = this.objectMapper.convertValue(obj, CMMT210VO.class);
			
			CMMT210VO CMMT300VOInfo = CMMT300Service.CMMT300SEL05(vo);
			
	        String cipherText = AES256Crypt.decrypt(CMMT300VOInfo.getUsrNm());
	        CMMT300VOInfo.setUsrNm(cipherText);
			// 첨부파일 조회
			List<CMMT300VO> CMMT300VOInfo2 = CMMT300Service.CMMT300SEL06(vo);
			CMMT300VOInfo.setCMMT300FileList(CMMT300VOInfo2);
			
			CMMT230VO vo2 = new CMMT230VO();
			vo2.setTenantId(String.valueOf(obj.get("tenantId")));
			vo2.setCtgrMgntNo(Integer.parseInt(String.valueOf(obj.get("ctgrMgntNo"))));
			vo2.setBlthgMgntNo(Integer.parseInt(String.valueOf(obj.get("blthgMgntNo"))));
			
			//게시 내용 조회
			List<CMMT230VO> CMMT230VOInfo = CMMT230Service.CMMT230SEL06(vo2);
			CMMT300VOInfo.setCMMT230VOList(CMMT230VOInfo);
			
			String json = this.objectMapper.writeValueAsString(CMMT300VOInfo);
			           
			LOGGER.info("CMMT300M 페이지 열기  : "+json);
			hashMap.put("CMMT300VOInfo", json);

		}catch(Exception e) {
			e.printStackTrace();
			LOGGER.error("["+e.getClass()+"] Exception : " + e.getMessage());
		}
		return hashMap;
	}
	
	/**
	 * @Method Name : CMMT300SEL05
	 * @작성일      : 2022.01.10
	 * @작성자      : bykim
	 * @변경이력    : 
	 * @Method 설명 : 게시판 상세조회
	 * @param       : HttpServletRequest Restful param
	 * @return      : ModelAndView HashMap
	 */    
	@PostMapping(value ="/CMMT300SEL06")
	@ResponseBody    
	public Map<String, Object> CMMT300SEL06(ModelAndView mav, @RequestBody String req){

		HashMap<String, Object> hashMap = new HashMap<String, Object>();
		JSONParser parser = new JSONParser();

		try {
			JSONObject obj = (JSONObject) parser.parse(req);

			CMMT210VO vo = this.objectMapper.convertValue(obj, CMMT210VO.class);
			CMMT210VO CMMT300VOInfo = CMMT300Service.CMMT300SEL05(vo);
			
	        String cipherText = AES256Crypt.decrypt(CMMT300VOInfo.getUsrNm());
	        CMMT300VOInfo.setUsrNm(cipherText);
			// 첨부파일 조회
			List<CMMT300VO> CMMT300VOInfo2 = CMMT300Service.CMMT300SEL06(vo);
			CMMT300VOInfo.setCMMT300FileList(CMMT300VOInfo2);
			
			CMMT230VO vo2 = new CMMT230VO();
			vo2.setTenantId(String.valueOf(obj.get("tenantId")));
			vo2.setCtgrMgntNo(Integer.parseInt(String.valueOf(obj.get("ctgrMgntNo"))));
			vo2.setBlthgMgntNo(Integer.parseInt(String.valueOf(obj.get("blthgMgntNo"))));
			
			//게시 내용 조회
			List<CMMT230VO> CMMT230VOInfo = CMMT230Service.CMMT230SEL01(vo2);
			CMMT300VOInfo.setCMMT230VOList(CMMT230VOInfo);
			
			ObjectMapper mapper = new ObjectMapper();
			String json = mapper.writeValueAsString(CMMT300VOInfo);
			           
			LOGGER.info("CMMT300M 페이지 열기  : "+json);

			hashMap.put("CMMT300VOInfo", json);

		}catch(Exception e) {
			e.printStackTrace();
			LOGGER.error("["+e.getClass()+"] Exception : " + e.getMessage());
		}
		return hashMap;
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
	@PostMapping(value ="/CMMT300INS01", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	@ResponseBody
	public Map<String, Object> CMMT300INS01(@ModelAttribute("CMMT210VO")CMMT210VO vo) {
		HashMap<String, Object> resultMap = new HashMap<String, Object>();
		try {
			CMMT210VO result = CMMT300Service.CMMT300INS01(vo);
			resultMap.put("info", this.objectMapper.writeValueAsString(result));
			resultMap.put("msg", "정상적으로 저장하였습니다.");

		} catch (Exception e) {
			if(!Objects.equals(e, new RuntimeException())){
				LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
			}
			resultMap.put("result", "0");
			resultMap.put("msg", "저장 실패 하였습니다.");
		}

		vo.setFile(null);
		vo.setCMMT300FileList(null);
		return resultMap;
	}
	
	/**
	 * @Method Name : CMMT300UPT01
	 * @작성일      : 2022.07.21
	 * @작성자      : bykim
	 * @변경이력    :
	 * @Method 설명 : 임시저장 후 저장 또는 수정
	 * @param       : HttpServletRequest Restful param
	 * @return      : ModelAndView HashMap
	 */

	@PostMapping(value ="/CMMT300UPT01", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	@ResponseBody
	public Map<String, Object> CMMT300UPT01(@ModelAttribute("CMMT210VO")CMMT210VO vo) {
		HashMap<String, Object> resultMap = new HashMap<>();
		try {

			CMMT210VO result = CMMT300Service.CMMT300UPT01(vo);
			resultMap.put("info", this.objectMapper.writeValueAsString(result));
			resultMap.put("msg", "정상적으로 저장하였습니다.");

		} catch (Exception e) {
			if(!Objects.equals(e, new RuntimeException())){
				LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
			}
			resultMap.put("info", "0");
			resultMap.put("msg", "수정 실패 하였습니다.");
		}

		vo.setFile(null);
		vo.setCMMT300FileList(null);

		return resultMap;
	}
	
	/**
	 * @Method Name : CMMT300UPT02
	 * @작성일      : 2022.01.10
	 * @작성자      : bykim
	 * @변경이력    : 
	 * @Method 설명 : 게시글 상태 변경
	 * @param       : HttpServletRequest Restful param
	 * @return      : ModelAndView HashMap
	 */    
	@PostMapping(value ="/CMMT300UPT02")
	@ResponseBody
	public Map<String, Object> CMMT300UPT02(ModelAndView mav, @RequestBody String req)  {
		HashMap<String, Object> resultMap = new HashMap<>();
		JSONParser parser = new JSONParser();
		try {
			JSONObject obj = (JSONObject) parser.parse(req);
			CMMT210VO vo = this.objectMapper.convertValue(obj, CMMT210VO.class);

			//kw---20230705 : 게시판 유형을 알기 위함(커뮤니티 일 경우 엘라스틱 상태는 99)
			vo.setCtgrTypCd(String.valueOf(obj.get("ctgrTypCd")));

			int result =  CMMT300Service.CMMT300UPT02(vo);

			if(result>0){
				resultMap.put("result", result);
				resultMap.put("msg", "정상적으로 수정하였습니다.");
			}

		} catch (Exception e) {
			if(!Objects.equals(e, new RuntimeException())){
				LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
			}
			resultMap.put("result", "0");
			resultMap.put("msg", "수정 실패 하였습니다.");
		}

		return resultMap;
	}
	
}
