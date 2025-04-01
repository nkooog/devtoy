package org.crm.sysm.service.impl;

import java.util.ArrayList;
import java.util.List;

import jakarta.annotation.Resource;

import org.apache.commons.lang.StringUtils;
import org.crm.util.string.StringUtil;
import org.springframework.stereotype.Service;

import org.crm.lgin.VO.LGIN000VO;
import org.crm.sysm.VO.SYSM433VO;
import org.crm.sysm.VO.SYSM434VO;
import org.crm.sysm.service.SYSM434Service;
import org.crm.sysm.service.dao.SYSMCommDAO;
import org.crm.util.crypto.AES256Crypt;

/***********************************************************************************************
 * Program Name : SMS 일괄발송 ServiceImpl
 * Creator      : 정대정
 * Create Date  : 2022.08.16
 * Description  : SMS 일괄발송
 * Modify Desc  :
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.08.16     정대정          최초생성
 ************************************************************************************************/
@Service("SYSM434Service")
public class SYSM434ServiceImpl implements SYSM434Service {

	@Resource(name = "SYSMCommDAO")
	private SYSMCommDAO sysm434DAO;

	@Override
	public List<SYSM434VO> SYSM434SEL01(SYSM434VO vo) throws Exception {
		return sysm434DAO.selectByList("SYSM434SEL01", vo);
	}
	
	@Override
	public List<SYSM434VO> SYSM434SEL02(SYSM434VO vo) throws Exception {
		return sysm434DAO.selectByList("SYSM434SEL02", vo);
	}
	
	@Override
	public int SYSM434SEL0201(SYSM434VO vo) throws Exception {
		return sysm434DAO.selectByCount("SYSM434SEL0201", vo);
	}
	
	
	@Override
	public List<SYSM434VO> SYSM434SEL03(SYSM434VO vo) throws Exception {
		
		//이름 검색일 경우
		if("3".equals(vo.getSearchType()) && !"".equals(StringUtil.nullToBlank(vo.getSearch()))
				|| "5".equals(vo.getSearchType()) && !vo.getSearch().isEmpty()) {
			vo.setSearch(AES256Crypt.encrypt(vo.getSearch()));
		}
		List<SYSM434VO> list = sysm434DAO.selectByList("SYSM434SEL03", vo);
		for (SYSM434VO sysm434vo : list) {
			
			sysm434vo.setCustNm(StringUtils.isNotEmpty(sysm434vo.getCustNm()) ? AES256Crypt.decrypt(sysm434vo.getCustNm()) : sysm434vo.getCustNm());
			sysm434vo.setCustNmSrchkey1(StringUtils.isNotEmpty(sysm434vo.getCustNmSrchkey1()) ? AES256Crypt.decrypt(sysm434vo.getCustNmSrchkey1()) : sysm434vo.getCustNmSrchkey1());
			sysm434vo.setCustNmSrchkey2(StringUtils.isNotEmpty(sysm434vo.getCustNmSrchkey2()) ? AES256Crypt.decrypt(sysm434vo.getCustNmSrchkey2()) : sysm434vo.getCustNmSrchkey2());
			sysm434vo.setRecvrTelNo(StringUtils.isNotEmpty(sysm434vo.getRecvrTelNo()) ? AES256Crypt.decrypt(sysm434vo.getRecvrTelNo()) : sysm434vo.getRecvrTelNo());
			sysm434vo.setRecvrTelNoSrchkey(StringUtils.isNotEmpty(sysm434vo.getRecvrTelNoSrchkey()) ? AES256Crypt.decrypt(sysm434vo.getRecvrTelNoSrchkey()) : sysm434vo.getRecvrTelNoSrchkey());
		}
		return list;
	}
	
	@Override
	public int  SYSM434SEL0302(SYSM434VO vo) throws Exception {
		return sysm434DAO.selectByCount("SYSM434SEL0302", vo);
	}
	
