package org.crm.frme.web;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.crm.comm.model.vo.CommResponse;
import org.crm.frme.model.dto.FRME290DTO;
import org.crm.frme.model.vo.FRME290VO;
import org.crm.frme.service.FRME290Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Locale;

@Slf4j
@Controller
@RequestMapping("/frme/*")
public class FRME290Controller {

	@Resource(name="FRME290Service")
	private FRME290Service service;

	private ObjectMapper objectMapper;
	private MessageSource messageSource;

	@Autowired
	public FRME290Controller(ObjectMapper objectMapper, MessageSource messageSource) {
		this.objectMapper = objectMapper;
		this.messageSource = messageSource;
	}

	@PostMapping(value = "/FRME290SEL01")
	public ResponseEntity FRME290SEL01(@RequestBody FRME290DTO dto, Locale locale) {

		CommResponse commResponse = null;

		try {
			List<FRME290VO> list = this.service.FRME290SEL01(dto);

			commResponse = CommResponse.builder()
					.result(list)
					.message(this.messageSource.getMessage("success.common.select", null, "success select", locale))
					.status(HttpStatus.OK.value())
					.build();

		} catch (Exception e) {
			log.error("[" + e.getClass() + "] Exception : " + e.getMessage());
			commResponse = CommResponse.builder()
					.message(this.messageSource.getMessage("fail.request.msg", null, "select fail", locale))
					.status(HttpStatus.INTERNAL_SERVER_ERROR.value())
					.build();
		}

		return ResponseEntity.status(commResponse.getStatus()).body(commResponse);
	}

}
