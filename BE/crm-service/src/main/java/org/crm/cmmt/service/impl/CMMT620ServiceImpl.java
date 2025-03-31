package org.crm.cmmt.service.impl;

import org.crm.cmmt.VO.CMMT620VO;
import org.crm.cmmt.service.CMMT620Service;
import org.crm.cmmt.service.dao.CMMTCommDAO;
import org.crm.util.crypto.AES256Crypt;
import org.springframework.stereotype.Service;

import jakarta.annotation.Resource;
import java.util.List;

/***********************************************************************************************
 * Program Name : 뉴스레터 확인내역 Service
 * Creator      : 손동완
 * Create Date  : 2023.11.17
 * Description  : 뉴스레터 확인내역
 * Modify Desc  :
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2023.11.17      손동완           최초생성
 ************************************************************************************************/
@Service("CMMT620Service")
public class CMMT620ServiceImpl implements CMMT620Service {

    @Resource(name = "CMMTCommDAO")
    private CMMTCommDAO CMMT620DAO;

    @Override
    public List<CMMT620VO> CMMT620SEL01(CMMT620VO vo) throws Exception {

    	List<CMMT620VO> list = CMMT620DAO.selectByList("CMMT620SEL01", vo);
    	
    	if (list.size()>0) {
			for (CMMT620VO cmmt620VO : list) {	
				cmmt620VO.setCnslrNmId(AES256Crypt.decrypt(cmmt620VO.getCnslrNm()) + "(" + cmmt620VO.getCnslrId() + ")");
			}
		}
        return list;
    }
}


