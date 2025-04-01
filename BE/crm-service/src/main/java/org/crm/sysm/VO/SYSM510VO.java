package org.crm.sysm.VO;

import java.sql.Timestamp;

/***********************************************************************************************
 * Program Name : 테넌트기준정보구성 VO
 * Creator      : mhlee
 * Create Date  : 2022.11.04
 * Description  : 테넌트기준정보구성
 * Modify Desc  :
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.11.04     mhlee            최초생성
 ************************************************************************************************/
public class SYSM510VO {
    private String tenantId;

    private String targetTenantId;
    private String tableName;
    private int seq;
    private String bascInfoCd;
    private String bascInfoNm;
    private String bascInfoTblId;
    private String frzgStgupRlsCd;
    private String otxtTenantId;
    private String prgrStgCd;
    private int dataCreNcnt;
    private Timestamp tagtInfoCreDtm;
    private Timestamp lstCorcDtm;
    private String lstCorprId;
    private String lstCorprOrgCd;
    private String tempTable;

    private String tempUser;

    public String getTempUser() {
        return tempUser;
    }

    public void setTempUser(String tempUser) {
        this.tempUser = tempUser;
    }

    public String getTempTable() {
        return tempTable;
    }

    public void setTempTable(String tempTable) {
        this.tempTable = tempTable;
    }

    public String getTenantId() {
        return tenantId;
    }

    public void setTenantId(String tenantId) {
        this.tenantId = tenantId;
    }

    public String getTargetTenantId() {
        return targetTenantId;
    }

    public void setTargetTenantId(String targetTenantId) {
        this.targetTenantId = targetTenantId;
    }

    public String getTableName() {
        return tableName;
    }

    public void setTableName(String tableName) {
        this.tableName = tableName;
    }

    public int getSeq() {
        return seq;
    }

    public void setSeq(int seq) {
        this.seq = seq;
    }

    public String getBascInfoCd() {
        return bascInfoCd;
    }

    public void setBascInfoCd(String bascInfoCd) {
        this.bascInfoCd = bascInfoCd;
    }

    public String getBascInfoNm() {
        return bascInfoNm;
    }

    public void setBascInfoNm(String bascInfoNm) {
        this.bascInfoNm = bascInfoNm;
    }

    public String getBascInfoTblId() {
        return bascInfoTblId;
    }

    public void setBascInfoTblId(String bascInfoTblId) {
        this.bascInfoTblId = bascInfoTblId;
    }

    public String getFrzgStgupRlsCd() {
        return frzgStgupRlsCd;
    }

    public void setFrzgStgupRlsCd(String frzgStgupRlsCd) {
        this.frzgStgupRlsCd = frzgStgupRlsCd;
    }

    public String getOtxtTenantId() {
        return otxtTenantId;
    }

    public void setOtxtTenantId(String otxtTenantId) {
        this.otxtTenantId = otxtTenantId;
    }

    public String getPrgrStgCd() {
        return prgrStgCd;
    }

    public void setPrgrStgCd(String prgrStgCd) {
        this.prgrStgCd = prgrStgCd;
    }

    public int getDataCreNcnt() {
        return dataCreNcnt;
    }

    public void setDataCreNcnt(int dataCreNcnt) {
        this.dataCreNcnt = dataCreNcnt;
    }

    public Timestamp getTagtInfoCreDtm() {
        return tagtInfoCreDtm;
    }

    public void setTagtInfoCreDtm(Timestamp tagtInfoCreDtm) {
        this.tagtInfoCreDtm = tagtInfoCreDtm;
    }

    public Timestamp getLstCorcDtm() {
        return lstCorcDtm;
    }

    public void setLstCorcDtm(Timestamp lstCorcDtm) {
        this.lstCorcDtm = lstCorcDtm;
    }

    public String getLstCorprId() {
        return lstCorprId;
    }

    public void setLstCorprId(String lstCorprId) {
        this.lstCorprId = lstCorprId;
    }

    public String getLstCorprOrgCd() {
        return lstCorprOrgCd;
    }

    public void setLstCorprOrgCd(String lstCorprOrgCd) {
        this.lstCorprOrgCd = lstCorprOrgCd;
    }
}
