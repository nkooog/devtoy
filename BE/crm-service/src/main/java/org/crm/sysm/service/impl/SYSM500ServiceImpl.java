package org.crm.sysm.service.impl;

import org.crm.sysm.service.dao.SYSMCommDAO;
import org.crm.sysm.VO.SYSM500VO;
import org.crm.sysm.service.SYSM500Service;
import org.crm.util.crypto.AES256Crypt;
import org.crm.util.string.StringUtil;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;

import java.util.List;

/***********************************************************************************************
* Program Name : 실시간운영메시지관리 ServiceImpl
* Creator      : jrlee
* Create Date  : 2022.06.08
* Description  : 실시간운영메시지관리
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.06.08     jrlee           최초생성
************************************************************************************************/
@Service("SYSM500Service")
public class SYSM500ServiceImpl  implements SYSM500Service {

	@Resource(name="SYSMCommDAO")
	private SYSMCommDAO SYSM500DAO;

	@Override
	public List<SYSM500VO> SYSM500SEL01(SYSM500VO sysm500VO) throws Exception {
		List<SYSM500VO> list = SYSM500DAO.selectByList("SYSM500SEL01" , sysm500VO);
		for (SYSM500VO vo : list) {
			if(!"".equals(StringUtil.nullToBlank(vo.getLstCorprNm()))) {
				vo.setLstCorprNm(AES256Crypt.decrypt(vo.getLstCorprNm()));
			}
		}
		return list;
	}

	@Override
	public Integer SYSM500INS01(SYSM500VO sysm500VO) throws Exception {

		return SYSM500DAO.sqlInsert("SYSM500INS01" , sysm500VO);
	}

	@Override
	public Integer SYSM500DEL01(SYSM500VO sysm500VO) throws Exception {
		return SYSM500DAO.sqlDelete("SYSM500DEL01",sysm500VO );
	}
}
