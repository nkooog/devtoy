package org.crm.cmmt.service.impl;

import org.crm.cmmt.VO.CMMT210VO;
import org.crm.cmmt.VO.CMMT211VO;
import org.crm.cmmt.VO.CMMT230VO;
import org.crm.cmmt.VO.CMMT300VO;
import org.crm.cmmt.service.CMMT300Service;
import org.crm.cmmt.service.dao.CMMTCommDAO;
import org.crm.comm.VO.COMM120VO;
import org.crm.config.spring.config.PropertiesService;
import org.crm.util.es.RestElasticUtil;
import org.crm.util.es.jsonObject.Mokti;
import org.crm.util.es.jsonObject.docObject;
import org.crm.util.file.FileUtils;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.Resource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/***********************************************************************************************
 * Program Name : 공지사항상세  ServiceImpl
 * Creator      : 김보영
 * Create Date  : 2022.01.10
 * Description  : 통합계시글관리
 * Modify Desc  :
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.01.10    김보영           최초생성
 ************************************************************************************************/
@Service("CMMT300Service")
public class CMMT300ServiceImpl implements CMMT300Service {

	@Resource(name="CMMTCommDAO")
	private CMMTCommDAO CMMT300DAO;

	@Resource(name = "RestElasticUtil")
	RestElasticUtil restElastic;

	@Autowired
	private PropertiesService propertiesService;

	@Autowired
	private ObjectMapper objectMapper;

	@Override
	public List<CMMT300VO> CMMT300SEL01(CMMT300VO vo) throws Exception {

		List<CMMT300VO> result = new ArrayList<CMMT300VO>();

		switch(vo.getCtgrUseAthtCd()){
		case "1" : 
			result = CMMT300DAO.selectByList("CMMT300SEL01", vo);
			break;

		case "2" :
			result = CMMT300DAO.selectByList("CMMT300SEL02", vo);
			break;

		case "3" : 
			result = CMMT300DAO.selectByList("CMMT300SEL03", vo);
			break;
		}

		return result;
	}

	@Override
	public CMMT210VO CMMT300SEL05(CMMT210VO vo) throws Exception {
		return (CMMT210VO) CMMT300DAO.selectByOne("CMMT300SEL05", vo);
	}
	
	@Override
	public List<CMMT300VO> CMMT300SEL06(CMMT210VO vo) throws Exception {
		List<CMMT300VO> fileList =  CMMT300DAO.selectByList("CMMT300SEL06", vo);
		for (CMMT300VO fileVO : fileList) {
			Path path = Paths.get(fileVO.getApndFilePsn());
			long bytes = Files.size(path);
			fileVO.setApndFileSize(bytes);

		}
		return fileList;
	}

