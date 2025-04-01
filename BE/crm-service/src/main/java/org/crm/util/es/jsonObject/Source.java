package org.crm.util.es.jsonObject;

import lombok.*;

import java.util.ArrayList;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Source {
	private String tenantId;
	private String ctgrMgntNo;
	private String blthgMgntNo;
	private String title;
	private String stCd;
	private String typCd;

	private String rpsImgIdxNm;
	private String rpsImgPsn;
	private String bltnStrDd;
	private String bltnEndDd;
	private String permUseYn;

	private String apvDtm;
	private String apprId;
	private String apprOrgCd;
	private String regDtm;
	private String regrId;
	private String regrNm;
	private String regrOrgCd;
	private String lstCorcDtm;
	private String lstCorprId;
	private String lstCorpOrgCd;

	private String appendFileCount;
	private String[] assocKeyword;
	private String[] assocContent;

	private ArrayList<Mokti> mokti;

}
