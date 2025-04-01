package org.crm.sysm.service.impl;

import java.util.ArrayList;
import java.util.List;

import jakarta.annotation.Resource;

import org.springframework.stereotype.Service;

import org.crm.sysm.VO.SYSM437VO;
import org.crm.sysm.service.SYSM437Service;
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
@Service("SYSM437Service")
public class SYSM437ServiceImpl implements SYSM437Service {

	@Resource(name = "SYSMCommDAO")
	private SYSMCommDAO sysm437DAO;

	//select
	@Override
	public List<SYSM437VO> SYSM437SEL01(SYSM437VO sysm437VO) throws Exception {
		List<SYSM437VO> SYSM437VOList = sysm437DAO.selectByList("SYSM437SEL01", sysm437VO);
		return SYSM437VOList;
	}

	@Override
	public List<SYSM437VO> SYSM437SEL02(SYSM437VO SYSM437VO) throws Exception {
		
		List<SYSM437VO> SYSM437VOList = sysm437DAO.selectByList("SYSM437SEL02", SYSM437VO);
		
		List<SYSM437VO> listResult = new ArrayList<>();
		
		//select된 튜플이 있는지 확인
		if (SYSM437VOList.size()>0) {
			for (SYSM437VO vo : SYSM437VOList) {
				
				//사용자 이름 복호화
				if (!ComnFun.isEmpty(vo.getRegUsrNm())){
                	vo.setRegUsrNm(AES256Crypt.decrypt(vo.getRegUsrNm()));
                }

                if (!ComnFun.isEmpty(vo.getCustNm())){
                	vo.setCustNm(AES256Crypt.decrypt(vo.getCustNm()));
                }
                
                if (!ComnFun.isEmpty(vo.getRecvrTelNo())){
                	vo.setRecvrTelNo(AES256Crypt.decrypt(vo.getRecvrTelNo()));
                }
                
                if (!ComnFun.isEmpty(SYSM437VO.getSearchType2())){
                	if(SYSM437VO.getSearchType().equals("1")){
                    	if(vo.getCustId().contains(SYSM437VO.getSearchType2())) {
                    		listResult.add(vo);
                    	}
                    }
                	else if(SYSM437VO.getSearchType().equals("2")){
                    	if(vo.getCustNm().contains(SYSM437VO.getSearchType2())) {
                    		listResult.add(vo);
                    	}
                    }
                	else if(SYSM437VO.getSearchType().equals("3")){
                    	if(vo.getRecvrTelNo().contains(SYSM437VO.getSearchType2())) {
                    		listResult.add(vo);
                    	}
                    }
                	else {
                		listResult.add(vo);
                	}
                } else {
                	listResult.add(vo);
                }
                
                
                
            }			
		}
		
		return listResult;
	}	

}
