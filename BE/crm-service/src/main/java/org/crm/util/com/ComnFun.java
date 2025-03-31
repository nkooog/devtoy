package org.crm.util.com;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.lang.reflect.Field;
import java.net.Inet4Address;
import java.net.UnknownHostException;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

/***********************************************************************************************
* Program Name : 공통함수유틸(ComnFun.java)
* Creator      : sukim
* Create Date  : 2021.12.20
* Description  : 공통함수유틸
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2021.12.20     sukim            최초생성
************************************************************************************************/
@Slf4j
@Component
public class ComnFun {
	
	//private static final Logger LOGGER = LoggerFactory.getLogger(ComnFun.class);
	
	/**
	 * @Method Name : isStringEmpty
	 * @작성일      : 2022.01.04
	 * @작성자      : sukim
	 * @변경이력    : 
	 * @Method 설명 : 엑셀의 각각의 cell 값이 공백, "null", null, " ", 빈값인지 체크하고 정상이면 true 그외 false를 반환
	 * @param       : String str
	 * @return      : boolean
	 */    
	public boolean isStringEmpty(String str) {
		return str =="null"  || str ==""  || str ==" "  || str == null || str.isEmpty();
	}
	
	/**
	 * @Method Name : getRandomString
	 * @작성일      : 2022.01.17
	 * @작성자      : sukim
	 * @변경이력    : 
	 * @Method 설명 : UUID를 반환
	 * @param       :
	 * @return      : String
	 */    
    public static String getRandomString(){
        return UUID.randomUUID().toString().replaceAll("-", "");
    }	
    
	/**
	 * @Method Name : isEmpty
	 * @작성일      : 2022.02.03
	 * @작성자      : bykim
	 * @변경이력    : 
	 * @Method 설명 : mybatis parameter check, null 혹은 빈값일시 false 반환
	 * @param       : String str
	 * @return      : boolean
	 */    
    public static boolean isEmpty(String str) {
		return str =="null"  || str ==""  || str ==" "  || str == null || str.isEmpty();
	}
    
	/**
	 * @Method Name : isEmptyObj
	 * @작성일      : 2022.03.22
	 * @작성자      : sukim
	 * @변경이력    : 
	 * @Method 설명 : 객체가 null 혹은 빈값일시 true 반환
	 * @param       : Object obj
	 * @return      : boolean
	 */    
    public static boolean isEmptyObj(Object obj) {
        if (obj == null) { return true; }
        if ((obj instanceof String) && (((String)obj).trim().length() == 0)) { return true; } 
        if (obj instanceof Map) { return ((Map<?, ?>)obj).isEmpty(); }
        if (obj instanceof List) { return ((List<?>)obj).isEmpty(); }
        if (obj instanceof Object[]) { return (((Object[])obj).length == 0); } 

        return false;
	} 

	/**
	 * @Method Name : getClientIP
	 * @작성일      : 2022.03.04
	 * @작성자      : sukim
	 * @변경이력    : 
	 * @Method 설명 : 로그인한 사용자의 IP4주소를 반환
	 * @param       : String str
	 * @return      : boolean
	 */     
    public static String getClientIP() {
    	String ip =null;
    	try {
			ip = Inet4Address.getLocalHost().getHostAddress();
    	}
    	catch ( UnknownHostException e ) {
    		e.printStackTrace();
    	}
   		return ip;
    }  
    
    /**
     * @Method Name : onlyNumStr
     * @작성일 : 2022. 11. 15
     * @작성자 : sjyang
     * @변경이력 : 
     * @Method 설명 : 숫자를 제외한 문자를 제거하고 숫자를 String 형식으로 반환한다.
     * @param : String strNum
     * @return :
     */
	public static String onlyNumStr(String strNum) {

		String result = "";

		for (int i = 0; i < strNum.length(); i++) {
			char ch = strNum.charAt(i);
			if (48 <= ch && ch <= 57) {
				result += ch;
			}
		}

		return result;
	}
    
	/**
	 * @Method Name : checkNum
	 * @작성일      : 2022.06.10
	 * @작성자      : sukim
	 * @변경이력    : 
	 * @Method 설명 : 숫자 칼럼에 문자가 끼어든 경우
	 *                0~9 사이의 숫자가 아니면 무조건 9999를 반환하고, 숫자인 경우 문자열숫자로 변환
	 * @param       : String strNum
	 * @return      : int
	 */      
    public int checkNum(String strNum) {
        int num = 0;
        if(!strNum.trim().matches("^[0-9]+$")){
        	num = 9999;
        } else {
        	num = Integer.parseInt(strNum.trim());
        }
        return num;
    }

	/**
	 * @Method Name : cutString
	 * @작성일      : 2022.06.10
	 * @작성자      : sukim
	 * @Method 설명 : 문자열을 바이트형으로 변환한 뒤 각 글자의 길이를 계산하여 자름
	 *				  UTF-8일 경우subStringBytes("블라블라블라라123", 10, 3);
	 *				  EUC-KR일 경우subStringBytes("블라블라블라라123", 10, 2);
	 * @param       : String 문자열, 자를길이
	 * @return      : 자른 문자열
	 */   
	public String subStringBytes(String str, int byteLength, int sizePerLetter){ 
		int retLength = 0;
		int tempSize = 0;
		int asc;

		if (str == null || "".equals(str) || "null".equals(str)) {
			str = "";
		}

		int length = str.length();

		for (int i = 1; i <= length; i++) {
			asc = (int) str.charAt(i - 1);
			if (asc > 127) {
				if (byteLength >= tempSize + sizePerLetter) {
					tempSize += sizePerLetter;
					retLength++;
				}
			} else {
				if (byteLength > tempSize) {
					tempSize++;
					retLength++;
				}
			}
		}
		return str.substring(0, retLength);
	}
	