	@Override
	public CMMT210VO CMMT300INS01(CMMT210VO vo) throws Exception{
		String uploadPath     = this.propertiesService.getString("CMMT");
		String repImgPath     = this.propertiesService.getString("CMMT_IMG");
		String cntsPath     = this.propertiesService.getString("CMMT_CNTS");
//		ComnFun cf = new ComnFun();

		CMMT210VO jsonVo = new CMMT210VO();
		jsonVo.setTenantId(vo.getTenantId());
		jsonVo.setRegrId(vo.getRegrId());
		jsonVo.setRegrOrgCd(vo.getRegrOrgCd());
		String jsondata = this.objectMapper.writeValueAsString(jsonVo);
		List<COMM120VO> comm120List = new ArrayList<COMM120VO>();
		
		//1.컨텐츠 저장
		//1.1 파일 저장 및 데이터 생성
		if(vo.getFile() !=null){
			comm120List = FileUtils.uploadPreJob(repImgPath, jsondata, vo.getFile());
			for(COMM120VO commVo :comm120List){
				vo.setBlthgRpsImg(commVo.getApndFileNm());
				vo.setBlthgRpsImgIdxNm(commVo.getApndFileIdxNm());
				vo.setBlthgRpsImgPsn(commVo.getApndFilePsn());
			}
		}
		//승인 여부
		if(vo.getBlthgApvNcsyYn().equals("N")){
			if(vo.getBlthgStCd().equals(kldstCd.approvalRequestNew.value)){
				vo.setBlthgStCd(kldstCd.approvedNew.value);
			}else if(vo.getBlthgStCd().equals(kldstCd.approvalRequestChange.value)){
				vo.setBlthgStCd(kldstCd.approveChange.value);
			}
			vo.setApprId(vo.getRegrId());
			vo.setApprOrgCd(vo.getRegrOrgCd());
		}

		/* 미리보기 이미지 삭제 로직
		vo.getImgExist().equals("Y") && vo.setBlthgRpsImgIdxNm-=null ? 기존파일 삭제 X
		else 기존파일 삭제 
		* */
		
		//1.2컨텐츠 데이터 저장
		CMMT210VO resultvo = (CMMT210VO) CMMT300DAO.selectByOne("CMMT300INS01", vo);

		if (resultvo.getTenantId() != null || resultvo.getCtgrMgntNo() != 0 || resultvo.getBlthgMgntNo() != 0) {
			//2.컨텐츠 목차및 내용
			if(vo.getCMMT230VOList() != null){
				int idx =1;
				for(CMMT230VO CMMT230VO : vo.getCMMT230VOList()){
					//2.1 컨텐츠 목차및 내용 파일 저장
					if(CMMT230VO.getCMMT211VOList() != null){
						int imgIdx =0;
						for(CMMT211VO CMMT211VO :CMMT230VO.getCMMT211VOList()){
							if(CMMT211VO.getImgfile() != null){
								/* 내용 = delete insert 라면
								내용 기존 이미지 삭제 선행 해야 할듯
								1.
								* */
								comm120List = FileUtils.uploadPreJob(cntsPath, jsondata, CMMT211VO.getImgfile());
								for(COMM120VO commVo :comm120List){
									CMMT211VO.setCntntsImg(commVo.getApndFileNm());
									CMMT211VO.setCntntsImgIdxNm(commVo.getApndFileIdxNm());
									CMMT211VO.setCntntsImgPsn(commVo.getApndFilePsn());
								}
							}
								CMMT211VO.setTenantId(resultvo.getTenantId());
								CMMT211VO.setCtgrNo(resultvo.getCtgrNo());
								CMMT211VO.setCntntsNo(resultvo.getCntntsNo());
								CMMT211VO.setMoktiNo(CMMT230VO.getMoktiNo());
								CMMT211VO.setImgSeq(imgIdx++);
								CMMT211VO.setRegDtm(resultvo.getRegDtm());
								CMMT211VO.setRegrId(resultvo.getRegrId());
								CMMT211VO.setRegrOrgCd(resultvo.getRegrOrgCd());

							int fileresult = CMMT300DAO.sqlInsert("CMMT300INS04", CMMT211VO);
							if(fileresult <= 0 ){
								throw new RuntimeException();// 롤백
							}
						}
					}
					//2.2 컨텐츠 목차및 내용 저장
					CMMT230VO.setTenantId(resultvo.getTenantId());
					CMMT230VO.setCtgrMgntNo(resultvo.getCtgrMgntNo()); 
					CMMT230VO.setBlthgMgntNo(resultvo.getBlthgMgntNo());
					CMMT230VO.setMoktiNo(idx++);
					CMMT230VO.setRegrId(resultvo.getRegrId());
					CMMT230VO.setRegrOrgCd(resultvo.getRegrOrgCd());
					int result = CMMT300DAO.sqlInsert("CMMT300INS03", CMMT230VO);

					if(result <= 0 ){
						throw new RuntimeException();// 롤백
					}
				}
			}
			//3.컨텐츠 첨부 파일 저장
			if(vo.getCMMT300FileList() != null){
				List<MultipartFile> files =new ArrayList<>();
				for(CMMT300VO CMMT300VO :  vo.getCMMT300FileList()){
					if(CMMT300VO.getFile() != null){
						files.add(CMMT300VO.getFile());
					}
				}
				if(files.size()>0){
					comm120List =FileUtils.uploadPreJob(uploadPath,jsondata,files);
					for(int i=0; i<comm120List.size(); i++){
						vo.getCMMT300FileList().get(i).setApndFileSeq(comm120List.get(i).getApndFileSeq());
						vo.getCMMT300FileList().get(i).setApndFileNm(comm120List.get(i).getApndFileNm());
						vo.getCMMT300FileList().get(i).setApndFileIdxNm(comm120List.get(i).getApndFileIdxNm());
						vo.getCMMT300FileList().get(i).setApndFilePsn(comm120List.get(i).getApndFilePsn());
						vo.getCMMT300FileList().get(i).setTenantId(resultvo.getTenantId());
						vo.getCMMT300FileList().get(i).setCtgrMgntNo(resultvo.getCtgrMgntNo());
						vo.getCMMT300FileList().get(i).setBlthgMgntNo(resultvo.getBlthgMgntNo());
						vo.getCMMT300FileList().get(i).setRegDtm(resultvo.getRegDtm());
						vo.getCMMT300FileList().get(i).setRegrId(resultvo.getRegrId());
						vo.getCMMT300FileList().get(i).setRegrOrgCd(resultvo.getRegrOrgCd());
					}
				}
				//컨텐츠 첨부 파일 DB 저장
				int result = CMMT300DAO.sqlInsert("CMMT300INS02", vo.getCMMT300FileList());

				if(result <= 0 ){
					throw new RuntimeException();// 롤백
				}
			}
			
			//kw---20240531 : 엘라스틱 넣기 전에 해당 인덱스가 있는지 확인 후 없으면 인덱스 넣기
			boolean elGetInfo =restElastic.GetIndexInfo(jsonVo.getTenantId(), "CMMT");
			if(elGetInfo == false) {
				restElastic.CreateIndex(jsonVo.getTenantId(), "CMMT");
			}
			
//			if(vo.getBlthgApvNcsyYn().equals("Y")){		//kw---20230706 : 사용승인이 필요 없을 경우 엘라스틱에 수정 반영이 안되어 해당 조건문 주석 
			docObject doc =settingDocObject(resultvo,vo);
			String elResult =restElastic.insertQuery(resultvo.getTenantId(),"CMMT",
				resultvo.getCtgrMgntNo()+"_"+resultvo.getBlthgMgntNo(),doc);
//			}
			
			return resultvo;
		}else{
			throw new RuntimeException();// 롤백
		}	
	}
	
