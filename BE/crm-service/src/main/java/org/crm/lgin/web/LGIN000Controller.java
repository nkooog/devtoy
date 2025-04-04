package org.crm.lgin.web;


import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.Claims;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.crm.config.jwt.JwtToken;
import org.crm.config.jwt.JwtTokenProvider;
import org.crm.config.redis.RedisService;
import org.crm.lgin.model.dto.LGIN000DTO;
import org.crm.lgin.model.vo.LGIN000VO;
import org.crm.lgin.service.LGIN000Service;
import org.crm.util.crypto.AES256Crypt;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.net.Inet4Address;
import java.text.SimpleDateFormat;
import java.util.HashMap;
import java.util.Locale;

/***********************************************************************************************
* Program Name : 로그인 Controller
* Creator      : sukim
* Create Date  : 2022.02.03
* Description  : 로그인
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.02.03     sukim            최초생성
************************************************************************************************/
@Slf4j
@Controller
@RequestMapping("/lgin/*")
public class LGIN000Controller {

	private final String SEPARATOR = ":";

	@Resource(name = "LGIN000Service")
	private LGIN000Service lgin000Service;

	private JwtTokenProvider provider;
	private MessageSource messageSource;
	private ObjectMapper objectMapper;
	private RedisService redisService;

	@Autowired
	public LGIN000Controller(MessageSource messageSource, ObjectMapper objectMapper, RedisService redisService, JwtTokenProvider provider) {
		this.messageSource = messageSource;
		this.objectMapper = objectMapper;
		this.redisService = redisService;
		this.provider = provider;
	}

	/**
     * @Method Name : login
     * @작성일      : 2024.11.29
     * @작성자      : jypark
     * @변경이력    : 
     * @Method 설명 : th/lgin/login 전단계 연결 웹 페이지 열기
	 * @param       :  
	 * @return      : th/lgin/login.html
     */	
	@GetMapping("/LGIN000M")
	public String login(HttpServletRequest request) {
		return "/th/lgin/LGIN000M";
	}

	/**
	 * @Method Name : LGIN000SEL01, LGIN000SEL02
	 * @작성일      : 2022.02.04
	 * @작성자      : sukim
	 * @변경이력    :
	 * @Method 설명 : 로그인 체크 및 로그인 사용자정보 조회
	 * @param       :
	 * @return      : 성공시 : 성공 상태, 성공 메시지
	 *                실패시 : 실패 상태, 실패 메시지
	 */
	@PostMapping(value = "/LGIN000SEL01")
	public ResponseEntity LGIN000SEL01(@RequestBody @Valid LGIN000DTO lgin000DTO, Locale locale) throws Exception {

		HttpStatus resultStatus = null;

		JSONObject json = new JSONObject();
		SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

		lgin000DTO.setScrtNo(AES256Crypt.encrypt(lgin000DTO.getScrtNo()));
		lgin000DTO.setIpAddr(Inet4Address.getLocalHost().getHostAddress());
		lgin000DTO.setExtNoUseYn(lgin000DTO.getExtNo());
		lgin000DTO.setBsVlMgntNo(4);

		// 로그인검증용 사용자정보조회(화면에서 클릭 당시)
		LGIN000VO userInfo = this.lgin000Service.LGIN000SEL07(lgin000DTO);

		Integer status = this.loginCheck(lgin000DTO, userInfo, locale);

		log.debug(" login status = {}", status);

		if (status > 0) {

		} else {

			// TODO: 로그인 검증 처리 후 JWT 발급 추가
			JSONObject jsonObj = this.provider.isValidToken(userInfo);

			if(jsonObj.get("status") == HttpStatus.OK) {
				Claims claims = (Claims) jsonObj.get("claims");
				
				// TODO: 만료시 refresh 토큰으로 accesstoken 재발급, refresh 토큰까지 만료시 jwt토큰 재발급

			}


		}

		return ResponseEntity.status(resultStatus).body(this.objectMapper.writeValueAsString(json));
	}

