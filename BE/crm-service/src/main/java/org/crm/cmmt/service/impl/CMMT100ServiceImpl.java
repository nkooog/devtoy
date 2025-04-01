package org.crm.cmmt.service.impl;

import org.crm.cmmt.VO.CMMT100VO;
import org.crm.cmmt.service.CMMT100Service;
import org.crm.cmmt.service.dao.CMMTCommDAO;
import org.crm.util.es.RestElasticUtil;
import org.crm.util.es.jsonObject.docObject;
import org.springframework.stereotype.Service;

import jakarta.annotation.Resource;
import java.util.List;

/***********************************************************************************************
 * Program Name : 게시판 만들기 ServiceImpl
 * Creator      : 정대정
 * Create Date  : 2022.03.29
 * Description  : 게시판 만들기
 * Modify Desc  :
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.03.29    정대정           최초생성
 ************************************************************************************************/
@Service("CMMT100Service")
public class CMMT100ServiceImpl implements CMMT100Service {

	int success = 1;
	int error = 0;

	@Resource(name="CMMTCommDAO")
	private CMMTCommDAO CMMT100DAO;

	@Resource(name = "RestElasticUtil")
	private RestElasticUtil restElastic;

	@Override
	public List<CMMT100VO> CMMT100SEL01(CMMT100VO vo) throws Exception {
		return CMMT100DAO.selectByList("CMMT100SEL01", vo);
	}

	@Override
	public CMMT100VO CMMT100SEL02(CMMT100VO vo) throws Exception {
		return (CMMT100VO) CMMT100DAO.selectByOne("CMMT100SEL02", vo);
	}
	
	//kw---20230706 : 카테고리 <-> 게시판 변경시 엘라스틱에 해당 게시물의 상태들을 업데이트 해주기 위해, 해당 카테고리의 게시물들을 불러옴
	public List<CMMT100VO> CMMT100SEL03(CMMT100VO vo) throws Exception {
		return CMMT100DAO.selectByList("CMMT100SEL03", vo);
	}
	
	@Override
	public Integer CMMT100INS01(List<CMMT100VO> list) throws Exception {
		return CMMT100DAO.sqlInsert("CMMT100INS01", list);
	}

	@Override
	//kw---20230531 : 카테고리 업데이트
	public Integer CMMT100UPT01(List<CMMT100VO> list) throws Exception {
		return CMMT100DAO.sqlUpdate("CMMT100UPT01", list);
	}

	@Override
	public int CMMT100DEL01(CMMT100VO vo) throws Exception {
		CMMT100DAO.sqlDelete("CMMT110DEL02", vo);
		CMMT100DAO.sqlUpdate("CMMT100UPT05", vo);
		return CMMT100DAO.sqlDelete("CMMT100DEL01", vo);
	}

	@Override
	public int CMMT100UPT02(CMMT100VO vo) throws Exception {
		return CMMT100DAO.sqlUpdate("CMMT100UPT02", vo);
	}

	@Override
	public int CMMT100UPT03(List<CMMT100VO> list) throws Exception {
		int result=0;
		try {
			for(CMMT100VO vo:list){
				result = CMMT100DAO.sqlUpdate("CMMT100UPT03", vo);
			}
			result = success;
		}catch (Exception e){
			e.printStackTrace();
			return error;
		}
		return result;
	}
	
	@Override
	//kw---20230706 : 게시판 유형에 따라 엘라스틱 게시글 상태 업데이트 (커뮤니티 : 99)
	public String CMMT100UPT04(List<CMMT100VO> list) throws Exception {
		
		String elResult = "";
		
		try {
			if(list.size() > 0) {
				for (CMMT100VO vo : list) {
					docObject doc = new docObject();

					if(vo.getCtgrTypCd().equals("1")){	//게시판으로 변경
						doc.setStCd(vo.getBlthgStCd());
					} else if(vo.getCtgrTypCd().equals("2")){	//커뮤니티로 변경
						doc.setStCd("99");
					}

					elResult =restElastic.UpdateQuery(vo.getTenantId(),"CMMT",
							vo.getCtgrMgntNo()+"_"+vo.getBlthgMgntNo(),doc);
					
				}
			}
		}catch (Exception e){
			e.printStackTrace();
			return elResult;
		}
		return elResult;
	}
}


