package org.crm.sysm.web;

import org.crm.sysm.VO.SYSM301VO;
import org.crm.sysm.service.SYSM301Service;
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
import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.TransactionDefinition;
import org.springframework.transaction.TransactionStatus;
import org.springframework.transaction.support.DefaultTransactionDefinition;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;

/***********************************************************************************************
* Program Name : 데이터프레임 템플릿 레이아웃 편집 Controller
* Creator      : jrlee
* Create Date  : 2022.07.28
* Description  : 데이터프레임 템플릿 레이아웃 편집
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.07.28     jrlee           최초생성
************************************************************************************************/
@Slf4j
@Controller
@RequestMapping("/sysm/*")
public class SYSM301Controller {

	@Autowired
	private MessageSource messageSource;

	@Autowired
	private ObjectMapper objectMapper;

	private static final Logger LOGGER = LoggerFactory.getLogger(SYSM200Controller.class);

	@Resource(name = "SYSM301Service")
	private SYSM301Service sysm301Service;

	protected DataSourceTransactionManager txManager;

	/**
	 * @Method Name : SYSM301M
	 * @작성일      : 2022.07.28
	 * @작성자      : jrlee
	 * @변경이력    : 
	 * @Method 설명 : sysm/SYSM301M 웹 페이지 열기
	 * @param       :  
	 * @return      : sysm/SYSM301M.jsp
	 */
	@RequestMapping("/SYSM301M")
	public String SYSM301M(@RequestBody String request, ModelMap model) {
		model.addAttribute("param", request);
		return "th/sysm/SYSM301M";
	}

	/**
	 * @Method Name : SYSM301M_card
	 * @작성일      : 2022.07.28
	 * @작성자      : jrlee
	 * @변경이력    :
	 * @Method 설명 : sysm/SYSM301M_card 웹 페이지 열기
	 * @param       :
	 * @return      : sysm/SYSM301M_card.jsp
	 */
	@PostMapping("/SYSM301M_card")
	public String SYSM301M_card(@RequestBody String request, ModelMap model) {
		log.debug( " request  : " + request);
		model.addAttribute("param", request);
		return "th/sysm/SYSM301M_card";
	}

	/**
	 * @Method Name : SYSM301SEL01
	 * @작성일      : 2022.08.10
	 * @작성자      : jrlee
	 * @변경이력    :
	 * @Method 설명 : 카드 기본 정보 조회
	 * @param       : ModelAndView
	 * @return      : ModelAndView HashMap
	 */
	@RequestMapping(value = "/SYSM301SEL01", method = RequestMethod.POST)
	public @ResponseBody HashMap<String, Object> SYSM301SEL01(@RequestBody String request, HttpSession session, Locale locale) {
		HashMap<String, Object> resultMap = new HashMap<>();
		JSONParser parser = new JSONParser();

		try {
			JSONObject obj = (JSONObject) parser.parse(request);

            SYSM301VO sysm301VO = this.objectMapper.convertValue(obj, SYSM301VO.class);

			SYSM301VO object = sysm301Service.SYSM301SEL01(sysm301VO);

			resultMap.put("object", new ObjectMapper().writeValueAsString(object));
			resultMap.put("msg", "정상적으로 조회하였습니다.");

		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}

		return resultMap;
	}

	/**
	 * @Method Name : SYSM301SEL02
	 * @작성일      : 2022.08.10
	 * @작성자      : jrlee
	 * @변경이력    :
	 * @Method 설명 : 항목 정보 조회
	 * @param       : ModelAndView
	 * @return      : ModelAndView HashMap
	 */
	@RequestMapping(value = "/SYSM301SEL02", method = RequestMethod.POST)
	public @ResponseBody HashMap<String, Object> SYSM301SEL02(@RequestBody String request, HttpSession session, Locale locale) {
		HashMap<String, Object> resultMap = new HashMap<>();
		JSONParser parser = new JSONParser();

		try {

			JSONObject obj = (JSONObject) parser.parse(request);
            SYSM301VO sysm301VO = this.objectMapper.convertValue(obj, SYSM301VO.class);
			List<SYSM301VO> list = sysm301Service.SYSM301SEL02(sysm301VO);

			;
			resultMap.put("list", this.objectMapper.writeValueAsString(list));
			resultMap.put("msg", "정상적으로 조회하였습니다.");

		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}

		return resultMap;
	}

