package org.crm.frme.service.impl;

import org.crm.frme.VO.FRME150VO;
import org.crm.frme.service.FRME150Service;
import org.crm.frme.service.dao.FRMECommDAO;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;

import java.util.List;

/***********************************************************************************************
* Program Name : 즐겨찾기메뉴 팝업 ServiceImpl
* Creator      : 이민호
* Create Date  : 2022.02.03
* Description  : 즐겨찾기메뉴 팝업
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.02.03     이민호           최초생성
************************************************************************************************/
@Service("FRME150Service")
public class FRME150ServiceImpl implements FRME150Service {

	@Resource(name="FRMECommDAO")
	private FRMECommDAO dao;
	
	@Override
	public List<FRME150VO> FRME150SEL01(FRME150VO vo) throws Exception {
		return dao.selectByList("FRME150SEL01", vo);
	}

	@Override
	public int FRME150INS01(FRME150VO vo) throws Exception {
		return dao.sqlInsert("FRME150INS01", vo);
	}
	@Override
	public int FRME150DEL01(FRME150VO vo) throws Exception {
		return dao.sqlDelete("FRME150DEL01", vo);
	}
	
}
