package org.crm.cmmt.web;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpSession;
import org.crm.cmmt.VO.CMMT200VO;
import org.crm.cmmt.VO.CMMT201VO;
import org.crm.cmmt.VO.CMMT230VO;
import org.crm.cmmt.service.CMMT200Service;
import org.crm.lgin.VO.LGIN000VO;
import org.crm.util.com.ComnFun;
import org.crm.util.string.StringUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.support.SessionStatus;
import org.springframework.web.servlet.ModelAndView;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/***********************************************************************************************
* Program Name : 통합계시글관리 Main Controller
* Creator      : 김보영
* Create Date  : 2022.01.10
* Description  : 통합계시글관리
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.01.10    김보영           최초생성
************************************************************************************************/
@Controller
@RequestMapping("/cmmt/*")
public class CMMT200Controller {

	@Resource(name = "CMMT200Service")
	private CMMT200Service CMMT200Service;

	@Autowired
	private ObjectMapper objectMapper;
	
	private static final Logger LOGGER = LoggerFactory.getLogger(CMMT200Controller.class);

	/**
	 * @Method Name : CMMT200M
	 * @작성일      : 2022.01.10
	 * @작성자      : bykim
	 * @변경이력    : 
	 * @Method 설명 : CMMT/CMMT200M 웹 페이지 열기
	 * @param       :  
	 * @return      : CMMT/CMMT200M.jsp 
	 */	
	@RequestMapping("/CMMT200M")
	public String CMMT200M() {
		LOGGER.info("CMMT200M 페이지 열기");
		return "th/cmmt/CMMT200M";
	}
	
	/**
	 * @Method Name : CMMT222P
	 * @작성일      : 2022.05.10
	 * @작성자      : bykim
	 * @변경이력    : 
	 * @Method 설명 : CMMT/CMMT222P 웹 페이지 열기
	 * @param       :  
	 * @return      : CMMT/CMMT222P.jsp 
	 */	
	@RequestMapping("/CMMT222P")
	public String CMMT222P() {
		LOGGER.info("CMMT222P 페이지 열기");
		return "th/cmmt/CMMT222P";
	}

	/**
	 * @Method Name : CMMT200SEL01
	 * @작성일      : 2022.01.10
	 * @작성자      : bykim
	 * @변경이력    : 
	 * @Method 설명 : 게시판 목록조회
	 * @param       : HttpServletRequest Restful param
	 * @return      : ModelAndView HashMap
	 */    
	@RequestMapping(value ="/CMMT200SEL01", method = RequestMethod.POST)
	@ResponseBody    
	public Map<String, Object> CMMT200SEL01(ModelAndView mav, @RequestBody String req){
		HashMap<String, Object> resultMap = new HashMap<>();
		try {

			List<CMMT201VO> list =  CMMT200Service.CMMT200SEL01(this.objectMapper.readValue(req, CMMT200VO.class));

			resultMap.put("list", new ObjectMapper().writeValueAsString(list));
			resultMap.put("msg", "정상적으로 조회하였습니다.");

		}catch(Exception e) {
			LOGGER.error("["+e.getClass()+"] Exception : " + e.getMessage());
		}
		return resultMap;
	}
	
	/**
	 * @Method Name : CMMT200SEL02
	 * @작성일      : 2022.01.10
	 * @작성자      : bykim
	 * @변경이력    : 
	 * @Method 설명 : 게시판 당 게시물 갯수 조회
	 * @param       : HttpServletRequest Restful param
	 * @return      : ModelAndView HashMap
	 */    
	@RequestMapping(value ="/CMMT200SEL02", method = RequestMethod.POST)
	@ResponseBody    
	public Map<String, Object> CMMT200SEL02(ModelAndView mav, @RequestBody String req){
		HashMap<String, Object> resultMap = new HashMap<>();
		try {
			List<CMMT201VO> list =  CMMT200Service.CMMT200SEL02(this.objectMapper.readValue(req, CMMT200VO.class));

			resultMap.put("CMMT200VOInfo", new ObjectMapper().writeValueAsString(list));
			resultMap.put("msg", "정상적으로 조회하였습니다.");

		}catch(Exception e) {
			LOGGER.error("["+e.getClass()+"] Exception : " + e.getMessage());
		}
		return resultMap;
	}
	
