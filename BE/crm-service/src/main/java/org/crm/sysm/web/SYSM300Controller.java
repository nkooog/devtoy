package org.crm.sysm.web;

import org.crm.sysm.VO.SYSM300VO;
import org.crm.sysm.service.SYSM300Service;
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
* Program Name : 데이터프레임 관리 Controller
* Creator      : jrlee
* Create Date  : 2022.06.07
* Description  : 데이터프레임 관리
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.06.07     jrlee           최초생성
************************************************************************************************/
@Controller
@RequestMapping("/sysm/*")
public class SYSM300Controller {
	private static final Logger LOGGER = LoggerFactory.getLogger(SYSM300Controller.class);

	@Resource(name = "SYSM300Service")
	private SYSM300Service sysm300Service;

	private ObjectMapper objectMapper;

	@Autowired
	public SYSM300Controller(ObjectMapper objectMapper) {
		this.objectMapper = objectMapper;
	}

	/**
	 * @Method Name : SYSM300M
	 * @작성일      : 2022.06.07
	 * @작성자      : jrlee
	 * @변경이력    : 
	 * @Method 설명 : sysm/SYSM300M 웹 페이지 열기
	 * @param       :  
	 * @return      : sysm/SYSM300M.jsp
	 */
	@RequestMapping("/SYSM300M")
	public String SYSM300M() {
		return "th/sysm/SYSM300M";
	}

	@RequestMapping("/SYSM303P")
	public String SYSM303P() {
		return "th/sysm/SYSM303P";
	}

	/**
	 * @Method Name : SYSM300SEL01
	 * @작성일      : 2022.06.07
	 * @작성자      : jrlee
	 * @변경이력    :
	 * @Method 설명 : 데이터프레임 조회
	 * @param       : ModelAndView
	 * @return      : ModelAndView HashMap
	 */
	@RequestMapping(value = "/SYSM300SEL01", method = RequestMethod.POST)
	@ResponseBody
	public Map<String, Object> SYSM300SEL01(ModelAndView mav, @RequestBody String request) {
		HashMap<String, Object> resultMap = new HashMap<>();

		try {
			SYSM300VO vo = this.objectMapper.readValue(request, SYSM300VO.class);
			vo.setSrchText(vo.getSrchText().toUpperCase());
			List<SYSM300VO> list = sysm300Service.SYSM300SEL01(vo);

			resultMap.put("list", new ObjectMapper().writeValueAsString(list));
			resultMap.put("msg", "정상적으로 조회하였습니다.");

		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}

		return resultMap;
	}

	/**
	 * @Method Name : SYSM300INS01
	 * @작성일      : 2022.07.11
	 * @작성자      : jrlee
	 * @변경이력    :
	 * @Method 설명 : 데이터프레임 추가
	 * @param       : ModelAndView
	 * @return : ModelAndView HashMap
	 */
	@RequestMapping(value = "/SYSM300INS01", method = RequestMethod.POST)
	@ResponseBody
	public Map<String, Object> SYSM300INS01(ModelAndView mav, @RequestBody String request) {
		HashMap<String, Object> resultMap = new HashMap<>();
		JSONParser parser = new JSONParser();
		try {

			JSONObject jsonObject = (JSONObject) parser.parse(request);
			JSONArray jsonArray = (JSONArray) jsonObject.get("list");

			Integer rtn = sysm300Service.SYSM300INS01(this.objectMapper.convertValue(jsonArray, new TypeReference<List<SYSM300VO>>() {}));
			if (rtn > 0) {
				rtn = sysm300Service.SYSM300INS02(this.objectMapper.convertValue(jsonArray, new TypeReference<List<SYSM300VO>>() {}));
				if (rtn > 0) {
					resultMap.put("msg", "정상적으로 저장되었습니다.");
				}
			}
		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}

		return resultMap;
	}

	/**
	 * @Method Name : SYSM300UPT01
	 * @작성일      : 2022.07.11
	 * @작성자      : jrlee
	 * @변경이력    :
	 * @Method 설명 : 데이터프레임 수정
	 * @param       : ModelAndView
	 * @return : ModelAndView HashMap
	 */
	@RequestMapping(value = "/SYSM300UPT01", method = RequestMethod.POST)
	@ResponseBody
	public Map<String, Object> SYSM300UPT01(ModelAndView mav, @RequestBody String request) {
		HashMap<String, Object> resultMap = new HashMap<>();
		JSONParser parser = new JSONParser();
		try {

			JSONObject jsonObject = (JSONObject) parser.parse(request);
			JSONArray jsonArray = (JSONArray) jsonObject.get("list");
			
			Integer rtn = sysm300Service.SYSM300UPT01(this.objectMapper.convertValue(jsonArray, new TypeReference<List<SYSM300VO>>() {}));
			
			if (rtn >= 0) {
				rtn = sysm300Service.SYSM300DEL02(this.objectMapper.convertValue(jsonArray, new TypeReference<List<SYSM300VO>>() {}));
				if (rtn >= 0) {
					rtn = sysm300Service.SYSM300INS02(this.objectMapper.convertValue(jsonArray, new TypeReference<List<SYSM300VO>>() {}));
					if (rtn > 0) {
						resultMap.put("msg", "정상적으로 저장되었습니다.");
					}
				}
			}

		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}

		return resultMap;
	}

