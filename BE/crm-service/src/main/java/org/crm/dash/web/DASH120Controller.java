package org.crm.dash.web;

import org.crm.config.spring.config.PropertiesService;
import org.crm.dash.VO.DASH120VO;
import org.crm.dash.service.DASH120Service;
import com.fasterxml.jackson.core.type.TypeReference;
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
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;

import java.io.File;
import java.util.*;

/***********************************************************************************************
 * Program Name : 대시보드 항목관리 Controller Creator : 강동우 Create Date : 2022.05.17
 * Description : 대시보드 항목관리 Modify Desc :
 * -----------------------------------------------------------------------------------------------
 * Date | Updater | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.05.17 강동우 최초생성 2022.09.20 김보영 수정
 ************************************************************************************************/
@Slf4j
@Controller
@RequestMapping("/dash/*")
public class DASH120Controller {

	@Resource(name = "DASH120Service")
	private DASH120Service dash120Service;

	@Resource( name = "propertiesService" )
	private PropertiesService propertiesService;

	@Autowired
	private MessageSource messageSource;

	@Autowired
	private ObjectMapper objectMapper;

	private static final Logger LOGGER = LoggerFactory.getLogger(DASH120Controller.class);

	@GetMapping("/DASH120M")
	public String DASH120M() {
		return "th/dash/DASH120M";
	}

	/**
	 * @Method Name : DASH120SEL01
	 * @작성일 : 2022.05.18
	 * @작성자 : 강동우
	 * @변경이력 :
	 * @Method 설명 : 팔레트 조회
	 * @param : @RequestBody StringRestful param
	 * @return : ModelAndView HashMap
	 */
	@PostMapping(value = "/DASH120SEL01")
	@ResponseBody
	public Map<String, Object> DASH120SEL01(@RequestBody String req, Locale locale) {
		HashMap<String, Object> resultMap = new HashMap<String, Object>();
		JSONParser parser = new JSONParser();
		try {
			JSONObject jsonObject = (JSONObject) parser.parse(req);
			DASH120VO DASH120VO = this.objectMapper.convertValue(jsonObject, DASH120VO.class);

			List<DASH120VO> list = dash120Service.DASH120SEL01(DASH120VO);

			resultMap.put("count", list.size());
			resultMap.put("list", objectMapper.writeValueAsString(list));
			resultMap.put("totalList", objectMapper.writeValueAsString(dash120Service.DASH120SEL01(DASH120VO)));
			resultMap.put("msg", messageSource.getMessage("success.common.select", null, "success select", locale));

		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}
		return resultMap;
	}

	/**
	 * @Method Name : DASH120SEL02
	 * @작성일 : 2022.05.18
	 * @작성자 : 강동우
	 * @변경이력 :
	 * @Method 설명 : 팔레트 항목조회
	 * @param : @RequestBody StringRestful param
	 * @return : ModelAndView HashMap
	 */
	@PostMapping(value = "/DASH120SEL02")
	@ResponseBody
	public Map<String, Object> DASH120SEL02( @RequestBody String req, Locale locale) {
		HashMap<String, Object> resultMap = new HashMap<String, Object>();
		JSONParser parser = new JSONParser();
		try {
			JSONObject jsonObject = (JSONObject) parser.parse(req);
			DASH120VO DASH120VO = this.objectMapper.convertValue(jsonObject, DASH120VO.class);

			List<DASH120VO> list = dash120Service.DASH120SEL02(DASH120VO);

			resultMap.put("count", list.size());
			resultMap.put("list", objectMapper.writeValueAsString(list));
			resultMap.put("totalList", objectMapper.writeValueAsString(dash120Service.DASH120SEL02(DASH120VO)));
			resultMap.put("msg", messageSource.getMessage("success.common.select", null, "success select", locale));

		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}
		return resultMap;
	}

	/**
	 * @Method Name : DASH120SEL03
	 * @작성일 : 2022.05.18
	 * @작성자 : 강동우
	 * @변경이력 :
	 * @Method 설명 : 슬로건 상세 조회
	 * @param : @RequestBody StringRestful param
	 * @return : ModelAndView HashMap
	 */
	@PostMapping(value = "/DASH120SEL03")
	@ResponseBody
	public Map<String, Object> DASH120SEL03( @RequestBody String req, Locale locale) {
		HashMap<String, Object> resultMap = new HashMap<String, Object>();
		JSONParser parser = new JSONParser();
		try {
			JSONObject jsonObject = (JSONObject) parser.parse(req);
			DASH120VO DASH120VO = this.objectMapper.convertValue(jsonObject, DASH120VO.class);

			List<DASH120VO> list = dash120Service.DASH120SEL03(DASH120VO);

			resultMap.put("count", list.size());
			resultMap.put("list", objectMapper.writeValueAsString(list));
			resultMap.put("totalList", objectMapper.writeValueAsString(dash120Service.DASH120SEL03(DASH120VO)));
			resultMap.put("msg", messageSource.getMessage("success.common.select", null, "success select", locale));

		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}
		return resultMap;
	}

