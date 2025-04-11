package org.crm.comm.exec;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.crm.comm.valid.CommValidation;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.client.HttpServerErrorException;

import java.nio.file.AccessDeniedException;
import java.util.Locale;

@Slf4j
@ControllerAdvice
public class CommGlobalExceptionHandler {

	private CommValidation validation;
	private ObjectMapper objectMapper;

	@Autowired
	public CommGlobalExceptionHandler(CommValidation validation, ObjectMapper objectMapper) {
		this.validation = validation;
		this.objectMapper = objectMapper;
	}

	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity handleValidationExceptions(MethodArgumentNotValidException e, Locale locale) {
		JSONObject json = this.validation.getValidationResultMap(e.getBindingResult(), locale);
		return ResponseEntity.ok().body(json);
	}

	@ExceptionHandler(HttpServerErrorException.class)
	public ResponseEntity handleInternalServerErrorException(HttpServerErrorException ex) throws JsonProcessingException {
		JSONObject json = new JSONObject();
		json.put("status", ex.getStatusCode().value());
		json.put("message", "서버오류가 발생하였습니다.");

		return ResponseEntity.status(ex.getStatusCode())
				.body(this.objectMapper.writeValueAsString(json));
	}

	@ExceptionHandler(HttpMessageNotReadableException.class)
	public ResponseEntity handleHttpMessageNotReadableException(HttpMessageNotReadableException ex) throws JsonProcessingException {

		JSONObject json = new JSONObject();
		json.put("status", HttpStatus.BAD_REQUEST.value());
		json.put("message", "요청본문을 찾을 수 없습니다.");

		return ResponseEntity.status(HttpStatus.BAD_REQUEST)
				.body(this.objectMapper.writeValueAsString(json));
	}

	@ExceptionHandler(AccessDeniedException.class)
	public String handleAccessDeniedException(AccessDeniedException ex) {
		return "/th/error/403";
	}

}
