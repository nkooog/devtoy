package org.crm.cmmt.service.impl;

import org.crm.cmmt.VO.CMMT500VO;
import org.crm.cmmt.service.CMMT500Service;
import org.crm.cmmt.service.dao.CMMTCommDAO;
import org.crm.util.com.ComnFun;
import org.crm.util.crypto.AES256Crypt;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;

/***********************************************************************************************
 * Program Name : 쪽지관리 ServiceImpl
 * Creator      : 이민호
 * Create Date  : 2022.04.27
 * Description  : 쪽지관리 메인
 * Modify Desc  :
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.04.27      이민호           최초생성
 ************************************************************************************************/
@Service("CMMT500Service")
public class CMMT500ServiceImpl implements CMMT500Service {

	@Resource(name = "CMMTCommDAO")
	private CMMTCommDAO cmmt500DAO;

	@Override
	public List<CMMT500VO> CMMT500SEL01(HashMap<String, Object> vo) throws Exception {
		List<CMMT500VO> CMMT500VOlist = cmmt500DAO.selectByList("CMMT500SEL01", vo);

		if (CMMT500VOlist.size() > 0) {
			for (CMMT500VO cmmt500VO : CMMT500VOlist) {
				dataPreProcessing(cmmt500VO);
			}
		}
		return CMMT500VOlist;
	}

	@Override
	public CMMT500VO CMMT500SEL02(CMMT500VO vo) throws Exception {
		CMMT500VO cmmt500VO = (CMMT500VO) cmmt500DAO.selectByOne("CMMT500SEL02", vo);
		dataPreProcessing(cmmt500VO);
		return cmmt500VO;

	}

	private void dataPreProcessing(CMMT500VO cmmt500VO) throws Exception {
		cmmt500VO.setDpchmnNm(AES256Crypt.decrypt(cmmt500VO.getDpchmnNm()));
		if (!ComnFun.isEmpty(cmmt500VO.getApndSeq()))
			cmmt500VO.setApndFileSeqList(Arrays.asList(cmmt500VO.getApndSeq().split(",")));
		if (!ComnFun.isEmpty(cmmt500VO.getApndFileNm()))
			cmmt500VO.setApndFileNmList(Arrays.asList(cmmt500VO.getApndFileNm().split(",")));
		if (!ComnFun.isEmpty(cmmt500VO.getApndFileIdxNm()))
			cmmt500VO.setApndFileIdxNmList(Arrays.asList(cmmt500VO.getApndFileIdxNm().split(",")));
		if (!ComnFun.isEmpty(cmmt500VO.getApndFilePsn()))
			cmmt500VO.setApndFilePsnList(Arrays.asList(cmmt500VO.getApndFilePsn().split(",")));
		if (!ComnFun.isEmpty(cmmt500VO.getApndFileSz()))
			cmmt500VO.setApndFileSzList(Arrays.asList(cmmt500VO.getApndFileSz().split(",")));
		if (!ComnFun.isEmpty(cmmt500VO.getRecvrId()))
			cmmt500VO.setRecvrIdList(Arrays.asList(cmmt500VO.getRecvrId().split(",")));
		if (!ComnFun.isEmpty(cmmt500VO.getRecvrOrgCd()))
			cmmt500VO.setRecvrOrgCdList(Arrays.asList(cmmt500VO.getRecvrOrgCd().split(",")));
		if (!ComnFun.isEmpty(cmmt500VO.getRecvrOrgNm()))
			cmmt500VO.setRecvrOrgNmList(Arrays.asList(cmmt500VO.getRecvrOrgNm().split(",")));
		if (!ComnFun.isEmpty(cmmt500VO.getRecvNoteStCd()))
			cmmt500VO.setRecvNoteStCdList(Arrays.asList(cmmt500VO.getRecvNoteStCd().split(",")));

		List<String> tempRecvrNmlist = new ArrayList<>();
		if (!ComnFun.isEmpty(cmmt500VO.getRecvrNm()))
			for (String usr : cmmt500VO.getRecvrNm().split(",")) {
				tempRecvrNmlist.add(AES256Crypt.decrypt(usr));
			}
		cmmt500VO.setRecvrNmList(tempRecvrNmlist);
	}

//	@Override
//	public List<CMMT500VO> CMMT500SEL03(HashMap<String, Object> vo) throws Exception {
//		List<CMMT500VO> CMMT500VOlist = cmmt500DAO.CMMT500SEL03(vo);
//		ConcurrentHashMap<Integer, CMMT500VO> tempMap = new ConcurrentHashMap<Integer, CMMT500VO>();
//
//		for(CMMT500VO list : CMMT500VOlist) {
//			int noteNo = list.getNoteNo();
//
//			if (tempMap.containsKey(noteNo)) {
//				list.setPuslDv(tempMap.get(noteNo).getPuslDv() + "," + list.getPuslDv());
//				list.setRecvrId(tempMap.get(noteNo).getRecvrId() + "," + list.getRecvrId());
//				list.setRecvrNm(tempMap.get(noteNo).getRecvrNm() + "," + list.getRecvrNm());
//				list.setRecvrOrgCd(tempMap.get(noteNo).getRecvrOrgCd() + "," + list.getRecvrOrgCd());
//				list.setRecvNoteStCd(tempMap.get(noteNo).getRecvNoteStCd() + "," + list.getRecvNoteStCd());
//			}
//			tempMap.put(noteNo, list);
//		}
//		List<CMMT500VO> mergeList = new ArrayList<CMMT500VO>();
//
//		for(int key : tempMap.keySet()) {
//			mergeList.add(dataPreProcessing(tempMap.get(key)));
//		}
//		return mergeList;
//	}

