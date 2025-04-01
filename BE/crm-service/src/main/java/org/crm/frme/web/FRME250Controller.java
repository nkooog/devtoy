package org.crm.frme.web;

import org.crm.frme.VO.FRME250VO;
import org.crm.frme.service.FRME250Service;
import org.crm.lgin.VO.LGIN000VO;
import org.crm.util.crypto.AES256Crypt;
import org.crm.util.string.StringUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.support.SessionStatus;
import org.springframework.web.servlet.ModelAndView;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.crm.util.masking.MaskingUtil.SwichingPhone;
import static org.crm.util.masking.MaskingUtil.nameMasking;


/**
 * @Class Name   : FRME250Controller.java
 * @Description  : 웹프레임 업무이관 콜백 controller
 * @Modification 
 * @ -------------------------------------------------------------------------
 * @  수정일                  수정자              수정내용
 * @ -------------------------------------------------------------------------
 * @ 2022.03.03   김보영             최초생성
 * @ -------------------------------------------------------------------------
 * @author CRM Lab실 김보영 연구원
 * @since 2022. 03.03
 * @version 1.0
 * @see
 *
 *  Copyright (C) by BROADC&S All right reserved.
 */
@Slf4j
@Controller
@RequestMapping("/frme/*")
public class FRME250Controller {

	@Resource(name = "FRME250Service")
	private FRME250Service frme250Service;

	private ObjectMapper objectMapper;

	@Autowired
	public FRME250Controller(ObjectMapper objectMapper) {
		this.objectMapper = objectMapper;
	}

	@RequestMapping("/FRME250P")
	public String FRME250P() {
		ModelAndView mav = new ModelAndView("");
		return "th/frme/FRME250P";
	}	
	
	
	/**
     * @Method Name : FRME250SEL01
     * @작성일 : 2022.03.03
     * @작성자 : 김보영
     * @Method 설명 : 웹프레임 업무이관 목록 조회
	 * @param :  ModelAndView HttpServletRequest 
	 * @return : ModelAndView HashMap 
     */ 
	
	@PostMapping(value ="/FRME250SEL01")
    @ResponseBody 
    public Map<String, Object> FRME250SEL01(ModelAndView mav, @RequestBody String req, SessionStatus status, HttpSession session) {

		HashMap<String, Object> hashMap = new HashMap<String, Object>();

    	try {

			FRME250VO vo = this.objectMapper.readValue(req, FRME250VO.class);
			String srchText = vo.getSrchText();

			if(!StringUtil.isEmpty(srchText)) {
				vo.setSrchText(AES256Crypt.encrypt(srchText));
			}
			
			List<FRME250VO> FRME250List = frme250Service.FRME250SEL01(vo);
		    LGIN000VO user = (LGIN000VO) session.getAttribute("user");
			
			for(FRME250VO FRME250VO : FRME250List) {

				if(!StringUtil.isEmpty(FRME250VO.getCntcCustNm())){
					FRME250VO.setCntcCustNm(AES256Crypt.decrypt(FRME250VO.getCntcCustNm()));
					if(!StringUtil.isEmpty(FRME250VO.getCntcCustNm())){
						String name = "";
						if(!StringUtil.isEmpty(user.getPersonInfoMask()) && "N".equals(user.getPersonInfoMask())){
							name =  FRME250VO.getCntcCustNm();
						}else{
							name = nameMasking(FRME250VO.getCntcCustNm());
						}
						FRME250VO.setCntcCustNmMsk(name);
					}
				}
				if(!StringUtil.isEmpty(FRME250VO.getUsrNm())){
					FRME250VO.setUsrNm(AES256Crypt.decrypt(FRME250VO.getUsrNm()));
				}
				if(!StringUtil.isEmpty(FRME250VO.getCntcTelNo())){
					String phoneNo = SwichingPhone(AES256Crypt.decrypt(FRME250VO.getCntcTelNo()));
					if(!StringUtil.isEmpty(user.getPersonInfoMask()) && "N".equals(user.getPersonInfoMask())){
						phoneNo =  AES256Crypt.decrypt(FRME250VO.getCntcTelNo());
					}
					FRME250VO.setCntcTelNo(phoneNo);
				}
			}
			
			hashMap.put("FRME250PInfo", this.objectMapper.writeValueAsString(FRME250List));
			hashMap.put("msg", "정상적으로 조회하였습니다.");

    	}catch(Exception e) {
    		log.error("["+e.getClass()+"] Exception : " + e.getMessage());
    	}
		return hashMap;
    }	
}
