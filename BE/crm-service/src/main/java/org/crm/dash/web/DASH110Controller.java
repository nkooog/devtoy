package org.crm.dash.web;

import org.crm.config.spring.config.PropertiesService;
import org.crm.dash.VO.DASH110VO;
import org.crm.dash.service.DASH110Service;
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
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
/***********************************************************************************************
* Program Name : 공지사항상세 팝업, 대시보드 레이아웃관리   Controller
* Creator      : 김보영
* Create Date  : 2022.01.10
* Description  : 통합계시글관리
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.01.10    김보영           최초생성
* 2022.07.05    강동우           대시보드레이아웃 추가
* 2024.12.06    박준영           egov -> boot mig
************************************************************************************************/
@Slf4j
@Controller
@RequestMapping("/dash/*")
public class DASH110Controller {

	@Resource(name = "DASH110Service")
	private DASH110Service dash110Service;

	@Resource( name = "propertiesService" )
	private PropertiesService propertiesService;

	@Autowired
	private MessageSource messageSource;

	@Autowired
	private ObjectMapper objectMapper;

	private static final Logger LOGGER = LoggerFactory.getLogger(DASH110Controller.class);

	@GetMapping(value = "/DASH110M")
	public String DASH110M() {
		return "th/dash/DASH110M";
	}	
	

	@GetMapping(value = "/DASH110P")
	public String DASH110P(ModelMap model, HttpSession session) {
		return "th/dash/DASH110P";
	}

	/**
	 * @Method Name : DASH110SEL00
	 * @작성일      	: 2022.09.19
	 * @작성자      	: 이민호
	 * @변경이력    	:
	 * @Method 설명  : 사용자 등급별 레이아웃 타입 조회
	 * @param       : HttpServletRequest Restful param
	 * @return      : ModelAndView HashMap
	 */
	@PostMapping(value = "/DASH110SEL00")
	@ResponseBody
	public Map<String, Object> DASH110SEL00(ModelAndView mav, @RequestBody String req, HttpSession session ) {
		HashMap<String, Object> resultMap = new HashMap<String, Object>();
		JSONParser parser = new JSONParser();
		try {

			JSONObject jsonObject = (JSONObject) parser.parse(req);
			DASH110VO vo = this.objectMapper.convertValue(jsonObject, DASH110VO.class);
			List<DASH110VO> list = dash110Service.DASH110SEL00(vo);
			resultMap.put("typeByGrade", objectMapper.writeValueAsString(list));
		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}
		return resultMap;
	}

	/**
	 * @Method Name : DASH110UPT01
	 * @작성일      	: 2022.09.19
	 * @작성자      	: 이민호
	 * @변경이력    	:
	 * @Method 설명  : 레이아웃 타입 변경
	 * @param       : HttpServletRequest Restful param
	 * @return      : ModelAndView HashMap
	 */
	@PostMapping(value = "/DASH110UPT01")
	@ResponseBody
	public Map<String, Object> DASH110UPT01(ModelAndView mav, @RequestBody List<DASH110VO> list, HttpSession session, Locale locale ) {
		HashMap<String, Object> resultMap = new HashMap<String, Object>();
		try {
			int rtn = dash110Service.DASH110UPT01(list);
			resultMap.put("msg"   , messageSource.getMessage("success.common.update", null, "success update", locale));

		} catch (Exception e) {
			e.printStackTrace();
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}
		return resultMap;
	}
		
