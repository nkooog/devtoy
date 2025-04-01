package org.crm.frme.web;

import org.crm.bizs.GBRD.Util.GBRDRestUtil;
import org.crm.comm.service.COMM100Service;
import org.crm.frme.VO.FRME230VO;
import org.crm.frme.service.FRME230Service;
import org.crm.lgin.VO.LGIN000VO;
import org.crm.util.com.ComnFun;
import org.crm.util.crypto.AES256Crypt;
import org.crm.util.masking.MaskingUtil;
import org.crm.util.string.StringUtil;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.support.SessionStatus;

import java.math.BigInteger;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;


/**
 * @Class Name   : FRME230Controller.java
 * @Description  : 웹프레임 ARS 콜백 controller
 * @Modification 
 * @ -------------------------------------------------------------------------
 * @  수정일                  수정자              수정내용
 * @ -------------------------------------------------------------------------
 * @ 2022.03.03   김보영             최초생성
 * @ -------------------------------------------------------------------------
 * @author CRM Lab실 김보영 연구원
 * @since 2022. 03.03
 * @version 1.0
 * @see
 *
 */
@Slf4j
@Controller
@RequestMapping("/frme/*")
public class FRME230Controller {

	@Resource(name = "FRME230Service")
	private FRME230Service frme230Service;
	
	@Resource(name = "COMM100Service")
	private COMM100Service COMM100Service;

	@Resource(name = "GBRDRestUtil")
	private GBRDRestUtil GBRDRestUtil;

	@Autowired
	private ObjectMapper objectMapper;
	
	@RequestMapping("/FRME230P")
	public String FRME230P() {
		return "th/frme/FRME230P";
	}

	@RequestMapping("/FRME231P")
	public String FRME231P() {
		return "th/frme/FRME231P";
	}


	/**
     * @Method Name : FRME230SEL01
     * @작성일 : 2022.03.03
     * @작성자 : 김보영
     * @Method 설명 : 웹프레임 ARS콜백 목록 조회
	 * @param :  ModelAndView HttpServletRequest 
	 * @return : ModelAndView HashMap 
     */ 
	
