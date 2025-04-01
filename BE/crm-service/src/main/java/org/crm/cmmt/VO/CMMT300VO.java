package org.crm.cmmt.VO;

import lombok.*;
import org.springframework.web.multipart.MultipartFile;

import java.sql.Timestamp;

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
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CMMT300VO {
	
	private String tenantId;
	private String ctgrUseAthtCd;	
	private int ctgrMgntNo;
	private int blthgMgntNo;
	private String athtCd;
	private int athtSeq;

	private String orgCd;
	private String orgNm;
	private String prsLvlCd;
	private String hgrkOrgCd;

	private String comCd;
	private String comCdNm;
	private int srtSeq;
	private String orgPath;
	
	private String usrId;
	private String usrNm;

	private int apndFileSeq;
	private String apndFileNm;
	private String apndFileIdxNm;
	private String apndFilePsn;
	private Long apndFileSize;
	
	private String regrId;
	private String regrOrgCd;
	private Timestamp regDtm;
	private Timestamp lstCorcDtM;
	private String lstCorprId;
	private String lstCorprOrgCd;
	private Timestamp abolDtM;
	private String abolmnId;
	private String abolmnOrgCd;
	
	MultipartFile file;

}
