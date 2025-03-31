package org.crm.cmmt.web;

import org.crm.cmmt.VO.CMMT210VO;
import org.crm.cmmt.VO.CMMT230VO;
import org.crm.cmmt.service.CMMT230Service;
import org.crm.lgin.VO.LGIN000VO;
import org.crm.util.com.ComnFun;
import org.crm.util.crypto.AES256Crypt;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpSession;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.support.SessionStatus;
import org.springframework.web.servlet.ModelAndView;

import java.sql.Timestamp;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
@RestController
@RequestMapping("/cmmt/*")
public class CMMT230Controller {

	@Resource(name = "CMMT230Service")
	private CMMT230Service CMMT230Service;

	@Autowired
	private ObjectMapper objectMapper;

	private static final Logger LOGGER = LoggerFactory.getLogger(CMMT230Controller.class);

	
	/**
	 * @Method Name : CMMT230P
	 * @작성일      : 2022.01.10
	 * @작성자      : bykim
	 * @변경이력    : 
	 * @Method 설명 : CMMT/CMMT200M 웹 페이지 열기
	 * @param       :  
	 * @return      : CMMT/CMMT200M.jsp 
	 */	
	@RequestMapping("/CMMT230P")
	public String CMMT200M() {
		LOGGER.info("CMMT230P 페이지 열기");
		return "th/cmmt/CMMT230P";
	}	
	
	/**
	 * @Method Name : CMMT230SEL0
	 * @작성일      : 2022.01.10
	 * @작성자      : bykim
	 * @변경이력    : 
	 * @Method 설명 : 공지사항상세 조회
	 * @param       : HttpServletRequest Restful param
	 * @return      : ModelAndView HashMap
	 */    
	@PostMapping(value ="/CMMT230SEL01")
	@ResponseBody    
	public Map<String, Object> CMMT230SEL01(ModelAndView mav, @RequestBody String req){

		HashMap<String, Object> hashMap = new HashMap<String, Object>();
		JSONParser parser = new JSONParser();

		try {
			JSONObject obj = (JSONObject) parser.parse(req);
			CMMT230VO vo = this.objectMapper.convertValue(obj, CMMT230VO.class);

			List<CMMT230VO> CMMT230VOInfo = CMMT230Service.CMMT230SEL01(vo);
			String json = this.objectMapper.writeValueAsString(CMMT230VOInfo);

			LOGGER.info("CMMT230M 페이지 열기  : "+json);
			hashMap.put("CMMT230VOInfo", json);
			hashMap.put("CMMT230VOListCount", CMMT230VOInfo.size());

		}catch(Exception e) {
			LOGGER.error("["+e.getClass()+"] Exception : " + e.getMessage());
		}
		return hashMap;
	}
	
	
	
	/**
	 * @Method Name : CMMT230SEL0
	 * @작성일      : 2022.01.10
	 * @작성자      : bykim
	 * @변경이력    : 
	 * @Method 설명 : 공지사항상세 댓글 목록 조회
	 * @param       : HttpServletRequest Restful param
	 * @return      : ModelAndView HashMap
	 */    
	@PostMapping(value ="/CMMT230SEL02")
	@ResponseBody    
	public Map<String, Object> CMMT230SEL02(ModelAndView mav, @RequestBody String req){
		HashMap<String, Object> hashMap = new HashMap<String, Object>();
		JSONParser parser = new JSONParser();

		try {
			JSONObject obj = (JSONObject) parser.parse(req);
			CMMT230VO vo = this.objectMapper.convertValue(obj, CMMT230VO.class);

			List<CMMT230VO> CMMT230VOInfo = CMMT230Service.CMMT230SEL02(vo);
			
			for(CMMT230VO rtnVO : CMMT230VOInfo) {
				if(rtnVO.getUsrNm() != null) {
					rtnVO.setUsrNm(AES256Crypt.decrypt(rtnVO.getUsrNm()));
				}
			}
			String json = this.objectMapper.writeValueAsString(CMMT230VOInfo);
			LOGGER.info("CMMT230M 댓글 목록 : "+json);

			hashMap.put("CMMT230VOInfo", json);
			hashMap.put("CMMT230VOListCount", CMMT230VOInfo.size());

		}catch(Exception e) {
			LOGGER.error("["+e.getClass()+"] Exception : " + e.getMessage());
		}
		return hashMap;
	}
	
