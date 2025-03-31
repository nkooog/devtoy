package org.crm.sysm.service;


import org.crm.sysm.VO.SYSM280VO;
import java.util.List;

/***********************************************************************************************
* Program Name : 상담유형 코드관리 Main Service
* Creator      : 김보영
* Create Date  : 2022.05.10
* Description  : 상담유형 코드관리
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.05.10    김보영           최초생성
************************************************************************************************/

public interface SYSM280Service {
    List<SYSM280VO> SYSM280SEL01(SYSM280VO sysm280VO) throws Exception;
    
    Integer SYSM280INS01(List<SYSM280VO> list) throws Exception;
    
    Integer SYSM280UPT01(List<SYSM280VO> list) throws Exception;

    Integer SYSM280SAVE01(List<SYSM280VO> list) throws Exception;

    Integer SYSM280DEL01(List<SYSM280VO> list) throws Exception;

	List<SYSM280VO> SYSM280SEL02(SYSM280VO vo) throws Exception;

	Integer SYSM280INS02(List<SYSM280VO> list) throws Exception;
	
	Integer SYSM280DEL02(SYSM280VO sysm280VO) throws Exception;

	List<SYSM280VO> SYSM280SEL03(SYSM280VO vo)throws Exception;

	Integer SYSM280DEL03(List<SYSM280VO> baseAnswCdList)throws Exception;

	Integer SYSM280INS03(List<SYSM280VO> baseAnswCdList)throws Exception;
	
	Integer SYSM280SEQINIT(SYSM280VO sysm280VO) throws Exception;
}