	/**
	 * @Method Name : CMMT100SEL03
	 * @작성일      : 2022.04.10
	 * @작성자      : bykim
	 * @변경이력    : 
	 * @Method 설명 : 최근 검색어 조회
	 * @param       : HttpServletRequest Restful param
	 * @return      : ModelAndView HashMap
	 */    
	@RequestMapping(value ="/CMMT200SEL03", method = RequestMethod.POST)
	@ResponseBody    
	public Map<String, Object> CMMT100SEL03(ModelAndView mav, @RequestBody String req){
		HashMap<String, Object> hashMap = new HashMap<String, Object>();
		try {

			List<CMMT200VO> CMMT200VOInfo = CMMT200Service.CMMT200SEL03(this.objectMapper.readValue(req, CMMT200VO.class));
			
			ObjectMapper mapper = new ObjectMapper();
			String json = mapper.writeValueAsString(CMMT200VOInfo);
			
			LOGGER.info("CMMT200M 페이지 열기  : "+json);

			hashMap.put("CMMT200VOInfo", json);
			hashMap.put("CMMT200VOListCount", CMMT200VOInfo.size());

		}catch(Exception e) {
			LOGGER.error("["+e.getClass()+"] Exception : " + e.getMessage());
		}
		return hashMap;
	}
	
	/**
	 * @Method Name : CMMT100SEL04
	 * @작성일      : 2022.04.10
	 * @작성자      : bykim
	 * @변경이력    : 
	 * @Method 설명 : 내검색어 조회
	 * @param       : HttpServletRequest Restful param
	 * @return      : ModelAndView HashMap
	 */    
	@RequestMapping(value ="/CMMT200SEL04", method = RequestMethod.POST)
	@ResponseBody    
	public Map<String, Object> CMMT100SEL04(ModelAndView mav, @RequestBody String req){
		HashMap<String, Object> hashMap = new HashMap<String, Object>();
		try {

			List<CMMT200VO> CMMT200VOInfo = CMMT200Service.CMMT200SEL04(this.objectMapper.readValue(req, CMMT200VO.class));
			
			ObjectMapper mapper = new ObjectMapper();
			String json = mapper.writeValueAsString(CMMT200VOInfo);
			
			LOGGER.info("CMMT200M 페이지 열기  : "+json);

			hashMap.put("CMMT200VOInfo", json);
			hashMap.put("CMMT200VOListCount", CMMT200VOInfo.size());

		}catch(Exception e) {
			LOGGER.error("["+e.getClass()+"] Exception : " + e.getMessage());
		}
		return hashMap;
	}
	
	/**
	 * @Method Name : CMMT200SEL05
	 * @작성일      : 2022.01.10
	 * @작성자      : bykim
	 * @변경이력    : 
	 * @Method 설명 : 게시판 당 게시물 갯수 조회
	 * @param       : HttpServletRequest Restful param
	 * @return      : ModelAndView HashMap
	 */    
	@RequestMapping(value ="/CMMT200SEL05", method = RequestMethod.POST)
	@ResponseBody    
	public Map<String, Object> CMMT200SEL05(ModelAndView mav, @RequestBody String req){
		HashMap<String, Object> hashMap = new HashMap<String, Object>();
		try {
			CMMT200VO CMMT200VOInfo = CMMT200Service.CMMT200SEL05(this.objectMapper.readValue(req, CMMT200VO.class));
			String json = this.objectMapper.writeValueAsString(CMMT200VOInfo);
			
			LOGGER.info("CMMT200SEL05 : "+json);
			hashMap.put("CMMT200VOInfo", json);

		}catch(Exception e) {
			LOGGER.error("["+e.getClass()+"] Exception : " + e.getMessage());
		}
		return hashMap;
	}
	
	/**
	 * @Method Name : CMMT200SEL06
	 * @작성일      : 2022.01.10
	 * @작성자      : bykim
	 * @변경이력    : 
	 * @Method 설명 : 게시판 목록조회
	 * @param       : HttpServletRequest Restful param
	 * @return      : ModelAndView HashMap
	 */    
	@RequestMapping(value ="/CMMT200SEL06", method = RequestMethod.POST)
	@ResponseBody    
	public Map<String, Object> CMMT200SEL06(ModelAndView mav, @RequestBody String req){
		HashMap<String, Object> resultMap = new HashMap<>();
		try {
			List<CMMT200VO> list =  CMMT200Service.CMMT200SEL06(this.objectMapper.readValue(req, CMMT200VO.class));

			resultMap.put("list", this.objectMapper.writeValueAsString(list));
			resultMap.put("msg", "정상적으로 조회하였습니다.");

		}catch(Exception e) {
			LOGGER.error("["+e.getClass()+"] Exception : " + e.getMessage());
		}
		return resultMap;
	}
	