	/**
	 * @Method Name : CMMT230SEL03
	 * @작성일      : 2022.01.10
	 * @작성자      : bykim
	 * @변경이력    : 
	 * @Method 설명 : 게시물 열람여부 체크
	 * @param       : HttpServletRequest Restful param
	 * @return      : ModelAndView HashMap
	 */    
	@PostMapping(value ="/CMMT230SEL03")
	@ResponseBody    
	public Map<String, Object> CMMT230SEL03(ModelAndView mav, @RequestBody String req){

		HashMap<String, Object> hashMap = new HashMap<String, Object>();
		JSONParser parser = new JSONParser();

		try {
			JSONObject obj = (JSONObject) parser.parse(req);

			CMMT230VO vo = this.objectMapper.convertValue(obj, CMMT230VO.class);
			List<CMMT230VO> CMMT230VOInfo = CMMT230Service.CMMT230SEL03(vo);
			
			String json = this.objectMapper.writeValueAsString(CMMT230VOInfo);
			           
			LOGGER.info("CMMT230M 페이지 열기  : "+json);

			hashMap.put("CMMT230VOInfo", json);
			hashMap.put("CMMT230VOListCount", CMMT230VOInfo.size());

		}catch(Exception e) {
			LOGGER.error("["+e.getClass()+"] Exception : " + e.getMessage());
		}
		return hashMap;
	}

	
	/**
	 * @Method Name : CMMT230INS01
	 * @작성일      : 2022.01.10
	 * @작성자      : bykim
	 * @변경이력    : 
	 * @Method 설명 : 게시판 열람자 주가
	 * @param       : HttpServletRequest Restful param
	 * @return      : ModelAndView HashMap
	 */    
	@PostMapping(value ="/CMMT230INS01")
	@ResponseBody    
	public Map<String, Object> CMMT230INS01(ModelAndView mav, @RequestBody String req, BindingResult bindingResult, Model model,
	                                        SessionStatus status, HttpSession session)  {

		HashMap<String, Object> hashMap = new HashMap<String, Object>();
		JSONParser parser = new JSONParser();

		try {
			JSONObject obj = (JSONObject) parser.parse(req);
			CMMT230VO vo = this.objectMapper.convertValue(obj, CMMT230VO.class);

			LGIN000VO lgin000VO = (LGIN000VO) session.getAttribute("user");

			CMMT230VO cmmt230VO = CMMT230VO.builder()
					.tenantId(vo.getTenantId())
					.ctgrMgntNo(vo.getCtgrMgntNo())
					.blthgMgntNo(vo.getBlthgMgntNo())
					.puslmnId(vo.getPuslmnId())
					.regrId(lgin000VO.getUsrId())
					.regrOrgCd(lgin000VO.getOrgCd())
					.lstCorprId(lgin000VO.getUsrId())
					.lstCorprOrgCd(lgin000VO.getOrgCd())
					.build();

			// 조회건수 추가
			CMMT230Service.CMMT230UPT08(cmmt230VO);
			
			int rtn = 0;
			List<CMMT230VO> chkExist = CMMT230Service.CMMT230SEL03(cmmt230VO);
			if(chkExist.size()<1) {
				// 열람자 추가
				rtn = CMMT230Service.CMMT230INS01(cmmt230VO);
			}

			if(rtn > 0) {
				status.setComplete();
				hashMap.put("result", "Insert Success");
				hashMap.put("msg", "정상적으로 등록하였습니다.");		
			}

		}catch(Exception e) {
			e.printStackTrace();
			LOGGER.error("["+e.getClass()+"] Exception : " + e.getMessage());
		}
		return hashMap;
	}
	
	

