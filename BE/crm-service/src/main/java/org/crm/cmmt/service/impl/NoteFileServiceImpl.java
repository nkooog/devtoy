package org.crm.cmmt.service.impl;

import org.crm.cmmt.VO.NoteFileVO;
import org.crm.cmmt.service.NoteFileService;
import org.crm.cmmt.service.dao.CMMTCommDAO;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;

import java.util.List;

/***********************************************************************************************
 * Program Name : 쪽지 첨부파일 ServiceImpl
 * Creator      : 이민호
 * Create Date  : 2022.05.10
 * Description  : 쪽지 첨부파일
 * Modify Desc  :
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.05.10      이민호           최초생성
 ************************************************************************************************/
@Service("NoteFileService")
public class NoteFileServiceImpl implements NoteFileService {

	@Resource(name = "CMMTCommDAO")
	private CMMTCommDAO dao;

	@Override
	public List<NoteFileVO> noteFileList(NoteFileVO vo) throws Exception {
		return dao.selectByList("noteFileList", vo);
	}

	@Override
	public int noteFileDelete(NoteFileVO vo) throws Exception {
		return dao.sqlDelete("noteFileDelete", vo);
	}

}


