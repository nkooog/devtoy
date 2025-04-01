package org.crm.frme.web;

import org.crm.frme.VO.FRME110VO;
import org.crm.frme.service.FRME110Service;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.support.SessionStatus;
import org.springframework.web.servlet.ModelAndView;

import java.io.File;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/***********************************************************************************************
 * Program Name : HelpDesk 팝업 Controller
 * Creator      : 이민호
 * Create Date  : 2022.03.11
 * Description  : HelpDesk 팝업
 * Modify Desc  :
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022. 03.11   이민호           최초생성
 ************************************************************************************************/
@Slf4j
@Controller
@RequestMapping("/frme/*")
public class FRME110Controller {

	@Resource(name = "FRME110Service")
	private FRME110Service frme110Service;

	@Autowired
	private ObjectMapper objectMapper;

	/**
	 * @Method Name : FRME110P
	 * @작성일      : 2022.03.11
	 * @작성자      : 이민호
	 * @변경이력    :
	 * @Method 설명 : frme/FRME110M 웹 페이지 열기
	 * @param       :
	 * @return      : frme/FRME110M.jsp
	 */
	@RequestMapping("/FRME110P")
	public String FRME110P() {
		return "th/frme/FRME110P";
	}	
	
	/**
     * @Method Name : FRME110SEL01
     * @작성일      : 2022.03.11
     * @작성자      : 이민호
     * @변경이력    :
     * @Method 설명 :  지식관리에서 사용중인 FAQ 불러오기
	 * @param       : ModelAndView HttpServletRequest Restful param(tenantId)
	 * @return      : ModelAndView HashMap
     */ 
	@PostMapping(value ="/FRME110SEL01")
    @ResponseBody 
    public Map<String, Object> FRME110P(ModelAndView mav, @RequestBody String req, SessionStatus status) {
		log.info("=== HelpDesk FAQ 조회 ====================================");
		HashMap<String, Object> hashMap = new HashMap<String, Object>();
		JSONParser jsonParser = new JSONParser();
    	try {
			JSONObject obj = (JSONObject) jsonParser.parse(req);

			log.info("=== tenantId : "     + (String) obj.get("tenantId"));

			FRME110VO vo = FRME110VO.builder()
					.tenantId(obj.get("tenantId").toString())
					.build();

			List<FRME110VO> FRME110List = frme110Service.FRME110SEL01(vo);
			String json = this.objectMapper.writeValueAsString(FRME110List);

			hashMap.put("FRME110P", json);
			hashMap.put("msg", "정상적으로 조회하였습니다.");

    	}catch(Exception e) {
    		log.error("["+e.getClass()+"] Exception : " + e.getMessage());
    	}
		return hashMap;
    }

	@RequestMapping(value ="/download")
	@ResponseBody
	public ModelAndView download(HttpServletRequest request, @RequestParam HashMap<Object, Object> params, ModelAndView mav) {
		try {

			String fileName = "manager.pdf";
			if(params.get("urlPath").toString().equals("1")) fileName = "user.pdf";

			ClassPathResource resource = new ClassPathResource("static/file/" + fileName);

			File file = resource.getFile();

			mav.setViewName("downloadView");
			mav.addObject("downloadFile", file);
		} catch (Exception e) {
			log.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}
		return mav;
	}
	
}
