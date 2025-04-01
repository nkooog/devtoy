package org.crm.config.spring.config;

import org.crm.util.crypto.AES256Crypt;

import java.util.List;
import java.util.Map;

public abstract class CommProperteis {
	private Map<String, String> properties;

	public Map<String, String> getProperties() {
		return properties;
	}

	public void setProperties(Map<String, String> properties) {
		this.properties = properties;
	}

    // 단순히 문자열을 반환하는 메서드
    public String getString(String key) {
        try {
            return getDecryptString(key);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    private List<String> decryptKeys;  // 복호화가 필요한 프로퍼티 키들

    // 복호화가 필요한 키들을 설정
    public void setDecryptKeys(List<String> decryptKeys) {
        this.decryptKeys = decryptKeys;
    }

    // 복호화된 값을 가져오는 메서드
    public String getDecryptString(String key){
        if (decryptKeys != null && decryptKeys.contains(key)) {
            try {
                return AES256Crypt.decrypt(properties.get(key));  // 복호화가 필요한 키는 복호화 후 반환
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        }
        return properties.get(key);  // 복호화가 필요 없는 경우는 원본 값 반환
    }

}
