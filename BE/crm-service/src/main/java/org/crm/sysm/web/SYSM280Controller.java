package org.crm.sysm.web;

import org.crm.lgin.VO.LGIN000VO;
import org.crm.sysm.VO.SYSM280VO;
import org.crm.sysm.service.SYSM280Service;
import org.crm.util.com.ComnFun;
import org.crm.util.json.JsonUtil;
import org.crm.util.string.StringUtil;
import org.crm.util.xlsx.ExcelFileType;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.support.SessionStatus;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.servlet.ModelAndView;
import java.util.*;

/***********************************************************************************************
* Program Name : 상담유형 코드관리 Main Controller
* Creator      : 김보영
* Create Date  : 2022.05.10
* Description  : 상담유형 코드관리
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.05.10    김보영           최초생성
*************************************************************************** *********************/
@Slf4j
@Controller
@RequestMapping("/sysm/*")
public class SYSM280Controller {

	@Resource(name = "SYSM280Service")
	private SYSM280Service SYSM280Service;

	@Autowired
	private ObjectMapper objectMapper;

	private static final Logger LOGGER = LoggerFactory.getLogger(SYSM280Controller.class);

	/**
	 * @Method Name : SYSM280M
	 * @작성일      : 2022.01.10
	 * @작성자      : bykim
	 * @변경이력    : 
	 * @Method 설명 : sysm/SYSM281P 웹 페이지 열기
	 * @param       :  
	 * @return      : sysm/SYSM280M.jsp 
	 */	
	@GetMapping("/SYSM280M")
	public String SYSM280M() {
		LOGGER.info("SYSM280M 페이지 열기");
		return "th/sysm/SYSM280M";
	}	

	/**
	 * @Method Name : SYSM281P
	 * @작성일      : 2022.01.10
	 * @작성자      : bykim
	 * @변경이력    : 
	 * @Method 설명 : sysm/SYSM281P 웹 페이지 열기
	 * @param       :  
	 * @return      : sysm/SYSM281P.jsp 
	 */	
	@RequestMapping("/SYSM281P")
	public String SYSM281P() {
		LOGGER.info("SYSM281P 페이지 열기");
		return "th/sysm/SYSM281P";
	}	
	
	/**
	 * @Method Name : SYSM282P
	 * @작성일      : 2022.01.10
	 * @작성자      : bykim
	 * @변경이력    : 
	 * @Method 설명 : sysm/SYSM282P 웹 페이지 열기
	 * @param       :  
	 * @return      : sysm/SYSM282P.jsp 
	 */	
	@RequestMapping("/SYSM282P")
	public String SYSM282P() {
		LOGGER.info("SYSM282P 페이지 열기");
		return "th/sysm/SYSM282P";
	}	

	/**
	 * @Method Name : SYSM281SEL01
	 * @작성일      : 2022.01.10
	 * @작성자      : bykim
	 * @변경이력    : 
	 * @Method 설명 : 상담유형 코드 목록조회
	 * @param       :@RequestBody String Restful param
	 * @return      : ModelAndView HashMap
	 */    
	@PostMapping(value ="/SYSM280SEL01")
	@ResponseBody    
	public Map<String, Object> SYSM280SEL01(ModelAndView mav, @RequestBody String req){

		HashMap<String, Object> hashMap = new HashMap<String, Object>();
		JSONParser parser = new JSONParser();

		try {
			JSONObject obj = (JSONObject) parser.parse(req);
			
			SYSM280VO vo = SYSM280VO.builder()
					.tenantId(String.valueOf(obj.get("tenantId")))
					.srchCond(String.valueOf(obj.get("srchCond")))
					.srchText(String.valueOf(obj.get("srchText")))
					.useDvCd(String.valueOf(obj.get("useDvCd")))
					.prsLvlCd(String.valueOf(obj.get("prsLvlCd")))
					.build();
			
			List<SYSM280VO> SYSM280VOInfo = SYSM280Service.SYSM280SEL01(vo);
			String json = this.objectMapper.writeValueAsString(SYSM280VOInfo);
			
			LOGGER.info("SYSM280M 페이지 열기  : "+json);

			hashMap.put("SYSM280VOInfo", json);
			hashMap.put("SYSM280VOListCount", SYSM280VOInfo.size());

			//jsonView : dispatcher-servlet.xml 선언

		}catch(Exception e) {
			LOGGER.error("["+e.getClass()+"] Exception : " + e.getMessage());
		}
		return hashMap;
	}
	
