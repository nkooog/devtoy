package org.crm.comm.service.impl;

import org.crm.comm.VO.COMM100VO;
import org.crm.comm.service.COMM100Service;
import org.crm.comm.service.dao.COMMCommDAO;
import org.crm.lgin.model.vo.LGIN010VO;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

/***********************************************************************************************
* Program Name : 공통 서비스 ServiceImpl
* Creator      : sukim
* Create Date  : 2022.02.03
* Description  : 공통 서비스
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.02.03     sukim            최초생성
************************************************************************************************/
@Service("COMM100Service")
public class COMM100ServiceImpl implements COMM100Service {

	@Resource(name="COMMCommDAO")
	private COMMCommDAO dao;

	@Override
	public List<COMM100VO> COMM100SEL01(Map<String, Object> codeList) throws Exception {
//		return comm100DAO.COMM100SEL01(codeList);
		return dao.selectByList("COMM100SEL01", codeList);
	}
	
	@Override
	public COMM100VO COMM100SEL02(COMM100VO vo) throws Exception{
//		return comm100DAO.COMM100SEL02(vo);
		return (COMM100VO) dao.selectByOne("COMM100SEL02",vo);
	}
	
	@Override
	public COMM100VO COMM100SEL03(COMM100VO vo) throws Exception{
//		return comm100DAO.COMM100SEL03(vo);
		return (COMM100VO) dao.selectByOne("COMM100SEL03", vo);
	}
	
	@Override
	public List<COMM100VO> COMM100SEL04(COMM100VO vo) throws Exception {
//		return comm100DAO.COMM100SEL04(vo);
		return dao.selectByList("COMM100SEL04", vo);
	}
	
	@Override
	public List<COMM100VO> COMM100SEL05(COMM100VO vo) throws Exception {
//		return comm100DAO.COMM100SEL05(vo);
		return dao.selectByList("COMM100SEL05", vo);
	}

	@Override
	public String COMM100getCloudName(String tenantId) {
		LGIN010VO lginVO = new LGIN010VO();
		lginVO.setTenantId(tenantId);
		lginVO.setBsVlMgntNo(32);
//		LGIN010VO lgin000sel08Info = LGIN000Service.LGIN000SEL08(lginVO);
		LGIN010VO lgin000sel08Info = (LGIN010VO) dao.selectByOne("LGIN000SEL08", lginVO);

		if( lgin000sel08Info == null){
			return "";
		}
		return lgin000sel08Info.getBsVl1();
	}
}
