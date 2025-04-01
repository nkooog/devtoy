package org.crm.cmmt.service;


import org.crm.cmmt.VO.NoteFileVO;

import java.util.List;

/***********************************************************************************************
 * Program Name : 쪽지 첨부파일 Service
 * Creator      : 이민호
 * Create Date  : 2022.05.10
 * Description  : 쪽지 첨부파일
 * Modify Desc  :
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.05.10      이민호           최초생성
 ************************************************************************************************/
public interface NoteFileService {
    List<NoteFileVO> noteFileList(NoteFileVO vo) throws Exception;
    int noteFileDelete(NoteFileVO vo) throws Exception;

}
