package org.crm.sysm.web;

import org.crm.sysm.VO.SYSM251VO;
import org.crm.sysm.service.SYSM251Service;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.Resource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/***********************************************************************************************
* Program Name : 데이터프레임 조회 Controller
* Creator      : jrlee
* Create Date  : 2022.03.17
* Description  : 데이터프레임 조회
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.03.17     jrlee           최초생성
************************************************************************************************/
@Controller
@RequestMapping("/sysm/*")
public class SYSM251Controller {
	private static final Logger LOGGER = LoggerFactory.getLogger(SYSM251Controller.class);

	@Resource(name = "SYSM251Service")
	private SYSM251Service sysm251Service;

	private ObjectMapper objectMapper;

	@Autowired
	public SYSM251Controller(ObjectMapper objectMapper) {
		this.objectMapper = objectMapper;
	}

	/**
	 * @Method Name : SYSM251P
	 * @작성일      : 2022.03.17
	 * @작성자      : jrlee
	 * @변경이력    :
	 * @Method 설명 : sysm/SYSM251P 웹 페이지 열기
	 * @param       :
	 * @return      : sysm/SYSM251P.jsp
	 */
	@RequestMapping("/SYSM251P")
	public String SYSM251P() {
		return "th/sysm/SYSM251P";
	}

	@GetMapping("/SYSM252P")
	public String SYSM252P() {
		return "th/sysm/SYSM252P";
	}

	/**
	 * @Method Name : SYSM251SEL01
	 * @작성일      : 2022.03.18
	 * @작성자      : jrlee
	 * @변경이력    :
	 * @Method 설명 : 데이터프레임 조회
	 * @param       : ModelAndView
	 * @return      : ModelAndView HashMap
	 */
	@PostMapping(value = "/SYSM251SEL01")
	@ResponseBody
	public Map<String, Object> SYSM251SEL01(ModelAndView mav, @RequestBody String request) {
		HashMap<String, Object> resultMap = new HashMap<>();

		try {
			List<SYSM251VO> list = sysm251Service.SYSM251SEL01(this.objectMapper.readValue(request, SYSM251VO.class));

			resultMap.put("list", new ObjectMapper().writeValueAsString(list));
			resultMap.put("count", list.size());
			resultMap.put("msg", "정상적으로 조회하였습니다.");

		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}
		return resultMap;
	}
}
