package org.crm.sysm.service.impl;

import org.crm.sysm.VO.SYSM280VO;
import org.crm.sysm.service.SYSM280Service;
import org.crm.sysm.service.dao.SYSMCommDAO;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;

/***********************************************************************************************
* Program Name : 상담유형 코드관리 Main ServiceImpl
* Creator      : 김보영
* Create Date  : 2022.05.10
* Description  : 상담유형 코드관리
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.05.10    김보영           최초생성
************************************************************************************************/

@Service("SYSM280Service")
public class SYSM280ServiceImpl implements SYSM280Service {

	@Resource(name="SYSMCommDAO")
	private SYSMCommDAO sysm280Mapper;

	@Override
	public List<SYSM280VO> SYSM280SEL01(SYSM280VO sysm280VO) throws Exception {
		List<SYSM280VO> cnslCdList = sysm280Mapper.selectByList("SYSM280SEL01", sysm280VO);

		SYSM280VO voList = new SYSM280VO();
		List<String> addList = new ArrayList<String>();

		for(SYSM280VO SYSM280VO : cnslCdList){
			addList.add(SYSM280VO.getCnslTypCd());
		}
		voList.setTenantId(sysm280VO.getTenantId());
		voList.setCnslTypCdList(addList);

		List<SYSM280VO> baseAnswCdList = sysm280Mapper.selectByList("SYSM280SEL04", voList);

		String baseAnswCdComp = "";
		String baseAnswCdNmComp = "";
		String CnslTypCd = "";

		for(int i =0; i<baseAnswCdList.size(); i++){
			if(i == 0){
				baseAnswCdComp += baseAnswCdList.get(i).getBaseAnswCd()+";";
				baseAnswCdNmComp += baseAnswCdList.get(i).getBaseAnswCdNm()+";";
				CnslTypCd = baseAnswCdList.get(i).getCnslTypCd();
			} else if(CnslTypCd.equals(baseAnswCdList.get(i).getCnslTypCd())){
				baseAnswCdComp += baseAnswCdList.get(i).getBaseAnswCd()+";";
				baseAnswCdNmComp += baseAnswCdList.get(i).getBaseAnswCdNm()+";";
			} else if (!CnslTypCd.equals( baseAnswCdList.get(i).getCnslTypCd())){
				//기본답변 정보 list 상담유형코드에 setting
				for(SYSM280VO SYSM280VO : cnslCdList){
					if(SYSM280VO.getCnslTypCd().equals(CnslTypCd)){
						SYSM280VO.setBaseAnswCd(baseAnswCdComp.substring(0, baseAnswCdComp.length() - 1));
						SYSM280VO.setBaseAnswCdNm(baseAnswCdNmComp.substring(0, baseAnswCdNmComp.length() - 1));
					}
				}
				// 기본답변 정보 list 초기화
				baseAnswCdComp = "";
				baseAnswCdNmComp = "";
				baseAnswCdComp += baseAnswCdList.get(i).getBaseAnswCd()+";";
				baseAnswCdNmComp += baseAnswCdList.get(i).getBaseAnswCdNm()+";";
				CnslTypCd = baseAnswCdList.get(i).getCnslTypCd();
			}
			// 마지막 row
			if(i == baseAnswCdList.size()-1){
				for(SYSM280VO SYSM280VO : cnslCdList){
					if(SYSM280VO.getCnslTypCd().equals(CnslTypCd)){
						SYSM280VO.setBaseAnswCd(baseAnswCdComp.substring(0, baseAnswCdComp.length() - 1));
						SYSM280VO.setBaseAnswCdNm(baseAnswCdNmComp.substring(0, baseAnswCdNmComp.length() - 1));
					}
				}
			}
		}
		return cnslCdList;
	}

	@Override
	public Integer SYSM280INS01(List<SYSM280VO> list) throws Exception {
		return sysm280Mapper.sqlInsert("SYSM280INS01", list);
	}

	@Override
	public Integer SYSM280DEL01(List<SYSM280VO> list) throws Exception {
		return sysm280Mapper.sqlDelete("SYSM280DEL01", list);
	}

	@Override
	public Integer SYSM280UPT01(List<SYSM280VO> list) throws Exception {
		return sysm280Mapper.sqlUpdate("SYSM280UPT01", list);
	}
	@Override
	public Integer SYSM280SAVE01(List<SYSM280VO> list) throws Exception {
		return sysm280Mapper.sqlUpdate("SYSM280SAVE01",list);
	}