	/**
	 * @Method Name : CMMT230INS02
	 * @작성일      : 2022.01.10
	 * @작성자      : bykim
	 * @변경이력    : 
	 * @Method 설명 : 댓글 주가
	 * @param       : HttpServletRequest Restful param
	 * @return      : ModelAndView HashMap
	 */    
	@PostMapping(value ="/CMMT230INS02")
	@ResponseBody    
	public Map<String, Object> CMMT230INS02(ModelAndView mav, @RequestBody String req, BindingResult bindingResult, Model model, 
			SessionStatus status)  {

		HashMap<String, Object> hashMap = new HashMap<String, Object>();
		JSONParser parser = new JSONParser();

		try {
			JSONObject obj = (JSONObject) parser.parse(req);
			ComnFun cf = new ComnFun();
			CMMT230VO vo = this.objectMapper.convertValue(obj, CMMT230VO.class);

			if(!cf.isStringEmpty((String.valueOf(obj.get("prsReplyLvl"))))){
				vo.setPrsReplyLvl(Integer.parseInt(String.valueOf(obj.get("prsReplyLvl"))));
			}
			
			if(!cf.isStringEmpty((String.valueOf(obj.get("blthgReplyHgrkNo"))))){
				vo.setBlthgReplyHgrkNo(Integer.parseInt(String.valueOf(obj.get("blthgReplyHgrkNo"))));
			}

			int rtn = CMMT230Service.CMMT230INS02(vo);
			
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
	 * @Method Name : CMMT230INS03
	 * 
	 * 
	 * @작성일      : 2022.01.10
	 * @작성자      : bykim
	 * @변경이력    : 
	 * @Method 설명 : 댓글 평가(좋아요/싫어요) 주가
	 * @param       : HttpServletRequest Restful param
	 * @return      : ModelAndView HashMap
	 */    
	@PostMapping(value ="/CMMT230INS03")
	@ResponseBody    
	public Map<String, Object> CMMT230INS03(ModelAndView mav, @RequestBody String req, BindingResult bindingResult, Model model, 
			SessionStatus status)  {

		HashMap<String, Object> hashMap = new HashMap<String, Object>();
		JSONParser parser = new JSONParser();

		try {
			ComnFun cf = new ComnFun();
			JSONObject obj = (JSONObject) parser.parse(req);

			CMMT230VO vo = this.objectMapper.convertValue(obj, CMMT230VO.class);
			List<CMMT230VO> chkExist = CMMT230Service.CMMT230SEL04(vo);
			int rtn1  = 0;
			int rtn2  = 0;

			//좋아요 / 싫어요 id 존재 시 -> 다시 클릭 == 삭제 
			if(chkExist.size()>0) {
				if(!chkExist.get(0).getAsesCd().equals(vo.getAsesCd())) {
					vo.setAsesCd(chkExist.get(0).getAsesCd());
					CMMT230Service.CMMT230DEL02(vo);
					rtn2 = CMMT230Service.CMMT230UPT06(vo);
					vo.setAsesCd(String.valueOf(obj.get("asesCd")));
					CMMT230Service.CMMT230INS03(vo);
					rtn1 = CMMT230Service.CMMT230UPT05(vo);
				}else {
					 CMMT230Service.CMMT230DEL02(vo);
					 rtn1 = CMMT230Service.CMMT230UPT06(vo);
					 rtn2 = CMMT230Service.CMMT230SEL08(vo);
				}
				
			}else {
				// 댓글 좋아요/싫어요 ID 추가
				CMMT230Service.CMMT230INS03(vo);
				// 댓글 좋아요/싫어요 카운트 update
				rtn1 = CMMT230Service.CMMT230UPT05(vo);
				rtn2 = CMMT230Service.CMMT230SEL08(vo);
			}
			
			hashMap.put("CMMT230VOInfo1", rtn1);
			hashMap.put("CMMT230VOInfo2", rtn2);

		}catch(Exception e) {
			LOGGER.error("["+e.getClass()+"] Exception : " + e.getMessage());
		}
		return hashMap;
	}
	
	
	
	/**
	 * @Method Name : CMMT230UPT01
	 * @작성일      : 2022.01.10
	 * @작성자      : bykim
	 * @변경이력    : 
	 * @Method 설명 :  게시물 상세(상태코드) 업데이트
	 * @param       : HttpServletRequest - json 배열   "list" :  [{id : "", name : ""},{id : "", name : ""}] 구조
	 * @return      : ModelAndView HashMap
	 */      
	@PostMapping(value ="/CMMT230UPT01")
	@ResponseBody 
	public Map<String, Object> CMMT230UPT01(ModelAndView mav, @RequestBody String req, BindingResult bindingResult, Model model, 
			SessionStatus status) {

		HashMap<String, Object> hashMap = new HashMap<String, Object>();
		JSONParser parser = new JSONParser();

		try {
			JSONObject obj = (JSONObject) parser.parse(req);
			CMMT210VO vo = new CMMT210VO();

			vo.setTenantId(String.valueOf(obj.get("tenantId")));
			vo.setCtgrMgntNo(Integer.parseInt(String.valueOf(obj.get("ctgrMgntNo"))));
			vo.setBlthgMgntNo(Integer.parseInt(String.valueOf(obj.get("blthgMgntNo"))));
					
			vo.setBlthgStCd(String.valueOf(obj.get("blthgStCd")));
			vo.setBlthgStRsnCtt(String.valueOf(obj.get("blthgStRsnCtt")));
	
			vo.setApprId(String.valueOf(obj.get("apprId")));
			vo.setApprOrgCd(String.valueOf(obj.get("apprOrgCd")));
			
			vo.setLstCorprId(String.valueOf(obj.get("lstCorprId")));
			vo.setLstCorprOrgCd(String.valueOf(obj.get("lstCorprOrgCd")));
			
			//kw---20230704 : 엘라스틱 서치 삭제 항목 아이디를 만들기 위함
			//kw---20230704 : ctgrMgntNo, blthgMgntNo 사용해도 되지만..
			//kw---20230704 : CMMT230UPT01 여기서는 CtgrNo, CntntsNo를 사용하고 있어서 그냥 추가 
			vo.setCtgrNo(Integer.parseInt(String.valueOf(obj.get("ctgrMgntNo"))));
			vo.setCntntsNo(Integer.parseInt(String.valueOf(obj.get("blthgMgntNo"))));
			
			//kw---20230705 : 게시판 유형을 알기 위함(커뮤니티 일 경우 엘라스틱 상태는 99)
			//kw---20230705 : 커뮤니티 일 경우 엘라스틱 상태 값은 99 유지
			vo.setCtgrTypCd(String.valueOf(obj.get("ctgrTypCd")));

			int rtn = CMMT230Service.CMMT230UPT01(vo);

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
	 * @Method Name : CMMT230UPT02
	 * @작성일      : 2022.01.10
	 * @작성자      : bykim
	 * @변경이력    : 
	 * @Method 설명 :  게시물 좋아요/싫어요 카운트 업데이트
	 * @param       : HttpServletRequest - json 배열   "list" :  [{id : "", name : ""},{id : "", name : ""}] 구조
	 * @return      : ModelAndView HashMap
	 */      
	@PostMapping(value ="/CMMT230UPT02")
	@ResponseBody 
	public Map<String, Object> CMMT230UPT02(ModelAndView mav, @RequestBody String req, BindingResult bindingResult, Model model, 
			SessionStatus status) {

		HashMap<String, Object> hashMap = new HashMap<String, Object>();
		JSONParser parser = new JSONParser();

		try {
			JSONObject obj = (JSONObject) parser.parse(req);
			CMMT230VO vo = new CMMT230VO();

			vo.setTenantId(String.valueOf(obj.get("tenantId")));
			vo.setCtgrMgntNo(Integer.parseInt(String.valueOf(obj.get("ctgrMgntNo"))));
			vo.setBlthgMgntNo(Integer.parseInt(String.valueOf(obj.get("blthgMgntNo"))));
			vo.setAsesCd(String.valueOf(obj.get("asesCd")));
			
			vo.setPuslmnId(String.valueOf(obj.get("puslmnId")));
			
			//해당 id에 좋아요/나빠여 check
			List<CMMT230VO> chkExist = CMMT230Service.CMMT230SEL03(vo);
			int rtn1  = 0;
			int rtn2  = 0;
			
			ComnFun cf = new ComnFun();
			if(chkExist.size()>0 && !cf.isStringEmpty(chkExist.get(0).getAsesCd())) {
				//평가 삭제
				if(chkExist.get(0).getAsesCd().equals(vo.getAsesCd())) {
					 vo.setAsesCd("");
					 CMMT230Service.CMMT230UPT03(vo);
					 vo.setAsesCd(String.valueOf(obj.get("asesCd")));
					 rtn1 = CMMT230Service.CMMT230UPT07(vo);
					 rtn2 = CMMT230Service.CMMT230SEL07(vo);
				}else { // 반대 평가
					vo.setAsesCd(chkExist.get(0).getAsesCd());
					//평가 카운트 -1
					 rtn2 = CMMT230Service.CMMT230UPT07(vo);
					 vo.setAsesCd(String.valueOf(obj.get("asesCd")));
					// 좋아요/싫어요 ID 업데이트
					 CMMT230Service.CMMT230UPT03(vo);
					// 좋아요/싫어요 카운트 추가
					 rtn1 = CMMT230Service.CMMT230UPT02(vo);
				}
			}else{
				// 좋아요/싫어요 카운트 추가
				rtn1 = CMMT230Service.CMMT230UPT02(vo);
				// 좋아요/싫어요 ID 업데이트
				 CMMT230Service.CMMT230UPT03(vo);
				rtn2 = CMMT230Service.CMMT230SEL07(vo);
			}

			hashMap.put("CMMT230VOInfo1", rtn1);
			hashMap.put("CMMT230VOInfo2", rtn2);

		}catch(Exception e) {
			LOGGER.error("["+e.getClass()+"] Exception : " + e.getMessage());
		}
		return hashMap;
	}
	
	

	
	/**
	 * @Method Name : CMMT230UPT04
	 * @작성일      : 2022.01.10
	 * @작성자      : bykim
	 * @변경이력    : 
	 * @Method 설명 :  작성자 댓글 업데이트
	 * @param       : HttpServletRequest - json 배열   "list" :  [{id : "", name : ""},{id : "", name : ""}] 구조
	 * @return      : ModelAndView HashMap
	 */      
	@PostMapping(value ="/CMMT230UPT04")
	@ResponseBody 
	public Map<String, Object> CMMT230UPT04(ModelAndView mav, @RequestBody String req, BindingResult bindingResult, Model model, 
			SessionStatus status) {

		HashMap<String, Object> hashMap = new HashMap<String, Object>();
		JSONParser parser = new JSONParser();

		try {
			JSONObject obj = (JSONObject) parser.parse(req);
			CMMT230VO vo = this.objectMapper.convertValue(obj, CMMT230VO.class);

			int rtn = CMMT230Service.CMMT230UPT04(vo);

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
	 * @Method Name : CMMT230DEL01
	 * @작성일      : 2022.01.10
	 * @작성자      : bykim
	 * @변경이력    : 
	 * @Method 설명 : 댓글 삭제
	 * @param       : HttpServletRequest Restful param
	 * @return      : ModelAndView HashMap
	 */     
	@PostMapping(value ="/CMMT230DEL01")
	@ResponseBody  
	public Map<String, Object> CMMT230DEL01(ModelAndView mav, @RequestBody String req, BindingResult bindingResult, Model model, 
			SessionStatus status) {

		HashMap<String, Object> hashMap = new HashMap<String, Object>();
		JSONParser parser = new JSONParser();

		try {
			JSONObject obj = (JSONObject) parser.parse(req);
			ComnFun cf = new ComnFun();
			CMMT230VO vo = new CMMT230VO();
			
			vo.setTenantId(String.valueOf(obj.get("tenantId")));
			vo.setCtgrMgntNo(Integer.parseInt(String.valueOf(obj.get("ctgrMgntNo"))));
			vo.setBlthgMgntNo(Integer.parseInt(String.valueOf(obj.get("blthgMgntNo"))));
			vo.setBlthgReplyNo(Integer.parseInt(String.valueOf(obj.get("blthgReplyNo"))));
			vo.setPrsReplyLvl(Integer.parseInt(String.valueOf(obj.get("prsReplyLvl"))));
			vo.setBlthgReplyHgrkNo(Integer.parseInt(String.valueOf(obj.get("blthgReplyHgrkNo"))));
			
			int rtn = 0;
			
			if(vo.getPrsReplyLvl()==1) {
				List<CMMT230VO> hgrkList = CMMT230Service.CMMT230SEL05(vo);
				if(hgrkList.size()>1) {
					vo.setReplyCtt("삭제되었습니다.");
					vo.setAbolmnId(String.valueOf(obj.get("abolmnId")));
					vo.setAbolmnOrgCd(String.valueOf(obj.get("abolmnOrgCd")));
					rtn = CMMT230Service.CMMT230UPT04(vo);
				}else {
					rtn = CMMT230Service.CMMT230DEL01(vo);
					CMMT230Service.CMMT230DEL02(vo);
				}
			}else {
				//동일부모 댓글을 가진 자식댓글 조회
				vo.setBlthgReplyNo(Integer.parseInt(String.valueOf(obj.get("blthgReplyHgrkNo"))));
				List<CMMT230VO> hgrkList = CMMT230Service.CMMT230SEL05(vo);
				//자식 댓글이 자신 하나일 경우
				if(hgrkList.size()<3) {
					for(CMMT230VO chkVO : hgrkList) {
						//부모가 논리 삭제 상태일 경우
						if(!cf.isStringEmpty(chkVO.getAbolmnId())) {
							rtn = CMMT230Service.CMMT230DEL01(vo);
							CMMT230Service.CMMT230DEL02(vo);
						}
					}
				}
				vo.setBlthgReplyNo(Integer.parseInt(String.valueOf(obj.get("blthgReplyNo"))));
				rtn = CMMT230Service.CMMT230DEL01(vo);
				CMMT230Service.CMMT230DEL02(vo);  
			}
			
			if(rtn > 0) {
				status.setComplete();
				hashMap.put("result", "Delete Success");
				hashMap.put("msg", "정상적으로 삭제하였습니다.");	
			}		

		}catch(Exception e) {
			LOGGER.error("["+e.getClass()+"] Exception : " + e.getMessage());
		}
		return hashMap;
	}

	/**
	 * @Method Name : CMMT230UPT05
	 * @작성일      : 2022.01.10
	 * @작성자      : bykim
	 * @변경이력    :
	 * @Method 설명 :  게시물 추천 카운트 업데이트
	 * @param       : HttpServletRequest - json 배열   "list" :  [{id : "", name : ""},{id : "", name : ""}] 구조
	 * @return      : ModelAndView HashMap
	 */
	@PostMapping(value ="/CMMT230UPT05")
	@ResponseBody
	public Map<String, Object> CMMT230UPT05(ModelAndView mav, @RequestBody String req, BindingResult bindingResult, Model model,
	                                 SessionStatus status) {

		HashMap<String, Object> hashMap = new HashMap<String, Object>();
		JSONParser parser = new JSONParser();

		try {
			JSONObject obj = (JSONObject) parser.parse(req);

			CMMT230VO vo = new CMMT230VO();

			vo.setTenantId(String.valueOf(obj.get("tenantId")));
			vo.setCtgrMgntNo(Integer.parseInt(String.valueOf(obj.get("ctgrMgntNo"))));
			vo.setBlthgMgntNo(Integer.parseInt(String.valueOf(obj.get("blthgMgntNo"))));
			vo.setPuslmnId(String.valueOf(obj.get("puslmnId")));

			//해당 id에 추천 check
			List<CMMT230VO> chkExist = CMMT230Service.CMMT230SEL03(vo);

			ComnFun cf = new ComnFun();

			if( chkExist != null ) {
				if(ComnFun.isEmptyObj(chkExist.get(0).getRcmdDtm())) {
					Timestamp currentTimestamp = new Timestamp(System.currentTimeMillis());
					vo.setRcmdDtm(currentTimestamp);
					// 추천 카운트 추가
					CMMT230Service.CMMT230UPT09(vo);
				}else{
					// 추천 카운트 삭제
					vo.setRcmdDtm(null);
					CMMT230Service.CMMT230UPT11(vo);
				}
				CMMT230Service.CMMT230UPT10(vo);
			}


			//추천이 비어 있을때만 업데이트
//			if(chkExist.size()>0 && ComnFun.isEmptyObj(chkExist.get(0).getRcmdDtm())) {
//				// 추천 카운트 추가
//				rtn = CMMT230Service.CMMT230UPT09(vo);
//				// 추천 ID 업데이트
//				CMMT230Service.CMMT230UPT10(vo);
//			}

			hashMap.put("CMMT230VOInfo", CMMT230Service.CMMT230SEL09(vo));

		}catch(Exception e) {
			LOGGER.error("["+e.getClass()+"] Exception : " + e.getMessage());
		}
		return hashMap;
	}
}