	/**
	 * @Method Name : CMMT200SEL07
	 * @작성일      	: 2023.06.14
	 * @작성자      	: wkim
	 * @변경이력    	: 
	 * @Method 설명 	: 게시판 조회
	 * @param       : HttpServletRequest Restful param
	 * @return      : ModelAndView HashMap
	 */    
	@RequestMapping(value ="/CMMT200SEL07", method = RequestMethod.POST)
	@ResponseBody    
	public Map<String, Object> CMMT200SEL07(ModelAndView mav, @RequestBody String req){
		HashMap<String, Object> resultMap = new HashMap<>();
		try {

			List<CMMT200VO> list =  CMMT200Service.CMMT200SEL07(this.objectMapper.readValue(req, CMMT200VO.class));
			
			resultMap.put("list", new ObjectMapper().writeValueAsString(list));
			resultMap.put("msg", "정상적으로 조회하였습니다.");

		}catch(Exception e) {
			LOGGER.error("["+e.getClass()+"] Exception : " + e.getMessage());
		}
		return resultMap;
	}
	
	/**
	 * @Method Name : CMMT200SEL08
	 * @작성일      	: 2023.06.14
	 * @작성자      	: wkim
	 * @변경이력    	: 
	 * @Method 설명 	: 게시판 카테고리 조회
	 * @param       : HttpServletRequest Restful param
	 * @return      : ModelAndView HashMap
	 */    
	@RequestMapping(value ="/CMMT200SEL08", method = RequestMethod.POST)
	@ResponseBody    
	public Map<String, Object> CMMT200SEL08(ModelAndView mav, @RequestBody String req){
		HashMap<String, Object> resultMap = new HashMap<>();
		try {
			List<CMMT200VO> list =  CMMT200Service.CMMT200SEL08(this.objectMapper.readValue(req, CMMT200VO.class));
			
			resultMap.put("list", this.objectMapper.writeValueAsString(list));
			resultMap.put("msg", "정상적으로 조회하였습니다.");

		}catch(Exception e) {
			LOGGER.error("["+e.getClass()+"] Exception : " + e.getMessage());
		}
		return resultMap;
	}

	/**
	 * @Method Name : CMMT200INS01
	 * @작성일      : 2022.04.10
	 * @작성자      : bykim
	 * @변경이력    : 
	 * @Method 설명 : 최근검색어 주가
	 * @param       : HttpServletRequest Restful param
	 * @return      : ModelAndView HashMap
	 */    
	@RequestMapping(value ="/CMMT200INS01", method = RequestMethod.POST)
	@ResponseBody    
	public Map<String, Object> CMMT200INS01(ModelAndView mav, @RequestBody String req, BindingResult bindingResult, Model model, 
			SessionStatus status)  {
		// 태넌트 기본정보 등록
		HashMap<String, Object> hashMap = new HashMap<String, Object>();
		try {
			CMMT200VO vo = this.objectMapper.readValue(req, CMMT200VO.class);

			List<CMMT200VO> CMMT200VOInfo = CMMT200Service.CMMT200SEL03(vo);
			
			int rtn = 0;
			
			if(CMMT200VOInfo.size()>0) {
				rtn = CMMT200Service.CMMT200UPT01(vo);
			}else {
				vo.setSrchTcnt(1);
				rtn = CMMT200Service.CMMT200INS01(vo);
			}

			if(rtn > 0) {
				status.setComplete();
				hashMap.put("result", "Insert Success");
				hashMap.put("msg", "정상적으로 등록하였습니다.");		
			}

		}catch(Exception e) {
			LOGGER.error("["+e.getClass()+"] Exception : " + e.getMessage());
		}
		return hashMap;
	}
	