	/**
	 * @Method Name : DASH110SEL01
	 * @작성일      	: 2022.06.29
	 * @작성자      	: 강동우
	 * @변경이력    	:
	 * @Method 설명 	: 오늘의 명언 조회
	 * @param       : HttpServletRequest Restful param
	 * @return      : ModelAndView HashMap
	 */
	@PostMapping(value = "/DASH110SEL01")
	@ResponseBody
	public Map<String, Object> DASH110SEL01(ModelAndView mav, @RequestBody String req, HttpSession session ) {

		HashMap<String, Object> resultMap = new HashMap<String, Object>();
		JSONParser parser = new JSONParser();

		try {

			JSONObject jsonObject = (JSONObject) parser.parse(req);
			DASH110VO DASH110VO = this.objectMapper.convertValue(jsonObject, DASH110VO.class);
			
			List<DASH110VO> list = dash110Service.DASH110SEL01(DASH110VO);
			
			resultMap.put("count", list.size());
			resultMap.put("list", objectMapper.writeValueAsString(list));
			resultMap.put("totalList", objectMapper.writeValueAsString(dash110Service.DASH110SEL01(DASH110VO)));
			resultMap.put("msg", "정상적으로 조회하였습니다.");

		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}
		return resultMap;
	}
	
	/**
	 * @Method Name : DASH110SEL02
	 * @작성일      	: 2022.06.30
	 * @작성자      	: 강동우
	 * @변경이력    	:
	 * @Method 설명 	: 슬로건 조회
	 * @param       : HttpServletRequest Restful param
	 * @return      : ModelAndView HashMap
	 */
	@PostMapping(value = "/DASH110SEL02")
	@ResponseBody
	public Map<String, Object> DASH110SEL02(ModelAndView mav, @RequestBody String req, HttpSession session ) {

		HashMap<String, Object> resultMap = new HashMap<String, Object>();
		JSONParser parser = new JSONParser();
		try {

			JSONObject jsonObject = (JSONObject) parser.parse(req);
			DASH110VO DASH110VO = this.objectMapper.convertValue(jsonObject, DASH110VO.class);
			
			List<DASH110VO> list = dash110Service.DASH110SEL02(DASH110VO);
			
			resultMap.put("count", list.size());
			resultMap.put("list", objectMapper.writeValueAsString(list));
			resultMap.put("totalList", objectMapper.writeValueAsString(dash110Service.DASH110SEL02(DASH110VO)));
			resultMap.put("msg", "정상적으로 조회하였습니다.");

		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}
		return resultMap;
	}
	
	/**
	 * @Method Name : DASH110SEL03
	 * @작성일      	: 2022.06.30
	 * @작성자      	: 강동우
	 * @변경이력    	:
	 * @Method 설명 	: side 팔레트 조회
	 * @param       : HttpServletRequest Restful param
	 * @return      : ModelAndView HashMap
	 */
	@PostMapping(value = "/DASH110SEL03")
	@ResponseBody
	public Map<String, Object> DASH110SEL03(ModelAndView mav, @RequestBody String req, HttpSession session ) {

		HashMap<String, Object> resultMap = new HashMap<String, Object>();
		JSONParser parser = new JSONParser();
		try {
			JSONObject jsonObject = (JSONObject) parser.parse(req);
			DASH110VO DASH110VO = this.objectMapper.convertValue(jsonObject, DASH110VO.class);
			
			List<DASH110VO> list = dash110Service.DASH110SEL03(DASH110VO);
			
			resultMap.put("count", list.size());
			resultMap.put("list", objectMapper.writeValueAsString(list));
			resultMap.put("totalList", objectMapper.writeValueAsString(dash110Service.DASH110SEL03(DASH110VO)));
			resultMap.put("msg", "정상적으로 조회하였습니다.");

		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}
		return resultMap;
	}
	
	/**
	 * @Method Name : DASH110SEL04
	 * @작성일      	: 2022.06.30
	 * @작성자      	: 강동우
	 * @변경이력    	:
	 * @Method 설명 	: 퀵 링크 조회
	 * @param       : HttpServletRequest Restful param
	 * @return      : ModelAndView HashMap
	 */
	@PostMapping(value = "/DASH110SEL04")
	@ResponseBody
	public Map<String, Object> DASH110SEL04(ModelAndView mav, @RequestBody String req, HttpSession session ) {

		HashMap<String, Object> resultMap = new HashMap<String, Object>();
		JSONParser parser = new JSONParser();
		try {
			JSONObject jsonObject = (JSONObject) parser.parse(req);
			DASH110VO DASH110VO = this.objectMapper.convertValue(jsonObject, DASH110VO.class);
			
			List<DASH110VO> list = dash110Service.DASH110SEL04(DASH110VO);
			
			resultMap.put("count", list.size());
			resultMap.put("list", objectMapper.writeValueAsString(list));
			resultMap.put("totalList", objectMapper.writeValueAsString(dash110Service.DASH110SEL04(DASH110VO)));
			resultMap.put("msg", "정상적으로 조회하였습니다.");

		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}
		return resultMap;
	}
	
