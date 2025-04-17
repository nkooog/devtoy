package org.crm.comm.model.vo;

import lombok.*;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class CommResponse<T> {

	private T result;
	private Integer status;
	private String message;

}
