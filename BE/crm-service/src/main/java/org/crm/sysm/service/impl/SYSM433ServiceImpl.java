package org.crm.sysm.service.impl;

import java.util.ArrayList;
import java.util.List;

import jakarta.annotation.Resource;

import org.springframework.stereotype.Service;

import org.crm.sysm.VO.SYSM433VO;
import org.crm.sysm.service.SYSM433Service;
import org.crm.sysm.service.dao.SYSMCommDAO;
import org.crm.util.com.ComnFun;
import org.crm.util.crypto.AES256Crypt;
import org.crm.util.date.DateUtil;

/***********************************************************************************************
* Program Name : 메타공통코드관리 ServiceImpl
* Creator      : 허해민
* Create Date  : 2022.01.17
* Description  : 메타공통코드관리
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.01.17     허해민           최초생성
************************************************************************************************/
@Service("SYSM433Service")
public class SYSM433ServiceImpl implements SYSM433Service {

	@Resource(name = "SYSMCommDAO")
	private SYSMCommDAO sysm433DAO;
	
	
	@Override
	public List<SYSM433VO> SYSM433SEL01(SYSM433VO sysm433VO) throws Exception {
		
		if(!sysm433VO.getSrchCond().toString().equals("1")) {
			if("Y".equals(sysm433VO.getEncryptYn())) {
				sysm433VO.setSrchText(AES256Crypt.encrypt(sysm433VO.getSrchText()));
			}
		}
		
		List<SYSM433VO> SYSM433VOList = sysm433DAO.selectByList("SYSM433SEL01", sysm433VO); 

		if (SYSM433VOList.size()>0) {
			for (SYSM433VO sysm433vo : SYSM433VOList) {
				
				if("Y".equals(sysm433vo.getEncryptYn())) {
					sysm433vo.setCustNm(AES256Crypt.decrypt(sysm433vo.getCustNm()));
					sysm433vo.setMbleTelNo(AES256Crypt.decrypt(sysm433vo.getMbleTelNo()));
					sysm433vo.setBtdt(AES256Crypt.decrypt(sysm433vo.getBtdt()));
				}
				
				sysm433vo.setCntcTelNo(AES256Crypt.decrypt(sysm433vo.getCntcTelNo()));

			}
		}
		
		return SYSM433VOList;
	}
	
	
	@Override
	public List<SYSM433VO> SYSM433SEL02(SYSM433VO sysm433VO) throws Exception {
		
		
		List<SYSM433VO> SYSM433VOList = sysm433DAO.selectByList("SYSM433SEL02", sysm433VO); 

		if("Y".equals(sysm433VO.getEncryptYn())) {
			if (SYSM433VOList.size()>0) {
				for (int i=0; i<SYSM433VOList.size(); i++) {
					
					if(!ComnFun.isEmpty(SYSM433VOList.get(i).getCustNm())){
						SYSM433VOList.get(i).setCustNm(AES256Crypt.decrypt(SYSM433VOList.get(i).getCustNm()));
					}
					
					if(!ComnFun.isEmpty(SYSM433VOList.get(i).getBtdt())){
						SYSM433VOList.get(i).setBtdt(AES256Crypt.decrypt(SYSM433VOList.get(i).getBtdt()));
					}
					
					if(!ComnFun.isEmpty(SYSM433VOList.get(i).getMbleTelNo())){
						SYSM433VOList.get(i).setMbleTelNo(AES256Crypt.decrypt(SYSM433VOList.get(i).getMbleTelNo()));
					}
				}
			}
		}
		
		return SYSM433VOList;
	}
	
	@Override
	public List<SYSM433VO> SYSM433SEL03(SYSM433VO sysm433VO) throws Exception {
		
		if(sysm433VO.getRecvrTelNo() != null && !sysm433VO.getRecvrTelNo().toString().equals("")) {
			if("Y".equals(sysm433VO.getEncryptYn())) {
				sysm433VO.setRecvrTelNo(AES256Crypt.encrypt(sysm433VO.getRecvrTelNo()));
			}
		}

		List<SYSM433VO> SYSM433VOList = sysm433DAO.selectByList("SYSM433SEL03", sysm433VO);

		if (SYSM433VOList.size()>0) {
			for (int i=0; i<SYSM433VOList.size(); i++) {
				if(SYSM433VOList.get(i).getCustNm() != null) {
					SYSM433VOList.get(i).setCustNm(AES256Crypt.decrypt(SYSM433VOList.get(i).getCustNm()));
				}
			}
		}

		return SYSM433VOList;
	}
	
	@Override
	public List<SYSM433VO> SYSM433SEL04(SYSM433VO sysm433VO) throws Exception {
		return sysm433DAO.selectByList("SYSM433SEL04", sysm433VO);
	}
	
	@Override
	public List<SYSM433VO> SYSM433SEL05(SYSM433VO sysm433VO) throws Exception {
		return sysm433DAO.selectByList("SYSM433SEL05", sysm433VO);
	}

