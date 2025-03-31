package org.crm.cmmt.service.impl;

import org.crm.cmmt.VO.CMMT570VO;
import org.crm.cmmt.VO.NoteFileVO;
import org.crm.cmmt.service.CMMT570Service;
import org.crm.cmmt.service.dao.CMMTCommDAO;
import org.crm.cmmt.web.NoteFileUtils;
import org.crm.util.com.ComnFun;
import org.crm.util.crypto.AES256Crypt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.annotation.Resource;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.List;

/***********************************************************************************************
 * Program Name : 쪽지전달(+회신) Service
 * Creator      : 이민호
 * Create Date  : 2022.05.02
 * Description  : 쪽지전달(+회신)
 * Modify Desc  :
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.05.02      이민호           최초생성
 ************************************************************************************************/
@Service("CMMT570Service")
public class CMMT570ServiceImpl implements CMMT570Service {

	@Resource(name="CMMTCommDAO")
	private CMMTCommDAO DAO;


    @Autowired
    private NoteFileUtils fileUtils;

    @Override
    public CMMT570VO CMMT570SEL02(CMMT570VO vo) throws Exception {
        CMMT570VO cmmt570VO = (CMMT570VO) DAO.selectByOne("CMMT570SEL03" ,  vo);
        cmmt570VO.setDpchmnNm(AES256Crypt.decrypt(cmmt570VO.getDpchmnNm()));
        return cmmt570VO;
    }

    @Override
    public CMMT570VO CMMT570SEL03(CMMT570VO vo) throws Exception {
        CMMT570VO cmmt570VO = (CMMT570VO) DAO.selectByOne("CMMT570SEL03" ,  vo);
        cmmt570VO.setDpchmnNm(AES256Crypt.decrypt(cmmt570VO.getDpchmnNm()));
        if (!ComnFun.isEmpty(cmmt570VO.getApndSeq()))
            cmmt570VO.setApndFileSeqList(Arrays.asList(cmmt570VO.getApndSeq().split(",")));
        if (!ComnFun.isEmpty(cmmt570VO.getApndFileNm()))
            cmmt570VO.setApndFileNmList(Arrays.asList(cmmt570VO.getApndFileNm().split(",")));
        if (!ComnFun.isEmpty(cmmt570VO.getApndFileIdxNm()))
            cmmt570VO.setApndFileIdxNmList(Arrays.asList(cmmt570VO.getApndFileIdxNm().split(",")));
        if (!ComnFun.isEmpty(cmmt570VO.getApndFileSz()))
            cmmt570VO.setApndFileSzList(Arrays.asList(cmmt570VO.getApndFileSz().split(",")));
        if (!ComnFun.isEmpty(cmmt570VO.getApndFilePsn()))
            cmmt570VO.setApndFilePsnList(Arrays.asList(cmmt570VO.getApndFilePsn().split(",")));
            Path path = Paths.get(cmmt570VO.getApndFilePsn());
            long bytes = Files.size(path);
            cmmt570VO.setInputApndFileSz(bytes);

        return cmmt570VO;
    }

    @Override
    public int CMMT570INS01(CMMT570VO vo, List<NoteFileVO> attachedFileList) {
        int noteNo = vo.getNoteNo();

        try {
            if (noteNo > 0) {
                DAO.sqlDelete("CMMT570DEL01" , vo);
                DAO.sqlUpdate("CMMT570UPT01" , vo);


                if (DAO.selectByCount("noteFileCount" , vo) > 0) {

                    fileUtils.checkExistFileAndDelete(DAO.selectByList("noteFileList" , vo));
                    DAO.sqlDelete("noteFileDelete" , vo);
                }
            }
            if (noteNo == 0) {
                noteNo = DAO.selectByCount("CMMT570INS01" , vo);
                vo.setNoteNo(noteNo);
            }
            DAO.sqlInsert("CMMT570INS02" , vo);
            attachedFileInsert(attachedFileList, noteNo, vo);
        } catch (Exception e) {
            e.printStackTrace();
            noteNo = 0;
        }
        return noteNo;
    }

    @Override
    public int CMMT570INS02(CMMT570VO vo) {
        int noteNo = vo.getNoteNo();
        try {
            noteNo = noteNo == 0
                    ? DAO.selectByCount("CMMT570INS01" ,vo)
                    : DAO.selectByCount("CMMT570UPT01" ,vo);
            DAO.sqlDelete("CMMT570DEL01" , vo);
            vo.setNoteNo(noteNo);
            DAO.sqlInsert("CMMT570INS02" , vo);
        } catch (Exception e) {
            e.printStackTrace();
            noteNo = 0;
        }
        return noteNo;
    }


    @Override
    public int CMMT570INS03(CMMT570VO vo, List<NoteFileVO> attachedFileList) {
        int noteNo = vo.getNoteNo();
        try {
            if (noteNo > 0) {
                // 받은 쪽지함 삭제
                DAO.sqlDelete("CMMT570DEL01" , vo);
                noteNo = DAO.selectByCount("CMMT570UPT01" , vo);

                if (DAO.selectByCount("noteFileCount" , vo) > 0) {
                    fileUtils.checkExistFileAndDelete( DAO.selectByList("noteFileList" , vo));
                    DAO.sqlDelete("noteFileDelete" , vo);
                }
            }
            if (noteNo == 0) {
                // 신규일 경우 보낸 쪽지함 추가
                noteNo = DAO.selectByCount("CMMT570INS01" , vo);
                vo.setNoteNo(noteNo);
            }

            // 받은 쪽지함 정보가 있다면
            if (vo.getRecvrInfo().size() > 0) {
                DAO.sqlInsert("CMMT570INS09" ,vo );
            } else DAO.sqlInsert("CMMT570INS10" , vo); // 유저정보 'unnamed'로 추가
            // 최종 파일 INSERT
            attachedFileInsert(attachedFileList, noteNo, vo);


            // 기존 파일 있을 경우 삭제
//            if (vo.getApndInfo().size() > 0)
            // 파일 복사 후 첨부파일 목록 ADD
//                attachedFileList.addAll(NoteFileUtils.copyToNoteFile(vo.getApndInfo()));


        } catch (Exception e) {
            e.printStackTrace();
            noteNo = 0;
        }
        return noteNo;
    }

    private void attachedFileInsert(List<NoteFileVO> attachedFileList, int noteNo, CMMT570VO vo) throws Exception {
        if (attachedFileList.size() > 0) {
            for (NoteFileVO attachedFile : attachedFileList) {
                attachedFile.setNoteNo(noteNo);
                attachedFile.setTenantId(vo.getTenantId());
                attachedFile.setRegrId(vo.getDpchmnId());
                attachedFile.setRegrOrgCd(vo.getDpchmnOrgCd());
                DAO.sqlInsert("noteAttachedFileInsert" , attachedFile);
            }
        }
    }
}


