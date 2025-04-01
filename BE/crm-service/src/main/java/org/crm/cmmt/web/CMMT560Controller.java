package org.crm.cmmt.web;

import org.crm.cmmt.VO.CMMT560VO;
import org.crm.cmmt.VO.NoteFileVO;
import org.crm.cmmt.service.CMMT560Service;
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
import org.springframework.web.bind.support.SessionStatus;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;

import jakarta.annotation.Resource;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/***********************************************************************************************
 * Program Name : 쪽지쓰기 Controller
 * Creator      : 이민호
 * Create Date  : 2022.04.27
 * Description  : 쪽지쓰기 메인
 * Modify Desc  :
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.04.27      이민호           최초생성
 * 2002.05.12      이민호
 ************************************************************************************************/
@Slf4j
@Controller
@RequestMapping("/cmmt/*")
public class CMMT560Controller {

    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private NoteFileUtils noteFileUtils;

    @Resource(name = "CMMT560Service")
    private CMMT560Service cmmt560Service;


	@Autowired
	private PropertiesService propertiesService;

    private static final Logger LOGGER = LoggerFactory.getLogger(CMMT560Controller.class);
    public static final String PATH = "NOTE";

    /**
     * @param :
     * @return : sysm/CMMT560P.jsp
     * @Method Name : CMMT560M
     * @작성일 : 2022.04.27
     * @작성자 : 이민호
     * @변경이력 :
     * @Method 설명 : cmmt/CMMT560P 웹 페이지 열기
     */
    @RequestMapping("/CMMT560P")
    public String CMMT560P(HttpSession session, Model model) {
		LGIN000VO sessionVO = (LGIN000VO) session.getAttribute("user");
        model.addAttribute("user", sessionVO);
        return "th/cmmt/CMMT560P";
    }

    @RequestMapping(value = "/CMMT560INS01", method = RequestMethod.POST)
    @ResponseBody
    public Map<String , Object> CMMT560INS01(ModelAndView mav, SessionStatus status,
                                             @RequestParam("noteData") String noteData,
                                             @RequestParam(value = "noteFiles" , required = false) List<MultipartFile> files) {
        HashMap<String, Object> hashMap = new HashMap<String, Object>();
        try {
            Gson gson = new Gson();
            JSONObject obj = this.objectMapper.readValue(noteData , JSONObject.class);
            CMMT560VO vo = gson.fromJson(String.valueOf(obj), CMMT560VO.class);

            String message = insertNoteAndGetMsg(files, obj, vo);
            hashMap.put("msg", message);
        } catch (Exception e) {
            LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
        }
        return hashMap;
    }

    /**
     * @param : HttpServletRequest Restful param
     * @return : ModelAndView HashMap
     * @Method Name : CMMT560INS03
     * @작성일 : 2022.04.29
     * @작성자 : 이민호
     * @변경이력 :
     * @Method 설명 : 쪽지쓰기 임시저장
     */
    @RequestMapping(value = "/CMMT560INS03", method = RequestMethod.POST)
    @ResponseBody
    public Map<String,Object> CMMT560INS03( @RequestPart("noteData") String noteData,
                                     @RequestPart(value = "noteFiles" , required = false) List<MultipartFile> files) {
        HashMap<String, Object> hashMap = new HashMap<String, Object>();
        try {
            Gson gson = new Gson();
            JSONObject obj = this.objectMapper.readValue(noteData , JSONObject.class);
            CMMT560VO vo = gson.fromJson(String.valueOf(obj), CMMT560VO.class);

            String message = insertNoteAndGetMsg(files, obj, vo);

            hashMap.put("msg", message);
        } catch (Exception e) {
            LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
        }
        return hashMap;
    }

    private String insertNoteAndGetMsg(List<MultipartFile> files, JSONObject obj, CMMT560VO vo) throws Exception {

        String dpchNoteCd = vo.getDpchNoteStCd();
        String recvNoteCd;
        if (dpchNoteCd.equals("1")) {
            recvNoteCd = "9";
            vo.setRecvNoteStCd(recvNoteCd);
        }
        int getResultNoteNo;

        if (files != null &&   files.size() > 0) {
            String pathName = propertiesService.getString(PATH);
            List<NoteFileVO> attachedFileList = noteFileUtils.uploadPreJobAndGetFileVOList(pathName, obj, files);
            getResultNoteNo = dpchNoteCd.equals("1")
                    ? cmmt560Service.CMMT560INS03(vo, attachedFileList)
                    : cmmt560Service.CMMT560INS01(vo, attachedFileList);
        } else {
            getResultNoteNo = dpchNoteCd.equals("1")
                    ? cmmt560Service.CMMT560INS03(vo, new ArrayList<NoteFileVO>())
                    : cmmt560Service.CMMT560INS02(vo);
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
