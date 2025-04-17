package org.crm.frme.model.vo;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.sql.Timestamp;

/***********************************************************************************************
* Program Name : 환경설정 VO
* Creator      : jrlee
* Create Date  : 2022.04.21
* Description  : 환경설정 VO
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.04.21     jrlee            최초생성
* 2024.12.02     박준영           egov->springboot mig
************************************************************************************************/
@Getter
@Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class FRME160VO {
    private String usrId;
    private String tenantId;
    private String hlpdkUseYn;
    private String msgrUseYn;
    private String smsUseYn;
    private String kldSrchUseYn;
    @JsonProperty("qLnkUseYn")
    private String qLnkUseYn;
    private String favrlistUseYn;
    private String alrmUseYn;
    private String miniDashUseYn;
    private String softPnUseYn;
    private String mcqUseYn;
    private String daulMoniUseYn;
    private String alrmEffctUseYn;
    private String alrmPoupEffctUseYn;
    private String sknCd;
    private String sknCdNm;
    private Timestamp regDtm;
    private String regrId;
    private String regrOrgCd;
    private Timestamp lstCorcDtm;
    private String lstCorprId;
    private String lstCorcOrgCd;

    private String testUseYn;


}
