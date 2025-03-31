package org.crm.sysm.service.impl;

import org.crm.sysm.VO.SYSM240VO;
import org.crm.sysm.service.SYSM240Service;
import org.crm.sysm.service.dao.SYSMCommDAO;
import org.crm.util.crypto.AES256Crypt;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

/***********************************************************************************************
* Program Name : 메타공통코드관리 ServiceImpl
* Creator      : 허해민
* Create Date  : 2022.01.17
* Description  : 메타공통코드관리
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.01.17     허해민           최초생성
************************************************************************************************/
@Service("SYSM240Service")
public class SYSM240ServiceImpl implements SYSM240Service {

	@Resource(name="SYSMCommDAO")
	private SYSMCommDAO SYSM240DAO;

	/** 메타공통코드관리 전체조회 */
	@Override
	public List<SYSM240VO> SYSM240SEL01(SYSM240VO sysm240vo) throws Exception {
		List<SYSM240VO> SYSM240VOList = SYSM240DAO.selectByList("SYSM240SEL01", sysm240vo);
		if (SYSM240VOList.size()>0) {
			for (int i=0; i<SYSM240VOList.size(); i++) {
				SYSM240VOList.get(i).setUsrNm(AES256Crypt.decrypt(SYSM240VOList.get(i).getUsrNm()));
				SYSM240VOList.get(i).setUserNm(AES256Crypt.decrypt(SYSM240VOList.get(i).getUserNm()));
			}
		}
		return SYSM240VOList;
	}
	
	/** 관리항목 한글 중복체크 */
	@Override
	public int SYSM240SEL02(SYSM240VO vo) throws Exception {
		return SYSM240DAO.selectByCount("SYSM240SEL02", vo);
	}
	
	/** 관리항목 영문 중복체크 */
	@Override
	public int SYSM240SEL03(SYSM240VO vo) throws Exception {
		return SYSM240DAO.selectByCount("SYSM240SEL03", vo);
	}

	/** 메타관리항목 수정 */
	@Override
	public int SYSM240UPT01(SYSM240VO vo) throws Exception {
		return SYSM240DAO.sqlUpdate("SYSM240UPT01", vo);
	}
	
	/** 메타관리항목 삭제 */
	@Override
	public int SYSM240UPT02(SYSM240VO vo) throws Exception {
		return SYSM240DAO.sqlUpdate("SYSM240UPT02", vo);
	}
	
	/** 사용자기본정보 신규등록  */
	@Override
	public int SYSM240INS01(SYSM240VO vo) throws Exception {
		return SYSM240DAO.sqlInsert("SYSM240INS01", vo);
	}
	
	/** 엑셀 업로드 UPSERT  */

	@Override	
	public int SYSM240INS02(List<Map<String, Object>> list) {
		int result = 0;
		try {
			result = SYSM240DAO.sqlInsert("SYSM240INS02", list);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return result;
	}

	@Override
	public int SYSM240DEL01(SYSM240VO voSetting) throws Exception {
		SYSM240DAO.sqlDelete("SYSM240DEL02", voSetting);
		return SYSM240DAO.sqlDelete("SYSM240DEL01", voSetting);
	}

	@Override
	public Integer SYSM240SEL04(SYSM240VO voSetting) throws Exception {
		return SYSM240DAO.selectByCount("SYSM240SEL04", voSetting);
	}

}