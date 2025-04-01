package org.crm.cmmt.VO;

import org.crm.cmmn.VO.CmmnSrchVO;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import org.springframework.web.multipart.MultipartFile;

import java.sql.Timestamp;
import java.util.Date;
import java.util.List;

/***********************************************************************************************
* Program Name : 통합게시글관리-게시판형  VO
* Creator      : 김보영
* Create Date  : 2022.01.10
* Description  : 통합계시글관리
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.01.10    김보영           최초생성
************************************************************************************************/
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class CMMT210VO extends CmmnSrchVO {
	
	private String tenantId;
	private int ctgrMgntNo;
	private String ctgrNm;
	private String ctgrTypCd;
	private int prsLvl;
	private int srtSeq;
	private int hgrkCtgrMgntNo;
	private String useTrmStrDd;
	private String useTrmEndDd;
	
	private int blthgMgntNo;
	private String blthgTite;
	private String blthgStCd;
	private String blthgStNm;
	private String blthgStRsnCtt;
	private String blthgRpsImg;
	private String blthgRpsImgIdxNm;
	private String blthgRpsImgPsn;
	private String mbrdDispPmssYn;
	private String bltnTypCd;
	private String alrmUseYn;
	private String alarmUseYnCtgr;
	private String bltnTrmStrDd;
	private String bltnTrmEndDd;
	private String permBltnYn;
	private int goodNcnt;
	private int dnwNcnt;
	private Date apvDtm;
	private String apprId;
	private String apprOrgCd;
	private String bltnCtt;
	private String puslmnId;
	private String blthgApvNcsyYn;
	private String tndwRsn;
	
	private String usrNm;
	private String usrId;

	private String imgExist;
	
	private String regrId;
	private String regrNm;
	private String regrOrgCd;
	private Timestamp regDtm;
	private Timestamp lstCorcDtM;
	private String lstCorprId;
	private String lstCorprOrgCd;
	private Timestamp abolDtM;
	private String abolmnId;
	private String abolmnOrgCd;
	
	private String puslmnYn;
	private String brdPath;
	
	private List<CMMT230VO> CMMT230VOList;

	private List<String> boardList;
	
	private int blthgMgntCnt;
	private String puslYn;
	private int countFile;
	private int ctgrNo;
	private int cntntsNo;
	private String cntntsTite;
	private String moktiCtt;

	// 대시보드 조회용
	private String usrGrd;
	//
	MultipartFile file;
	
	private List<CMMT300VO> CMMT300FileList;

	boolean    isAdmin;

	private int inqNcnt;
	private int rcmdNcnt;
}
