package org.crm.cmmt.service;

import org.crm.cmmt.VO.CMMT330VO;

import java.util.List;

/***********************************************************************************************
 * Program Name : 반려사유 - popup Service
 * Creator      : 이민호
 * Create Date  : 2022.07.28
 * Description  : 컨텐츠 반려사유 Popup
 * Modify Desc  :
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.78.28      이민호           최초생성
 ************************************************************************************************/
public interface CMMT330Service {
	int CMMT330INS01(CMMT330VO vo) throws Exception;
	List<CMMT330VO> CMMT331SEL01(CMMT330VO vo) throws Exception;
}
