package org.crm.lgin.service.impl;

import jakarta.annotation.Resource;
import org.crm.lgin.VO.LGIN000VO;
import org.crm.lgin.VO.LGIN010VO;
import org.crm.lgin.service.LGIN000Service;
import org.crm.lgin.service.dao.LGIN000DAO;
import org.crm.sysm.VO.SYSM110VO;
import org.crm.sysm.service.dao.SYSMCommDAO;
import org.springframework.stereotype.Service;

import java.util.List;
/***********************************************************************************************
* Program Name : 로그인 ServiceImpl
* Creator      : sukim
* Create Date  : 2022.02.03
* Description  : 로그인
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.02.03     sukim            최초생성
************************************************************************************************/
@Service("LGIN000Service")
public class LGIN000ServiceImpl implements LGIN000Service {

	@Resource(name="LGIN000DAO")
	private LGIN000DAO lgin000DAO;
	
	@Resource(name="SYSMCommDAO")
	private SYSMCommDAO SYSM110DAO;
	
	@Override
	public int LGIN000SEL01(LGIN000VO vo){
		return lgin000DAO.selectByCount("LGIN000SEL01", vo);
	}	
	
	@Override
	public LGIN000VO LGIN000SEL02(LGIN000VO vo) throws Exception {

		SYSM110VO paramVo = SYSM110VO.builder()
				.tenantId(vo.getTenantId())
				.adtnSvcCd("518")
				.build();//공통코드 : C0011 > 518 : STT사용여부

		List<SYSM110VO> adtnList = SYSM110DAO.selectByList("SYSM110SEL03", paramVo);
		LGIN000VO rtnVo = (LGIN000VO) lgin000DAO.selectByOne("LGIN000SEL02",vo);

		//STT 사용 여부 설정
		if(adtnList.size() < 1 ) {
			rtnVo.setSttUseYn("");
		} else {
			rtnVo.setSttUseYn(adtnList.get(0).getUseDvCd());
		}
		
		return rtnVo;
	}
	
	@Override
	public LGIN000VO LGIN000SEL03(LGIN000VO vo){
		return (LGIN000VO) lgin000DAO.selectByOne("LGIN000SEL03",vo);
	}
	
	@Override
	public int LGIN000SEL04(LGIN000VO vo){
		return lgin000DAO.selectByCount("LGIN000SEL04", vo);
	}

	@Override
	public int LGIN000SEL05(LGIN000VO vo){
		return lgin000DAO.selectByCount("LGIN000SEL05", vo);
	}
	
	@Override
	public LGIN000VO LGIN000SEL06(LGIN000VO vo){
		return (LGIN000VO) lgin000DAO.selectByOne("LGIN000SEL06", vo);
	}	
	
	@Override
	public LGIN000VO LGIN000SEL07(LGIN000VO vo){
		return (LGIN000VO) lgin000DAO.selectByOne("LGIN000SEL07", vo);
	}
	
	@Override
	public LGIN010VO LGIN000SEL08(LGIN010VO vo){
		return (LGIN010VO) lgin000DAO.selectByOne("LGIN000SEL08", vo);
	}	
	
	@Override
	public List<LGIN010VO> LGIN000SEL09(LGIN010VO vo){
		return lgin000DAO.selectByList("LGIN000SEL09", vo);
	}

	@Override
	public void LGIN000INS01(LGIN000VO vo){
		lgin000DAO.sqlInsert("LGIN000INS01", vo);
	}	
	
	@Override
	public void LGIN000INS02(LGIN000VO vo){
		lgin000DAO.sqlInsert("LGIN000INS02", vo);
	}	
	
	@Override
	public void LGIN000UPT01(LGIN000VO vo) {
		lgin000DAO.sqlUpdate("LGIN000UPT01", vo);;
	}

	@Override
	public void LGIN000UPT02(LGIN000VO vo) {
		lgin000DAO.sqlUpdate("LGIN000UPT02", vo);
	}
	
	@Override
	public void LGIN000UPT03(LGIN000VO vo) {
		lgin000DAO.sqlUpdate("LGIN000UPT03", vo);
	}
	
	@Override
	public void LGIN000UPT04(LGIN000VO vo) {
		lgin000DAO.sqlUpdate("LGIN000UPT04", vo);
	}

	@Override
	public int LGIN000UPT05(LGIN000VO vo) {
		return lgin000DAO.sqlUpdate("LGIN000UPT05", vo);
	}

	@Override
	public LGIN000VO LGIN000USRGRDCHECK(LGIN000VO vo) {
		return (LGIN000VO) lgin000DAO.selectByOne("LGIN000USRGRDCHECK", vo);
	}

	@Override
	public int LGIN000SEL11(LGIN000VO vo) {
		return lgin000DAO.selectByCount("LGIN000SEL11", vo);
	}


	@Override
	public List<LGIN000VO> LGIN000SEL12(LGIN000VO vo) {
		return lgin000DAO.selectByList("LGIN000SEL12" , vo);
	}
}
