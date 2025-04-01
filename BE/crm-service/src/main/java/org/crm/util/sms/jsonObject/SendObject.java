package org.crm.util.sms.jsonObject;

import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public class SendObject {
	//INFOCallback, uploadFilePathes, uploadFiles 현재 미사용

	String tenantPrefix;
	String sysPrefix;
	String phone;
	String callback;
	String tmplMgntNo;
	String msg;
	String agentId;
	String customerId;
	String cldDv;
	String jsonList;
	String sitename;

	List<MultipartFile> fileList;
	
	String[] filePath;
	String filePath1;
	
	
	public String getTenantPrefix() {
		return tenantPrefix;
	}
	public void setTenantPrefix(String tenantPrefix) {
		this.tenantPrefix = tenantPrefix;
	}
	public String getSysPrefix() {
		return sysPrefix;
	}
	public void setSysPrefix(String sysPrefix) {
		this.sysPrefix = sysPrefix;
	}
	public String getPhone() {
		return phone;
	}
	public void setPhone(String phone) {
		this.phone = phone;
	}
	public String getCallback() {
		return callback;
	}
	public void setCallback(String callback) {
		this.callback = callback;
	}
	public String getTmplMgntNo() {
		return tmplMgntNo;
	}
	public void setTmplMgntNo(String tmplMgntNo) {
		this.tmplMgntNo = tmplMgntNo;
	}
	public String getMsg() {
		return msg;
	}
	public void setMsg(String msg) {
		this.msg = msg;
	}
	public String getAgentId() {
		return agentId;
	}
	public void setAgentId(String agentId) {
		this.agentId = agentId;
	}
	public String getCustomerId() {
		return customerId;
	}
	public void setCustomerId(String customerId) {
		this.customerId = customerId;
	}
	public String getCldDv() {
		return cldDv;
	}
	public void setCldDv(String cldDv) {
		this.cldDv = cldDv;
	}
	public String getJsonList() {
		return jsonList;
	}
	public void setJsonList(String jsonList) {
		this.jsonList = jsonList;
	}
	public String getSitename() {
		return sitename;
	}
	public void setSitename(String sitename) {
		this.sitename = sitename;
	}
	public List<MultipartFile> getFileList() {
		return fileList;
	}
	public void setFileList(List<MultipartFile> fileList) {
		this.fileList = fileList;
	}
	public String[] getFilePath() {
		return filePath;
	}
	public void setFilePath(String[] filePath) {
		this.filePath = filePath;
	}
	public String getFilePath1() {
		return filePath1;
	}
	public void setFilePath1(String filePath1) {
		this.filePath1 = filePath1;
	}

	

}
