package org.crm.util.es.jsonObject;

import java.util.List;

public class SearchObject {

	public SearchObject(String serviceName, boolean admin){
		serviceName =serviceName.toLowerCase();

		if(serviceName.equals("kmst200")||serviceName.equals("kmst300")||serviceName.equals("cmmt200")){
			this.serviceName = serviceName;
		}else{
		    this.serviceName = "kmst300";
		}
		this.admin = admin;
	}
	boolean admin;
	/**
	 * @param kmst200_cmmt200_kmst300,
	 */
	String serviceName;

	//Setting
	String searchType;
	String searchText;

	String loginId;
	List<String> regrIds;
	List<Long> ctgrMgntNo;
	List<String> stCds;

	String searchStartDate;
	String searchEndDate;

	public boolean getAdmin() {
		return admin;
	}

	public String getServiceName() {
		return serviceName;
	}

	public String getLoginId() {
		return loginId;
	}
	public void setLoginId(String loginId) {
		this.loginId = loginId;
	}

	public String getSearchType() {
		return searchType;
	}
	public void setSearchType(String searchType) {
		this.searchType = searchType;
	}
	public String getSearchText() {
		return searchText;
	}
	public void setSearchText(String searchText) {
		this.searchText = searchText;
	}

	public List<String> getRegrIds() {
		return regrIds;
	}
	public void setRegrIds(List<String> regrIds) {
		this.regrIds = regrIds;
	}
	public List<Long> getCtgrMgntNo() {return ctgrMgntNo;	}
	public void setCtgrMgntNo(List<Long> ctgrMgntNo) {
		this.ctgrMgntNo = ctgrMgntNo;
	}
	public List<String> getStCds() {return stCds;}
	public void setStCds(List<String> stCds) {this.stCds = stCds;}

	public String getSearchStartDate() {
		return searchStartDate;
	}
	public void setSearchStartDate(String searchStartDate) {this.searchStartDate = searchStartDate.replaceAll("-","");}
	public String getSearchEndDate() {
		return searchEndDate;
	}
	public void setSearchEndDate(String searchEndDate) {
		this.searchEndDate = searchEndDate.replaceAll("-","");
	}


}