	/**
	 * @Method Name : SYSM300DEL01
	 * @작성일      : 2022.07.11
	 * @작성자      : jrlee
	 * @변경이력    :
	 * @Method 설명 : 데이터프레임 삭제
	 * @param       : ModelAndView
	 * @return : ModelAndView HashMap
	 */
	@RequestMapping(value = "/SYSM300DEL01", method = RequestMethod.POST)
	@ResponseBody
	public Map<String, Object> SYSM300DEL01(ModelAndView mav, @RequestBody String request) {
		HashMap<String, Object> resultMap = new HashMap<>();
		JSONParser parser = new JSONParser();
		try {

			JSONObject jsonObject = (JSONObject) parser.parse(request);
			JSONArray jsonArray = (JSONArray) jsonObject.get("list");

			Integer rtn = sysm300Service.SYSM300DEL01(this.objectMapper.convertValue(jsonArray, new TypeReference<List<SYSM300VO>>() {}));
			if (rtn > 0) {
				rtn = sysm300Service.SYSM300DEL02(this.objectMapper.convertValue(jsonArray, new TypeReference<List<SYSM300VO>>() {}));
				if (rtn > 0) {
					resultMap.put("msg", "정상적으로 삭제되었습니다.");
				}
			}

		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}
		return resultMap;
	}

	/**
	 * @Method Name : SYSM300SEL03
	 * @작성일      : 2022.06.21
	 * @작성자      : jrlee
	 * @변경이력    :
	 * @Method 설명 : 데이터프레임버튼 조회
	 * @param       : ModelAndView
	 * @return      : ModelAndView HashMap
	 */
	@RequestMapping(value = "/SYSM300SEL03", method = RequestMethod.POST)
	@ResponseBody
	public Map<String, Object> SYSM300SEL03(ModelAndView mav, @RequestBody String request) {
		HashMap<String, Object> resultMap = new HashMap<>();

		try {
			List<SYSM300VO> list = sysm300Service.SYSM300SEL03(this.objectMapper.readValue(request, SYSM300VO.class));

			resultMap.put("list", new ObjectMapper().writeValueAsString(list));
			resultMap.put("msg", "정상적으로 조회하였습니다.");

		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}

		return resultMap;
	}

	/**
	 * @Method Name : SYSM300INS03
	 * @작성일      : 2022.07.04
	 * @작성자      : jrlee
	 * @변경이력    :
	 * @Method 설명 : 데이터프레임버튼 추가
	 * @param       : ModelAndView
	 * @return : ModelAndView HashMap
	 */
	@RequestMapping(value = "/SYSM300INS03", method = RequestMethod.POST)
	@ResponseBody
	public Map<String, Object> SYSM300INS03(ModelAndView mav, @RequestBody String request) {
		HashMap<String, Object> resultMap = new HashMap<>();
		JSONParser parser = new JSONParser();
		try {

			JSONObject jsonObject = (JSONObject) parser.parse(request);
			JSONArray jsonArray = (JSONArray) jsonObject.get("list");

			Integer rtn = sysm300Service.SYSM300INS03(this.objectMapper.convertValue(jsonArray, new TypeReference<List<SYSM300VO>>() {}));
			if (rtn > 0) {
				resultMap.put("msg", "정상적으로 저장되었습니다.");
			}

		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}

		return resultMap;
	}

	/**
	 * @Method Name : SYSM300UPT03
	 * @작성일      : 2022.07.04
	 * @작성자      : jrlee
	 * @변경이력    :
	 * @Method 설명 : 데이터프레임버튼 수정
	 * @param       : ModelAndView
	 * @return : ModelAndView HashMap
	 */
	@RequestMapping(value = "/SYSM300UPT03", method = RequestMethod.POST)
	@ResponseBody
	public Map<String, Object> SYSM300UPT03(ModelAndView mav, @RequestBody String request) {
		HashMap<String, Object> resultMap = new HashMap<>();
		JSONParser parser = new JSONParser();
		try {

			JSONObject jsonObject = (JSONObject) parser.parse(request);
			JSONArray jsonArray = (JSONArray) jsonObject.get("list");

			Integer rtn = sysm300Service.SYSM300UPT03(this.objectMapper.convertValue(jsonArray, new TypeReference<List<SYSM300VO>>() {}));
			if (rtn > 0) {
				resultMap.put("msg", "정상적으로 저장되었습니다.");
			}

		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}

		return resultMap;
	}

	/**
	 * @Method Name : SYSM300DEL03
	 * @작성일      : 2022.07.04
	 * @작성자      : jrlee
	 * @변경이력    :
	 * @Method 설명 : 데이터프레임버튼 삭제
	 * @param       : ModelAndView
	 * @return : ModelAndView HashMap
	 */
	@RequestMapping(value = "/SYSM300DEL03", method = RequestMethod.POST)
	@ResponseBody
	public Map<String, Object> SYSM300DEL03(ModelAndView mav, @RequestBody String request) {
		HashMap<String, Object> resultMap = new HashMap<>();
		JSONParser parser = new JSONParser();
		try {

			JSONObject jsonObject = (JSONObject) parser.parse(request);
			JSONArray jsonArray = (JSONArray) jsonObject.get("list");

			Integer rtn = sysm300Service.SYSM300DEL03(this.objectMapper.convertValue(jsonArray, new TypeReference<List<SYSM300VO>>() {}));
			if (rtn > 0) {
				resultMap.put("msg", "정상적으로 삭제되었습니다.");
			}

		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}

		return resultMap;
	}
}
