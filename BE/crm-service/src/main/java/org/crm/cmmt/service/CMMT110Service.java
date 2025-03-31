package org.crm.cmmt.service;


import org.crm.cmmt.VO.CMMT110VO;

import java.util.List;

/***********************************************************************************************
 * Program Name : 통합게시판 조직/등급/개별 권한
 * Creator      : 정대정
 * Create Date  : 2022.05.02
 * Description  : 통합게시판 조직/등급/개별 권한
 * Modify Desc  :
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.05.02     정대정           최초생성
 ************************************************************************************************/

public interface CMMT110Service {

	List<CMMT110VO> CMMT110SEL01(CMMT110VO vo) throws Exception;

	int CMMT110INS01(List<CMMT110VO> list)throws Exception;

	int CMMT110DEL01(List<CMMT110VO> list)throws Exception;

	int CMMT110DEL03(CMMT110VO cmmt110VO) throws Exception;
}
