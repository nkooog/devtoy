package org.crm.sysm.service;


import org.crm.sysm.VO.SYSM100VO;

import java.util.List;
import java.util.Map;

/***********************************************************************************************
* Program Name : 태넌트 정보관리 Service
* Creator      : 김보영
* Create Date  : 2022.01.10
* Description  : 태넌트 정보관리
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.01.10    김보영           최초생성
************************************************************************************************/
public interface SYSM100Service {

	List<SYSM100VO> SYSM100SEL01(SYSM100VO vo) throws Exception;

	Integer SYSM100UPT02(List<SYSM100VO> list) throws Exception ;

	int SYSM100INS99(List<Map<String, Object>> list);

	int SYSM100INS98(List<Map<String, Object>> list);

	int SYSM100INS97(List<Map<String, Object>> list);

	int SYSM100UPT96(List<Map<String, Object>> list);

	int SYSM100UPT95(List<Map<String, Object>> list);

	int SYSM100UPT94(List<Map<String, Object>> list);

	int SYSM100INS91(List<Map<String, Object>> list);
}