	@Override
	public CMMT210VO CMMT300UPT01(CMMT210VO vo) throws Exception {
		String uploadPath     = this.propertiesService.getString("CMMT");
		String repImgPath     = this.propertiesService.getString("CMMT_IMG");
		String cntsPath     = this.propertiesService.getString("CMMT_CNTS");
		CMMT210VO jsonVo = new CMMT210VO();
		jsonVo.setTenantId(vo.getTenantId());
		jsonVo.setRegrId(vo.getRegrId());
		jsonVo.setRegrOrgCd(vo.getRegrOrgCd());
		String jsondata = new ObjectMapper().writeValueAsString(jsonVo);
		List<COMM120VO> comm120List;
		
		
		//1.컨텐츠 저장
		//1.1 파일 저장 및 데이터 생성
		if(vo.getFile() !=null){
			comm120List = FileUtils.uploadPreJob(repImgPath, jsondata, vo.getFile());
			for(COMM120VO commVo :comm120List){
				vo.setBlthgRpsImg(commVo.getApndFileNm());
				vo.setBlthgRpsImgIdxNm(commVo.getApndFileIdxNm());
				vo.setBlthgRpsImgPsn(commVo.getApndFilePsn());
			}
		}

		/* 미리보기 이미지 삭제 로직
		vo.getImgExist().equals("Y") && vo.setBlthgRpsImgIdxNm-=null ? 기존파일 삭제 X
		else 기존파일 삭제
		* */

		//승인 여부
		if(vo.getBlthgApvNcsyYn().equals("N")){
			if(vo.getBlthgStCd().equals(kldstCd.approvalRequestNew.value)){
				vo.setBlthgStCd(kldstCd.approvedNew.value);
			}else if(vo.getBlthgStCd().equals(kldstCd.approvalRequestChange.value)){
				vo.setBlthgStCd(kldstCd.approveChange.value);
			}
			vo.setApprId(vo.getRegrId());
			vo.setApprOrgCd(vo.getRegrOrgCd());
		}

		vo.setApprId(vo.getRegrId());
		vo.setApprOrgCd(vo.getRegrOrgCd());

		//1.2 컨텐츠 데이터 업데이트
		CMMT210VO resultvo = (CMMT210VO) CMMT300DAO.selectByOne("CMMT300UPT01", vo);
		
		vo.setBlthgRpsImg(resultvo.getBlthgRpsImg());
		vo.setBlthgRpsImgIdxNm(resultvo.getBlthgRpsImgIdxNm());
		vo.setBlthgRpsImgPsn(resultvo.getBlthgRpsImgPsn());

		if (resultvo.getTenantId() != null) {
			//2.컨텐츠 목차및 내용
			if(vo.getCMMT230VOList() != null){
				
				//2.1.1 기존 컨텐츠 내용 이미지 파일 정보 검색
				List<CMMT230VO> CMMT230VOList = CMMT300DAO.selectByList("CMMT300SEL07", vo);
				for (CMMT230VO CMMT230VO : CMMT230VOList) {
					//2.1.2 기존 컨텐츠 내용 이미지 파일 삭제
					if (CMMT230VO.getBltnCttImg() != null) {
						FileUtils.removeFile(CMMT230VO.getBltnCttImgPsn(), CMMT230VO.getBltnCttImgIdxNm());
					}
					
					//2.1.3 기존 컨텐츠 목차 및 내용 삭제
					CMMT300DAO.sqlDelete("CMMT300DEL04", CMMT230VO);
				}
				
				//2.2 새 내용 저장
				int idx =1;
				for(CMMT230VO CMMT230VO : vo.getCMMT230VOList()){
					//2.1 컨텐츠 목차및 내용 파일 저장
					if(CMMT230VO.getCMMT211VOList() != null){
						int imgIdx =0;
						for(CMMT211VO CMMT211VO :CMMT230VO.getCMMT211VOList()){
							if(CMMT211VO.getImgfile() != null){
								comm120List = FileUtils.uploadPreJob(cntsPath, jsondata, CMMT211VO.getImgfile());
								for(COMM120VO commVo :comm120List){
									CMMT211VO.setTenantId(resultvo.getTenantId());
									CMMT211VO.setCtgrNo(resultvo.getCtgrNo());
									CMMT211VO.setCntntsNo(resultvo.getCntntsNo());
									CMMT211VO.setMoktiNo(CMMT230VO.getMoktiNo());
									CMMT211VO.setImgSeq(imgIdx++);
									CMMT211VO.setCntntsImg(commVo.getApndFileNm());
									CMMT211VO.setCntntsImgIdxNm(commVo.getApndFileIdxNm());
									CMMT211VO.setCntntsImgPsn(commVo.getApndFilePsn());
									CMMT211VO.setRegDtm(resultvo.getRegDtm());
									CMMT211VO.setRegrId(resultvo.getRegrId());
									CMMT211VO.setRegrOrgCd(resultvo.getRegrOrgCd());
								}
							}
							int fileresult = CMMT300DAO.sqlInsert("CMMT300INS04", CMMT211VO);
							if(fileresult <= 0 ){
								throw new RuntimeException();// 롤백
							}
						}
					}

					//2.2 컨텐츠 목차및 내용 저장
					CMMT230VO.setTenantId(resultvo.getTenantId());
					CMMT230VO.setCtgrMgntNo(resultvo.getCtgrMgntNo());
					CMMT230VO.setBlthgMgntNo(resultvo.getBlthgMgntNo());
					CMMT230VO.setMoktiNo(idx++);
					CMMT230VO.setRegrId(resultvo.getRegrId());
					CMMT230VO.setRegrOrgCd(resultvo.getRegrOrgCd());
					int result = CMMT300DAO.sqlInsert("CMMT300INS03", CMMT230VO);

					if(result <= 0 ){
						throw new RuntimeException();// 롤백
					}
				}
				
			}
		//3.컨텐츠 첨부 파일 저장
		//3.1 기존 파일 삭제
		List<CMMT300VO> deleteFileList = CMMT300DAO.selectByList("CMMT300SEL06", vo);
		for(CMMT300VO deletefile: deleteFileList){
			//3.1.1 기존 파일 삭제
			if(deletefile.getApndFileNm() != null){
				FileUtils.removeFile(deletefile.getApndFilePsn(), deletefile.getApndFileIdxNm());
			}
			//3.1.1 기존 파일 데이터 삭제
			CMMT300DAO.sqlDelete("CMMT300DEL05", deletefile);
		}
		//3.2 새파일 저장
		if(vo.getCMMT300FileList() != null){
			List<MultipartFile> files =new ArrayList<>();
			for(CMMT300VO CMMT300VO :  vo.getCMMT300FileList()){
				if(CMMT300VO.getFile() != null){
					files.add(CMMT300VO.getFile());
				}
			}
			if(files.size()>0){
				comm120List =FileUtils.uploadPreJob(uploadPath,jsondata,files);
				for(int i=0; i<comm120List.size(); i++){
					vo.getCMMT300FileList().get(i).setApndFileSeq(comm120List.get(i).getApndFileSeq());
					vo.getCMMT300FileList().get(i).setApndFileNm(comm120List.get(i).getApndFileNm());
					vo.getCMMT300FileList().get(i).setApndFileIdxNm(comm120List.get(i).getApndFileIdxNm());
					vo.getCMMT300FileList().get(i).setApndFilePsn(comm120List.get(i).getApndFilePsn());
					vo.getCMMT300FileList().get(i).setTenantId(resultvo.getTenantId());
					vo.getCMMT300FileList().get(i).setCtgrMgntNo(resultvo.getCtgrMgntNo());
					vo.getCMMT300FileList().get(i).setBlthgMgntNo(resultvo.getBlthgMgntNo());
					vo.getCMMT300FileList().get(i).setRegDtm(resultvo.getRegDtm());
					vo.getCMMT300FileList().get(i).setRegrId(resultvo.getRegrId());
					vo.getCMMT300FileList().get(i).setRegrOrgCd(resultvo.getRegrOrgCd());
				}
			}
			//컨텐츠 첨부 파일 DB 저장
			int result = CMMT300DAO.sqlInsert("CMMT300INS02", vo.getCMMT300FileList());

			if(result <= 0 ){
				throw new RuntimeException();// 롤백
			}
		}	
		
		//승인 여부
//		if(vo.getBlthgApvNcsyYn().equals("Y")){		//kw---20230706 : 사용승인이 필요 없을 경우 엘라스틱에 수정 반영이 안되어 해당 조건문 주석 처리
			//5. el 수정
			String elResult =restElastic.DeleteQuery(resultvo.getTenantId(),"CMMT",
					resultvo.getCtgrMgntNo()+"_"+resultvo.getBlthgMgntNo());

			if(elResult.contains("Delete Complete")){
				docObject doc =settingDocObject(resultvo,vo);
				elResult =restElastic.insertQuery(resultvo.getTenantId(),"CMMT",
						resultvo.getCtgrMgntNo()+"_"+resultvo.getBlthgMgntNo(),doc);
			}else{
				throw new RuntimeException();// 롤백
			}
//		}

	} else {
		throw new RuntimeException();// 롤백
	}
	return resultvo;
			
}
	
