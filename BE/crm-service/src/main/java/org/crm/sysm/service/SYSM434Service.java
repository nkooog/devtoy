package org.crm.sysm.service;

import java.util.List;

import org.crm.lgin.VO.LGIN000VO;
import org.crm.sysm.VO.SYSM433VO;
import org.crm.sysm.VO.SYSM434VO;

/***********************************************************************************************
 * Program Name : SMS 일괄발송 Service
 * Creator      : 정대정
 * Create Date  : 2022.08.16
 * Description  : SMS 일괄발송
 * Modify Desc  :
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.08.16    정대정           최초생성
 ************************************************************************************************/
public interface SYSM434Service {

	List<SYSM434VO> SYSM434SEL01(SYSM434VO vo) throws Exception;
	
	List<SYSM434VO> SYSM434SEL02(SYSM434VO vo) throws Exception;
	
	int SYSM434SEL0201(SYSM434VO vo) throws Exception;
	
	List<SYSM434VO> SYSM434SEL03(SYSM434VO vo) throws Exception;
	
	int SYSM434SEL0302(SYSM434VO vo) throws Exception;
	
	List<SYSM434VO> SYSM434SEL04(SYSM434VO vo) throws Exception;
	
	List<LGIN000VO> SYSM434SEL06(SYSM434VO vo) throws Exception;
	
	List<LGIN000VO> SYSM434SEL07(SYSM433VO vo) throws Exception;
	
	SYSM434VO SYSM434SEL0501(SYSM434VO vo) throws Exception;

	int SYSM434INS01(List<SYSM434VO> vo) throws Exception;
	
	int SYSM434INS02(List<SYSM434VO> vo) throws Exception;
	
	int SYSM434INS0201(SYSM434VO vo) throws Exception;
	
	int SYSM434INS03(List<SYSM434VO> vo) throws Exception;
	
	int SYSM434INS04(List<SYSM434VO> list) throws Exception;

	int SYSM434UPT01(List<SYSM434VO> vo) throws Exception;
	
	int SYSM434UPT0102(List<SYSM434VO> vo) throws Exception;
	
	int SYSM434UPT0103(SYSM434VO vo) throws Exception;
	
	int SYSM434UPT02(SYSM434VO vo) throws Exception;
	
	int SYSM434UPT0201(List<SYSM434VO> vo) throws Exception;
	
	int SYSM434UPT0202(List<SYSM434VO> vo) throws Exception;
	
	int SYSM434UPT0203(List<SYSM434VO> vo) throws Exception;
	
	int SYSM434UPT0209(List<SYSM434VO> vo) throws Exception;
	
	int SYSM434UPT0301(SYSM434VO vo) throws Exception;
	
	int SYSM434UPT0302(List<SYSM434VO> vo) throws Exception;
	
	int SYSM434DEL01(List<SYSM434VO> vo) throws Exception;
	
	int SYSM434DEL03(List<SYSM434VO> vo) throws Exception;


	int SYSM434INS05(SYSM434VO vo) throws Exception;

}
