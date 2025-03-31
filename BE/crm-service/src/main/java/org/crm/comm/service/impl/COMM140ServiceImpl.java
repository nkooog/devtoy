package org.crm.comm.service.impl;

import org.crm.comm.VO.COMM140VO;
import org.crm.comm.service.COMM140Service;
import org.crm.comm.service.dao.COMMCommDAO;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/***********************************************************************************************
* Program Name : 영업일관리 Service
* Creator      : sjyang
* Create Date  : 2022.12.26
* Description  : 공통 서비스
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.12.26     sjyang            최초생성
************************************************************************************************/
@Service("COMM140Service")
@Transactional
public class COMM140ServiceImpl implements COMM140Service{
	@Resource(name="COMMCommDAO")
	private COMMCommDAO dao;

	@Override
	public List<COMM140VO> COMM140SEL01(COMM140VO vo) throws Exception {
		
		String searchBussDtDv 	= vo.getSearchBussDtDv();
		String yearsConditions 	= vo.getYearsConditions();
		String searchLhldDv		= vo.getSearchLhldDv();
		String daysConditions 	= vo.getDaysConditions();
		
		//연도 구분 조건
		if(!"".equals(searchBussDtDv)) {
			//연도 구분 : 연도
			if("Y1".equals(searchBussDtDv)) {
				List<String> searchYearsY1 = new ArrayList<String>();
				//String arrYears[] = vo.getYearsConditions().split(",");
				String arrYears[] = yearsConditions.split(",");
				for(int i=0;i<arrYears.length;i++) {
					String year = arrYears[i];
					if(!"".equals(year)) {
						searchYearsY1.add(year);
					}
				}
				vo.setSearchYearsY1(searchYearsY1);
			}
			
			//연도 구분 : 연도(구간)
			if("Y2".equals(searchBussDtDv)) {
				if(!"".equals(yearsConditions)) {
					String arrYears[] = yearsConditions.split(",");
					vo.setSearchFrom(arrYears[0]);
					vo.setSearchTo(arrYears[1]);
				}
			}
			
			//연도 구분 : 연월
			if("Y3".equals(searchBussDtDv)) {
				List<String> searchYearMonthY3 = new ArrayList<String>();
				String arrYearMonth[] = yearsConditions.split(",");
				for(int i=0;i<arrYearMonth.length;i++) {
					String yearMonth = arrYearMonth[i];
					if(!"".equals(yearMonth)) {
						searchYearMonthY3.add(yearMonth);
					}
				}
				vo.setSearchYearMonthY3(searchYearMonthY3);
			}
			
			//연도 구분 : 연도(구간)
			if("Y4".equals(searchBussDtDv)) {
				if(!"".equals(yearsConditions)) {
					String arrYears[] = yearsConditions.split(",");
					vo.setSearchFrom(arrYears[0]);
					vo.setSearchTo(arrYears[1]);
				}
			}
			
			//연도 구분 : 연월일(구간)
			if("Y6".equals(searchBussDtDv)) {
				if(!"".equals(yearsConditions)) {
					String arrYears[] = yearsConditions.split(",");
					vo.setSearchFrom(arrYears[0]);
					vo.setSearchTo(arrYears[1]);
				}
			}
		}
		
		//휴일 구분 조건
		if(!"".equals(searchLhldDv)) {
			//daysConditions
			List<String> searchDaysConditions = new ArrayList<String>();
			String arrDays[] = daysConditions.split(",");
			for(int i=0;i<arrDays.length;i++) {
				String condition = arrDays[i];
				if(!"".equals(condition)) {
					searchDaysConditions.add(condition);
				}
			}
			vo.setSearchDaysConditions(searchDaysConditions);
		}
		
		List<COMM140VO> list = dao.selectByList("COMM140SEL01" , vo);

		return list;
    }

	@Override
	public int COMM140UPT01(List<COMM140VO> vo) throws Exception{
		return dao.sqlUpdate("COMM140UPT01" , vo) ;
	}
	
}