	/**
	 * @Method Name : DASH110INS01
	 * @작성일      : 2022.07.01
	 * @작성자      : 강동우
	 * @변경이력    :
	 * @Method 설명 : 팔레트 TOP 사용여부
	 * @param       : ModelAndView
	 * @return : ModelAndView HashMap
	 */
	@PostMapping(value = "/DASH110INS01")
	@ResponseBody
	public Map<String, Object> DASH110INS01(ModelAndView mav, @RequestBody String request) {
		HashMap<String, Object> resultMap = new HashMap<String, Object>();
		JSONParser parser = new JSONParser();
		try {
			JSONObject jsonObject = (JSONObject) parser.parse(request);

			JSONArray palette = (JSONArray) jsonObject.get("palette");
			JSONArray item = (JSONArray) jsonObject.get("item");

			List<DASH110VO> plts = this.objectMapper.convertValue(palette, new TypeReference<List<DASH110VO>>() {});
			List<DASH110VO> items = this.objectMapper.convertValue(item, new TypeReference<List<DASH110VO>>() {});
			DASH110VO vo = this.objectMapper.convertValue(jsonObject.get("param"), DASH110VO.class);
			int rtn = dash110Service.DASH110INS01(plts,items,vo);
//			Integer rtn1 = dash110Service.DASH110INS01(gson.fromJson(palette, new TypeToken<ArrayList<DASH110VO>>(){}.getType()));
//			Integer rtn2 = dash110Service.DASH110INS02(gson.fromJson(item, new TypeToken<ArrayList<DASH110VO>>(){}.getType()));
			if (rtn > 0) {
				resultMap.put("msg", "정상적으로 추가되었습니다.");
			}
		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}
		return resultMap;
	}
	
	/**
	 * @Method Name : DASH110INS02
	 * @작성일      : 2022.07.01
	 * @작성자      : 강동우
	 * @변경이력    :
	 * @Method 설명 : 팔레트 TOP 상세 사용여부
	 * @param       : ModelAndView
	 * @return : ModelAndView HashMap
	 */
	@PostMapping(value = "/DASH110INS02")
	@ResponseBody
	public Map<String, Object> DASH110INS02(ModelAndView mav, @RequestBody String request) {
		HashMap<String, Object> resultMap = new HashMap<String, Object>();
		JSONParser parser = new JSONParser();

		try {
			JSONObject jsonObject = (JSONObject) parser.parse(request);
			JSONArray jsonArray = (JSONArray) jsonObject.get("list");

			Integer rtn = dash110Service.DASH110INS02(this.objectMapper.convertValue(jsonArray, new TypeReference<List<DASH110VO>>() {
			}));
			if (rtn > 0) {
				resultMap.put("msg", "정상적으로 추가되었습니다.");
			}

		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}
		return resultMap;
	}
	
