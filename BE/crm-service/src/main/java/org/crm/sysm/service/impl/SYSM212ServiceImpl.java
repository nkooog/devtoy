package org.crm.sysm.service.impl;


import org.crm.sysm.VO.SYSM212VO;
import org.crm.sysm.service.SYSM212Service;
import org.crm.sysm.service.dao.SYSMCommDAO;
import org.crm.util.crypto.AES256Crypt;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;

import java.util.List;

/***********************************************************************************************
* Program Name : 사용자 ID 찾기 ServiceImpl
* Creator      : 이민호
* Create Date  : 2022.02.07
* Description  : 사용자 ID 찾기
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.02.07     이민호           최초생성
************************************************************************************************/
@Service("SYSM212Service")
public class SYSM212ServiceImpl implements SYSM212Service {
	
	@Resource(name="SYSMCommDAO")
	private SYSMCommDAO sysm212DAO;
	
	@Override
	public List<SYSM212VO> SYSM212SEL01(SYSM212VO vo) throws Exception {
		return sysm212DAO.selectByList("SYSM212SEL01", vo);
	}
	
	@Override
	public List<SYSM212VO> SYSM212SEL02(SYSM212VO vo) throws Exception {
		List<SYSM212VO> SYSM212VOList = sysm212DAO.selectByList("SYSM212SEL02", vo);
		if (SYSM212VOList.size()>0) {
			for (int i=0; i<SYSM212VOList.size(); i++) {
				SYSM212VOList.get(i).setDecUsrNm(AES256Crypt.decrypt(SYSM212VOList.get(i).getUsrNm()));
			}
		}
		return SYSM212VOList;
	}

}
