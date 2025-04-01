package org.crm.comm.web;

import jakarta.annotation.Resource;
import org.crm.comm.VO.COMM140VO;
import org.crm.comm.service.COMM140Service;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Controller;
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
* Program Name : 전역변수 (테넌트)변경 Controller
* Creator      : jrlee
* Create Date  : 2022.08.02
* Description  : 전역변수 (테넌트)변경
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.08.02     jrlee           최초생성
* 2022.01.04	 sjyang			 개발
************************************************************************************************/
@Slf4j
@Controller
@RequestMapping("/comm/*")
public class COMM140Controller {
	private static final Logger LOGGER = LoggerFactory.getLogger(COMM140Controller.class);
	
	@Resource(name = "COMM140Service")
	private COMM140Service comm140Service;
	
	@Autowired
	MessageSource messageSource;

	@Autowired
	private ObjectMapper objectMapper;
	
	@RequestMapping("/COMM140M")
	public ModelAndView COMM140M() {
		return new ModelAndView("th/comm/COMM140M");
	}
	
	@RequestMapping(value ="/COMM140SEL01", method = RequestMethod.POST)
	@ResponseBody
	public Map<String, Object> COMM140SEL01(Locale locale,  @RequestBody String req){
		HashMap<String, Object> resultMap = new HashMap<>();
		try {

			List<COMM140VO> list = comm140Service.COMM140SEL01(this.objectMapper.readValue(req , COMM140VO.class));
			
			resultMap.put("count", list.size());
			resultMap.put("list", this.objectMapper.writeValueAsString(list));
			resultMap.put("msg", messageSource.getMessage("success.common.select", null, "success.common.select", locale));

		}catch (Exception e){
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
			e.printStackTrace();
		}
		return resultMap;
	}
	
	
	@RequestMapping(value ="/COMM140UPT01", method = RequestMethod.POST)
	@ResponseBody
	public Map<String, Object> COMM140UPT01(Locale locale, ModelAndView mav, @RequestBody String req){
		HashMap<String, Object> resultMap = new HashMap<>();
		String result = "fail";
		String msg = messageSource.getMessage("fail.common.update", null, "fail.common.update", locale);
		
		try {

			JsonNode root = this.objectMapper.readTree(req);
			List<COMM140VO> list = this.objectMapper.convertValue(root.get("list"), new TypeReference<List<COMM140VO>>() {});
			int rtn = comm140Service.COMM140UPT01(list);

			if (rtn > 0) {
				msg = messageSource.getMessage("success.common.save", null, "success.common.save", locale);
				result = "success";
			}

			resultMap.put("result",  result);
			resultMap.put("msg", msg);
		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
			e.printStackTrace();
		}

		return resultMap;
	}
	
}
