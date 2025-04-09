package org.crm.lgin.model.vo;

import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.crm.comm.VO.COMM000VO;

import java.sql.Date;
import java.sql.Timestamp;
/***********************************************************************************************
* Program Name : 로그인 VO
* Creator      : sukim
* Create Date  : 2022.02.03
* Description  : 로그인
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.02.03     sukim            최초생성
* 2024.11.29     jypark           egov -> boot mig
************************************************************************************************/
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class LGIN000VO extends COMM000VO {

	private String originTenantId;
	private String usrId;
	private String scrtNo;
	private String decScrtNo;
	private String acStCd;
	private String acStRsnCd;
	private Timestamp scrtNoLstUpdDtm;
	private int pwErrTcnt;
	private String usrNm;
	private String decUsrNm;
	private String usrAlnm;
	private String usrAlnmUseYn;
	private String potoImgFileNm;
	private String potoImgIdxFileNm;
	private String potoImgPsn;
	private String orgCd;
	private String orgNm;
	private String orgCdVrsn;
	private Date qualAcqsDd;
	private Date qualLossDd;
	private String usrGrd;
	private String originUsrGrd;
	private String usrGrdNm;
	private String unfyBlbdCreAthtYn;
	private String kldCtgrCreAtht;
	private String athtLvlOrgCd;
	private String athtLvlDtCd;
	private String kldScwdSaveYn;
	private String autoPfcnUseYn;
	private Timestamp lstLginDtm;
	private String lstLginIpAddr;
	private String lstLginExtNo;
	private Timestamp lstLgoutDtm;
	private String lstLgoutIpAddr;
	private String lstLgoutExtNo;
	private Timestamp regDtm;
	private String regrId;
	private String regrOrgCd;
	private Timestamp lstCorcDtm;
	private String lstCorprId;
	private String lstCorprOrgCd;
	private Timestamp abolDtm;
	private String abolmnId;
	private String abolmnOrgCd;
	private int checkCnt;
	private int lginRsltCd;
	private String lginRsltMsg;
	private String ipAddr;
	private String ctiUseYn;    
	private String ctiAgenId;
	private String extNo;
	private String sysLogMsg;
	private String sysLogDvCd;
	private String currentDate;
	private String mapgVlu1;
	private String ctiAgenPw;
	private String cntyCd;
	private String emlAddrIsd;
	private String decEmlAddrIsd;
	private String emlAddrIsdDmn;
	private String emlAddrExtn;
	private String decEmlAddrExtn;
	private String emlAddrExtnDmn;
	private String extNoUseYn;
	private String orgPath;
	private String cmmtSetlmnYn;
	private String kldMgntSetlmnYn;
	private int bsVlMgntNo;
	private String bascVluDvCd;
	private String menuAtht;
	private String cnslChnlDvCd;
	private String sttUseYn;		//테넌트의 STT 사용 여부

	private String personInfoMask;		//테넌트의 STT 사용 여부
	private String mbph_no;		// 휴대폰 번호
	
	private String lstLginScrtNo;
	private Integer bscPwErrTcnt;

	private boolean checkPassWord;
	private boolean checkQualLossDd;
	private boolean checkPwErrTcnt;

}