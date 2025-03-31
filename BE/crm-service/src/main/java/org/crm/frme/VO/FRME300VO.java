package org.crm.frme.VO;

import lombok.*;

/***********************************************************************************************
* Program Name : 부가서비스 팝업 VO
* Creator      : jrlee
* Create Date  : 2022.08.09
* Description  : 부가서비스 팝업 VO
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.08.09     jrlee            최초생성
************************************************************************************************/
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class FRME300VO {
    private String tenantId;
    private String usrId;
    private String adtnSltnDvCd;
    private String connAddr;
}
