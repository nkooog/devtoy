package org.crm.frme.service.impl;

import org.crm.dash.VO.DASH120VO;
import org.crm.frme.VO.FRME140VO;
import org.crm.frme.service.FRME140Service;
import org.crm.frme.service.dao.FRMECommDAO;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;

import java.util.List;

/***********************************************************************************************
* Program Name : 퀵링크 팝업 ServiceImpl
* Creator      : 이민호
* Create Date  : 2022.02.10
* Description  : 퀵링크 팝업
* Modify Desc  : 
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.01.26     이민호           최초생성
************************************************************************************************/
@Service("FRME140Service")
public class FRME140ServiceImpl implements FRME140Service {

	@Resource(name="FRMECommDAO")
	private FRMECommDAO dao;
	
	@Override
	public List<DASH120VO> FRME140SEL01(FRME140VO vo) throws Exception {
		return dao.selectByList("FRME140SEL01", vo);
	}

	@Override
	public List<FRME140VO> FRME140SEL02(FRME140VO vo) throws Exception {
		return dao.selectByList("FRME140SEL02", vo);
	}

	@Override
	public int FRME140getMaxLnkSeq(FRME140VO vo) throws Exception {
		return dao.selectByCount("FRME140getMaxLnkSeq", vo);
	}


}
