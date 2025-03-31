package org.crm.sysm.service.impl;

import org.crm.sysm.VO.SYSM241VO;
import org.crm.sysm.service.SYSM241Service;
import org.crm.sysm.service.dao.SYSMCommDAO;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;
import java.util.List;

/***********************************************************************************************
* Program Name : 관리항목찾기 ServiceImpl
* Creator      : jrlee
* Create Date  : 2022.04.28
* Description  : 관리항목찾기
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.04.28     jrlee           최초생성
************************************************************************************************/
@Service("SYSM241Service")
public class SYSM241ServiceImpl implements SYSM241Service {

	@Resource(name="SYSMCommDAO")
	private SYSMCommDAO sysm241Mapper;

	@Override
	public List<SYSM241VO> SYSM241SEL01(SYSM241VO sysm241VO) throws Exception {
		return sysm241Mapper.selectByList("SYSM241SEL01", sysm241VO);
	}
}