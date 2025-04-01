package org.crm.comm.web;

import org.crm.comm.VO.COMM150VO;
import org.crm.comm.service.COMM150Service;
import org.crm.lgin.VO.LGIN000VO;
import org.crm.lgin.service.LGIN000Service;
import org.crm.util.com.ComnFun;
import org.crm.util.crypto.AES256Crypt;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpSession;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
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
 * 2023.01.04     djjung          기능변경 - 테넌트,등급,유저아이디 변경
 ************************************************************************************************/

@Controller
@RequestMapping("/comm/*")
public class COMM150Controller {
	private static final Logger LOGGER = LoggerFactory.getLogger(COMM150Controller.class);

	@Resource(name = "COMM150Service")
	private COMM150Service comm150Service;

	@Resource(name = "LGIN000Service")
	private LGIN000Service lgin000Service;
	
	private MessageSource messageSource;
	private ObjectMapper objectMapper;

	@Autowired
	public COMM150Controller(MessageSource messageSource, ObjectMapper objectMapper) {
		this.messageSource = messageSource;
		this.objectMapper = objectMapper;
	}

	/**
	 * @Method Name : COMM150P
	 * @작성일      : 2022.08.02
	 * @작성자      : jrlee
	 * @변경이력    :
	 * @Method 설명 : comm/COMM150P 웹 페이지 열기
	 * @param       :
	 * @return      : comm/COMM150P.jsp
	 */
	@PostMapping("/COMM150P")
	public String COMM150P() {
		return "th/comm/COMM150P";
	}

	/**
	 * @Method Name : COMM150SEL01
	 * @작성일      : 2023.01.04
	 * @작성자      : djjung
	 * @변경이력    :
	 * @Method 설명 : 테넌트에서 사용중인 등급 목록 조회
	 */
	@PostMapping(value ="/COMM150SEL01")
	@ResponseBody
	public Map<String, Object> COMM150SEL01(ModelAndView mav, @RequestBody String req){
		HashMap<String, Object> resultMap = new HashMap<>();
		try {
			COMM150VO vo = this.objectMapper.readValue(req,COMM150VO.class);
			List<COMM150VO> list = comm150Service.COMM150SEL01(vo);

			resultMap.put("list",list);

		}catch (Exception e){
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
			e.printStackTrace();
		}
		return resultMap;
	}

	/**
	 * @Method Name : COMM150SEL02
	 * @작성일      : 2023.01.04
	 * @작성자      : djjung
	 * @변경이력    :
	 * @Method 설명 : 테넌트에서 사용중인 등급 목록 조회
	 */
	@PostMapping(value ="/COMM150SEL02")
	@ResponseBody
	public Map<String, Object> COMM150SEL02(ModelAndView mav, @RequestBody String req){
		HashMap<String, Object> resultMap = new HashMap<>();
		try {
			COMM150VO vo = this.objectMapper.readValue(req,COMM150VO.class);
			List<COMM150VO> list = comm150Service.COMM150SEL02(vo);

			resultMap.put("list",list);

		}catch (Exception e){
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
			e.printStackTrace();
		}
		return resultMap;
	}


