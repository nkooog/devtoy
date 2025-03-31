package org.crm.sysm.web;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonParser;
import com.google.gson.reflect.TypeToken;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.crm.sysm.VO.SYSM130VO;
import org.crm.sysm.service.SYSM130Service;
import org.crm.util.crypto.AES256Crypt;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import java.io.BufferedReader;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/***********************************************************************************************
 * Program Name : 조직관리 Controller
 * Creator      : 정대정
 * Create Date  : 2022.01.10
 * Description  : 조직관리
 * Modify Desc  :
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.02.10     정대정           최초생성
 * 2022.03.20	 정대정			 Controller 분기 제거 -> Service 단으로 분기이동 (SEL01,SEL02)
 * 2022.03.21	 정대정			 Json util 4line -> 1line 변경(JsonUtil code 변경)
 * 								 Refactorying( volist line 2 -> line 1 변경)
 ************************************************************************************************/
@Slf4j
@Controller
@RequestMapping("/sysm/*")
public class SYSM130Controller {

	@Resource(name = "SYSM130Service")
	private SYSM130Service SYSM130Service;

	private ObjectMapper objectMapper;

	@Autowired
	public SYSM130Controller(ObjectMapper objectMapper) {
		this.objectMapper = objectMapper;
	}

	private static final Logger LOGGER = LoggerFactory.getLogger(SYSM130Controller.class);

	/**
	 * @Method Name : SYSM130M
	 * @작성일      : 2022.02.11
	 * @작성자      : djjung
	 * @변경이력    :
	 * @Method 설명 : sysm/SYSM130M 웹 페이지 열기
	 * @param       :
	 * @return      : sysm/SYSM130M.jsp
	 */
	@RequestMapping("/SYSM130M")
	public String SYSM130M() {
		return "th/sysm/SYSM130M";
	}

	/**
	 * @Method Name : SYSM130SEL01
	 * @작성일      : 2022.02.10
	 * @작성자      : djjung
	 * @변경이력    :
	 * @Method 설명 : 조직 버전 정보 조회
	 * @param       : HttpServletRequest Restful param
	 * @return      : ModelAndView HashMap
	 */
	@PostMapping(value = "/SYSM130SEL01")
	@ResponseBody
	public Map<String, Object> SYSM130SEL01(ModelAndView mav, @RequestBody String req) {
		HashMap<String, Object> hashMap = new HashMap<>();
		JSONParser parser = new JSONParser();
		try {

			JSONObject obj = (JSONObject) parser.parse(req);

			List<SYSM130VO> voList = SYSM130Service.SYSM130SEL01(this.objectMapper.convertValue(obj, SYSM130VO.class));

			for (SYSM130VO vo : voList){
				if(vo.getLstCorprNm() != null) vo.setLstCorprNm(AES256Crypt.decrypt(vo.getLstCorprNm()));
				else vo.setLstCorprNm(vo.getLstCorprId());
			}

			hashMap.put("grid", voList);
			hashMap.put("msg", "정상적으로 조회하였습니다.");
		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}
		return hashMap;
	}

	/**
	 * @Method Name : SYSM130INS01,SYSM130UPT01
	 * @작성일      : 2022.02.22
	 * @작성자      : djjung
	 * @변경이력    :
	 * @Method 설명 : 조직 버전 정보 추가
	 * @param       : HttpServletRequest Restful param
	 * @return      : ModelAndView HashMap
	 */
	@PostMapping(value = "/SYSM130INS01")
	@ResponseBody
	public Map<String, Object> SYSM130INS01(ModelAndView mav, HttpServletRequest req) {
		HashMap<String, Object> hashMap = new HashMap<>();
		Gson gson = new Gson();
		try {

			BufferedReader reader = req.getReader();
			String requestBody = reader.lines().collect(Collectors.joining(System.lineSeparator()));

			JsonArray jsonArray = JsonParser.parseString(requestBody).getAsJsonArray();

			int result =SYSM130Service.SYSM130INS01(gson.fromJson(jsonArray, new TypeToken<ArrayList<SYSM130VO>>(){}.getType())) ;
			if (result > 0){
				hashMap.put("result"   , "정상적으로 저장 하였습니다.");
			}else{
				hashMap.put("result"   , "저장 실패하였습니다.");
			}
			hashMap.put("count",result);

		}catch(Exception e) {
			LOGGER.error("["+e.getClass()+"] Exception : " + e.getMessage());
		}
		return hashMap;
	}

