package org.crm.sysm.service.impl;

import org.crm.sysm.VO.SYSM510VO;
import org.crm.sysm.service.SYSM510Service;
import org.crm.sysm.service.dao.SYSMCommDAO;
import jakarta.annotation.Resource;

import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

/***********************************************************************************************
 * Program Name : 테넌트기준정보구성 ServiceImpl
 * Creator      : jrlee
 * Create Date  : 2022.11.04
 * Description  : 테넌트기준정보구성
 * Modify Desc  :
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.11.04     mhlee           최초생성
 ************************************************************************************************/
@Service("SYSM510Service")
public class SYSM510ServiceImpl implements SYSM510Service {

	@Resource(name="SYSMCommDAO")
	private SYSMCommDAO sysm510Mapper;

	@Override
	public List<SYSM510VO> SYSM510SEL01(SYSM510VO vo) throws Exception {
		return sysm510Mapper.selectByList("SYSM510SEL01", vo);
	}

	@Override
	public int SYSM510INS01(List<SYSM510VO> list) throws Exception {
		return sysm510Mapper.sqlInsert("SYSM510INS01", list);
	}

	@Override
	public int SYSM510DEL01(List<SYSM510VO> list) throws Exception {
		List<SYSM510VO> validate = list.stream().filter(x->x.getTenantId().contains("BRD")).collect(Collectors.toList());
		if (validate.size() > 0) {
			return -1;
		}
		sysm510Mapper.sqlDelete("SYSM510DEL02", list);
		return sysm510Mapper.sqlDelete("SYSM510DEL01", list);
	}

	@Override
	public int SYSM510CopyBasicData(List<SYSM510VO> list) throws Exception {
		if (list.size() > 0) {
			String tempTableName = tempTableEnum.TABLE.getTableName();
			list.forEach(x->x.setTempTable(tempTableName));
		}
		// step1. 표준데이터 복사
		int rtn = sysm510Mapper.sqlInsert("SYSM510CopyBasicData", list);

		// step2. 복사 table 등록일, 등록자, 등록자 조직코드 Update
		
		int cnt = 0;
		
		for (SYSM510VO vo : list) {
			
			if (vo.getBascInfoTblId().contains("USR_INFO_MGNT")) {
				sysm510Mapper.sqlUpdate("SYSM510MUpdateUsrInfo", vo);
			}
			
			sysm510Mapper.sqlUpdate("SYSM510UpdateColumnReg", vo);
			
			int lstResult = sysm510Mapper.selectByCount("SYSM510CheckColumnLst", vo);
			if (lstResult > 0) {
				sysm510Mapper.sqlUpdate("SYSM510UpdateColumnLst", vo);
			}

			if(cnt == 0) {
				int delete = sysm510Mapper.sqlDelete("SYSM510deleteUnRegCust", vo);
				if (delete > 0 )sysm510Mapper.sqlInsert("SYSM510insertUnRegCust", vo);
			}
			
			cnt++;
		}
		return sysm510Mapper.sqlUpdate("SYSM510UPT01", list);
	}

	private enum tempTableEnum {
		TABLE("TEMP_TABLE");

		private final String tableName;
		tempTableEnum(String tableName) {
			this.tableName = tableName;
		}
		public String getTableName() { return tableName; }
	}
	
	@Override
	public int SYSM510UPT02(SYSM510VO vo)  throws Exception {
		return sysm510Mapper.sqlUpdate("SYSM510UPT02", vo);
	}
}
