package org.crm.sysm.VO;


import org.crm.cmmn.VO.CmmnSrchVO;
import lombok.Getter;
import lombok.Setter;

/***********************************************************************************************
 * Program Name : 상담그룹코드 관리 VO Creator : wkim Create Date : 2023.02.13
 * Description : 상담그룹코드 관리 Modify Desc :
 * -----------------------------------------------------------------------------------------------
 * Date | Updater | Remark
 * -----------------------------------------------------------------------------------------------
 * 2023.02.13 wkim 최초생성
 ************************************************************************************************/

@Getter @Setter
public class SYSM520VO extends CmmnSrchVO {

	/* 검색 조건 */
	private String cnslGroupCode;
	private String cnslGroupName;
	private String useYn;

	private String cnsl_grp_nm;
	private String id;
	private String tenantId;
	private String cnslGrpCd;
	private String cnslGrpCdOld;
	private String cnslGrpNm;
	private String cnslGrpQueueId;
	private String cnslGrpNmOld;
	private String grpCdUseYn;
	private String grpCdUseYnOld;
	
	private String cnslGrpCdFlg;
	
	private String regUsrNm;
	private String regOrgNm;
	private String regDtm;
	private String lstUsrNm;
	private String lstOrgNm;
	private String lstCorcDtm;
	
	private String regUserId;
	private String regOrgCd;
	private String lstUserId;
	private String lstOrgCd;

	private int cnt;
}