	/**
	 * @Method Name : CMMT200INS02
	 * @작성일      : 2022.04.10
	 * @작성자      : bykim
	 * @변경이력    : 
	 * @Method 설명 : 내검색어 주가
	 * @param       : HttpServletRequest Restful param
	 * @return      : ModelAndView HashMap
	 */    
	@RequestMapping(value ="/CMMT200INS02", method = RequestMethod.POST)
	@ResponseBody    
	public Map<String, Object> CMMT200INS02(ModelAndView mav, @RequestBody String req, BindingResult bindingResult, Model model, 
			SessionStatus status)  {
		HashMap<String, Object> hashMap = new HashMap<String, Object>();
		try {

			CMMT200VO vo = this.objectMapper.readValue(req, CMMT200VO.class);

			// 내 검색어 등록
			int rtn = CMMT200Service.CMMT200INS02(vo);

			if(rtn > 0) {
				status.setComplete();
				hashMap.put("result", "Insert Success");
				hashMap.put("msg", "정상적으로 등록하였습니다.");		
			}

		}catch(Exception e) {
			LOGGER.error("["+e.getClass()+"] Exception : " + e.getMessage());
		}
		return hashMap;
	}
	
	
	/**
	 * @Method Name : CMMT200DEL01
	 * @작성일      : 2022.04.10
	 * @작성자      : bykim
	 * @변경이력    : 
	 * @Method 설명 : 내검색어 삭제
	 * @param       : HttpServletRequest Restful param
	 * @return      : ModelAndView HashMap
	 */     
	@RequestMapping(value ="/CMMT200DEL01", method = RequestMethod.POST)
	@ResponseBody  
	public Map<String, Object> CMMT200DEL01(ModelAndView mav, @RequestBody String req, BindingResult bindingResult, Model model, 
			SessionStatus status) {

		HashMap<String, Object> hashMap = new HashMap<String, Object>();

		try {

			CMMT200VO vo = this.objectMapper.readValue(req, CMMT200VO.class);

			int rtn = CMMT200Service.CMMT200DEL01(vo);

			if(rtn > 0) {
				status.setComplete();
				hashMap.put("result", "Delete Success");
				hashMap.put("msg", "정상적으로 삭제하였습니다.");	
			}		

		}catch(Exception e) {
			hashMap.put("msg", StringUtil.substringByLength(e.getCause().getMessage(),200));
			LOGGER.error("["+e.getClass()+"] Exception : " + e.getMessage());
		}

		return hashMap;
	}
	
	/**
	 * @Method Name : CMMT200UPT03
	 * @작성일      : 2022.05.10
	 * @작성자      : bykim
	 * @변경이력    : 
	 * @Method 설명 : 개인정보 검색어저장
	 * @param       : HttpServletRequest - json 배열   "list" :  [{id : "", name : ""},{id : "", name : ""}] 구조
	 * @return      : ModelAndView HashMap
	 */      
	@RequestMapping(value ="/CMMT200UPT03", method = RequestMethod.POST)
	@ResponseBody 
	public Map<String, Object> CMMT200UPT03(ModelAndView mav, @RequestBody String req, BindingResult bindingResult, Model model, 
			SessionStatus status, HttpSession session) {

		HashMap<String, Object> hashMap = new HashMap<String, Object>();

		try {

			CMMT200VO vo = this.objectMapper.readValue(req, CMMT200VO.class);

			// 태넌트 기본정보 변경
			int rtn = CMMT200Service.CMMT200UPT03(vo);
			
			//세션정보 재설정
			LGIN000VO loginVO = (LGIN000VO) session.getAttribute("user");
			
			ComnFun cf = new ComnFun();
			if(!cf.isStringEmpty(vo.getKldScwdSaveYn())) {
				loginVO.setKldScwdSaveYn(vo.getKldScwdSaveYn());
			}
			
			if(!cf.isStringEmpty(vo.getAutoPfcnUseYn())) {
				loginVO.setAutoPfcnUseYn(vo.getAutoPfcnUseYn());
			}
			session.setAttribute("user", loginVO); 
			
			if(rtn > 0) {
				status.setComplete();
				hashMap.put("result", "Update Success");
				hashMap.put("msg", "정상적으로 변경하였습니다.");		
			}		

		}catch(Exception e) {
			LOGGER.error("["+e.getClass()+"] Exception : " + e.getMessage());
		}
		return hashMap;
	}
	
	/**
	 * @Method Name : CMMT200DEL02
	 * @작성일      : 2022.04.10
	 * @작성자      : bykim
	 * @변경이력    : 
	 * @Method 설명 : 커뮤니티 게시글 삭제
	 * @param       : HttpServletRequest Restful param
	 * @return      : ModelAndView HashMap
	 */     
	@RequestMapping(value ="/CMMT200DEL02", method = RequestMethod.POST)
	@ResponseBody  
	public Map<String, Object> CMMT200DEL02(ModelAndView mav, @RequestBody String req, BindingResult bindingResult, Model model, 
			SessionStatus status) {

		HashMap<String, Object> hashMap = new HashMap<String, Object>();

		try {

			CMMT230VO vo = this.objectMapper.readValue(req, CMMT230VO.class);

			// 커뮤니티 게시글 삭제
			int rtn = CMMT200Service.CMMT200DEL02(vo);

			if(rtn > 0) {
				status.setComplete();
				hashMap.put("result", "Delete Success");
				hashMap.put("msg", "정상적으로 삭제하였습니다.");	
			}		

		}catch(Exception e) {
			hashMap.put("msg", StringUtil.substringByLength(e.getCause().getMessage(),200));
			LOGGER.error("["+e.getClass()+"] Exception : " + e.getMessage());
		}

		return hashMap;
	}

	

}