	/**
	 * @Method Name : SYSM281SEL02
	 * @작성일      : 2022.01.10
	 * @작성자      : bykim
	 * @변경이력    : 
	 * @Method 설명 : 상담유형 코드 목록조회
	 * @param       : @RequestBody String Restful param
	 * @return      : ModelAndView HashMap
	 */    
	@PostMapping(value ="/SYSM280SEL02")
	@ResponseBody    
	public Map<String, Object> SYSM280SEL02(ModelAndView mav,@RequestBody String req){

		HashMap<String, Object> hashMap = new HashMap<String, Object>();
		JSONParser parser = new JSONParser();

		try {
			JSONObject obj = (JSONObject) parser.parse(req);
			
			SYSM280VO vo = SYSM280VO.builder()
					.tenantId(String.valueOf(obj.get("tenantId")))
					.cnslTypCd(String.valueOf(obj.get("cnslTypCd")))
					.build();

			List<SYSM280VO> SYSM280VOInfo = SYSM280Service.SYSM280SEL02(vo);

			String json = this.objectMapper.writeValueAsString(SYSM280VOInfo);
			
			LOGGER.info("SYSM280M 페이지 열기  : "+json);


			hashMap.put("SYSM280VOInfo", json);
			hashMap.put("SYSM280VOListCount", SYSM280VOInfo.size());

		}catch(Exception e) {
			LOGGER.error("["+e.getClass()+"] Exception : " + e.getMessage());
		}
		return hashMap;
	}


