package org.crm.comm.VO;

import lombok.Getter;
import lombok.Setter;

/***********************************************************************************************
* Program Name : 공통 서비스 VO
* Creator      : sukim
* Create Date  : 2022.02.03
* Description  : 공통 서비스
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.02.03     sukim            최초생성
* 2024.12.02     박준영           egov->springboot mig
************************************************************************************************/
 @Getter
 @Setter
public class COMM100VO {
	private String mgntItemCd;
	private String comCd;
	private String mlingCd;
	private String comCdNm;
	private int    srtSeq;
	private String hgrkComCd; 
	private String subCdYn; 
	private String subMgntItemCd;
	private int    mapgVluCnt;
	private String mapgVluUnitCd;
	private String mapgVlu1;
	private String mapgVlu2;
	private String mapgVlu3;
	private String mapgVlu4;
	private String useDvYn;
	private String tenantId; 
	private String tenantNm;
	private String fmnm;
	private String fmnmEng;
	private String orgLvlCd;
	private String orgCd;
	private String orgNm;
	private String orgPath;
	private String usrId;
	private String usrNm;
	private String usrGrd;
}