	/**
	 * @Method Name : replaceAll
	 * @작성일      : 2022.06.10
	 * @작성자      : sukim
	 * @Method 설명 : 문자열에서 숫자만 남기고 제거
	 * @param       : String 문자열
	 * @return      : 문자열숫자
	 */ 	
	public String replaceAll(String src) {
		return src.replaceAll("[^0-9]", "");
	}
	
	/**
	 * @Method Name : replaceSeparator
	 * @작성일      : 2022.06.10
	 * @작성자      : sukim
	 * @Method 설명 : 문자열에서 구분자 제거(000-0000-0000 인경우 '-'를 제거)
	 * @param       : String 문자열
	 * @return      : 문자열숫자
	 */ 	
	public String replaceSeparator(String src, String separator) {
		return src.replaceAll(separator, "");
	}

	/**
	 * @Method Name : startDateTime
	 * @작성일      : 2022.10.14
	 * @작성자      : mhlee
	 * @Method 설명 : 기준정보 값의 기준으로 해당 숫자 이전 날짜와 시간 반환
	 * @param       : 설정하는 이전 날짜
	 * @return      : 현재날짜에서 파라미터 값 이전 날짜와 시간
	 */
	public static LocalDateTime getStartDateTime(int setDay) {
		return LocalDateTime.now().minusDays(setDay).with(LocalTime.MIN);
	}

	/**
	 * @Method Name : endDateTime
	 * @작성일      : 2022.10.14
	 * @작성자      : mhlee
	 * @Method 설명 : 현재 날짜와 시간 반환
	 * @param       : LocalDateTime
	 * @return      : 현재날짜와 시간
	 */
	public static LocalDateTime getNowDateTime() {
		return LocalDateTime.now().with(LocalTime.MAX);
	}

	/**
	 * @Method Name : getNowDateTimeToString
	 * @작성일      : 2022.10.18
	 * @작성자      : mhlee
	 * @Method 설명 : 현재 날짜와 시간 반환
	 * @param       :
	 * @return      : (String) yyyy-MM-dd HH:mm:ss 형식의 현재날짜와 시간
	 */
	public static String getNowDateTimeToString() {
		return LocalDateTime.now().with(LocalTime.MAX).format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
	}

	/**
	 * @Method Name : getStartDateTimeToString
	 * @작성일      : 2022.10.18
	 * @작성자      : mhlee
	 * @Method 설명 : 기준정보 값의 기준으로 해당 숫자 이전 날짜와 시간 반환
	 * @param       : 설정하는 이전 날짜
	 * @return      : (String) yyyy-MM-dd HH:mm:ss 형식의 param 이전날짜
	 */
	public static String getStartDateTimeToString(int setDay) {
		return LocalDateTime.now().minusDays(setDay).with(LocalTime.MIN).format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
	}
	
	/**
	 * @Method Name : secToTime
	 * @작성일      : 2023.02.10
	 * @작성자      : wkim
	 * @Method 설명 : 초 단위를 dd HH:mm:ss 형태로 변경
	 * @param       : 초단위의 long type
	 * @return      : (String) dd HH:mm:ss 형식의 string 반환
	 */
	public static String secToTime(long timeSec) {
		long lDay, lHour, lMin, lSec, lTotalTime;
    	String strTime;
    	
    	lTotalTime = timeSec;
    	lDay = lTotalTime / 86400;
    	lHour = (lTotalTime - (lDay * 86400)) / 3600;                    	
    	lMin = (lTotalTime - (lDay * 86400) - (lHour * 3600)) / 60;                    	
    	lSec = lTotalTime - (lDay * 86400) - (lHour * 3600) - (lMin * 60);
    	
    	if(lDay == 0)
    	{
    		strTime = String.format( "%1$02d" , lHour ) + ":" + String.format( "%1$02d" , lMin ) + ":" + String.format( "%1$02d" , lSec );
    	} else {
    		strTime = lDay + "d " + String.format( "%1$02d" , lHour ) + ":" + String.format( "%1$02d" , lMin ) + ":" + String.format( "%1$02d" , lSec );
    	}
    	
    	return strTime;
	}

	/**
	 * List<vo> to List<Map<String,Object> 형태로 변환
	 * @작성일      : 2024.04.17
	 * @작성자      : shpark
	 * @param voList
	 * @return
	 */
	public static List<Map<String, Object>> convertVOListToMapList(List<? extends Object> voList) {
		List<Map<String, Object>> mapList = new ArrayList<>();
		for (Object vo : voList) {
			Map<String, Object> map = new HashMap<>();
			Field[] fields = vo.getClass().getDeclaredFields();
			for (Field field : fields) {
				field.setAccessible(true);
				try {
					map.put(field.getName(), field.get(vo));
				} catch (IllegalAccessException e) {
					e.printStackTrace();
				}
			}
			mapList.add(map);
		}
		return mapList;
	}
}
