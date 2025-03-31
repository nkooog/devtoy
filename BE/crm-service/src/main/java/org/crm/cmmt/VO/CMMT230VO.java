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
* Description  : 공지사항상세 
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.01.10    김보영           최초생성
************************************************************************************************/
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@SuperBuilder
public class CMMT230VO extends CmmnSrchVO {
	
	private String tenantId;
	private int ctgrMgntNo;
	private int blthgMgntNo;
	private int moktiNo;
	
	private String moktiTite;
	private int moktiPrsLvl;
	private int hgrkMoktiNo;
	
	private String bltnCtt;
	private String bltnCttTxt;
	
	private MultipartFile file;
	private String bltnCttImg;
	private String bltnCttImgIdxNm;
	private String bltnCttImgPsn;

	private int blthgReplyNo;
	private int prsReplyLvl;
	private int blthgReplyHgrkNo;
	private String replyCtt;
	private int goodNcnt;
	private int dnwNcnt;
	
	private String blthgReplyAsesmnId;
	private String asesmnOrgCd;
	private String asesCd;
	private Date asesDtm;
	
	private String usrNm;
	private int lvl2Cnt;
	
	private String puslmnId;
	private String puslDdSi;
	
	private String regrId;
	private String regrOrgCd;
	private Timestamp lstCorcDtM;
	private String lstCorprId;
	private String lstCorprOrgCd;
	private Timestamp abolDtM;
	private String abolmnId;
	private String abolmnOrgCd;

	private Timestamp rcmdDtm;

	private List<CMMT211VO> CMMT211VOList;

}
