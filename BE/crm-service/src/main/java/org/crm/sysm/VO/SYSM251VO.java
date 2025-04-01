package org.crm.sysm.VO;

import lombok.*;

import java.sql.Timestamp;

/***********************************************************************************************
* Program Name : 데이터프레임 조회 VO
* Creator      : jrlee
* Create Date  : 2022.03.17
* Description  : 데이터프레임 조회
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.03.17     jrlee           최초생성
************************************************************************************************/
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class SYSM251VO {

    private String tenantId;
    private String dataFrmId;
    private String dataFrmeClasCd;
    private String pkgClasCd;
    private String dataFrmTypCd;
    private String dataFrmeCrdTypCd;
    private String dataFrmKornNm;
    private String dataFrmEngNm;
    private String dataFrmeTmplCd;
    private String dataFrmeTmplClss;
    private String itemArngDvCd;
    private Integer psnTop;
    private Integer psnLt;
    private Integer szWdth;
    private Integer szHght;
    private Integer brthItemCnt;
    private Integer vrtnItemCnt;
    private String lyotApclDvCd;
    private String scrnDispDrctCd;
    private Timestamp regDtm;
    private String regrId;
    private String regrOrgCd;
    private Timestamp lstCorcDtm;
    private String lstCorprId;
    private String lstCorprOrgCd;
    private Timestamp abolDtm;
    private String abolmnOrgCd;
    private String abolmnId;
    private String comCdNm;

    private String mapgVlu1;
}
