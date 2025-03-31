package org.crm.sysm.VO;


import org.crm.cmmn.VO.CmmnSrchVO;
import lombok.Getter;
import lombok.Setter;

/***********************************************************************************************
* Program Name : 데이터카드 레이아웃 관리 VO
* Creator      : jrlee
* Create Date  : 2022.08.19
* Description  : 데이터카드 레이아웃 관리
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.08.19     jrlee           최초생성
************************************************************************************************/
@Getter
@Setter
public class SYSM320VO extends CmmnSrchVO {
    private String tenantId;
    private String dataFrmId;
    private Integer itemSeq;
    private String mgntItemCd;
    private String mgntItemCdNm;
    private String mgntItemTypCd;
    private Integer dataSzIntMnriCnt;
    private Integer dataSzDecMnriCnt;
    private Integer scrnCtolSz;
    private Integer scrnDispSeq;
    private String scrnDispYn;
    private String mdtyYn;
    private String useDvCd;
    private String srchUseYn;
    private String regrId;
    private String regrOrgCd;
    private String lstCorprId;
    private String lstCorprOrgCd;

    public SYSM320VO() {
    }

    public SYSM320VO(String tenantId, String dataFrmId) {
        this.tenantId = tenantId;
        this.dataFrmId = dataFrmId;
    }
}
