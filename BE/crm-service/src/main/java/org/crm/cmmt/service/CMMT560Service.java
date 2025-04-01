package org.crm.cmmt.service;

import org.crm.cmmt.VO.CMMT560VO;
import org.crm.cmmt.VO.NoteFileVO;

import java.util.List;


/***********************************************************************************************
 * Program Name : 쪽지쓰기 Service
 * Creator      : 이민호
 * Create Date  : 2022.04.27
 * Description  : 쪽지쓰기
 * Modify Desc  :
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.04.27      이민호           최초생성
 ************************************************************************************************/
public interface CMMT560Service {
    int CMMT560INS01(CMMT560VO vo, List<NoteFileVO> attatchFileList) throws Exception;
    int CMMT560INS02(CMMT560VO vo) throws Exception;
    int CMMT560INS03(CMMT560VO vo, List<NoteFileVO> attatchFileList) throws Exception;
}
