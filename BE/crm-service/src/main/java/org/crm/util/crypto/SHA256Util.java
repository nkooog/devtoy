package org.crm.util.crypto;

import org.crm.lgin.model.vo.LGIN000VO;
import org.crm.util.date.DateUtil;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;

/***********************************************************************************************
* Program Name : SHA256Util
* Creator      : sjyang
* Create Date  : 2025.02.01
* Description  : sha256 단방향 암호화 - 가변 salt 적용
* Modify Desc  :
* 가변 salt 생성1 : SHA256Util.genSaltKey(String tenantId, String usrId, String yyyyMMddHHmmssSSS)
* 가변 salt 생성2 : SHA256Util.genSaltKey(LGIN000VO) > LGIN000VO 사용 시 ScrtNoLstUpdDtm 필수  
* 주의 			: 테넌트ID + 사용자ID + 변경 시점의 세부 시간으로 생성
* 				  패스워드 변경 및 초기화 등 실행 시 t_usr_info_mgnt 테이블의 scrt_no_lst_upd_dtm 컬럼에 salt 키에서 사용한 yyyyMMddHHmmssSSS 를 필수로 기록한다.
* 				  패스워드 변경 후 t_usr_pass_hist 테이블 변경 이력을 필수로 기록한다.
* 암호화 샘플1		: SHA256Util.encrypt(SHA256Util.genSaltKey(DMO,DMO_A01,20250201131022333),[input password]);
* 암호화 샘플2		: SHA256Util.encrypt(SHA256Util.genSaltKey(LGIN000VO),[input password]);
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2025.02.01     sjyang            최초생성
************************************************************************************************/
public class SHA256Util {

	 // SHA-256 + Salt 암호화 메서드
    public static String encrypt(String secretKey, String input) {
    	try {
            // 입력값과 Salt 결합
            String saltedInput = secretKey + input;

            // SHA-256 해시 생성
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(saltedInput.getBytes(StandardCharsets.UTF_8));

            // 바이트 배열을 16진수 문자열로 변환
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) {
                    hexString.append('0');
                }
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (Exception e) {
            throw new RuntimeException("Error occurred during SHA-256 encryption", e);
        }
    }
    
    /**
     * @param tenantId
     * @param usrId
     * @param dtm
     * @return saltKey
     */
    public static String genSaltKey(String tenantId, String usrId, String yyyyMMddHHmmssSSS) {
    	return tenantId + usrId + yyyyMMddHHmmssSSS;
    }
    
    /**
     * @param LGIN000VO
     * @return saltKey
     */
    public static String genSaltKey(LGIN000VO vo) {
    	return vo.getTenantId() + vo.getUsrId() + DateUtil.TimestampTostr(vo.getScrtNoLstUpdDtm());
    } 
}
