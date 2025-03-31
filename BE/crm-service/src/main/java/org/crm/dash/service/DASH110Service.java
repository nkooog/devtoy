package org.crm.dash.service;


import org.crm.dash.VO.DASH110VO;

import java.util.List;

/***********************************************************************************************
* Program Name : 대시보드레이아웃관리 Service
* Creator      : 강동우
* Create Date  : 2022.05.17
* Description  : 대시보드레이아웃관리 Service
* Modify Desc  : 
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.05.17     강동우           최초생성
************************************************************************************************/
public interface DASH110Service {
	List<DASH110VO> DASH110SEL00(DASH110VO vo) throws Exception;
	int DASH110UPT01(List<DASH110VO> list) throws Exception;
	List<DASH110VO> DASH110SEL01(DASH110VO vo) throws Exception;
	
	List<DASH110VO> DASH110SEL02(DASH110VO vo) throws Exception;
	
	List<DASH110VO> DASH110SEL03(DASH110VO vo) throws Exception;
	
	List<DASH110VO> DASH110SEL04(DASH110VO vo) throws Exception;
	
	List<DASH110VO> DASH110SEL05(DASH110VO vo) throws Exception;
	
	List<DASH110VO> DASH110SEL06(DASH110VO vo) throws Exception;
	
	List<DASH110VO> DASH110SEL07(DASH110VO vo) throws Exception;
	
	int DASH110INS01(List<DASH110VO> palette,List<DASH110VO> item,DASH110VO param) throws Exception;
	
	int DASH110INS02(List<DASH110VO> item) throws Exception;
	
	Integer DASH110INS03(List<DASH110VO> list) throws Exception;
	
	Integer DASH110DEL01(List<DASH110VO> list) throws Exception;
	
	Integer DASH110DEL02(List<DASH110VO> list) throws Exception;

    List<DASH110VO> DASH110SEL08(DASH110VO vo) throws Exception;

	List<DASH110VO> DASH110SEL09(DASH110VO vo) throws Exception;
}

