package org.crm.sysm.VO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.sql.Timestamp;

/***********************************************************************************************
* Program Name : 그룹별 메뉴권한관리 VO
* Creator      : jrlee
* Create Date  : 2022.04.06
* Description  : 그룹별 메뉴권한관리
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.04.06     jrlee           최초생성
************************************************************************************************/
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class SYSM260VO {

    private String tenantId;
    private String mlingCd;
    private String menuId;
    private String menuNm;
    private String menuTypCd;
    private Integer prsMenuLvl;
    private String hgrkMenuId;
    private Timestamp regDtm;
    private String regrId;
    private String regrOrgCd;
    private Timestamp lstCorcDtm;
    private String lstCorprId;
    private String lstCorprOrgCd;
    private Timestamp abolDtm;
    private String abolmnId;
    private String abolmnOrgCd;
    private Integer srtSeqNo;
    private String usrGrd;
    private String dataFrmId;
    private Integer butnSeq;
    private String butnTypCd;
    private String butnId;
    private String butnNm;
    private String butnStCd;
    private String linkSumnPgmId;


}
