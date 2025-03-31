package org.crm.sysm.VO;

import lombok.*;

/***********************************************************************************************
* Program Name : 메타관리항목관리 VO
* Creator      : 허해민
* Create Date  : 2022.02.25
* Description  : 메타관리항목관리
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.02.25     허해민           최초생성
************************************************************************************************/
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class SYSM240VO {

	/**T_관리_항목_코드*/
	private String mgntItemTypCd; 							/** 관리_항목_유형_코드 */		
	private String mgntItemCdNm;							/** 관리_항목_코드_한글명 */
	private String mgntItemCdEngnm;							/** 관리_항목_코드_영문명 */
	private int dataSzIntMnriCnt;							/** 데이터_크기_정수_자리_수 */
	private int dataSzSmlcntMnriCnt;						/** 데이터_크기_소수_자리_수 */
	private String dmnCd;									/** 도메인_코드 */
	private String mgntItemDesc;							/** 관리_항목_설명 */
	private String linkTblId;								/** 연계_테이블_ID */
	private String crypTgtYn;								/** 암호화 여부 코드*/
	private String crypTgtYnNm;								/** 암호화 여부 코드 한글명*/
	private String svcOprCd;								/** 서비스 운영 코드 - 서비스 운영 IF */
	

	/**T_공통_코드*/
	private String comCd;									/** 공통_코드 */
	private String comCdNm;									/** 공통_코드_명 */
	private int srtSeq;										/** 정렬_순서 */
	private String hgrkComCd;								/** 상위_공통_코드 */
	private String subCdYn;									/** 하위_코드_여부 */
	private String subMgntItemCd;							/** 하위_관리_항목_코드 */
	private int mapgVluCnt;									/** 매핑_값_수 */
	private String mapgVluUnitCd;							/** 매핑_값_단위_코드 */
	private String mapgVlu1;								/** 매핑_값1 */
	private String mapgVlu2;								/** 매핑_값2 */
	private String mapgVlu3;								/** 매핑_값3 */
	private String mapgVlu4;								/** 매핑_값4 */
	private String useDvCd;									/** 사용_구분_코드 */

	/**공통*/
	private String mgntItemCd;								/**관리_항목_코드*/
	private String originMgntItemCd;						/**관리_항목_코드*/
	private String mlingCd;									/** 다국어_코드 */
	private String regDtm;									/** 등록_일시 */
	private String regrId;									/** 등록자_ID */
	private String regrOrgCd;								/** 등록자_조직_코드 */
	private String lstCorcDtm;								/** 최종_수정_일시 */
	private String lstCorprId;								/** 최종_수정자_ID */
	private String lstCorprOrgCd;							/** 최종_수정자_조직_코드 */
	private String abolDtm;									/** 폐기_일시 */
	private String abolmnId;								/** 폐기자_ID */
	private String abolmnOrgCd;								/** 폐기자_조직_코드 */
	private String usrNm;									/** 사용자이름*/
	private String userNm;				
	private String sttCd;                                   /** 사용여부*/

}
