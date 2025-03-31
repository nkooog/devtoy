package org.crm.sysm.web;

import org.crm.lgin.VO.LGIN000VO;
import org.crm.lgin.service.LGIN000Service;
import org.crm.sysm.VO.SYSM510VO;
import org.crm.sysm.service.SYSM510Service;
import org.crm.util.crypto.AES256Crypt;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

/***********************************************************************************************
* Program Name : 테넌트기준정보구성 Controller
* Creator      : mhlee
* Create Date  : 2022.10.24
* Description  : 테넌트기준정보구성
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.10.24     mhlee           최초생성
************************************************************************************************/
@Slf4j
@Controller
@RequestMapping("/sysm/*")
public class SYSM510Controller {
	private static final Logger LOGGER = LoggerFactory.getLogger(SYSM510Controller.class);

	@Resource(name = "SYSM510Service")
	private SYSM510Service sysm510Service;

	@Resource(name = "LGIN000Service")
	private LGIN000Service lgin000Service;

	private ObjectMapper objectMapper;
	private MessageSource messageSource;

	@Autowired
	public SYSM510Controller(ObjectMapper objectMapper, MessageSource messageSource) {
		this.objectMapper = objectMapper;
		this.messageSource = messageSource;
	}

	@ResponseStatus(HttpStatus.BAD_REQUEST)
	public static class MissingHttpSessionException extends RuntimeException {
		public MissingHttpSessionException(String message) {
			super(message);
		}
	}

	@ResponseStatus(HttpStatus.BAD_REQUEST)
	public static class MissingUserStatusException extends RuntimeException {
		public MissingUserStatusException(String message) {
			super(message);
		}
	}

	/**
	 * @Method Name : SYSM500M
	 * @작성일      : 2022.10.24
	 * @작성자      : mhlee
	 * @변경이력    : 
	 * @Method 설명 : sysm/SYSM510M 웹 페이지 열기
	 * @param       :  
	 * @return      : sysm/SYSM500M.jsp
	 */
	@RequestMapping("/SYSM510M")
	public String SYSM510M() {
		log.debug("SYSM510M");
		return "th/sysm/SYSM510M";
	}

	/**
	 * @Method Name : SYSM510SEL01
	 * @작성일      : 2022.11.04
	 * @작성자      : mhlee
	 * @변경이력    :
	 * @Method 설명 : 테넌트기준정보구성 조회
	 * @param       : ModelAndView
	 * @return      : ModelAndView HashMap
	 */
	@PostMapping(value = "/SYSM510SEL01")
	@ResponseBody
	public Map<String, Object> SYSM510SEL01(ModelAndView mav, @RequestBody String req, Locale locale) {
		HashMap<String, Object> hashMap = new HashMap<String, Object>();
		try {
			List<SYSM510VO> list = sysm510Service.SYSM510SEL01(this.objectMapper.readValue(req, SYSM510VO.class));

			hashMap.put("list", this.objectMapper.writeValueAsString(list));
			hashMap.put("msg", this.messageSource.getMessage("success.common.select", null, "success select", locale));
		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}

		return hashMap;
	}

	/**
	 * @Method Name : SYSM510INS01
	 * @작성일      : 2022.11.04
	 * @작성자      : mhlee
	 * @변경이력    :
	 * @Method 설명 : 테넌트기준정보구성 기준정보(1단계) UPSERT
	 * @param       : ModelAndView
	 * @return      : ModelAndView HashMap
	 */
	@PostMapping(value = "/SYSM510INS01")
	@ResponseBody
	public Map<String, Object> SYSM510INS01(ModelAndView mav, HttpSession session, @RequestBody String req, Locale locale) {
		HashMap<String, Object> hashMap = new HashMap<String, Object>();
		JSONParser parser = new JSONParser();
		try {
			if (session.getAttribute("user") == null) {
				throw new MissingHttpSessionException("세션이 존재하지 않습니다.");
			}

			JSONObject jsonObject = (JSONObject) parser.parse(req);
			JSONArray jsonArray = (JSONArray) jsonObject.get("list");

			int rtn = sysm510Service.SYSM510INS01(this.objectMapper.convertValue(jsonArray, new TypeReference<List<SYSM510VO>>() {}));

			if (rtn > 0) {
				hashMap.put("msg", this.messageSource.getMessage("success.common.insert", null, "success insert", locale));
			} else {
				hashMap.put("msg", this.messageSource.getMessage("fail.request.msg", null, "fail", locale));
			}
		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}

		return hashMap;
	}
	
	/**
	  * @Method Name : SYSM510UPT02
	  * @작성일 : 2024. 2. 27
	  * @작성자 : sjyang
	  * @변경이력 : 
	  * @Method 설명 : 테넌트 기준정보 프리징/해제 처리
	  * @param :
	  * @return :
	  */
	@PostMapping(value = "/SYSM510UPT02")
	@ResponseBody
	public Map<String, Object> SYSM510UPT02(ModelAndView mav, HttpSession session, @RequestBody String req,  Locale locale) {
		HashMap<String, Object> hashMap = new HashMap<String, Object>();
		try {

			int rtn = sysm510Service.SYSM510UPT02(this.objectMapper.readValue(req, SYSM510VO.class));
			
			if (rtn > 0) {
				hashMap.put("msg", messageSource.getMessage("success.common.update", null, "success update", locale));
			} else {
				hashMap.put("msg", messageSource.getMessage("fail.common.update", null, "fail", locale));
			}
			

		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}
		
		mav.setViewName("jsonView");
		
		return hashMap;
	}
	

