package org.crm.frme.VO;

import lombok.*;

/***********************************************************************************************
* Program Name : 사용자정보조회(사진, 출/퇴근 등록) VO
* Creator      : sukim
* Create Date  : 2022.05.09
* Description  : 사용자정보조회 - POP
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.05.09     sukim            최초생성
************************************************************************************************/
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class FRME180VO {
	private String tenantId;
	private String dgindDd;
	private String usrId;
	private int seq;
	private String dgindDvCd;
	private String dgindTm;
	private String regDtm;
	private String regrId;
	private String regrOrgCd;
	private String lstCorcDtm; 
	private String lstCorprId;
	private String lstCorprOrgCd; 
	private String potoImgFileNm;
	private String potoImgIdxFileNm;  
	private String potoImgPsn; 
	private String commuteTime;
	private String attendance;
	private String leavetheoffice;
	private String mlingCd;
	private String extNoUseYn;

}
