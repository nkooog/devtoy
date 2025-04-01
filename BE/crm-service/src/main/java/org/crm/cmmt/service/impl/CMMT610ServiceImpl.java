package org.crm.cmmt.service.impl;

import org.crm.cmmt.VO.CMMT600VO;
import org.crm.cmmt.service.CMMT610Service;
import org.crm.cmmt.service.dao.CMMTCommDAO;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;

/***********************************************************************************************
 * Program Name : 뉴스레터 등록 팝업 Service
 * Creator      : 손동완
 * Create Date  : 2023.11.16
 * Description  : 뉴스레터 등록
 * Modify Desc  :
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2023.11.16      손동완           최초생성
 * 2024.12.09      jypark          	egov->boot mig
 ************************************************************************************************/
@Service("CMMT610Service")
public class CMMT610ServiceImpl implements CMMT610Service {

    @Resource(name="CMMTCommDAO")
    private CMMTCommDAO CMMT610DAO;
    
    @Override
    public CMMT600VO CMMT610SEL01(CMMT600VO vo) throws Exception {
        return (CMMT600VO) CMMT610DAO.selectByOne("CMMT610SEL01", vo);
    }

    @Override
    public int CMMT610INS01(CMMT600VO vo) throws Exception {
        return CMMT610DAO.sqlInsert("CMMT610INS01", vo);
    }
    
    @Override
    public int CMMT610UPT01(CMMT600VO vo) throws Exception {

        return CMMT610DAO.sqlUpdate("CMMT610UPT01", vo);
    }
}