	/**
	 * @Method Name : COMM150SEL03
	 * @작성일      : 2023.01.04
	 * @작성자      : djjung
	 * @변경이력    :
	 * @Method 설명 : 세션 설정
	 */
	@PostMapping(value ="/COMM150SEL03")
	@ResponseBody
	public Map<String, Object> COMM150SEL03(ModelAndView mav, @RequestBody String req, HttpSession session){
		HashMap<String, Object> resultMap = new HashMap<>();
		try {
			LGIN000VO vo = this.objectMapper.readValue(req,LGIN000VO.class);

			LGIN000VO sessionVO = lgin000Service.LGIN000SEL02(vo);
			if(sessionVO != null){
				sessionVO.setOriginTenantId(vo.getOriginTenantId());
				sessionVO.setOriginUsrGrd(vo.getOriginUsrGrd());
				sessionVO.setExtNoUseYn(vo.getExtNoUseYn());  //내선번호사용여부 : 로그인시 조회하지 않는 항목 별도 set
				//복호화 Set
				sessionVO.setDecUsrNm(AES256Crypt.decrypt(sessionVO.getUsrNm()));
				if(!ComnFun.isEmptyObj(sessionVO.getEmlAddrIsd())) {
					sessionVO.setDecEmlAddrIsd(AES256Crypt.decrypt(sessionVO.getEmlAddrIsd()));
				}
				//kw---20240105 : 조건 변수명 수정 (getDecEmlAddrExtn -> getEmlAddrExtn)
				if(!ComnFun.isEmptyObj(sessionVO.getEmlAddrExtn())) {
					sessionVO.setDecEmlAddrExtn(AES256Crypt.decrypt(sessionVO.getEmlAddrExtn()));
				}

				// 테넌트 이동 시 ocs 체크 후 remove
				if(session.getAttribute("ocs") != null) {
					session.removeAttribute("ocs");
				}

				session.setAttribute("user", sessionVO);
				resultMap.put("msg", "정상적으로 변경되었습니다.");
				resultMap.put("result", true);
			}else{
				resultMap.put("msg", "사용자가 만료 상태입니다.");
				resultMap.put("result", false);
			}

		}catch (Exception e){
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
			e.printStackTrace();
		}
		return resultMap;
	}
	
	@PostMapping(value ="/COMM150SEL04")
	@ResponseBody
	public Map<String, Object> COMM150SEL04(Locale locale, ModelAndView mav, @RequestBody String request){
		HashMap<String, Object> hashMap = new HashMap<>();
		try {
			List<COMM150VO> cdList = comm150Service.COMM150SEL04(this.objectMapper.readValue(request, COMM150VO.class));
			hashMap.put("cdList", cdList);
			hashMap.put("msg", this.messageSource.getMessage("success.common.select", null, "success.common.select", locale));
		}catch (Exception e){
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
			e.printStackTrace();
		}
		return hashMap;
	}
	
	/**
	 * @Method Name : COMM150SEL05
	 * @작성일      	: 2023.11.28
	 * @작성자      	: khcha
	 * @변경이력   	:
	 * @Method 설명 	: 큐 그룹 가져오기
	 * @param       : ModelAndView
	 * @return      : ModelAndView HashMap
	 */
	@PostMapping(value = "/COMM150SEL05")
	@ResponseBody
	public Map<String, Object> COMM150SEL05(ModelAndView mav, @RequestBody String request, Locale locale) {
		HashMap<String, Object> resultMap = new HashMap<>();
		 
		try {
			COMM150VO vo = this.objectMapper.readValue(request, COMM150VO.class);
 
			List<COMM150VO> list = comm150Service.COMM150SEL05(vo);
			
			resultMap.put("list", new ObjectMapper().writeValueAsString(list));
			resultMap.put("msg", "정상적으로 조회하였습니다.");

		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}

		return resultMap;
	}
	
	/**
	 * @Method Name : COMM150SEL06
	 * @작성일      	: 2023.11.28
	 * @작성자      	: khcha
	 * @변경이력   	:
	 * @Method 설명 	: 유저 리스트 가져오기
	 * @param       : ModelAndView
	 * @return      : ModelAndView HashMap
	 */
	@PostMapping(value = "/COMM150SEL06")
	@ResponseBody
	public Map<String, Object> COMM150SEL06(ModelAndView mav, @RequestBody String request, Locale locale) {
		HashMap<String, Object> resultMap = new HashMap<>();
		 
		try {
			COMM150VO vo = this.objectMapper.readValue(request, COMM150VO.class);
 
			List<COMM150VO> list = comm150Service.COMM150SEL06(vo);

			resultMap.put("list", new ObjectMapper().writeValueAsString(list));
			resultMap.put("msg", "정상적으로 조회하였습니다.");

		} catch (Exception e) {
			LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}
		return resultMap;
	}
}

