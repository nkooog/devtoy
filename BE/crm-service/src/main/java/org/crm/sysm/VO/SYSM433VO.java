package org.crm.sysm.VO;

import org.crm.cmmn.VO.CmmnSrchVO;
import org.springframework.web.multipart.MultipartFile;

/***********************************************************************************************
* Program Name : SMS탬플릿관리VO
* Creator      : 강동우
* Create Date  : 2022.04.28
* Description  : SMS탬플릿관리
* Modify Desc  : 
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.04.28     강동우           최초생성
************************************************************************************************/

public class SYSM433VO extends CmmnSrchVO{

	// 테넌트 기준 정보 값
	private String bascVluDvCd;			// 테넌트 기준 정보 값
	
	// T_SMS_템플릿
	private int tmplMgntNo;				// 템플릿 관리 번호
	private String tmplDvCd;			// 템플릿 구분 코드
	private String tmplNm;				// 템플릿 명
	private String tmplCtt;				// 템플릿 내용
	private String useDvCd;				// 사용 구분 코드
	
	//T_SMS_템플릿_항목
	private int tmplItemSeq;			// 템플릿 항목 순번
	private String itemDvCd;			// 항묵 구분 코드
	private String itemDvMgntItemCd;	// 항목 구분 관리 항목 코드
	private String itemCd;				// 항목 코드
	private String itemCdDataNm;		// 항목 코드 데이터명
	private String dataSetId;			// 데이터세트 ID
	private String dataSetItemGrpId;	// 데이터 세트 항목 그룹 ID
	private String dataSetItemId;		// 데이터 세트 항목 ID
	private int colStrPsnVlu;			// 컬럼 시작 위치 값
	private int colLen;					// 컬럼 길이
	private int msgLen;					// 메세지 길이
	private int	lineGap;				// 줄간격
	private String url;					// url
	
	
	//SMS발송 템플릿 관리 추가
	private String tmplDvCdNm;          //발송서식코드명
	private String mlingCd;             //언어코드
	
	// 고객정보
	private int custNo;
	private String custIdPathCd;
	private String custId;
	private String custNm;
	private String mbleTelNo;
	private String owhmTelNo;
	private String mbleNo;
	private String zipno;
	private String owhmBaseAddr;
	private String owhmDtlsAddr;
	private String emlAddr;
	private String wkplZipno;
	private String wkplBaseAddr;
	private String wkplDtlsAddr;
	private String custSpclmttr;
	private String etcTelNo;
	private String wkplTelNoMemo;
	private String owhmTelNoMemo;
	private String etcTelNoMemo;
	private String wkplTelUseYn;
	private String owhmTelUseYn;
	private String etcTelUseYn;
	private String rpsTelNo;
	private String smsSndgNo;							//SMS 발송 번호 : 테넌트 기본정보(30)
	private String cldDv;								//클라우드 구분 : 테넌트 기본정보(32)	
	
	// 통합접촉이력
	private String iobDvCd;								//인아웃구분코드
	private String cntcChnlCd;							//접촉채널코드
	private String cntcPathMgntItemCd;					//접촉경로관리항목코드
	private String cntcPathCd;							//접촉경로코드
	private String cntcPathNm;
	private String cntcTelNo;						
	private String cntcCustId;							//접촉고객	ID		
	private String cntcCustIdPathCd;					//접촉고객ID경로코드
	private String cntcChnlCustId;						//접촉채널고객ID
	private String cntcCustNm;							//접촉고객명
	private String cntcmnDvCd;							//접촉자구분코드
	private String cntcTelDvCd;							//접촉전화구분코드
	private String cntcDt;
	private String cntcInclHourptsec;
	private String cntcCnntHourptsec;
	private String cntcEndHourptsec;
	private String cntcCpltHourptsec;
	private String chnlAcpnNo;
	private String inclRpsTelNo;
	private String inclIvrSvcCd;
	private String inclIvrSvcNm;
	private String cnslrBlngOrgCd;
	private String jubfCnslrBlngOrgCd;
	private String phrecStCd;
	private String phrecKey;
	private String cntcRsltCd;
	private String cntcRslt_mgntItemCd;
	private String cntcRsltDtlsCd;
	private String lstRcvinCnslrId;
	private String lstRcvinCnslrOrgCd;
	
