package org.crm.frme.web;

import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;
import org.crm.frme.service.FRME320Service;
import org.crm.lgin.VO.LGIN000VO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import java.util.HashMap;
import java.util.Map;

/***********************************************************************************************
 * Program Name : 비밀번호 변경 팝업 Controller
 * Creator      : nyh
 * Create Date  : 2025.01.20
 * Description  : 비밀번호 변경 팝업
 * Modify Desc  :
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2025. 01.20   nyh           최초생성
 ************************************************************************************************/
@Slf4j
@Controller
@RequestMapping("/frme/*")
public class FRME320Controller {

	@Resource(name = "FRME320Service")
	private FRME320Service frme320Service;


	private static final Logger LOGGER = LoggerFactory.getLogger(FRME320Controller.class);

	/**
	 * @Method Name : FRME320P
	 * @작성일      : 2025.01.20
	 * @작성자      : nyh
	 * @변경이력    :
	 * @Method 설명 : frme/FRME320P 웹 페이지 열기
	 * @param       :
	 * @return      : frme/FRME320P.jsp
	 */
	@RequestMapping("/FRME320P")
	public String FRME320P() {
		LOGGER.info("=== 비밀번호 변경 Page ====================================");
		return "th/frme/FRME320P";
	}

	/**
     * @Method Name : FRME320SEL01
     * @작성일      : 2025.01.20
     * @작성자      : nyh
     * @변경이력    :
     * @Method 설명 :  비밀번호 변경 이력 불러오기
	 * @param       :
	 * @return      :
     */
	@RequestMapping(value ="/FRME320SEL01", method = RequestMethod.POST)
    @ResponseBody
    public  Map<String, Object> FRME320SEL01(ModelAndView mav, HttpServletRequest req, HttpSession session) {
		HashMap<String, Object> hashMap = new HashMap<String, Object>();
    	try {
			LGIN000VO user = (LGIN000VO) session.getAttribute("user");

			Map<String, Object> map = new HashMap<>();
			map.put("tenantId" , user.getTenantId());
			map.put("usrId" , user.getUsrId());

			int count = frme320Service.FRME320SEL01(map);

			hashMap.put("FRME320P_COUNT", count);
			hashMap.put("msg", "정상적으로 조회하였습니다.");

    	}catch(Exception e) {
    		LOGGER.error("["+e.getClass()+"] Exception : " + e.getMessage());
    	}
		return hashMap;
    }
}
