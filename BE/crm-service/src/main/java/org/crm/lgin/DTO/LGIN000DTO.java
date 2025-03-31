package org.crm.lgin.DTO;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class LGIN000DTO {

	@NotBlank(message = "테넌트 아이디는 필수값 입니다.")
	@Size(min = 3, max = 3, message = "테넌트 아이디는 3자리 여야 합니다.")
	private String tenantId;

	@NotBlank(message = "사용자 아이디는 필수값 입니다.")
	private String usrId;

	@NotBlank(message = "비밀번호는 필수값 입니다.")
	private String scrtNo;

	private String mlingCd;
}