	@Override
	public SYSM433VO SYSM433SEL07(SYSM433VO sysm433VO) throws Exception {
		return (SYSM433VO) sysm433DAO.selectByOne("SYSM433SEL07", sysm433VO);
	}
	
	@Override
	public Integer SYSM433UPT01(List<SYSM433VO> sysm433voList) throws Exception {
		return sysm433DAO.sqlUpdate("SYSM433UPT01", sysm433voList);
	}
	
	@Override
	public Integer SYSM433INS01(List<SYSM433VO> sysm433voList) throws Exception {
		
		List<SYSM433VO> list = new ArrayList<SYSM433VO>();

		if (sysm433voList.size() > 0) {
			
			for (SYSM433VO sysm433vo : sysm433voList) {
				
				//kw---20230413 : 이미지 첨부 파일 데이터 추가
				if(sysm433vo.getFilePath().length > 0) {
					String[] arrFileNameOrg = sysm433vo.getFileNameOrg();
					String[] arrFileNameSave = sysm433vo.getFileNameSave();
					String[] arrFilePath = sysm433vo.getFilePath();
					
					for(int i=0; i<arrFileNameOrg.length; i++) {
						switch (i){		
							case 0:
								sysm433vo.setApndFileNm1(arrFileNameOrg[i]);
								sysm433vo.setApndFileIdx_nm1(arrFileNameSave[i]);
								sysm433vo.setApndFilePsn1(arrFilePath[i]);
								break;
							case 1:
								sysm433vo.setApndFileNm2(arrFileNameOrg[i]);
								sysm433vo.setApndFileIdx_nm2(arrFileNameSave[i]);
								sysm433vo.setApndFilePsn2(arrFilePath[i]);
								break;
							case 2:
								sysm433vo.setApndFileNm3(arrFileNameOrg[i]);
								sysm433vo.setApndFileIdx_nm3(arrFileNameSave[i]);
								sysm433vo.setApndFilePsn3(arrFilePath[i]);
								break;
						}
					}
				}

				String custNmSrchkey1 = "";		//성
				String custNmSrchkey2 = "";		//성+가운데 글자
				String recvrTelNoSrchkey = ""; 	//전화번호
				
				//kw--- 20230413  : 수신번호를 직접 입력시 수신자의 이름을 알 수 없기 때문에 다음과 같은 조건문 추가
				if(sysm433vo.getCustNm() != null && !sysm433vo.getCustNm().equals("")) {
					
					
					
					//이름 키워드 추출
					if(sysm433vo.getCustNm().length() > 0){
						if(sysm433vo.getCustNm().length() >= 2) {
							custNmSrchkey1 = sysm433vo.getCustNm().substring(0,1);
							custNmSrchkey2 = sysm433vo.getCustNm().substring(0,2);
						} else {
							custNmSrchkey1 = sysm433vo.getCustNm().substring(0,1);
							custNmSrchkey2 = sysm433vo.getCustNm().substring(0,1);
						}
					}
				} else {
					sysm433vo.setCustNm("");
				}
				
				//전화번호 키워드 추출
				if(sysm433vo.getRecvrTelNo().length() > 3) {
					recvrTelNoSrchkey = sysm433vo.getRecvrTelNo().substring(sysm433vo.getRecvrTelNo().length() - 4, sysm433vo.getRecvrTelNo().length());
				}
				
				//연령대 계산
				//kw---20230413 : 수신번호를 직접 입력시 생년월일은 알 수 없기 때문에 다음과 같은 조건 문 추가
				String byAge = "";
				if(sysm433vo.getBtdt() == null) {
					sysm433vo.setBtdt("99");
					byAge = "99";
				} else {
					byAge = DateUtil.getByAge(sysm433vo.getBtdt());	//생년월일이 없거나 잘못 된 값일 경우 99반환
				}
				
				sysm433vo.setCustNm(AES256Crypt.encrypt(String.valueOf(sysm433vo.getCustNm())));
				sysm433vo.setCustNmSrchkey1(AES256Crypt.encrypt(String.valueOf(custNmSrchkey1)));
				sysm433vo.setCustNmSrchkey2(AES256Crypt.encrypt(String.valueOf(custNmSrchkey2)));
				sysm433vo.setRecvrTelNo(AES256Crypt.encrypt(String.valueOf(sysm433vo.getRecvrTelNo())));
				sysm433vo.setRecvrTelNoSrchkey(AES256Crypt.encrypt(String.valueOf(recvrTelNoSrchkey)));
				sysm433vo.setAgelrgCd(byAge);
				
				list.add(sysm433vo);
			}
		}

		return sysm433DAO.sqlInsert("SYSM433INS01", list);
	}

	@Override
	public List<SYSM433VO> SYSM433SEL06(SYSM433VO sysm433VO) throws Exception {
		return sysm433DAO.selectByList("SYSM433SEL06", sysm433VO);
	}
}