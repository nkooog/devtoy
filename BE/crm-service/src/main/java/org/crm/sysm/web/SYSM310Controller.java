package org.crm.sysm.web;

import org.crm.sysm.VO.SYSM310VO;
import org.crm.sysm.service.SYSM310Service;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.Resource;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/***********************************************************************************************
* Program Name : 그룹별 DataFrame 권한관리 Controller
* Creator      : jrlee
* Create Date  : 2022.06.21
* Description  : 그룹별 DataFrame 권한관리
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.06.07     jrlee           최초생성
************************************************************************************************/
@Controller
@RequestMapping("/sysm/*")
public class SYSM310Controller {
	private static final Logger LOGGER = LoggerFactory.getLogger(SYSM310Controller.class);

	@Resource(name = "SYSM310Service")
	private SYSM310Service sysm310Service;

	private ObjectMapper objectMapper;

	@Autowired
	public SYSM310Controller(ObjectMapper objectMapper) {
		this.objectMapper = objectMapper;
	}

	/**
	 * @Method Name : SYSM310M
	 * @작성일      : 2022.06.21
	 * @작성자      : jrlee
	 * @변경이력    : 
	 * @Method 설명 : sysm/SYSM310M 웹 페이지 열기
	 * @param       :  
	 * @return      : sysm/SYSM310M.jsp
	 */
	@RequestMapping("/SYSM310M")
	public String SYSM310M() {
		return "th/sysm/SYSM310M";
	}

	/**
	 * @Method Name : SYSM310SEL01
	 * @작성일      : 2022.06.21
	 * @작성자      : jrlee
	 * @변경이력    :
	 * @Method 설명 : 데이터프레임 조회
	 * @param       : ModelAndView
	 * @return      : ModelAndView HashMap
	 */
	@RequestMapping(value = "/SYSM310SEL01", method = RequestMethod.POST)
	@ResponseBody
	public Map<String, Object> SYSM310SEL01(ModelAndView mav, @RequestBody String request) {
		HashMap<String, Object> resultMap = new HashMap<>();

		try {
			List<SYSM310VO> list = sysm310Service.SYSM310SEL01(this.objectMapper.readValue(request, SYSM310VO.class));

			resultMap.put("list", this.objectMapper.writeValueAsString(list));
			resultMap.put("msg", "정상적으로 조회하였습니다.");

		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}

		return resultMap;
	}

	/**
	 * @Method Name : SYSM310SEL02
	 * @작성일      : 2022.06.21
	 * @작성자      : jrlee
	 * @변경이력    :
	 * @Method 설명 : 사용자그룹 조회
	 * @param       : ModelAndView
	 * @return      : ModelAndView HashMap
	 */
	@RequestMapping(value = "/SYSM310SEL02", method = RequestMethod.POST)
	@ResponseBody
	public Map<String, Object> SYSM310SEL02(ModelAndView mav, @RequestBody String request) {
		HashMap<String, Object> resultMap = new HashMap<>();

		try {
			List<SYSM310VO> list = sysm310Service.SYSM310SEL02(this.objectMapper.readValue(request, SYSM310VO.class));

			resultMap.put("list", new ObjectMapper().writeValueAsString(list));
			resultMap.put("msg", "정상적으로 조회하였습니다.");
		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}

		return resultMap;
	}

	/**
	 * @Method Name : SYSM310SEL03
	 * @작성일      : 2022.06.21
	 * @작성자      : jrlee
	 * @변경이력    :
	 * @Method 설명 : 버튼 조회
	 * @param       : ModelAndView
	 * @return      : ModelAndView HashMap
	 */
	@RequestMapping(value = "/SYSM310SEL03", method = RequestMethod.POST)
	@ResponseBody
	public Map<String, Object> SYSM310SEL03(ModelAndView mav, @RequestBody String request) {
		HashMap<String, Object> resultMap = new HashMap<>();

		try {
			List<SYSM310VO> list = sysm310Service.SYSM310SEL03(this.objectMapper.readValue(request, SYSM310VO.class));

			resultMap.put("list", new ObjectMapper().writeValueAsString(list));
			resultMap.put("msg", "정상적으로 조회하였습니다.");

		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}

		return resultMap;
	}

	/**
	 * @Method Name : SYSM310SEL04
	 * @작성일      : 2022.06.27
	 * @작성자      : jrlee
	 * @변경이력    :
	 * @Method 설명 : 등급별버튼권한 조회
	 * @param       : ModelAndView
	 * @return      : ModelAndView HashMap
	 */
	@RequestMapping(value = "/SYSM310SEL04", method = RequestMethod.POST)
	@ResponseBody
	public Map<String, Object> SYSM310SEL04(ModelAndView mav, @RequestBody String request) {
		HashMap<String, Object> resultMap = new HashMap<>();

		try {
			List<SYSM310VO> list = sysm310Service.SYSM310SEL04(this.objectMapper.readValue(request, SYSM310VO.class));

			resultMap.put("list", new ObjectMapper().writeValueAsString(list));
			resultMap.put("msg", "정상적으로 조회하였습니다.");

		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}

		return resultMap;
	}