	@Override
	public int CMMT300UPT02(CMMT210VO vo) throws Exception {
		//1 게시글 테이블 상태 변경
		int result = CMMT300DAO.sqlUpdate("CMMT300UPT02", vo);
		if(result>0){
			DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			docObject doc = new docObject();

			doc.setStCd(vo.getBlthgStCd());
			doc.setLstCorcDtm(dateFormat.format(new Date()));//최종수정일시
			doc.setLstCorprId(vo.getRegrId());
			doc.setLstCorpOrgCd(vo.getRegrOrgCd());
			
			//kw---20230705 : 커뮤니티 경우에는 엘라스틱에 99라고 저장
			if(vo.getCtgrTypCd().equals("2")) {
				doc.setStCd("99");
			} else {
				doc.setStCd(vo.getBlthgStCd());
			}

			String elResult = restElastic.UpdateQuery(vo.getTenantId(),"CMMT200",
					vo.getCtgrMgntNo()+"_"+vo.getBlthgMgntNo(),doc);
		}else{
			throw new RuntimeException();
		}
		return result;
	}

	private docObject settingDocObject(CMMT210VO resultvo, CMMT210VO vo) {
		docObject doc = new docObject();
		doc.setTenantId(resultvo.getTenantId());
		doc.setCtgrMgntNo(resultvo.getCtgrMgntNo());
		doc.setBlthgMgntNo(resultvo.getBlthgMgntNo());
		doc.setTitle(vo.getBlthgTite());
		
		
//		doc.setStCd(vo.getBlthgStCd());
		//kw---20230705 : 커뮤니티 글일 경우 상태는 '99'
		if(vo.getCtgrTypCd().equals("2")) {
			doc.setStCd("99");
		} else {
			doc.setStCd(vo.getBlthgStCd());
		}
		
		
		doc.setTypCd(vo.getBltnTypCd());
		doc.setRpsImgIdxNm(vo.getBlthgRpsImgIdxNm());
		doc.setRpsImgPsn(vo.getBlthgRpsImgPsn());
		doc.setBltnStrDd(vo.getBltnTrmStrDd());
		doc.setBltnEndDd(vo.getBltnTrmEndDd());
		doc.setPermUseYn(vo.getPermBltnYn());
		doc.setApvDtm(resultvo.getRegDtm().toString());
		doc.setApprId(vo.getApprId());
		doc.setApprOrgCd(vo.getApprOrgCd());
		doc.setRegDtm(resultvo.getRegDtm().toString());
		doc.setRegrNm(vo.getRegrNm());
		doc.setRegrId(resultvo.getRegrId());
		doc.setRegrOrgCd(resultvo.getRegrOrgCd());
		doc.setLstCorcDtm(resultvo.getRegDtm().toString());
		doc.setLstCorprId(resultvo.getRegrId());
		doc.setLstCorpOrgCd(resultvo.getRegrOrgCd());
		if(vo.getCMMT300FileList() !=null){
			doc.setAppendFileCount(vo.getCMMT300FileList().size());
		}else{
			doc.setAppendFileCount(0);
		}
//		    doc.setAssocContent();
		List<Mokti> moktiList = new ArrayList<>();
		for(CMMT230VO CMMT230VO : vo.getCMMT230VOList()){
			Mokti mokti = new Mokti();
			mokti.setMoktiNo(String.valueOf(CMMT230VO.getMoktiNo()));
			mokti.setHgrkMoktiNo(String.valueOf(CMMT230VO.getHgrkMoktiNo()));
			mokti.setMoktiPrsLvl(String.valueOf(CMMT230VO.getMoktiPrsLvl()));
			mokti.setMoktiTite(CMMT230VO.getMoktiTite());
			mokti.setMoktiCtt(CMMT230VO.getBltnCtt());
			mokti.setMoktiCttTxt(CMMT230VO.getBltnCttTxt());
			moktiList.add(mokti);
		}
		
		doc.setMokti(moktiList);
		return  doc;
	}
	
	enum kldstCd {
		writing("10"),
		approvalRequestNew("11"),
		approvedNew("12"),
		returnNew ("13"),
		approvalRequestChange ("14"),
		approveChange ("15"),
		returnChange ("16"),
		deleteAdmin ("89"),
		expiration ("90");

		private final String value;

		kldstCd(String value) { this.value = value; }
		public String getValue() { return value; }

	}
}
