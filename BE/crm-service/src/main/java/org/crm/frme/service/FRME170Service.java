package org.crm.frme.service;


import org.crm.frme.VO.FRME170VO;

import java.util.List;

/***********************************************************************************************
* Program Name : 알림 Service
* Creator      : jrlee
* Create Date  : 2022.05.26
* Description  : 알림 Service
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.05.26     jrlee            최초생성
************************************************************************************************/
public interface FRME170Service {
	List<FRME170VO> FRME170SEL01(FRME170VO frme170VO) throws Exception;
	
	//kw---20230612 : 통합게시판 승인 필요
	int FRME170SEL02(FRME170VO frme170VO) throws Exception;
	
	//kw---20230612 : 지식관리-읽지 않은 게시글 수
	int FRME170SEL03(FRME170VO frme170VO) throws Exception;
	
	//kw---20230612 : 지식관리-승인이 필요한 게시글 수
	int FRME170SEL04(FRME170VO frme170VO) throws Exception;
}