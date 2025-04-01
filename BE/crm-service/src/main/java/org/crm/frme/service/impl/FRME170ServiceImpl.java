package org.crm.frme.service.impl;

import org.crm.frme.VO.FRME170VO;
import org.crm.frme.service.FRME170Service;
import org.crm.frme.service.dao.FRMECommDAO;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;

import java.util.List;

/***********************************************************************************************
* Program Name : 알림 ServiceImpl
* Creator      : jrlee
* Create Date  : 2022.05.26
* Description  : 알림 ServiceImpl
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.05.26     jrlee            최초생성
************************************************************************************************/
@Service("FRME170Service")
public class FRME170ServiceImpl implements FRME170Service {

	@Resource(name="FRMECommDAO")
	private FRMECommDAO dao;

	@Override
	public List<FRME170VO> FRME170SEL01(FRME170VO frme170VO) throws Exception {
		return dao.selectByList("FRME170SEL01", frme170VO);
	}
	
	//kw---20230612 : 통합게시판 승인 필요
	@Override
	public int FRME170SEL02(FRME170VO frme170VO) throws Exception {
		return dao.selectByCount("FRME170SEL02", frme170VO);
	}
	
	//kw---20230612 : 지식관리-읽지 않은 페이지 수
	@Override
	public int FRME170SEL03(FRME170VO frme170VO) throws Exception {
		return dao.selectByCount("FRME170SEL03", frme170VO);
	}
	
	//kw---20230612 : 지식관리-승인 필요 페이지 수
	@Override
	public int FRME170SEL04(FRME170VO frme170VO) throws Exception {
		return dao.selectByCount("FRME170SEL04", frme170VO);
	}
}
