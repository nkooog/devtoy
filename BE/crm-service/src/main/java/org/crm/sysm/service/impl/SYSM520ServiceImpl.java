package org.crm.sysm.service.impl;

import org.crm.sysm.VO.SYSM520VO;
import org.crm.sysm.service.SYSM520Service;
import org.crm.sysm.service.dao.SYSMCommDAO;
import org.crm.util.com.ComnFun;
import org.crm.util.crypto.AES256Crypt;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;
import java.util.List;

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
@Service("SYSM520Service")
public class SYSM520ServiceImpl implements SYSM520Service {

	@Resource(name="SYSMCommDAO")
	private SYSMCommDAO SYSM520Mapper;

	//select
	@Override
	public List<SYSM520VO> SYSM520SEL01(SYSM520VO SYSM520VO) throws Exception {

		List<SYSM520VO> SYSM520VOList = SYSM520Mapper.selectByList("SYSM520SEL01", SYSM520VO);
		
		//select된 튜플이 있는지 확인
		if (SYSM520VOList.size()>0) {
			for (SYSM520VO vo : SYSM520VOList) {
				
				//사용자 이름 복호화
                if (!ComnFun.isEmpty(vo.getRegUsrNm())){
                	vo.setRegUsrNm(AES256Crypt.decrypt(vo.getRegUsrNm()));
                }
                if (!ComnFun.isEmpty(vo.getLstUsrNm())){
                	vo.setLstUsrNm(AES256Crypt.decrypt(vo.getLstUsrNm()));
                }
            }			
		}
		return SYSM520VOList;
	}

	@Override
	public List<SYSM520VO> SYSM520SEL02(SYSM520VO SYSM520VO) throws Exception {
		return SYSM520Mapper.selectByList("SYSM520SEL02", SYSM520VO);
	}
	
	@Override
	public List<SYSM520VO> SYSM520SEL03(SYSM520VO SYSM520VO) throws Exception {
		return SYSM520Mapper.selectByList("SYSM520SEL03", SYSM520VO);
	}
	
	
	//insert
	@Override
	public Integer SYSM520INS01(List<SYSM520VO> list) throws Exception {
		return SYSM520Mapper.sqlInsert("SYSM520INS01", list);
	}

	//upadte
	@Override
	public Integer SYSM520UPT01(List<SYSM520VO> list) throws Exception {
		return SYSM520Mapper.sqlUpdate("SYSM520UPT01", list);
	}

	//delete
	@Override
	public Integer SYSM520DEL01(List<SYSM520VO> list) throws Exception {
		return SYSM520Mapper.sqlDelete("SYSM520DEL01", list);
	}

}