	@Override
	public List<CMMT500VO> CMMT500SEL03(HashMap<String, Object> vo) throws Exception {
		List<CMMT500VO> CMMT500VOlist = cmmt500DAO.selectByList("CMMT500SEL03", vo);

		if (CMMT500VOlist.size() > 0) {
			for (CMMT500VO cmmt500VO : CMMT500VOlist) {
				dataPreProcessing(cmmt500VO);
			}
		}
		return CMMT500VOlist;
	}

	@Override
	public int CMMT500UPT02(CMMT500VO vo) {
		int result = 0;

		try {
			result = cmmt500DAO.sqlUpdate("CMMT500UPT02", vo);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return result;
	}

	@Override
	public int CMMT500UPT03(CMMT500VO vo) {
		int result = 0;

		try {
			result = cmmt500DAO.sqlUpdate("CMMT500UPT03", vo);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return result;
	}

	@Override
	public int CMMT500UPT09(CMMT500VO vo) {
		int result = 0;

		try {
			result = cmmt500DAO.sqlUpdate("CMMT500UPT09", vo);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return result;
	}

	@Override
	public int CMMT500DEL01(CMMT500VO vo) throws Exception {
		int result1 = cmmt500DAO.sqlDelete("CMMT500DEL01_dpch", vo);
		int result2 = cmmt500DAO.sqlDelete("CMMT500DEL01_recv", vo);
		return result1 + result2;
	}

	@Override
	public List<CMMT500VO> CMMT500SEL11(CMMT500VO vo) throws Exception {
		inputSearchDate(vo);
		List<CMMT500VO> CMMT500VOList = cmmt500DAO.selectByList("CMMT500SEL11", vo);
		return decryptUsrNm(CMMT500VOList, 0);
	}

	@Override
	public List<CMMT500VO> CMMT500SEL12(CMMT500VO vo) throws Exception {
		inputSearchDate(vo);
		List<CMMT500VO> CMMT500VOList = cmmt500DAO.selectByList("CMMT500SEL12", vo);
		return decryptUsrNm(CMMT500VOList, 1);
	}

	@Override
	public List<CMMT500VO> CMMT500SEL13(CMMT500VO vo) throws Exception {
		inputSearchDate(vo);
		List<CMMT500VO> CMMT500VOList = cmmt500DAO.selectByList("CMMT500SEL13", vo);
		return decryptUsrNm(CMMT500VOList, 1);
	}
	
	@Override
	public List<CMMT500VO> CMMT500SEL14(CMMT500VO vo) throws Exception {
		List<CMMT500VO> dataList = cmmt500DAO.selectByList("CMMT500SEL14", vo);
		return dataList;
	}

	private void inputSearchDate(CMMT500VO vo) {
		vo.setSrchDtFrom(ComnFun.getStartDateTimeToString(vo.getSetDay()));
		vo.setSrchDtTo(ComnFun.getNowDateTimeToString());
	}

	private List<CMMT500VO> decryptUsrNm(List<CMMT500VO> list, int flag) throws Exception {
		if (list.size() > 0) {
			for (CMMT500VO cmmt500VO : list) {
				cmmt500VO.setDpchmnNm(AES256Crypt.decrypt(cmmt500VO.getDpchmnNm()));
				if (flag == 1) {
					String reciver = AES256Crypt.decrypt(cmmt500VO.getRecvrNm());
					if (cmmt500VO.getRecvrCnt() > 1) {
						cmmt500VO.setRecvrNm(reciver + " 외 " + cmmt500VO.getRecvrCnt() + "명");
					} else {
						cmmt500VO.setRecvrNm(reciver);
					}
				} else {
					cmmt500VO.setRecvrNm(AES256Crypt.decrypt(cmmt500VO.getRecvrNm()));
				}
			}
		}
		return list;
	}


}


