package org.crm.frme.service.impl;

import jakarta.annotation.Resource;
import org.crm.frme.model.dto.FRME290DTO;
import org.crm.frme.model.vo.FRME290VO;
import org.crm.frme.service.FRME290Service;
import org.crm.frme.service.dao.FRMECommDAO;
import org.springframework.stereotype.Service;

import java.util.List;

@Service("FRME290Service")
public class FRME290ServiceImpl implements FRME290Service {

	@Resource(name = "FRMECommDAO")
	private FRMECommDAO dao;

	@Override
	public List<FRME290VO> FRME290SEL01(FRME290DTO frme290DTO) throws Exception {
		return dao.selectByList("FRME290SEL01", frme290DTO);
	}

	@Override
	public Integer FRME290UPT01(FRME290DTO frme290DTO) throws Exception {
		return dao.sqlUpdate("FRME290UPT01", frme290DTO);
	}
}
