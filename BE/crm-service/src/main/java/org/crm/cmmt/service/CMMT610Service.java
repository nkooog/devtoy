package org.crm.cmmt.service;


import org.crm.cmmt.VO.CMMT600VO;

/***********************************************************************************************
 * Program Name : 뉴스레터 등록 Service
 * Creator      : 손동완
 * Create Date  : 2023.11.16
 * Description  : 뉴스레터 등록
 * Modify Desc  :
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2023.11.16      손동완           최초생성
 * 2024.12.09      jypark          	egov->boot mig
 ************************************************************************************************/
public interface CMMT610Service {
	CMMT600VO CMMT610SEL01(CMMT600VO vo) throws Exception;
	int CMMT610INS01(CMMT600VO vo) throws Exception;
	int CMMT610UPT01(CMMT600VO vo) throws Exception;
}