	/**
	 * @Method Name : DASH120SEL04
	 * @작성일 : 2022.05.18
	 * @작성자 : 강동우
	 * @변경이력 :
	 * @Method 설명 : 오늘의 명언
	 * @param : @RequestBody StringRestful param
	 * @return : ModelAndView HashMap
	 */
	@RequestMapping(value = "/DASH120SEL04")
	@ResponseBody
	public Map<String, Object> DASH120SEL04(ModelAndView mav, @RequestBody String req, HttpSession session, Locale locale) {
		HashMap<String, Object> resultMap = new HashMap<String, Object>();
		JSONParser parser = new JSONParser();
		try {
			JSONObject jsonObject = (JSONObject) parser.parse(req);
			DASH120VO DASH120VO = this.objectMapper.convertValue(jsonObject, DASH120VO.class);

			List<DASH120VO> list = dash120Service.DASH120SEL04(DASH120VO);

			resultMap.put("count", list.size());
			resultMap.put("list", objectMapper.writeValueAsString(list));
			resultMap.put("totalList", objectMapper.writeValueAsString(dash120Service.DASH120SEL04(DASH120VO)));
			resultMap.put("msg", messageSource.getMessage("success.common.select", null, "success select", locale));

		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}
		return resultMap;
	}

	/**
	 * @Method Name : DASH120INS00
	 * @작성일 : 2022.12.22
	 * @작성자 : 이민호
	 * @변경이력 :
	 * @Method 설명 : 팔레트 추가
	 * @param : ModelAndView
	 * @return : ModelAndView HashMap
	 */
	@RequestMapping(value = "/DASH120INS00")
	@ResponseBody
	public Map<String, Object> DASH120INS00(ModelAndView mav, @RequestBody String request, Locale locale) {
		HashMap<String, Object> resultMap = new HashMap<String, Object>();
		JSONParser parser = new JSONParser();
		try {
			JSONObject jsonObject = (JSONObject) parser.parse(request);
			JSONArray jsonArray = (JSONArray) jsonObject.get("list");

			int rtn = dash120Service.DASH120INS00(this.objectMapper.convertValue(jsonArray, new TypeReference<List<DASH120VO>>() {}));
			if (rtn > 0) {
				resultMap.put("msg", messageSource.getMessage("success.common.insert", null, "success insert", locale));
			}

		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}
		return resultMap;
	}

	/**
	 * @Method Name : DASH120DEL00
	 * @작성일 : 2022.12.26
	 * @작성자 : 이민호
	 * @변경이력 :
	 * @Method 설명 : 팔레트 삭제
	 * @param : ModelAndView
	 * @return : ModelAndView HashMap
	 */
	@RequestMapping(value = "/DASH120DEL00")
	@ResponseBody
	public Map<String, Object> DASH120DEL00(ModelAndView mav, @RequestBody String request, Locale locale) {
		HashMap<String, Object> resultMap = new HashMap<String, Object>();
		JSONParser parser = new JSONParser();

		try {
			JSONObject jsonObject = (JSONObject) parser.parse(request);
			JSONArray jsonArray = (JSONArray) jsonObject.get("list");

			Integer rtn = dash120Service.DASH120DEL00(this.objectMapper.convertValue(jsonArray, new TypeReference<List<DASH120VO>>() {}));
			if (rtn > 0) {
				resultMap.put("msg", messageSource.getMessage("success.common.delete", null, "success delete", locale));
			}

		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}
		return resultMap;
	}

