package org.crm.sysm.service.impl;


import org.crm.sysm.VO.SYSM335VO;
import org.crm.sysm.service.SYSM335Service;
import org.crm.sysm.service.dao.SYSMCommDAO;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;

import java.util.List;

/***********************************************************************************************
* Program Name : 공통코드찾기 ServiceImpl
* Creator      : jrlee
* Create Date  : 2022.04.25
* Description  : 공통코드찾기
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.04.25     jrlee           최초생성
************************************************************************************************/
@Service("SYSM335Service")
public class SYSM335ServiceImpl implements SYSM335Service {

	@Resource(name = "SYSMCommDAO")
	private SYSMCommDAO sysm320DAO;

	@Override
	public List<SYSM335VO> SYSM335SEL01(SYSM335VO sysm335VO) throws Exception {
		return sysm320DAO.selectByList("SYSM335SEL01", sysm335VO);
	}
}
