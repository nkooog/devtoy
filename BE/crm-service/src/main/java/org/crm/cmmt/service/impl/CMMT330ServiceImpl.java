package org.crm.cmmt.service.impl;

import org.crm.cmmt.VO.CMMT330VO;
import org.crm.cmmt.service.CMMT330Service;
import org.crm.cmmt.service.dao.CMMTCommDAO;
import org.crm.util.crypto.AES256Crypt;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;

import java.util.List;

/***********************************************************************************************
 * Program Name : 반려사유 - popup ServiceImpl
 * Creator      : 이민호
 * Create Date  : 2022.07.28
 * Description  : 컨텐츠 반려사유 Popup
 * Modify Desc  :
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.78.28      이민호           최초생성
 ************************************************************************************************/
@Service("CMMT330Service")
public class CMMT330ServiceImpl implements CMMT330Service {

	@Resource(name="CMMTCommDAO")
	private CMMTCommDAO CMMT330DAO;

	@Override
	public int CMMT330INS01(CMMT330VO vo) throws Exception {
		String category = vo.getCategory();
		int result = 0;
		if (category.equals("K")) {
			result = CMMT330DAO.sqlInsert("KMST330INS01" , vo);
		}
		if (category.equals("C")) {
			result = CMMT330DAO.sqlInsert("CMMT330INS01" , vo);
		}
		return result;
	}

	@Override
	public List<CMMT330VO> CMMT331SEL01(CMMT330VO vo) throws Exception {
		List<CMMT330VO> CMMT330VOList = CMMT330DAO.selectByList("CMMT331SEL01" , vo);
		if (CMMT330VOList.size()>0) {
			for (CMMT330VO cmmt330VO : CMMT330VOList) {
				cmmt330VO.setRjtrNm(AES256Crypt.decrypt(cmmt330VO.getRjtrNm()));
			}
		}
		return CMMT330VOList;
	}
}