	// SMS발송대상정보
	private String regDt;
	private String schdNo;
	private String sndgRsvSqnc;
	private String sndgTgtCustSeq;
	private String custRcgnPathCd;
	private String custRcgnCd;
	private String gndrCd;
	private String btdt;
	private String agelrgCd;
	private String sndgCtt;
	private String sndgRsvDt;
	private String sndgRsvTm;
	private String sndgCpltTm;
	private String smsStCd;
	private String smsStNm;
	private String smsRsltCd;
	private String smsRsltNm;
	
	private String custNmSrchkey1;
	private String custNmSrchkey2;
	private String recvrTelCntyCd;
	private String recvrTelNo;
	private String recvrTelNoSrchkey;
	private String dpchNo;

	//기타연락처
	int custItemGrpNo; 
	int custItemNo;
	int rowNo;
	String custItemDataVlu;
	String memo;

	// 공통
	private String Id;
	private String Name;
	private String common1;
	private String common2;
	private String common3;
	private String common4;
	private String common5;
	private String common6;
	private String tenantId;			// 테넌트 ID
	private String mgntItemCd;			// 관리 항목 코드		
	private String regDtm;				// 등록_일시
	private String regrId;				// 등록자_ID
	private String regrOrgCd;			// 등록자_조직_코드
	private String lstCorcDtm;			// 최종_수정_일시
	private String lstCorprId;			// 최종_수정자_ID
	private String lstCorprOrgCd;		// 최종_수정자_조직_코드
	private String abolDtm;				// 폐기_일시
	private String abolmnId;			// 폐기자_ID
	private String abolmnOrgCd;			// 폐기자_조직_코드
	private int smsSndgRsltKey;		// SMS발송결과키 : api sms발송 시퀀스
	private String encryptYn;		//개인정보 암호화 여부
	
	//kw---20230410 이미지 첨부 파일
	
	private int file_id;
	private String orign_file_nm;
	private String upload_file_nm;
	private String file_path;
	private Long file_size;
	private int[] tmplFiles;
	
	private String[] fileNameOrg;			// 원본 이미지 이름
	private String[] fileNameSave;			//저장  이미지 이름
	private String[] filePath;			// 이미지 파일 경로
	private String[] phoneArr;
	private String apndFileNm1;
	private String apndFileIdx_nm1;
	private String apndFilePsn1;
	private String apndFileNm2;
	private String apndFileIdx_nm2;
	private String apndFilePsn2;
	private String apndFileNm3;
	private String apndFileIdx_nm3;
	private String apndFilePsn3;
	
	private String tenantPrefix;
	private String sysPrefix;
	private String phone;
	private String callback;
	private String msg;
	private String agentId;
	private String customerId;
	
	MultipartFile file;
	
	public int[] getTmplFiles() {
		return tmplFiles;
	}

	public void setTmplFiles(int[] tmplFiles) {
		this.tmplFiles = tmplFiles;
	}

	public int getFile_id() {
		return file_id;
	}

	public void setFile_id(int file_id) {
		this.file_id = file_id;
	}

	public String getOrign_file_nm() {
		return orign_file_nm;
	}

	public void setOrign_file_nm(String orign_file_nm) {
		this.orign_file_nm = orign_file_nm;
	}

	public String getUpload_file_nm() {
		return upload_file_nm;
	}

	public void setUpload_file_nm(String upload_file_nm) {
		this.upload_file_nm = upload_file_nm;
	}

	public String getFile_path() {
		return file_path;
	}

	public void setFile_path(String file_path) {
		this.file_path = file_path;
	}

	public Long getFile_size() {
		return file_size;
	}

	public void setFile_size(Long file_size) {
		this.file_size = file_size;
	}

	public String[] getPhoneArr() {
		return phoneArr;
	}

	public void setPhoneArr(String[] phoneArr) {
		this.phoneArr = phoneArr;
	}

	public String getApndFileNm1() {
		return apndFileNm1;
	}

	public void setApndFileNm1(String apndFileNm1) {
		this.apndFileNm1 = apndFileNm1;
	}

	public String getApndFileIdx_nm1() {
		return apndFileIdx_nm1;
	}

	public void setApndFileIdx_nm1(String apndFileIdx_nm1) {
		this.apndFileIdx_nm1 = apndFileIdx_nm1;
	}

	public String getApndFilePsn1() {
		return apndFilePsn1;
	}

	public void setApndFilePsn1(String apndFilePsn1) {
		this.apndFilePsn1 = apndFilePsn1;
	}

