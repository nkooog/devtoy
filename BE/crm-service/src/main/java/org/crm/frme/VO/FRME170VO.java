package org.crm.frme.VO;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;

/***********************************************************************************************
* Program Name : 알림 VO
* Creator      : jrlee
* Create Date  : 2022.05.26
* Description  : 알림 VO
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.05.26     jrlee            최초생성
************************************************************************************************/
@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class FRME170VO {
    private String tenantId;
    private String usrId;
    private String ctgrMgntNo;
    private String blthgMgntNo;
    private String blthgTite;
    private String bltnTrmStrDd;
    private String bltnTrmEndDd;
    private String regDtm;

    private String usrGrdCd;

    private String orgCd;
}