	/**
	 * @Method Name : DASH120INS01
	 * @작성일 : 2022.05.18
	 * @작성자 : 강동우
	 * @변경이력 :
	 * @Method 설명 : 팔레트 항목 추가
	 * @param : ModelAndView
	 * @return : ModelAndView HashMap
	 */
	@RequestMapping(value = "/DASH120INS01")
	@ResponseBody
	public Map<String, Object> DASH120INS01(ModelAndView mav, @RequestBody String request, Locale locale) {
		HashMap<String, Object> resultMap = new HashMap<String, Object>();
		JSONParser parser = new JSONParser();

		try {
			JSONObject jsonObject = (JSONObject) parser.parse(request);
			JSONArray jsonArray = (JSONArray) jsonObject.get("list");

			Integer rtn = dash120Service.DASH120INS01(this.objectMapper.convertValue(jsonArray, new TypeReference<List<DASH120VO>>() {}));
			if (rtn > 0) {
				resultMap.put("msg", messageSource.getMessage("success.common.insert", null, "success insert", locale));
			}

		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}
		return resultMap;
	}

	/**
	 * @Method Name : DASH120INS02
	 * @작성일 : 2022.06.16
	 * @작성자 : 강동우
	 * @변경이력 :
	 * @Method 설명 : 슬로건 추가 및 수정
	 * @param : ModelAndView
	 * @return : ModelAndView HashMap
	 */
	@RequestMapping(value = "/DASH120INS02")
	@ResponseBody
	public Map<String, Object> DASH120INS02(ModelAndView mav, @RequestBody String request, Locale locale) {
		HashMap<String, Object> resultMap = new HashMap<String, Object>();
		JSONParser parser = new JSONParser();

		try {

			List<DASH120VO> dash120VoList = new ArrayList<>();
			JSONObject jsonObjResv = (JSONObject) parser.parse(request);
			JSONArray jsonArrResv = (JSONArray) jsonObjResv.get("list");

			for (Object arr : jsonArrResv) {
				JSONObject obj = (JSONObject) arr; // JSONArray 데이터를 하나씩 가져와 JSONObject로 변환해준다.

				// 값을 VO에 넣어준다.
				DASH120VO dash120VO = new DASH120VO();

				dash120VO = this.objectMapper.convertValue(obj, DASH120VO.class);

				dash120VoList.add(dash120VO); // list에 추가해준다.
			}

			Integer rtn = dash120Service.DASH120INS02(dash120VoList);

			if (rtn > 0) {
				resultMap.put("msg", messageSource.getMessage("success.common.insert", null, "success insert", locale));
			}

		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}

		mav.setViewName("jsonView");

		return resultMap;
	}

	/**
	 * @Method Name : DASH120DEL01
	 * @작성일 : 2022.06.17
	 * @작성자 : 강동우
	 * @변경이력 :
	 * @Method 설명 : 슬로건 삭제
	 * @param : ModelAndView
	 * @return : ModelAndView HashMap
	 */
	@RequestMapping(value = "/DASH120DEL01")
	@ResponseBody
	public Map<String, Object> DASH120DEL01(ModelAndView mav, @RequestBody String request, Locale locale) {
		HashMap<String, Object> resultMap = new HashMap<String, Object>();
		JSONParser parser = new JSONParser();

		try {
			JSONObject jsonObject = (JSONObject) parser.parse(request);
			JSONArray jsonArray = (JSONArray) jsonObject.get("list");

			Integer rtn = dash120Service.DASH120DEL01(this.objectMapper.convertValue(jsonArray, new TypeReference<List<DASH120VO>>() {}));

			resultMap.put("msg", (rtn > 0) ? messageSource.getMessage("success.common.delete", null, "success delete", locale)
							               : messageSource.getMessage("fail.common.delete", null, "fail delete", locale));
		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}
		return resultMap;
	}

