package org.crm.sysm.VO;

import lombok.*;

import java.sql.Timestamp;

/***********************************************************************************************
* Program Name : 관리항목찾기 VO
* Creator      : jrlee
* Create Date  : 2022.04.28
* Description  : 관리항목찾기
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.04.28     jrlee           최초생성
************************************************************************************************/
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class SYSM241VO {

    private String mgntItemCd;
    private String mlingCd;
    private String mgntItemTypCd;
    private String mgntItemCdNm;
    private String mgntItemCdEngnm;
    private Integer dataSzIntMnriCnt;
    private Integer dataSzSmlcntMnriCnt;
    private String dmnCd;
    private String mgntItemDesc;
    private String linkTblId;
    private String linkUrl;
    private String linkItem1;
    private String linkItem2;
    private String crypTgtYn;
    private Timestamp regDtm;
    private String regrId;
    private String regrOrgCd;
    private Timestamp lstCorcDtm;
    private String lstCorprId;
    private String lstCorprOrgCd;
    private Timestamp abolDtm;
    private String abolmnId;
    private String abolmnOrgCd;
}