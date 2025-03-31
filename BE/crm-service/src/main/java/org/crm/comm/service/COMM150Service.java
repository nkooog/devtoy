package org.crm.comm.service;


import org.crm.comm.VO.COMM150VO;

import java.util.List;

/***********************************************************************************************
 * Program Name : 전역변수 (테넌트)변경 Controller
 * Creator      : jrlee
 * Create Date  : 2022.08.02
 * Description  : 전역변수 (테넌트)변경
 * Modify Desc  :
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.08.02     jrlee           최초생성
 * 2023.01.04     djjung          기능변경 - 테넌트,등급,유저아이디 변경
 ************************************************************************************************/
public interface COMM150Service {
	List<COMM150VO> COMM150SEL01(COMM150VO vo);

	List<COMM150VO> COMM150SEL02(COMM150VO vo) throws Exception;
	
	List<COMM150VO> COMM150SEL04(COMM150VO vo) throws Exception;
	
	List<COMM150VO> COMM150SEL05(COMM150VO vo) throws Exception;
	List<COMM150VO> COMM150SEL06(COMM150VO vo) throws Exception;
}