	/**
	 * @Method Name : SYSM310INS01
	 * @작성일      : 2022.06.24
	 * @작성자      : jrlee
	 * @변경이력    :
	 * @Method 설명 : 등급별데이터프레임권한 추가
	 * @param       : ModelAndView
	 * @return : ModelAndView HashMap
	 */
	@RequestMapping(value = "/SYSM310INS01", method = RequestMethod.POST)
	@ResponseBody
	public Map<String, Object> SYSM310INS01(ModelAndView mav, @RequestBody String request) {
		HashMap<String, Object> resultMap = new HashMap<>();
		JSONParser parser = new JSONParser();
		try {

			JSONObject jsonObject = (JSONObject) parser.parse(request);
			JSONArray jsonArray = (JSONArray) jsonObject.get("list");

			sysm310Service.SYSM310DEL01(this.objectMapper.readValue(request, SYSM310VO.class));
			Integer rtn = sysm310Service.SYSM310INS01(this.objectMapper.convertValue(jsonArray, new TypeReference<List<SYSM310VO>>() {}));
			if (rtn > 0) {
				resultMap.put("msg", "정상적으로 저장되었습니다.");
			}

		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}

		return resultMap;
	}

	/**
	 * @Method Name : SYSM310DEL02
	 * @작성일      : 2022.06.24
	 * @작성자      : jrlee
	 * @변경이력    :
	 * @Method 설명 : 등급별데이터프레임권한 삭제
	 * @param       : ModelAndView
	 * @return : ModelAndView HashMap
	 */
	@RequestMapping(value = "/SYSM310DEL02", method = RequestMethod.POST)
	@ResponseBody
	public Map<String, Object> SYSM310DEL02(ModelAndView mav, @RequestBody String request) {
		HashMap<String, Object> resultMap = new HashMap<>();
		JSONParser parser = new JSONParser();
		try {

			JSONObject jsonObject = (JSONObject) parser.parse(request);
			JSONArray jsonArray = (JSONArray) jsonObject.get("list");

			Integer rtn = sysm310Service.SYSM310DEL02(this.objectMapper.convertValue(jsonArray, new TypeReference<List<SYSM310VO>>() {}));
			if (rtn > 0) {
				resultMap.put("msg", "정상적으로 삭제되었습니다.");
			}

		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}

		return resultMap;
	}

	/**
	 * @Method Name : SYSM310INS02
	 * @작성일      : 2022.06.24
	 * @작성자      : jrlee
	 * @변경이력    :
	 * @Method 설명 : 등급별버튼권한 추가
	 * @param       : ModelAndView
	 * @return : ModelAndView HashMap
	 */
	@RequestMapping(value = "/SYSM310INS02", method = RequestMethod.POST)
	@ResponseBody
	public Map<String, Object> SYSM310INS02(ModelAndView mav, @RequestBody String request) {
		HashMap<String, Object> resultMap = new HashMap<>();
		JSONParser parser = new JSONParser();
		try {

			JSONObject jsonObject = (JSONObject) parser.parse(request);
			JSONArray jsonArray = (JSONArray) jsonObject.get("list");

			sysm310Service.SYSM310DEL03(this.objectMapper.readValue(request, SYSM310VO.class));
			Integer rtn = sysm310Service.SYSM310INS02(this.objectMapper.convertValue(jsonArray, new TypeReference<List<SYSM310VO>>() {}));
			if (rtn > 0) {
				resultMap.put("msg", "정상적으로 저장되었습니다.");
			}

		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}

		return resultMap;
	}

	/**
	 * @Method Name : SYSM310DEL04
	 * @작성일      : 2022.06.27
	 * @작성자      : jrlee
	 * @변경이력    :
	 * @Method 설명 : 등급별버튼권한 삭제
	 * @param       : ModelAndView
	 * @return : ModelAndView HashMap
	 */
	@RequestMapping(value = "/SYSM310DEL04", method = RequestMethod.POST)
	@ResponseBody
	public Map<String, Object> SYSM310DEL04(ModelAndView mav, @RequestBody String request) {
		HashMap<String, Object> resultMap = new HashMap<>();
		JSONParser parser = new JSONParser();
		try {

			JSONObject jsonObject = (JSONObject) parser.parse(request);
			JSONArray jsonArray = (JSONArray) jsonObject.get("list");

			Integer rtn = sysm310Service.SYSM310DEL04(this.objectMapper.convertValue(jsonArray, new TypeReference<List<SYSM310VO>>() {}));
			if (rtn > 0) {
				resultMap.put("msg", "정상적으로 삭제되었습니다.");
			}

		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}

		return resultMap;
	}
}
