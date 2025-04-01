package org.crm.frme.VO;

import org.crm.cmmn.VO.CmmnSrchVO;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.sql.Timestamp;
import java.util.List;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@SuperBuilder
public class FRME220VO extends CmmnSrchVO {
	
	private String tenantId;
	private String usrId;
	private Integer ctgrNo;
	private Integer cntntsNo;
	private String cntntsTite;
	private String brdpath;
	private String usrNm;
	private Timestamp regDtm;
	private String regrOrgCd;
	private List<Integer> ctgrNoList;
	private Integer prsLvl;
	private Integer hgrkCtgrMgntNo;
}


