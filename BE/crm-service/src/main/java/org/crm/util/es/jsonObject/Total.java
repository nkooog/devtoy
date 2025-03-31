package org.crm.util.es.jsonObject;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Total {
	private int value;
	private String relation;
}
