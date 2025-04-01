package org.crm.frme.service;


import org.crm.frme.VO.FRME290VO;

import java.util.List;

/***********************************************************************************************
* Program Name : 주업무전환 Service
* Creator      : jrlee
* Create Date  : 2022.05.10
* Description  : 주업무전환 Service
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.05.10     jrlee            최초생성
* 2024.12.02     박준영           egov->springboot mig
************************************************************************************************/
public interface FRME290Service {
	List<FRME290VO> FRME290SEL01(FRME290VO frme290VO) throws Exception;
	Integer FRME290UPT01(FRME290VO frme290VO) throws Exception;
}