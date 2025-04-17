package org.crm.frme.service;


import org.crm.frme.model.vo.FRME160VO;

/***********************************************************************************************
* Program Name : 환경설정 Service
* Creator      : jrlee
* Create Date  : 2022.04.21
* Description  : 환경설정 Service
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.04.21     jrlee            최초생성
* 2024.12.02     박준영           egov->springboot mig
************************************************************************************************/
public interface FRME160Service {
	FRME160VO FRME160SEL01(FRME160VO frme160VO) throws Exception;
	Integer FRME160UPT01(FRME160VO frme160VO) throws Exception;
}