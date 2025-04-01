package org.crm.sysm.web;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.crm.comm.VO.COMM100VO;
import org.crm.comm.service.COMM100Service;
import org.crm.config.spring.config.PropertiesService;
import org.crm.lgin.VO.LGIN000VO;
import org.crm.sysm.VO.*;
import org.crm.sysm.service.SYSM120Service;
import org.crm.sysm.service.SYSM430Service;
import org.crm.sysm.service.SYSM434Service;
import org.crm.util.com.ComnFun;
import org.crm.util.crypto.AES256Crypt;
import org.crm.util.date.DateUtil;
import org.crm.util.string.StringUtil;
import org.crm.util.xlsx.ExcelFileType;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import java.sql.SQLException;
import java.util.*;

/***********************************************************************************************
 * Program Name : SMS 일괄발송 controller
 * Creator      : 정대정
 * Create Date  : 2022.08.16
 * Description  : SMS 일괄발송
 * Modify Desc  :
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.08.16     정대정           최초생성
 ************************************************************************************************/

@Slf4j
@Controller
@RequestMapping("/sysm/*")
public class SYSM434Controller { 
	
	@Autowired
	private PropertiesService propertiesService;
	
	@Autowired
	MessageSource messageSource;

	@Resource(name = "SYSM434Service")
	private SYSM434Service sysm434Service;
	
	@Resource(name = "SYSM430Service")
	private SYSM430Service sysm430Service;
	
	@Resource(name = "COMM100Service")
	private COMM100Service comm100Service;
	
	@Resource(name = "SYSM120Service")
	private SYSM120Service sysm120Service;
	
	private static final Logger LOGGER = LoggerFactory.getLogger(SYSM434Controller.class);

	@GetMapping("/SYSM434M")
	public String SYSM434M() {
        return "th/sysm/SYSM434M";
	}
	
	@GetMapping("/SYSM434P")
	public String SYSM434P() {
        return "th/sysm/SYSM434P";
	}

	private ObjectMapper objMapper;
	
	@Autowired
	private ObjectMapper objectMapper;
	
	public SYSM434Controller(ObjectMapper objMapper) {
		this.objMapper = objMapper;
	}
	
	/**
	  * @Method Name : SYSM434SEL01
	  * @작성일 : 2022. 11. 24
	  * @작성자 : sjy
	  * @변경이력 : 
	  * @Method 설명 : 발송 스케쥴 조회
	  * @param :
	  * @return :
	  */
	
	@PostMapping(value ="/SYSM434SEL01")
	@ResponseBody
	public ResponseEntity<String> SYSM434SEL01(@RequestBody String request, Locale locale) {
		
		HashMap<String, Object> resultMap = new HashMap<String, Object>();
		String resultStr = null;
		
		try {
			JSONParser parser1 = new JSONParser();
			JSONObject obj = (JSONObject) parser1.parse(request);
			SYSM434VO sysm434Vo = this.objectMapper.convertValue(obj, SYSM434VO.class);
			
			List<SYSM434VO> list = sysm434Service.SYSM434SEL01(sysm434Vo);

			resultMap.put("count", list.size());
			resultMap.put("list", new ObjectMapper().writeValueAsString(list));
			//resultMap.put("msg", "정상적으로 조회하였습니다.");
			resultMap.put("msg", messageSource.getMessage("success.common.select", null, "success.common.select", locale));	
			
			resultStr = this.objectMapper.writeValueAsString(resultMap);
			
		}catch (Exception e){
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}
		return ResponseEntity.ok().body(resultStr);
	}
	
	/**
	  * @Method Name : SYSM434SEL02
	  * @작성일 : 2022. 11. 30
	  * @작성자 : sjyang
	  * @변경이력 : 
	  * @Method 설명 : 발송 차수 정보 조회
	  * @param :
	  * @return :
	  */
	
	@PostMapping(value ="/SYSM434SEL02")
	@ResponseBody
	public ResponseEntity<String> SYSM434SEL02(@RequestBody String request, Locale locale) {
		HashMap<String, Object> resultMap = new HashMap<>();
		String resultStr = null;
		try {
			
			JSONParser parser1 = new JSONParser();
			JSONObject obj = (JSONObject) parser1.parse(request);
			SYSM434VO sysm434Vo = this.objectMapper.convertValue(obj, SYSM434VO.class);
			
			List<SYSM434VO> list = sysm434Service.SYSM434SEL02(sysm434Vo);

			resultMap.put("count", list.size());
			resultMap.put("list", new ObjectMapper().writeValueAsString(list));
			//resultMap.put("msg", "정상적으로 조회하였습니다.");
			resultMap.put("msg", messageSource.getMessage("success.common.select", null, "success.common.select", locale));	

			resultStr = this.objectMapper.writeValueAsString(resultMap);

		}catch (Exception e){
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}
		return ResponseEntity.ok().body(resultStr);
	}
	
	/**
	  * @Method Name : SYSM434SEL03
	  * @작성일 : 2022. 11. 24
	  * @작성자 : sjyang
	  * @변경이력 : 
	  * @Method 설명 : 발송고객 목록 조회
	  * @param :
	  * @return :
	  */
	
	@PostMapping(value ="/SYSM434SEL03")
	@ResponseBody
	public ResponseEntity<String> SYSM434SEL03(@RequestBody String request, Locale locale) {

		HashMap<String, Object> resultMap = new HashMap<>();
		String resultStr = null;
		
		try {
			
			JSONParser parser1 = new JSONParser();
			JSONObject obj = (JSONObject) parser1.parse(request);
			SYSM434VO sysm434Vo = this.objectMapper.convertValue(obj, SYSM434VO.class);
			
			List<SYSM434VO> list = sysm434Service.SYSM434SEL03(sysm434Vo);

			resultMap.put("count", list.size());
			resultMap.put("list", new ObjectMapper().writeValueAsString(list));
			//resultMap.put("msg", "정상적으로 조회하였습니다.");
			resultMap.put("msg", messageSource.getMessage("success.common.select", null, "success.common.select", locale));	

			resultStr = this.objectMapper.writeValueAsString(resultMap);

		}catch (Exception e){
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}
		return ResponseEntity.ok().body(resultStr);
	}
	
