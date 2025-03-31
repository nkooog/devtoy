package org.crm.sysm.VO;


import org.crm.cmmn.VO.CmmnSrchVO;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.sql.Timestamp;

/***********************************************************************************************
 * Program Name : 데이터프레임 관리 VO Creator : jrlee Create Date : 2022.06.30
 * Description : 데이터프레임 관리 Modify Desc :
 * -----------------------------------------------------------------------------------------------
 * Date | Updater | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.06.30 jrlee 최초생성
 ************************************************************************************************/
@Getter
@Setter
@SuperBuilder
public class SYSM300VO extends CmmnSrchVO {
	// t_data_frm
	private String id;
	private String tenantId;
	private String dataFrmId;
	private String dataFrmeClasCd;
	private String pkgClasCd;
	private String dataFrmTypCd;
	private String dataFrmKornNm;
	private String dataFrmEngNm;
	private String dataFrmeTmplCd;
	private String dataFrmeTmplCdOld;
	private String dataFrmeTmplCdFlg;
	private String dataFrmeTmplClss;
	private String dataFrmeCrdTypCd;
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
	// t_fram_pat_info
	private String patFrmeCd;
	private String patFrmeTypCd;
	private Integer frmeMenuCnt;
	private String cnntPgmId;
	// t_data_frme_butn
	private Integer butnSeq;
	private String butnTypCd;
	private String butnId;
	private String butnNm;
	private String butnStCd;
	private String linkSumnPgmId;
	// t_data_frm_menu
	private Integer menuNo;
	private Integer menuSrtSeq;
	private String frmePatMenuNm;
	private String iconTypClss;
	private String cnntDataCrdId;



    public SYSM300VO() {
    }

    public SYSM300VO(String tenantId, String dataFrmId) {
        this.tenantId = tenantId;
        this.dataFrmId = dataFrmId;
    }
}