	/**
	 * @Method Name : SYSM130UPT03
	 * @작성일      : 2022.02.22
	 * @작성자      : djjung
	 * @변경이력    :
	 * @Method 설명 : 조직 버전 정보 수정 (조직 상태(N->Y->D 순만) 및 외부연계 코드만 수정 가능)
	 * @param       : HttpServletRequest Restful param
	 * @return      : ModelAndView HashMap
	 */
	@PostMapping(value = "/SYSM130UPT03")
	@ResponseBody
	public Map<String, Object> SYSM130UPT03(ModelAndView mav, @RequestBody String req){
		HashMap<String, Object> hashMap = new HashMap<String, Object>();
		JSONParser parser = new JSONParser();
		try {
			JSONObject obj = (JSONObject) parser.parse(req);
			int result =SYSM130Service.SYSM130UPT03(this.objectMapper.convertValue(req, SYSM130VO.class));
			if (result > 0){
				hashMap.put("result"   , "정상적으로 수정 하였습니다.");
			}else{
				hashMap.put("result"   , "수정 실패하였습니다.");
			}
			hashMap.put("count",result);

		}catch(Exception e) {
			LOGGER.error("["+e.getClass()+"] Exception : " + e.getMessage());
		}
		return hashMap;
	}

	/**
	 * @Method Name : SYSM130DEL01
	 * @작성일      : 2022.03.22
	 * @작성자      : djjung
	 * @변경이력    :
	 * @Method 설명 : 조직 버전 정보 삭제 (단, 조직상태가 미사용인 것만 제거)
	 * @param       : HttpServletRequest Restful param
	 * @return      : ModelAndView HashMap
	 */
	@PostMapping(value = "/SYSM130DEL01")
	@ResponseBody
	public Map<String, Object> SYSM130DEL01(ModelAndView mav, @RequestBody String req){
		HashMap<String, Object> hashMap = new HashMap<>();
		JSONParser parser = new JSONParser();
		try {
			JSONObject obj = (JSONObject) parser.parse(req);
			int result = SYSM130Service.SYSM130DEL01(this.objectMapper.convertValue(obj, SYSM130VO.class));
			if (result > 0){
				hashMap.put("result"   , "정상적으로 제거 하였습니다.");
			}else{
				hashMap.put("result"   , "제거 실패하였습니다.");
			}
			hashMap.put("count",result);

		}catch(Exception e) {
			LOGGER.error("["+e.getClass()+"] Exception : " + e.getMessage());
		}

		return hashMap;
	}

	/**
	 * 노드 순서 변경
	 * @param mav
	 * @param req
	 * @return
	 */
	@PostMapping(value = "/SYSM130UPT04")
	@ResponseBody
	public Map<String, Object> SYSM130UPT04(@RequestBody String req){
		HashMap<String, Object> hashMap = new HashMap<>();
		JSONParser parser = new JSONParser();
		try {
			JSONObject obj = (JSONObject) parser.parse(req);

			int result = SYSM130Service.SYSM130UPT04(obj);
			if (result > 0){
				hashMap.put("result"   , "정상적으로 수정 하였습니다.");
			}else{
				hashMap.put("result"   , "수정 실패하였습니다.");
			}
			hashMap.put("count",result);
		}catch(Exception e) {
			LOGGER.error("["+e.getClass()+"] Exception : " + e.getMessage());
		}

		return hashMap;
	}

}
