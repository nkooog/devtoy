package org.crm.util.date;

import org.crm.util.com.ComnFun;
import org.springframework.stereotype.Component;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Calendar;
import java.util.Date;
import java.util.Locale;
import java.util.concurrent.TimeUnit;

/***********************************************************************************************
* Program Name : 공통날자유틸(DateUtil.java)
* Creator      : sukim
* Create Date  : 2021.12.20
* Description  : 공통날자유틸
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2021.12.20     sukim            최초생성
************************************************************************************************/
@Component
public class DateUtil {
	
	private static final String F_YEAR = "yyyy";
	private static final String F_MONTH = "yyyyMM";
	private static final String F_MONTH2 = "yyyy.MM";
	private static final String F_MONTH3 = "yyyy-MM";
	private static final String F_MONTH4 = "yyyy/MM";
	private static final String F_DATE = "yyyyMMdd";
	private static final String F_DATE2 = "yyyy.MM.dd";
	private static final String F_DATE3 = "yyyy-MM-dd";
	private static final String F_DATE4 = "yyyy/MM/dd";
	private static final String F_TIMESTAMP = "yyyyMMddHHmmss";
	private static final String F_TIMESTAMP2 = "yyyy.MM.dd HH:mm:ss";
	private static final String F_TIMESTAMP3 = "yyyy-MM-dd HH:mm:ss";
	private static final String F_TIMESTAMP4 = "yyyy/MM/dd HH:mm:ss";

	/************************************************************************/
	/**********             공통 날자 사용 함수                    **********/
	/************************************************************************/	
	
	/**
	 * @Method Name : getDate
	 * @작성일      : 2022.02.03
	 * @작성자      : sukim
	 * @Method 설명 : String형 날자를 Date형 yyyyMMdd 문자열로 변환
	 * @param       : String 날자
	 * @return      : yyyyMMdd
	 */  	
    public Date getDate(String stringDate) throws Exception{
        return DateUtil.getDate(stringDate, "yyyyMMdd");
    }
    
	/**
	 * 오늘날짜
	 * @param 
	 * @return String yyyy/MM/dd
	 */	 
    public static String getTodayDateStr(){
        return new SimpleDateFormat("yyyy/MM/dd" , Locale.getDefault()).format(Calendar.getInstance().getTime());
    }    
    
	/**
	 * @Method Name : getDate
	 * @작성일      : 2022.02.03
	 * @작성자      : sukim
	 * @Method 설명 : String형 두 날자의 Date형 format 변환
	 * @param       : String 날자, 날자포멧
	 * @return      : yyyyMMdd
	 */      
    public static Date getDate(String stringDate, String formatStr) throws Exception{
        SimpleDateFormat format = new SimpleDateFormat(formatStr);
        return format.parse(stringDate);
    }   
    
	/**
	 * 금년
	 * @param 
	 * @return String YYYY
	 */	   
    public static String getNowYearStr(){
        String thisYear = new SimpleDateFormat("yyyy" , Locale.getDefault()).format(Calendar.getInstance().getTime());
        return thisYear;
    }
 
	/**
	 * 이번달
	 * @param 
	 * @return String YYYY/MM
	 */	   
    public static String getNowMonthStr(){
    	String thisMonth = new SimpleDateFormat("yyyy/MM" , Locale.getDefault()).format(Calendar.getInstance().getTime());
        return thisMonth;
    }
    
	/**
	 * 이번달
	 * @param 
	 * @return String MM
	 */	   
    public static String getOnlyNowMonthStr(){
        String thisMonth = new SimpleDateFormat("MM" , Locale.getDefault()).format(Calendar.getInstance().getTime());
        return thisMonth;
    }   
    