	@PostMapping(value ="/FRME230SEL01")
    @ResponseBody 
    public Map<String, Object> FRME230SEL01(@RequestBody String req, HttpSession session) {
		int callIdSize = 0;
		HashMap<String, Object> hashMap = new HashMap<String, Object>();
		JSONParser parser = new JSONParser();
    	try {		
    		ComnFun cf = new ComnFun();
		    JSONObject obj = (JSONObject) parser.parse(req);

			FRME230VO vo = new FRME230VO();
			vo.setTenantId(String.valueOf(obj.get("tenantId"))); 
			
			if(!cf.isStringEmpty((String.valueOf(obj.get("srchDtFrom"))))){
				vo.setSrchDtFrom(String.valueOf(obj.get("srchDtFrom")));
			}if(!cf.isStringEmpty((String.valueOf(obj.get("srchDtTo"))))){
				vo.setSrchDtTo(String.valueOf(obj.get("srchDtTo")));
			}
			vo.setSrchDt(String.valueOf(obj.get("srchDt"))); 
			vo.setCabackInfwShpCd(String.valueOf(obj.get("cabackInfwShpCd")));
			vo.setCabackProcStCd(String.valueOf(obj.get("cabackProcStCd")));
			vo.setUsrId(String.valueOf(obj.get("usrId")));
		    vo.setUsrGrd(String.valueOf(obj.get("usrGrd")));

			List<FRME230VO> FRME230List = frme230Service.FRME230SEL01(vo);
		    LGIN000VO user = (LGIN000VO) session.getAttribute("user");


		    String callBackTextList = "{\"TenantId\":\"" + vo.getTenantId() + "\", \"CallIdList\":[";
		    for(FRME230VO FRME230VO : FRME230List) {

			    if(!cf.isStringEmpty(FRME230VO.getWebCabackCustNm())){
				    FRME230VO.setWebCabackCustNm(AES256Crypt.decrypt(FRME230VO.getWebCabackCustNm()));
				    if(!ComnFun.isEmpty(FRME230VO.getWebCabackCustNm())){
						String name  ="";
					    if(!ComnFun.isEmpty(user.getPersonInfoMask()) && "N".equals(user.getPersonInfoMask())){
						    name = FRME230VO.getWebCabackCustNm();
					    }else {
							name = MaskingUtil.nameMasking(FRME230VO.getWebCabackCustNm());
					    }
					    FRME230VO.setCntcCustNmMsk(name);
				    }
			    }

			    if(!cf.isStringEmpty(FRME230VO.getInclTelNo())){
				    String phoneNo = AES256Crypt.decrypt(FRME230VO.getInclTelNo());
				    FRME230VO.setNoSwInclTelNo(phoneNo);

				    phoneNo = MaskingUtil.SwichingPhone(phoneNo);
				    if(!ComnFun.isEmpty(user.getPersonInfoMask()) && "N".equals(user.getPersonInfoMask())){
					    phoneNo =  AES256Crypt.decrypt(FRME230VO.getInclTelNo());
				    }

				    FRME230VO.setInclTelNo(phoneNo);
			    }
				if(!cf.isStringEmpty(FRME230VO.getCabackReqTelno())){
					String phoneNo = AES256Crypt.decrypt(FRME230VO.getCabackReqTelno());
					FRME230VO.setNoSwCabackReqTelno(phoneNo);

					phoneNo = MaskingUtil.SwichingPhone(phoneNo);
					if(!ComnFun.isEmpty(user.getPersonInfoMask()) && "N".equals(user.getPersonInfoMask())){
						phoneNo = AES256Crypt.decrypt(FRME230VO.getCabackReqTelno());
					}

					FRME230VO.setCabackReqTelno(phoneNo);
				}
			    if(!cf.isStringEmpty(FRME230VO.getCnslrNm())){
				    FRME230VO.setCnslrNm(AES256Crypt.decrypt(FRME230VO.getCnslrNm()));
			    }
			    if ( FRME230VO.getVceCabackYn().equals("Y")) {
				    callBackTextList += ("\"" + FRME230VO.getCabackId() + "\",");
				    callIdSize++;
			    }
		    }
		    callBackTextList += "]}";
		    
 		    try {
			    String cloudName = COMM100Service.COMM100getCloudName(vo.getTenantId());
				if (!cloudName.equals("") && callIdSize > 0) {
				    String SyncSelCallbackTexts = GBRDRestUtil.CallHttpUrl(callBackTextList, cloudName);
					JSONObject jsonObj = (JSONObject) parser.parse(SyncSelCallbackTexts);
					JSONObject CallBackTextList = (JSONObject) parser.parse(jsonObj.get("CallBackTextList").toString());
					JSONArray CallIdList = (JSONArray) CallBackTextList.get("CallIdList");

					for(FRME230VO FRME230VO : FRME230List) {
						if ( FRME230VO.getVceCabackYn().equals("Y")) {
							for (int i = 0; i < CallIdList.size(); i++) {
								JSONObject CallIdObj = (JSONObject) CallIdList.get(i);
								if ( FRME230VO.getCabackId().equals(CallIdObj.get("CallId").toString())) {
									FRME230VO.setCabackCtt(CallIdObj.get("Text").toString());
								}
							}
						}
					}
			    }
		    }catch(Exception e) {
		    	log.error("["+e.getClass()+"] Exception : " + e.getMessage());
		    }
		    
			String json = this.objectMapper.writeValueAsString(FRME230List);
			
			hashMap.put("FRME230PInfo", json);
			hashMap.put("msg", "정상적으로 조회하였습니다.");

    	}catch(Exception e) {
			e.printStackTrace();
    		log.error("["+e.getClass()+"] Exception : " + e.getMessage());
    	}
		return hashMap;
    }


