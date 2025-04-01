package org.crm.frme.service;

import org.crm.dash.VO.DASH120VO;
import org.crm.frme.VO.FRME140VO;

import java.util.List;

/***********************************************************************************************
* Program Name : 퀵링크 팝업 Service
* Creator      : 이민호
* Create Date  : 2022.02.10
* Description  : 퀵링크 팝업
* Modify Desc  : 
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.01.26     이민호           최초생성
************************************************************************************************/
public interface FRME140Service {
	
	List<DASH120VO> FRME140SEL01(FRME140VO vo) throws Exception;
	List<FRME140VO> FRME140SEL02(FRME140VO vo) throws Exception;

	int FRME140getMaxLnkSeq(FRME140VO vo) throws Exception;
}