	/**
	 * @Method Name : SYSM280INS01
	 * @작성일      : 2022.01.10
	 * @작성자      : bykim
	 * @변경이력    : 
	 * @Method 설명 : 상담유형 코드 신규등록
	 * @param       :@RequestBody String Restful param
	 * @return      : ModelAndView HashMap
	 */   
	@RequestMapping(value ="/SYSM280INS01", method = RequestMethod.POST)
	@ResponseBody 
	public Map<String, Object> SYSM280INS01(ModelAndView mav,@RequestBody String req, BindingResult bindingResult, Model model, 
			SessionStatus status)  {

		HashMap<String, Object> hashMap = new HashMap<String, Object>();
		JSONParser parser = new JSONParser();

		try {
			JSONObject obj = (JSONObject) parser.parse(req);

			JSONArray jsonArray = (JSONArray) obj.get("SYSM280VOList");
			List<SYSM280VO> list = new ArrayList<SYSM280VO>();
			List<SYSM280VO> baseAnswCdList = new ArrayList<SYSM280VO>();
			
			for(int i=0; i<jsonArray.size(); i++){
				JSONObject jsonObject = (JSONObject) jsonArray.get(i);
				SYSM280VO SYSM280VO = new SYSM280VO();

				SYSM280VO.setTenantId(String.valueOf(jsonObject.get("tenantId")));
				SYSM280VO.setCnslTypCd(String.valueOf(jsonObject.get("cnslTypCd")));
				SYSM280VO.setCnslTypLvlNm(String.valueOf(jsonObject.get("cnslTypLvlNm")));
				SYSM280VO.setPrsLvlCd(String.valueOf(jsonObject.get("prsLvlCd")));
				SYSM280VO.setHgrkCnslTypCd(String.valueOf(jsonObject.get("hgrkCnslTypCd")));
				SYSM280VO.setDataCreYn(String.valueOf(jsonObject.get("dataCreYn")));
				SYSM280VO.setUseDvCd(String.valueOf(jsonObject.get("useDvCd")));
				SYSM280VO.setRegrId(String.valueOf(jsonObject.get("regrId")));
				SYSM280VO.setRegrOrgCd(String.valueOf(jsonObject.get("regrOrgCd")));
				SYSM280VO.setLstCorprId(String.valueOf(jsonObject.get("lstCorprId")));
				SYSM280VO.setLstCorprOrgCd(String.valueOf(jsonObject.get("lstCorprOrgCd")));
				
				list.add(SYSM280VO);

				String[] baseAnswCd = String.valueOf(jsonObject.get("baseAnswCd")).split(";");

				for(int j =0; j<baseAnswCd.length; j++){
					SYSM280VO baseAnswVO = new SYSM280VO();
					baseAnswVO.setTenantId(SYSM280VO.getTenantId());
					baseAnswVO.setCnslTypCd(SYSM280VO.getCnslTypCd());
					baseAnswVO.setBaseAnswCd(baseAnswCd[j]);
					baseAnswVO.setRegrId(SYSM280VO.getRegrId());
					baseAnswVO.setRegrId(SYSM280VO.getRegrOrgCd());

					baseAnswCdList.add(baseAnswVO);
				}
			}
			
			Integer adtnRtn = SYSM280Service.SYSM280INS01(list);

			SYSM280Service.SYSM280INS03(baseAnswCdList);

			if(adtnRtn > 0) {
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
	 * @Method Name : SYSM280INS02
	 * @작성일      : 2022.01.10
	 * @작성자      : bykim
	 * @변경이력    : 
	 * @Method 설명 : 상담유형 연관키워드 신규등록
	 * @param       :@RequestBody String Restful param
	 * @return      : ModelAndView HashMap
	 */   
	@PostMapping(value ="/SYSM280INS02")
	@ResponseBody 
	public Map<String, Object> SYSM280INS02(ModelAndView mav,@RequestBody String req)  {

		HashMap<String, Object> hashMap = new HashMap<String, Object>();
		JSONParser parser = new JSONParser();

		try {
			JSONObject obj = (JSONObject) parser.parse(req);
			JSONArray jsonArray = (JSONArray) obj.get("SYSM280VOList");
			List<SYSM280VO> list = new ArrayList<SYSM280VO>();
			SYSM280VO vo = new SYSM280VO();

			if(jsonArray.size()>0){
				for(int i=0; i<jsonArray.size(); i++){
					JSONObject jsonObject = (JSONObject) jsonArray.get(i);
					SYSM280VO SYSM280VO = new SYSM280VO();

					SYSM280VO.setTenantId(String.valueOf(jsonObject.get("tenantId")));
					SYSM280VO.setCnslTypCd(String.valueOf(jsonObject.get("cnslTypCd")));
					SYSM280VO.setSeq(Integer.parseInt(String.valueOf(jsonObject.get("seq"))));
					SYSM280VO.setKeywordNm(String.valueOf(jsonObject.get("keywordNm")));
					SYSM280VO.setKeywordEpctHitRt(Integer.parseInt(String.valueOf(jsonObject.get("keywordEpctHitRt"))));

					SYSM280VO.setRegrId(String.valueOf(jsonObject.get("regrId")));
					SYSM280VO.setRegrOrgCd(String.valueOf(jsonObject.get("regrOrgCd")));

					list.add(SYSM280VO);
				}

				vo.setTenantId(list.get(0).getTenantId());
				vo.setCnslTypCd(list.get(0).getCnslTypCd());

				//연관키워드 삭제
				SYSM280Service.SYSM280DEL02(vo);
				//연관키워드 신규등록
				SYSM280Service.SYSM280INS02(list);
			}else{

				vo.setTenantId(String.valueOf(obj.get("tenantId")));
				vo.setCnslTypCd(String.valueOf(obj.get("cnslTypCd")));

				//연관키워드 삭제
				SYSM280Service.SYSM280DEL02(vo);
			}

			String json = this.objectMapper.writeValueAsString(vo);
			
			LOGGER.info("SYSM280M 페이지 열기  : "+json);

			hashMap.put("SYSM280VOInfo", json);

		}catch(Exception e) {
			LOGGER.error("["+e.getClass()+"] Exception : " + e.getMessage());
		}
		return hashMap;

	}

	/**
	 * @Method Name : SYSM280UPT01
	 * @작성일      : 2022.01.10
	 * @작성자      : bykim
	 * @변경이력    : 
	 * @Method 설명 : 상담유형 코드 수정
	 * @param       :@RequestBody String Restful param
	 * @return      : ModelAndView HashMap
	 */     
	@RequestMapping(value ="/SYSM280UPT01", method = RequestMethod.POST)
	@ResponseBody 
	public Map<String, Object> SYSM280UPT01(ModelAndView mav,@RequestBody String req, BindingResult bindingResult, Model model, 
			SessionStatus status) {

		HashMap<String, Object> hashMap = new HashMap<String, Object>();
		JSONParser parser = new JSONParser();

		try {
			JSONObject obj = (JSONObject) parser.parse(req);

			JSONArray jsonArray = (JSONArray) obj.get("SYSM280VOList");
			List<SYSM280VO> list = new ArrayList<SYSM280VO>();
			List<SYSM280VO> baseAnswCdList = new ArrayList<SYSM280VO>();
			
			for(int i=0; i<jsonArray.size(); i++){
				JSONObject jsonObject = (JSONObject) jsonArray.get(i);
				SYSM280VO SYSM280VO = new SYSM280VO();

				SYSM280VO.setTenantId(String.valueOf(jsonObject.get("tenantId")));
				SYSM280VO.setCnslTypCd(String.valueOf(jsonObject.get("cnslTypCd")));
				SYSM280VO.setMgntItemCd(String.valueOf(jsonObject.get("mgntItemCd")));
				SYSM280VO.setCnslTypLvlNm(String.valueOf(jsonObject.get("cnslTypLvlNm")));
				SYSM280VO.setPrsLvlCd(String.valueOf(jsonObject.get("prsLvlCd")));
				SYSM280VO.setHgrkCnslTypCd(String.valueOf(jsonObject.get("hgrkCnslTypCd")));
				SYSM280VO.setDataCreYn(String.valueOf(jsonObject.get("dataCreYn")));
				SYSM280VO.setUseDvCd(String.valueOf(jsonObject.get("useDvCd")));
				
				SYSM280VO.setRegrId(String.valueOf(jsonObject.get("regrId")));
				SYSM280VO.setRegrOrgCd(String.valueOf(jsonObject.get("regrOrgCd")));
				SYSM280VO.setLstCorprId(String.valueOf(jsonObject.get("lstCorprId")));
				SYSM280VO.setLstCorprOrgCd(String.valueOf(jsonObject.get("lstCorprOrgCd")));
				
				list.add(SYSM280VO);

				String[] baseAnswCd = String.valueOf(jsonObject.get("baseAnswCd")).split(";");
				String[] baseAnswCdNm = String.valueOf(jsonObject.get("baseAnswCdNm")).split(";");

				ComnFun cf = new ComnFun();

				for(int j =0; j<baseAnswCd.length; j++){
					SYSM280VO baseAnswVO = new SYSM280VO();
					baseAnswVO.setTenantId(SYSM280VO.getTenantId());
					baseAnswVO.setCnslTypCd(SYSM280VO.getCnslTypCd());
					baseAnswVO.setBaseAnswCd(cf.isStringEmpty(baseAnswCd[j]) ?"":baseAnswCd[j]);
					baseAnswVO.setBaseAnswCdNm(baseAnswCdNm[j]);
					baseAnswVO.setRegrId(SYSM280VO.getRegrId());
					baseAnswVO.setRegrId(SYSM280VO.getRegrOrgCd());

					baseAnswCdList.add(baseAnswVO);
				}
			}
			
			Integer rtn = SYSM280Service.SYSM280UPT01(list);

			//상담유형답변코드 delete insert
			SYSM280Service.SYSM280DEL03(baseAnswCdList);
			SYSM280Service.SYSM280INS03(baseAnswCdList);

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
	 * @Method Name : SYSM280UPT01
	 * @작성일      : 2024.04.17
	 * @작성자      : shpark
	 * @변경이력    : 
	 * @Method 설명 : 상담유형 코드 추가 와 수정
	 * @param       :@RequestBody String Restful param
	 * @return      : ModelAndView HashMap
	 */
	@RequestMapping(value ="/SYSM280SAVE01", method = RequestMethod.POST)
	@ResponseBody
	public Map<String, Object> SYSM280SAVE01(ModelAndView mav,@RequestBody String req, BindingResult bindingResult, Model model,
									 SessionStatus status) {

		HashMap<String, Object> hashMap = new HashMap<String, Object>();
		JSONParser parser = new JSONParser();

		try {
			JSONObject obj = (JSONObject) parser.parse(req);

			JSONArray jsonArray = (JSONArray) obj.get("SYSM280VOList");
			List<SYSM280VO> list = new ArrayList<SYSM280VO>();
			List<SYSM280VO> baseAnswCdList = new ArrayList<SYSM280VO>();

			for(int i=0; i<jsonArray.size(); i++){
				JSONObject jsonObject = (JSONObject) jsonArray.get(i);
				SYSM280VO SYSM280VO = new SYSM280VO();

				SYSM280VO.setTenantId(String.valueOf(jsonObject.get("tenantId")));
				SYSM280VO.setCnslTypCd(String.valueOf(jsonObject.get("cnslTypCd")));
				SYSM280VO.setCnslTypLvlNm(String.valueOf(jsonObject.get("cnslTypLvlNm")));
				SYSM280VO.setPrsLvlCd(String.valueOf(jsonObject.get("prsLvlCd")));
				SYSM280VO.setHgrkCnslTypCd(String.valueOf(jsonObject.get("hgrkCnslTypCd")));
				SYSM280VO.setDataCreYn(String.valueOf(jsonObject.get("dataCreYn")));
				SYSM280VO.setUseDvCd(String.valueOf(jsonObject.get("useDvCd")));
				SYSM280VO.setRegrId(String.valueOf(jsonObject.get("regrId")));
				SYSM280VO.setRegrOrgCd(String.valueOf(jsonObject.get("regrOrgCd")));
				SYSM280VO.setLstCorprId(String.valueOf(jsonObject.get("lstCorprId")));
				SYSM280VO.setLstCorprOrgCd(String.valueOf(jsonObject.get("lstCorprOrgCd")));
				SYSM280VO.setSrtSeq(Integer.parseInt( jsonObject.get("srtSeq").toString() ));

				list.add(SYSM280VO);

				String[] baseAnswCd = String.valueOf(jsonObject.get("baseAnswCd")).split(";");
				String[] baseAnswCdNm = String.valueOf(jsonObject.get("baseAnswCdNm")).split(";");

				ComnFun cf = new ComnFun();

				for(int j =0; j<baseAnswCd.length; j++){
					SYSM280VO baseAnswVO = new SYSM280VO();
					baseAnswVO.setTenantId(SYSM280VO.getTenantId());
					baseAnswVO.setCnslTypCd(SYSM280VO.getCnslTypCd());
					baseAnswVO.setBaseAnswCd(cf.isStringEmpty(baseAnswCd[j]) ?"":baseAnswCd[j]);
					baseAnswVO.setBaseAnswCdNm(baseAnswCdNm[j]);
					baseAnswVO.setRegrId(SYSM280VO.getRegrId());
					baseAnswVO.setRegrId(SYSM280VO.getRegrOrgCd());

					baseAnswCdList.add(baseAnswVO);
				}
			}

			Integer rtn = SYSM280Service.SYSM280SAVE01(list);

			//상담유형답변코드 delete insert
			SYSM280Service.SYSM280DEL03(baseAnswCdList);
			SYSM280Service.SYSM280INS03(baseAnswCdList);

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
	 * @Method Name : SYSM280DEL01
	 * @작성일      : 2022.01.10
	 * @작성자      : bykim
	 * @변경이력    : 
	 * @Method 설명 : 상담유형 코드 삭제
	 * @param       :@RequestBody String Restful param
	 * @return      : ModelAndView HashMap
	 */     
	@RequestMapping(value ="/SYSM280DEL01", method = RequestMethod.POST)
	@ResponseBody  
	public Map<String, Object> SYSM280DEL01(ModelAndView mav,@RequestBody String req, BindingResult bindingResult, Model model, 
			SessionStatus status) {

		HashMap<String, Object> hashMap = new HashMap<String, Object>();
		JSONParser parser = new JSONParser();

		try {
			JSONObject obj = (JSONObject) parser.parse(req);

			JSONArray jsonArray = (JSONArray) obj.get("SYSM280VOList");
			List<SYSM280VO> list = new ArrayList<SYSM280VO>();
			
			for(int i=0; i<jsonArray.size(); i++){
				JSONObject jsonObject = (JSONObject) jsonArray.get(i);
				SYSM280VO SYSM280VO = new SYSM280VO();

				SYSM280VO.setTenantId(String.valueOf(jsonObject.get("tenantId")));
				SYSM280VO.setCnslTypCd(String.valueOf(jsonObject.get("cnslTypCd")));
				SYSM280VO.setHgrkCnslTypCd(String.valueOf(jsonObject.get("hgrkCnslTypCd")));
				SYSM280VO.setSrtSeq(Integer.parseInt(String.valueOf(jsonObject.get("srtSeq"))));
				
				list.add(SYSM280VO);
			}
			SYSM280Service.SYSM280DEL03(list);
			int rtn = SYSM280Service.SYSM280DEL01(list);

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
	 * @Method Name : SYSM281SEL03
	 * @작성일      : 2022.01.10
	 * @작성자      : bykim
	 * @변경이력    :
	 * @Method 설명 : 상담유형 코드 목록조회 (팝업)
	 * @param       :@RequestBody String Restful param
	 * @return      : ModelAndView HashMap
	 */
	@RequestMapping(value ="/SYSM281SEL03", method = RequestMethod.POST)
	@ResponseBody
	public Map<String, Object> SYSM281SEL03(ModelAndView mav,@RequestBody String req){

		HashMap<String, Object> hashMap = new HashMap<String, Object>();
		JSONParser parser = new JSONParser();

		try {

			JSONObject obj = (JSONObject) parser.parse(req);

			SYSM280VO vo = new SYSM280VO();
			vo.setTenantId(String.valueOf(obj.get("tenantId")));
			vo.setSrchCond(String.valueOf(obj.get("srchCond")));
			vo.setSrchText(String.valueOf(obj.get("srchText")));
			vo.setPrsLvlCd(String.valueOf(obj.get("prsLvlCd")));
			vo.setCnslTypCd(String.valueOf(obj.get("cnslTypCd")));

			List<SYSM280VO> SYSM280VOInfo = SYSM280Service.SYSM280SEL03(vo);

			ObjectMapper mapper = new ObjectMapper();
			String json = mapper.writeValueAsString(SYSM280VOInfo);

			hashMap.put("SYSM280VOInfo", json);
			hashMap.put("SYSM280VOInfo", json);
			hashMap.put("SYSM280VOListCount", SYSM280VOInfo.size());

		}catch(Exception e) {
			LOGGER.error("["+e.getClass()+"] Exception : " + e.getMessage());
			e.printStackTrace();
		}
		return hashMap;
	}



	@RequestMapping(value ="SYSM280XLXUP", method = RequestMethod.POST, headers=("content-type=multipart/*"))
	@ResponseBody
	public Map<String, Object> SYSM280XLXUP(Locale locale, ModelAndView mav, MultipartHttpServletRequest request, HttpServletResponse response , HttpSession session){

		LGIN000VO user = (LGIN000VO)session.getAttribute("user");

		HashMap<String, Object> resultMap = new HashMap<String, Object>();
		String resultStr = "";

		String tenantId = request.getParameter("tenantId");

		int rows = 0;
		JSONArray jArrExcelData = new JSONArray();

		try {
			MultipartFile upFile = null;
			Iterator<String> iterator = request.getFileNames();

			if(iterator.hasNext()) {
				upFile = request.getFile(iterator.next());
			}

			if(upFile != null) {

				Workbook workbook = ExcelFileType.getWorkbook(upFile);

				if(workbook != null){

					boolean isDone = false;
					Sheet sheet = workbook.getSheetAt(0);

					rows = sheet.getLastRowNum();
					ArrayList<String> header = new ArrayList<String>();
					for(int i=0; !isDone && i<=rows; i++) {
						Row row = sheet.getRow(i);

						//헤더값 header 에 추가
						if(i == 0) {
							for(int j=0; j<row.getLastCellNum(); j++) {
								header.add(row.getCell(j).toString());
							}
						}
						//row null이면 건너뜀
						if(row == null) {
							continue;
						}

						if(i >= 1) {
							JSONObject jObj = new JSONObject();

							//header에서 값 가져와서 json에 추가
							for(int k=0; k<row.getLastCellNum(); k++) {
								if(row.getCell(k) == null || row.getCell(k).getCellType().equals(org.apache.poi.ss.usermodel.CellType.BLANK)){ //빈칸이면 건너뜀
									continue;
								}

								jObj.put(header.get(k), row.getCell(k).toString().replace(".0",""));
							}
							if(jObj.size() > 0){
								jArrExcelData.add(jObj);
							}

						}
					}
				}
			}

			//jArrExcelData arraylist 로 변경
			ArrayList<SYSM280VO> list = new ArrayList<SYSM280VO>();
			for(int i=0; i<jArrExcelData.size(); i++) {
				SYSM280VO sysm280vo = new SYSM280VO();
				JSONObject jObj = (JSONObject) jArrExcelData.get(i);
				if(String.valueOf(jObj.get("CODE")).equals("") ) {

					if(String.valueOf(jObj.get("UP_CODE")).equals("") ) {
						//입력 안된 ROW
						continue;
					}else{
						//상위 코드가 입력되어 있지만 코드가 입력되지 않은 ROW
						resultStr = "상위 코드가 입력되어 있지만 코드가 입력되지 않은 ROW가 있습니다.";
						break;
					}
				}

				sysm280vo.setTenantId(				String.valueOf(		tenantId						));
				sysm280vo.setCnslTypCd(				String.valueOf(		"tmp_"+i								));	    //상담유형코드         		채번 해주어야함
				sysm280vo.setCnslTypLvlNm(			String.valueOf(		jObj.get("NAME")				));		//상담유형레벨코드
				sysm280vo.setPrsLvlCd(				String.valueOf(		""							));		//현재레벨코드
				sysm280vo.setHgrkCnslTypCd(			String.valueOf(		""							));		//상위 상담유형코드     		채번해주어야함
				sysm280vo.setDataCreYn(				String.valueOf(		""							));		//데이터생성여부		 		채번해주어야함
				sysm280vo.setUseDvCd(				String.valueOf(		jObj.get("USING_YN")			));		//사용구분코드
				sysm280vo.setRegrId(				String.valueOf(		user.getUsrId()			));		//등록자 아이디
				sysm280vo.setRegrOrgCd(				String.valueOf(		user.getOrgCd()			));		//등록자 조직코드
				sysm280vo.setLstCorprId(			String.valueOf(		user.getUsrId()			));		//최종수정자 아이디
				sysm280vo.setLstCorprOrgCd(			String.valueOf(		user.getOrgCd()			));		//최종수정자 조직코드
				sysm280vo.setSrtSeq(				0													 );		//순번 						순번은 일단 업로드 시 쿼리로 채번.
				sysm280vo.setSvcOprTypGrpCd(		String.valueOf(		jObj.get("GROUP_CODE")			));		//서비스운영유형그룹코드
				sysm280vo.setSvcOprTypCd(			String.valueOf(		jObj.get("CODE")				));		//서비스운영유형코드
				sysm280vo.setSvcOprHgrkTypGrpCd(	String.valueOf(		jObj.get("UP_CODE")				));		//서비스운영상위유형그룹코드

				list.add(sysm280vo);
			}

			Integer rtn = SYSM280Service.SYSM280SAVE01(list); //엑셀 데이터 저장
			SYSM280Service.SYSM280SEQINIT(list.get(0));		  // 엑셀 데이터 저장 후 cnsl_typ_cd , hgrk_cnsl_typ_cd, srt_seq , prs_lvl_cd , data_cre_yn 채번

			resultMap.put("list", list);
			resultMap.put("msg", resultStr);


		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
			e.printStackTrace();
		}

		return resultMap;
	}
}
