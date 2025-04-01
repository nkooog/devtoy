package org.crm.sysm.VO;

import lombok.*;

import java.sql.Timestamp;

/***********************************************************************************************
 * Program Name : 데이터프레임 템플릿 레이아웃 편집 VO
 * Creator      : jrlee
 * Create Date  : 2022.08.10
 * Description  : 데이터프레임 템플릿 레이아웃 편집
 * Modify Desc  :
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.08.10     jrlee           최초생성
 ************************************************************************************************/

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SYSM301VO {
    private String type;
    // t_fram_pat_info
    private String tenantId;
    private String dataFrmId;
    private String patFrmeCd;
    private String patFrmeTypCd;
    private Integer frmeMenuCnt;
    private String cnntPgmId;
    private String cnntPgmNm;
    private String scrnDispDrctCd;
    private String lyotApclDvCd;
    private Timestamp regDtm;
    private String regrId;
    private String regrOrgCd;
    // t_data_frm_menu
    private Integer menuNo;
    private Integer menuSrtSeq;
    private String frmePatMenuNm;
    private String iconTypClss;
    private String dataFrmeCrdId;
    private String titeDispYn;
    // t_data_frme_butn_info
    private Integer butnSeq;
    private String butnTypCd;
    private String butnNm;
    private String procFnctNm;
    private Timestamp lstCorcDtm;
    private String lstCorprId;
    private String lstCorprOrgCd;


    public SYSM301VO(String tenantId, String dataFrmId, String patFrmeCd) {
        this.tenantId = tenantId;
        this.dataFrmId = dataFrmId;
        this.patFrmeCd = patFrmeCd;
    }
}
