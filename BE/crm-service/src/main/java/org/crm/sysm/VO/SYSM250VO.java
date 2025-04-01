package org.crm.sysm.VO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.sql.Timestamp;

/***********************************************************************************************
* Program Name : 메뉴관리 VO
* Creator      : jrlee
* Create Date  : 2022.02.10
* Description  : 메뉴관리
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.02.10     jrlee           최초생성
************************************************************************************************/
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class SYSM250VO {

    private String id;
    private String tenantId;
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
    private String dataFrmId;
    private Integer srtSeqNo;
    private String iconTypClss;
    private String mlingCd;
    private String mapgVlu1;
    private String dataFrmKornNm;
    private String dataFrmEngNm;
}
