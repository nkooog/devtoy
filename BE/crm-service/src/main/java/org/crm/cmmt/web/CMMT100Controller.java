package org.crm.cmmt.web;

import org.crm.cmmt.VO.CMMT100VO;
import org.crm.cmmt.service.CMMT100Service;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
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

import jakarta.annotation.Resource;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

/***********************************************************************************************
 * Program Name : 통합게시판 만들기 Controller
 * Creator      : 정대정
 * Create Date  : 2022.03.29
 * Description  : 통합게시판 만들기
 * Modify Desc  :
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.03.29     정대정           최초생성
 ************************************************************************************************/
@Controller
@RequestMapping("/cmmt/*")
public class CMMT100Controller {

	@Resource(name = "CMMT100Service")
	private CMMT100Service CMMT100Service;

	@Autowired
	private ObjectMapper objectMapper;

	private static final Logger LOGGER = LoggerFactory.getLogger(CMMT100Controller.class);

	/**
	 * @Method Name : CMMT100M
	 * @작성일      : 2022.03.29
	 * @작성자      : djjung
	 * @변경이력    :
	 * @Method 설명 : cmmt/CMMT100M 웹 페이지 열기
	 * @param       :
	 * @return      : cmmt/CMMT100M.jsp
	 */
	@RequestMapping("/CMMT100M")
	public String CMMT100M() {
		return "th/cmmt/CMMT100M";
	}

	/**
	 * @Method Name : CMMT100MSEL01
	 * @작성일      : 2022.03.29
	 * @작성자      : byKim
	 * @변경이력    :
	 * @Method 설명 : 게시판 목록 조회
	 * @param       : HttpServletRequest Restful param
	 * @return      : ModelAndView HashMap
	 */
	@RequestMapping(value = "/CMMT100SEL01", method = RequestMethod.POST)
	@ResponseBody
	public Map<String, Object> CMMT100SEL01(ModelAndView mav, @RequestBody String req) {
		HashMap<String, Object> hashMap = new HashMap<String, Object>();
		try {
			//1.Grid vo data set
			CMMT100VO vo = this.objectMapper.readValue(req, CMMT100VO.class);

			//2.1.Grid list
			List<CMMT100VO> CMMT100VOGridInfo = CMMT100Service.CMMT100SEL01(vo);
			String grid = this.objectMapper.writeValueAsString(CMMT100VOGridInfo);

			//3.Return data set
			hashMap.put("list", grid);
			hashMap.put("msg", "정상적으로 조회하였습니다.");
		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}
		return hashMap;
	}

	/**
	 * @Method Name : CMMT100MSEL02
	 * @작성일      : 2022.04.13
	 * @작성자      : byKim
	 * @변경이력    :
	 * @Method 설명 : 게시판 상세 정보 조회
	 * @param       : HttpServletRequest Restful param
	 * @return      : ModelAndView HashMap
	 */
	@RequestMapping(value = "/CMMT100SEL02", method = RequestMethod.POST)
	@ResponseBody
	public Map<String, Object> CMMT100SEL02(ModelAndView mav, @RequestBody String req) {
		HashMap<String, Object> hashMap = new HashMap<String, Object>();
		try {
			//1.Grid vo data set
			CMMT100VO vo = this.objectMapper.readValue(req, CMMT100VO.class);
			
			//2.1.Grid list
			CMMT100VO CMMT100VOInfo = CMMT100Service.CMMT100SEL02(vo);

			String info = new ObjectMapper().writeValueAsString(CMMT100VOInfo);

			//3.Return data set
			hashMap.put("CMMT100VOInfo", info);
			hashMap.put("msg", "정상적으로 조회하였습니다.");
			
		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}
		return hashMap;
	}
	
	
	/**
	 * @Method Name : CMMT100MSEL03	- (CMMT100MSEL02 복사)
	 * @작성일      	: 2023.07.06
	 * @작성자      	: wkim
	 * @변경이력    	:
	 * @Method 설명 	: 카테고리 <-> 게시판 변경시 엘라스틱에 해당 게시물의 상태들을 업데이트 해주기 위해, 해당 카테고리의 게시물들을 불러옴
	 * @param       : HttpServletRequest Restful param
	 * @return      : ModelAndView HashMap
	 */
	@RequestMapping(value = "/CMMT100SEL03", method = RequestMethod.POST)
	@ResponseBody
	public Map<String, Object> CMMT100SEL03(ModelAndView mav, @RequestBody String req) {
		HashMap<String, Object> hashMap = new HashMap<String, Object>();
		try {
			//1.Grid vo data set
			CMMT100VO vo = this.objectMapper.readValue(req, CMMT100VO.class);

			List<CMMT100VO> CMMT100VOBlthgList = CMMT100Service.CMMT100SEL03(vo);
			String list = this.objectMapper.writeValueAsString(CMMT100VOBlthgList);

			//3.Return data set
			hashMap.put("list", list);
			hashMap.put("msg", "정상적으로 조회하였습니다.");
			
		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}
		return hashMap;
	}

