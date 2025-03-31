package org.crm.frme.service.impl;

import org.crm.frme.VO.FRME180VO;
import org.crm.frme.service.FRME180Service;
import org.crm.frme.service.dao.FRMECommDAO;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;


/***********************************************************************************************
* Program Name : 근태관리 ServiceImpl
* Creator      : sukim
* Create Date  : 2022.05.12
* Description  : 근태관리 ServiceImpl
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.05.12     sukim            최초생성
************************************************************************************************/
@Service("FRME180Service")
public class FRME180ServiceImpl implements FRME180Service {

	@Resource(name="FRMECommDAO")
	private FRMECommDAO frme180Mapper;

	//근태 체크용 건수조회 (0 : 근태 미등록, 1 : 출근 등록,  2 : 퇴근 등록)
	@Override
	public int FRME180SEL01(FRME180VO frme180Vo) throws Exception{
		return frme180Mapper.selectByCount("FRME180SEL01", frme180Vo);
	};
	
	//근태시간조회 (dgindDvCd 1 : 출근,  2 : 퇴근)
	@Override
	public FRME180VO FRME180SEL02(FRME180VO frme180Vo) throws Exception{
		return (FRME180VO) frme180Mapper.selectByOne("FRME180SEL02",frme180Vo);
	};
	
	//근태시간조회
	@Override
	public FRME180VO FRME180SEL03(FRME180VO frme180Vo) throws Exception{
		return (FRME180VO) frme180Mapper.selectByOne("FRME180SEL03", frme180Vo);
	};	
	
	//출/퇴근 등록
	@Override
	public int FRME180INS01(FRME180VO frme180Vo) throws Exception{
		return frme180Mapper.sqlInsert("FRME180INS01", frme180Vo);
	};

	//사진정보 등록
	@Override
	public int FRME180INS02(FRME180VO frme180Vo) throws Exception{
		return frme180Mapper.sqlInsert("FRME180INS02", frme180Vo);
	};
}