	/**
	 * @Method Name : 태넌트 다국어코드 조회(LGIN000SEL03)
	 * @작성일      : 2022.03.21
	 * @작성자      : sukim
	 * @변경이력    :
	 * @Method 설명 : 태넌트 다국어코드 조회
	 * @param       : 태넌트ID(tenantId)
	 * @return      : ModelAndView HashMap
	 */
	@PostMapping("/LGIN000SEL03")
	@ResponseBody
	public ResponseEntity<String> LGIN000SEL03(@RequestBody String request, Locale locale) {

		HashMap<String, Object> LGIN000SEL03_hashMap = new HashMap<String, Object>();
		JSONParser parser = new JSONParser();
		String result = null;

		try {
			JSONObject jsonObject = (JSONObject) parser.parse(request);
			LGIN000VO vo = new LGIN000VO();
			vo.setTenantId((String) jsonObject.get("tenantId"));

			LGIN000VO mlingCd = this.lgin000Service.LGIN000SEL03(vo);

			String rtnMsg =
					(mlingCd != null) ? messageSource.getMessage("success.common.select", null, "success select", locale)
							: messageSource.getMessage("LGIN000M.error.tenantId", null, "error tenantId", locale);

			LGIN000SEL03_hashMap.put("result", this.objectMapper.writeValueAsString(mlingCd));
			LGIN000SEL03_hashMap.put("msg"   , rtnMsg);

			result = this.objectMapper.writeValueAsString(LGIN000SEL03_hashMap);

		}catch(Exception e) {
			log.error("["+e.getClass()+"] Exception : " + e.getMessage());
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(messageSource.getMessage("LGIN000M.error.loginBlock", null, "server error", locale));
		}
		return ResponseEntity.ok().body(result);
	}


	public int loginCheck(LGIN000DTO lgin000DTO, LGIN000VO userInfo, Locale locale) throws Exception{

		// 상태코드
		int resultCode = 0;

		if(userInfo != null && lgin000DTO.getScrtNo().equals(userInfo.getScrtNo())) {

			if(Integer.parseInt(userInfo.getUsrGrd()) < 900) {

				if(userInfo.isCheckPassWord()) {
					// 패스워드 변경일 만료
					resultCode = 4;
				}else if(userInfo.getAcStCd().equals("3")) {
					// 계정 만료 된 사용자
					resultCode = 3;
					if(userInfo.isCheckQualLossDd()) {
						// 계정 사용기간 만료 사용자
						userInfo.setAcStCd("3");      // 사용기간만료
						userInfo.setAcStRsnCd("9");   // 계정잠김
						this.lgin000Service.LGIN000UPT01(userInfo);
					}
				}else if(userInfo.getAcStCd().equals("2")) {
					// 이미 오류횟수초과 계정이 잠긴 사용자
					resultCode = 3;
				}
			}

			userInfo.setSysLogMsg(this.messageSource.getMessage("LGIN000M.button.btnLogin", null, "LGIN000M.btnLogin", locale));

			//사용자정보변경, 로그인이력생성
			this.lgin000Service.LGIN000UPT02(userInfo);
			userInfo.setSysLogDvCd("1000");
			userInfo.setSysLogMsg(this.messageSource.getMessage("LGIN000M.login", null, "LGIN000M.login", locale));
			this.lgin000Service.LGIN000INS01(userInfo);

		}else{
			//로그인 실패
			resultCode = 1;

			if(userInfo.isCheckPwErrTcnt()) {
				this.lgin000Service.LGIN000UPT04(userInfo);
				if(userInfo.getPwErrTcnt() >= userInfo.getBscPwErrTcnt() - 1) {
					userInfo.setAcStCd("2");      //계정잠김
					userInfo.setAcStRsnCd("3");   //비밀번호초과
					lgin000Service.LGIN000UPT01(userInfo); //계정잠김처리
					resultCode = 2;
				}

			}else{
				// 5회 초과 계정잠금
				resultCode = 2;
			}
		}

		return resultCode;

	}

}