package org.crm.cmmt.service.impl;

import org.crm.cmmt.VO.CMMT210VO;
import org.crm.cmmt.VO.CMMT230VO;
import org.crm.cmmt.service.CMMT230Service;
import org.crm.cmmt.service.dao.CMMTCommDAO;
import org.crm.util.es.RestElasticUtil;
import org.crm.util.es.jsonObject.docObject;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;

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
@Service("CMMT230Service")
public class CMMT230ServiceImpl implements CMMT230Service {

	@Resource(name="CMMTCommDAO")
	private CMMTCommDAO CMMT230DAO;

	@Resource(name = "RestElasticUtil")
	RestElasticUtil restElastic;

	@Override
	public List<CMMT230VO> CMMT230SEL01(CMMT230VO vo) throws Exception {
		List<CMMT230VO> rtnList = CMMT230DAO.selectByList("CMMT230SEL01", vo);
		return rtnList;
	}

	@Override
	public List<CMMT230VO> CMMT230SEL02(CMMT230VO vo) throws Exception {
		return CMMT230DAO.selectByList("CMMT230SEL02", vo);
	}
	
	@Override
	public  List<CMMT230VO> CMMT230SEL03(CMMT230VO vo) throws Exception {
		return CMMT230DAO.selectByList("CMMT230SEL03", vo);
	}
	
	@Override
	public List<CMMT230VO> CMMT230SEL04(CMMT230VO vo) throws Exception {
		return CMMT230DAO.selectByList("CMMT230SEL04", vo);
	}
	
	@Override
	public List<CMMT230VO> CMMT230SEL05(CMMT230VO vo) throws Exception {
		return CMMT230DAO.selectByList("CMMT230SEL05", vo);
	}

	@Override
	public int CMMT230INS01(CMMT230VO vo) throws Exception {
		return CMMT230DAO.sqlInsert("CMMT230INS01", vo);
	}

	@Override
	public int CMMT230INS02(CMMT230VO vo) throws Exception {
		return CMMT230DAO.sqlInsert("CMMT230INS02", vo);
	}

	@Override
	public int CMMT230INS03(CMMT230VO vo) throws Exception {
		return CMMT230DAO.sqlInsert("CMMT230INS03", vo);
	}

	@Override
	public int CMMT230UPT01(CMMT210VO vo) throws Exception {

		int result = CMMT230DAO.sqlUpdate("CMMT230UPT01", vo);

		String docId= vo.getCtgrNo()+"_"+vo.getCntntsNo();
		docObject doc = new docObject();
		
		if(vo.getCtgrTypCd().equals("2")) {
			doc.setStCd("99");
		} else {
			doc.setStCd(vo.getBlthgStCd());
		}

		if(result > 0){
			String t = restElastic.UpdateQuery(vo.getTenantId(),"CMMT200",docId,doc);
		}
		return result;
	}

	@Override
	public int CMMT230UPT02(CMMT230VO vo) throws Exception {
		return (int) CMMT230DAO.selectByOne("CMMT230UPT02", vo);
	}

	@Override
	public int CMMT230UPT03(CMMT230VO vo) throws Exception {
		return CMMT230DAO.sqlUpdate("CMMT230UPT03", vo);
	}

	@Override
	public int CMMT230UPT04(CMMT230VO vo) throws Exception {
		return CMMT230DAO.sqlUpdate("CMMT230UPT04", vo);
	}
	
	@Override
	public int CMMT230UPT05(CMMT230VO vo) throws Exception {
		return (int) CMMT230DAO.selectByOne("CMMT230UPT05", vo);
	}
	
	@Override
	public int CMMT230UPT06(CMMT230VO vo) throws Exception {
		return (int) CMMT230DAO.selectByOne("CMMT230UPT06", vo);
	}
	
	@Override
	public int CMMT230UPT07(CMMT230VO vo) throws Exception {
		return (int) CMMT230DAO.selectByOne("CMMT230UPT07", vo);
	}

	@Override
	public int CMMT230UPT08(CMMT230VO vo) throws Exception {
		return CMMT230DAO.sqlUpdate("CMMT230UPT08", vo);
	}

	@Override
	public int CMMT230UPT09(CMMT230VO vo) throws Exception {
		return (int) CMMT230DAO.selectByOne("CMMT230UPT09", vo);
	}

	@Override
	public int CMMT230UPT10(CMMT230VO vo) throws Exception {
		return CMMT230DAO.sqlUpdate("CMMT230UPT10", vo);
	}

	@Override
	public int CMMT230UPT11(CMMT230VO vo) throws Exception {
		return CMMT230DAO.sqlUpdate("CMMT230UPT11", vo);
	}

	@Override
	public int CMMT230SEL07(CMMT230VO vo) throws Exception {
		return CMMT230DAO.selectByCount("CMMT230SEL07", vo);
	}

	@Override
	public int CMMT230SEL08(CMMT230VO vo) throws Exception {
		return CMMT230DAO.selectByCount("CMMT230SEL08", vo);
	}

	@Override
	public int CMMT230SEL09(CMMT230VO vo) throws Exception {
		return CMMT230DAO.selectByCount("CMMT230SEL09", vo);
	}

	@Override
	public int CMMT230DEL01(CMMT230VO vo) throws Exception {
		return CMMT230DAO.sqlDelete("CMMT230DEL01", vo);
	}

	@Override
	public int CMMT230DEL02(CMMT230VO vo) throws Exception {
		return CMMT230DAO.sqlDelete("CMMT230DEL02", vo);
	}
	
	@Override
	public List<CMMT230VO> CMMT230SEL06(CMMT230VO vo) throws Exception {
		return CMMT230DAO.selectByList("CMMT230SEL01", vo);
	}
}
