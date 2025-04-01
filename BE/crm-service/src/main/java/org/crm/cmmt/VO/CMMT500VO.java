package org.crm.cmmt.VO;


import org.crm.comm.VO.COMM120VO;
import lombok.Getter;
import lombok.Setter;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

/***********************************************************************************************
 * Program Name : 쪽지관리 VO
 * Creator      : 이민호
 * Create Date  : 2022.04.27
 * Description  : 쪽지관리 메인
 * Modify Desc  :
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.04.27      이민호           최초생성
 ************************************************************************************************/
@Getter
@Setter
public class CMMT500VO extends COMM120VO {

	private String noteType;
	private int noteNo;
	private String regYr;
	private int apndCount;
	private String apndSeq;
	private String apndFileSz;
	private List<String> apndFileSeqList;
	private List<String> apndFileNmList;
	private List<String> apndFileIdxNmList;
	private List<String> apndFilePsnList;
	private List<String> apndFileSzList;
	private String usrId;
	private String dpchmnId;
	private String dpchmnNm;
	private String dpchmnOrgCd;
	private String dpchNoteStCd;
	private String recvrId;
	private List<String> recvrIdList;
	private List<String> recvrNmList;
	private List<String> recvrOrgCdList;
	private List<String> recvrOrgNmList;
	private List<String> recvNoteStCdList;
	private List<String> puslDvList;
	private String recvrNm;
	private String recvrOrgCd;
	private String recvrOrgNm;
	private String noteTite;
	private String noteCtt;
	private Timestamp dpchDdSi;
	private Timestamp puslDdSi;
	private String puslDv;
	private Timestamp regDtm;
	private String recvNoteStCd;
	private String replyReqYn;
	private int otxtNoteNo;
	private int rspsNoteNo;
	private String rspsDvCd;
	private String srchDtTo;
	private String srchDtFrom;
	private String srchTextType;		// 검색대상
	private String srchText;			// 검색어
	private String attachedType;		// 첨부파일 여부
	private String checkRead;			// 열람 여부
	private String srchUsrType;			// 수신,발신자 구분
	private int srchNote; 				// 쪽지함 분류코드
	private String dpchmnOrgNm;

	private int recvrCnt;
	private int setDay;
	
	//kw---20250318 : 실시간 쪽지 체크
	private String startDate;
	private String endDate;

	private List<Integer> srchNoteType = new ArrayList<>();	// 쪽지함 구분

}
