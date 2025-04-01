package org.crm.sysm.VO;

import org.crm.cmmn.VO.CmmnSrchVO;
import lombok.Getter;
import lombok.Setter;

import java.sql.Timestamp;

/***********************************************************************************************
* Program Name : 그룹별 DataFrame 권한관리 VO
* Creator      : jrlee
* Create Date  : 2022.06.23
* Description  : 그룹별 DataFrame 권한관리
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.06.23     jrlee           최초생성
************************************************************************************************/
@Getter
@Setter
public class SYSM310VO extends CmmnSrchVO {
    private String tenantId;
    private String dataFrmId;
    private String dataFrmeClasCd;
    private String pkgClasCd;
    private String dataFrmTypCd;
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

    private Integer butnSeq;
    private String butnTypCd;
    private String butnId;
    private String butnNm;
    private String butnStCd;
    private String linkSumnPgmId;

    private String usrGrd;
}
