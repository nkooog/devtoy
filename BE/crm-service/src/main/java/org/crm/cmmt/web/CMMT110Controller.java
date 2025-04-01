package org.crm.cmmt.web;

import org.crm.cmmt.VO.CMMT110VO;
import org.crm.cmmt.service.CMMT110Service;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
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
import java.util.stream.Collectors;

import static java.util.Objects.isNull;

/***********************************************************************************************
 * Program Name : 통합게시판 조직/등급/개별 권한
 * Creator      : 정대정
 * Create Date  : 2022.05.02
 * Description  : 통합게시판 조직/등급/개별 권한
 * Modify Desc  :
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.05.02     정대정           최초생성
 ************************************************************************************************/
@Slf4j
@Controller
@RequestMapping("/cmmt/*")
public class CMMT110Controller {

	@Resource(name = "CMMT110Service")
	private CMMT110Service CMMT110Service;

	@Autowired
	private ObjectMapper objectMapper;

	private static final Logger LOGGER = LoggerFactory.getLogger(CMMT110Controller.class);

	@RequestMapping("/CMMT110S")
	public String CMMT110S() {
		return "th/cmmt/CMMT110S";
	}

	@RequestMapping("/CMMT120S")
	public String CMMT120S() {
		return "th/cmmt/CMMT120S";
	}

	@RequestMapping("/CMMT130S")
	public String CMMT130S() {
		return "th/cmmt/CMMT130S";
	}

	/**
	 * @Method Name : CMMT110SEL01
	 * @작성일      : 2022.05.02
	 * @작성자      : byKim
	 * @변경이력    :
	 * @Method 설명 : 조직/등급/개별 권한 목록 조회
	 * @param       : HttpServletRequest Restful param
	 * @return      : ModelAndView HashMap
	 */
	@RequestMapping(value = "/CMMT110SEL01", method = RequestMethod.POST)
	@ResponseBody
	public Map<String, Object> CMMT110SEL01(ModelAndView mav, @RequestBody String req) {

		HashMap<String, Object> hashMap = new HashMap<String, Object>();
		JSONParser parser = new JSONParser();

		try {
			JSONObject obj = (JSONObject) parser.parse(req);
			//1.Grid vo data set
			CMMT110VO vo = this.objectMapper.convertValue(obj, CMMT110VO.class);

			if(!isNull(obj.get("ctgrMgntNo"))){ //개시판 번호
				vo.setCtgrMgntNo(Integer.parseInt(String.valueOf(obj.get("ctgrMgntNo"))));
			}

			//2.1.Grid list
			List<CMMT110VO> CMMT110VOGridInfo = CMMT110Service.CMMT110SEL01(vo);
			String grid = new ObjectMapper().writeValueAsString(CMMT110VOGridInfo);

			//3.Return data set
			hashMap.put("CMMT110VOGridInfo", grid);
			hashMap.put("msg", "정상적으로 조회하였습니다.");
		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}
		return hashMap;
	}

	/**
	 * @Method Name : CMMT110INS01
	 * @작성일      : 2022.05.02
	 * @작성자      : byKim
	 * @변경이력    :
	 * @Method 설명 : 조직/등급/개별 권한 목록 추가/수정
	 * @param       : HttpServletRequest Restful param
	 * @return      : ModelAndView HashMap
	 */
	@RequestMapping(value = "/CMMT110INS01", method = RequestMethod.POST)
	@ResponseBody
	public Map<String, Object> CMMT110INS01(ModelAndView mav, @RequestBody String req, SessionStatus status) {

		HashMap<String, Object> hashMap = new HashMap<String, Object>();
		JSONParser parser = new JSONParser();

		try {
			JSONObject obj = (JSONObject) parser.parse(req);
			JSONArray jsonArray = (JSONArray) obj.get("list");

			List<CMMT110VO> CMMT110VOList = (List<CMMT110VO>) jsonArray.stream()
					.map(o -> this.objectMapper.convertValue(o, CMMT110VO.class))
					.collect(Collectors.toList());

			// shpark 20240829 : 게시판 사용권한 변경 후 저장시 ctgr_use_atht_cd 가 다른 권한은 삭제.
			int deleteResult = CMMT110Service.CMMT110DEL03(CMMT110VOList.get(0));
			if(deleteResult < 0){
				hashMap.put("result", deleteResult);
				hashMap.put("msg"   , "저장 중 오류가 발생했습니다.");
			}

			// reuslt Query
			int result = CMMT110Service.CMMT110INS01(CMMT110VOList);
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
	 * @Method Name : CMMT110DEL01
	 * @작성일      : 2022.05.02
	 * @작성자      : djjung
	 * @변경이력    :
	 * @Method 설명 : 상위 조직/등급/개별 권한 목록 삭제
	 * @param       : HttpServletRequest Restful param
	 * @return      : ModelAndView HashMap
	 */
	@RequestMapping(value = "/CMMT110DEL01", method = RequestMethod.POST)
	@ResponseBody
	public Map<String, Object> CMMT110DEL01(ModelAndView mav, @RequestBody String req, BindingResult bindingResult, Model model, SessionStatus status) {

		HashMap<String, Object> hashMap = new HashMap<String, Object>();
		JSONParser parser = new JSONParser();

		try {
			JSONObject obj = (JSONObject) parser.parse(req);
			JSONArray jsonArray = (JSONArray) obj.get("list");

			List<CMMT110VO> CMMT110VOList = (List<CMMT110VO>) jsonArray.stream()
					.map(o -> this.objectMapper.convertValue(o, CMMT110VO.class))
					.collect(Collectors.toList());

			// reuslt Query
			int result = CMMT110Service.CMMT110DEL01(CMMT110VOList);
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

}