	/**
	 * @Method Name : CMMT100INS01
	 * @작성일      : 2022.04.14
	 * @작성자      : byKim
	 * @변경이력    :
	 * @Method 설명 : 게시판 리스트 추가
	 * @param       : HttpServletRequest Restful param
	 * @return      : ModelAndView HashMap
	 */
	@RequestMapping(value = "/CMMT100INS01", method = RequestMethod.POST)
	@ResponseBody
	public Map<String, Object> CMMT100INS01(ModelAndView mav, @RequestBody String request) {
		HashMap<String, Object> resultMap = new HashMap<>();
		JSONParser parser = new JSONParser();
		try {
			JSONObject jsonObject = (JSONObject) parser.parse(request);
			JSONArray jsonArray = (JSONArray) jsonObject.get("list");


			List<CMMT100VO> list = this.objectMapper.convertValue(jsonArray, new TypeReference<List<CMMT100VO>>() {});
			Integer result = CMMT100Service.CMMT100INS01(list);
			String message = "저장 실패하였습니다.";
			if (result > 0) {
				message = "정상적으로 저장 하였습니다.";
			}
			
			resultMap.put("result", result);
			resultMap.put("msg"   , message);

		}catch(Exception e) {
			LOGGER.error("["+e.getClass()+"] Exception : " + e.getMessage());
		}

		return resultMap;
	}

	/**
	 * @Method Name : CMMT100UPT01
	 * @작성일      : 2022.04.14
	 * @작성자      : byKim
	 * @변경이력    :
	 * @Method 설명 : 게시판 리스트 수정
	 * @param       : HttpServletRequest Restful param
	 * @return      : ModelAndView HashMap
	 */
	@RequestMapping(value = "/CMMT100UPT01", method = RequestMethod.POST)
	@ResponseBody
	public Map<String, Object> CMMT100UPT01(ModelAndView mav, @RequestBody String request) {
		HashMap<String, Object> resultMap = new HashMap<>();
		JSONParser parser = new JSONParser();
		
		try {
			JSONObject jsonObject = (JSONObject) parser.parse(request);
			JSONArray jsonArray = (JSONArray) jsonObject.get("list");

			List<CMMT100VO> list = this.objectMapper.convertValue(jsonArray, new TypeReference<List<CMMT100VO>>() {});
			Integer result = CMMT100Service.CMMT100UPT01(list);
			
			String message = "저장 실패하였습니다.";
			if (result > 0) {
				message = "정상적으로 저장 하였습니다.";
			}
			
			resultMap.put("result", result);
			resultMap.put("msg"   , message);

		}catch(Exception e) {
			LOGGER.error("["+e.getClass()+"] Exception : " + e.getMessage());
		}

		return resultMap;
	}

	/**
	 * @Method Name : CMMT100DEL01
	 * @작성일      : 2022.04.29
	 * @작성자      : byKim
	 * @변경이력    :
	 * @Method 설명 : 게시판 리스트 삭제
	 *                사실상 업데이트
	 * @param       : HttpServletRequest Restful param
	 * @return      : ModelAndView HashMap
	 */
	@RequestMapping(value = "/CMMT100DEL01", method = RequestMethod.POST)
	@ResponseBody
	public Map<String, Object> CMMT100DEL01(ModelAndView mav, @RequestBody String req, BindingResult bindingResult, Model model, SessionStatus status) {

		HashMap<String, Object> hashMap = new HashMap<String, Object>();

		try {

			CMMT100VO vo = this.objectMapper.readValue(req, CMMT100VO.class);

			// reuslt Query
			int result = CMMT100Service.CMMT100DEL01(vo);
			String message = "제거 실패하였습니다.";
			if (result > 0) {
				status.setComplete();
				message = "정상적으로 제거 하였습니다.";
			}

			hashMap.put("result", result);
			hashMap.put("msg"   , message);

		}catch(Exception e) {
			LOGGER.error("["+e.getClass()+"] Exception : " + e.getMessage());
		}

		return hashMap;
	}

