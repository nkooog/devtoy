package org.crm.sysm.web;

import org.crm.sysm.VO.SYSM101VO;
import org.crm.sysm.service.SYSM101Service;
import org.crm.util.json.JsonUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/***********************************************************************************************
* Program Name : 태넌트 정보관리 팝업 Controller
* Creator      : 김보영
* Create Date  : 2022.01.10
* Description  : 태넌트 정보관리
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.01.10    김보영           최초생성
************************************************************************************************/
@Slf4j
@Controller
@RequestMapping("/sysm/*")
public class SYSM101Controller {

	@Resource(name = "SYSM101Service")
	private SYSM101Service SYSM101Service;

	@Autowired
	private ObjectMapper objectMapper;

	private static final Logger LOGGER = LoggerFactory.getLogger(SYSM101Controller.class);

	/**
	 * @Method Name : SYSM101M
	 * @작성일      : 2022.01.10
	 * @작성자      : bykim
	 * @변경이력    : 
	 * @Method 설명 : sysm/SYSM101M 웹 페이지 열기
	 * @param       :  
	 * @return      : sysm/SYSM101M.jsp 
	 */
	@GetMapping("/SYSM101P")
	public String SYSM101M(ModelMap modelMap) {
		LOGGER.info("SYSM101P 페이지 열기");
		return "th/sysm/SYSM101P";
	}	


	/**
	 * @Method Name : SYSM101SEL01
	 * @작성일      : 2022.01.10
	 * @작성자      : bykim
	 * @변경이력    : 
	 * @Method 설명 : 태넌트 목록조회
	 * @param       : HttpServletRequest Restful param
	 * @return      : ModelAndView HashMap
	 */    
	@RequestMapping(value ="/SYSM101SEL01", method = RequestMethod.POST)
	@ResponseBody    
	public Map<String, Object> SYSM101SEL01(ModelAndView mav, @RequestBody String req){
		HashMap<String, Object> hashMap = new HashMap<String, Object>();
		JSONParser parser = new JSONParser();
		try {

			JSONObject obj = (JSONObject) parser.parse(req);
			
			SYSM101VO vo = new SYSM101VO();
			vo.setDmnCd(String.valueOf(obj.get("dmnCd")));
			vo.setFmnm(String.valueOf(obj.get("fmnm")));
			vo.setTenantStCd(String.valueOf(obj.get("tenantStCd")));
			List<SYSM101VO> SYSM101VOInfo = SYSM101Service.SYSM101SEL01(vo);
			
			String json = this.objectMapper.writeValueAsString(SYSM101VOInfo);
			
			LOGGER.info("SYSM101M 페이지 열기  : "+json);


			hashMap.put("SYSM101VOInfo", json);
			hashMap.put("SYSM101VOListCount", SYSM101VOInfo.size());

		}catch(Exception e) {
			LOGGER.error("["+e.getClass()+"] Exception : " + e.getMessage());
		}
		return hashMap;
	}
}
