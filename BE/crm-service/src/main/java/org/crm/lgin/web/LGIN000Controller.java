package org.crm.lgin.web;


import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.crm.lgin.VO.LGIN000VO;
import org.crm.lgin.service.LGIN000Service;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.*;

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

	private MessageSource messageSource;
	private ObjectMapper objectMapper;
	private RedisTemplate redisTemplate;

	@Autowired
	public LGIN000Controller(MessageSource messageSource, ObjectMapper objectMapper, RedisTemplate redisTemplate) {
		this.messageSource = messageSource;
		this.objectMapper = objectMapper;
		this.redisTemplate = redisTemplate;
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

			LGIN000VO mlingCd = lgin000Service.LGIN000SEL03(vo);

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


	@PostMapping(value = "/login", consumes = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity login(@RequestBody @Valid LGIN000DTO lgin000DTO, Errors errors) throws Exception {

		JSONObject json = new JSONObject();
		StringBuffer buffer = new StringBuffer();
		SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		HttpStatus status = null;

		if(errors.hasErrors()) {
			return ResponseEntity.badRequest().body(errors);
		}

		Authentication authentication = this.authService.authenticate(lgin000DTO);
		status = this.provider.isValidToken(authentication);

		buffer.append(lgin000DTO.getTenantId());
		buffer.append(this.SEPARATOR);
		buffer.append(lgin000DTO.getUsrId());

		switch (status) {
			case OK -> {
				String refresh = (String) this.redisTemplate.opsForValue().get(buffer.toString());
				Claims claims = this.provider.parseClaims(refresh);
				json.put("result", JwtToken.builder()
						.refreshToken(refresh)
						.refreshTokenExpiration(dateFormat.format(claims.getExpiration()))
						.build());
			}
			case CREATED -> {
				JwtToken jwtToken = this.provider.generateToken(authentication);
				json.put("status" , HttpStatus.CREATED.value());
				json.put("message", HttpStatus.CREATED);
				json.put("result" , jwtToken);
			}
		}

		return ResponseEntity.status(status).body(json);

	}

}