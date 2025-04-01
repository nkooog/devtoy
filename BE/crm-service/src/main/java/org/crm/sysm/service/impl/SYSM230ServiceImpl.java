package org.crm.sysm.service.impl;

import org.crm.sysm.VO.SYSM230VO;
import org.crm.sysm.service.SYSM230Service;
import org.crm.sysm.service.dao.SYSMCommDAO;
import org.crm.util.crypto.AES256Crypt;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;

import java.util.List;

/***********************************************************************************************
* Program Name : 로그인 이력조회 ServiceImpl
* Creator      : 이민호
* Create Date  : 2022.02.14
* Description  : 로그인 이력조회
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.02.14     이민호           최초생성
************************************************************************************************/
@Service("SYSM230Service")
public class SYSM230ServiceImpl implements SYSM230Service {

	@Resource(name="SYSMCommDAO")
	private SYSMCommDAO sysm230DAO;

	@Override
	public List<SYSM230VO> SYSM230SEL01(SYSM230VO vo) throws Exception {
		List<SYSM230VO> SYSM230VOList = sysm230DAO.selectByList("SYSM230SEL01", vo);
		if (SYSM230VOList.size()>0) {
			for (SYSM230VO sysm230VO : SYSM230VOList) {
				sysm230VO.setDecUsrNm(AES256Crypt.decrypt(sysm230VO.getUsrNm()));
			}
		}
		return SYSM230VOList;
	}

}