	/**
	 * @Method Name : SYSM510DEL01
	 * @작성일      : 2022.11.04
	 * @작성자      : mhlee
	 * @변경이력    :
	 * @Method 설명 : 테넌트기준정보구성 기준정보 일괄삭제
	 * @param       : ModelAndView
	 * @return      : ModelAndView HashMap
	 */
	@PostMapping(value = "/SYSM510DEL01")
	@ResponseBody
	public Map<String, Object> SYSM510DEL01(ModelAndView mav, @RequestBody String req, HttpSession session, Locale locale) {
		HashMap<String, Object> hashMap = new HashMap<String, Object>();
		JSONParser parser = new JSONParser();
		try {
			if (session.getAttribute("user") == null) {
				throw new MissingHttpSessionException("세션이 존재하지 않습니다.");
			}

			JSONObject jsonObject = (JSONObject) parser.parse(req);
			JSONArray jsonArray = (JSONArray) jsonObject.get("list");

			int rtn = sysm510Service.SYSM510DEL01(this.objectMapper.convertValue(jsonArray, new TypeReference<List<SYSM510VO>>() {}));

			if (rtn > 0) {
				hashMap.put("msg", messageSource.getMessage("success.common.delete", null, "success delete", locale));
			} else if (rtn == -1) {
				hashMap.put("msg", "BRD를 포함한 테넌트는 " + messageSource.getMessage("FRME260P.noPermission.msg", null, "fail", locale));
			} else {
				hashMap.put("msg", messageSource.getMessage("fail.request.msg", null, "fail", locale));
			}

		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}

		return hashMap;
	}

	/**
	 * @Method Name : SYSM510INS01
	 * @작성일      : 2022.11.04
	 * @작성자      : mhlee
	 * @변경이력    :
	 * @Method 설명 : 테넌트기준정보구성 기준정보(1단계) UPSERT
	 * @param       : ModelAndView
	 * @return      : ModelAndView HashMap
	 */
	@PostMapping(value = "/SYSM510CopyBasicData")
	@ResponseBody
	public Map<String, Object> SYSM510CopyBasicData(ModelAndView mav, HttpSession session, @RequestBody String req, Locale locale) {
		HashMap<String, Object> hashMap = new HashMap<>();
		JSONParser parser = new JSONParser();
		try {
			// 세션 체크
			if (session.getAttribute("user") == null) {
				throw new MissingHttpSessionException("세션이 존재하지 않습니다.");
			}

			JSONObject jsonObject = (JSONObject) parser.parse(req);
			JSONArray jsonArray = (JSONArray) jsonObject.get("list");

			int rtn = sysm510Service.SYSM510CopyBasicData(this.objectMapper.convertValue(jsonArray, new TypeReference<List<SYSM510VO>>() {}));
			if (rtn > 0) {
				hashMap.put("msg", messageSource.getMessage("success.common.insert", null, "success insert", locale));
			} else {
				hashMap.put("msg", messageSource.getMessage("fail.request.msg", null, "fail", locale));
			}
		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}
		return hashMap;
	}

	/**
	 * @Method Name : SYSM510UserCheck
	 * @작성일      : 2023.04.27
	 * @작성자      : mhlee
	 * @변경이력    :
	 * @Method 설명 : 테넌트기준정보구성 유저 정보 체크
	 * @param       : ModelAndView
	 * @return      : ModelAndView HashMap
	 */
	@PostMapping(value = "/SYSM510UserCheck")
	@ResponseBody
	public Map<String, Object> SYSM510UserCheck(ModelAndView mav, HttpSession session, @RequestBody String req, Locale locale) {
		HashMap<String, Object> hashMap = new HashMap<>();
		try {
			LGIN000VO lginVO = this.objectMapper.readValue(req, LGIN000VO.class);
			int checkCnt = lgin000Service.LGIN000SEL01(lginVO);
			if (checkCnt == 0) {
				throw new MissingUserStatusException("유저 정보가 존재하지 않습니다.");
			}
			LGIN000VO userInfo = lgin000Service.LGIN000SEL07(lginVO);
			String requestPW = lginVO.getScrtNo();
			String originPW = userInfo.getScrtNo();
			String decPassWd = AES256Crypt.encrypt(requestPW);
			if (!decPassWd.equals(originPW)) {
				throw new MissingUserStatusException("비밀번호가 일치하지 않습니다.");
			}
			hashMap.put("msg", messageSource.getMessage("success.common.select", null, "success", locale));
			hashMap.put("code", HttpStatus.OK.value());
		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}
		return hashMap;
	}

	@ExceptionHandler({MissingHttpSessionException.class, MissingUserStatusException.class})
	@ResponseStatus(HttpStatus.BAD_REQUEST)
	@ResponseBody
	public HashMap<String, Object> handleMissingException(Exception ex) {
		HashMap<String, Object> errorMap = new HashMap<>();
		errorMap.put("code", HttpStatus.BAD_REQUEST.value());
		if (ex instanceof MissingHttpSessionException) {
			errorMap.put("msg", ((MissingHttpSessionException) ex).getMessage());
		} else if (ex instanceof MissingUserStatusException) {
			errorMap.put("msg", ((MissingUserStatusException) ex).getMessage());
		} else {
			errorMap.put("msg", "예상치 못한 예외가 발생했습니다.");
		}
		return errorMap;
	}

}
