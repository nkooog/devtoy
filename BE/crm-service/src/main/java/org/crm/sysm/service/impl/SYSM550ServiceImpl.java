package org.crm.sysm.service.impl;

import org.crm.sysm.VO.SYSM550VO;
import org.crm.sysm.service.SYSM550Service;
import org.crm.sysm.service.dao.SYSMCommDAO;
import org.crm.util.crypto.AES256Crypt;
import org.crm.util.string.StringUtil;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;
import java.util.List;

/***********************************************************************************************
* Program Name : 장애공지관리 ServiceImpl
* Creator      : shpark
* Create Date  : 2024.06.14
* Description  : 장애공지관리
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2024.06.14     shpark           최초생성
************************************************************************************************/
@Service("SYSM550Service")
public class SYSM550ServiceImpl implements SYSM550Service {
	@Resource(name="SYSMCommDAO")
	private SYSMCommDAO dao;

	@Override
	public List<SYSM550VO> SYSM550SEL01(SYSM550VO SYSM550VO) throws Exception {
		List<SYSM550VO> list = dao.selectByList("SYSM550SEL01", SYSM550VO);
		for (SYSM550VO vo : list) {
			if(!"".equals(StringUtil.nullToBlank(vo.getLstCorprNm()))) {
				vo.setLstCorprNm(AES256Crypt.decrypt(vo.getLstCorprNm()));
			}
		}
		return list;
	}

	@Override
	public List<SYSM550VO> SYSM550SEL02(SYSM550VO SYSM550VO) throws Exception {
		List<SYSM550VO> list = dao.selectByList("SYSM550SEL02", SYSM550VO);
		for (SYSM550VO vo : list) {
			if(!"".equals(StringUtil.nullToBlank(vo.getLstCorprNm()))) {
				vo.setLstCorprNm(AES256Crypt.decrypt(vo.getLstCorprNm()));
			}
		}
		return list;
	}

	@Override
	public Integer SYSM550INS01(SYSM550VO SYSM550VO) throws Exception {
		return dao.sqlInsert("SYSM550INS01", SYSM550VO);
	}

	@Override
	public Integer SYSM550DEL01(SYSM550VO SYSM550VO) throws Exception {
		return dao.sqlDelete("SYSM550DEL01", SYSM550VO);
	}
}
