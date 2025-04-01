package org.crm.cmmt.web;

import org.crm.cmmt.VO.CMMT400VO;
import org.crm.cmmt.VO.CMMT440VO;
import org.crm.cmmt.service.CMMT440Service;
import org.crm.comm.VO.COMM120VO;
import org.crm.config.spring.config.PropertiesService;
import org.crm.util.com.ComnFun;
import org.crm.util.crypto.AES256Crypt;
import org.crm.util.file.FileUtils;
import org.crm.util.json.JsonUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.support.SessionStatus;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.servlet.ModelAndView;

import jakarta.annotation.Resource;
import java.io.File;
import java.util.*;

/***********************************************************************************************
* Program Name : 일정상세 팝업 Controller
* Creator      : 김보영
* Create Date  : 2022.01.10
* Description  : 일정상세팝업
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.01.10    김보영           최초생성
************************************************************************************************/
@Slf4j
@Controller
@RequestMapping("/cmmt/*")
public class CMMT440Controller {

	@Resource(name = "CMMT440Service")
	private CMMT440Service CMMT440Service;

	@Autowired
	private MessageSource messageSource;
	
	@Autowired
	private ObjectMapper objectMapper;
	
	@Autowired
	private PropertiesService propertiesService;

	private static final Logger LOGGER = LoggerFactory.getLogger(CMMT440Controller.class);

	
	/**
	 * @Method Name : CMMT440P
	 * @작성일      : 2022.01.10
	 * @작성자      : bykim
	 * @변경이력    : 
	 * @Method 설명 : CMMT/CMMT440P 웹 페이지 열기
	 * @param       :  
	 * @return      : CMMT/CMMT440P.jsp 
	 */	
	@RequestMapping("/CMMT440P")
	public String CMMT440M() {
		LOGGER.info("CMMT440P 페이지 열기");
		return "th/cmmt/CMMT440P";
	}	
	
	
	/**
	 * @Method Name : CMMT440SEL01
	 * @작성일      : 2022.01.10
	 * @작성자      : bykim
	 * @변경이력    : 
	 * @Method 설명 : 일정상세 조회
	 * @param       : HttpServletRequest Restful param
	 * @return      : ModelAndView HashMap
	 */    
	@RequestMapping(value ="/CMMT440SEL01", method = RequestMethod.POST)
	@ResponseBody    
	public Map<String,Object> CMMT440SEL01(@RequestBody String req){
		HashMap<String, Object> hashMap = new HashMap<String, Object>();
		try {
			ComnFun cf = new ComnFun();
			CMMT400VO vo = this.objectMapper.readValue(req , CMMT400VO.class);
			CMMT400VO CMMT400VOInfo = CMMT440Service.CMMT440SEL01(vo);
			
			CMMT400VOInfo.setSrchDtFrom(CMMT400VOInfo.getSchdStrDd()+" "+CMMT400VOInfo.getSchdStrSi()+":"+CMMT400VOInfo.getSchdStrPt());
			CMMT400VOInfo.setSrchDtTo(CMMT400VOInfo.getSchdEndDd()+" "+CMMT400VOInfo.getSchdEndSi()+":"+CMMT400VOInfo.getSchdEndPt());
			
			if(!cf.isStringEmpty(CMMT400VOInfo.getUserNm())) {
				CMMT400VOInfo.setUserNm(AES256Crypt.decrypt(CMMT400VOInfo.getUserNm()));
			}

			List<CMMT440VO> CMMT440VOInfo2 = CMMT440Service.CMMT440SEL02(vo);
			
			for(CMMT440VO vo2 : CMMT440VOInfo2) {
				if(!cf.isStringEmpty(vo2.getDecUsrNm())) {
					vo2.setDecUsrNm(AES256Crypt.decrypt(vo2.getDecUsrNm()));
				}
			}
			
			if(CMMT440VOInfo2 != null) {
				CMMT400VOInfo.setCMMT400VOList(CMMT440VOInfo2);
			}
			
			List<CMMT440VO> CMMT440VOInfo3 = CMMT440Service.CMMT440SEL04(vo);
			
			CMMT400VOInfo.setCMMT400FileList(CMMT440VOInfo3);
			
			ObjectMapper mapper = new ObjectMapper();
			String json = mapper.writeValueAsString(CMMT400VOInfo);
			           
			LOGGER.info("CMMT440M 페이지 열기  : "+json);

			hashMap.put("CMMT440VOInfo", json);

		}catch(Exception e) {
			LOGGER.error("["+e.getClass()+"] Exception : " + e.getMessage());
		}
		return hashMap;
	}
	
	

