package org.crm.sysm.model.service.impl;

import jakarta.annotation.Resource;
import org.crm.sysm.model.service.SYSM110Service;
import org.crm.sysm.model.service.dao.SYSMCommDAO;
import org.crm.sysm.model.vo.SYSM110VO;
import org.springframework.stereotype.Service;

import java.util.List;

@Service("SYSM110Service")
public class SYSM110ServiceImpl implements SYSM110Service {

	@Resource(name="SYSMCommDAO")
	private SYSMCommDAO dao;

	@Override
	public List<SYSM110VO> SYSM110SEL03(SYSM110VO vo) throws Exception {
		return this.dao.selectByList("SYSM110SEL03", vo);
	}
}
