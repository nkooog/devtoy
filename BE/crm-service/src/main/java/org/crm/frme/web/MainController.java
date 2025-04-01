package org.crm.frme.web;

import org.crm.comm.service.COMM100Service;
import org.crm.frme.VO.FRME160VO;
import org.crm.frme.service.FRME160Service;
import org.crm.frme.service.FRME320Service;
import org.crm.lgin.VO.LGIN000VO;
import org.crm.sysm.VO.SYSM100VO;
import org.crm.sysm.service.SYSM120Service;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.ModelAndView;

import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

/***********************************************************************************************
* Program Name : main 웹 페이지 열기 Controller
* Creator      : jrlee
* Create Date  : 2022.03.03
* Description  : main 웹 페이지 열기
* Modify Desc  : 
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.03.03     jrlee           최초생성
* 2024.12.02     박준영           egov->springboot mig
************************************************************************************************/
@Slf4j
@Controller
public class MainController {

    private static final Logger LOGGER = LoggerFactory.getLogger(MainController.class);

    @Value("${ncrm.version}")
    private String version;

    @Resource(name = "SYSM120Service")
    private SYSM120Service sysm120Service;

    @Resource(name = "FRME160Service")
    private FRME160Service frme160Service;

    @Resource(name = "COMM100Service")
    private COMM100Service comm100Service;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private RestTemplate restTemplate;


    @Resource(name = "FRME320Service")
    private FRME320Service frme320Service;

    /**
     * @Method Name : main
     * @작성일      : 2022.03.03
     * @작성자      : jrlee
     * @변경이력    :
     * @Method 설명 : main 웹 페이지 열기
     * @param       :
     * @return      : main.jsp
     */
    @RequestMapping("/main")
    public String main(ModelMap model, HttpSession session) {
        try {
            session.setAttribute("v", this.version);

            if (!Objects.isNull(session.getAttribute("user"))) {
                LGIN000VO user = (LGIN000VO) session.getAttribute("user");

                Map<String, Object> map = new HashMap<>();
                map.put("tenantId" , user.getTenantId());
                map.put("usrId" , user.getUsrId());
                int count = frme320Service.FRME320SEL01(map);

                model.addAttribute("pswChangeCount", count);

                // 환경설정값
                if (Objects.isNull(session.getAttribute("usrEnvr"))) {
                    FRME160VO frme160VO = new FRME160VO();
                    frme160VO.setTenantId(user.getTenantId());
                    frme160VO.setUsrId(user.getUsrId());

                    session.setAttribute("usrEnvr", frme160Service.FRME160SEL01(frme160VO));
                }
                // (임시) 영업일 정보
                // TODO 서비스운영관리 url path 변경 후, 공통적용 또는 분리 필요
                if (Objects.isNull(session.getAttribute("bizsEnvr"))) {
                    String cloudName = comm100Service.COMM100getCloudName(user.getTenantId());

                    String serviceLocation = cloudName.equals("BONA") ? "bonaaom" : cloudName;
                    String tenantPrefix = user.getTenantId();
                    String endpoint = "http://bona2.cloudcc.co.kr/InternalOAMAPI/GetWorkingTime" + "?serviceLocation=" + serviceLocation + "&tenantPrefix=" + tenantPrefix;

                    ResponseEntity<String> response = this.restTemplate.exchange(endpoint, HttpMethod.GET, new HttpEntity<>(getHttpHeaders()), String.class);
                    session.setAttribute("bizsEnvr",   new ObjectMapper().readValue(response.getBody(), Map.class));
                    session.setAttribute("bizsEnvr",   this.objectMapper.readValue(response.getBody(), Map.class));
                }

                // 기준값
                SYSM100VO sysm100VO = new SYSM100VO();
                sysm100VO.setTenantId(user.getTenantId());

                model.addAttribute("bascVluList", this.objectMapper.writeValueAsString(sysm120Service.SYSM120SEL03(sysm100VO).stream().filter(x -> "Y".equals(x.getUseYn())).collect(Collectors.toList())));
            }
        } catch (Exception e) {
            LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
        }

        return "th/main";
    }
    
    @RequestMapping("/counsel_main")
    public ModelAndView counsel_main() {
        return new ModelAndView("counsel_main");
    }
    
    /**
     * @Method Name : main_test
     * @작성일 : 2022.03.10
     * @작성자 : khcha
     * @변경이력 :
     * @Method 설명 : main_test 페이지열기
     * @param :
     * @return : main_test.jsp
     */
    @RequestMapping("/main_test")
    public ModelAndView main_test() {
        return new ModelAndView("main_test");
    }
    
    
    /**
     * @Method Name : layout_test
     * @작성일 : 2022.03.22
     * @작성자 : khcha
     * @변경이력 :
     * @Method 설명 : layout_test 페이지열기
     * @param :
     * @return : layout_test.jsp
     */
    @RequestMapping("/layout_test")
    public ModelAndView layout_test() {
        return new ModelAndView("layout_test");
    }

    private static HttpHeaders getHttpHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Content-Type", "application/json");
        headers.set("Connection", "keep-alive");
        headers.setContentType(new MediaType("application", "json", StandardCharsets.UTF_8));
        return headers;
    }
}