	/**
	 * @Method Name : DASH120INS03
	 * @작성일 : 2022.06.22
	 * @작성자 : 강동우
	 * @변경이력 :
	 * @Method 설명 : 오늘의 명언, 테마이미지 추가 및 수정
	 * @param : ModelAndView
	 * @return : ModelAndView HashMap
	 */
	@PostMapping(value = "/DASH120INS03", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	@ResponseBody
	public Map<String, Object> DASH120INS03(ModelAndView mav, @ModelAttribute DASH120VO formData, Locale locale) {
		HashMap<String, Object> resultMap = new HashMap<String, Object>();
		JSONParser parser = new JSONParser();
		try {
			List<DASH120VO> dash120voList = formData.getDASH120VOlist();
			DASH120VO jsonVo = new DASH120VO();
			String uploadPath = dash120voList.get(0).getPltItemCd().equals("T05")
					? propertiesService.getString("DASH_IMG")
					: propertiesService.getString("DASH");
			jsonVo.setTenantId(dash120voList.get(0).getTenantId());
			jsonVo.setRegrId(dash120voList.get(0).getRegrId());
			jsonVo.setRegrOrgCd(dash120voList.get(0).getRegrOrgCd());
			String stringVo = this.objectMapper.writeValueAsString(jsonVo);
			Integer rtn = dash120Service.DASH120INS03(uploadPath, stringVo, dash120voList);

			if (rtn > 0) {
				resultMap.put("result", new ObjectMapper().writeValueAsString(rtn));
				resultMap.put("msg", messageSource.getMessage("success.common.insert", null, "success insert", locale));
			}
			formData.setDASH120VOlist(null);
		} catch (Exception e) {
			e.printStackTrace();
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}
		return resultMap;
	}

	/**
	 * @Method Name : DASH120DEL03
	 * @작성일 : 2022.06.23
	 * @작성자 : 강동우
	 * @변경이력 :
	 * @Method 설명 : 오늘의 명언, 테마 이미지 삭제
	 * @param : ModelAndView
	 * @return : ModelAndView HashMap
	 */
	@RequestMapping(value = "/DASH120DEL03")
	@ResponseBody
	public Map<String, Object> DASH120DEL03(ModelAndView mav, @RequestBody String request, Locale locale) {
		HashMap<String, Object> resultMap = new HashMap<String, Object>();
		JSONParser parser = new JSONParser();

		try {
			JSONObject jsonObject = (JSONObject) parser.parse(request);
			JSONArray jsonArray = (JSONArray) jsonObject.get("list");

			JSONObject object = null;

			if(jsonArray != null && jsonArray.size() > 0) {
				object = (JSONObject) jsonArray.get(0);

				String uploadPath =
						"T05".equals(object.get("pltItemCd").toString())
						? propertiesService.getString("DASH_IMG")
						: propertiesService.getString("DASH");
				Integer rtn = dash120Service.DASH120DEL03(this.objectMapper.convertValue(jsonArray, new TypeReference<List<DASH120VO>>() {}), uploadPath);
				if (rtn > 0) {
					resultMap.put("msg", messageSource.getMessage("success.common.delete", null, "success delete", locale));
				} else {
					resultMap.put("msg", messageSource.getMessage("fail.common.delete", null, "fail delete", locale));
				}

			}
		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}
		return resultMap;
	}

	/**
	 * @Method Name : DASH120UPT01
	 * @작성일 : 2022.06.24
	 * @작성자 : 강동우
	 * @변경이력 :
	 * @Method 설명 : 첨부파일 디렉토리에 저장
	 * @param :
	 * @return : dash/DASH120M.jsp
	 */
	@RequestMapping(value = "/DASH120UPT01")
	@ResponseBody
	public void DASH120UPT01(MultipartFile[] uploadFile) {
		String uploadFolder = propertiesService.getString("DASH");
		for (MultipartFile multipartFile : uploadFile) {
			System.out.println("uploadFileName : " + multipartFile.getOriginalFilename());
			System.out.println("uploadFileName : " + multipartFile.getSize());
			String uploadFileName = multipartFile.getOriginalFilename();
			File saveFile = new File(uploadFolder, uploadFileName);
			try {
				multipartFile.transferTo(saveFile);
			} catch (Exception e) {
				System.out.println(e.getMessage());
			}
		}
	}

	/**
	 * @Method Name : DASH120SEL05
	 * @작성일 : 2022.06.27
	 * @작성자 : 강동우
	 * @변경이력 :
	 * @Method 설명 : 퀵링크 조회
	 * @param : @RequestBody StringRestful param
	 * @return : ModelAndView HashMap
	 */
	@RequestMapping(value = "/DASH120SEL05")
	@ResponseBody
	public Map<String, Object> DASH120SEL05(ModelAndView mav, @RequestBody String req, HttpSession session, Locale locale) {
		HashMap<String, Object> resultMap = new HashMap<String, Object>();
		JSONParser parser = new JSONParser();

		try {
			JSONObject jsonObject = (JSONObject) parser.parse(req);
			DASH120VO DASH120VO = this.objectMapper.convertValue(jsonObject, DASH120VO.class);

			List<DASH120VO> list = dash120Service.DASH120SEL05(DASH120VO);

			resultMap.put("count", list.size());
			resultMap.put("list", this.objectMapper.writeValueAsString(list));
			resultMap.put("totalList", this.objectMapper.writeValueAsString(dash120Service.DASH120SEL05(DASH120VO)));
			resultMap.put("msg", messageSource.getMessage("success.common.select", null, "success select", locale));

		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}
		return resultMap;
	}

	/**
	 * @Method Name : DASH120INS04
	 * @작성일 : 2022.06.27
	 * @작성자 : 강동우
	 * @변경이력 :
	 * @Method 설명 : 퀵 링크 추가 및 수정
	 * @param : ModelAndView
	 * @return : ModelAndView HashMap
	 */
	@RequestMapping(value = "/DASH120INS04")
	@ResponseBody
	public Map<String, Object> DASH120INS04(ModelAndView mav, @RequestBody String request, Locale locale) {
		HashMap<String, Object> resultMap = new HashMap<String, Object>();
		JSONParser parser = new JSONParser();

		try {
			JSONObject jsonObject = (JSONObject) parser.parse(request);
			JSONArray jsonArray = (JSONArray) jsonObject.get("list");

			Integer rtn = dash120Service.DASH120INS04(this.objectMapper.convertValue(jsonArray, new TypeReference<List<DASH120VO>>() {}));
			if (rtn > 0) {
				resultMap.put("msg", messageSource.getMessage("success.common.insert", null, "success insert", locale));
			}

		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}
		return resultMap;
	}

	/**
	 * @Method Name : DASH120DEL05
	 * @작성일 : 2022.06.28
	 * @작성자 : 강동우
	 * @변경이력 :
	 * @Method 설명 : 퀵 링크 삭제
	 * @param : ModelAndView
	 * @return : ModelAndView HashMap
	 */
	@RequestMapping(value = "/DASH120DEL05")
	@ResponseBody
	public Map<String, Object> DASH120DEL05(ModelAndView mav, @RequestBody String request, Locale locale) {
		HashMap<String, Object> resultMap = new HashMap<String, Object>();
		JSONParser parser = new JSONParser();

		try {
			JSONObject jsonObject = (JSONObject) parser.parse(request);
			JSONArray jsonArray = (JSONArray) jsonObject.get("list");

			Integer rtn = dash120Service.DASH120DEL05(this.objectMapper.convertValue(jsonArray, new TypeReference<List<DASH120VO>>() {}));
			if (rtn > 0) {
				resultMap.put("msg", messageSource.getMessage("success.common.delete", null, "success delete", locale));
			}

		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}
		return resultMap;
	}

	/**
	 * @Method Name : DASH120SEL06
	 * @작성일 : 2022.06.27
	 * @작성자 : 강동우
	 * @변경이력 :
	 * @Method 설명 : 쪽지,지식,커뮤니티 조회
	 * @param : @RequestBody StringRestful param
	 * @return : ModelAndView HashMap
	 */
	@RequestMapping(value = "/DASH120SEL06")
	@ResponseBody
	public Map<String, Object> DASH120SEL06(ModelAndView mav, @RequestBody String req, HttpSession session, Locale locale) {
		HashMap<String, Object> resultMap = new HashMap<String, Object>();
		JSONParser parser = new JSONParser();

		try {
			JSONObject jsonObject = (JSONObject) parser.parse(req);
			DASH120VO DASH120VO = this.objectMapper.convertValue(jsonObject, DASH120VO.class);

			List<DASH120VO> list = dash120Service.DASH120SEL06(DASH120VO);

			resultMap.put("count", list.size());
			resultMap.put("list", objectMapper.writeValueAsString(list));
			resultMap.put("totalList", objectMapper.writeValueAsString(dash120Service.DASH120SEL06(DASH120VO)));
			resultMap.put("msg", messageSource.getMessage("success.common.select", null, "success select", locale));

		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}
		return resultMap;
	}

	/**
	 * @Method Name : DASH120DEL06
	 * @작성일 : 2022.06.28
	 * @작성자 : 강동우
	 * @변경이력 :
	 * @Method 설명 : 팔레트 항목 삭제
	 * @param : ModelAndView
	 * @return : ModelAndView HashMap
	 */
	@RequestMapping(value = "/DASH120DEL06")
	@ResponseBody
	public Map<String, Object> DASH120DEL06(ModelAndView mav, @RequestBody String request, Locale locale) {
		HashMap<String, Object> resultMap = new HashMap<String, Object>();
		JSONParser parser = new JSONParser();

		try {
			JSONObject jsonObject = (JSONObject) parser.parse(request);
			JSONArray jsonArray = (JSONArray) jsonObject.get("list");
			Integer rtn = dash120Service.DASH120DEL06(this.objectMapper.convertValue(jsonArray, new TypeReference<List<DASH120VO>>() {}));
			if (rtn > 0) {
				resultMap.put("msg", messageSource.getMessage("success.common.delete", null, "success delete", locale));
			}
		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}
		return resultMap;
	}
}
