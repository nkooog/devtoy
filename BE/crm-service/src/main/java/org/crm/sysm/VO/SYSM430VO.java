package org.crm.sysm.VO;


import org.crm.lgin.VO.LGIN000VO;
import lombok.Getter;
import lombok.Setter;

/***********************************************************************************************
* Program Name : SMS탬플릿관리VO
* Creator      : 강동우
* Create Date  : 2022.04.28
* Description  : SMS탬플릿관리
* Modify Desc  : 
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.04.28     강동우           최초생성
 * @param <E>
************************************************************************************************/

@Getter @Setter
public class SYSM430VO extends LGIN000VO {

	// T_SMS_템플릿
	private int tmplMgntNo;				// 템플릿 관리 번호
	private String tmplDvCd;			// 템플릿 구분 코드
	private String tmplNm;				// 템플릿 명
	private String tmplCtt;				// 템플릿 내용
	private String useDvCd;				// 사용 구분 코드
	
	//T_SMS_템플릿_항목
	private int tmplItemSeq;			// 템플릿 항목 순번
	private String itemDvCd;			// 항묵 구분 코드
	private String itemDvMgntItemCd;	// 항목 구분 관리 항목 코드
	private String itemCd;				// 항목 코드
	private String itemCdDataNm;		// 항목 코드 데이터명
	private String dataSetId;			// 데이터세트 ID
	private String dataSetItemGrpId;	// 데이터 세트 항목 그룹 ID
	private String dataSetItemId;		// 데이터 세트 항목 ID
	private int colStrPsnVlu;			// 컬럼 시작 위치 값
	private int colLen;					// 컬럼 길이
	private int msgLen;					// 메세지 길이
	private int	lineGap;				// 줄간격
	private String url;					// url

	//SMS발송 템플릿 관리 추가
	private String tmplDvCdNm;          //발송서식코드명

	// 공통
	private String Id;
	private String common1;
	private String common2;
	private String common3;
	
	private int file_id;
	private String orign_file_nm;
	private String upload_file_nm;
	private String file_path;
	private Long file_size;
	private String[] delFiles;
}
