package org.crm.sysm.service;

import org.crm.sysm.VO.SYSM240VO;

import java.util.List;
import java.util.Map;

/***********************************************************************************************
* Program Name : 메타공통코드관리 Service
* Creator      : 허해민
* Create Date  : 2022.01.17
* Description  : 메타공통코드관리
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.01.17     허해민           최초생성
************************************************************************************************/
public interface SYSM240Service {

	List<SYSM240VO> SYSM240SEL01(SYSM240VO sysm240vo) throws Exception; 			/** 메타공통코드관리 전체조회 */
	
	int SYSM240SEL02(SYSM240VO vo) throws Exception; 								/** 관리항목 한글 중복체크 */
	
	int SYSM240SEL03(SYSM240VO vo) throws Exception; 								/** 관리항목 영문 중복체크 */

	int SYSM240UPT01(SYSM240VO vo) throws Exception;							/** 메타관리항목 수정 */

	int SYSM240INS01(SYSM240VO vo) throws Exception;							/** 메타관리항목 신규등록 */
	
	int SYSM240UPT02(SYSM240VO vo) throws Exception;							/** 메타관리항목 삭제 */

	int SYSM240INS02(List<Map<String, Object>> list) throws Exception;

	int SYSM240DEL01(SYSM240VO voSetting) throws Exception;

	Integer SYSM240SEL04(SYSM240VO voSetting)throws Exception;
	
	
}
