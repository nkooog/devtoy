package org.crm.cmmt.web;

import org.crm.cmmt.VO.CMMT400VO;
import org.crm.cmmt.VO.CMMT440VO;
import org.crm.cmmt.service.CMMT400Service;
import org.crm.dash.VO.DASH100VO;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
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

/***********************************************************************************************
* Program Name : 공지사항상세 팝업 Controller
* Creator      : 김보영
* Create Date  : 2022.01.10
* Description  : 통합계시글관리
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.01.10    김보영           최초생성
************************************************************************************************/
@Controller
@RequestMapping("/cmmt/*")
public class CMMT400Controller {

	@Resource(name = "CMMT400Service")
	private CMMT400Service CMMT400Service;
	
	@Autowired
	private ObjectMapper objectMapper;

	private static final Logger LOGGER = LoggerFactory.getLogger(CMMT400Controller.class);

	
	/**
	 * @Method Name : CMMT400M
	 * @작성일      : 2022.01.10
	 * @작성자      : bykim
	 * @변경이력    : 
	 * @Method 설명 : CMMT/CMMT400M 웹 페이지 열기
	 * @param       :  
	 * @return      : CMMT/CMMT400M.jsp 
	 */	
	@RequestMapping("/CMMT400M")
	public String CMMT400M() {
		LOGGER.info("CMMT400M 페이지 열기");
		return "th/cmmt/CMMT400M";
	}

	/**
	 * @Method Name : CMMT401P
	 * @작성일      : 2022.01.10
	 * @작성자      : bykim
	 * @변경이력    :
	 * @Method 설명 : CMMT/CMMT401P 웹 페이지 열기
	 * @param       :
	 * @return      : CMMT/CMMT401P.jsp
	 */
	@RequestMapping("/CMMT401P")
	public String CMMT401P() {
		LOGGER.info("CMMT401P 페이지 열기");
		return "th/cmmt/CMMT401P";
	}


	/**
	 * @Method Name : CMMT402P
	 * @작성일      : 2022.01.10
	 * @작성자      : bykim
	 * @변경이력    :
	 * @Method 설명 : CMMT/CMMT402P 웹 페이지 열기
	 * @param       :
	 * @return      : CMMT/CMMT402P.jsp
	 */
	@RequestMapping("/CMMT402P")
	public String CMMT402P() {
		LOGGER.info("CMMT402P 페이지 열기");
		return "th/cmmt/CMMT402P";
	}

	/**
	 * @Method Name : CMMT400SEL01
	 * @작성일      : 2022.01.10
	 * @작성자      : bykim
	 * @변경이력    : 
	 * @Method 설명 : 게시판 조직권한 조회
	 * @param       : HttpServletRequest Restful param
	 * @return      : ModelAndView HashMap
	 */    
	@RequestMapping(value ="/CMMT400SEL01", method = RequestMethod.POST)
	@ResponseBody    
	public Map<String, Object> CMMT400SEL01(ModelAndView mav, @RequestBody String req){
		HashMap<String, Object> resultMap = new HashMap<String, Object>();

		try {
			CMMT440VO CMMT440VO = this.objectMapper.readValue(req, CMMT440VO.class);

			List<DASH100VO> list0 = CMMT400Service.CMMT400SEL01(CMMT440VO);

			resultMap.put("count", list0.size());
			resultMap.put("list", this.objectMapper.writeValueAsString(list0));
			resultMap.put("totalList", this.objectMapper.writeValueAsString(CMMT400Service.CMMT400SEL01(CMMT440VO)));
			resultMap.put("msg", "정상적으로 조회하였습니다.");

		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}
		return resultMap;
	}

	/**
	 * @Method Name : CMMT400UPT01
	 * @작성일      : 2023.06.10
	 * @작성자      : bykim
	 * @변경이력    :
	 * @Method 설명 :  일정 알람 수정
	 * @param       : HttpServletRequest - json 배열   "list" :  [{id : "", name : ""},{id : "", name : ""}] 구조
	 * @return      : ModelAndView HashMap
	 */
	@RequestMapping(value ="/CMMT400UPT01", method = RequestMethod.POST)
	@ResponseBody
	public Map<String, Object> CMMT400UPT01(ModelAndView mav, @RequestBody String req,
	                                 SessionStatus status)  {

		HashMap<String, Object> hashMap = new HashMap<String, Object>();

		try {
			CMMT400VO vo = this.objectMapper.readValue(req, CMMT400VO.class);

			Integer rtn = CMMT400Service.CMMT400UPT01(vo);

			if(rtn > 0) {
				status.setComplete();
				hashMap.put("result", "Update Success");
				hashMap.put("msg", "정상적으로 변경하였습니다.");
			}

		}catch(Exception e) {
			LOGGER.error("["+e.getClass()+"] Exception : " + e.getMessage());
		}
		return hashMap;

	}

	/**
	 * @Method Name : CMMT400UPT02
	 * @작성일      : 2023.06.10
	 * @작성자      : bykim
	 * @변경이력    :
	 * @Method 설명 :  일정 알람 수정
	 * @param       : HttpServletRequest - json 배열   "list" :  [{id : "", name : ""},{id : "", name : ""}] 구조
	 * @return      : ModelAndView HashMap
	 */
	@RequestMapping(value ="/CMMT400UPT02", method = RequestMethod.POST)
	@ResponseBody
	public Map<String, Object> CMMT400UPT02(ModelAndView mav, @RequestBody String req,
	                                 SessionStatus status)  {

		HashMap<String, Object> hashMap = new HashMap<String, Object>();

		try {
			CMMT400VO vo = this.objectMapper.readValue(req, CMMT400VO.class);
			Integer rtn = CMMT400Service.CMMT400UPT02(vo);

			if(rtn > 0) {
				status.setComplete();
				hashMap.put("result", "Update Success");
				hashMap.put("msg", "정상적으로 변경하였습니다.");
			}
		}catch(Exception e) {
			LOGGER.error("["+e.getClass()+"] Exception : " + e.getMessage());
		}
		return hashMap;

	}

}

