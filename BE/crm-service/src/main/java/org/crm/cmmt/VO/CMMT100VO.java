package org.crm.cmmt.VO;

import lombok.Getter;
import lombok.Setter;

import java.sql.Timestamp;

/***********************************************************************************************
 * Program Name : 게시판 만들기 VO
 * Creator      : 정대정
 * Create Date  : 2022.03.31
 * Description  : 게시판 만들기
 * Modify Desc  :
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.03.31      정대정           최초생성
 ************************************************************************************************/
@Getter @Setter
public class CMMT100VO {

	private String tenantId;
	private int ctgrMgntNo;
	private String ctgrNm;
	private String ctgrTypCd;
	private int prsLvl;
	private int srtSeq;
	private int hgrkCtgrMgntNo;
	private String hgrkCtgrMgntNm;
	private String ctgrAttrCd;
	private String ctgrDesc;
	private String ctgrStLrgclasCd;
	private String ctgrStSmlclasCd;
	private String useTrmStrDd;
	private String useTrmEndDd;
	private String permUseYn;
	private String atclWritPmssYn;
	private String replyWritPmssYn;
	private String goodPmssYn;
	private String alrmUseYn;
	private String dashBrdDispPmssYn;
	private String dashBrdDispPsnCd;
	private int apndFilePmss;
	private String apndFileSzUnitCd;
	private int apndFileMaxSz;
	private int apndFileAllSz;
	private String ctgrUseAthtCd;
	private String ctgrAdmnId;
	private String blthgApvNcsyYn;
 	private Timestamp regDtm;
	private String regrId;
	private String regrOrgCd;
	private Timestamp lstCorcDtm;
	private String lstCorprId;
	private String lstCorcOrgCd;
	private Timestamp abolDtm;
	private String abolmnId;
	private String abolmnOrgCd;
	private int	idx;
	private int tbmCount;
	private String blthgMgntNo;
	private String blthgStCd;

}