	/**
	  * @Method Name : SYSM434SEL04
	  * @작성일 : 2022. 11. 24
	  * @작성자 : sjyang
	  * @변경이력 : 
	  * @Method 설명 : 발송이력 조회
	  * @param :
	  * @return :
	  */
	@PostMapping(value ="/SYSM434SEL04")
	@ResponseBody
	public ResponseEntity<String> SYSM434SEL04(@RequestBody String request, Locale locale) {
		HashMap<String, Object> resultMap = new HashMap<>();
		String resultStr = null;
		try {
			
			JSONParser parser1 = new JSONParser();
			JSONObject obj = (JSONObject) parser1.parse(request);
			SYSM434VO sysm434Vo = this.objectMapper.convertValue(obj, SYSM434VO.class);
			
			List<SYSM434VO> list = sysm434Service.SYSM434SEL04(sysm434Vo);

			resultMap.put("count", list.size());
			resultMap.put("list", new ObjectMapper().writeValueAsString(list));
			//resultMap.put("msg", "정상적으로 조회하였습니다.");
			resultMap.put("msg", messageSource.getMessage("success.common.select", null, "success.common.select", locale));	

			resultStr = this.objectMapper.writeValueAsString(resultMap);

		}catch (Exception e){
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}
		return ResponseEntity.ok().body(resultStr);
	}
	
	@PostMapping(value ="/SYSM434SEL05")
	@ResponseBody
	public ResponseEntity<String> SYSM434SEL05(@RequestBody String request, Locale locale) {
		HashMap<String, Object> resultMap = new HashMap<>();
		String resultStr = null;
		try {
			JSONParser parser1 = new JSONParser();
			JSONObject obj = (JSONObject) parser1.parse(request);
			SYSM430VO sysm430Vo = this.objectMapper.convertValue(obj, SYSM430VO.class);
			
			List<SYSM430VO> fileList = sysm430Service.SYSM430SEL04(sysm430Vo);
			
			resultMap.put("fileList", new ObjectMapper().writeValueAsString(fileList));
			
			resultStr = this.objectMapper.writeValueAsString(resultMap);

		}catch (Exception e){
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}
		return ResponseEntity.ok().body(resultStr);
	}
	
	/**
	  * @Method Name : SYSM434SEL07
	  * @작성일 : 2023. 03. 05
	  * @작성자 : jypark
	  * @변경이력 : 
	  * @Method 설명 : 사용자 조회 (병원용)
	  * @param :
	  * @return :
	  */
	@PostMapping(value ="/SYSM434SEL06")
	@ResponseBody
	public ResponseEntity<String> SYSM434SEL06(@RequestBody String request, Locale locale) {
		HashMap<String, Object> resultMap = new HashMap<>();
		String resultStr = null;
		try {
			
			JSONParser parser1 = new JSONParser();
			JSONObject obj = (JSONObject) parser1.parse(request);
			SYSM434VO vo = this.objectMapper.convertValue(obj, SYSM434VO.class);
			
			List<LGIN000VO> list = sysm434Service.SYSM434SEL06(vo);
			
			for(LGIN000VO lgin000vo : list) {
				lgin000vo.setUsrNm(AES256Crypt.decrypt(lgin000vo.getUsrNm()));
				lgin000vo.setMbph_no(AES256Crypt.decrypt(lgin000vo.getMbph_no()));
			}
			
			resultMap.put("ResultData", objMapper.writeValueAsString(list));
			
			resultStr = this.objectMapper.writeValueAsString(resultMap);
			
		}catch (Exception e){
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}
		return ResponseEntity.ok().body(resultStr);
	}
	
	/**
	  * @Method Name : SYSM434SEL07
	  * @작성일 : 2023. 03. 05
	  * @작성자 : jypark
	  * @변경이력 : 
	  * @Method 설명 : 발송이력 조회 (기업용)
	  * @param :
	  * @return :
	  */
	@PostMapping(value ="/SYSM434SEL07")
	@ResponseBody
	public ResponseEntity<String> SYSM434SEL07(@RequestBody String request, Locale locale) {
		HashMap<String, Object> resultMap = new HashMap<>();
		String resultStr = null;
		try {
			
			JSONParser parser1 = new JSONParser();
			JSONObject obj = (JSONObject) parser1.parse(request);
			SYSM433VO vo = this.objectMapper.convertValue(obj, SYSM433VO.class);
			
			List<LGIN000VO> list = sysm434Service.SYSM434SEL07(vo);
			
			for(LGIN000VO lgin000vo : list) {
				lgin000vo.setUsrNm(AES256Crypt.decrypt(lgin000vo.getUsrNm()));
				lgin000vo.setMbph_no(AES256Crypt.decrypt(lgin000vo.getMbph_no()));
			}
			
			resultMap.put("ResultData", objMapper.writeValueAsString(list));
			
			resultStr = this.objectMapper.writeValueAsString(resultMap);
			
		}catch (Exception e){
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}
		return ResponseEntity.ok().body(resultStr);
	}
	
	
	/**
	  * @Method Name : SYSM434SEL0501
	  * @작성일 : 2022. 11. 24
	  * @작성자 : sjyang 차수배정 카운트 수 반환
	  * @변경이력 : 
	  * @Method 설명 :
	  * @param :
	  * @return :
	  */
	@PostMapping(value ="/SYSM434SEL0501")
	@ResponseBody
	public ResponseEntity<String> SYSM434SEL0501(@RequestBody String request, Locale locale) {
		
		HashMap<String, Object> resultMap = new HashMap<>();
		String resultStr = null;
		
		try {
			
			JSONParser parser1 = new JSONParser();
			JSONObject obj = (JSONObject) parser1.parse(request);
			SYSM434VO vo = this.objectMapper.convertValue(obj, SYSM434VO.class);
			
			SYSM434VO counts = sysm434Service.SYSM434SEL0501(vo);
			
			resultMap.put("counts",counts);
			
			resultStr = this.objectMapper.writeValueAsString(resultMap);
			
		}catch (Exception e){
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}
		return ResponseEntity.ok().body(resultStr);
	}
	
	