	/**
	 * @Method Name : DASH110SEL05
	 * @작성일      	: 2022.07.05
	 * @작성자      	: 강동우
	 * @변경이력    	:
	 * @Method 설명 	: 팔레트항목코드사용여부
	 * @param       : HttpServletRequest Restful param
	 * @return      : ModelAndView HashMap
	 */
	@PostMapping(value = "/DASH110SEL05")
	@ResponseBody
	public Map<String, Object> DASH110SEL05(ModelAndView mav, @RequestBody String req, HttpSession session ) {

		HashMap<String, Object> resultMap = new HashMap<String, Object>();
		JSONParser parser = new JSONParser();

		try {
			JSONObject jsonObject = (JSONObject) parser.parse(req);
			DASH110VO DASH110VO = this.objectMapper.convertValue(jsonObject, DASH110VO.class);
			
			List<DASH110VO> list = dash110Service.DASH110SEL05(DASH110VO);
			
			resultMap.put("count", list.size());
			resultMap.put("list", objectMapper.writeValueAsString(list));
			resultMap.put("totalList", objectMapper.writeValueAsString(dash110Service.DASH110SEL05(DASH110VO)));
			resultMap.put("msg", "정상적으로 조회하였습니다.");

		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}
		return resultMap;
	}
	
	/**
	 * @Method Name : DASH110SEL06
	 * @작성일      	: 2022.07.05
	 * @작성자      	: 강동우
	 * @변경이력    	:
	 * @Method 설명 	: 팔레트항목번호사용여부
	 * @param       : HttpServletRequest Restful param
	 * @return      : ModelAndView HashMap
	 */
	@PostMapping(value = "/DASH110SEL06")
	@ResponseBody
	public Map<String, Object> DASH110SEL06(ModelAndView mav, @RequestBody String req, HttpSession session ) {

		HashMap<String, Object> resultMap = new HashMap<String, Object>();
		JSONParser parser = new JSONParser();

		try {
			JSONObject jsonObject = (JSONObject) parser.parse(req);
			DASH110VO DASH110VO = this.objectMapper.convertValue(jsonObject, DASH110VO.class);
			
			List<DASH110VO> list = dash110Service.DASH110SEL06(DASH110VO);
			
			resultMap.put("count", list.size());
			resultMap.put("list", objectMapper.writeValueAsString(list));
			resultMap.put("totalList", objectMapper.writeValueAsString(dash110Service.DASH110SEL06(DASH110VO)));
			resultMap.put("msg", "정상적으로 조회하였습니다.");

		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}
		return resultMap;
	}
	
	/**
	 * @Method Name : DASH110SEL07
	 * @작성일      	: 2022.07.05
	 * @작성자      	: 강동우
	 * @변경이력    	:
	 * @Method 설명 	: Top 팔레트항목번호사용여부
	 * @param       : HttpServletRequest Restful param
	 * @return      : ModelAndView HashMap
	 */
	@PostMapping(value = "/DASH110SEL07")
	@ResponseBody
	public Map<String, Object> DASH110SEL07(ModelAndView mav, @RequestBody String req, HttpSession session ) {
		HashMap<String, Object> resultMap = new HashMap<String, Object>();
		JSONParser parser = new JSONParser();
		try {
			JSONObject jsonObject = (JSONObject) parser.parse(req);
			DASH110VO DASH110VO = this.objectMapper.convertValue(jsonObject, DASH110VO.class);
			
			List<DASH110VO> list = dash110Service.DASH110SEL07(DASH110VO);
			
			resultMap.put("count", list.size());
			resultMap.put("list", objectMapper.writeValueAsString(list));
			resultMap.put("totalList", objectMapper.writeValueAsString(dash110Service.DASH110SEL07(DASH110VO)));
			resultMap.put("msg", "정상적으로 조회하였습니다.");

		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}
		return resultMap;
	}

