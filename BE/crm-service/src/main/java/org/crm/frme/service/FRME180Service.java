package org.crm.frme.service;


import org.crm.frme.VO.FRME180VO;

/***********************************************************************************************
* Program Name : 근태관리 Service
* Creator      : sukim
* Create Date  : 2022.05.12
* Description  : 근태관리 Service
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.05.12     sukim            최초생성
************************************************************************************************/
public interface FRME180Service {
	
	//근태 체크용 건수조회 (0 : 근태 미등록, 1 : 출근 등록,  2 : 퇴근 등록)
	int FRME180SEL01(FRME180VO frme180Vo) throws Exception;
	
	//근태시간조회 (dgindDvCd 1 : 출근,  2 : 퇴근)
	FRME180VO FRME180SEL02(FRME180VO frme180Vo) throws Exception;
	
	//근태시간조회
	FRME180VO FRME180SEL03(FRME180VO frme180Vo) throws Exception;
	
	//출/퇴근 등록
	int FRME180INS01(FRME180VO frme180Vo) throws Exception;
	
	//사진정보 등록
	int FRME180INS02(FRME180VO frme180Vo) throws Exception;
	
}
