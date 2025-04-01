package org.crm.comm.service.impl;

import org.crm.comm.VO.COMM150VO;
import org.crm.comm.service.COMM150Service;
import org.crm.comm.service.dao.COMMCommDAO;
import org.crm.util.crypto.AES256Crypt;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


/***********************************************************************************************
 * Program Name : 전역변수 (테넌트)변경 Controller
 * Creator      : jrlee
 * Create Date  : 2022.08.02
 * Description  : 전역변수 (테넌트)변경
 * Modify Desc  :
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.08.02     jrlee           최초생성
 * 2023.01.04     djjung          기능변경 - 테넌트,등급,유저아이디 변경
 ************************************************************************************************/
@Service("COMM150Service")
@Transactional
public class COMM150ServiceImpl implements COMM150Service {

	@Resource(name="COMMCommDAO")
	private COMMCommDAO COMM150DAO;

	@Override
	public List<COMM150VO> COMM150SEL01(COMM150VO vo) {
		return COMM150DAO.selectByList("COMM150SEL01", vo);
	}

	@Override
	public List<COMM150VO> COMM150SEL02(COMM150VO vo) throws Exception {
		List<COMM150VO> volist  = COMM150DAO.selectByList("COMM150SEL02", vo);
		for (COMM150VO resultvo : volist){
			if(resultvo.getUsrNm() != null){
				resultvo.setDecUsrNm(AES256Crypt.decrypt(resultvo.getUsrNm()));
			}
		}
		return volist;
	}
	
	@Override
	public List<COMM150VO> COMM150SEL04(COMM150VO vo) throws Exception {
		List<COMM150VO> volist  = COMM150DAO.selectByList("COMM150SEL04", vo);
		for (COMM150VO resultvo : volist){
			if(resultvo.getUsrNm() != null){
				resultvo.setUsrNm(AES256Crypt.decrypt(resultvo.getUsrNm()));
			}
		}
		return volist;
	}
	
	@Override
	public List<COMM150VO> COMM150SEL05(COMM150VO vo) throws Exception {
		List<COMM150VO> volist  = COMM150DAO.selectByList("COMM150SEL05", vo);
		for (COMM150VO resultvo : volist){
			if(resultvo.getUsrNm() != null){
				resultvo.setUsrNm(AES256Crypt.decrypt(resultvo.getUsrNm()));
			}
		}
		return volist;
	}
	
	@Override
	public List<COMM150VO> COMM150SEL06(COMM150VO vo) throws Exception {
		List<COMM150VO> volist  = COMM150DAO.selectByList("COMM150SEL06", vo);
		for (COMM150VO resultvo : volist){
			if(resultvo.getUsrNm() != null){
				resultvo.setUsrNm(AES256Crypt.decrypt(resultvo.getUsrNm()));
			}
		}
		return volist;
	}
}
