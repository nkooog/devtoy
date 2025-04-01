package org.crm.sysm.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.Resource;
import org.crm.sysm.VO.SYSM130VO;
import org.crm.sysm.service.SYSM130Service;
import org.crm.sysm.service.dao.SYSMCommDAO;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/***********************************************************************************************
 * Program Name : 조직관리 ServiceImpl
 * Creator      : 정대정
 * Create Date  : 2022.01.10
 * Description  : 조직관리
 * Modify Desc  :
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.02.10     정대정           최초생성
 ************************************************************************************************/
@Service("SYSM130Service")
public class SYSM130ServiceImpl implements SYSM130Service {

    private ObjectMapper objectMapper;

    @Resource(name="SYSMCommDAO")
    private SYSMCommDAO SYSM130DAO;

    @Autowired
    public SYSM130ServiceImpl(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @Override
    public List<SYSM130VO> SYSM130SEL01(SYSM130VO vo) throws Exception {
        return SYSM130DAO.selectByList("SYSM130SEL01", vo);
    }
    @Override
    public int SYSM130INS01(ArrayList<SYSM130VO> vo) throws Exception {
        int result = 0;
        for(SYSM130VO item : vo){
            SYSM130VO resultvo = (SYSM130VO) SYSM130DAO.selectByOne("SYSM130INS01", item);
            if(resultvo.getOperationType().equals("INSERT")){
                result = result + SYSM130DAO.sqlUpdate("SYSM130UPT01", resultvo);
            }else{
                if(resultvo.getOrgStCd().equals("D") || resultvo.getOrgStCd().equals("N")) {
                    result = result + SYSM130DAO.sqlUpdate("SYSM130UPT02", resultvo);
                }else{
                    result = 1;
                }

            }

            if(result < 0) throw new RuntimeException();
        }
        return result;
    }

    //조직 변경
    @Override
    public int SYSM130UPT03(SYSM130VO vo) throws Exception{
        return SYSM130DAO.sqlUpdate("SYSM130UPT03", vo);
    }

    //조직 제거
    @Override
    public int SYSM130DEL01(SYSM130VO vo) throws Exception {
        return SYSM130DAO.sqlDelete("SYSM130DEL01", vo);
    }


    @Override
    public int SYSM130UPT04(JSONObject json) throws Exception {

        SYSM130VO sysm130vo = this.objectMapper.readValue(String.valueOf(json.get("selectItem")), SYSM130VO.class);
        int result = 0;
        result = SYSM130DAO.sqlUpdate("SYSM130UPT04", json);
        SYSM130DAO.sqlUpdate("SYSM130UPT01", sysm130vo);
        return result;
    }

}
