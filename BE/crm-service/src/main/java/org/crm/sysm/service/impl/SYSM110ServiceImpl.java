package org.crm.sysm.service.impl;

import jakarta.annotation.Resource;
import org.crm.sysm.VO.SYSM100VO;
import org.crm.sysm.VO.SYSM110VO;
import org.crm.sysm.service.SYSM110Service;
import org.crm.sysm.service.dao.SYSMCommDAO;
import org.springframework.stereotype.Service;

import java.util.List;

/***********************************************************************************************
* Program Name : 태넌트 기본정보 ServiceImpl
* Creator      : 김보영
* Create Date  : 2022.01.10
* Description  : 태넌트 기본정보
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.01.10     김보영           최초생성
************************************************************************************************/
@Service("SYSM110Service")
public class SYSM110ServiceImpl implements SYSM110Service {

	@Resource(name="SYSMCommDAO")
	private SYSMCommDAO SYSM110DAO;

	@Override
	public List<SYSM110VO> SYSM110SEL02(SYSM100VO vo) throws Exception {
		return SYSM110DAO.selectByList("SYSM110SEL02", vo);
	}
	
	@Override
	public List<SYSM110VO> SYSM110SEL03(SYSM110VO vo) throws Exception {
		return SYSM110DAO.selectByList("SYSM110SEL03", vo);
	}


	@Override
	public Integer SYSM110INS01(SYSM100VO vo) throws Exception {

		Integer result = 0;

		try {
			//테넌트 기본정보 등록
			result = SYSM110DAO.sqlInsert("SYSM110INS01",vo);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return result;
	}

	@Override
	public Integer SYSM110UPT01(SYSM100VO vo) throws Exception {

		Integer result = 0;

		try {
			//테넌트 기본정보 변경
			result = SYSM110DAO.sqlUpdate("SYSM110UPT01", vo);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return result;
	}
	
	@Override
	public Integer SYSM110DEL01(SYSM100VO vo) throws Exception {
		return SYSM110DAO.sqlDelete("SYSM110DEL01",vo);
	}

	@Override
	public Integer SYSM110INS02(List<SYSM110VO> list) throws Exception {
		Integer result = 0;

		try {
			//테넌트  부가서비스 등록
			for(SYSM110VO SYSM110VO : list) {
				result +=  SYSM110DAO.sqlInsert("SYSM110INS02",SYSM110VO);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return result;
	}
	
	@Override
	public Integer SYSM110DEL02(SYSM100VO vo) throws Exception {
		Integer result = 0;

		try {
			//테넌트  부가서비스 등록
			result =  SYSM110DAO.sqlDelete("SYSM110DEL02",vo);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return result;
	}
	
	@Override
	public Integer SYSM110UPT02(List<SYSM110VO> list) throws Exception {
		Integer result = 0;
		try {
			//테넌트 기본정보 변경
			result = SYSM110DAO.sqlUpdate("SYSM110UPT02",list);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return result;
	}


	@Override
	public Integer SYSM110DEL03(List<SYSM110VO> list) throws Exception {
		Integer result = 0;
		try {
			//테넌트 기본정보 변경
			result += SYSM110DAO.sqlDelete("SYSM110DEL03",list);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return result;
	}

}
