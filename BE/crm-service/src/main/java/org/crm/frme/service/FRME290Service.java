package org.crm.frme.service;

import org.crm.frme.model.dto.FRME290DTO;
import org.crm.frme.model.vo.FRME290VO;

import java.util.List;

public interface FRME290Service {
	List<FRME290VO> FRME290SEL01(FRME290DTO frme290DTO) throws Exception;
	Integer FRME290UPT01(FRME290DTO frme290DTO) throws Exception;
}
