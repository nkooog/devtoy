package org.crm.comm.valid;

import org.json.simple.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;

import java.util.Locale;

@Component
public class CommValidation {

	private Logger logger = LoggerFactory.getLogger(getClass());

	private MessageSource messageSource;

	@Autowired
	public CommValidation(MessageSource messageSource) {
		this.messageSource = messageSource;
	}

	public JSONObject getValidationResultMap(BindingResult bindingResult, Locale locale) {

		JSONObject result = new JSONObject();
		JSONObject json = new JSONObject();

		StringBuffer buffer = new StringBuffer();

		bindingResult.getAllErrors().forEach(e -> {
			FieldError fieldError = (FieldError) e;
			logger.debug("error field : {}, error message : {}", fieldError.getField(), fieldError.getDefaultMessage());
			json.put(fieldError.getField(), fieldError.getDefaultMessage());

			if(buffer.toString().length() > 0) {
				buffer.append("<br>");
			}

			buffer.append(fieldError.getDefaultMessage());
		});

		result.put("result", json);
		result.put("message", buffer.toString());
		result.put("status", HttpStatus.BAD_REQUEST.value());

		return result;
	}

}
