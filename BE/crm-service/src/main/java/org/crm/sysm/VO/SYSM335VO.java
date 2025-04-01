package org.crm.sysm.VO;


import org.crm.cmmn.VO.CmmnSrchVO;
import lombok.Getter;
import lombok.Setter;

/***********************************************************************************************
* Program Name : 공통코드찾기 VO
* Creator      : jrlee
* Create Date  : 2022.04.25
* Description  : 공통코드찾기
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.04.25     jrlee           최초생성
************************************************************************************************/
@Getter @Setter
public class SYSM335VO extends CmmnSrchVO {
    private String mlingCd;
    private String mgntItemCd;
    private String mgntItemCdNm;
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
    private String useDvCd;

}