	/**
	 * @Method Name : CMMT440SEL02
	 * @작성일      : 2022.01.10
	 * @작성자      : bykim
	 * @변경이력    : 
	 * @Method 설명 : 일정 첨부파일 다운로드
	 * @param       : HttpServletRequest Restful param
	 * @return      : ModelAndView HashMap
	 */    
	@RequestMapping(value ="/CMMT440SEL02")
	@ResponseBody    
	public Map<String,Object> CMMT440SEL02(@RequestParam HashMap<Object, Object> params, ModelAndView mav) {
		HashMap<String, Object> hashMap = new HashMap<String, Object>();
	    try {	
	    	File file = FileUtils.downloadFileInfo(params);
			hashMap.put("downloadFile" , file);
		}catch(Exception e) {
			LOGGER.error("["+e.getClass()+"] Exception : " + e.getMessage());
		}   
	    return hashMap;
	}

	
	/**
	 * @Method Name : CMMT440INS01
	 * @작성일      : 2022.01.10
	 * @작성자      : bykim
	 * @변경이력    : 
	 * @Method 설명 : 일정 신규등록
	 * @param       : HttpServletRequest Restful param
	 * @return      : ModelAndView HashMap
	 */
	@RequestMapping(value ="/CMMT440INS01", method = RequestMethod.POST)
	@ResponseBody
	public Map<String,Object> CMMT440INS01(Locale locale, ModelAndView mav, MultipartHttpServletRequest mpfRequest,@RequestParam("CMMT440P_data") String jsonData) {
		HashMap<String, Object> hashMap = new HashMap<String, Object>();
		try {
			JSONObject obj = this.objectMapper.readValue(jsonData , JSONObject.class);


			CMMT400VO vo = new CMMT400VO();
			ComnFun cf = new ComnFun();
			
			vo.setTenantId(String.valueOf(obj.get("tenantId")));
			vo.setRegYr(String.valueOf(obj.get("regYr")));
			vo.setUsrId(String.valueOf(obj.get("regrId")));
			
			vo.setRegrId(String.valueOf(obj.get("regrId")));
			vo.setRegrOrgCd(String.valueOf(obj.get("regrOrgCd")));
			vo.setLstCorprId(String.valueOf(obj.get("lstCorprId")));
			vo.setLstCorprOrgCd(String.valueOf(obj.get("lstCorprOrgCd")));
			
			vo.setSchdTypCd(String.valueOf(obj.get("schdTypCd")));
			vo.setSchdDvCd(cf.isStringEmpty(String.valueOf(obj.get("schdDvCd")))? null : String.valueOf(obj.get("schdDvCd")));
			vo.setAlrmStCd(String.valueOf(obj.get("alrmStCd")));
			vo.setSchdTite(String.valueOf(obj.get("schdTite")));
			vo.setSchdCtt(String.valueOf(obj.get("schdCtt")));
			
			String schdStr = String.valueOf(obj.get("srchDtFrom"));
			String[] stTime = schdStr.substring(11).split(":");
			vo.setSchdStrDd( schdStr.substring(0, 10).replaceAll("-", ""));
			vo.setSchdStrSi(stTime[0]);
			vo.setSchdStrPt(stTime[1]);
			
			String schdEnd = String.valueOf(obj.get("srchDtTo"));
			String[] Entime = schdEnd.substring(11).split(":");
			vo.setSchdEndDd(schdEnd.substring(0, 10).replaceAll("-", ""));
			vo.setSchdEndSi(Entime[0]);
			vo.setSchdEndPt(Entime[1]);
			vo.setAlrmStgupCd(String.valueOf(obj.get("alrmStgupCd")));
			
			// 일정 예약(1)/알림(2)/해제(3)
			//if stcd == 2 일때 알림 데이터 집어넣기 + 알림 확인 여부 테이블에 넣기
			if(!cf.isStringEmpty(String.valueOf(obj.get("alrmStgupCd"))) && !String.valueOf(obj.get("alrmStgupCd")).equals("10")){
				vo.setAlrmDd(schdStr.substring(0, 10).replaceAll("-", ""));
				vo.setAlrmSi(Entime[0]);
				vo.setAlrmPt(Entime[1]);
				vo.setAlrmGapDvCd(String.valueOf(obj.get("alrmGapDvCd")));
				vo.setAlrmStCd(String.valueOf(obj.get("alrmStCd")));
				if(!cf.isStringEmpty(String.valueOf(obj.get("alrmTcnt")))) {
					vo.setAlrmTcnt(Integer.parseInt(String.valueOf(obj.get("alrmTcnt"))));
				}
			}
			
			//일정관리 insert
			int rtn = CMMT440Service.CMMT440INS01(vo);
			vo.setSchdNo(rtn);
			
			Object CMMT400VOList = obj.get("CMMT400VOList");
   	 		JSONArray jsonArray = new JSONArray();
			if (CMMT400VOList instanceof List) {
			    List<?> tempList = (List<?>) CMMT400VOList;
			    jsonArray.addAll(tempList);  // List를 JSONArray로 변환

			}
			List<CMMT440VO> list = new ArrayList<CMMT440VO>();
			
			for(int i=0; i<jsonArray.size(); i++){
//				JSONObject jsonObject = (JSONObject) jsonArray.get(i);
				Map<String, Object> jsonObject = (Map<String, Object>) jsonArray.get(i);
				CMMT440VO vo2 = new CMMT440VO();
				
				vo2.setTenantId(String.valueOf(obj.get("tenantId")));
				vo2.setSchdNo(rtn);
				vo2.setRegYr(String.valueOf(obj.get("regYr")));
				
				vo2.setSchdJnownCd(String.valueOf(jsonObject.get("schdJnownCd")));
				vo2.setSchdJnownDvCd(String.valueOf(jsonObject.get("schdJnownDvCd")));
				
				vo2.setRegrId(String.valueOf(obj.get("regrId")));
				vo2.setRegrOrgCd(String.valueOf(obj.get("regrOrgCd")));
				vo2.setLstCorprId(String.valueOf(obj.get("lstCorprId")));
				vo2.setLstCorprOrgCd(String.valueOf(obj.get("lstCorprOrgCd")));

				vo2.setAlrmStgupCd(String.valueOf(obj.get("alrmStgupCd")));
				list.add(vo2);
			}
			
			//첨부파일 업로드
			String uploadPath     = propertiesService.getString("SCHD"); 
			List<MultipartFile> fileList = mpfRequest.getFiles("CMMT440P_file");
			
			List<COMM120VO> comm120List = new ArrayList<COMM120VO>();
			comm120List=FileUtils.uploadPreJob(uploadPath, obj, fileList);
			
			List<CMMT440VO> cmmt440List = new ArrayList<CMMT440VO>();
			
			for(COMM120VO vo120 : comm120List) {
				CMMT440VO vo440 = new CMMT440VO();
				vo440.setTenantId(vo.getTenantId());
				vo440.setRegYr(vo.getRegYr());
				vo440.setUsrId(vo.getRegrId());
				vo440.setSchdNo(vo.getSchdNo());
				vo440.setApndFileIdxNm(vo120.getApndFileIdxNm());
				vo440.setApndFileNm(vo120.getApndFileNm());
				vo440.setApndFilePsn(vo120.getApndFilePsn());
				vo440.setSchdFileSeq(vo120.getApndFileSeq());
				vo440.setRegrId(vo.getRegrId());
				vo440.setRegrOrgCd(vo.getRegrOrgCd());
				cmmt440List.add(vo440);
			}
			
			//첨부파일 insert
			CMMT440Service.CMMT440INS04(cmmt440List);
			
			if(list.size()>0) {
				//일정공유 insert
				CMMT440Service.CMMT440INS02(list);
			}
			
			ObjectMapper mapper = new ObjectMapper();
			String json = mapper.writeValueAsString(vo);
			           
			LOGGER.info("CMMT440M 페이지 열기  : "+json);

			hashMap.put("CMMT440VOInfo", json);
			mav.addAllObjects(hashMap);
			
			if(rtn > 0) {
				hashMap.put("result", rtn);
				hashMap.put("msg", messageSource.getMessage("success.common.insert", null, "success.common.insert", locale));
			}

		}catch(Exception e) {
			e.printStackTrace();
			LOGGER.error("["+e.getClass()+"] Exception : " + e.getMessage());
		}
		return hashMap;
	}
	