	/**
	 * @Method Name : CMMT100UPT02
	 * @작성일      : 2022.04.29
	 * @작성자      : byKim
	 * @변경이력    :
	 * @Method 설명 : 게시판 상세 리스트 수정
	 * @param       : HttpServletRequest Restful param
	 * @return      : ModelAndView HashMap
	 */
	@RequestMapping(value = "/CMMT100UPT02", method = RequestMethod.POST)
	@ResponseBody
	public Map<String, Object> CMMT100UPT02(ModelAndView mav, @RequestBody String req, BindingResult bindingResult, Model model, SessionStatus status) {

		HashMap<String, Object> hashMap = new HashMap<String, Object>();

		try {

			CMMT100VO vo = this.objectMapper.readValue(req, CMMT100VO.class);

			// reuslt Query
			int result = CMMT100Service.CMMT100UPT02(vo);
			String message = "수정 실패하였습니다.";
			if (result > 0) {
				status.setComplete();
				message = "정상적으로 수정 하였습니다.";
			}

			hashMap.put("result", result);
			hashMap.put("msg"   , message);

		}catch(Exception e) {
			LOGGER.error("["+e.getClass()+"] Exception : " + e.getMessage());
		}
		return hashMap;
	}

	/**
	 * @Method Name : CMMT100UPT01
	 * @작성일      : 2022.04.14
	 * @작성자      : byKim
	 * @변경이력    :
	 * @Method 설명 : 게시판 리스트 수정
	 * @param       : HttpServletRequest Restful param
	 * @return      : ModelAndView HashMap
	 */
	@RequestMapping(value = "/CMMT100UPT03", method = RequestMethod.POST)
	@ResponseBody
	public Map<String, Object> CMMT100UPT03(ModelAndView mav, @RequestBody String req, BindingResult bindingResult, Model model, SessionStatus status) {

		HashMap<String, Object> hashMap = new HashMap<String, Object>();
		JSONParser parser = new JSONParser();

		try {
			JSONObject obj = (JSONObject) parser.parse(req);
			JSONArray jsonArray = (JSONArray) obj.get("list");

			List<CMMT100VO> CMMT100VOList = (List<CMMT100VO>) jsonArray.stream()
					.map(o -> this.objectMapper.convertValue(o, CMMT100VO.class))
					.collect(Collectors.toList());

			// reuslt Query
			int result = CMMT100Service.CMMT100UPT03(CMMT100VOList);
			String message = "저장 실패하였습니다.";
			if (result > 0) {
				status.setComplete();
				message = "정상적으로 저장 하였습니다.";
			}

			hashMap.put("result", result);
			hashMap.put("msg"   , message);

		}catch(Exception e) {
			LOGGER.error("["+e.getClass()+"] Exception : " + e.getMessage());
		}
		return hashMap;
	}
	
	/**
	 * @Method Name : CMMT100UPT04 - CMMT100UPT02 복사
	 * @작성일      	: 2023.07.06
	 * @작성자      	: wkim
	 * @변경이력    	:
	 * @Method 설명 	: 게시판 유형에 따라 엘라스틱 게시글 상태 업데이트 (커뮤니티 : 99)
	 * @param       : HttpServletRequest Restful param
	 * @return      : ModelAndView HashMap
	 */
	@RequestMapping(value = "/CMMT100UPT04", method = RequestMethod.POST)
	@ResponseBody
	public Map<String, Object> CMMT100UPT04(ModelAndView mav, @RequestBody String req, BindingResult bindingResult, Model model, SessionStatus status) {
		HashMap<String, Object> hashMap = new HashMap<String, Object>();
		JSONParser parser = new JSONParser();
		try {
			JSONObject obj = (JSONObject) parser.parse(req);
			String ctgrType = String.valueOf(obj.get("ctgrType"));
			JSONArray jsonArrBlthg = (JSONArray) obj.get("blthgList");

			List<CMMT100VO> CMMT100VOList = (List<CMMT100VO>) jsonArrBlthg.stream()
					.map(o -> this.objectMapper.convertValue(o, CMMT100VO.class))
					.collect(Collectors.toList());

			String result = CMMT100Service.CMMT100UPT04(CMMT100VOList); 

			Object objResult = parser.parse(result);
			JSONObject jsonObj = (JSONObject) objResult;
			
			String strShards = jsonObj.get("_shards").toString();
			objResult = parser.parse(strShards);
			jsonObj = (JSONObject) objResult;
			
			String strMsg = "";
			String strResult = jsonObj.get("successful").toString();
			
			if(strResult == "1") {
				strMsg = "success";
			} else {
				strMsg = "fail";
			}
			
			hashMap.put("result", jsonObj.get("successful"));
			hashMap.put("msg", strMsg);

		}catch(Exception e) {
			
			if(!Objects.equals(e, new RuntimeException())){
				LOGGER.error("["+e.getClass()+"] Exception : " + e.getMessage());
			}
			
			hashMap.put("result", "0");
			hashMap.put("msg", "EL 수정 실패 하였습니다.");
		}
		return hashMap;
	}

}
