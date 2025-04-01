package org.crm.frme.service;


import org.crm.frme.VO.FRME230VO;

import java.util.List;

/**
 * @Class Name   : FRME230Service.java
 * @Description  : 웹프레임 ARS 콜백 Service
 * @Modification 
 * @ -------------------------------------------------------------------------
 * @  수정일                  수정자              수정내용
 * @ -------------------------------------------------------------------------
 * @ 2022.03.03   김보영             최초생성
 * @ -------------------------------------------------------------------------
 * @author CRM Lab실 김보영 연구원
 * @since 2022. 03.03
 * @version 1.0
 * @see
 *
 */


public interface FRME230Service {

	List<FRME230VO> FRME230SEL01(FRME230VO vo) throws Exception;

	Integer FRME230UPT01(FRME230VO vo) throws Exception;

	List<FRME230VO> FRME230SEL02(FRME230VO vo) throws Exception;
	
	List<FRME230VO> FRME230SEL03(FRME230VO vo) throws Exception;

	int FRME230UPT02(FRME230VO vo) throws Exception;

	int FRME230UPT03(List<FRME230VO> vo)throws Exception;

	int FRME230INS01(List<FRME230VO> vo)throws Exception;

	int FRME230UPT04(List<FRME230VO> vo)throws Exception;
}