	/**
	 * @Method Name : DASH110SEL08
	 * @작성일      	: 2023.01.27
	 * @작성자      	: 이민호
	 * @변경이력    	:
	 * @Method 설명 	: Top 팔레트항목번호사용여부
	 * @param       : HttpServletRequest Restful param
	 * @return      : ModelAndView HashMap
	 */
	@PostMapping(value = "/DASH110SEL08")
	@ResponseBody
	public Map<String, Object> DASH110SEL08(ModelAndView mav, @RequestBody String req) {

		HashMap<String, Object> resultMap = new HashMap<String, Object>();
		JSONParser parser = new JSONParser();

		try {
			JSONObject jsonObject = (JSONObject) parser.parse(req);
			DASH110VO DASH110VO = this.objectMapper.convertValue(jsonObject, DASH110VO.class);
			List<DASH110VO> tmplItems = dash110Service.DASH110SEL08(DASH110VO);
			List<DASH110VO> checkItems = dash110Service.DASH110SEL09(DASH110VO);

			resultMap.put("tmplItems", objectMapper.writeValueAsString(tmplItems));
			resultMap.put("checkItems", objectMapper.writeValueAsString(checkItems));
			resultMap.put("msg", "정상적으로 조회하였습니다.");
		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}
		return resultMap;
	}
	
	/**
	 * @Method Name : DASH110DEL01
	 * @작성일      : 2022.07.06
	 * @작성자      : 강동우
	 * @변경이력    :
	 * @Method 설명 : 팔레트 Body 컨텐츠
	 * @param       : ModelAndView
	 * @return : ModelAndView HashMap
	 */
	@PostMapping(value = "/DASH110DEL01")
	@ResponseBody
	public Map<String, Object> DASH110DEL01(ModelAndView mav, @RequestBody String request) {
		HashMap<String, Object> resultMap = new HashMap<String, Object>();
		JSONParser parser = new JSONParser();
		try {
			JSONObject jsonObject = (JSONObject) parser.parse(request);
			JSONArray jsonArray = (JSONArray) jsonObject.get("list");

			Integer rtn = dash110Service.DASH110DEL01(this.objectMapper.convertValue(jsonArray, new TypeReference<List<DASH110VO>>() {}));
			if (rtn > 0) {
				resultMap.put("msg", "정상적으로 삭제되었습니다.");
			}

		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}
		return resultMap;
	}
	
	/**
	 * @Method Name : DASH110DEL02
	 * @작성일      : 2022.07.06
	 * @작성자      : 강동우
	 * @변경이력    :
	 * @Method 설명 : 팔레트 Body 게시판 컨텐츠 
	 * @param       : ModelAndView
	 * @return : ModelAndView HashMap
	 */
	@PostMapping(value = "/DASH110DEL02")
	@ResponseBody
	public Map<String, Object> DASH110DEL02(ModelAndView mav, @RequestBody String request) {
		HashMap<String, Object> resultMap = new HashMap<String, Object>();
		JSONParser parser = new JSONParser();

		try {
			JSONObject jsonObject = (JSONObject) parser.parse(request);
			JSONArray jsonArray = (JSONArray) jsonObject.get("list");

			Integer rtn = dash110Service.DASH110DEL02(this.objectMapper.convertValue(jsonArray, new TypeReference<List<DASH110VO>>() {}));
			if (rtn > 0) {
				resultMap.put("msg", "정상적으로 삭제되었습니다.");
			}

		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}
		return resultMap;
	}
	
	/**
	 * @Method Name : DASH110INS03
	 * @작성일      : 2022.07.06
	 * @작성자      : 강동우
	 * @변경이력    :
	 * @Method 설명 : 팔레트 Body 게시판 컨텐츠 등록
	 * @param       : ModelAndView
	 * @return : ModelAndView HashMap
	 */
	@PostMapping(value = "/DASH110INS03")
	@ResponseBody
	public Map<String, Object> DASH110INS03(ModelAndView mav, @RequestBody String request) {
		HashMap<String, Object> resultMap = new HashMap<String, Object>();
		JSONParser parser = new JSONParser();
		try {
			JSONObject jsonObject = (JSONObject) parser.parse(request);
			JSONArray jsonArray = (JSONArray) jsonObject.get("list");

			Integer rtn = dash110Service.DASH110INS03(this.objectMapper.convertValue(jsonArray, new TypeReference<List<DASH110VO>>() {}));
			if (rtn > 0) {
				resultMap.put("msg", "정상적으로 삭제되었습니다.");
			}
		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}
		return resultMap;
	}
	
}
