package org.crm.dash.service;


import org.crm.dash.VO.DASH120VO;

import java.util.List;

/***********************************************************************************************
* Program Name : 대시보드 항목관리 Service
* Creator      : 강동우
* Create Date  : 2022.05.17
* Description  : 대시보드 항목관리 Service
* Modify Desc  : 
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.05.17     강동우           최초생성
************************************************************************************************/
public interface DASH120Service {
	
	List<DASH120VO> DASH120SEL01(DASH120VO vo) throws Exception;
	
	List<DASH120VO> DASH120SEL02(DASH120VO vo) throws Exception;
	
	List<DASH120VO> DASH120SEL03(DASH120VO vo) throws Exception;
	
	List<DASH120VO> DASH120SEL04(DASH120VO vo) throws Exception;
	
	List<DASH120VO> DASH120SEL05(DASH120VO vo) throws Exception;
	
	List<DASH120VO> DASH120SEL06(DASH120VO vo) throws Exception;

	int DASH120INS00(List<DASH120VO> dash120voList) throws Exception;
	Integer DASH120INS01(List<DASH120VO> dash120voList) throws Exception;

	Integer DASH120INS02(List<DASH120VO> dash120voList) throws Exception;
	
	Integer DASH120DEL01(List<DASH120VO> dash120voList) throws Exception;
	
	Integer DASH120DEL02(List<DASH120VO> dash120voList) throws Exception;
	
	Integer DASH120INS03(String uploadPath, String stringVo, List<DASH120VO> dash120voList) throws Exception;
	
	Integer DASH120DEL03(List<DASH120VO> dash120voList, String uploadPath) throws Exception;
	
	Integer DASH120DEL04(List<DASH120VO> dash120voList) throws Exception;
	
	Integer DASH120INS04(List<DASH120VO> dash120voList) throws Exception;
	
	Integer DASH120DEL05(List<DASH120VO> dash120voList) throws Exception;
	
	Integer DASH120DEL06(List<DASH120VO> dash120voList) throws Exception;

    Integer DASH120DEL00(List<DASH120VO> dash120voList) throws Exception;
}

