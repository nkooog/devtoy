package org.crm.sysm.service.impl;

import jakarta.annotation.Resource;
import org.crm.sysm.VO.SYSM210VO;
import org.crm.sysm.VO.SYSM213VO;
import org.crm.sysm.service.SYSM210Service;
import org.crm.sysm.service.dao.SYSMCommDAO;
import org.springframework.stereotype.Service;

import java.util.List;

/***********************************************************************************************
* Program Name : 조직찾기 팝업 ServiceImpl
* Creator      : djjung
* Create Date  : 2022.04.15
* Description  : 조직찾기 팝업
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.04.15     djjung           최초생성
************************************************************************************************/

@Service("SYSM210Service")
public class SYSM210ServiceImpl implements SYSM210Service {
	@Resource(name="SYSMCommDAO")
	private SYSMCommDAO SYSM210DAO;
	
	public List<SYSM210VO> SYSM210SEL01(SYSM210VO vo) throws Exception {
		return SYSM210DAO.selectByList("SYSM210SEL01", vo);
    }
	
	@Override
    public List<SYSM213VO> SYSM210SEL02(SYSM213VO vo) throws Exception {
		return SYSM210DAO.selectByList("SYSM210SEL02", vo);
    }
}
