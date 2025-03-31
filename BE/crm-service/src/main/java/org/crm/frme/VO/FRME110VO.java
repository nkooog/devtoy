package org.crm.frme.VO;
import lombok.*;

import java.sql.Timestamp;
import java.util.Date;

/***********************************************************************************************
 * Program Name : HelpDesk 팝업 VO
 * Creator      : 이민호
 * Create Date  : 2022.03.11
 * Description  : HelpDesk 팝업
 * Modify Desc  :
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022. 03.11   이민호           최초생성
 ************************************************************************************************/
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class FRME110VO {
    private String tenantId;
    private int ctgrNo;
    private int cntntsNo;
    private String cntntsTite;
    private String cntntsTypCd;
    private String kldTop10DispYn;
    private String kldStCd;
    private String cntntsRpsImg;
    private String cntntsRpsImgIdxNm;
    private String cntntsRpsImgPsn;
    private String cntntsValdTrmStrDd;
    private String cntntsValdTrmEndDd;
    private String permValdYn;
    private String cntntsRegApvNcsyYn;
    private Date apvDtm;
    private String apprId;
    private String apprOrgCd;
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
