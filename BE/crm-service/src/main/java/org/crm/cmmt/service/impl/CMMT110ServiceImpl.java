package org.crm.cmmt.service.impl;

import org.crm.cmmt.VO.CMMT110VO;
import org.crm.cmmt.service.CMMT110Service;
import org.crm.cmmt.service.dao.CMMTCommDAO;
import org.crm.util.crypto.AES256Crypt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.annotation.Resource;
import java.util.List;

/***********************************************************************************************
 * Program Name : 통합게시판 조직/등급/개별 권한
 * Creator      : 정대정
 * Create Date  : 2022.05.02
 * Description  : 통합게시판 조직/등급/개별 권한
 * Modify Desc  :
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.05.02     정대정           최초생성
 ************************************************************************************************/
@Service("CMMT110Service")
public class CMMT110ServiceImpl implements CMMT110Service {

	int success = 1;
	int error = 0;

	@Resource(name="CMMTCommDAO")
	private CMMTCommDAO CMMT110DAO;

	@Override
	public List<CMMT110VO> CMMT110SEL01(CMMT110VO vo) throws Exception {
		List<CMMT110VO> CMMT110VOGridInfo = CMMT110DAO.selectByList("CMMT110SEL01", vo);
		if(vo.getCtgrUseAthtCd().equals("3")){
			for(CMMT110VO Info : CMMT110VOGridInfo){
				String[] split = Info.getAthtView().trim().split(":");
				Info.setAthtView(split[0]+":"+ AES256Crypt.decrypt(split[1]));
			}
		}
		return CMMT110VOGridInfo;
	}

	@Override
	@Transactional
	public int CMMT110INS01(List<CMMT110VO> list) throws Exception {
		int result =0;
		try {
			for (CMMT110VO vo : list) {
				if(vo.getAthtSeq()<0){
				    result = CMMT110DAO.sqlInsert("CMMT110INS01", vo);
				}else{
					result = CMMT110DAO.sqlUpdate("CMMT110UPT01", vo);
				}
			}
		}catch (Exception e){
			e.printStackTrace();
			return error;
		}
		return success;
	}

	@Override
	@Transactional
	public int CMMT110DEL01(List<CMMT110VO> list) throws Exception {
		int result=0;
		try {
			for(CMMT110VO vo:list){
				result = CMMT110DAO.sqlDelete("CMMT110DEL01", vo);
			}
		}catch (Exception e){
			e.printStackTrace();
			return error;
		}
		return success;
	}
	@Override
	@Transactional
	public int CMMT110DEL03(CMMT110VO cmmt110Vo) throws Exception {
		int result=0;
		try {
			result = CMMT110DAO.sqlDelete("CMMT110DEL03", cmmt110Vo);
		}catch (Exception e){
			e.printStackTrace();
			return error;
		}
		return success;
	}
}
