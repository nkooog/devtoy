package org.crm.comm.VO;

import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

/***********************************************************************************************
* Program Name : 영업일관리 VO
* Creator      : sjyang
* Create Date  : 2023.01.03
* Description  : 영업일 관리 서비스
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2023.01.04     sjyang            최초생성
************************************************************************************************/
@Getter
@Setter
public class COMM140VO {
	
	private String tenantId;
	private String bussDt;
	private String bussYear;
	private String bussMonth;
	private String bussDay;
	private String wdayDvCd;
	private String wdayDvCdNm;
	private String lhldDvCd;
	private String mgntitemCd;
	private String lhldCd;
	private String bussStrHour;
	private String bussStrPt;
	private String bussStrTm;
	private String bussEndHour;
	private String bussEndPt;
	private String bussEndTm;
	private String memo;
	private String regDtm;
	private String regrId;
	private String regrOrgCd;
	private String lstCorcDtm;
	private String lstCorprId;
	private String lstCorprOrgCd;
	private String abolDtm;
	private String abolmnId;
	private String abolmnOrgCd;
	
	/* 검색 조건 : 연도 구분 */
	private String seq;
	private String searchType;
	private String searchBussDtDv;
	private String searchBussDtKeyWord;
	private String yearsConditions;
	private String searchYears[];
	private List<String> searchYearsY1 = new ArrayList<String>();
	private List<String> searchYearMonthY3 =  new ArrayList<String>();	
	
	/* 검색조건 : 휴일 구분 */
	private String searchLhldDv;
	private String daysConditions;
	private List<String> searchDaysConditions =  new ArrayList<String>();
	
	//private List<String> daysConditions = new ArrayList<String>();
	
	//private String searchYearsY2From;
	//private String searchYearsY2To;
	//private String searchYearMonthY4From;
	//private String searchYearMonthY4To;
	
	private String searchFrom;
	private String searchTo;
}
