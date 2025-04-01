package org.crm.frme.web;

import org.crm.frme.VO.FRME290VO;
import org.crm.frme.service.FRME290Service;
import org.crm.lgin.VO.LGIN000VO;
import org.crm.lgin.service.LGIN000Service;
import org.crm.util.com.ComnFun;
import org.crm.util.crypto.AES256Crypt;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.util.HashMap;
import java.util.List;
import java.util.Locale;

/***********************************************************************************************
* Program Name : 주업무전환 팝업 Controller
* Creator      : jrlee
* Create Date  : 2022.05.06
* Description  : 주업무전환 팝업
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.05.06     jrlee            최초생성
* 2024.12.02     박준영           egov->springboot mig
************************************************************************************************/
@Slf4j
@Controller
@RequestMapping("/frme/*")
public class FRME290Controller {

	private static final Logger LOGGER = LoggerFactory.getLogger(FRME290Controller.class);

	@Resource(name = "LGIN000Service")
	private LGIN000Service lgin000Service;

	@Resource(name = "FRME290Service")
	private FRME290Service frme290Service;

	@Autowired
	private ObjectMapper objectMapper;

	@Autowired
	private MessageSource messageSource;

	/**
	 * @Method Name : FRME290P
	 * @작성일      : 2022.05.06
	 * @작성자      : jrlee
	 * @변경이력    :
	 * @Method 설명 : frme/FRME290P 페이지 열기
	 * @param       :
	 * @return      : frme/FRME290P.jsp
	 */
	@RequestMapping("/FRME290P")
	public String FRME290P() {
		log.debug("FRME290P 페이지 열기");
		return "th/frme/FRME290P";
	}

	/**
	 * @Method Name : FRME290SEL01
	 * @작성일      : 2022.05.10
	 * @작성자      : jrlee
	 * @변경이력    :
	 * @Method 설명 : 그룹 조회
	 * @param       : ModelAndView
	 * @return      : ModelAndView HashMap
	 */
	@RequestMapping(value = "/FRME290SEL01", method = RequestMethod.POST)
	@ResponseBody
	public HashMap<String, Object> FRME290SEL01(ModelAndView mav, @RequestBody String request, Locale locale) {

		HashMap<String, Object> resultMap = new HashMap<>();
		JSONParser parser = new JSONParser();

		try {
			JSONObject json = (JSONObject) parser.parse(request);
			List<FRME290VO> list = frme290Service.FRME290SEL01(this.objectMapper.convertValue(json, FRME290VO.class));

			resultMap.put("list", this.objectMapper.writeValueAsString(list));
			resultMap.put("msg", this.messageSource.getMessage("success.common.select", null, "success select", locale));

		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
			resultMap.put("msg", this.messageSource.getMessage("fail.request.msg", null, "select fail", locale));
		}

		return resultMap;
	}

	/**
	 * @Method Name : FRME290UPT01
	 * @작성일      : 2022.05.10
	 * @작성자      : jrlee
	 * @변경이력    :
	 * @Method 설명 : 업무선택 수정
	 * @param       : ModelAndView
	 * @return      : ModelAndView HashMap
	 */
	@PostMapping(value = "/FRME290UPT01")
	@ResponseBody
	public HashMap<String, Object> FRME290UPT01(@RequestBody String request, HttpSession session, Locale locale) {
		HashMap<String, Object> resultMap = new HashMap<>();
		JSONParser parser = new JSONParser();
		try {
			JSONObject json = (JSONObject) parser.parse(request);
			FRME290VO frme290VO = this.objectMapper.convertValue(json, FRME290VO.class);

			Integer result = frme290Service.FRME290UPT01(frme290VO);
			if (result > 0) {

				//세션 업데이트
				LGIN000VO selectVo = new LGIN000VO();
				selectVo.setTenantId(frme290VO.getTenantId());
				selectVo.setUsrId(frme290VO.getUsrId());
				selectVo.setMlingCd(frme290VO.getMlingCd());

				LGIN000VO sessionVO = lgin000Service.LGIN000SEL02(selectVo);
				sessionVO.setOriginTenantId(frme290VO.getOriginTenantId());
				sessionVO.setOriginUsrGrd(frme290VO.getOriginUsrGrd());
				sessionVO.setExtNoUseYn(frme290VO.getExtNoUseYn());  //내선번호사용여부 : 로그인시 조회하지 않는 항목 별도 set
				//복호화 Set
				sessionVO.setDecUsrNm(AES256Crypt.decrypt(sessionVO.getUsrNm()));
				if(!ComnFun.isEmptyObj(sessionVO.getEmlAddrIsd())) {
					sessionVO.setDecEmlAddrIsd(AES256Crypt.decrypt(sessionVO.getEmlAddrIsd()));
				}
				if(!ComnFun.isEmptyObj(sessionVO.getDecEmlAddrExtn())) {
					sessionVO.setDecEmlAddrExtn(AES256Crypt.decrypt(sessionVO.getDecEmlAddrExtn()));
				}
				session.setAttribute("user", sessionVO);

				//결과 전송
				resultMap.put("msg", messageSource.getMessage("success.common.select", null, "success select", locale));
			}

		} catch (Exception e) {
			resultMap.put("msg", messageSource.getMessage("fail.request.msg", null, "select fail", locale));
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}

		return resultMap;
	}
}
