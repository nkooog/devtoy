package org.crm.dash.service.impl;

import org.crm.dash.VO.DASH100VO;
import org.crm.dash.service.DASH100Service;
import org.crm.dash.service.dao.DASHCommDAO;
import org.crm.util.com.ComnFun;
import org.crm.util.crypto.AES256Crypt;
import org.crm.util.masking.MaskingUtil;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;

import java.util.List;

/***********************************************************************************************
* Program Name : 대시보드 메인 Service.impl
* Creator      : 강동우
* Create Date  : 2022.05.17
* Description  : 대시보드 메인 Service.impl
* Modify Desc  : 
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.05.17     강동우           최초생성
************************************************************************************************/
@Service("DASH100Service")
public class DASH100ServiceImpl implements DASH100Service {
	
	@Resource(name="DASHCommDAO")
	private DASHCommDAO dao;

	@Override
	public List<DASH100VO> DASH100SEL00(DASH100VO vo) throws Exception {
		return dao.selectByList("DASH100SEL00", vo);
	}

	@Override
	public List<DASH100VO> DASH100SEL01(DASH100VO vo) throws Exception {
		return dao.selectByList("DASH100SEL01", vo);
	}

	@Override
	public List<DASH100VO> DASH100SEL02(DASH100VO vo) throws Exception {
		return dao.selectByList("DASH100SEL02", vo);
	}
	@Override
	public List<DASH100VO> DASH100SEL03(DASH100VO vo) throws Exception {
		return dao.selectByList("DASH100SEL03", vo);
	}
	

	@Override
	public List<DASH100VO> DASH100SEL05(DASH100VO vo, String personInfoMask) throws Exception {
		List<DASH100VO> DASH100VOList = dao.selectByList("DASH100SEL05", vo);
		
		if (DASH100VOList.size()>0) {
			for (DASH100VO dash100VO : DASH100VOList) {
				if (!ComnFun.isEmpty(dash100VO.getCntcCustNm()))
					dash100VO.setCntcCustNm(AES256Crypt.decrypt(dash100VO.getCntcCustNm()));
				if(!ComnFun.isEmpty(dash100VO.getCabackReqTelno())){
					String telNo = MaskingUtil.SwichingPhone(AES256Crypt.decrypt(dash100VO.getCabackReqTelno()));
					if(!ComnFun.isEmpty(personInfoMask) && "N".equals(personInfoMask)){
						telNo = AES256Crypt.decrypt(dash100VO.getCabackReqTelno());
					}
					dash100VO.setCabackReqTelno(telNo);
				}
			}
		}
		return DASH100VOList;
	}
	
	@Override
	public List<DASH100VO> DASH100SEL06(DASH100VO vo) throws Exception {
		List<DASH100VO> DASH100VOList = dao.selectByList("DASH100SEL06", vo);
		if (DASH100VOList.size()>0) {
			for (int i=0; i<DASH100VOList.size(); i++) {
				DASH100VOList.get(i).setUsrNm(AES256Crypt.decrypt(DASH100VOList.get(i).getUsrNm()));
			}
		}
		return DASH100VOList;
	}
	
	@Override
	public List<DASH100VO> DASH100SEL07(DASH100VO vo, String personInfoMask) throws Exception {
		List<DASH100VO> DASH100VOList = dao.selectByList("DASH100SEL07", vo);
		if (DASH100VOList.size()>0) {
			for (DASH100VO dash100VO : DASH100VOList) {
				if (!ComnFun.isEmpty(dash100VO.getCntcCustNm()))
					dash100VO.setCntcCustNm(AES256Crypt.decrypt(dash100VO.getCntcCustNm()));
				if(!ComnFun.isEmpty(dash100VO.getCabackReqTelno())){
					String telNo = MaskingUtil.SwichingPhone(AES256Crypt.decrypt(dash100VO.getCabackReqTelno()));
					if(!ComnFun.isEmpty(personInfoMask) && "N".equals(personInfoMask)){
						telNo = AES256Crypt.decrypt(dash100VO.getCabackReqTelno());
					}

					dash100VO.setCabackReqTelno(telNo);
				}
			}
		}
		return DASH100VOList;
	}
	
	@Override
	public List<DASH100VO> DASH100SEL08(DASH100VO vo) throws Exception {
		List<DASH100VO> DASH100VOList = dao.selectByList("DASH100SEL08", vo);
		if (DASH100VOList.size()>0) {
			for (int i=0; i<DASH100VOList.size(); i++) {
				DASH100VOList.get(i).setTrclmnNm(AES256Crypt.decrypt(DASH100VOList.get(i).getTrclmnNm()));
			}
		}
		return DASH100VOList;
	}

	@Override
	public List<DASH100VO> DASH100SEL09(DASH100VO vo) throws Exception {
		return dao.selectByList("DASH100SEL09", vo);
	}

	@Override
	public List<DASH100VO> DASH100SEL10(DASH100VO vo) throws Exception {
		return dao.selectByList("DASH100SEL10", vo);
	}

	@Override
	public List<DASH100VO> DASH100SEL11(DASH100VO vo) throws Exception {
		return dao.selectByList("DASH100SEL11", vo);
	}

	@Override
	public List<DASH100VO> DASH100SEL12(DASH100VO vo) throws Exception {
		return dao.selectByList("DASH100SEL12", vo);
	}

	@Override
	public List<DASH100VO> DASH100SEL13(DASH100VO vo) throws Exception {
		return dao.selectByList("DASH100SEL13", vo);
	}

	@Override
	public List<DASH100VO> DASH100SEL14(DASH100VO vo) throws Exception {
		return dao.selectByList("DASH100SEL14", vo);
	}

	@Override
	public List<DASH100VO> DASH100SEL19(DASH100VO vo) throws Exception {
		return dao.selectByList("DASH100SEL19", vo);
	}
	@Override
	public int DASH100INS19(DASH100VO DASH100VO) throws Exception {
		return dao.sqlInsert("DASH100INS19", DASH100VO);
	}
}
