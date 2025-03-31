package org.crm.cmmt.service;

import org.crm.cmmt.VO.CMMT100VO;

import java.util.List;

/***********************************************************************************************
 * Program Name : 게시판 만들기 Service
 * Creator      : 정대정
 * Create Date  : 2022.03.29
 * Description  : 게시판 만들기
 * Modify Desc  :
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.03.29    정대정           최초생성
 ************************************************************************************************/
public interface CMMT100Service {

	List<CMMT100VO> CMMT100SEL01(CMMT100VO vo) throws Exception;

	CMMT100VO CMMT100SEL02(CMMT100VO vo) throws Exception;
	
	//kw---20230706 : 카테고리 <-> 게시판 변경시 엘라스틱에 해당 게시물의 상태들을 업데이트 해주기 위해, 해당 카테고리의 게시물들을 불러옴
	List<CMMT100VO> CMMT100SEL03(CMMT100VO vo) throws Exception;

	//kw---20230531 : 카테고리 insert(create)
	Integer CMMT100INS01(List<CMMT100VO> list) throws Exception;

	//kw---20230531 : 카테고리 업데이트
	Integer CMMT100UPT01(List<CMMT100VO> list) throws Exception;

	int CMMT100DEL01(CMMT100VO vo)throws Exception;

	int CMMT100UPT02(CMMT100VO vo)throws Exception;

	int CMMT100UPT03(List<CMMT100VO> list)throws Exception;
	
	//kw---20230531 : 게시판 유형에 따라 엘라스틱 게시글 상태 업데이트 (커뮤니티 : 99)
	String CMMT100UPT04(List<CMMT100VO> list)throws Exception;
}
