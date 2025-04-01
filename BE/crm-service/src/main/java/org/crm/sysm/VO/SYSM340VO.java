package org.crm.sysm.VO;

import lombok.*;

import java.sql.Timestamp;

/***********************************************************************************************
* Program Name : 공통코드관리 VO
* Creator      : jrlee
* Create Date  : 2022.05.02
* Description  : 공통코드관리
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.05.02     jrlee           최초생성
************************************************************************************************/
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class SYSM340VO {

    private String id;
    private String mgntItemCd;
    private String mlingCd;
    private String mgntItemTypCd;
    private String mgntItemCdNm;
    private String mgntItemCdEngnm;
    private Integer dataSzIntMnriCnt;
    private Integer dataSzSmlcntMnriCnt;
    private String dmnCd;
    private String mgntItemDesc;
    private String linkTblId;
    private Integer comCdCnt;

    private String comCd;
    private String comCdNm;
    private Integer srtSeq;
    private String hgrkComCd;
    private String subCdYn;
    private String subMgntItemCd;
    private Integer mapgVluCnt;
    private String mapgVluUnitCd;
    private String mapgVlu1;
    private String mapgVlu2;
    private String mapgVlu3;
    private String mapgVlu4;
    private String useDvCd;
    private Timestamp regDtm;
    private String regrId;
    private String regrOrgCd;
    private String lstCorprId;
    private Timestamp lstCorcDtm;
    private String lstCorprOrgCd;
    private String abolmnId;
    private Timestamp abolDtm;
    private String abolmnOrgCd;

    private String sttCd;

}