	/**
	 * @Method Name : FRME230UPT01
	 * @작성일      : 2022.01.10
	 * @작성자      : bykim
	 * @변경이력    :
	 * @Method 설명 : 콜백내역 상태 업데이트
	 * @param       : HttpServletRequest - json 배열   "list" :  [{id : "", name : ""},{id : "", name : ""}] 구조
	 * @return      : ModelAndView HashMap
	 */
	@PostMapping(value ="/FRME230UPT01")
	@ResponseBody
	public Map<String, Object> FRME230UPT01(@RequestBody String req, SessionStatus status, Locale locale) {
		HashMap<String, Object> hashMap = new HashMap<String, Object>();
		JSONParser parser = new JSONParser();

		try {
			ComnFun cf = new ComnFun();
			JSONObject obj = (JSONObject) parser.parse(req);

			FRME230VO vo = new FRME230VO();

			vo.setTenantId(String.valueOf(obj.get("tenantId")));
			if(obj.get("cabackAcpnNo") != null) {
				vo.setCabackAcpnNo(new BigInteger(String.valueOf(obj.get("cabackAcpnNo"))));
			}
			vo.setCabackProcStCd(String.valueOf(obj.get("cabackProcStCd")));
			vo.setCnslrId(String.valueOf(obj.get("cnslrId")));

			Integer rtn = frme230Service.FRME230UPT01(vo);


			if(rtn > 0) {
				status.setComplete();
				hashMap.put("result", "Update Success");
				hashMap.put("msg", "정상적으로 변경하였습니다.");
			}
		}catch(Exception e) {
			log.error("["+e.getClass()+"] Exception : " + e.getMessage());
		}

		return hashMap;
	}

	/**
	 * @Method Name : FRME230SEL02
	 * @작성일      : 2022.11.11
	 * @작성자      : djjung
	 * @변경이력    :
	 * @Method 설명 : 콜백 알림 팝업 조회
	 * @param       : HttpServletRequest
	 * @return      : ModelAndView HashMap
	 */
	@PostMapping(value ="/FRME230SEL02")
	@ResponseBody
	public Map<String, Object> FRME230SEL02(@RequestBody String req, HttpSession session) {
		HashMap<String, Object> hashMap = new HashMap<>();
		JSONParser parser = new JSONParser();
		ComnFun cf = new ComnFun();
		try {
			JSONObject jsonObject = (JSONObject) parser.parse(req);

			List<FRME230VO> list = frme230Service.FRME230SEL02(this.objectMapper.convertValue(jsonObject, FRME230VO.class));
			LGIN000VO user = (LGIN000VO) session.getAttribute("user");

			for(FRME230VO fr : list) {
				if(!cf.isStringEmpty(fr.getCabackReqTelno())){
					String phoneNo = MaskingUtil.SwichingPhone(AES256Crypt.decrypt(fr.getCabackReqTelno()));
					if(!ComnFun.isEmpty(user.getPersonInfoMask()) && "N".equals(user.getPersonInfoMask())){
						phoneNo =  AES256Crypt.decrypt(fr.getCabackReqTelno());
					}
					fr.setCabackReqTelno(phoneNo);
				}
				if(!cf.isStringEmpty(fr.getInclTelNo())){
					String phoneNo = MaskingUtil.SwichingPhone(AES256Crypt.decrypt(fr.getInclTelNo()));
					if(!ComnFun.isEmpty(user.getPersonInfoMask()) && "N".equals(user.getPersonInfoMask())){
						phoneNo =  AES256Crypt.decrypt(fr.getInclTelNo());
					}
					fr.setInclTelNo(phoneNo);
				}
			}
			hashMap.put("list", this.objectMapper.writeValueAsString(list));
			hashMap.put("count", list.size());
			hashMap.put("msg", "정상적으로 조회하였습니다.");

		}catch(Exception e) {
			log.error("["+e.getClass()+"] Exception : " + e.getMessage());
		}
		return hashMap;
	}
	
