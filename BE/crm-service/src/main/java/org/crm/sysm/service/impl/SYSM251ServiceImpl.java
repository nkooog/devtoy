package org.crm.sysm.service.impl;

import org.crm.sysm.VO.SYSM251VO;
import org.crm.sysm.service.SYSM251Service;
import org.crm.sysm.service.dao.SYSMCommDAO;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;

import java.util.List;


/***********************************************************************************************
* Program Name : 데이터프레임 조회 ServiceImpl
* Creator      : jrlee
* Create Date  : 2022.03.17
* Description  : 데이터프레임 조회
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.03.17     jrlee           최초생성
************************************************************************************************/
@Service("SYSM251Service")
public class SYSM251ServiceImpl implements SYSM251Service {

	@Resource(name="SYSMCommDAO")
	private SYSMCommDAO sysm251Mapper;

	@Override
	public List<SYSM251VO> SYSM251SEL01(SYSM251VO sysm251VO) throws Exception {
		return sysm251Mapper.selectByList("SYSM251SEL01", sysm251VO);
	}
}
