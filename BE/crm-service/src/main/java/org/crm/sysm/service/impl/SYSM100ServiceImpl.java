package org.crm.sysm.service.impl;


import jakarta.annotation.Resource;
import org.crm.sysm.VO.SYSM100VO;
import org.crm.sysm.service.SYSM100Service;
import org.crm.sysm.service.dao.SYSMCommDAO;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

/***********************************************************************************************
* Program Name : 태넌트 정보관리 ServiceImpl
* Creator      : 김보영
* Create Date  : 2022.01.10
* Description  : 태넌트 정보관리
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.01.10    김보영           최초생성
************************************************************************************************/
@Service("SYSM100Service")
public class SYSM100ServiceImpl implements SYSM100Service {
	
	@Resource(name="SYSMCommDAO")
	private SYSMCommDAO sysm100DAO;

	@Override
	public List<SYSM100VO> SYSM100SEL01(SYSM100VO vo) throws Exception {

		return sysm100DAO.selectByList("SYSM100SEL01", vo);
	}

	@Override
	public Integer SYSM100UPT02(List<SYSM100VO> list) throws Exception {
		
		Integer result = 0;
		try {
			result = sysm100DAO.sqlUpdate("SYSM100UPT02", list);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return result;
	}

	@Override
	public int SYSM100INS99(List<Map<String, Object>> list) {
		return sysm100DAO.sqlInsert("SYSM100INS99", list);
	}

	@Override
	public int SYSM100INS98(List<Map<String, Object>> list) {
		return sysm100DAO.sqlInsert("SYSM100INS98", list);
	}

	@Override
	public int SYSM100INS97(List<Map<String, Object>> list) {
		return sysm100DAO.sqlInsert("SYSM100INS97", list);
	}

	@Override
	public int SYSM100UPT96(List<Map<String, Object>> list) {
		return sysm100DAO.sqlUpdate("SYSM100UPT96", list);
	}

	@Override
	public int SYSM100UPT95(List<Map<String, Object>> list) {
		return sysm100DAO.sqlUpdate("SYSM100UPT95", list);
	}

	@Override
	public int SYSM100UPT94(List<Map<String, Object>> list) {
		return sysm100DAO.sqlUpdate("SYSM100UPT94", list);
	}

	@Override
	public int SYSM100INS91(List<Map<String, Object>> list) {
		return sysm100DAO.sqlInsert("SYSM100INS91", list);
	}
}
