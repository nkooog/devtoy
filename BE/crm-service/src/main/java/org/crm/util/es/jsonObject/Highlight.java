package org.crm.util.es.jsonObject;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.util.ArrayList;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Highlight {

	private ArrayList<String> title;

	@JsonProperty("mokti.moktiCttTxt")
	private ArrayList<String> mokti;

}