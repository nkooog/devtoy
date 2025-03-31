package org.crm.cmmt.web;


import org.crm.cmmt.VO.CMMT570VO;
import org.crm.cmmt.VO.NoteFileVO;
import org.crm.cmmt.service.CMMT570Service;
import org.crm.config.spring.config.PropertiesService;
import org.crm.lgin.VO.LGIN000VO;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;
import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;
import org.json.simple.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import jakarta.annotation.Resource;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


/***********************************************************************************************
 * Program Name : 쪽지전달(+회신) Controller
 * Creator      : 이민호
 * Create Date  : 2022.05.02
 * Description  : 쪽지전달(+회신)
 * Modify Desc  :
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.05.02      이민호           최초생성
 ************************************************************************************************/
@Slf4j
@Controller
@RequestMapping("/cmmt/*")
public class CMMT570Controller {

    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private NoteFileUtils noteFileUtils;

    @Resource(name = "CMMT570Service")
    private CMMT570Service cmmt570Service;

    @Autowired
    private NoteFileUtils fileUtils;

	@Autowired
	private PropertiesService propertiesService;

	private static final Logger LOGGER = LoggerFactory.getLogger(CMMT570Controller.class);
	public static final String PATH = "NOTE";
	/**
	 * @Method Name : CMMT570P
	 * @작성일      : 2022.05.02
	 * @작성자      : 이민호
	 * @변경이력    :
	 * @Method 설명 : cmmt/CMMT570P 웹 페이지 열기
	 * @param       :
	 * @return      : sysm/CMMT570P.jsp
	 */
	@RequestMapping("/CMMT570P")
    public String CMMT570P(HttpSession session, Model model) {
		LGIN000VO sessionVO = (LGIN000VO) session.getAttribute("user");
        model.addAttribute("user", sessionVO);
		return "th/cmmt/CMMT570P";
	}

	/**
	 * @Method Name : CMMT570SEL01
	 * @작성일      : 2022.07.18
	 * @작성자      : 이민호
	 * @변경이력    :
	 * @Method 설명 : 회신 쪽지 조회
	 * @param       : ModelAndView, HttpServletRequest Restful param
	 * @return      : ModelAndView HashMap
	 */
	@RequestMapping(value = "/CMMT570SEL02", method = RequestMethod.POST)
	@ResponseBody
	public Map<String,Object> CMMT570SEL02(@RequestBody String req) {
		ObjectMapper mapper = new ObjectMapper();
		HashMap<String, Object> hashMap = new HashMap<String, Object>();
		try {
			CMMT570VO vo = cmmt570Service.CMMT570SEL02(this.objectMapper.readValue(req , CMMT570VO.class));

			hashMap.put("CMMT570P", mapper.writeValueAsString(vo));
		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}
		return hashMap;
	}

	/**
	 * @Method Name : CMMT570SEL01
	 * @작성일      : 2022.07.18
	 * @작성자      : 이민호
	 * @변경이력    :
	 * @Method 설명 : 전달 쪽지 조회
	 * @param       : ModelAndView, HttpServletRequest Restful param
	 * @return      : ModelAndView HashMap
	 */
	@RequestMapping(value = "/CMMT570SEL03", method = RequestMethod.POST)
	@ResponseBody
	public Map<String,Object> CMMT570SEL03(@RequestBody String req) {
		ObjectMapper mapper = new ObjectMapper();
		HashMap<String, Object> hashMap = new HashMap<String, Object>();
		try {
			CMMT570VO vo = cmmt570Service.CMMT570SEL03(this.objectMapper.readValue(req , CMMT570VO.class));

			hashMap.put("CMMT570P", mapper.writeValueAsString(vo));
		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}
		return hashMap;
	}

	/**
	 * @Method Name : CMMT570INS01
	 * @작성일      : 2022.05.02
	 * @작성자      : 이민호
	 * @변경이력    :
	 * @Method 설명 : 쪽지전달 (+회신)
	 * @param       : HttpServletRequest Restful param
	 * @return      : ModelAndView HashMap
	 */
	@RequestMapping(value = "/CMMT570INS01", method = RequestMethod.POST)
	@ResponseBody
	public  Map<String,Object> CMMT570INS01(@RequestPart("noteData") String noteData,
                                     @RequestPart(value = "noteFiles" , required = false) List<MultipartFile> files) {
			HashMap<String, Object> hashMap = new HashMap<String, Object>();
		try {
			Gson gson = new Gson();
            JSONObject obj = this.objectMapper.readValue(noteData , JSONObject.class);

			CMMT570VO vo = gson.fromJson(String.valueOf(obj), CMMT570VO.class);
			String message = insertNoteAndGetMsg(files, obj, vo);

			hashMap.put("msg", message);
		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}
		return hashMap;
	}

	/**
	 * @Method Name : CMMT570INS03
	 * @작성일      : 2022.05.02
	 * @작성자      : 이민호
	 * @변경이력    :
	 * @Method 설명 : 쪽지전달(+회신) 임시저장
	 * @param       : HttpServletRequest Restful param
	 * @return      : ModelAndView HashMap
	 */
	@RequestMapping(value = "/CMMT570INS03", method = RequestMethod.POST)
	@ResponseBody
	public  Map<String,Object> CMMT570INS03(@RequestPart("noteData") String noteData,
                                     @RequestPart(value = "noteFiles" , required = false) List<MultipartFile> files) {
			HashMap<String, Object>  hashMap = new HashMap<String, Object>();
		try {
			Gson gson = new Gson();
            JSONObject obj = this.objectMapper.readValue(noteData , JSONObject.class);
			CMMT570VO vo = gson.fromJson(String.valueOf(obj), CMMT570VO.class);
			String message = insertNoteAndGetMsg(files, obj, vo);

			hashMap.put("msg", message);
		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}
		return hashMap;
	}

	private String insertNoteAndGetMsg(List<MultipartFile> files, JSONObject obj, CMMT570VO vo) throws Exception {

		String dpchNoteCd = vo.getDpchNoteStCd();
		String recvNoteCd;
		if (dpchNoteCd.equals("1")) {
			recvNoteCd = "9";
			vo.setRecvNoteStCd(recvNoteCd);
		}
		int getResultNoteNo;

		if (files != null && files.size() > 0) {
			String pathName = propertiesService.getString(PATH);
			List<NoteFileVO> attachedFileList = fileUtils.uploadPreJobAndGetFileVOList(pathName, obj, files);
			getResultNoteNo = dpchNoteCd.equals("1")
					? cmmt570Service.CMMT570INS03(vo, attachedFileList)
					: cmmt570Service.CMMT570INS01(vo, attachedFileList);
		} else {
			getResultNoteNo = dpchNoteCd.equals("1")
					? cmmt570Service.CMMT570INS03(vo, new ArrayList<NoteFileVO>())
					: cmmt570Service.CMMT570INS02(vo);
		}
		String message;
		if (dpchNoteCd.equals("1")) {
			message = "임시저장 되었습니다.";
		} else {
			message = getResultNoteNo > 0 ? "쪽지를 전송 했습니다." : "전송이 실패했습니다.";
		}
		return message;
	}
}
