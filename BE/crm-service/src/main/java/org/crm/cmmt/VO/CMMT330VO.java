package org.crm.cmmt.VO;
import lombok.Getter;
import lombok.Setter;

import java.sql.Timestamp;

/***********************************************************************************************
 * Program Name : 반려사유 - popup VO
 * Creator      : 이민호
 * Create Date  : 2022.07.28
 * Description  : 컨텐츠 반려사유 Popup
 * Modify Desc  :
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.78.28      이민호           최초생성
 ************************************************************************************************/

@Getter
@Setter
public class CMMT330VO {

	// 지식
	int ctgrNo;		 	// 카테고리번호
	int cntntsNo; 		// 컨텐츠번호

	// 게시판
	int ctgrMgntNo;		// 카테고리번호
	int blthgMgntNo;	// 게시물번호

	// 공통VO
	int tndwSeq;		// 반려순번
	String tndwRsn;		// 반려사유
	Timestamp tndwDtm;
	String rjtrId;
	String rjtrOrgCd;
	String rjtrNm;

	// 공통param
	String tenantId;
	String category;
	String usrId;
	String OrgCd;
}