	public String getApndFileNm2() {
		return apndFileNm2;
	}

	public void setApndFileNm2(String apndFileNm2) {
		this.apndFileNm2 = apndFileNm2;
	}

	public String getApndFileIdx_nm2() {
		return apndFileIdx_nm2;
	}

	public void setApndFileIdx_nm2(String apndFileIdx_nm2) {
		this.apndFileIdx_nm2 = apndFileIdx_nm2;
	}

	public String getApndFilePsn2() {
		return apndFilePsn2;
	}

	public void setApndFilePsn2(String apndFilePsn2) {
		this.apndFilePsn2 = apndFilePsn2;
	}

	public String getApndFileNm3() {
		return apndFileNm3;
	}

	public void setApndFileNm3(String apndFileNm3) {
		this.apndFileNm3 = apndFileNm3;
	}

	public String getApndFileIdx_nm3() {
		return apndFileIdx_nm3;
	}

	public void setApndFileIdx_nm3(String apndFileIdx_nm3) {
		this.apndFileIdx_nm3 = apndFileIdx_nm3;
	}

	public String getApndFilePsn3() {
		return apndFilePsn3;
	}

	public void setApndFilePsn3(String apndFilePsn3) {
		this.apndFilePsn3 = apndFilePsn3;
	}

	public String[] getFileNameOrg() {
		return fileNameOrg;
	}

	public void setFileNameOrg(String[] fileNameOrg) {
		this.fileNameOrg = fileNameOrg;
	}

	public String[] getFileNameSave() {
		return fileNameSave;
	}

	public void setFileNameSave(String[] fileNameSave) {
		this.fileNameSave = fileNameSave;
	}

	public String getTenantPrefix() {
		return tenantPrefix;
	}

	public void setTenantPrefix(String tenantPrefix) {
		this.tenantPrefix = tenantPrefix;
	}

	public String getSysPrefix() {
		return sysPrefix;
	}

