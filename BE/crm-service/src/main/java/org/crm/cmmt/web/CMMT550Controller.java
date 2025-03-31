package org.crm.cmmt.web;

import org.crm.cmmt.VO.CMMT500VO;
import org.crm.cmmt.service.CMMT500Service;
import org.crm.config.spring.config.PropertiesService;
import org.crm.lgin.VO.LGIN000VO;
import org.crm.util.json.JsonUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;
import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;
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

import jakarta.annotation.Resource;
import java.util.*;


/***********************************************************************************************
 * Program Name : 쪽지상세조회 Controller
 * Creator      : 이민호
 * Create Date  : 2022.07.04
 * Description  : 쪽지관리 메인
 * Modify Desc  :
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.07.04      이민호           최초생성
 ************************************************************************************************/
@Slf4j
@Controller
@RequestMapping("/cmmt/*")
public class CMMT550Controller {

    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private NoteFileUtils noteFileUtils;

	@Autowired
	private PropertiesService propertiesService;

    @Resource(name = "CMMT500Service")
    private CMMT500Service CMMT500Service;

    private final MessageSource messageSource;

    private static final Logger LOGGER = LoggerFactory.getLogger(CMMT550Controller.class);

    public CMMT550Controller(MessageSource messageSource) {
        this.messageSource = messageSource;
    }

    /**
     * @param :
     * @return : sysm/SYSM500M.jsp
     * @Method Name : CMMT500M
     * @작성일 : 2022.04.27
     * @작성자 : 이민호
     * @변경이력 :
     * @Method 설명 : cmmt/CMMT500M 웹 페이지 열기
     */
    @RequestMapping("/CMMT550P")
    public String CMMT560P(HttpSession session, Model model) {
		LGIN000VO sessionVO = (LGIN000VO) session.getAttribute("user");
        model.addAttribute("user", sessionVO);
        return "th/cmmt/CMMT550P";
    }

    /**
     * @param : HttpServletRequest Restful param
     * @return : ModelAndView HashMap
     * @Method Name : CMMT550MSEL01
     * @작성일 : 2022.07.04
     * @작성자 : 이민호
     * @변경이력 :
     * @Method 설명 : 쪽지상세조회
     */
    @RequestMapping(value = "/CMMT550SEL01", method = RequestMethod.POST)
    @ResponseBody
    public Map<String,Object> CMMT550SEL01(@RequestBody String req, Locale locale) {
        Gson gson = new Gson();
        JsonUtil jsonUtils = new JsonUtil();
        ObjectMapper mapper = new ObjectMapper();
        HashMap<String, Object> hashMap = new HashMap<String, Object>();
        HashMap<String, Object> paramMap = new HashMap<String, Object>();
        try {
            CMMT500VO vo = this.objectMapper.readValue(req ,CMMT500VO.class );


            paramMap.put("vo", vo);

            List<CMMT500VO> CMMT500List = CMMT500Service.CMMT500SEL01(paramMap);

            hashMap.put("CMMT500M", mapper.writeValueAsString(CMMT500List));
            hashMap.put("msg", messageSource.getMessage("success.common.select", null, "success select", locale));
        } catch (Exception e) {
            LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
        }
        return hashMap;
    }

    /**
     * @param : List, noteType, usrId
     * @return :
     * @Method Name : noteTypeClass
     * @작성일 : 2022.07.07
     * @작성자 : mhlee
     * @변경이력 :
     * @Method 설명  : 쪽지 타입에 따른 분류 메서드
     */
    private void noteTypeClass(List<CMMT500VO> CMMT500List, int noteTypeSum, String user) {
        switch (noteTypeSum) {
            case 1:
                CMMT500List.removeIf(temp -> !temp.getRecvrIdList().contains(user));
                break;
            case 2:
                CMMT500List.removeIf(temp -> !temp.getDpchmnId().contains(user));
                break;
            case 6:
                Iterator<CMMT500VO> it = CMMT500List.iterator();
                while (it.hasNext()) {
                    CMMT500VO obj = it.next();
                    if (obj.getNoteType().equals("R")) {
                        int i = obj.getRecvrIdList().indexOf(user);
                        if (!obj.getRecvNoteStCdList().get(i).equals("3")) {
                            it.remove();
                        }
                    }
                    if (obj.getNoteType().equals("D")) {
                        if (!obj.getDpchNoteStCd().equals("3")) {
                            it.remove();
                        }
                    }
                }
                break;
        }
    }
}
