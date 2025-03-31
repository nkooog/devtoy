package org.crm.cmmt.service;


import org.crm.cmmt.VO.CMMT570VO;
import org.crm.cmmt.VO.NoteFileVO;

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
public interface CMMT570Service {
	CMMT570VO CMMT570SEL02(CMMT570VO vo) throws Exception;
	CMMT570VO CMMT570SEL03(CMMT570VO vo) throws Exception;
	int CMMT570INS01(CMMT570VO vo, List<NoteFileVO> attatchFileList) throws Exception;
	int CMMT570INS02(CMMT570VO vo) throws Exception;
	int CMMT570INS03(CMMT570VO vo, List<NoteFileVO> attatchFileList) throws Exception;

}
