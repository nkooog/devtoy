package org.crm.comm.model.vo;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.util.List;

/***********************************************************************************************
* Program Name : 공통 검색 VO
* Creator      : jrlee
* Create Date  : 2022.04.25
* Description  : 공통 검색
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.04.25    jrlee           최초생성
************************************************************************************************/
@Getter
@Setter
@NoArgsConstructor @AllArgsConstructor
@SuperBuilder
public class CmmnSrchVO {
	private String srchCond;
	private String srchText;
	private List<String> srchList;
	private String srchDt;
	private String srchDtTo;
	private String srchDtFrom;
	
	public String getSrchCond() {
		return srchCond;
	}

	public void setSrchCond(String srchCond) {
		this.srchCond = srchCond;
	}

	public String getSrchText() {
		return srchText;
	}

	public void setSrchText(String srchText) {
		this.srchText = srchText;
	}

	public List<String> getSrchList() {
		return srchList;
	}

	public void setSrchList(List<String> srchList) {
		this.srchList = srchList;
	}

	public String getSrchDt() {
		return srchDt;
	}

	public void setSrchDt(String srchDt) {
		this.srchDt = srchDt;
	}

	public String getSrchDtTo() {
		return srchDtTo;
	}

	public void setSrchDtTo(String srchDtTo) {
		this.srchDtTo = srchDtTo;
	}

	public String getSrchDtFrom() {
		return srchDtFrom;
	}

	public void setSrchDtFrom(String srchDtFrom) {
		this.srchDtFrom = srchDtFrom;
	}

}
