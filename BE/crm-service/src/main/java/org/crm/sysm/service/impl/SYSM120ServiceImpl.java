package org.crm.sysm.service.impl;

import org.crm.sysm.VO.SYSM100VO;
import org.crm.sysm.VO.SYSM120VO;
import org.crm.sysm.service.SYSM120Service;
import org.crm.sysm.service.dao.SYSMCommDAO;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;
import java.util.List;

/***********************************************************************************************
* Program Name : 태넌트 기준정보 ServiceImpl
* Creator      : 김보영
* Create Date  : 2022.01.10
* Description  : 태넌트 기준정보
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.01.10     김보영           최초생성
* 2024.12.02     박준영           egov->springboot mig
************************************************************************************************/
@Service("SYSM120Service")
public class SYSM120ServiceImpl implements SYSM120Service {

	@Resource(name="SYSMCommDAO")
	private SYSMCommDAO dao;


	@Override
	public List<SYSM120VO> SYSM120SEL03(SYSM100VO vo) throws Exception {
		return dao.selectByList("SYSM120SEL03", vo);
	}

	@Override
	public Integer SYSM120INS03(List<SYSM120VO> list) throws Exception {
		Integer result = 0;

		try {
			//테넌트  부가서비스 등록
			result =  dao.sqlInsert("SYSM120INS03", list);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return result;
	}

	@Override
	public Integer SYSM120UPT03(List<SYSM120VO> list) throws Exception {
		Integer result = 0;

		try {
			//테넌트  부가서비스 등록
			result = dao.sqlUpdate("SYSM120UPT03", list);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return result;
	}


	@Override
	public Integer SYSM120DEL03(List<SYSM120VO> list) throws Exception {
		Integer result = 0;

		try {
			//테넌트  부가서비스 등록
			result = dao.sqlDelete("SYSM120DEL03", list);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return result;
	}

	@Override
	public Integer SYSM120DEL04(SYSM100VO vo) throws Exception {
		Integer result = 0;

		try {
			//테넌트  부가서비스 등록
			result =  dao.sqlDelete("SYSM120DEL04", vo);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return result;
	}

}