	@PostMapping(value ="/FRME230SEL03")
	@ResponseBody
	public Map<String, Object> FRME230SEL03(@RequestBody String req) {
		HashMap<String, Object> hashMap = new HashMap<>();
		JSONParser parser = new JSONParser();
		try {

			JSONObject jsonObject = (JSONObject) parser.parse(req);
			List<FRME230VO> list = frme230Service.FRME230SEL03(this.objectMapper.convertValue(jsonObject, FRME230VO.class));
			for(FRME230VO vo : list) {
				if(!StringUtil.isEmpty(vo.getUsrNm())) {
					vo.setUsrNm(AES256Crypt.decrypt(vo.getUsrNm()));
				}
			}
			
			//hashMap.put("list", new ObjectMapper().writeValueAsString(list));
			hashMap.put("list", list);
			hashMap.put("count", list.size());
			hashMap.put("msg", "정상적으로 조회하였습니다.");
		} catch (Exception e) {
			log.error("["+e.getClass()+"] Exception : " + e.getMessage());
		}

		return hashMap;
	}
	

	@PostMapping(value ="/FRME230UPT02")
	@ResponseBody
	public Map<String, Object> FRME230UPT02(@RequestBody String req) {
		HashMap<String, Object> hashMap = new HashMap<>();
		JSONParser parser = new JSONParser();
		try {
			JSONObject jsonObject = (JSONObject) parser.parse(req);
			int result  = frme230Service.FRME230UPT02(this.objectMapper.convertValue(jsonObject, FRME230VO.class));

			if (result <0){
				hashMap.put("msg", "정상적으로 수정하였습니다.");
			}else{
				hashMap.put("msg", "수정에 실패 하였습니다.");
			}
			hashMap.put("result", result);

		}catch(Exception e) {
			log.error("["+e.getClass()+"] Exception : " + e.getMessage());
		}
		return hashMap;
	}
	
	@PostMapping(value ="/FRME230UPT03")
	@ResponseBody
	public Map<String, Object> FRME230UPT03(@RequestBody String req) {
		HashMap<String, Object> hashMap = new HashMap<>();
		JSONParser parser = new JSONParser();
		int result = 0;
		
		try {
			/*
			JsonArray jsonArray = new Gson().fromJson(new JsonUtil().readJsonBody(req), JsonObject.class).getAsJsonArray("list");
			int rtn = sysm434Service.SYSM434INS01(new Gson().fromJson(jsonArray, new TypeToken<ArrayList<SYSM434VO>>(){}.getType()));
			 * */

			JSONObject jsonObject = (JSONObject) parser.parse(req);
			JSONArray jsonArray = (JSONArray) jsonObject.get("list");
			
			//이력 저장
			result = frme230Service.FRME230INS01(this.objectMapper.convertValue(jsonArray, new TypeReference<List<FRME230VO>>() {}));
			
			if(result > 0) {
				//배정 처리
				//
				result  = frme230Service.FRME230UPT03(this.objectMapper.convertValue(jsonArray, new TypeReference<List<FRME230VO>>() {}));
			}
			
			if(result > 0 ) {
				hashMap.put("msg", "배정이 완료되었습니다.");
				hashMap.put("result", "success");
			} else {
				hashMap.put("msg", "배정에 실패했습니다.");
				hashMap.put("result", "fail");
			}
			

		}catch(Exception e) {
			log.error("["+e.getClass()+"] Exception : " + e.getMessage());
			e.printStackTrace();
		}
		
		//hashMap.put("result", result);
		return hashMap;
	}

	@PostMapping(value ="/FRME230UPT04")
	@ResponseBody
	public Map<String, Object> FRME230UPT04(@RequestBody String req) {
		HashMap<String, Object> hashMap = new HashMap<>();
		JSONParser parser = new JSONParser();
		int result = 0;

		try {
			JSONObject jsonObject = (JSONObject) parser.parse(req);
			JSONArray jsonArray = (JSONArray) jsonObject.get("list");
			//회수 처리
			//
			result  = frme230Service.FRME230UPT04(this.objectMapper.convertValue(jsonArray, new TypeReference<List<FRME230VO>>() {}));

			hashMap.put("result", result);

		}catch(Exception e) {
			log.error("["+e.getClass()+"] Exception : " + e.getMessage());
			e.printStackTrace();
		}

		//hashMap.put("result", result);
		return hashMap;
	}
}



