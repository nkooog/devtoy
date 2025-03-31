package org.crm.sysm.web;

import org.crm.sysm.VO.SYSM250VO;
import org.crm.sysm.service.SYSM250Service;
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
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/***********************************************************************************************
* Program Name : 메뉴관리 Controller
* Creator      : jrlee
* Create Date  : 2022.02.10
* Description  : 메뉴관리
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.02.10     jrlee           최초생성
************************************************************************************************/
@Controller
@RequestMapping("/sysm/*")
public class SYSM250Controller {
	private static final Logger LOGGER = LoggerFactory.getLogger(SYSM250Controller.class);

	@Resource(name = "SYSM250Service")
	private SYSM250Service sysm250Service;

	private ObjectMapper objectMapper;

	@Autowired
	public SYSM250Controller(ObjectMapper objectMapper) {
		this.objectMapper = objectMapper;
	}

	/**
	 * @Method Name : SYSM250M
	 * @작성일      : 2022.02.10
	 * @작성자      : jrlee
	 * @변경이력    :
	 * @Method 설명 : sysm/SYSM250M 웹 페이지 열기
	 * @param       :
	 * @return      : sysm/SYSM250M.jsp
	 */
	@RequestMapping("/SYSM250M")
	public String SYSM250M() {
		return "th/sysm/SYSM250M";
	}

	/**
	 * @Method Name : SYSM250P
	 * @작성일      : 2022.02.10
	 * @작성자      : jrlee
	 * @변경이력    :
	 * @Method 설명 : sysm/SYSM250P 웹 페이지 열기
	 * @param       :
	 * @return      : sysm/SYSM250P.jsp
	 */
	@RequestMapping("/SYSM250P")
	public String SYSM250P() {
		return "th/sysm/SYSM250P";
	}

	/**
	 * @Method Name : SYSM250SEL01
	 * @작성일      : 2022.02.11
	 * @작성자      : jrlee
	 * @변경이력    :
	 * @Method 설명 : restful 메뉴 전체조회
	 * @param       : ModelAndView
	 * @return      : ModelAndView HashMap
	 */
	@PostMapping(value = "/SYSM250SEL01")
	@ResponseBody
	public Map<String, Object> SYSM250SEL01(ModelAndView mav, @RequestBody String request) {
		HashMap<String, Object> resultMap = new HashMap<String, Object>();

		try {
			List<SYSM250VO> list = sysm250Service.SYSM250SEL01(this.objectMapper.readValue(request, SYSM250VO.class));

			resultMap.put("count", list.size());
			resultMap.put("list", this.objectMapper.writeValueAsString(list));
			resultMap.put("msg", "정상적으로 조회하였습니다.");

		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}
		return resultMap;
	}

	/**
	 * @Method Name : SYSM250SEL03
	 * @작성일      : 2022.02.28
	 * @작성자      : jrlee
	 * @변경이력    :
	 * @Method 설명 : restful MiddleMenu, 3depth 조회
	 * @param       :  ModelAndView
	 * @return      : ModelAndView HashMap
	 */
	@PostMapping(value = "/SYSM250SEL03")
	@ResponseBody
	public Map<String, Object> SYSM250SEL03(ModelAndView mav, @RequestBody String request) {
		HashMap<String, Object> resultMap = new HashMap<String, Object>();

		try {

			SYSM250VO vo = this.objectMapper.readValue(request, SYSM250VO.class);
			List<SYSM250VO> list = sysm250Service.SYSM250SEL03(vo);

			resultMap.put("count", list.size());
			resultMap.put("list", this.objectMapper.writeValueAsString(list));
			resultMap.put("totalList", this.objectMapper.writeValueAsString(sysm250Service.SYSM250SEL01(vo)));
			resultMap.put("msg", "정상적으로 조회하였습니다.");
		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}
		return resultMap;
	}

