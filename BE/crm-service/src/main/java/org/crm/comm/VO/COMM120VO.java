package org.crm.comm.VO;

import lombok.Getter;
import lombok.Setter;

/***********************************************************************************************
* Program Name : 공통 파일처리 VO
* Creator      : sukim
* Create Date  : 2022.05.17
* Description  : 공통 서비스
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.05.17     sukim            최초생성
************************************************************************************************/
@Getter
@Setter
public class COMM120VO {
	/* 공통항목 */
	private String tenantId;        //테넌트ID
	private int    apndFileSeq;     //첨부파일순번
	private String apndFileNm;      //첨부파일명     
	private String apndFileIdxNm;   //첨부파일인덱스명
	private String apndFilePsn;     //첨부파일위치   
	private String regrId;          //등록자ID 
	private String regrOrgCd;       //등록자조직코드
}
