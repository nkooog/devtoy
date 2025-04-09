package org.crm.comm.VO;

import lombok.*;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class CommResponse<T> {

	private T result;
	private Integer status;
	private String message;

}
