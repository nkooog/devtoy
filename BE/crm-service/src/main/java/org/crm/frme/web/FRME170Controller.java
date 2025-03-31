package org.crm.frme.web;

import org.crm.cmmt.VO.CMMT400VO;
import org.crm.cmmt.VO.CMMT500VO;
import org.crm.cmmt.service.CMMT400Service;
import org.crm.cmmt.service.CMMT500Service;
import org.crm.dash.VO.DASH100VO;
import org.crm.dash.service.DASH100Service;
import org.crm.frme.VO.FRME170VO;
import org.crm.frme.service.FRME170Service;
import org.crm.lgin.VO.LGIN000VO;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;
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

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/***********************************************************************************************
* Program Name : 알림 팝업 Controller
* Creator      : jrlee
* Create Date  : 2022.05.19
* Description  : 알림 팝업
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.05.19     jrlee            최초생성
************************************************************************************************/
@Slf4j
@Controller
@RequestMapping("/frme/*")
public class FRME170Controller {
	private static final Logger LOGGER = LoggerFactory.getLogger(FRME170Controller.class);

	@Resource(name = "FRME170Service")
	private FRME170Service frme170Service;

	@Resource(name = "DASH100Service")
	private DASH100Service dash100Service;

	@Resource(name = "CMMT500Service")
	private CMMT500Service cmmt500Service;

	@Resource(name = "CMMT400Service")
	private CMMT400Service cmmt400Service;

	@Autowired
	private ObjectMapper objectMapper;

	/**
	 * @Method Name : FRME170P
	 * @작성일      : 2022.05.19
	 * @작성자      : jrlee
	 * @변경이력    :
	 * @Method 설명 : frme/FRME170P 페이지 열기
	 * @param       :
	 * @return      : frme/FRME170P.jsp
	 */
	@RequestMapping("/FRME170P")
	public String FRME170P() {
		return "th/frme/FRME170P";
	}

	/**
	 * @Method Name : FRME170SEL01
	 * @작성일      : 2022.05.24
	 * @작성자      : jrlee
	 * @변경이력    : 2023.06.12 - sql 쿼리 변경 (wkim)
	 * @Method 설명 : restful 알림 개수 조회
	 * @param       : ModelAndView
	 * @return      : ModelAndView HashMap
	 */
	@PostMapping(value = "/FRME170SEL01")
	@ResponseBody
	public Map<String, Object> FRME170SEL01(@RequestBody String request, HttpSession session) {
		HashMap<String, Object> resultMap = new HashMap<>();
		JSONParser parser = new JSONParser();

		try {
			JSONObject jsonStr = (JSONObject) parser.parse(request);

			List<FRME170VO> frme170SEL01 = frme170Service.FRME170SEL01(this.objectMapper.convertValue(jsonStr, FRME170VO.class));	// 통합게시판
			int 			frme170SEL02 = frme170Service.FRME170SEL02(this.objectMapper.convertValue(jsonStr, FRME170VO.class));	// 통합게시판-승인필요
			
			int 			frme170SEL03 = frme170Service.FRME170SEL03(this.objectMapper.convertValue(jsonStr, FRME170VO.class));	// 통합게시판
			int 			frme170SEL04 = frme170Service.FRME170SEL04(this.objectMapper.convertValue(jsonStr, FRME170VO.class));	// 통합게시판-승인필요
			
			List<DASH100VO> dash100sel06 = dash100Service.DASH100SEL06(this.objectMapper.convertValue(jsonStr, DASH100VO.class));	// 통화예약
			List<CMMT500VO> cmmt500sel11 = cmmt500Service.CMMT500SEL11(this.objectMapper.convertValue(jsonStr, CMMT500VO.class));	// 받은쪽지함
			List<DASH100VO> dash100sel08 = dash100Service.DASH100SEL08(this.objectMapper.convertValue(jsonStr, DASH100VO.class));	// 업무이관

			LGIN000VO user = (LGIN000VO) session.getAttribute("user");
			List<DASH100VO> dash100sel05 = dash100Service.DASH100SEL05(this.objectMapper.convertValue(jsonStr, DASH100VO.class), user.getPersonInfoMask());	// IVR 콜백
			List<DASH100VO> dash100sel07 = dash100Service.DASH100SEL07(this.objectMapper.convertValue(jsonStr, DASH100VO.class), user.getPersonInfoMask());	// 웹 콜백
			CMMT400VO CMMT400SEL02 = cmmt400Service.CMMT400SEL03(this.objectMapper.convertValue(jsonStr, CMMT400VO.class));	// 일정관리

			List<CMMT500VO> cmmt500sel11FilterList = cmmt500sel11.stream().filter(x -> x.getRecvNoteStCd().equals("1")).collect(Collectors.toList());	// 미열람건

			resultMap.put("communityCnt", frme170SEL01.size());
			resultMap.put("communityTubcCnt", frme170SEL02);
			resultMap.put("knowledgeCnt", frme170SEL03);
			resultMap.put("knowledgeTubcCnt", frme170SEL04);
			resultMap.put("reservationCnt", dash100sel06.size());
			resultMap.put("noteCnt", cmmt500sel11FilterList.size());
			resultMap.put("bizTrclCnt", dash100sel08.size());
			resultMap.put("cabackCnt", dash100sel05.size() + dash100sel07.size());
			resultMap.put("calAlrmCnt", CMMT400SEL02.getAlarmCnt());

			resultMap.put("msg", "정상적으로 조회하였습니다.");

		} catch (Exception e) {
			e.printStackTrace();
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}

		return resultMap;
	}
}