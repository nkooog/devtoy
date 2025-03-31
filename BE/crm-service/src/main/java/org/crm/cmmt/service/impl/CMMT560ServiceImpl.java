package org.crm.cmmt.service.impl;

import org.crm.cmmt.VO.CMMT560VO;
import org.crm.cmmt.VO.NoteFileVO;
import org.crm.cmmt.service.CMMT560Service;
import org.crm.cmmt.service.dao.CMMTCommDAO;
import org.springframework.stereotype.Service;

import jakarta.annotation.Resource;
import java.util.List;

/***********************************************************************************************
 * Program Name : 쪽지쓰기 ServiceImpl
 * Creator      : 이민호
 * Create Date  : 2022.04.27
 * Description  : 쪽지쓰기 메인
 * Modify Desc  :
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.04.27      이민호           최초생성
 ************************************************************************************************/
@Service("CMMT560Service")
public class CMMT560ServiceImpl implements CMMT560Service {

	@Resource(name="CMMTCommDAO")
	private CMMTCommDAO DAO;


    @Override
    public int CMMT560INS01(CMMT560VO vo, List<NoteFileVO> attachedFileList) {
        int noteNo = vo.getNoteNo();
        try {
            if (noteNo > 0) {
//                NoteFileUtils util = new NoteFileUtils();
//                util.checkExistFileAndDelete(vo.getTenantId(), noteNo);
                noteNo = DAO.selectByCount("CMMT560UPT01" , vo);
            }
            if (noteNo == 0) {
                noteNo = DAO.selectByCount("CMMT560INS01" , vo);
            }
            vo.setNoteNo(noteNo);
            DAO.sqlInsert("CMMT560INS02" , vo);

            attachedFileInsert(attachedFileList, noteNo);
        } catch (Exception e) {
            e.printStackTrace();
            noteNo = 0;
        }
        return noteNo;
    }



    @Override
    public int CMMT560INS02(CMMT560VO vo) {
        int noteNo = vo.getNoteNo();
        try {
            noteNo = noteNo == 0 ?  DAO.selectByCount("CMMT560INS01" , vo)  : DAO.selectByCount("CMMT560UPT01" , vo) ;
            vo.setNoteNo(noteNo);
            DAO.sqlInsert("CMMT560INS02" , vo);
        } catch (Exception e) {
            e.printStackTrace();
            noteNo = 0;
        }
        return noteNo;
    }


    @Override
    public int CMMT560INS03(CMMT560VO vo, List<NoteFileVO> attachedFileList) {
        int noteNo;
        try {
            noteNo = DAO.selectByCount("CMMT560INS01" , vo);
            attachedFileInsert(attachedFileList, noteNo);
            vo.setNoteNo(noteNo);
            if (vo.getRecvrInfo().size() > 0) DAO.sqlInsert("CMMT560INS09" , vo );
            else  DAO.sqlInsert("CMMT560INS10" , vo );
        } catch (Exception e) {
            e.printStackTrace();
            noteNo = 0;
        }
        return noteNo;
    }

    private void attachedFileInsert(List<NoteFileVO> attachedFileList, int noteNo) throws Exception {
        if (attachedFileList.size() > 0) {
            for (NoteFileVO attachedFile : attachedFileList) {
                attachedFile.setNoteNo(noteNo);
                DAO.sqlInsert("noteAttachedFileInsert" , attachedFile);
            }
        }
    }
}


