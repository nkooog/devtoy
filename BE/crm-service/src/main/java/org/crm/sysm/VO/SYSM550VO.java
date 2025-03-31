package org.crm.sysm.VO;

import org.crm.cmmn.VO.CmmnSrchVO;
import lombok.Getter;
import lombok.Setter;

import java.math.BigInteger;
import java.sql.Timestamp;

/***********************************************************************************************
* Program Name : 장애공지관리 VO
* Creator      : shpark
* Create Date  : 2024.06.19
* Description  : 실시간운영메시지관리
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2024.06.19     shpark           최초생성
************************************************************************************************/
@Getter
@Setter
public class SYSM550VO extends CmmnSrchVO {
    private BigInteger oprNotiNo;
    private String tenantId;
    private String tenantNm;
    private String notiDvCd;
    private String notiDvNm;
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
