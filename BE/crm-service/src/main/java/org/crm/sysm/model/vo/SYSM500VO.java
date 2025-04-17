package org.crm.sysm.model.vo;

import lombok.Getter;
import lombok.Setter;
import org.crm.comm.model.vo.CmmnSrchVO;

import java.math.BigInteger;
import java.sql.Timestamp;

/***********************************************************************************************
* Program Name : 실시간운영메시지관리 VO
* Creator      : jrlee
* Create Date  : 2022.06.08
* Description  : 실시간운영메시지관리
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.06.08     jrlee           최초생성
************************************************************************************************/
@Getter
@Setter
public class SYSM500VO extends CmmnSrchVO {
    private BigInteger oprNotiNo;
    private String tenantId;
    private String tenantNm;
    private String notiDvCd;
    private String notiTite;
    private String notiCtt;
    private Timestamp notiStrDtm;
    private Timestamp notiEndDtm;
    private String apclDvCd;
    private Timestamp regDtm;
    private String regrId;
    private String regrOrgCd;
    private Timestamp lstCorcDtm;
    private String lstCorprId;
    private String lstCorprOrgCd;
    private String lstCorprNm;
}
