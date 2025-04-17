package org.crm.sysm.model.service;


import org.crm.sysm.model.vo.SYSM200VO;

import java.util.List;

/***********************************************************************************************
* Program Name : 사용자 정보관리 Service
* Creator      : 허해민
* Create Date  : 2022.01.17
* Description  : 사용자 정보관리
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.01.17     허해민           최초생성
************************************************************************************************/
public interface SYSM200Service {
	List<SYSM200VO> SYSM200SEL01(SYSM200VO sys200vo) throws Exception;
	SYSM200VO  SYSM200SEL02(SYSM200VO sys200vo) throws Exception;
	int SYSM200SEL03(SYSM200VO sys200vo) throws Exception;
	int SYSM200SEL04(SYSM200VO sys200vo) throws Exception;
	int SYSM200UPT01(SYSM200VO sys200vo) throws Exception;
	int SYSM200UPT02(SYSM200VO sys200vo) throws Exception;
	int SYSM200UPT03(SYSM200VO sys200vo) throws Exception;
	int SYSM200UPT04(SYSM200VO sys200vo) throws Exception;
	int SYSM200UPT05(SYSM200VO sys200vo) throws Exception;
	int SYSM210DEL01(SYSM200VO sys200vo) throws Exception;
	int SYSM210DEL02(SYSM200VO sys200vo) throws Exception;
	int SYSM200INS01(SYSM200VO sys200vo) throws Exception;
	int SYSM200INS02(SYSM200VO sys200vo) throws Exception;
	int SYSM220DEL01(SYSM200VO sys200vo) throws Exception;
	int SYSM220INS01(List<SYSM200VO> sys200volist) throws Exception;
	int SYSM220UPT01(SYSM200VO sys200vo) throws Exception;
	int SYSM220DEL02(SYSM200VO sys200vo) throws Exception;
	int SYSM220INS02(List<SYSM200VO> sys200volist) throws Exception;
	int SYSM220UPT02(SYSM200VO sys200vo) throws Exception;
	int SYSM220UPT03(SYSM200VO sys200vo) throws Exception;
	int SYSM220DEL03(SYSM200VO sys200vo) throws Exception;
	int SYSM220INS03(List<SYSM200VO> sys200volist) throws Exception;	
	List<SYSM200VO> SYSM200SEL05(SYSM200VO sys200vo) throws Exception;
	List<SYSM200VO> SYSM200SEL06(SYSM200VO sys200vo) throws Exception;
	List<SYSM200VO> SYSM200SEL07(SYSM200VO sys200vo) throws Exception;
	int SYSM220UPT04(SYSM200VO sys200vo) throws Exception;
	
	
	//kw---20231123 : 비밀번호 업데이트 기간 구하기
	List<SYSM200VO> SYSM200SEL08(SYSM200VO sys200vo) throws Exception;

	int SYSM200INS03(SYSM200VO sys200vo) throws Exception;

	int SYSM200INS04(SYSM200VO sys200vo) throws Exception;
	int SYSM210DEL03(SYSM200VO sys200vo) throws Exception;
	int SYSM210DEL04(SYSM200VO sys200vo) throws Exception;
}
