package org.crm.frme.model.vo;

import lombok.*;

import java.sql.Timestamp;

/***********************************************************************************************
* Program Name : 주업무전환 VO
* Creator      : jrlee
* Create Date  : 2022.05.10
* Description  : 주업무전환 VO
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.05.10     jrlee            최초생성
* 2024.12.02     박준영           egov->springboot mig
************************************************************************************************/
@Getter
@Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class FRME290VO {
    private String tenantId;
    private String usrId;
    private String usrGrd;
    private String prfRankCd;
    private String bizChoYn;
    private Timestamp regDtm;
    private String regrId;
    private String regrOrgCd;
    private Timestamp lstCorcDtm;
    private String lstCorprId;
    private String lstCorprOrgCd;
    private Timestamp abolDtm;
    private String abolmnId;
    private String abolmnOrgCd;
    private String mlingCd;
    private String extNoUseYn;
    private String originTenantId;
    private String originUsrGrd;
}