	/**
	 * @Method Name : SYSM301SEL03
	 * @작성일      : 2022.08.10
	 * @작성자      : jrlee
	 * @변경이력    :
	 * @Method 설명 : 버튼 정보 조회
	 * @param       : ModelAndView
	 * @return      : ModelAndView HashMap
	 */
	@RequestMapping(value = "/SYSM301SEL03", method = RequestMethod.POST)
	public @ResponseBody HashMap<String, Object> SYSM301SEL03(@RequestBody String request, HttpSession session, Locale locale) {
		HashMap<String, Object> resultMap = new HashMap<>();
		JSONParser parser = new JSONParser();

		try {
			JSONObject obj = (JSONObject) parser.parse(request);
            SYSM301VO sysm301VO = this.objectMapper.convertValue(obj, SYSM301VO.class);
			List<SYSM301VO> list = sysm301Service.SYSM301SEL03(sysm301VO);

			resultMap.put("list", new ObjectMapper().writeValueAsString(list));
			resultMap.put("msg", "정상적으로 조회하였습니다.");

		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}

		return resultMap;
	}

	/**
	 * @Method Name : SYSM301SAVE
	 * @작성일      : 2022.08.11
	 * @작성자      : jrlee
	 * @변경이력    :
	 * @Method 설명 : 저장
	 * @param       : ModelAndView
	 * @return : ModelAndView HashMap
	 */
	@RequestMapping(value = "/SYSM301SAVE", method = RequestMethod.POST)
	public @ResponseBody HashMap<String, Object> SYSM301SAVE(@RequestBody String request, HttpSession session, Locale locale) {
		JSONParser parser = new JSONParser();

		HashMap<String, Object> resultMap = new HashMap<>();
		int result = 0;

		try {

			JSONObject obj = (JSONObject) parser.parse(request);

            SYSM301VO sysm301VO = this.objectMapper.convertValue(obj, SYSM301VO.class);
			JSONArray jsonArray = (JSONArray) obj.get("list");

			sysm301Service.SYSM301DEL03(sysm301VO);
			sysm301Service.SYSM301DEL02(sysm301VO);
			sysm301Service.SYSM301DEL01(sysm301VO);

			List<SYSM301VO> totalList = jsonArray;

			List<SYSM301VO> infoList = new ArrayList<>();
			List<SYSM301VO> menuList = new ArrayList<>();
			List<SYSM301VO> buttonList = new ArrayList<>();

			for(Object object : totalList) {
				SYSM301VO vo = this.objectMapper.convertValue(object, SYSM301VO.class);
				if(vo.getType() != null) {
					switch (vo.getType()) {
						case "info" -> infoList.add(vo);
						case "menu" -> menuList.add(vo);
						default -> buttonList.add(vo);
					}
				}
			}

			result += sysm301Service.SYSM301INS01(infoList);
			result += sysm301Service.SYSM301INS02(menuList);
			result += sysm301Service.SYSM301INS03(buttonList);

			if (result > 0) {
				resultMap.put("msg", "정상적으로 저장되었습니다.");
			}
		} catch (Exception e) {
			e.printStackTrace();
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}

		return resultMap;
	}

	/**
	 * @Method Name : SYSM301DELETE
	 * @작성일      : 2022.08.11
	 * @작성자      : jrlee
	 * @변경이력    :
	 * @Method 설명 : 삭제
	 * @param       : ModelAndView
	 * @return : ModelAndView HashMap
	 */
	@RequestMapping(value = "/SYSM301DELETE", method = RequestMethod.POST)
	public @ResponseBody HashMap<String, Object> SYSM301DELETE(@RequestBody String request, HttpSession session, Locale locale) {
		DefaultTransactionDefinition def = new DefaultTransactionDefinition();
		def.setPropagationBehavior(TransactionDefinition.PROPAGATION_REQUIRED);
		TransactionStatus txStatus = txManager.getTransaction(def);
		JSONParser parser = new JSONParser();

		HashMap<String, Object> resultMap = new HashMap<>();
		int result = 0;

		try {
			JSONObject obj = (JSONObject) parser.parse(request);
            SYSM301VO sysm301VO = this.objectMapper.convertValue(obj, SYSM301VO.class);

			result += sysm301Service.SYSM301DEL03(sysm301VO);
			result += sysm301Service.SYSM301DEL02(sysm301VO);
			result += sysm301Service.SYSM301DEL01(sysm301VO);

			if (result > 0) {
				resultMap.put("msg", "정상적으로 삭제되었습니다.");
			}

			txManager.commit(txStatus);
		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
			txManager.rollback(txStatus);
		}

		return resultMap;
	}
}
