package org.crm.cmmt.VO;

import lombok.*;
import org.springframework.web.multipart.MultipartFile;

import java.sql.Timestamp;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CMMT211VO {

	String tenantId;
	int ctgrNo;
	int cntntsNo;
	int moktiNo;
	int imgSeq;
	String cntntsImg;
	String cntntsImgIdxNm;
	String cntntsImgPsn;
	Timestamp regDtm;
	String regrId;
	String regrOrgCd;

	MultipartFile imgfile;

}