	@Override
	public List<SYSM434VO> SYSM434SEL04(SYSM434VO vo) throws Exception {

		List<SYSM434VO> list = sysm434DAO.selectByList("SYSM434SEL04", vo);
		for (SYSM434VO sysm434vo : list) {
			sysm434vo.setCustNm(StringUtils.isNotEmpty(sysm434vo.getCustNm()) ? AES256Crypt.decrypt(sysm434vo.getCustNm()) : sysm434vo.getCustNm());
			sysm434vo.setCustNmSrchkey1(StringUtils.isNotEmpty(sysm434vo.getCustNmSrchkey1()) ? AES256Crypt.decrypt(sysm434vo.getCustNmSrchkey1()) : sysm434vo.getCustNmSrchkey1());
			sysm434vo.setCustNmSrchkey2(StringUtils.isNotEmpty(sysm434vo.getCustNmSrchkey2()) ? AES256Crypt.decrypt(sysm434vo.getCustNmSrchkey2()) : sysm434vo.getCustNmSrchkey2());
			sysm434vo.setRecvrTelNo(StringUtils.isNotEmpty(sysm434vo.getRecvrTelNo()) ? AES256Crypt.decrypt(sysm434vo.getRecvrTelNo()) : sysm434vo.getRecvrTelNo());
			sysm434vo.setRecvrTelNoSrchkey(StringUtils.isNotEmpty(sysm434vo.getRecvrTelNoSrchkey()) ? AES256Crypt.decrypt(sysm434vo.getRecvrTelNoSrchkey()) : sysm434vo.getRecvrTelNoSrchkey());
			
		}
		return list;
	}

	
	@Override
	public SYSM434VO SYSM434SEL0501(SYSM434VO vo) throws Exception {
		return (SYSM434VO) sysm434DAO.selectByOne("SYSM434SEL0501", vo);
	}
	
	
	@Override
	public int SYSM434INS01(List<SYSM434VO> vo) throws Exception {
		
		List<SYSM434VO> SYSM434VOList = vo;
		
		if (SYSM434VOList.size()>0) {
			for (SYSM434VO vo434 : SYSM434VOList) {
				
				String filePath1, filePath2, filePath3;
				
				if(vo434.getApndFilePsn1() != null && vo434.getApndFilePsn1().equals("")) {
					filePath1 = vo434.getApndFilePsn1();
					filePath1 = filePath1.replaceAll("%3A", ":");
					filePath1 = filePath1.replaceAll("%2F", "/");
					vo434.setApndFilePsn1(filePath1);
                }
            }			
		}
		
		return sysm434DAO.sqlInsert("SYSM434INS01", SYSM434VOList);
	}
	
	@Override
	public int SYSM434INS02(List<SYSM434VO> vo) throws Exception {
		return sysm434DAO.sqlInsert("SYSM434INS02" ,vo);
	}
	
	@Override
	public int SYSM434INS0201(SYSM434VO vo) throws Exception {
		return sysm434DAO.sqlInsert("SYSM434INS0201", vo);
	}
	
	@Override
	public int SYSM434INS03(List<SYSM434VO> vo) throws Exception{
		return sysm434DAO.sqlInsert("SYSM434INS03", vo);
	}
	
	@Override
	public int SYSM434UPT0301(SYSM434VO vo) throws Exception {
		return sysm434DAO.sqlUpdate("SYSM434UPT0301" ,vo);
	}
	
	@Override
	public int SYSM434UPT01(List<SYSM434VO> vo) throws Exception {
		return sysm434DAO.sqlUpdate("SYSM434UPT01", vo);
	}
	
	@Override
	public int SYSM434UPT0102(List<SYSM434VO> vo) throws Exception {
		return sysm434DAO.sqlUpdate("SYSM434UPT0102", vo);
	}
	
	@Override
	public int SYSM434UPT0103(SYSM434VO vo) throws Exception {
		int result = sysm434DAO.sqlUpdate("SYSM434UPT0103", vo);
		
		if(result > 0) {
			result = sysm434DAO.sqlUpdate("SYSM434UPT0204", vo);
		}
		
		return result;
	}
	
	@Override
	public int SYSM434UPT02(SYSM434VO vo) throws Exception {
		return sysm434DAO.sqlUpdate("SYSM434UPT02", vo);
	}
	
	@Override
	public int SYSM434UPT0201(List<SYSM434VO> vo) throws Exception {
		
		ArrayList<SYSM434VO> list = new ArrayList<SYSM434VO>();
		
		for (SYSM434VO sysm434vo : vo) {
			
			sysm434vo.setSqncProcStCd("3");		//예약완료 (차수)
			sysm434vo.setProcStCd("3");			//예약완료 (스케쥴)
			
			list.add(sysm434vo);
		}
		
		int result = sysm434DAO.sqlUpdate("SYSM434UPT0201", list);
		if(result > 0) {
			
			SYSM434VO sysm434vo = vo.get(0);
				
			list.add(sysm434vo);
			result = sysm434DAO.sqlUpdate("SYSM434UPT0102", list);
		}
		return result;
	}
	
	@Override
	public int SYSM434UPT0202(List<SYSM434VO> list) throws Exception {

		List<SYSM434VO> paramList = new ArrayList<SYSM434VO>();
		
		for (SYSM434VO sysm434vo : list) {
			sysm434vo.setSmsStCd("9");		//발송 취소
			sysm434vo.setProcStCd("9");		//발송 취소
			paramList.add(sysm434vo);
		}
		
		//발송 취소된 발송 차수에 포함된 발송 고객의 상태를 발송취소로 변경
		int result = sysm434DAO.sqlUpdate("SYSM434UPT0202", paramList);
		
		SYSM434VO paramVo = ( paramList.size() > 0 ) ? paramList.get(0) : null;
		
		if(result > 0) {
			//발송 스케쥴 카운트 현행화
			result = sysm434DAO.sqlUpdate("SYSM434UPT0204", paramVo);
		}
		
		//발송 차수 삭제
		if(result > 0) {
			result = sysm434DAO.sqlUpdate("SYSM434UPT0206", paramList);
		}
		
		//발송 대상 고객 중 삭제되지 않고 모두 발송 취소되었을 경우 발송 스케줄의 상태를 발송 취소로 변경
		sysm434DAO.sqlUpdate("SYSM434UPT0208", paramVo);
		
		return result;
	}
	