	/**
	  * @Method Name : SYSM434INS01
	  * @작성일 : 2022. 11. 24
	  * @작성자 : sjyang
	  * @변경이력 : 
	  * @Method 설명 : 발송 스케쥴 등록
	  * @param :
	  * @return :
	  */
	@PostMapping(value ="/SYSM434INS01")
	@ResponseBody
	public ResponseEntity<String> SYSM434INS01(@RequestBody String request, Locale locale) {
		HashMap<String, Object> resultMap = new HashMap<String, Object>();
		String resultStr = null;
		String result = "fail";
		String msg="";
		try {
			
			JSONParser parser1 = new JSONParser();
			JSONObject obj = (JSONObject) parser1.parse(request);
			
			JSONArray listArray = (JSONArray) obj.get("list");
			
			// VO를 List로 변환
			List<SYSM434VO> list = new ArrayList<SYSM434VO>();
	        for (Object item : listArray) {
	            SYSM434VO vo = this.objectMapper.convertValue(item, SYSM434VO.class);
	            list.add(vo);
	        }

			int rtn = sysm434Service.SYSM434INS01(list);
			
			if (rtn > 0) {
				result = "success";
				//msg = "정상적으로 추가되었습니다.";
				msg = messageSource.getMessage("success.common.insert", null, "success.common.insert", locale);
			}
			
			resultMap.put("msg", msg);
			resultMap.put("result", result);
			
			resultStr = this.objectMapper.writeValueAsString(resultMap);
		
		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}
		
		
		
		return ResponseEntity.ok().body(resultStr);
	}

	
	/**
	  * @Method Name : SYSM434INS02
	  * @작성일 : 2022. 11. 30
	  * @작성자 : sjyang
	  * @변경이력 : 
	  * @Method 설명 : 발송 차수 생성
	  * @param :
	  * @return :
	  */
	@PostMapping(value ="/SYSM434INS02")
	@ResponseBody
	public ResponseEntity<String> SYSM434INS02(@RequestBody String request, Locale locale) {
		
//		DefaultTransactionDefinition def = new DefaultTransactionDefinition();
//		def.setPropagationBehavior(TransactionDefinition.PROPAGATION_REQUIRED);
//		TransactionStatus txStatus = txManager.getTransaction(def);
		
		SQLException sqlEx = new SQLException();
		
		HashMap<String, Object> resultMap = new HashMap<String, Object>();
		
		String resultStr = null;
		
		int resultCnt = 0;
		
		try {
			
			JSONParser parser1 = new JSONParser();
			JSONObject obj = (JSONObject) parser1.parse(request);
			
			SYSM434VO sysm434vo = new SYSM434VO();
		
			String tenantId			= StringUtil.nullToBlank(obj.get("tenantId"));
			String regDt			= StringUtil.nullToBlank(obj.get("regDt"));
			String schdNo			= StringUtil.nullToBlank(obj.get("schdNo"));
			String regrId			= StringUtil.nullToBlank(obj.get("regrId"));
			String regrOrgCd		= StringUtil.nullToBlank(obj.get("regrOrgCd"));
			String lstCorprId		= StringUtil.nullToBlank(obj.get("lstCorprId"));
			String lstCorprOrgCd	= StringUtil.nullToBlank(obj.get("lstCorprOrgCd"));
			
//			String strTotCnt			= StringUtil.nullToBlank(obj.get("totCnt"));
//			String strRegCnt			= StringUtil.nullToBlank(obj.get("regCnt"));
			String strNumerator			= StringUtil.nullToBlank(obj.get("numerator"));
			String strDenominator		= StringUtil.nullToBlank(obj.get("denominator"));
//			String strQuotient			= StringUtil.nullToBlank(obj.get("quotient"));
//			String strRemainder			= StringUtil.nullToBlank(obj.get("remainder"));
			String strRemainderSchdNo	= StringUtil.nullToBlank(obj.get("remainderSchdNo"));
		
			int quotient = Integer.parseInt(strNumerator) / Integer.parseInt(strDenominator);
			int remainder = Integer.parseInt(strNumerator) % Integer.parseInt(strDenominator);
			
			sysm434vo.setTenantId(tenantId);
			sysm434vo.setRegDt(regDt);
			sysm434vo.setSchdNo(Integer.parseInt(schdNo));
			sysm434vo.setRegrId(regrId);
			sysm434vo.setRegrOrgCd(regrOrgCd);
			sysm434vo.setLstCorprId(lstCorprId);
			sysm434vo.setLstCorprOrgCd(lstCorprOrgCd);
			
			//sysm434vo.setSndgTgtNcnt(Integer.parseInt(strNumerator));
			sysm434vo.setSndgTgtNcnt(0);
			sysm434vo.setSndgScssNcnt(0);
			sysm434vo.setNumerator(Integer.parseInt(strNumerator));
			sysm434vo.setDenominator(Integer.parseInt(strDenominator));
			sysm434vo.setQuotient(quotient);
			sysm434vo.setRemainder(remainder);
			sysm434vo.setRemainderSchdNo(Integer.parseInt(strRemainderSchdNo));
			
			for (int i = 1; i <= quotient; i++) {
				//차수 설정
				int sndgRsvSqnc = sysm434Service.SYSM434SEL0201(sysm434vo);
				sysm434vo.setSndgRsvSqnc(sndgRsvSqnc);
				
				//잔량배정
				if(sysm434vo.getRemainderSchdNo() == i) { //잔량 배정 된 차수와 같다면
					sysm434vo.setDenominator(sysm434vo.getDenominator() + sysm434vo.getRemainder());
				} else {
					sysm434vo.setDenominator(Integer.parseInt(strDenominator));
				}
				
				sysm434vo.setSndgTgtNcnt(sysm434vo.getDenominator());
				sysm434vo.setSqncProcStCd("2"); //배정완료 상태 설정
				sysm434vo.setSmsStCd("2");
				
				int targetCnt = sysm434Service.SYSM434UPT02(sysm434vo);
				
				if(targetCnt > 0) {
					resultCnt += sysm434Service.SYSM434INS0201(sysm434vo);
				} else {
					break;
				}
			}
			
			if(quotient == resultCnt) {
//				txManager.commit(txStatus);
				resultMap.put("msg", messageSource.getMessage("SYSM434M.method.allocation.success", null, "SYSM434M.method.allocation.success", locale));
			} else {
//				txManager.rollback(txStatus);
				resultMap.put("msg", messageSource.getMessage("SYSM434M.method.allocation.fail", null, "SYSM434M.method.allocation.fail", locale));
				
				throw sqlEx;
			}
			
			resultStr = this.objectMapper.writeValueAsString(resultMap);
		} catch (Exception e) {
//			txManager.rollback(txStatus);
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());			
		}
		return ResponseEntity.ok().body(resultStr);
	}

	/**
	  * @Method Name : SYSM434INS03
	  * @작성일 : 2022. 11. 24
	  * @작성자 : sjyang
	  * @변경이력 : 
	  * @Method 설명 : SMS 발송고객 excel 등록
	  * @param :
	  * @return :
	  */
	@PostMapping(value ="/SYSM434INS03")
	@ResponseBody
	public ResponseEntity<String> SYSM434INS03(Locale locale, SYSM434VO sysm434vo,  MultipartHttpServletRequest request){

		HashMap<String, Object> resultMap = new HashMap<String, Object>();
		String resultStr = null;
		int result = 0;
		int rows = 0;
		int proCnt = 0;
		
		String mlingCd		= propertiesService.getString("MlingCd");	//StringUtil.nullToCustom(request.getParameter("mlingCd"),"ko");
		String tenantId		= StringUtil.nullToBlank(request.getParameter("tenantId"));
		String regrId		= StringUtil.nullToBlank(request.getParameter("regrId"));
		String regrOrgCd	= StringUtil.nullToBlank(request.getParameter("regrOrgCd"));
		String cntyCd		= StringUtil.nullToCustom(request.getParameter("cntyCd"),"KOR");
		String schdNo 		= StringUtil.nullToBlank(request.getParameter("schdNo"));		//하단에서 설정 시 int로 변환
		int tmplMgntNo 		= Integer.parseInt(StringUtil.nullToCustom(request.getParameter("tmplMgntNo"),"0"));
		int sndgRsvSqnc 	= Integer.parseInt(StringUtil.nullToCustom(request.getParameter("sndgRsvSqnc"),"0"));
		String regDt 		= ComnFun.onlyNumStr(StringUtil.nullToBlank(request.getParameter("regDt")));
		String sndgRsvDt 	= ComnFun.onlyNumStr(StringUtil.nullToBlank(request.getParameter("sndgRsvDt")));
		String sndgRsvTm	= ComnFun.onlyNumStr(StringUtil.nullToBlank(request.getParameter("sndgRsvTm")));
		String sndgCtt		= StringUtil.nullToBlank(request.getParameter("sndgCtt"));
		
		//kw---20230421 : sms 다건 발송 - 파일불러오기 할 때 첨부파일 집어넣기
		String apndFileIdxNm1 	=	StringUtil.nullToBlank(request.getParameter("apndFileIdxNm1"));
		String apndFileIdxNm2 	=	StringUtil.nullToBlank(request.getParameter("apndFileIdxNm2"));
		String apndFileIdxNm3 	=	StringUtil.nullToBlank(request.getParameter("apndFileIdxNm3"));
		String apndFileNm1 		=	StringUtil.nullToBlank(request.getParameter("apndFileNm1"));
		String apndFileNm2 		=	StringUtil.nullToBlank(request.getParameter("apndFileNm2"));
		String apndFileNm3 		=	StringUtil.nullToBlank(request.getParameter("apndFileNm3"));
		String apndFilePsn1 	=	StringUtil.nullToBlank(request.getParameter("apndFilePsn1"));
		String apndFilePsn2 	=	StringUtil.nullToBlank(request.getParameter("apndFilePsn2"));
		String apndFilePsn3 	=	StringUtil.nullToBlank(request.getParameter("apndFilePsn3"));
		//kw------------------------------------------
		
		String recvrTelCntyCd = "";
		String dpchNo = "";
		
		try {
			//국가코드 조회
			COMM100VO cdVo1 = new COMM100VO();
			cdVo1.setMgntItemCd("C0023");			//고정 코드 
			cdVo1.setMlingCd(mlingCd);
			cdVo1.setComCd(cntyCd);
			
			List<COMM100VO> comm100List = comm100Service.COMM100SEL04(cdVo1);			
			recvrTelCntyCd = comm100List.get(0).getMapgVlu1();
			
			//발신번호 조회 : bs_vl_mgnt_no > 고정 : 30
			SYSM100VO cdVo2 = new SYSM100VO();
			cdVo2.setTenantId(tenantId);
			cdVo2.setBsVlMgntNo(30);
			cdVo2.setUseYn("Y");
			
			//SMS 발송 사용 고객사 여부 확인
			List<SYSM120VO> comm120List = sysm120Service.SYSM120SEL03(cdVo2);
			if(comm120List.size() == 0) {
				resultMap.put("msg", messageSource.getMessage("SYSM434M.method.tenant.sms.useyn", null, "SYSM434M.method.tenant.sms.useyn", locale));
	        	
				resultStr = this.objectMapper.writeValueAsString(resultMap);
				
				return ResponseEntity.ok().body(resultStr);
			} else {
				dpchNo = comm120List.get(0).getBsVl1();
			}
			
			/////////// 첨부 파일 시작 //////////////////////////////////
			MultipartFile upFile = null;
	        Iterator<String> iterator = request.getFileNames();
	        
	        if(iterator.hasNext()) {
	            upFile = request.getFile(iterator.next());
	        }
			
	        if(upFile != null && !upFile.isEmpty()) {
	        	
	        	Workbook workbook = ExcelFileType.getWorkbook(upFile);
	        	
	        	if(workbook != null){
	        		
	        		Sheet sheet = workbook.getSheetAt(0);
	        		
	        		rows = sheet.getPhysicalNumberOfRows();
	        		
	        		List<SYSM434VO> targetList = new ArrayList<SYSM434VO>();
	        		
	        		for(int i=0;i<rows;i++) {
	        			//해더를 제외하고 실행
	        			if(i > 0 ) {
	        				
							Row row = sheet.getRow(i);
							
							SYSM434VO paramVo = new SYSM434VO();
							
							//수신 번호가 있을 경우만 발송 대상자에 추가
							String recvrTelNo 	= (row.getCell(2) != null) ? row.getCell(2).toString() : "";
							
							if(StringUtil.isMobileNumber(recvrTelNo)) {	//휴대전화번호만 처리
		        				recvrTelNo 			= ComnFun.onlyNumStr(recvrTelNo);
		        				String custId		= (row.getCell(0) != null) ? row.getCell(0).toString() : "";
		        	            String custNm 		= (row.getCell(1) != null) ? row.getCell(1).toString() : "";
		        	            String gender 		= (row.getCell(3) != null) ? row.getCell(3).toString() : "";
		        	            String gndrCd 		= "";
		        				
		        				if("ko".equals(locale.toString())) {
		        					gndrCd		= gender.contains("남") ? "M" : gender.contains("녀") ? "F" : gender.contains("여") ? "F" : "";
		        				} else {
		        					//영문만 가능
		        					gndrCd		= (!"".equals(gender)) ? gender.toUpperCase().substring(0, 1) : gndrCd;
		        				}
		        				
		        				String agelrgCd = "";
		        				String birthYmd = (row.getCell(4) != null) ? row.getCell(4).toString().trim() : "";
		        				if(birthYmd.length() == 8) { //국내 생년월일 (yyyymmdd) 8자리만 처리
		        					birthYmd = ComnFun.onlyNumStr(birthYmd);
		        					agelrgCd = DateUtil.getByAge(birthYmd);		
		        				}
		        	            
		        	            String custNmSrchkey1 = ""; 	// 성
		        	            String custNmSrchkey2 = ""; 	// 성+가운데 글자
		        	            String recvrTelNoSrchkey = ""; 	// 전화번호
		        				
		        				//이름 키워드 추출
								if (custNm.length() > 0) {
									custNmSrchkey1 = custNm.substring(0, 1); 		// 첫 글자 추출
									if (custNm.length() >= 2) {
										custNmSrchkey2 = custNm.substring(0, 2); 	// 첫 두 글자 추출
									} else {
										custNmSrchkey2 = custNm.substring(0, 1); 	// 이름이 한 글자일 경우 첫 글자만 추출
									}
								}
		        				
		        				//전화번호 키워드 추출 : 마지막 4자리 추출
		        				if(recvrTelNo.length() > 3) {
		        					recvrTelNoSrchkey = recvrTelNo.substring(recvrTelNo.length() - 4, recvrTelNo.length());
		        				}
								
		        				paramVo.setTenantId(tenantId);
		        				paramVo.setRegrId(regrId);
		        				paramVo.setRegrOrgCd(regrOrgCd);
								paramVo.setRegDt(regDt);
								
								//예약 차수가 있을 경우에만
								if(!"".equals(schdNo)) {
									paramVo.setSchdNo(Integer.parseInt(schdNo));	
								}
								
								paramVo.setTmplMgntNo(tmplMgntNo);
								paramVo.setCustRcgnPathCd("1");		//고객식별경로코드(고정) : 1
								paramVo.setCustRcgnCd("1");			//고객식별코드(고정) : 1
								paramVo.setDpchNo(dpchNo);
								paramVo.setSndgCtt(sndgCtt);
								paramVo.setSndgRsvSqnc(sndgRsvSqnc);
								paramVo.setSndgRsvDt(sndgRsvDt);
								paramVo.setSndgRsvTm(sndgRsvTm);
		        				paramVo.setCustId(custId);
		        				paramVo.setCustNm(AES256Crypt.encrypt(custNm));
		        				paramVo.setCustNmSrchkey1(AES256Crypt.encrypt(String.valueOf(custNmSrchkey1)));
		        				paramVo.setCustNmSrchkey2(AES256Crypt.encrypt(String.valueOf(custNmSrchkey2)));
		        				paramVo.setRecvrTelCntyCd(recvrTelCntyCd);
		        				paramVo.setRecvrTelNo(AES256Crypt.encrypt(recvrTelNo));
		        				paramVo.setRecvrTelNoSrchkey(AES256Crypt.encrypt(String.valueOf(recvrTelNoSrchkey)));
		        				paramVo.setAgelrgCd(agelrgCd);
		        				paramVo.setGndrCd(gndrCd);
		        				
		        				//kw---20230421 : sms 다건 발송 - 파일불러오기 할 때 첨부파일 집어넣기
		        				paramVo.setApndFileIdxNm1(apndFileIdxNm1);
		        				paramVo.setApndFileIdxNm2(apndFileIdxNm2);
		        				paramVo.setApndFileIdxNm3(apndFileIdxNm3);
		        				paramVo.setApndFileNm1(apndFileNm1);
		        				paramVo.setApndFileNm2(apndFileNm2);
		        				paramVo.setApndFileNm3(apndFileNm3);
		        				paramVo.setApndFilePsn1(apndFilePsn1);
		        				paramVo.setApndFilePsn2(apndFilePsn2);
		        				paramVo.setApndFilePsn3(apndFilePsn3);
		        				//kw-----------------------------------------------------
		        				
	        					targetList.add(paramVo);							}
	        			}
	        		}
	        		proCnt = targetList.size();
	        		//처리 시작
	        		if(proCnt > 0) {

						for(SYSM434VO vo : targetList) {
							result += sysm434Service.SYSM434INS05(vo);
						}

	        			//result = sysm434Service.SYSM434INS03(targetList);
	        		}
	        	}
	        }

			if(proCnt > result){
				//성공했지만 필터에 걸린 인원이있음.
	        	resultMap.put("msg", messageSource.getMessage("SYSM434M.method.reg.file.fail2", null, "SYSM434M.method.reg.file.fail2", locale));

	        	resultStr = this.objectMapper.writeValueAsString(resultMap);
			}else if(proCnt == 0){
				//실패
	        	resultMap.put("msg", messageSource.getMessage("SYSM434M.method.reg.file.fail", null, "SYSM434M.method.reg.file.fail", locale));

	        	resultStr = this.objectMapper.writeValueAsString(resultMap);
			}else{
				//성공
	        	resultMap.put("msg", messageSource.getMessage("SYSM434M.method.reg.file.success", null, "SYSM434M.method.reg.file.success", locale));

	        	resultStr = this.objectMapper.writeValueAsString(resultMap);
			}
		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}
		
		return ResponseEntity.ok().body(resultStr);
	}
	
	/**
	  * @Method Name : SYSM434SEL07
	  * @작성일 : 2023. 03. 05
	  * @작성자 : jypark
	  * @변경이력 : 
	  * @Method 설명 : 발송고객 추가
	  * @param :
	  * @return :
	  */
	@PostMapping(value ="/SYSM434INS04")
	@ResponseBody
	public ResponseEntity<String> SYSM434INS04(@RequestBody String request, Locale locale) {
		
		HashMap<String, Object> resultMap = new HashMap<String, Object>();
		String resultStr = null;
		
		try {
			JSONParser parser1 = new JSONParser();
			JSONObject obj = (JSONObject) parser1.parse(request);
			
			JSONArray listArray = (JSONArray) obj.get("list");
			
			// VO를 List로 변환
			List<SYSM434VO> list = new ArrayList<SYSM434VO>();
	        for (Object item : listArray) {
	            SYSM434VO vo = this.objectMapper.convertValue(item, SYSM434VO.class);
	            list.add(vo);
	        }
			
			Integer rtn = sysm434Service.SYSM434INS04(list);
			
			if (rtn > 0) {
				resultMap.put("msg", messageSource.getMessage("success.request.msg", null, "success.request.msg", locale));
			}
			
			resultStr = this.objectMapper.writeValueAsString(resultMap);
			
		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}
		return ResponseEntity.ok().body(resultStr);
	}
	
	
	/**
	  * @Method Name : SYSM434UPT01
	  * @작성일 : 2022. 11. 24
	  * @작성자 : sjyang
	  * @변경이력 : 
	  * @Method 설명 : 발송 스케쥴 업데이트
	  * @param :
	  * @return :
	  */
	
	@PostMapping(value ="/SYSM434UPT01")
	@ResponseBody
	public ResponseEntity<String> SYSM434UPT01(@RequestBody String request, Locale locale) {

		String resultStr = null;
		HashMap<String, Object> resultMap = new HashMap<String, Object>();
		
		String result = "fail";
		String msg = messageSource.getMessage("fail.common.msg", null, "fail.common.msg", locale);
		
		try {
			JSONParser parser1 = new JSONParser();
			JSONObject obj = (JSONObject) parser1.parse(request);
			
			JSONArray listArray = (JSONArray) obj.get("list");
			
			// VO를 List로 변환
			List<SYSM434VO> list = new ArrayList<SYSM434VO>();
	        for (Object item : listArray) {
	            SYSM434VO vo = this.objectMapper.convertValue(item, SYSM434VO.class);
	            list.add(vo);
	        }
			
			int rtn = sysm434Service.SYSM434UPT01(list);

			if (rtn > 0) {
				msg = messageSource.getMessage("success.common.save", null, "success.common.save", locale); //"정상적으로 저장되었습니다.";
				result = "success";
			}
			
			resultMap.put("result", result);
			resultMap.put("msg", msg);
			
			resultStr = this.objectMapper.writeValueAsString(resultMap);
			
		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}
		
		
		
		return ResponseEntity.ok().body(resultStr);
	}
	

	/**
	  * @Method Name : SYSM434UPT0201
	  * @작성일 : 2022. 12. 1
	  * @작성자 : sjyang
	  * @변경이력 : 
	  * @Method 설명 : 발송 차수 예약완료 처리
	  * @param : 
	  * @return :
	  */
	
	@PostMapping(value ="/SYSM434UPT0201")
	@ResponseBody
	public ResponseEntity<String> SYSM434UPT0201(@RequestBody String request, Locale locale) {

		String resultStr = null;
		HashMap<String, Object> resultMap = new HashMap<String, Object>();
		
		String result = "fail";
		String msg = messageSource.getMessage("fail.common.msg", null, "fail.common.msg", locale);
		
		try {
			JSONParser parser1 = new JSONParser();
			JSONObject obj = (JSONObject) parser1.parse(request);
			
			JSONArray listArray = (JSONArray) obj.get("list");
			
			// VO를 List로 변환
			List<SYSM434VO> list = new ArrayList<SYSM434VO>();
	        for (Object item : listArray) {
	            SYSM434VO vo = this.objectMapper.convertValue(item, SYSM434VO.class);
	            list.add(vo);
	        }
			
			int rtn = sysm434Service.SYSM434UPT0201(list);

			if (rtn > 0) {
				msg = messageSource.getMessage("success.request.msg", null, "success.request.msg", locale);	//"정상적으로 처리되었습니다.";	
				result = "success";
			}
			
			resultMap.put("result", result);
			resultMap.put("msg", msg);
			
			resultStr = this.objectMapper.writeValueAsString(resultMap);
			
		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}
		
		return ResponseEntity.ok().body(resultStr);
	}
	
	/**
	  * @Method Name : SYSM434UPT0202
	  * @작성일 : 2022. 12. 6
	  * @작성자 : sjyang
	  * @변경이력 :  
	  * @Method 설명 : 발송 차수 발송 취소
	  * @param :
	  * @return :
	  */
	
	@PostMapping(value ="/SYSM434UPT0202")
	@ResponseBody
	public ResponseEntity<String> SYSM434UPT0202(@RequestBody String request, Locale locale) {
		
		String resultStr = null;
		HashMap<String, Object> resultMap = new HashMap<String, Object>();
		
		String result = "fail";
		String msg = messageSource.getMessage("fail.common.msg", null, "fail.common.msg", locale);
		
		try {
			
			JSONParser parser1 = new JSONParser();
			JSONObject obj = (JSONObject) parser1.parse(request);
			
			JSONArray listArray = (JSONArray) obj.get("list");
			
			// VO를 List로 변환
			List<SYSM434VO> list = new ArrayList<SYSM434VO>();
	        for (Object item : listArray) {
	            SYSM434VO vo = this.objectMapper.convertValue(item, SYSM434VO.class);
	            list.add(vo);
	        }
			
			if (list.size() > 0) {
				//발송 중인 차수가 존재하는지 확인
				int totCnt = sysm434Service.SYSM434SEL0302(list.get(0));
				
				if(totCnt > 0) {
					result = "fail";
					msg = messageSource.getMessage("SYSM434M.method.include.step", null, "SYSM434M.method.include.step", locale);
				} else {
					int rtn = sysm434Service.SYSM434UPT0202(list);

					if (rtn > 0) {
						result = "success";
						msg = messageSource.getMessage("SYSM434M.method.cancle.send.success", null, "SYSM434M.method.cancle.send.success", locale);
					}					
				}
			}
			
			resultMap.put("result", result);
			resultMap.put("msg", msg);
			
			resultStr = this.objectMapper.writeValueAsString(resultMap);
			
		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
			e.printStackTrace();
		}
		
		return ResponseEntity.ok().body(resultStr);
	}
	
	/**
	  * @Method Name : SYSM434UPT0203
	  * @작성일 : 2022. 12. 6
	  * @작성자 : sjyang
	  * @변경이력 : 
	  * @Method 설명 : 발송 차수 삭제
	  * @param :
	  * @return :
	  */
	@PostMapping(value ="/SYSM434UPT0203")
	@ResponseBody
	public ResponseEntity<String> SYSM434UPT0203(@RequestBody String request, Locale locale) {
	
		String resultStr = null;
		HashMap<String, Object> resultMap = new HashMap<String, Object>();
		
		String result = "fail";
		String msg = messageSource.getMessage("fail.common.msg", null, "fail.common.msg", locale);
		
		try {
			
			JSONParser parser1 = new JSONParser();
			JSONObject obj = (JSONObject) parser1.parse(request);
			
			JSONArray listArray = (JSONArray) obj.get("list");
			
			// VO를 List로 변환
			List<SYSM434VO> list = new ArrayList<SYSM434VO>();
	        for (Object item : listArray) {
	            SYSM434VO vo = this.objectMapper.convertValue(item, SYSM434VO.class);
	            list.add(vo);
	        }
			
			if(list.size() > 0) {
				
				//발송 중인 차수가 존재하는지 확인
				int totCnt = sysm434Service.SYSM434SEL0302(list.get(0));
				
				if(totCnt > 0) {
					
					result = "fail";
					msg = messageSource.getMessage("SYSM434M.method.include.step", null, "SYSM434M.method.include.step", locale);
					
				} else {
					
					int rtn = sysm434Service.SYSM434UPT0203(list);

					if (rtn > 0) {
						result = "success";
						msg = messageSource.getMessage("success.common.delete", null, "success.common.delete", locale);
					}
				}
			}
			
			resultMap.put("result", result);
			resultMap.put("msg", msg);
			
			resultStr = this.objectMapper.writeValueAsString(resultMap);
			
		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}
		
		return ResponseEntity.ok().body(resultStr);
	}
	
	/**
	  * @Method Name : SYSM434UPT0204
	  * @작성일 : 2022. 12. 6
	  * @작성자 : sjyang
	  * @변경이력 : 
	  * @Method 설명 : 발송 차수 정보 수정
	  * @param :
	  * @return :
	  */
	
	@PostMapping(value ="/SYSM434UPT0204")
	@ResponseBody
	public ResponseEntity<String> SYSM434UPT0204(@RequestBody String request, Locale locale) {

		String resultStr = null;
		HashMap<String, Object> resultMap = new HashMap<String, Object>();
		
		String result = "fail";
		String msg = messageSource.getMessage("fail.common.msg", null, "fail.common.msg", locale);
		
		try {
			
			JSONParser parser1 = new JSONParser();
			JSONObject obj = (JSONObject) parser1.parse(request);
			
			JSONArray listArray = (JSONArray) obj.get("list");
			
			// VO를 List로 변환
			List<SYSM434VO> list = new ArrayList<SYSM434VO>();
	        for (Object item : listArray) {
	            SYSM434VO vo = this.objectMapper.convertValue(item, SYSM434VO.class);
	            list.add(vo);
	        }
			
			if(list.size() > 0) {
				
				int totCnt = sysm434Service.SYSM434SEL0302(list.get(0));
				
				if(totCnt > 0) {
					msg = messageSource.getMessage("SYSM434M.method.include.step", null, "SYSM434M.method.include.step", locale);
					result = "fail";
				} else {
					int rtn = sysm434Service.SYSM434UPT0209(list);

					if (rtn > 0) {
						msg = messageSource.getMessage("success.common.save", null, "success.common.save", locale);
						result = "success";
					}					
				}
			}
			
			resultMap.put("result", result);
			resultMap.put("msg", msg);
			
			resultStr = this.objectMapper.writeValueAsString(resultMap);
			
		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}
		
		return ResponseEntity.ok().body(resultStr);
	}
	
	/**
	  * @Method Name : SYSM434UPT0301
	  * @작성일 : 2022. 12. 6
	  * @작성자 : sjyang
	  * @변경이력 : 
	  * @Method 설명 :발송고객 적재 처리
	  * @param :
	  * @return :
	  */
	@PostMapping(value ="/SYSM434UPT0301")
	@ResponseBody
	public ResponseEntity<String> SYSM434UPT0301(@RequestBody String request, Locale locale) {
		
		HashMap<String, Object> resultMap = new HashMap<String, Object>();
		String resultStr = null;
		
		int resultCnt = 0;
		String result = "fail";
		String msg = messageSource.getMessage("fail.common.msg", null, "fail.common.msg", locale);
		
		try {
			
			SYSM434VO sysm434vo = new SYSM434VO();
			
			JSONParser parser1 = new JSONParser();
			JSONObject obj = (JSONObject) parser1.parse(request);
			
			sysm434vo.setTenantId(StringUtil.nullToBlank(obj.get("tenantId")));
			sysm434vo.setRegDt(StringUtil.nullToBlank(obj.get("regDt")));
			sysm434vo.setSchdNo(Integer.parseInt(obj.get("schdNo").toString()));
			sysm434vo.setSmsStCd(StringUtil.nullToBlank(obj.get("smsStCd")));
			sysm434vo.setLstCorprId(StringUtil.nullToBlank(obj.get("lstCorprId")));
			sysm434vo.setLstCorprOrgCd(StringUtil.nullToBlank(obj.get("lstCorprOrgCd")));
			
			int rtn = sysm434Service.SYSM434UPT0301(sysm434vo);
			
			//적재가 완료 되면 발송 스케쥴의 상태를 적재 상태로 처리한다.
			if(rtn > 0) {
				sysm434vo.setProcStCd("2");
				resultCnt = sysm434Service.SYSM434UPT0103(sysm434vo);
			}			
			
			if (resultCnt > 0) {
				msg = messageSource.getMessage("SYSM434M.method.loading.complete", null, "SYSM434M.method.loading.complete", locale);
				result = "success";
			}
			
			resultMap.put("result", result);
			resultMap.put("msg", msg);
			
			resultStr = this.objectMapper.writeValueAsString(resultMap);
			
		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}
		
		return ResponseEntity.ok().body(resultStr);
	}
	
	

	/**
	  * @Method Name : SYSM434UPT03
	  * @작성일 : 2022. 11. 28
	  * @작성자 : sjyang
	  * @변경이력 : 
	  * @Method 설명 : 발송고객 상태변경 : 1:적재 / 4:발송취소
	  * @param :
	  * @return :
	  */
	@PostMapping(value ="/SYSM434UPT0302")
	@ResponseBody
	public ResponseEntity<String> SYSM434UPT0302(@RequestBody String request, Locale locale) {
	
		HashMap<String, Object> resultMap = new HashMap<String, Object>();
		String resultStr = null;
		
		String result = "fail";
		String msg = messageSource.getMessage("fail.common.msg", null, "fail.common.msg", locale);
		
		try {
			JSONParser parser1 = new JSONParser();
			JSONObject obj = (JSONObject) parser1.parse(request);
			
			JSONArray listArray = (JSONArray) obj.get("list");
			
			// VO를 List로 변환
			List<SYSM434VO> list = new ArrayList<SYSM434VO>();
	        for (Object item : listArray) {
	            SYSM434VO vo = this.objectMapper.convertValue(item, SYSM434VO.class);
	            list.add(vo);
	        }
			
			if(list.size()>0) {
				int totCnt = sysm434Service.SYSM434SEL0302(list.get(0));
				if(totCnt > 0) {
					msg = messageSource.getMessage("SYSM434M.method.include.user", null, "SYSM434M.method.include.user", locale);
					result = "fail";
				} else {
					int rtn = sysm434Service.SYSM434UPT0302(list);
					
					if (rtn > 0) {
						msg = messageSource.getMessage("SYSM434M.method.sending.success", null, "SYSM434M.method.sending.success", locale);
						result = "success";
					}
				}
			}
			
			resultMap.put("result", result);
			resultMap.put("msg", msg);
			
			resultStr = this.objectMapper.writeValueAsString(resultMap);
			
		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}
		
		return ResponseEntity.ok().body(resultStr);
	}	
	
	/**
	  * @Method Name : SYSM434UPT0102
	  * @작성일 : 2022. 11. 24
	  * @작성자 : sjyang
	  * @변경이력 : 
	  * @Method 설명 : 발송 스케쥴 상태 변경 공통 (예약완료/발송취소)
	  * @param :
	  * @return :
	  */
	
	@PostMapping(value ="/SYSM434UPT0102")
	@ResponseBody
	public ResponseEntity<String> SYSM434UPT0102(@RequestBody String request, Locale locale) {
	
		HashMap<String, Object> resultMap = new HashMap<String, Object>();
		String resultStr = null;
		
		String result = "fail";
		String msg = messageSource.getMessage("fail.common.msg", null, "fail.common.msg", locale);
		
		try {
			JSONParser parser1 = new JSONParser();
			JSONObject obj = (JSONObject) parser1.parse(request);
			
			JSONArray listArray = (JSONArray) obj.get("list");
			
			// VO를 List로 변환
			List<SYSM434VO> list = new ArrayList<SYSM434VO>();
	        for (Object item : listArray) {
	            SYSM434VO vo = this.objectMapper.convertValue(item, SYSM434VO.class);
	            list.add(vo);
	        }
			
			int rtn = sysm434Service.SYSM434UPT0102(list);

			if (rtn > 0) {
				result = "success";
				msg = messageSource.getMessage("SYSM434M.method.sending.cancle.success", null, "SYSM434M.method.sending.cancle.success", locale);
			}
			
			resultMap.put("result", result);
			resultMap.put("msg", msg);
			
			resultStr = this.objectMapper.writeValueAsString(resultMap);
			
		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}
		
		return ResponseEntity.ok().body(resultStr);
	}
	
	/**
	  * @Method Name : SYSM434DEL01
	  * @작성일 : 2022. 11. 24
	  * @작성자 : sjyang
	  * @변경이력 : 
	  * @Method 설명 : 발송 스케쥴 삭제
	  * @param :
	  * @return :
	  */
	@PostMapping(value ="/SYSM434DEL01")
	@ResponseBody
	public ResponseEntity<String> SYSM434DEL01(@RequestBody String request, Locale locale) {
		
		HashMap<String, Object> resultMap = new HashMap<String, Object>();
		String resultStr = null;
		
		String result = "fail";
		String msg = messageSource.getMessage("fail.common.msg", null, "fail.common.msg", locale);
		
		try {
			JSONParser parser1 = new JSONParser();
			JSONObject obj = (JSONObject) parser1.parse(request);
			
			JSONArray listArray = (JSONArray) obj.get("list");
			
			// VO를 List로 변환
			List<SYSM434VO> list = new ArrayList<SYSM434VO>();
	        for (Object item : listArray) {
	            SYSM434VO vo = this.objectMapper.convertValue(item, SYSM434VO.class);
	            list.add(vo);
	        }
			
			int rtn = sysm434Service.SYSM434DEL01(list);

			if (rtn > 0) {
				msg = messageSource.getMessage("SYSM434M.method.schedule.delete.success", null, "SYSM434M.method.schedule.delete.success", locale);	
				result = "success";
			}
			
			resultMap.put("result", result);
			resultMap.put("msg", msg);
			
			resultStr = this.objectMapper.writeValueAsString(resultMap);
			
		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}
		
		return ResponseEntity.ok().body(resultStr);
	}
	
	/**
	  * @Method Name : SYSM434DEL03
	  * @작성일 : 2022. 11. 28
	  * @작성자 : sjyang
	  * @변경이력 : 
	  * @Method 설명 : 발송고객 삭제
	  * @param :
	  * @return :
	  */
	@PostMapping(value ="/SYSM434DEL03")
	@ResponseBody
	public ResponseEntity<String> SYSM434DEL03(@RequestBody String request, Locale locale) {
		
		HashMap<String, Object> resultMap = new HashMap<String, Object>();
		String resultStr = null;
		
		String result = "fail";
		String msg = messageSource.getMessage("fail.common.msg", null, "fail.common.msg", locale);
		try {
			
			JSONParser parser1 = new JSONParser();
			JSONObject obj = (JSONObject) parser1.parse(request);
			
			JSONArray listArray = (JSONArray) obj.get("list");
			
			// VO를 List로 변환
			List<SYSM434VO> list = new ArrayList<SYSM434VO>();
	        for (Object item : listArray) {
	            SYSM434VO vo = this.objectMapper.convertValue(item, SYSM434VO.class);
	            list.add(vo);
	        }
			
			if(list.size() > 0) {
				
				int totCnt = sysm434Service.SYSM434SEL0302(list.get(0));
				
				if(totCnt > 0) {
					msg = messageSource.getMessage("SYSM434M.method.include.user", null, "SYSM434M.method.include.user", locale);
					result = "fail";
					
				} else {
					int rtn = sysm434Service.SYSM434DEL03(list);

					if (rtn > 0) {
						msg = messageSource.getMessage("success.common.delete", null, "success.common.delete", locale);
						result = "success";
					}					
				}
			}
			
			resultMap.put("result", result);
			resultMap.put("msg", msg);
			
			resultStr = this.objectMapper.writeValueAsString(resultMap);

		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}
		
		return ResponseEntity.ok().body(resultStr);
	}
	
}
