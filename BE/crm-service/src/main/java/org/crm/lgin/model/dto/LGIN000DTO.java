package org.crm.lgin.model.dto;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class LGIN000DTO {

	@NotNull(message = "{LGIN000M.form.tenantId} {common.required.msg}")
	@Pattern(regexp = "^[a-zA-Z\\s]+$", message = "{LGIN000M.error.alphabet}")
	@Size(min = 3, max = 3, message = "{LGIN000M.error.tenant.info}")
	private String tenantId;

	@NotNull(message = "{LGIN000M.form.usrId} {common.required.msg}")
	private String usrId;

	@NotNull(message = "{LGIN000M.form.scrtNo} {common.required.msg}")
	@Size(min = 5, max = 20, message = "{LGIN000M.error.passw.length}")
	private String scrtNo;

	private String mlingCd;
	private String ipAddr;
	private String extNo;
	private String extNoUseYn;
	private Integer bsVlMgntNo;
}