	@Override
	public int SYSM434UPT0203(List<SYSM434VO> vo) throws Exception {	
		
		List<SYSM434VO> paramList = new ArrayList<SYSM434VO>();
		
		for (SYSM434VO sysm434vo : vo) {
			sysm434vo.setSmsStCd("1");		//배정
			sysm434vo.setProcStCd("1");		//등록
			paramList.add(sysm434vo);
		}
		
		//삭제 된 발송차수에 포함 된 발송 고객의 상태를 등록으로 변경
		int result = sysm434DAO.sqlUpdate("SYSM434UPT0202", paramList);
		
		SYSM434VO paramVo = ( paramList.size() > 0 ) ? paramList.get(0) : null;
		
		if(result > 0) {
			//발송 스케쥴 카운트 현행화
			result = sysm434DAO.sqlUpdate("SYSM434UPT0204", paramVo);
		}
		
		//발송 차수 삭제
		if(result > 0) {
			result = sysm434DAO.sqlUpdate("SYSM434UPT0206", paramList);
		}
		
		//남아 있는 발송 차수가 없을 경우 : 발송 스케쥴을 등록 상태로 변경 한다.
		sysm434DAO.sqlUpdate("SYSM434UPT0207", paramVo);
		
		return result;
	}
	
	
	@Override
	public int SYSM434UPT0209(List<SYSM434VO> vo) throws Exception {
		return sysm434DAO.sqlUpdate("SYSM434UPT0209", vo);
	}
	
	@Override
	public int SYSM434UPT0302(List<SYSM434VO> vo) throws Exception {
		
		//sndgRsvSqnc
		int result = sysm434DAO.sqlUpdate("SYSM434UPT0302", vo);		
		
		if(result > 0) {
			SYSM434VO sysm434vo = vo.get(0);
			
			result = sysm434DAO.sqlUpdate("SYSM434UPT0204", sysm434vo);
		}
		return result;
		
	}
	
	@Override
	public int SYSM434DEL01(List<SYSM434VO> vo) throws Exception {
		return sysm434DAO.sqlDelete("SYSM434DEL01", vo);
	}
		
	@Override
	public int SYSM434DEL03(List<SYSM434VO> vo) throws Exception {
		
		int result = sysm434DAO.sqlDelete("SYSM434DEL03", vo);
	
		if(result > 0) {
			//남아 있는 카운트가 있는지 확인
			SYSM434VO sysm434vo = vo.get(0);
			
			SYSM434VO resultVo = (SYSM434VO) sysm434DAO.selectByOne("SYSM434SEL0301", sysm434vo);
			
			if(resultVo.getTotCnt() > 0) {
				result = sysm434DAO.sqlUpdate("SYSM434UPT0204", sysm434vo);	
			} else {
				sysm434vo.setSndgTgtNcnt(0);
				sysm434vo.setSndgCpltNcnt(0);
				sysm434vo.setSndgTotzNcnt(0);
				sysm434vo.setSndgScssNcnt(0);
				sysm434vo.setSndgFailNcnt(0);
				result = sysm434DAO.sqlUpdate("SYSM434UPT0205", sysm434vo);
			}
		}
		return result;
	}

	@Override
	public int SYSM434INS05(SYSM434VO vo) throws Exception {
		return sysm434DAO.sqlInsert("SYSM434INS05", vo);
	}

	@Override
	public List<LGIN000VO> SYSM434SEL06(SYSM434VO vo) throws Exception {
		// TODO Auto-generated method stub
		
		if(!"1".equals(vo.getSearchType())) {
			vo.setSearch(AES256Crypt.encrypt(vo.getSearch()));
		}
		
		return sysm434DAO.selectByList("SYSM434SEL06", vo);
	}

	@Override
	public int SYSM434INS04(List<SYSM434VO> list) throws Exception {
		
		for(SYSM434VO vo : list) {
			
			vo.setCustNm(AES256Crypt.encrypt(vo.getCustNm()));
			vo.setRecvrTelNo(AES256Crypt.encrypt(vo.getRecvrTelNo()));
			vo.setRecvrTelNoSrchkey(AES256Crypt.encrypt(vo.getRecvrTelNo()));
			vo.setCustNmSrchkey1(AES256Crypt.encrypt(vo.getCustNm().substring(0,1)));
			
			if(vo.getCustNm().length() > 0 
					&& vo.getCustNm().length() >=2) {
				vo.setCustNmSrchkey2(AES256Crypt.encrypt(vo.getCustNm().substring(0,2)));
			}else {
				vo.setCustNmSrchkey2(AES256Crypt.encrypt(vo.getCustNm().substring(0,1)));
			}
			
			sysm434DAO.sqlInsert("SYSM434INS04", vo);
			
		}
		
		return 0;
	}

	@Override
	public List<LGIN000VO> SYSM434SEL07(SYSM433VO vo) throws Exception {
		// TODO Auto-generated method stub
		return sysm434DAO.selectByList("SYSM434SEL07", vo);
	}
}


