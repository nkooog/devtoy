package org.crm.sysm.VO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import org.crm.comm.VO.COMM000VO;

import java.sql.Timestamp;

/***********************************************************************************************
* Program Name : 태넌트 정보관리 VO
* Creator      : 김보영
* Create Date  : 2022.01.10
* Description  : 태넌트 정보관리
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.01.10    김보영           최초생성
* 2024.11.29    jypark          egov -> boot mig
************************************************************************************************/
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class SYSM100VO extends COMM000VO {

	private Timestamp regDtm;
	private String regrId;
	private String regrOrgCd;
	private Timestamp lstCorcDtm;
	private String lstCorprId;
	private String lstCorprOrgCd;
	private Timestamp abolDtM;
	private String abolmnId;
	private String abolmnOrgCd;
	private String useYn;
	
	//조회 추가
	private Integer bsVlMgntNo;

}
