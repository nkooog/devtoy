package org.crm.frme.service.dao;

import org.apache.ibatis.session.SqlSession;
import org.crm.comm.MapperTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository("FRMECommDAO")
public class FRMECommDAO extends MapperTemplate {
	public FRMECommDAO(SqlSession session) {
		super(session);
	}

	@Override
	public int selectByCount(String queryId, Object clazz) {
		return super.selectByCount(queryId, clazz);
	}

	@Override
	public Object selectByOne(String queryId, Object clazz) {
		return super.selectByOne(queryId, clazz);
	}

	@Override
	public List selectByList(String queryId, Object clazz) {
		return super.selectByList(queryId, clazz);
	}

	@Override
	public int sqlInsert(String queryId, Object clazz) {
		return super.sqlInsert(queryId, clazz);
	}

	@Override
	public int sqlDelete(String queryId, Object clazz) {
		return super.sqlDelete(queryId, clazz);
	}

	@Override
	public int sqlUpdate(String queryId, Object clazz) {
		return super.sqlUpdate(queryId, clazz);
	}
}
