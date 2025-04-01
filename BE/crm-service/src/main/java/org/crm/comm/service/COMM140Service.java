package org.crm.comm.service;

import org.crm.comm.VO.COMM140VO;

import java.util.List;

/***********************************************************************************************
* Program Name : 영업일관리 Service
* Creator      : sjyang
* Create Date  : 2022.12.26
* Description  : 공통 서비스
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.12.26     sjyang            최초생성
************************************************************************************************/
public interface COMM140Service {
	
	List<COMM140VO> COMM140SEL01(COMM140VO vo) throws Exception;
	
	int COMM140UPT01(List<COMM140VO> vo) throws Exception;
	
}