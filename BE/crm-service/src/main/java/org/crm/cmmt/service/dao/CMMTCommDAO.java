package org.crm.cmmt.service.dao;

import org.crm.comm.MapperTemplate;
import org.apache.ibatis.session.SqlSession;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository("CMMTCommDAO")
public class CMMTCommDAO<T> extends MapperTemplate<T> {

	public CMMTCommDAO(SqlSession session) {
		super(session);
	}

	@Override
	public int selectByCount(String queryId, T clazz) {
		return super.selectByCount(queryId, clazz);
	}

	@Override
	public <T1> T1 selectByOne(String queryId, T1 clazz) {
		return super.selectByOne(queryId, clazz);
	}

	@Override
	public <T1> List<T1> selectByList(String queryId, T1 clazz) {
		return super.selectByList(queryId, clazz);
	}

	@Override
	public int sqlInsert(String queryId, T clazz) {
		return super.sqlInsert(queryId, clazz);
	}

	@Override
	public int sqlDelete(String queryId, T clazz) {
		return super.sqlDelete(queryId, clazz);
	}

	@Override
	public int sqlUpdate(String queryId, T clazz) {
		return super.sqlUpdate(queryId, clazz);
	}
}