	@Override
	public List<SYSM280VO> SYSM280SEL02(SYSM280VO sysm280VO)throws Exception {
		return sysm280Mapper.selectByList("SYSM280SEL02", sysm280VO);
	}

	@Override
	public Integer SYSM280INS02(List<SYSM280VO> list) throws Exception {
		return sysm280Mapper.sqlInsert("SYSM280INS02", list);
	}
	
	@Override
	public Integer SYSM280DEL02(SYSM280VO sysm280VO)throws Exception {
		return sysm280Mapper.sqlDelete("SYSM280DEL02", sysm280VO);
	}
	@Override
	public List<SYSM280VO> SYSM280SEL03(SYSM280VO sysm280VO) throws Exception {
		List<SYSM280VO> cnslCdList =sysm280Mapper.selectByList("SYSM280SEL03", sysm280VO);

		SYSM280VO voList = new SYSM280VO();
		List<String> addList = new ArrayList<String>();
		
		if(cnslCdList.size() > 0) {
			for(SYSM280VO SYSM280VO : cnslCdList){
				addList.add(SYSM280VO.getCnslTypCd());
			}
			voList.setTenantId(sysm280VO.getTenantId());
			voList.setCnslTypCdList(addList);
	
			List<SYSM280VO> baseAnswCdList = sysm280Mapper.selectByList("SYSM280SEL04", voList);
	
			String baseAnswCdComp = "";
			String baseAnswCdNmComp = "";
			String CnslTypCd = "";
	
			for(int i =0; i<baseAnswCdList.size(); i++){
				if(i == 0){
					baseAnswCdComp += baseAnswCdList.get(i).getBaseAnswCd()+";";
					baseAnswCdNmComp += baseAnswCdList.get(i).getBaseAnswCdNm()+";";
					CnslTypCd = baseAnswCdList.get(i).getCnslTypCd();
				} else if(CnslTypCd.equals(baseAnswCdList.get(i).getCnslTypCd())){
					baseAnswCdComp += baseAnswCdList.get(i).getBaseAnswCd()+";";
					baseAnswCdNmComp += baseAnswCdList.get(i).getBaseAnswCdNm()+";";
				} else if (!CnslTypCd.equals( baseAnswCdList.get(i).getCnslTypCd())){
					//기본답변 정보 list 상담유형코드에 setting
					for(SYSM280VO SYSM280VO : cnslCdList){
						if(SYSM280VO.getCnslTypCd().equals(CnslTypCd)){
							SYSM280VO.setBaseAnswCd(baseAnswCdComp.substring(0, baseAnswCdComp.length() - 1));
							SYSM280VO.setBaseAnswCdNm(baseAnswCdNmComp.substring(0, baseAnswCdNmComp.length() - 1));
						}
					}
					// 기본답변 정보 list 초기화
					baseAnswCdComp = "";
					baseAnswCdNmComp = "";
					baseAnswCdComp += baseAnswCdList.get(i).getBaseAnswCd()+";";
					baseAnswCdNmComp += baseAnswCdList.get(i).getBaseAnswCdNm()+";";
					CnslTypCd = baseAnswCdList.get(i).getCnslTypCd();
				}
				// 마지막 row
				if(i == baseAnswCdList.size()-1){
					for(SYSM280VO SYSM280VO : cnslCdList){
						if(SYSM280VO.getCnslTypCd().equals(CnslTypCd)){
							SYSM280VO.setBaseAnswCd(baseAnswCdComp.substring(0, baseAnswCdComp.length() - 1));
							SYSM280VO.setBaseAnswCdNm(baseAnswCdNmComp.substring(0, baseAnswCdNmComp.length() - 1));
						}
					}
				}
			}
		}

		return cnslCdList;
	}

	@Override
	public Integer SYSM280DEL03(List<SYSM280VO> baseAnswCdList) throws Exception {
		return sysm280Mapper.sqlDelete("SYSM280DEL03", baseAnswCdList);
	}

	@Override
	public Integer SYSM280INS03(List<SYSM280VO> baseAnswCdList) throws Exception {
		return sysm280Mapper.sqlInsert("SYSM280INS03", baseAnswCdList);
	}

	@Override
	public Integer SYSM280SEQINIT(SYSM280VO sysm280VO) throws Exception {
		return sysm280Mapper.sqlUpdate("SYSM280SEQINIT", sysm280VO);
	}


}
