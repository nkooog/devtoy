package org.crm.cmmn.VO;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CMMN100VO {

	private String noti_tite;
	private String noti_ctt;
	private String noti_dv_nm;
	private String noti_str_dtm;
	private String noti_end_dtm;
	private String oprNotiNo;
}
