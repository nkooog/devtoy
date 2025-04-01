package org.crm.frme.web;


import org.crm.sysm.VO.SYSM300VO;
import org.crm.sysm.VO.SYSM301VO;
import org.crm.sysm.VO.SYSM320VO;
import org.crm.sysm.service.SYSM300Service;
import org.crm.sysm.service.SYSM301Service;
import org.crm.sysm.service.SYSM320Service;
import org.crm.util.string.StringUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.json.simple.parser.JSONParser;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/***********************************************************************************************
 * Program Name : 템플릿 연결 Controller
 * Creator      : jrlee
 * Create Date  : 2022.07.21
 * Description  : 템플릿 연결
 * Modify Desc  :
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.07.21     jrlee           최초생성
 ************************************************************************************************/
@Slf4j
@Controller
@RequestMapping("/tmpl/*")
public class TemplateController {
    private static final Logger LOGGER = LoggerFactory.getLogger(TemplateController.class);

    @Resource(name = "SYSM300Service")
    private SYSM300Service sysm300Service;

    @Resource(name = "SYSM301Service")
    private SYSM301Service sysm301Service;

    @Resource(name = "SYSM320Service")
    private SYSM320Service sysm320Service;


    @Autowired
    private ObjectMapper objectMapper;


    @GetMapping("/TEMPLATE_PAGE")
    public String TEMPLATE_PAGE(ModelMap model, @RequestParam Map<String, String> params) {

        log.debug( " params : " + params.get("tenantId"));
        log.debug( " params : " + params.get("openType"));

        String result = "th/tmpl/TEMPLATE_PAGE";

        try {

            SYSM300VO sysm300VO = SYSM300VO.builder()
                    .tenantId(params.get("tenantId"))
                    .dataFrmId(params.get("dataframeId"))
                    .build();

            model.addAttribute("param", params);
            model.addAttribute("TEMPLATE_BASE_info", sysm300Service.SYSM300SEL02(sysm300VO));

            if(params != null
                    && !StringUtil.isEmpty(params.get("openType"))
                    && "preview".equals(params.get("openType"))
            ) {
                result = "th/tmpl/TEMPLATE_PREVIEW";
            }

        } catch (Exception e) {
            LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
        }

        return result;
    }

    @PostMapping(value = "/TEMPLATE_CARD")
    public String TEMPLATE_CARD(ModelMap model,
                                @RequestParam String TEMPLATE_CARD_tenantId,
                                @RequestParam String TEMPLATE_CARD_dataFrmId,
                                @RequestParam String TEMPLATE_CARD_patFrmeCd) {
        try {

            SYSM301VO sysm301VO = new SYSM301VO(TEMPLATE_CARD_tenantId, TEMPLATE_CARD_dataFrmId, TEMPLATE_CARD_patFrmeCd);
            SYSM301VO TEMPLATE_CARD_info = sysm301Service.SYSM301SEL01(sysm301VO);
            List<SYSM301VO> TEMPLATE_CARD_btnList = sysm301Service.SYSM301SEL03(sysm301VO);

            SYSM320VO sysm320VO = new SYSM320VO(TEMPLATE_CARD_info.getTenantId(), TEMPLATE_CARD_info.getCnntPgmId());
            List<SYSM320VO> TEMPLATE_CARD_fieldList = sysm320Service.SYSM320SEL01(sysm320VO);

            LOGGER.debug("TEMPLATE_CARD_info >>> " + TEMPLATE_CARD_info.getPatFrmeCd());

            model.addAttribute("TEMPLATE_CARD_info", TEMPLATE_CARD_info);
            model.addAttribute("TEMPLATE_CARD_btnList", TEMPLATE_CARD_btnList);

            model.addAttribute("TEMPLATE_CARD_tenantId", TEMPLATE_CARD_tenantId);
            model.addAttribute("TEMPLATE_CARD_dataFrmId", TEMPLATE_CARD_dataFrmId);
            model.addAttribute("TEMPLATE_CARD_patFrmeCd", TEMPLATE_CARD_patFrmeCd);


        } catch (Exception e) {
            LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
        }

        return "th/tmpl/TEMPLATE_CARD";
    }

    @RequestMapping("/TEMPLATE_CARD2")
    public String TEMPLATE_CARD2(ModelMap model,
                                 @RequestParam String TEMPLATE_CARD_tenantId,
                                 @RequestParam String TEMPLATE_CARD_dataFrmId,
                                 @RequestParam String TEMPLATE_CARD_patFrmeCd) {
		JSONParser parser = new JSONParser();

        try {
            SYSM301VO sysm301VO = new SYSM301VO(TEMPLATE_CARD_tenantId, TEMPLATE_CARD_dataFrmId, TEMPLATE_CARD_patFrmeCd);
            SYSM301VO TEMPLATE_CARD_info = sysm301Service.SYSM301SEL01(sysm301VO);
            List<SYSM301VO> TEMPLATE_CARD_btnList = sysm301Service.SYSM301SEL03(sysm301VO);

            SYSM320VO sysm320VO = new SYSM320VO(TEMPLATE_CARD_info.getTenantId(), TEMPLATE_CARD_info.getCnntPgmId());
            List<SYSM320VO> TEMPLATE_CARD_fieldList = sysm320Service.SYSM320SEL01(sysm320VO);

            LOGGER.debug("TEMPLATE_CARD_info >>> " + TEMPLATE_CARD_info.getPatFrmeCd());


            model.addAttribute("TEMPLATE_CARD_info", TEMPLATE_CARD_info);
            model.addAttribute("TEMPLATE_CARD_btnList", TEMPLATE_CARD_btnList);
            model.addAttribute("TEMPLATE_CARD_fieldList", TEMPLATE_CARD_fieldList);

        } catch (Exception e) {
            LOGGER.debug("[" + e.getClass() + "] Exception : " + e.getMessage());
        }

        return "th/tmpl/TEMPLATE_CARD2";
    }

    /**
     * @param : ModelAndView
     * @return : ModelAndView HashMap
     * @Method Name : TMPLSEL01
     * @작성일 : 2022.08.23
     * @작성자 : jrlee
     * @변경이력 :
     * @Method 설명 : 테스트 카드 데이터 조회
     */
    @RequestMapping(value = "/TMPLSEL01", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> TMPLSEL01(ModelMap model, @RequestBody String request) {
        Map<String, Object> resultMap = new HashMap<>();

        try {
            resultMap.put("list", new ObjectMapper().writeValueAsString(new ArrayList<>()));
            resultMap.put("object", new ObjectMapper().writeValueAsString(new HashMap<>()));
            resultMap.put("msg", "정상적으로 조회하였습니다.");
        } catch (Exception e) {
            LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
        }

        return resultMap;
    }

    /**
     * @param : ModelAndView
     * @return : ModelAndView HashMap
     * @Method Name : TMPLINS01
     * @작성일 : 2022.08.23
     * @작성자 : jrlee
     * @변경이력 :
     * @Method 설명 : 테스트 카드 데이터 저장
     */
    @RequestMapping(value = "/TMPLINS01", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> TMPLINS01(ModelMap model, @RequestBody String request) {
        Map<String, Object> resultMap = new HashMap<>();
        try {

        } catch (Exception e) {
            LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
        }

        return resultMap;
    }
}