package org.crm.sysm.VO;

import lombok.*;

import java.sql.Timestamp;

/***********************************************************************************************
* Program Name : 조직관리 VO
* Creator      : 정대정
* Create Date  : 2022.01.10
* Description  : 조직관리
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.02.10     정대정           최초생성
************************************************************************************************/
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class SYSM130VO {

    // 조직_코드
    private String tenantId;          //테넌트_ID
    private String orgCd;             //조직_코드
    private String orgDvCd;           //조직_구분_코드
    private String orgNm;             //조직_명
    private String prsLvlCd;          //현재_레벨_코드
    private String hgrkOrgCd;         //상위_조직_코드
    private String hgrkOrgNm;         //상위_조직_명  -- Table Join
    private int    srtSeq;           //정렬_순서
    private String extnLinkCd;        //외부_연계_코드
    private String orgStCd;           //조직_상태_코드
    private String kmsDispYn;
    private int kmsCtgrNo;
    private String kmsCtgrNm;
    private Timestamp regDtm;         //등록_일_시
    private String regrId;            //등록자_ID
    private String lstCorprNm;        //등록자_Name
    private String regrOrgCd;         //등록자_조직_코드
    private Timestamp lstCorcDtm;     //최종_수정_일_시
    private String lstCorprId;        //최종_수정자_ID
    private String lstCorprOrgCd;     //최종_수정자_조직_코드
    private Timestamp abolDtm;        //폐기_일_시
    private String abolmnId;          //폐기자_ID
    private String abolmnOrgCd;       //폐기자_조직_코드
    private String orgLvlCd;
    private String operationType;
    private   String oriOrgStCd;

}
