package org.crm.cmmt.service.impl;

import org.crm.cmmt.VO.CMMT400VO;
import org.crm.cmmt.VO.CMMT440VO;
import org.crm.cmmt.service.CMMT400Service;
import org.crm.cmmt.service.dao.CMMTCommDAO;
import org.crm.dash.VO.DASH100VO;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
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
@Service("CMMT400Service")
public class CMMT400ServiceImpl implements CMMT400Service {

	@Resource(name="CMMTCommDAO")
	private CMMTCommDAO CMMT400DAO;

	@Override
	public List<DASH100VO> CMMT400SEL01(CMMT440VO vo) throws Exception {

		List<DASH100VO> calList = CMMT400DAO.selectByList("CMMT400SEL01", vo);

		CMMT400VO vo2 = new CMMT400VO();
		vo2.setTenantId(vo.getTenantId());
		vo2.setRegYr(vo.getRegYr());
		vo2.setUsrId(vo.getUsrId());

		Calendar setCal = Calendar.getInstance();
		DateFormat df = new SimpleDateFormat("yyyyMMddHHmm");
		SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmm");

		List<CMMT400VO> alarmList = CMMT400DAO.selectByList("CMMT400SEL05", vo2);

		String calTime = "";
		int time = 0;

		for(CMMT400VO CMMT400VO : alarmList){
			switch(CMMT400VO.getAlrmStgupCd()){
				case "20":
					time = 10;
					break;
				case "30":
					time = 30;
					break;
				case "40":
					time = 60;
					break;
				case "50":
					time = 120;
					break;
				case "60":
					time = 180;
					break;
			}
			//캘린더 부분
			Date date1 = formatter.parse(CMMT400VO.getSchdStrDd() +CMMT400VO.getSchdStrSi() + CMMT400VO.getSchdStrPt());
			setCal.setTime(date1);
			setCal.add(Calendar.MINUTE, -(time));
			calTime = df.format(setCal.getTime());

			if(calTime.compareTo(df.format(new Date())) < 0) {
				for(DASH100VO DASH100VO : calList){
					if(DASH100VO.getTenantId().equals(CMMT400VO.getTenantId())
						&& DASH100VO.getRegYr().equals(CMMT400VO.getRegYr())
						&& DASH100VO.getUsrId().equals(CMMT400VO.getUsrId())
						&& DASH100VO.getSchdNo()==CMMT400VO.getSchdNo()
						&& CMMT400VO.getAlrmStCd().equals("N")){
							DASH100VO.setAlarmCheck("Y");
					}
				}
			}
		}
		return calList;
	}

	@Override
	public List<DASH100VO> CMMT400SEL02(CMMT440VO vo) throws Exception {
		return CMMT400DAO.selectByList("CMMT400SEL02", vo);
	}

	@Override
	public CMMT400VO CMMT400SEL03(CMMT400VO vo) throws Exception {

		vo.setTenantId(vo.getTenantId());
		vo.setRegYr(vo.getRegYr());
		vo.setUsrId(vo.getUsrId());

		Calendar setCal = Calendar.getInstance();
		DateFormat df = new SimpleDateFormat("yyyyMMddHHmm");
		SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmm");

		List<CMMT400VO> alarmList = CMMT400DAO.selectByList("CMMT400SEL05", vo);

		String calTime = "";
		int time = 0;
		int alarmCnt = 0;
		for(CMMT400VO CMMT400VO : alarmList){
			for(int i =1; i<=CMMT400VO.getAlrmTcnt() ; i++){
				switch(CMMT400VO.getAlrmStgupCd()){
					case "20":
						time = 10;
						break;
					case "30":
						time = 30;
						break;
					case "40":
						time = 60;
						break;
					case "50":
						time = 120;
						break;
					case "60":
						time = 180;
						break;
				}
				int interM = (int) Math.floor(time/CMMT400VO.getAlrmTcnt());

				// 알람 부분
//				Date date1 = formatter.parse(CMMT400VO.getSchdStrDd() +CMMT400VO.getSchdStrSi() + CMMT400VO.getSchdStrPt());
//				setCal.setTime(date1);
//				setCal.add(Calendar.MINUTE, -(interM*i));
//				calTime = df.format(setCal.getTime());

				Date date1 = formatter.parse(CMMT400VO.getSchdStrDd() +CMMT400VO.getSchdStrSi() + CMMT400VO.getSchdStrPt());
				setCal.setTime(date1);
				setCal.add(Calendar.MINUTE, -(time));
				calTime = df.format(setCal.getTime());

				if(calTime.compareTo(df.format(new Date())) < 0 && CMMT400VO.getAlrmStCd().equals("N")) {
					alarmCnt++;
					i = CMMT400VO.getAlrmTcnt();
				}
			}
		}
		vo.setAlarmCnt(alarmCnt);

		return vo;
	}


	@Override
	public Integer CMMT400UPT01(CMMT400VO vo) throws Exception {
		return CMMT400DAO.sqlUpdate("CMMT400UPT01", vo);
	}

	@Override
	public Integer CMMT400UPT02(CMMT400VO vo) throws Exception {
		return CMMT400DAO.sqlUpdate("CMMT400UPT02", vo);
	}

}
 