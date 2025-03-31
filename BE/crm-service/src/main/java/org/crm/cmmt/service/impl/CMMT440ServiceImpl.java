package org.crm.cmmt.service.impl;

import org.crm.cmmt.VO.CMMT400VO;
import org.crm.cmmt.VO.CMMT440VO;
import org.crm.cmmt.service.CMMT440Service;
import org.crm.cmmt.service.dao.CMMTCommDAO;
import org.crm.sysm.VO.SYSM200VO;
import org.crm.util.com.ComnFun;
import org.springframework.stereotype.Service;

import jakarta.annotation.Resource;
import java.util.ArrayList;
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
@Service("CMMT440Service")
public class CMMT440ServiceImpl implements CMMT440Service {

	@Resource(name="CMMTCommDAO")
	private CMMTCommDAO DAO;


	@Override
	public CMMT400VO CMMT440SEL01(CMMT400VO vo) throws Exception {
		return (CMMT400VO) DAO.selectByOne("CMMT440SEL01" , vo);
	}


	@Override
	public List<CMMT440VO> CMMT440SEL02(CMMT400VO vo) throws Exception {
		return DAO.selectByList("CMMT440SEL02" , vo);
	}
	
	@Override
	public List<CMMT400VO> CMMT440SEL03(CMMT400VO vo) throws Exception {
		return DAO.selectByList("CMMT440SEL03" , vo);
	}
	
	@Override
	public List<CMMT440VO> CMMT440SEL04(CMMT400VO vo) throws Exception {
		return DAO.selectByList("CMMT440SEL04" , vo);
	}

	@Override
	public int CMMT440INS01(CMMT400VO vo) throws Exception {
		ComnFun cf = new ComnFun();
		int rtn = 0; 
		
		rtn =  DAO.sqlInsert("CMMT440INS01" , vo);
		vo.setSchdNo(rtn);
		if(!cf.isStringEmpty(vo.getAlrmStCd())) {
			DAO.sqlInsert("CMMT440INS03" , vo);
		}
		return rtn;
	}


	@Override
	public int CMMT440INS02(List<CMMT440VO> list) throws Exception {
		ComnFun cf = new ComnFun();
		int rtn = 0;

		for(CMMT440VO vo : list) {
			int jnownSeq = DAO.sqlInsert("CMMT440INS02" , vo);

			if(!vo.getAlrmStgupCd().equals("10")){
				if(!cf.isStringEmpty(vo.getSchdJnownDvCd()) && vo.getSchdJnownDvCd().equals("3")){
					CMMT440VO alarmVO = new CMMT440VO();
					alarmVO.setTenantId(vo.getTenantId());
					alarmVO.setRegYr(vo.getRegYr());
					alarmVO.setSchdNo(vo.getSchdNo());
					alarmVO.setJnownSeq(jnownSeq);
					alarmVO.setRegrId(vo.getRegrId());
					alarmVO.setLstCorprId(vo.getLstCorprId());
					alarmVO.setRegrOrgCd(vo.getRegrOrgCd());
					alarmVO.setLstCorprOrgCd(vo.getLstCorprOrgCd());

					alarmVO.setAlrmCfmrId(vo.getSchdJnownCd());
					DAO.sqlInsert("CMMT440INS05" , alarmVO);

				}else{
					SYSM200VO schdJnownVO = new SYSM200VO();
					schdJnownVO.setTenantId(vo.getTenantId());

					if(vo.getSchdJnownDvCd().equals("1")){
						schdJnownVO.getOrgList().add(vo.getSchdJnownCd());
					}else if(vo.getSchdJnownDvCd().equals("2")){
						schdJnownVO.getGrdList().add(vo.getSchdJnownCd());
					}
					//select 조직, 그룹별 사람
					List<SYSM200VO> cfrmIdList = new ArrayList<SYSM200VO>();
					cfrmIdList =  DAO.selectByList("SYSM200SEL01" , schdJnownVO);

					for(SYSM200VO SYSM200VO : cfrmIdList) {
						CMMT440VO alarmVO = new CMMT440VO();
						alarmVO.setTenantId(vo.getTenantId());
						alarmVO.setRegYr(vo.getRegYr());
						alarmVO.setSchdNo(vo.getSchdNo());
						alarmVO.setUsrId(vo.getUsrId());
						alarmVO.setJnownSeq(jnownSeq);
						alarmVO.setRegrId(vo.getRegrId());
						alarmVO.setLstCorprId(vo.getLstCorprId());
						alarmVO.setRegrOrgCd(vo.getRegrOrgCd());
						alarmVO.setLstCorprOrgCd(vo.getLstCorprOrgCd());

						alarmVO.setAlrmCfmrId(SYSM200VO.getUsrId());
						// T_일정_공유_알람_확인_정보 insert
						DAO.sqlInsert("CMMT440INS05" , alarmVO);
					}
				}
			}
		}

		return rtn;
	}


	@Override
	public int CMMT440INS03(CMMT400VO vo) throws Exception {
		return DAO.sqlInsert("CMMT440INS03" , vo);
	}

	@Override
	public int CMMT440UPT01(CMMT400VO vo) throws Exception {
		return DAO.sqlUpdate("CMMT440UPT01" , vo);
	}
	
	@Override
	public int CMMT440UPT02(CMMT400VO vo) throws Exception {
		return DAO.sqlUpdate("CMMT440UPT02" , vo);
	}

	@Override
	public int CMMT440DEL01(CMMT400VO vo) throws Exception {
		return DAO.sqlDelete("CMMT440DEL01" , vo);
	}


	@Override
	public int CMMT440DEL02(CMMT400VO vo) throws Exception {
		return DAO.sqlDelete("CMMT440DEL02" , vo);
	}

	@Override
	public int CMMT440DEL03(CMMT400VO vo) throws Exception {
		return DAO.sqlDelete("CMMT440DEL03" , vo);
	}


	@Override
	public int CMMT440INS04(List<CMMT440VO> cmmt440List) throws Exception {
		int rtn = 0;
		 for (CMMT440VO VO : cmmt440List) {
			 rtn += DAO.sqlInsert("CMMT440INS04" , VO);
         }
		 return rtn;
	}
	
	@Override
	public int CMMT440DEL04(CMMT400VO vo) throws Exception {
		return DAO.sqlDelete("CMMT440DEL04" , vo);
	}

	@Override
	public int CMMT440DEL05(CMMT400VO vo) throws Exception {
		return  DAO.sqlDelete("CMMT440DEL05" , vo);
	}
	
}
 