package org.crm.sysm.service.impl;

import org.crm.sysm.VO.SYSM200VO;
import org.crm.sysm.service.SYSM200Service;
import org.crm.sysm.service.dao.SYSMCommDAO;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;
import java.util.List;

/***********************************************************************************************
* Program Name : 사용자 정보관리 ServiceImpl
* Creator      : 허해민
* Create Date  : 2022.01.17
* Description  : 사용자 정보관리
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* ------------------------------------------------- ----------------------------------------------
* 2022.01.17     허해민           최초생성
************************************************************************************************/
@Service("SYSM200Service")
public class SYSM200ServiceImpl implements SYSM200Service {

	@Resource(name="SYSMCommDAO")
	private SYSMCommDAO dao;

	// 사용자정보 전체조회 - 메인 
	@Override
	public List<SYSM200VO> SYSM200SEL01(SYSM200VO sys200vo) throws Exception {
		return dao.selectByList("SYSM200SEL01",sys200vo);
	}

	// 사용자 상세정보 조회 - 상담채널권한, 메뉴권한, 부가솔루션권한 제외
	@Override
	public SYSM200VO SYSM200SEL02(SYSM200VO sys200vo) throws Exception {
		return (SYSM200VO) dao.selectByOne("SYSM200SEL02",sys200vo);
	}

	// 사용자 아이디 중복체크 - tab
	@Override
	public int SYSM200SEL03(SYSM200VO sys200vo) throws Exception {
		return dao.selectByCount("SYSM200SEL03", sys200vo);
	}

	// 태넌트 조회
	@Override
	public int SYSM200SEL04(SYSM200VO sys200vo) throws Exception {
		return dao.selectByCount("SYSM200SEL04", sys200vo);
	}

	// 사용자 정보 삭제 - tab
	@Override
	public int SYSM210DEL01(SYSM200VO sys200vo) throws Exception {
		return dao.sqlDelete("SYSM210DEL01", sys200vo);
	}

	@Override
	public int SYSM210DEL02(SYSM200VO sys200vo) throws Exception {
		return dao.sqlDelete("SYSM210DEL02", sys200vo);
	}

	// 비밀번호 초기화
	@Override
	public int SYSM200UPT01(SYSM200VO sys200vo) throws Exception {
		return dao.sqlUpdate("SYSM200UPT01", sys200vo);
	}

	// 계정잠김해제
	@Override
	public int SYSM200UPT02(SYSM200VO sys200vo) throws Exception {
		return dao.sqlUpdate("SYSM200UPT02", sys200vo);
	}
	
	// 사용자기본정보 업데이트
	@Override
	public int SYSM200UPT03(SYSM200VO sys200vo) throws Exception {
		return dao.sqlUpdate("SYSM200UPT03",sys200vo);
	}
	
	// 패스워드 변경기간 연장 (90일)
	@Override
	public int SYSM200UPT04(SYSM200VO sys200vo) throws Exception {
		return dao.sqlUpdate("SYSM200UPT04",sys200vo);
	}
	
	@Override
	public int SYSM200UPT05(SYSM200VO sys200vo) throws Exception {
		return dao.sqlUpdate("SYSM200UPT05",sys200vo);
	}

	// 사용자기본정보 신규등록
	@Override
	public int SYSM200INS01(SYSM200VO sys200vo) throws Exception {
		return dao.sqlInsert("SYSM200INS01", sys200vo);
	}
	
	// 텔레셋 정보 등록/변경
	@Override
	public int SYSM200INS02(SYSM200VO sys200vo) throws Exception {
		return dao.sqlInsert("SYSM200INS02", sys200vo);
	}

	// 사용자 상담채널 사용권한 삭제
	@Override
	public int SYSM220DEL01(SYSM200VO sys200vo) throws Exception {
		return dao.sqlDelete("SYSM220DEL01",sys200vo);
	}

	// 사용자 상담채널 사용권한 신규등록
	@Override
	public int SYSM220INS01(List<SYSM200VO> sys200volist) throws Exception {
		return dao.sqlInsert("SYSM220INS01", sys200volist);
	}

	// 상담채널권한(우선순위코드,업무선택여부)
	@Override
	public int SYSM220UPT01(SYSM200VO sys200vo) throws Exception {
		return dao.sqlUpdate("SYSM220UPT01", sys200vo);
	}

	// 사용자 메뉴권한 삭제
	@Override
	public int SYSM220DEL02(SYSM200VO sys200vo) throws Exception {
		return dao.sqlDelete("SYSM220DEL02", sys200vo);
	}

	// 사용자 메뉴권한 등록
	@Override
	public int SYSM220INS02(List<SYSM200VO> sys200volist) throws Exception {
		return dao.sqlInsert("SYSM220INS02", sys200volist);
	}

	// 등급별 메뉴권한(우선순위코드,업무선택여부)
	@Override
	public int SYSM220UPT02(SYSM200VO sys200vo) throws Exception {
		return dao.sqlUpdate("SYSM220UPT02",sys200vo);
	}

	// 등급별 메뉴권한(우선순위코드,업무선택여부)
	@Override
	public int SYSM220UPT03(SYSM200VO sys200vo) throws Exception {
		return dao.sqlUpdate("SYSM220UPT03", sys200vo);
	}

	// 사용자 부가솔루션사용권한 삭제
	@Override
	public int SYSM220DEL03(SYSM200VO sys200vo) throws Exception {
		return dao.sqlDelete("SYSM220DEL03", sys200vo);
	}

	// 사용자 부가솔루션 사용권한 신규등록
	@Override
	public int SYSM220INS03(List<SYSM200VO> sys200volist) throws Exception {
		return dao.sqlInsert("SYSM220INS03", sys200volist);
	}

	// 상담채널권한 리스트 조회
	@Override
	public List<SYSM200VO> SYSM200SEL05(SYSM200VO sys200vo) throws Exception {
		return dao.selectByList("SYSM200SEL05", sys200vo);
	}

	// 메뉴등급권한 리스트 조회
	@Override
	public List<SYSM200VO> SYSM200SEL06(SYSM200VO sys200vo) throws Exception {
		return dao.selectByList("SYSM200SEL06", sys200vo);
	}

	// 솔루션권한 리스트 조회
	@Override
	public List<SYSM200VO> SYSM200SEL07(SYSM200VO sys200vo) throws Exception {
		return dao.selectByList("SYSM200SEL07", sys200vo);
	}

	// 사용자 등급별 초기화
	@Override
	public int SYSM220UPT04(SYSM200VO sys200vo) throws Exception {
		return dao.sqlUpdate("SYSM220UPT04", sys200vo);
	}

	//kw---20231123 : 비밀번호 업데이트 기간 구하기
	@Override
	public List<SYSM200VO> SYSM200SEL08(SYSM200VO sys200vo) throws Exception {
		return dao.selectByList("SYSM200SEL08", sys200vo);
	}

	@Override
	public int SYSM200INS03(SYSM200VO sys200vo) throws Exception {
		return dao.sqlInsert("SYSM200INS03", sys200vo);
	}

	@Override
	public int SYSM200INS04(SYSM200VO sys200vo) throws Exception {
		return dao.sqlInsert("SYSM200INS04", sys200vo);
	}

	@Override
	public int SYSM210DEL03(SYSM200VO sys200vo) throws Exception {
		return dao.sqlDelete("SYSM210DEL03", sys200vo);
	}

	@Override
	public int SYSM210DEL04(SYSM200VO sys200vo) throws Exception {
		return dao.sqlDelete("SYSM210DEL04", sys200vo);
	}
}