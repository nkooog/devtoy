package org.crm.lgin.service.impl;

import jakarta.annotation.Resource;
import org.crm.lgin.model.dto.LGIN000DTO;
import org.crm.lgin.model.vo.LGIN000VO;
import org.crm.lgin.service.LGIN000Service;
import org.crm.lgin.service.dao.LGIN000DAO;
import org.crm.sysm.model.service.SYSM110Service;
import org.crm.sysm.model.vo.SYSM110VO;
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

	@Resource(name="SYSM110Service")
	private SYSM110Service sysm110Service;

	@Override
	public LGIN000VO LGIN000SEL02(LGIN000VO vo) throws Exception{

		SYSM110VO paramVo = SYSM110VO.builder()
				.tenantId(vo.getTenantId())
				.adtnSvcCd("518")
				.build();

		List<SYSM110VO> adtnList = this.sysm110Service.SYSM110SEL03(paramVo);

		LGIN000VO rtnVo = (LGIN000VO) this.lgin000DAO.selectByOne("LGIN000SEL02", vo);

		//STT 사용 여부 설정
		if(adtnList != null && adtnList.size() > 0 ) {
			rtnVo.setSttUseYn(adtnList.get(0).getUseDvCd());
		}

		return rtnVo;
	}

	@Override
	public LGIN000VO LGIN000SEL03(LGIN000VO vo){
		return (LGIN000VO) lgin000DAO.selectByOne("LGIN000SEL03",vo);
	}

	@Override
	public LGIN000VO LGIN000SEL07(LGIN000DTO dto){
		return (LGIN000VO) lgin000DAO.selectByOne("LGIN000SEL07", dto);
	}

	@Override
	public void LGIN000INS01(LGIN000VO vo) {
		lgin000DAO.sqlInsert("LGIN000INS01", vo);
	}

	@Override
	public void LGIN000UPT01(LGIN000VO vo) throws Exception {
		this.lgin000DAO.sqlUpdate("LGIN000UPT01", vo);
	}

	@Override
	public void LGIN000UPT02(LGIN000VO vo) {
		lgin000DAO.sqlUpdate("LGIN000UPT02", vo);
	}

	@Override
	public void LGIN000UPT04(LGIN000VO vo) throws Exception {
		this.lgin000DAO.sqlInsert("LGIN000UPT04", vo);
	}

}
