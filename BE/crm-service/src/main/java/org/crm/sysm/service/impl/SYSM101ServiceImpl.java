package org.crm.sysm.service.impl;

import org.crm.sysm.VO.SYSM101VO;
import org.crm.sysm.service.SYSM101Service;
import org.crm.sysm.service.dao.SYSMCommDAO;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;
import java.util.List;

/***********************************************************************************************
* Program Name : 태넌트 정보관리 팝업 ServiceImpl
* Creator      : 김보영
* Create Date  : 2022.01.10
* Description  : 태넌트 정보관리
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.01.10    김보영           최초생성
************************************************************************************************/
@Service("SYSM101Service")
public class SYSM101ServiceImpl implements SYSM101Service {
	
	@Resource(name="SYSMCommDAO")
	private SYSMCommDAO SYSM101DAO;

	@Override
	public List<SYSM101VO> SYSM101SEL01(SYSM101VO vo) throws Exception {
		return SYSM101DAO.selectByList("SYSM101SEL01", vo);
	}

}