	public void setSysPrefix(String sysPrefix) {
		this.sysPrefix = sysPrefix;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public String getCallback() {
		return callback;
	}

	public void setCallback(String callback) {
		this.callback = callback;
	}

	public String getMsg() {
		return msg;
	}

	public void setMsg(String msg) {
		this.msg = msg;
	}

	public String getAgentId() {
		return agentId;
	}

	public void setAgentId(String agentId) {
		this.agentId = agentId;
	}

	public String getCustomerId() {
		return customerId;
	}

	public void setCustomerId(String customerId) {
		this.customerId = customerId;
	}

	public String[] getFilePath() {
		return filePath;
	}

	public void setFilePath(String[] filePath) {
		this.filePath = filePath;
	}

	public int getTmplMgntNo() {
		return tmplMgntNo;
	}

	public void setTmplMgntNo(int tmplMgntNo) {
		this.tmplMgntNo = tmplMgntNo;
	}

	public String getTmplDvCd() {
		return tmplDvCd;
	}

	public void setTmplDvCd(String tmplDvCd) {
		this.tmplDvCd = tmplDvCd;
	}

	public String getTmplNm() {
		return tmplNm;
	}

	public void setTmplNm(String tmplNm) {
		this.tmplNm = tmplNm;
	}

	public String getTmplCtt() {
		return tmplCtt;
	}

	public void setTmplCtt(String tmplCtt) {
		this.tmplCtt = tmplCtt;
	}

	public String getUseDvCd() {
		return useDvCd;
	}

	public void setUseDvCd(String useDvCd) {
		this.useDvCd = useDvCd;
	}

	public int getTmplItemSeq() {
		return tmplItemSeq;
	}

	public void setTmplItemSeq(int tmplItemSeq) {
		this.tmplItemSeq = tmplItemSeq;
	}

	public String getItemDvCd() {
		return itemDvCd;
	}

	public void setItemDvCd(String itemDvCd) {
		this.itemDvCd = itemDvCd;
	}

	public String getItemDvMgntItemCd() {
		return itemDvMgntItemCd;
	}

	public void setItemDvMgntItemCd(String itemDvMgntItemCd) {
		this.itemDvMgntItemCd = itemDvMgntItemCd;
	}

	public String getItemCd() {
		return itemCd;
	}

	public void setItemCd(String itemCd) {
		this.itemCd = itemCd;
	}

	public String getItemCdDataNm() {
		return itemCdDataNm;
	}

	public void setItemCdDataNm(String itemCdDataNm) {
		this.itemCdDataNm = itemCdDataNm;
	}

	public String getDataSetId() {
		return dataSetId;
	}

	public void setDataSetId(String dataSetId) {
		this.dataSetId = dataSetId;
	}

	public String getDataSetItemGrpId() {
		return dataSetItemGrpId;
	}

	public void setDataSetItemGrpId(String dataSetItemGrpId) {
		this.dataSetItemGrpId = dataSetItemGrpId;
	}

	public String getDataSetItemId() {
		return dataSetItemId;
	}

	public void setDataSetItemId(String dataSetItemId) {
		this.dataSetItemId = dataSetItemId;
	}

	public int getColStrPsnVlu() {
		return colStrPsnVlu;
	}

	public void setColStrPsnVlu(int colStrPsnVlu) {
		this.colStrPsnVlu = colStrPsnVlu;
	}

	public int getColLen() {
		return colLen;
	}

	public void setColLen(int colLen) {
		this.colLen = colLen;
	}

	public int getMsgLen() {
		return msgLen;
	}

	public void setMsgLen(int msgLen) {
		this.msgLen = msgLen;
	}

	public int getLineGap() {
		return lineGap;
	}

	public void setLineGap(int lineGap) {
		this.lineGap = lineGap;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public String getTmplDvCdNm() {
		return tmplDvCdNm;
	}

	public void setTmplDvCdNm(String tmplDvCdNm) {
		this.tmplDvCdNm = tmplDvCdNm;
	}

	public String getMlingCd() {
		return mlingCd;
	}

	public void setMlingCd(String mlingCd) {
		this.mlingCd = mlingCd;
	}

	public int getCustNo() {
		return custNo;
	}

	public void setCustNo(int custNo) {
		this.custNo = custNo;
	}

	public String getCustIdPathCd() {
		return custIdPathCd;
	}

	public void setCustIdPathCd(String custIdPathCd) {
		this.custIdPathCd = custIdPathCd;
	}

	public String getCustId() {
		return custId;
	}

	public void setCustId(String custId) {
		this.custId = custId;
	}

	public String getCustNm() {
		return custNm;
	}

	public void setCustNm(String custNm) {
		this.custNm = custNm;
	}

	public String getMbleTelNo() {
		return mbleTelNo;
	}

	public void setMbleTelNo(String mbleTelNo) {
		this.mbleTelNo = mbleTelNo;
	}

	public String getOwhmTelNo() {
		return owhmTelNo;
	}

	public void setOwhmTelNo(String owhmTelNo) {
		this.owhmTelNo = owhmTelNo;
	}

	public String getMbleNo() {
		return mbleNo;
	}

	public void setMbleNo(String mbleNo) {
		this.mbleNo = mbleNo;
	}

	public String getZipno() {
		return zipno;
	}

	public void setZipno(String zipno) {
		this.zipno = zipno;
	}

	public String getOwhmBaseAddr() {
		return owhmBaseAddr;
	}

	public void setOwhmBaseAddr(String owhmBaseAddr) {
		this.owhmBaseAddr = owhmBaseAddr;
	}

	public String getOwhmDtlsAddr() {
		return owhmDtlsAddr;
	}

	public void setOwhmDtlsAddr(String owhmDtlsAddr) {
		this.owhmDtlsAddr = owhmDtlsAddr;
	}

	public String getEmlAddr() {
		return emlAddr;
	}

	public void setEmlAddr(String emlAddr) {
		this.emlAddr = emlAddr;
	}

	public String getWkplZipno() {
		return wkplZipno;
	}

	public void setWkplZipno(String wkplZipno) {
		this.wkplZipno = wkplZipno;
	}

	public String getWkplBaseAddr() {
		return wkplBaseAddr;
	}

	public void setWkplBaseAddr(String wkplBaseAddr) {
		this.wkplBaseAddr = wkplBaseAddr;
	}

	public String getWkplDtlsAddr() {
		return wkplDtlsAddr;
	}

	public void setWkplDtlsAddr(String wkplDtlsAddr) {
		this.wkplDtlsAddr = wkplDtlsAddr;
	}

	public String getCustSpclmttr() {
		return custSpclmttr;
	}

	public void setCustSpclmttr(String custSpclmttr) {
		this.custSpclmttr = custSpclmttr;
	}

	public String getEtcTelNo() {
		return etcTelNo;
	}

	public void setEtcTelNo(String etcTelNo) {
		this.etcTelNo = etcTelNo;
	}

	public String getWkplTelNoMemo() {
		return wkplTelNoMemo;
	}

	public void setWkplTelNoMemo(String wkplTelNoMemo) {
		this.wkplTelNoMemo = wkplTelNoMemo;
	}

	public String getOwhmTelNoMemo() {
		return owhmTelNoMemo;
	}

	public void setOwhmTelNoMemo(String owhmTelNoMemo) {
		this.owhmTelNoMemo = owhmTelNoMemo;
	}

	public String getEtcTelNoMemo() {
		return etcTelNoMemo;
	}

	public void setEtcTelNoMemo(String etcTelNoMemo) {
		this.etcTelNoMemo = etcTelNoMemo;
	}

	public String getWkplTelUseYn() {
		return wkplTelUseYn;
	}

	public void setWkplTelUseYn(String wkplTelUseYn) {
		this.wkplTelUseYn = wkplTelUseYn;
	}

	public String getOwhmTelUseYn() {
		return owhmTelUseYn;
	}

	public void setOwhmTelUseYn(String owhmTelUseYn) {
		this.owhmTelUseYn = owhmTelUseYn;
	}

	public String getEtcTelUseYn() {
		return etcTelUseYn;
	}

	public void setEtcTelUseYn(String etcTelUseYn) {
		this.etcTelUseYn = etcTelUseYn;
	}

	public String getRpsTelNo() {
		return rpsTelNo;
	}

	public void setRpsTelNo(String rpsTelNo) {
		this.rpsTelNo = rpsTelNo;
	}
	public String getSmsSndgNo() {
		return smsSndgNo;
	}

	public void setSmsSndgNo(String smsSndgNo) {
		this.smsSndgNo = smsSndgNo;
	}

	public String getCldDv() {
		return cldDv;
	}

	public void setCldDv(String cldDv) {
		this.cldDv = cldDv;
	}

	public String getIobDvCd() {
		return iobDvCd;
	}

	public void setIobDvCd(String iobDvCd) {
		this.iobDvCd = iobDvCd;
	}

	public String getCntcChnlCd() {
		return cntcChnlCd;
	}

	public void setCntcChnlCd(String cntcChnlCd) {
		this.cntcChnlCd = cntcChnlCd;
	}

	public String getCntcPathMgntItemCd() {
		return cntcPathMgntItemCd;
	}

	public void setCntcPathMgntItemCd(String cntcPathMgntItemCd) {
		this.cntcPathMgntItemCd = cntcPathMgntItemCd;
	}

	public String getCntcPathCd() {
		return cntcPathCd;
	}

	public void setCntcPathCd(String cntcPathCd) {
		this.cntcPathCd = cntcPathCd;
	}

	public String getCntcPathNm() {
		return cntcPathNm;
	}

	public void setCntcPathNm(String cntcPathNm) {
		this.cntcPathNm = cntcPathNm;
	}

	public String getCntcTelNo() {
		return cntcTelNo;
	}

	public void setCntcTelNo(String cntcTelNo) {
		this.cntcTelNo = cntcTelNo;
	}

	public String getCntcCustId() {
		return cntcCustId;
	}

	public void setCntcCustId(String cntcCustId) {
		this.cntcCustId = cntcCustId;
	}

	public String getCntcCustIdPathCd() {
		return cntcCustIdPathCd;
	}

	public void setCntcCustIdPathCd(String cntcCustIdPathCd) {
		this.cntcCustIdPathCd = cntcCustIdPathCd;
	}

	public String getCntcChnlCustId() {
		return cntcChnlCustId;
	}

	public void setCntcChnlCustId(String cntcChnlCustId) {
		this.cntcChnlCustId = cntcChnlCustId;
	}

	public String getCntcCustNm() {
		return cntcCustNm;
	}

	public void setCntcCustNm(String cntcCustNm) {
		this.cntcCustNm = cntcCustNm;
	}

	public String getCntcmnDvCd() {
		return cntcmnDvCd;
	}

	public void setCntcmnDvCd(String cntcmnDvCd) {
		this.cntcmnDvCd = cntcmnDvCd;
	}

	public String getCntcTelDvCd() {
		return cntcTelDvCd;
	}

	public void setCntcTelDvCd(String cntcTelDvCd) {
		this.cntcTelDvCd = cntcTelDvCd;
	}

	public String getCntcDt() {
		return cntcDt;
	}

	public void setCntcDt(String cntcDt) {
		this.cntcDt = cntcDt;
	}

	public String getCntcInclHourptsec() {
		return cntcInclHourptsec;
	}

	public void setCntcInclHourptsec(String cntcInclHourptsec) {
		this.cntcInclHourptsec = cntcInclHourptsec;
	}

	public String getCntcCnntHourptsec() {
		return cntcCnntHourptsec;
	}

	public void setCntcCnntHourptsec(String cntcCnntHourptsec) {
		this.cntcCnntHourptsec = cntcCnntHourptsec;
	}

	public String getCntcEndHourptsec() {
		return cntcEndHourptsec;
	}

	public void setCntcEndHourptsec(String cntcEndHourptsec) {
		this.cntcEndHourptsec = cntcEndHourptsec;
	}

	public String getCntcCpltHourptsec() {
		return cntcCpltHourptsec;
	}

	public void setCntcCpltHourptsec(String cntcCpltHourptsec) {
		this.cntcCpltHourptsec = cntcCpltHourptsec;
	}

	public String getChnlAcpnNo() {
		return chnlAcpnNo;
	}

	public void setChnlAcpnNo(String chnlAcpnNo) {
		this.chnlAcpnNo = chnlAcpnNo;
	}

	public String getInclRpsTelNo() {
		return inclRpsTelNo;
	}

	public void setInclRpsTelNo(String inclRpsTelNo) {
		this.inclRpsTelNo = inclRpsTelNo;
	}

	public String getInclIvrSvcCd() {
		return inclIvrSvcCd;
	}

	public void setInclIvrSvcCd(String inclIvrSvcCd) {
		this.inclIvrSvcCd = inclIvrSvcCd;
	}

	public String getInclIvrSvcNm() {
		return inclIvrSvcNm;
	}

	public void setInclIvrSvcNm(String inclIvrSvcNm) {
		this.inclIvrSvcNm = inclIvrSvcNm;
	}

	public String getCnslrBlngOrgCd() {
		return cnslrBlngOrgCd;
	}

	public void setCnslrBlngOrgCd(String cnslrBlngOrgCd) {
		this.cnslrBlngOrgCd = cnslrBlngOrgCd;
	}

	public String getJubfCnslrBlngOrgCd() {
		return jubfCnslrBlngOrgCd;
	}

	public void setJubfCnslrBlngOrgCd(String jubfCnslrBlngOrgCd) {
		this.jubfCnslrBlngOrgCd = jubfCnslrBlngOrgCd;
	}

	public String getPhrecStCd() {
		return phrecStCd;
	}

	public void setPhrecStCd(String phrecStCd) {
		this.phrecStCd = phrecStCd;
	}

	public String getPhrecKey() {
		return phrecKey;
	}

	public void setPhrecKey(String phrecKey) {
		this.phrecKey = phrecKey;
	}

	public String getCntcRsltCd() {
		return cntcRsltCd;
	}

	public void setCntcRsltCd(String cntcRsltCd) {
		this.cntcRsltCd = cntcRsltCd;
	}

	public String getCntcRslt_mgntItemCd() {
		return cntcRslt_mgntItemCd;
	}

	public void setCntcRslt_mgntItemCd(String cntcRslt_mgntItemCd) {
		this.cntcRslt_mgntItemCd = cntcRslt_mgntItemCd;
	}

	public String getCntcRsltDtlsCd() {
		return cntcRsltDtlsCd;
	}

	public void setCntcRsltDtlsCd(String cntcRsltDtlsCd) {
		this.cntcRsltDtlsCd = cntcRsltDtlsCd;
	}

	public String getLstRcvinCnslrId() {
		return lstRcvinCnslrId;
	}

	public void setLstRcvinCnslrId(String lstRcvinCnslrId) {
		this.lstRcvinCnslrId = lstRcvinCnslrId;
	}

	public String getLstRcvinCnslrOrgCd() {
		return lstRcvinCnslrOrgCd;
	}

	public void setLstRcvinCnslrOrgCd(String lstRcvinCnslrOrgCd) {
		this.lstRcvinCnslrOrgCd = lstRcvinCnslrOrgCd;
	}

	public String getRegDt() {
		return regDt;
	}

	public void setRegDt(String regDt) {
		this.regDt = regDt;
	}

	public String getSchdNo() {
		return schdNo;
	}

	public void setSchdNo(String schdNo) {
		this.schdNo = schdNo;
	}

	public String getSndgRsvSqnc() {
		return sndgRsvSqnc;
	}

	public void setSndgRsvSqnc(String sndgRsvSqnc) {
		this.sndgRsvSqnc = sndgRsvSqnc;
	}

	public String getSndgTgtCustSeq() {
		return sndgTgtCustSeq;
	}

	public void setSndgTgtCustSeq(String sndgTgtCustSeq) {
		this.sndgTgtCustSeq = sndgTgtCustSeq;
	}

	public String getCustRcgnPathCd() {
		return custRcgnPathCd;
	}

	public void setCustRcgnPathCd(String custRcgnPathCd) {
		this.custRcgnPathCd = custRcgnPathCd;
	}

	public String getCustRcgnCd() {
		return custRcgnCd;
	}

	public void setCustRcgnCd(String custRcgnCd) {
		this.custRcgnCd = custRcgnCd;
	}


	public String getGndrCd() {
		return gndrCd;
	}

	public void setGndrCd(String gndrCd) {
		this.gndrCd = gndrCd;
	}

	public String getBtdt() {
		return btdt;
	}

	public void setBtdt(String btdt) {
		this.btdt = btdt;
	}

	public String getAgelrgCd() {
		return agelrgCd;
	}

	public void setAgelrgCd(String agelrgCd) {
		this.agelrgCd = agelrgCd;
	}
	
	public String getSndgCtt() {
		return sndgCtt;
	}

	public void setSndgCtt(String sndgCtt) {
		this.sndgCtt = sndgCtt;
	}

	public String getSndgRsvDt() {
		return sndgRsvDt;
	}

	public void setSndgRsvDt(String sndgRsvDt) {
		this.sndgRsvDt = sndgRsvDt;
	}

	public String getSndgRsvTm() {
		return sndgRsvTm;
	}

	public void setSndgRsvTm(String sndgRsvTm) {
		this.sndgRsvTm = sndgRsvTm;
	}

	public String getSndgCpltTm() {
		return sndgCpltTm;
	}

	public void setSndgCpltTm(String sndgCpltTm) {
		this.sndgCpltTm = sndgCpltTm;
	}

	public String getSmsStCd() {
		return smsStCd;
	}

	public void setSmsStCd(String smsStCd) {
		this.smsStCd = smsStCd;
	}

	public String getSmsStNm() {
		return smsStNm;
	}

	public void setSmsStNm(String smsStNm) {
		this.smsStNm = smsStNm;
	}

	public String getSmsRsltCd() {
		return smsRsltCd;
	}

	public void setSmsRsltCd(String smsRsltCd) {
		this.smsRsltCd = smsRsltCd;
	}

	public String getSmsRsltNm() {
		return smsRsltNm;
	}

	public void setSmsRsltNm(String smsRsltNm) {
		this.smsRsltNm = smsRsltNm;
	}
	
	public String getCustNmSrchkey1() {
		return custNmSrchkey1;
	}

	public void setCustNmSrchkey1(String custNmSrchkey1) {
		this.custNmSrchkey1 = custNmSrchkey1;
	}

	public String getCustNmSrchkey2() {
		return custNmSrchkey2;
	}

	public void setCustNmSrchkey2(String custNmSrchkey2) {
		this.custNmSrchkey2 = custNmSrchkey2;
	}

	public String getRecvrTelCntyCd() {
		return recvrTelCntyCd;
	}

	public void setRecvrTelCntyCd(String recvrTelCntyCd) {
		this.recvrTelCntyCd = recvrTelCntyCd;
	}

	public String getRecvrTelNo() {
		return recvrTelNo;
	}

	public void setRecvrTelNo(String recvrTelNo) {
		this.recvrTelNo = recvrTelNo;
	}

	public String getRecvrTelNoSrchkey() {
		return recvrTelNoSrchkey;
	}

	public void setRecvrTelNoSrchkey(String recvrTelNoSrchkey) {
		this.recvrTelNoSrchkey = recvrTelNoSrchkey;
	}

	public String getDpchNo() {
		return dpchNo;
	}

	public void setDpchNo(String dpchNo) {
		this.dpchNo = dpchNo;
	}

	public int getCustItemGrpNo() {
		return custItemGrpNo;
	}

	public void setCustItemGrpNo(int custItemGrpNo) {
		this.custItemGrpNo = custItemGrpNo;
	}

	public int getCustItemNo() {
		return custItemNo;
	}

	public void setCustItemNo(int custItemNo) {
		this.custItemNo = custItemNo;
	}

	public int getRowNo() {
		return rowNo;
	}

	public void setRowNo(int rowNo) {
		this.rowNo = rowNo;
	}

	public String getCustItemDataVlu() {
		return custItemDataVlu;
	}

	public void setCustItemDataVlu(String custItemDataVlu) {
		this.custItemDataVlu = custItemDataVlu;
	}	
	public String getMemo() {
		return memo;
	}

	public void setMemo(String memo) {
		this.memo = memo;
	}

	public String getId() {
		return Id;
	}

	public void setId(String id) {
		Id = id;
	}

	public String getName() {
		return Name;
	}

	public void setName(String name) {
		Name = name;
	}

	public String getCommon1() {
		return common1;
	}

	public void setCommon1(String common1) {
		this.common1 = common1;
	}

	public String getCommon2() {
		return common2;
	}

	public void setCommon2(String common2) {
		this.common2 = common2;
	}

	public String getCommon3() {
		return common3;
	}

	public void setCommon3(String common3) {
		this.common3 = common3;
	}

	public String getCommon4() {
		return common4;
	}

	public void setCommon4(String common4) {
		this.common4 = common4;
	}

	public String getCommon5() {
		return common5;
	}

	public void setCommon5(String common5) {
		this.common5 = common5;
	}

	public String getCommon6() {
		return common6;
	}

	public void setCommon6(String common6) {
		this.common6 = common6;
	}

	public String getTenantId() {
		return tenantId;
	}

	public void setTenantId(String tenantId) {
		this.tenantId = tenantId;
	}

	public String getMgntItemCd() {
		return mgntItemCd;
	}

	public void setMgntItemCd(String mgntItemCd) {
		this.mgntItemCd = mgntItemCd;
	}

	public String getRegDtm() {
		return regDtm;
	}

	public void setRegDtm(String regDtm) {
		this.regDtm = regDtm;
	}

	public String getRegrId() {
		return regrId;
	}

	public void setRegrId(String regrId) {
		this.regrId = regrId;
	}

	public String getRegrOrgCd() {
		return regrOrgCd;
	}

	public void setRegrOrgCd(String regrOrgCd) {
		this.regrOrgCd = regrOrgCd;
	}

	public String getLstCorcDtm() {
		return lstCorcDtm;
	}

	public void setLstCorcDtm(String lstCorcDtm) {
		this.lstCorcDtm = lstCorcDtm;
	}

	public String getLstCorprId() {
		return lstCorprId;
	}

	public void setLstCorprId(String lstCorprId) {
		this.lstCorprId = lstCorprId;
	}

	public String getLstCorprOrgCd() {
		return lstCorprOrgCd;
	}

	public void setLstCorprOrgCd(String lstCorprOrgCd) {
		this.lstCorprOrgCd = lstCorprOrgCd;
	}

	public String getAbolDtm() {
		return abolDtm;
	}

	public void setAbolDtm(String abolDtm) {
		this.abolDtm = abolDtm;
	}

	public String getAbolmnId() {
		return abolmnId;
	}

	public void setAbolmnId(String abolmnId) {
		this.abolmnId = abolmnId;
	}

	public String getAbolmnOrgCd() {
		return abolmnOrgCd;
	}

	public void setAbolmnOrgCd(String abolmnOrgCd) {
		this.abolmnOrgCd = abolmnOrgCd;
	}

	public int getSmsSndgRsltKey() {
		return smsSndgRsltKey;
	}

	public void setSmsSndgRsltKey(int smsSndgRsltKey) {
		this.smsSndgRsltKey = smsSndgRsltKey;
	}
	public MultipartFile getFile() {
		return file;
	}
	public void setFile(MultipartFile file) {
		this.file = file;
	}
	public String getEncryptYn() {
		return encryptYn;
	}

	public void setEncryptYn(String encryptYn) {
		this.encryptYn = encryptYn;
	}

	public String getBascVluDvCd() {
		return bascVluDvCd;
	}

	public void setBascVluDvCd(String bascVluDvCd) {
		this.bascVluDvCd = bascVluDvCd;
	}
	
}