	/**
	 * @Method Name : CMMT440UPT01
	 * @작성일      : 2022.01.10
	 * @작성자      : bykim
	 * @변경이력    : 
	 * @Method 설명 :  일정 수정
	 * @param       : HttpServletRequest - json 배열   "list" :  [{id : "", name : ""},{id : "", name : ""}] 구조
	 * @return      : ModelAndView HashMap
	 */      
	@RequestMapping(value ="/CMMT440UPT01", method = RequestMethod.POST)
	@ResponseBody
	public Map<String,Object> CMMT440UPT01(Locale locale, ModelAndView mav, MultipartHttpServletRequest mpfRequest,@RequestParam("CMMT440P_data") String jsonData) {
			HashMap<String, Object> hashMap = new HashMap<String, Object>();
		try {
			JSONObject obj = JsonUtil.parseJSONString(jsonData);
			ComnFun cf = new ComnFun();
			CMMT400VO vo = new CMMT400VO();

			vo.setTenantId(String.valueOf(obj.get("tenantId")));
			vo.setRegYr(String.valueOf(obj.get("regYr")));
			vo.setSchdNo(Integer.parseInt(String.valueOf(obj.get("schdNo"))));
			vo.setUsrId(String.valueOf(obj.get("regrId")));
			
			vo.setSchdTypCd(String.valueOf(obj.get("schdTypCd")));
			vo.setSchdDvCd(cf.isStringEmpty(String.valueOf(obj.get("schdDvCd")))? null : String.valueOf(obj.get("schdDvCd")));
			vo.setAlrmStCd(String.valueOf(obj.get("alrmStCd")));
			vo.setSchdTite(String.valueOf(obj.get("schdTite")));
			vo.setSchdCtt(String.valueOf(obj.get("schdCtt")));
			
			String schdStr = String.valueOf(obj.get("srchDtFrom"));
			String[] stTime = schdStr.substring(11).split(":");
			vo.setSchdStrDd( schdStr.substring(0, 10).replaceAll("-", ""));
			vo.setSchdStrSi(stTime[0]);
			vo.setSchdStrPt(stTime[1]);
			vo.setAlrmStgupCd(String.valueOf(obj.get("alrmStgupCd")));
			
			String schdEnd = String.valueOf(obj.get("srchDtTo"));
			String[] Entime = schdEnd.substring(11).split(":");
			vo.setSchdEndDd(schdEnd.substring(0, 10).replaceAll("-", ""));
			vo.setSchdEndSi(Entime[0]);
			vo.setSchdEndPt(Entime[1]);
			
			vo.setLstCorprId(String.valueOf(obj.get("lstCorprId")));
			vo.setLstCorprOrgCd(String.valueOf(obj.get("lstCorprOrgCd")));

			// 일정 예약(1)/알림(2)/해제(3)
			//if stcd == 2 일때 알림 데이터 집어넣기 + 알림 확인 여부 테이블에 넣기
			if(!cf.isStringEmpty(String.valueOf(obj.get("alrmStgupCd"))) && !String.valueOf(obj.get("alrmStgupCd")).equals("10")){
				vo.setAlrmDd(schdStr.substring(0, 10).replaceAll("-", ""));
				vo.setAlrmSi(Entime[0]);
				vo.setAlrmPt(Entime[1]);
				vo.setAlrmGapDvCd(String.valueOf(obj.get("alrmGapDvCd")));
				vo.setAlrmStCd(String.valueOf(obj.get("alrmStCd")));
				if(!cf.isStringEmpty(String.valueOf(obj.get("alrmTcnt")))) {
					vo.setAlrmTcnt(Integer.parseInt(String.valueOf(obj.get("alrmTcnt"))));
				}
				
				vo.setRegrId(String.valueOf(obj.get("regrId")));
				vo.setRegrOrgCd(String.valueOf(obj.get("regrOrgCd")));
				
				List<CMMT400VO> alarmInfo = CMMT440Service.CMMT440SEL03(vo);
				 if (alarmInfo.size()>0){
					// 알람 update
					CMMT440Service.CMMT440UPT02(vo);
				}else {
					// 알람 insert
					CMMT440Service.CMMT440INS03(vo);
				}
			}else if(!cf.isStringEmpty(String.valueOf(obj.get("alrmStgupCd"))) && String.valueOf(obj.get("alrmStgupCd")).equals("10")){
				List<CMMT400VO> alarmInfo = CMMT440Service.CMMT440SEL03(vo);
				if (alarmInfo.size()>0){
					// 알람 delete
					CMMT440Service.CMMT440DEL03(vo);
				}
			}
			
			JSONArray jsonArray = (JSONArray) obj.get("CMMT400VOList");
			List<CMMT440VO> list = new ArrayList<CMMT440VO>();
			
			for(int i=0; i<jsonArray.size(); i++){
//				JSONObject jsonObject = (JSONObject) jsonArray.get(i);
				Map<String, Object> jsonObject = (Map<String, Object>) jsonArray.get(i);
				CMMT440VO vo2 = new CMMT440VO();
				
				vo2.setTenantId(String.valueOf(obj.get("tenantId")));
				vo2.setSchdNo(vo.getSchdNo());
				vo2.setRegYr(String.valueOf(obj.get("regYr")));
				
				vo2.setSchdJnownCd(String.valueOf(jsonObject.get("schdJnownCd")));
				vo2.setSchdJnownDvCd(String.valueOf(jsonObject.get("schdJnownDvCd"))); 
				
				vo2.setRegrId(String.valueOf(obj.get("regrId")));
				vo2.setRegrOrgCd(String.valueOf(obj.get("regrOrgCd")));
				vo2.setLstCorprId(String.valueOf(obj.get("lstCorprId")));
				vo2.setLstCorprOrgCd(String.valueOf(obj.get("lstCorprOrgCd")));
				vo2.setAlrmStgupCd(String.valueOf(obj.get("alrmStgupCd")));
				
				list.add(vo2);
				
			}
			
			// 일정관리 변경
			int rtn = CMMT440Service.CMMT440UPT01(vo);
			
			//첨부파일 업로드
			String uploadPath     = propertiesService.getString("SCHD"); 
			List<MultipartFile> fileList = mpfRequest.getFiles("CMMT440P_file");
			
			List<COMM120VO> comm120List = new ArrayList<COMM120VO>();
			comm120List=FileUtils.uploadPreJob(uploadPath, obj, fileList);
			
			List<CMMT440VO> cmmt440List = new ArrayList<CMMT440VO>();
			
			for(COMM120VO vo120 : comm120List) {
				CMMT440VO vo440 = new CMMT440VO();
				vo440.setTenantId(vo.getTenantId());
				vo440.setRegYr(vo.getRegYr());
				vo440.setUsrId(vo.getRegrId());
				vo440.setSchdNo(vo.getSchdNo());
				vo440.setApndFileIdxNm(vo120.getApndFileIdxNm());
				vo440.setApndFileNm(vo120.getApndFileNm());
				vo440.setApndFilePsn(vo120.getApndFilePsn());
				vo440.setSchdFileSeq(vo120.getApndFileSeq());
				vo440.setRegrId(vo.getRegrId());
				vo440.setRegrOrgCd(vo.getRegrOrgCd());
				cmmt440List.add(vo440);
			}
			
			//첨부파일 delete
			CMMT440Service.CMMT440DEL04(vo);
			//첨부파일 insert
			CMMT440Service.CMMT440INS04(cmmt440List);
			
			vo.setCMMT400FileList(cmmt440List);


			//일정공유 delete
			CMMT440Service.CMMT440DEL05(vo);
			CMMT440Service.CMMT440DEL02(vo);

			if(list.size()>0) {
				//일정공유 insert
				CMMT440Service.CMMT440INS02(list);
			}
		
		
			ObjectMapper mapper = new ObjectMapper();
			String json = mapper.writeValueAsString(vo);
			           
			LOGGER.info("CMMT440M 페이지 열기  : "+json);

			hashMap.put("CMMT440VOInfo", json);
			mav.addAllObjects(hashMap);

			if(rtn > 0) {
				hashMap.put("result", rtn);
				hashMap.put("msg", messageSource.getMessage("success.common.update", null, "success.common.update", locale));
			}
		}catch(Exception e) {
			LOGGER.error("["+e.getClass()+"] Exception : " + e.getMessage());
		}
		return hashMap;
	}
	
