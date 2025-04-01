package org.crm.cmmt.service.impl;

import org.crm.cmmt.VO.*;
import org.crm.cmmt.service.CMMT200Service;
import org.crm.cmmt.service.dao.CMMTCommDAO;
import org.crm.util.crypto.AES256Crypt;
import org.crm.util.es.RestElasticUtil;
import org.crm.util.file.FileUtils;
import org.springframework.stereotype.Service;

import jakarta.annotation.Resource;
import java.io.File;
import java.util.ArrayList;
import java.util.List;

/***********************************************************************************************
* Program Name : 통합계시글관리 ServiceImpl
* Creator      : 김보영
* Create Date  : 2022.01.10
* Description  : 통합계시글관리
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.01.10    김보영           최초생성
************************************************************************************************/
@Service("CMMT200Service")
public class CMMT200ServiceImpl implements CMMT200Service {
	
	@Resource(name="CMMTCommDAO")
	private CMMTCommDAO CMMT200DAO;

	@Resource(name = "RestElasticUtil")
	RestElasticUtil restElastic;
	
	@Override
	public List<CMMT201VO> CMMT200SEL01(CMMT200VO vo) throws Exception {
		List<CMMT201VO> volist = CMMT200DAO.selectByList("CMMT200SEL01", vo);

		List<Integer> list = new ArrayList<>();
		for(CMMT201VO temp :volist){
			 list.add(temp.getCtgrNo());
		}
		
		if(list.size() >0 ){
			CMMT200VO count = new CMMT200VO();
			count.setTenantId(vo.getTenantId());
			count.setUsrId(vo.getUsrId());
			count.setUsrGrdCd(vo.getUsrGrdCd());
			count.setCtgrNoList(list);
			count.setPuslYn(vo.getPuslYn());
			count.setAdmin(vo.isAdmin());

			List<CMMT201VO> ctgrNoList = CMMT200DAO.selectByList("CMMT200SEL02", count);

			for (CMMT201VO re : volist){
				for(CMMT201VO co : ctgrNoList){
					if(re.getCtgrNo() == co.getCtgrNo()){
						re.setCount(co.getCount());
						break;
					}
				}
			}
		}

		return volist;
	}
	
	@Override
	public List<CMMT201VO> CMMT200SEL02(CMMT200VO vo) throws Exception {
		return CMMT200DAO.selectByList("CMMT200SEL02", vo);
	}
	
	@Override
	public List<CMMT200VO> CMMT200SEL03(CMMT200VO vo) throws Exception {
		return CMMT200DAO.selectByList("CMMT200SEL03", vo);
	}
	
	@Override
	public List<CMMT200VO> CMMT200SEL04(CMMT200VO vo) throws Exception {
		return CMMT200DAO.selectByList("CMMT200SEL04", vo);
	}
	
	@Override
	public int CMMT200INS01(CMMT200VO vo) throws Exception {
		return CMMT200DAO.sqlInsert("CMMT200INS01", vo);
	}
	
	@Override
	public int CMMT200INS02(CMMT200VO vo) throws Exception {
		return CMMT200DAO.sqlInsert("CMMT200INS02", vo);
	}

	@Override
	public int CMMT200UPT01(CMMT200VO vo) throws Exception {
		return CMMT200DAO.sqlUpdate("CMMT200UPT01", vo);
	}

	@Override
	public int CMMT200UPT03(CMMT200VO vo) throws Exception {
		return CMMT200DAO.sqlUpdate("CMMT200UPT03", vo);
	}
	
	@Override
	public int CMMT200DEL01(CMMT200VO vo) throws Exception {
		return CMMT200DAO.sqlDelete("CMMT200DEL01", vo);
	}

	@Override
	public CMMT200VO CMMT200SEL05(CMMT200VO vo) throws Exception {
		return (CMMT200VO) CMMT200DAO.selectByOne("CMMT200SEL05", vo);
	}

	@Override
	public int CMMT200DEL02(CMMT230VO vo) throws Exception {
		
		CMMT210VO vo2 = new CMMT210VO();
		vo2.setTenantId(vo.getTenantId());
		vo2.setCtgrMgntNo(vo.getCtgrMgntNo());
		vo2.setBlthgMgntNo(vo.getBlthgMgntNo());
		List<CMMT300VO> fileList = CMMT200DAO.selectByList("CMMT300SEL06", vo2);
		CMMT210VO img = (CMMT210VO) CMMT200DAO.selectByOne("CMMT300SEL05", vo2);

		// 파일삭제
		//미리보기 이미지 삭제
		for(CMMT300VO vo3 : fileList) {
			 File deleteFile = new File(vo3.getApndFilePsn() + "/" + vo3.getApndFileIdxNm());
		        if (deleteFile.exists()) {
		            try {
			            FileUtils.removeFile(vo3.getApndFilePsn(), vo3.getApndFileIdxNm());
		            } catch (Exception e) {
		            }
		        }
		}
		File deleteFile = new File(img.getBlthgRpsImgPsn() + "/" + img.getBlthgRpsImgIdxNm());
        if (deleteFile.exists()) {
            try {
	            FileUtils.removeFile(img.getBlthgRpsImgPsn(), img.getBlthgRpsImgIdxNm());
            } catch (Exception e) {
            }
        }

		String elResult =restElastic.DeleteQuery(vo.getTenantId(),"CMMT",
				vo.getCtgrMgntNo()+"_"+vo.getBlthgMgntNo());

		// T_BLTHG_APND_FILE
		CMMT200DAO.sqlDelete("CMMT300DEL01", vo2);
		// T_BLTHG_PUSLMN
		CMMT200DAO.sqlDelete("CMMT200DEL03", vo);
		//T_BLTHG_TNDW_HIST
		CMMT200DAO.sqlDelete("CMMT300DEL06", vo);
		// t_blthg_reply_asesmn
		CMMT200DAO.sqlDelete("CMMT230DEL02", vo);
		// t_blthg_reply
		CMMT200DAO.sqlDelete("CMMT230DEL01", vo);

		//T_BLTHG_DTLS_IMG
		CMMT200DAO.sqlDelete("CMMT300DEL07", vo);
		// T_BLTHG_DTLS
		CMMT200DAO.sqlDelete("CMMT300DEL03", vo2);
		// T_BLTHG_MOKTI
		CMMT200DAO.sqlDelete("CMMT300DEL02", vo2);

		// T_BLTHG_MGNT
		return CMMT200DAO.sqlDelete("CMMT200DEL02", vo);
	}

	@Override
	public List<CMMT200VO> CMMT200SEL06(CMMT200VO voSetting) throws Exception {
		return CMMT200DAO.selectByList("CMMT200SEL06", voSetting);
	}
	
	//kw---20230614 : 게시글조회
	@Override
	public List<CMMT200VO> CMMT200SEL07(CMMT200VO vo) throws Exception {
		
		List<CMMT200VO> CMMT200VOList = CMMT200DAO.selectByList("CMMT200SEL07", vo);

		if (CMMT200VOList.size()>0) {
			for (CMMT200VO cmmt200VO : CMMT200VOList) {	
				cmmt200VO.setUsrNm(AES256Crypt.decrypt(cmmt200VO.getUsrNm()));
			}
		}
		
		return CMMT200VOList;
	}
	
	//kw---20230614 : 게시판 카테고리 조회
	@Override
	public List<CMMT200VO> CMMT200SEL08(CMMT200VO vo) throws Exception {
		return CMMT200DAO.selectByList("CMMT200SEL08", vo);
	}

	
}
