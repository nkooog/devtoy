package org.crm.cmmt.service;


import org.crm.cmmt.VO.CMMT600VO;

import java.util.List;

/***********************************************************************************************
 * Program Name : 뉴스레터 목록 Service
 * Creator      : 손동완
 * Create Date  : 2023.11.15
 * Description  : 뉴스레터 목록
 * Modify Desc  :
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2023.11.15      손동완           최초생성
 ************************************************************************************************/
public interface CMMT600Service {
	List<CMMT600VO> CMMT600SEL01(CMMT600VO vo) throws Exception;
	int CMMT600DEL01(CMMT600VO vo) throws Exception; // 뉴스레터 삭제
	int CMMT600DEL02(CMMT600VO vo) throws Exception; // 뉴스레터 확인내역 삭제
}
