package org.crm.sysm.service.impl;

import java.util.List;

import jakarta.annotation.Resource;

import org.springframework.stereotype.Service;

import org.crm.sysm.VO.SYSM436VO;
import org.crm.sysm.service.SYSM436Service;
import org.crm.sysm.service.dao.SYSMCommDAO;
import org.crm.util.com.ComnFun;
import org.crm.util.crypto.AES256Crypt;

/***********************************************************************************************
* Program Name : 상담그룹코드 관리 ServiceImpl
* Creator      : wkim
* Create Date  : 2023.02.13
* Description  : 상담그룹코드 관리
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2023.02.13     wkim             최초생성
************************************************************************************************/
@Service("SYSM436Service")
public class SYSM436ServiceImpl implements SYSM436Service {

	@Resource(name = "SYSMCommDAO")
	private SYSMCommDAO sysm436DAO;

	//select
	@Override
	public List<SYSM436VO> SYSM436SEL01(SYSM436VO sysm436VO) throws Exception {

		
		List<SYSM436VO> SYSM436VOList = sysm436DAO.selectByList("SYSM436SEL01", sysm436VO);
		
		//select된 튜플이 있는지 확인
		if (SYSM436VOList.size()>0) {
			for (SYSM436VO vo : SYSM436VOList) {
				
				//사용자 이름 복호화
                if (!ComnFun.isEmpty(vo.getLstCorprNm())){
                	vo.setLstCorprNm(AES256Crypt.decrypt(vo.getLstCorprNm()));
                }
                if (!ComnFun.isEmpty(vo.getAbolmnNm())){
                	vo.setAbolmnNm(AES256Crypt.decrypt(vo.getAbolmnNm()));
                }
            }			
		}
		return SYSM436VOList;
	}

	@Override
	public List<SYSM436VO> SYSM436SEL02(SYSM436VO SYSM436VO) throws Exception {
		return sysm436DAO.selectByList("SYSM436SEL02", SYSM436VO);
	}	
	
	//insert
	@Override
	public Integer SYSM436INS01(List<SYSM436VO> list) throws Exception {
		return sysm436DAO.sqlInsert("SYSM436INS01", list);
	}

	//upadte
	@Override
	public Integer SYSM436UPT01(List<SYSM436VO> list) throws Exception {
		return sysm436DAO.sqlUpdate("SYSM436UPT01", list);
	}
	
	//upadte - 폐기
	@Override
	public Integer SYSM436UPT02(List<SYSM436VO> list) throws Exception {
		return sysm436DAO.sqlUpdate("SYSM436UPT02", list);
	}

	//delete
	@Override
	public Integer SYSM436DEL01(List<SYSM436VO> list) throws Exception {
		return sysm436DAO.sqlDelete("SYSM436DEL01", list);
	}

}
