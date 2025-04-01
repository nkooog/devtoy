package org.crm.cmmt.VO;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

/***********************************************************************************************
 * Program Name : 쪽지쓰기 팝업 VO
 * Creator      : 이민호
 * Create Date  : 2022.04.27
 * Description  : 쪽지쓰기 팝업
 * Modify Desc  :
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.04.27      이민호           최초생성
 ************************************************************************************************/
@Getter
@Setter
public class CMMT560VO {

	private String tenantId;
	private int noteNo;
	private String noteType;
	private String dpchmnId;
	private String dpchmnOrgCd;
	private String recvNoteStCd;
	private String recvrId;
	private String recvrOrgCd;
	private String noteTite;
	private String noteCtt;
	private String replyReqYn;
	private String rspsDvCd;
	private String rspsNoteRegYr;
	private String rspsNoteNo;
	private String dpchNoteStCd;
	private List<Object> recvrInfo;
}
