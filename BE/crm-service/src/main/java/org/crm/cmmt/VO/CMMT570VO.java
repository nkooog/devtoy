package org.crm.cmmt.VO;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

/***********************************************************************************************
 * Program Name : 쪽지전달 팝업 VO
 * Creator      : 이민호
 * Create Date  : 2022.04.28
 * Description  : 쪽지쓰기 팝업
 * Modify Desc  :
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.04.28      이민호           최초생성
 ************************************************************************************************/
@Getter @Setter
public class CMMT570VO extends NoteFileVO {

	private String dpchmnId;
	private String dpchmnNm;
	private String dpchmnOrgCd;
	private String recvrId;
	private String recvrOrgCd;
	private String noteWrtgDvCd;
	private String dpchDdSi;
	private String noteTite;
	private String noteCtt;
	private int otxtNoteNo;
	private String otxtNoteRegYr;
	private String replyReqYn;
	private String rspsDvCd;
	private String rspsNoteRegYr;
	private String rspsNoteNo;
	private String dpchNoteStCd;
	private String recvNoteStCd;
	private List<Object> recvrInfo;
	private List<Object> apndInfo;
	private int apndCount;
	private String apndSeq;
	private String apndFileSz;
	private List<String> apndFileSeqList;
	private List<String> apndFileNmList;
	private List<String> apndFileIdxNmList;
	private List<String> apndFilePsnList;
	private List<String> apndFileSzList;

}
