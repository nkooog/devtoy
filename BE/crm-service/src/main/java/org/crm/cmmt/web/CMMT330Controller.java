package org.crm.cmmt.web;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.crm.cmmt.VO.CMMT330VO;
import org.crm.cmmt.service.CMMT330Service;
import org.crm.util.json.JsonUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

/***********************************************************************************************
 * Program Name : 반려사유 - popup Controller
 * Creator      : 이민호
 * Create Date  : 2022.07.28
 * Description  : 컨텐츠 반려사유 Popup
 * Modify Desc  :
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.78.28      이민호           최초생성
 ************************************************************************************************/
@Slf4j
@Controller
@RequestMapping("/cmmt/*")
public class CMMT330Controller {

	@Resource(name = "CMMT330Service")
	private CMMT330Service cmmt330Service;

	@Autowired
	private ObjectMapper objectMapper;

	@Autowired
	MessageSource messageSource;

	private static final Logger LOGGER = LoggerFactory.getLogger(CMMT330Controller.class);

	private CMMT330VO voSetting (HttpServletRequest req) throws Exception {
		return new Gson().fromJson(new JsonUtil().readJsonBody(req), CMMT330VO.class);
	}
	/**
	 * @Method Name : CMMT330P
	 * @작성일      : 2022.07.29
	 * @작성자      : mhlee
	 * @변경이력    : 
	 * @Method 설명 : CMMT/CMMT330P 웹 페이지 열기
	 * @param       :  
	 * @return      : CMMT/CMMT330P.jsp 
	 */	
	@RequestMapping("/CMMT330P")
	public String CMMT330P(@RequestBody String req, Model model) throws Exception {

    	model.addAttribute("param", req); // "param" 아래에 JSON 데이터를 넣음
		return "th/cmmt/CMMT330P";
	}

	/**
	 * @Method Name : CMMT331P
	 * @작성일      : 2022.07.29
	 * @작성자      : mhlee
	 * @변경이력    :
	 * @Method 설명 : CMMT/CMMT331P 웹 페이지 열기
	 * @param       :
	 * @return      : CMMT/CMMT331P.jsp
	 */

	@RequestMapping("/CMMT331P")
	public String CMMT331P() {return "th/cmmt/CMMT331P";}

	/**
	 * @Method Name : CMMT330INS01
	 * @작성일      : 2022.07.29
	 * @작성자      : 이민호
	 * @변경이력    :
	 * @Method 설명 : restful 반려 사유
	 * @param       : ModelAndView HttpServletRequest Restful param(tenantId)
	 * @return      : ModelAndView HashMap
	 */
	@RequestMapping(value ="/CMMT330INS01", method = RequestMethod.POST)
	@ResponseBody

	public Map<String, Object> CMMT330INS01(ModelAndView mav, @RequestBody String req, Locale locale){
		ObjectMapper mapper = new ObjectMapper();
		HashMap<String, Object> hashMap = new HashMap<String, Object>();
		try {
			CMMT330VO vo = this.objectMapper.readValue(req , CMMT330VO.class);
			int rtn = cmmt330Service.CMMT330INS01(vo);
			if (rtn > 0) {
				hashMap.put("result", rtn);
				hashMap.put("msg", messageSource.getMessage("success.common.save", null, "success save", locale));
			} else {
				hashMap.put("msg", messageSource.getMessage("fail.request.msg", null, "fail save", locale));
			}
		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}
		return hashMap;
	}
	/**
	 * @Method Name : CMMT331SEL01
	 * @작성일      : 2022.07.29
	 * @작성자      : 이민호
	 * @변경이력    :
	 * @Method 설명 : restful 반려 이력조회
	 * @param       : ModelAndView HttpServletRequest Restful param(tenantId)
	 * @return      : ModelAndView HashMap
	 */
	@RequestMapping(value ="/CMMT331SEL01", method = RequestMethod.POST)
	@ResponseBody

	public Map<String, Object> CMMT331SEL01(ModelAndView mav, @RequestBody String req, Locale locale){
		ObjectMapper mapper = new ObjectMapper();
		HashMap<String, Object> hashMap = new HashMap<String, Object>();
		try {
			CMMT330VO vo = this.objectMapper.readValue(req , CMMT330VO.class);

			List<CMMT330VO> CMMT331List = cmmt330Service.CMMT331SEL01(vo);

			hashMap.put("CMMT331P", mapper.writeValueAsString(CMMT331List));
			hashMap.put("msg", messageSource.getMessage("success.common.select", null, "success select", locale));
		}catch(Exception e) {
			LOGGER.error("["+e.getClass()+"] Exception : " + e.getMessage());
		}
		return hashMap;
	}
}
