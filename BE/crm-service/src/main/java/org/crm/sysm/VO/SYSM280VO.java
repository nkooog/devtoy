package org.crm.sysm.VO;

import org.crm.cmmn.VO.CmmnSrchVO;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.sql.Timestamp;
import java.util.List;

/***********************************************************************************************
* Program Name : 상담유형 코드관리 Main VO
* Creator      : 김보영
* Create Date  : 2022.05.10
* Description  : 상담유형 코드관리
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.05.10    김보영           최초생성
************************************************************************************************/

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@SuperBuilder
public class SYSM280VO extends CmmnSrchVO {

    private String tenantId;
    private String cnslTypCd;
	private String id;
    private String mgntItemCd;
    private String baseAnswCd;
    private String baseAnswCdNm;
    private String cnslTypLvlNm;
    private String prsLvlCd;
    private String hgrkCnslTypCd;
    private Integer srtSeq;
    private String dataCreYn;
    private String useDvCd;
    
    private String lvl1Cd;
    private String lvl2Cd;
    private String lvl3Cd;
    private String maxCnslTypCd;
    
    private Integer seq;
    private String keywordNm;
    private Integer keywordEpctHitRt;
    
    private Timestamp regDtm;
    private String regrId;
    private String regrOrgCd;
    private Timestamp lstCorcDtm;
    private String lstCorprId;
    private String lstCorprOrgCd;
    private Timestamp abolDtm;
    private String abolmnId;
    private String abolmnOrgCd;
    
    private Integer rowNum;

	private List<String> cnslTypCdList;

	private String svcOprTypGrpCd;
	private String svcOprTypCd;
	private String svcOprHgrkTypGrpCd;
	
	private String cnslTypCdPath;

	private String lvl4Cd;
	private String lvl5Cd;

}