	/**
	 * @Method Name : CMMT440DEL01
	 * @작성일      : 2022.01.10
	 * @작성자      : bykim
	 * @변경이력    : 
	 * @Method 설명 : 일정 삭제
	 * @param       : HttpServletRequest Restful param
	 * @return      : ModelAndView HashMap
	 */     
	@RequestMapping(value ="/CMMT440DEL01", method = RequestMethod.POST)
	@ResponseBody  
	public Map<String,Object> CMMT440DEL01(@RequestBody String req , BindingResult bindingResult, Model model,
			SessionStatus status, Locale locale) {
			HashMap<String, Object> hashMap = new HashMap<String, Object>();
		try {
			CMMT400VO vo = this.objectMapper.readValue(req , CMMT400VO.class);
			List<CMMT440VO>  fileList = CMMT440Service.CMMT440SEL04(vo);
			// 파일삭제
			for(CMMT440VO vo3 : fileList) {
				File deleteFile = new File(vo3.getApndFilePsn() + "/" + vo3.getApndFileIdxNm());
				if (deleteFile.exists()) {
					try {
						FileUtils.removeFile(vo3.getApndFilePsn(), vo3.getApndFileIdxNm());
					} catch (Exception e) {
					}
				}
			}
			
			//첨부파일 delete
			CMMT440Service.CMMT440DEL04(vo);

			//알람 delete
			CMMT440Service.CMMT440DEL03(vo);
			
			//T_일정_공유_알람_확인_정보
			CMMT440Service.CMMT440DEL05(vo);
			
			//일정공유 delete
			CMMT440Service.CMMT440DEL02(vo);

			//일정 delete
			int rtn = CMMT440Service.CMMT440DEL01(vo);


			if(rtn > 0) {
				status.setComplete();
				hashMap.put("result", "Delete Success");
				hashMap.put("msg", messageSource.getMessage("success.common.delete", null, "success.common.delete", locale));
			}
		}catch(Exception e) {
			LOGGER.error("["+e.getClass()+"] Exception : " + e.getMessage());
		}
		return hashMap;
	}
	
}