	/**
	 * 조정월
	 * .getAdjustedMonth(1) : 다음달
	 * @param 
	 * @return calendar 월
	 */	     
    public static Date getAdjustedMonth(int adjustMonth){
        Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.MONTH, adjustMonth);
        return calendar.getTime();
    }
    
	/**
	 * 조정년도
	 * .getAdjustedYear(1) : 내년
	 * @param 
	 * @return calendar 년
	 */	  
    public static Date getAdjustedYear(int adjustYear){
        Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.YEAR, adjustYear);
        return calendar.getTime();
    }

	/**
	 * 조정일
	 * .getAdjustedDate(1) : 내일
	 * @param 
	 * @return calendar 일
	 */	  
    public static Date getAdjustedDate(int adjustDate){
    	Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.DATE, adjustDate);
        return calendar.getTime();
    }   
    
	/**
	 * 일자를 조정한 Date를 리턴(시분까지 입력)
	 * @param adjustDate : 조정 일자
     * @param hour       : 지정 시
     * @param minute     : 지정 분
	 * @return calendar 일
	 */	     
    public static Date getAdjustedDateHourMin(int adjustDate, int hour, int minute){
        Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.DATE, adjustDate);
        calendar.set(Calendar.HOUR_OF_DAY, hour);
        calendar.set(Calendar.MINUTE, minute);

        return calendar.getTime();
    }    
    
	/**
	 * 해당월의 마지막 날
	 * @param date 조정일자
	 * @return int 날자
	 */	
    public static int getLastDayOfMonth(Date date){
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        return calendar.getMaximum(Calendar.DAY_OF_MONTH);
    }	
    
	/**
	 * 해당월의 마지막 날
	 * @param date 조정일자
	 * @return String 날자
	 */	    
    public static String getLastDayOfMonthStr(Date date){
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        String lastDateStr = calendar.getMaximum(Calendar.DAY_OF_MONTH)+"";
        if(lastDateStr.length() == 1) lastDateStr = "0" + lastDateStr;
        return lastDateStr;
    }
    
	/**
	 * @Method Name : getDateDiff
	 * @작성일      : 2022.02.03
	 * @작성자      : sukim
	 * @Method 설명 : Date형 두날자를 뺀 일수를 리턴
	 * @param       : Date 일자1, Date 일자2
	 * @return      : long
	 */    
    public static long getDateDiff(Date firstDate, Date secondDate) {
        long diff = secondDate.getTime() - firstDate.getTime();
        TimeUnit time = TimeUnit.DAYS; 
        long diffrence = time.convert(diff, TimeUnit.MILLISECONDS);
    	return diffrence;
    }

	/**
	 * @Method Name : getDateCompareTo
	 * @작성일      : 2022.03.10
	 * @작성자      : sukim
	 * @Method 설명 : Date형 두날자를 비교후 앞날자가 뒷날자 이전이면 1, 같으면 2, 이후이면 3을 리턴 
	 * @param       : Date 일자1, Date 일자2
	 * @return      : long
	 */    
    public static int getDateCompareTo(Date firstDate, Date secondDate) {
    	int rtnVal = 0;
    	if(firstDate.before(secondDate)){
    		rtnVal = 1;
        }else if (firstDate.before(secondDate)){
        	rtnVal = 3;
        }else if (firstDate.equals(secondDate)){
        	rtnVal = 2;
        }else {
        	rtnVal = 0;
        }
    	return rtnVal;
    }
    
	/**
	 * @Method Name : getDateDiff
	 * @작성일      : 2022.02.03
	 * @작성자      : sukim
	 * @Method 설명 : String형 두날자를 뺀 일수를 리턴
	 * @param       : String 날자1, String 날자2
	 * @return      : long
	 */    
    public static long getDateDiff(String frDate, String scndDate) throws Exception{
    	return getDateDiff(frDate, scndDate, Locale.getDefault());
    }
    public static long getDateDiff(String frDate, String scndDate, Locale locale) throws Exception{
    	SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd",locale != null ? locale : Locale.getDefault());
        Date firstDate = sdf.parse(frDate);
        Date secondDate = sdf.parse(scndDate);
        
        long diff = secondDate.getTime() - firstDate.getTime();
        TimeUnit time = TimeUnit.DAYS; 
        long diffrence = time.convert(diff, TimeUnit.MILLISECONDS);
    	return diffrence;
    }
    
	/**
	 * 날짜 출력 함수
	 * @param cal
	 * @param type
	 * @return
	 */
	public static String getDate(Calendar cal, String type) {
		return getDateFormatter(type).format(cal.getTime());
	}
	
	/**
	 * 날짜 출력 함수(이전 날짜 전용)  ex)어제, 일주일전, 지난달, 작년 등
	 * @param cal
	 * @param type
	 * @param before
	 * @param beforeValue
	 * @return
	 */
	@SuppressWarnings("static-access")
	public static String getDate(Calendar cal, String type, String before, int beforeValue){
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(cal.getTime());
		SimpleDateFormat sdf = getDateFormatter(type);
		
		if(before != null && !before.trim().equals("")) {
			int beforeType = 0;
			before = before.trim().toLowerCase();
			switch(before) {
			case "year":
				beforeType = calendar.YEAR;
				break;
			case "month":
				beforeType = calendar.MONTH;
				break;
			case "week":
				beforeType = calendar.DATE;
				break;
			case "date":
				beforeType = calendar.DATE;
				break;
			}
			calendar.add(beforeType, beforeValue);
		}
		String date = sdf.format(calendar.getTime());
		return date;
	}
	
	/**
	 * SimpleDateFomat형 날짜 포맷용 설정 상수에서 가져옴
	 * @param type
	 * @return
	 */
	public static SimpleDateFormat getDateFormatter(String type) {
		if(type != null) {
			type = type.trim().toLowerCase();
			switch(type) { //상단에 선언된 상수 String형 포맷을 받아온다.
			case "year":
				type = F_YEAR;
				break;
			case "month":
				type = F_MONTH;
				break;
			case "month2":
				type = F_MONTH2;
				break;
			case "month3":
				type = F_MONTH3;
				break;
			case "month4":
				type = F_MONTH4;
				break;	
			case "week":
				type = F_DATE;
				break;
			case "date":
				type = F_DATE;
				break;
			case "date2":
				type = F_DATE2;
				break;		
			case "date3":
				type = F_DATE3;
				break;	
			case "date4":
				type = F_DATE4;
				break;		
			case "timestamp":
				type = F_TIMESTAMP;
				break;
			case "timestamp2":
				type = F_TIMESTAMP2;
				break;
			case "timestamp3":
				type = F_TIMESTAMP3;
				break;
			case "timestamp4":
				type = F_TIMESTAMP4;
				break;	
			}
			SimpleDateFormat sdf = new SimpleDateFormat(type);
			return sdf;
		}else {
			return null;
		}
	}
	
	/**
	  * @Method Name : getTimestamp
	  * @작성일 : 2022. 11. 9
	  * @작성자 : sjyang
	  * @Method 설명 : 현재 시간 기준 yyyMMddHHmmssSSSS 반환
	  * @param :
	  * @return : String
	  */
	public static String getTimeStampString() throws Exception{
		 return getTimeStampString(Locale.getDefault());
	}
	
	public static String getTimeStampString(Locale locale) throws Exception {
	    SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmssSSS",locale != null ? locale : Locale.getDefault());
	    return sdf.format(new Date());
	}
	
	public static String getTimeStampString(Locale locale, int daysOffset) throws Exception {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmssSSS", locale != null ? locale : Locale.getDefault());
        Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.DAY_OF_YEAR, daysOffset);
        return sdf.format(calendar.getTime());
    }
	
	public static Timestamp getTimeStamp() throws Exception{
		 return getTimeStamp(Locale.getDefault());
	}
	
	public static Timestamp getTimeStamp(Locale locale) throws Exception {
        return strToTimestamp(getTimeStampString(locale));
	}
	
	public static Timestamp getTimeStamp(Locale locale, int daysOffset) throws Exception {
        return strToTimestamp(getTimeStampString(locale, daysOffset));
	}
	
	//2025-01-17 14:09:46.335	>>  20250117140946335
	public static String TimestampTostr(Date strDate) {
	    return TimestampTostr(strDate, Locale.getDefault());
	}

	public static String TimestampTostr(Date strDate, Locale locale) {
	    SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmssSSS",locale != null ? locale : Locale.getDefault());
	    return sdf.format(new Date(strDate.getTime()));
	}
	
	//20250117140946335  >>  2025-01-17 14:09:46.335
	public static Timestamp strToTimestamp(String dateTimeString) {
	    return strToTimestamp(dateTimeString, Locale.getDefault());
	}
	
	public static Timestamp strToTimestamp(String dateTimeString, Locale locale) {		
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMddHHmmssSSS",locale != null ? locale : Locale.getDefault());
        LocalDateTime localDateTime = LocalDateTime.parse(dateTimeString, formatter);
        return Timestamp.valueOf(localDateTime);
	}
	
	public static String strToFormatStr(String dateTimeString, String formatString) {		
        // 문자열을 LocalDateTime으로 변환
        DateTimeFormatter inputFormatter = DateTimeFormatter.ofPattern("yyyyMMddHHmmssSSS");
        LocalDateTime localDateTime = LocalDateTime.parse(dateTimeString, inputFormatter);
        DateTimeFormatter outputFormatter = DateTimeFormatter.ofPattern(formatString);		        // LocalDateTime을 원하는 형식의 문자열로 변환
        return localDateTime.format(outputFormatter);
	}
	
	/**
	  * @Method Name : getAmericanAge
	  * @작성일 : 2022. 11. 15
	  * @작성자 : sjyang
	  * @변경이력 : 
	  * @Method 설명 : yyyymmdd 값을 기준으로 만나이 계산하여 연령대 반환
	  * @param :
	  * @return :
	  */
	public static String getByAge(String birthYmd) {
		
		String rtnAge = "99";	//yyyymmdd 값이 잘못 되었을 경우. 
		String yyyymmdd = ComnFun.onlyNumStr(birthYmd);
		
		if(yyyymmdd.length() == 8) {
			
			int yyyy = Integer.parseInt(yyyymmdd.substring(0, 4));
			int mm = Integer.parseInt(yyyymmdd.substring(4,6));
			int dd = Integer.parseInt(yyyymmdd.substring(6,8));
			
			int aAge = getAmericanAge(yyyy, mm, dd);
			
			if (aAge < 10) {
				rtnAge = "00";
			} else if (aAge >= 10 && aAge <= 19) {
				rtnAge = "10";
			} else if (aAge >= 20 && aAge <= 29) {
				rtnAge = "20";
			} else if (aAge >= 30 && aAge <= 39) {
				rtnAge = "30";
			} else if (aAge >= 40 && aAge <= 49) {
				rtnAge = "40";
			} else if (aAge >= 50 && aAge <= 59) {
				rtnAge = "50";
			} else if (aAge >= 60 && aAge <= 69) {
				rtnAge = "60";
			} else if (aAge >= 70 && aAge <= 79) {
				rtnAge = "70";
			} else if (aAge >= 80) {	//80대 이상 통일
				rtnAge = "80";
			}
		}
		
		return rtnAge;
	}
	
	/**
	  * @Method Name : getAmericanAge
	  * @작성일 : 2022. 11. 15
	  * @작성자 : sjy
	  * @변경이력 : 
	  * @Method 설명 : 만나이 계산
	  * @param :
	  * @return :
	  */
	public static int getAmericanAge(int birthYear, int birthMonth, int birthDay) {
		
		Calendar current = Calendar.getInstance();
		int currentYear = current.get(Calendar.YEAR);
		int currentMonth = current.get(Calendar.MONTH) + 1;
		int currentDay = current.get(Calendar.DAY_OF_MONTH);

		int age = currentYear - birthYear;
		// 생일 안 지난 경우 -1
		if (birthMonth * 100 + birthDay > currentMonth * 100 + currentDay) {
			age--;
		}

		return age;
	}
}