	/**
	 * @Method Name : SYSM250SEL04
	 * @작성일      : 2022.03.23
	 * @작성자      : jrlee
	 * @변경이력    :
	 * @Method 설명 : restful MenuId 체크
	 * @param       :  ModelAndView
	 * @return      : ModelAndView HashMap
	 */
	@PostMapping(value = "/SYSM250SEL04")
	@ResponseBody
	public Map<String, Object> SYSM250SEL04(ModelAndView mav, @RequestBody String request) {
		HashMap<String, Object> resultMap = new HashMap<String, Object>();

		try {
			List<SYSM250VO> list = sysm250Service.SYSM250SEL04(this.objectMapper.readValue(request, SYSM250VO.class));

			resultMap.put("count", list.size());
			resultMap.put("list", objectMapper.writeValueAsString(list));
			resultMap.put("msg", "정상적으로 조회하였습니다.");
		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}
		return resultMap;
	}

	/**
	 * @Method Name : SYSM250INS01
	 * @작성일      : 2022.02.11
	 * @작성자      : jrlee
	 * @변경이력    :
	 * @Method 설명 : restful 메뉴 추가
	 * @param       : ModelAndView
	 * @return : ModelAndView HashMap
	 */
	@RequestMapping(value = "/SYSM250INS01", method = RequestMethod.POST)
	@ResponseBody
	public Map<String, Object> SYSM250INS01(ModelAndView mav, @RequestBody String request) {
		HashMap<String, Object> resultMap = new HashMap<String, Object>();
		JSONParser parser = new JSONParser();
		try {

			JSONObject jsonObject = (JSONObject) parser.parse(request);
			JSONArray jsonArray = (JSONArray) jsonObject.get("list");

			Integer rtn = sysm250Service.SYSM250INS01(this.objectMapper.convertValue(jsonArray, new TypeReference<List<SYSM250VO>>() {}));
			if (rtn > 0) {
				resultMap.put("msg", "정상적으로 추가되었습니다.");
			}

		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}
		return resultMap;
	}

	/**
	 * @Method Name : SYSM250UPT01
	 * @작성일      : 2022.02.11
	 * @작성자      : jrlee
	 * @변경이력    :
	 * @Method 설명 : restful 메뉴 변경
	 * @param       :  ModelAndView
	 * @return      : ModelAndView HashMap
	 */
	@RequestMapping(value = "/SYSM250UPT01", method = RequestMethod.POST)
	@ResponseBody
	public Map<String, Object> SYSM250UPT01(ModelAndView mav, @RequestBody String request) {
		HashMap<String, Object> resultMap = new HashMap<String, Object>();
		JSONParser parser = new JSONParser();

		try {
			JSONObject jsonObject = (JSONObject) parser.parse(request);
			JSONArray jsonArray = (JSONArray) jsonObject.get("list");

			List<SYSM250VO> list = this.objectMapper.convertValue(jsonArray, new TypeReference<List<SYSM250VO>>() {});
			Integer rtn1 = sysm250Service.SYSM250UPT01(list);
			if (rtn1 > 0) {
				Integer rtn2 = sysm250Service.SYSM250UPT02(list.stream().filter(x -> !x.getMenuId().equals(x.getId())).collect(Collectors.toList()));
			}

			resultMap.put("msg", "정상적으로 변경되었습니다.");

		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}
		return resultMap;
	}

	/**
	 * @Method Name : SYSM250DEL01
	 * @작성일      : 2022.02.11
	 * @작성자      : jrlee
	 * @변경이력    :
	 * @Method 설명 : restful 메뉴 삭제
	 * @param       :  ModelAndView
	 * @return      : ModelAndView HashMap
	 */
	@RequestMapping(value = "/SYSM250DEL01", method = RequestMethod.POST)
	@ResponseBody
	public Map<String, Object> SYSM250DEL01(ModelAndView mav, @RequestBody String request) {
		HashMap<String, Object> resultMap = new HashMap<String, Object>();
		JSONParser parser = new JSONParser();
		try {
			JSONObject jsonObject = (JSONObject) parser.parse(request);
			JSONArray jsonArray = (JSONArray) jsonObject.get("list");

			Integer rtn = sysm250Service.SYSM250DEL01(this.objectMapper.convertValue(jsonArray, new TypeReference<List<SYSM250VO>>() {}));
			if (rtn > 0) {
				resultMap.put("msg", "정상적으로 삭제되었습니다.");
			}

		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}
		return resultMap;
	}
}
