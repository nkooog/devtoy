package org.crm.cmmt.service.impl;

import org.crm.cmmt.VO.CMMT600VO;
import org.crm.cmmt.service.CMMT600Service;
import org.crm.cmmt.service.dao.CMMTCommDAO;
import org.springframework.stereotype.Service;

import jakarta.annotation.Resource;
import java.util.List;

/***********************************************************************************************
 * Program Name : 뉴스레터 목록 Service
 * Creator      : 손동완
 * Create Date  : 2023.11.15
 * Description  : 뉴스레터 목록
 * Modify Desc  :
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2023.11.15      손동완           최초생성
 ************************************************************************************************/
@Service("CMMT600Service")
public class CMMT600ServiceImpl implements CMMT600Service {

    @Resource(name = "CMMTCommDAO")
    private CMMTCommDAO CMMT600DAO;

    @Override
    public List<CMMT600VO> CMMT600SEL01(CMMT600VO vo) throws Exception {
        return CMMT600DAO.selectByList("CMMT600SEL01", vo);
    }
    
    @Override
    public int CMMT600DEL01(CMMT600VO vo) throws Exception {
        return CMMT600DAO.sqlDelete("CMMT600DEL01", vo);
    }
    
    @Override
    public int CMMT600DEL02(CMMT600VO vo) throws Exception {
        return CMMT600DAO.sqlDelete("CMMT600DEL02", vo);
    }
}


