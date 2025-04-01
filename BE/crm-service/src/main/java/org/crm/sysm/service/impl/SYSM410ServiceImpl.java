package org.crm.sysm.service.impl;

import org.crm.sysm.VO.SYSM410VO;
import org.crm.sysm.service.SYSM410Service;
import org.crm.sysm.service.dao.SYSMCommDAO;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;

import java.util.List;


/***********************************************************************************************
* Program Name : 작업스케줄처리이력 ServiceImpl
* Creator      : sukim
* Create Date  : 2022.06.22
* Description  : 작업스케줄처리이력
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.06.22     sukim           최초생성
************************************************************************************************/
@Service("SYSM410Service")
public class SYSM410ServiceImpl implements SYSM410Service {

	@Resource(name = "SYSMCommDAO")
	private SYSMCommDAO SYSM410DAO;

	@Override
	public List<SYSM410VO> SYSM410SEL01(SYSM410VO vo) throws Exception {
		return SYSM410DAO.selectByList("SYSM410SEL01", vo);
	}	
}
