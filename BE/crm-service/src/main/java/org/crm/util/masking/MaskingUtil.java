 package org.crm.util.masking;

import java.util.Arrays;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

 /***********************************************************************************************
 * Program Name : Masking 공통 모듈(MaskingUtil.java)
 * Creator      : sukim
 * Create Date  : 2022.10.31
 * Description  : Masking 공통 모듈
 * Modify Desc  :
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.10.31     sukim            최초생성
 ************************************************************************************************/
 public class MaskingUtil {

	 /*
	 * 이름 가운데 글자 마스킹
	 * @param   : (이름)
	 *            ex) 한글인 경우 : 홍길동 → 홍*동, 정철 → 정*, 제갈공명 → 제**명
	 *                영어인 경우 : Tommy Johnson → T************n, Tommy → T***y
	 * @특이사항: 한글은 3글자이면 가운데 글자만 마스킹
	 *                   2글자이면 마지막 글자만 마스킹
	 *                   4글자이면 가운데 글자 모두 마스킹
	 *            영어는 full name, 한단어 이름 모두 첫자와 마지막 알파벳을 제외한 가운데 모두 * 처리
	 * @returns : string
	 */
	 public static String nameMasking(String strName) throws Exception {
		 String regex = "(^[가-힣]+)$";
		 String strTrim = strName.trim().replace(" ", "");
		 Matcher matcher = Pattern.compile(regex).matcher(strTrim);
		 if(Pattern.matches(regex,strTrim)) {
			 //System.out.println("=== 한글이름 ===");
			 if(matcher.find()) {
				 int length = strTrim.length();
				 String middleMask = "";
				 if(length > 2) {
					 middleMask = strTrim.substring(1, length - 1);
				 } else {	// 외자 이름이면
					 middleMask = strTrim.substring(1, length);
				 }
				 String dot = "";
				 for(int i = 0; i<middleMask.length(); i++) {
					 dot += "*";
				 }
				 if(length > 2) {
					 return strTrim.substring(0, 1)
							 + middleMask.replace(middleMask, dot)
							 + strTrim.substring(length-1, length);
				 } else { // 외자 이름 마스킹 리턴
					 return strTrim.substring(0, 1)
							 + middleMask.replace(middleMask, dot);
				 }
			 }
		 }else {
			 //System.out.println("=== 영어이름 ===");
			 String frsName = strName.substring(0,1);
			 String midName = strName.substring(1, strName.length()-1);
			 //중간글자 마스킹
			 String cnvMidName = "";
			 for(int i=0; i< midName.length(); i++){
				 cnvMidName += "*"; // 중간 글자 수 만큼 * 표시
			 }
			 // 마지막 글자
			 String lstName = strName.substring(strName.length()-1,strName.length());
			 return frsName + cnvMidName + lstName;
		 }
		 return strTrim;
	 }



	 /*
	  * 휴대폰번호 및 전화번호
	  * @param   : (휴대폰번호 or 전화번호)
	  *            ex) 01012345555 → 010****5555
	  * @특이사항: 구분하여 마스킹 반환
	  * @returns : string
	  */
	 public static String SwichingPhone(String num) throws Exception{
		 num = num.replaceAll("-","");
		 char[] phon = num.toCharArray();
		 if(phon.length>=2){
			 if((int)phon[1]>49)return telMasking(num);
			 else return phoneMasking(num);
		 }
		 return num;
	 }


	 /*
	 * 휴대폰번호 마스킹
	 * @param   : (휴대폰번호)
	 *            ex) 01012345555 → 010****5555
	 * @특이사항: 가운데 숫자 4자리 마스킹 처리
	 * @returns : string
	 */
	 public static String phoneMasking(String phoneNum) throws Exception {
		 String regex = "(\\d{2,3})-?(\\d{3,4})-?(\\d{4})$";
		 Matcher matcher = Pattern.compile(regex).matcher(phoneNum);
		 if(matcher.find()) {
			 String target = matcher.group(2);
			 int length = target.length();
			 char[] c = new char[length];
			 Arrays.fill(c, '*');
			 return phoneNum.replace(target, String.valueOf(c));
		 }
		 return phoneNum;
	 }

	 /*
	 * 전화 마스킹
	 * @param   : (전화번호)
	 *            ex) 021234567 → 02***4567, 0511234567 → 051***4567
	 * @특이사항: 가운데 숫자 3자리 마스킹 처리
	 * @returns : string
	 */
	 public static String telMasking(String telNum) throws Exception {
	     String regex = "(\\d{2,3})(\\d{3,4})(\\d{4})$";
	     Matcher matcher = Pattern.compile(regex).matcher(telNum);
	     if (matcher.find()) {
	         String replaceTarget = matcher.group(2);
	         char[] c = new char[replaceTarget.length()];
	         Arrays.fill(c, '*');
	         return telNum.replace(replaceTarget, String.valueOf(c));
	     }
	     return telNum;
	 }

	 /*
	 * 이메일주소 마스킹
	 * @param   : (이메일주소)
	 *            ex) master@broadcns.com → mas***@broadcns.com
	 * @특이사항: '@'앞의 userID를 기준으로 세글자 초과인 경우 뒤 세자리를 마스킹 처리,
	 *            세글자인 경우 뒤 두글자만 마스킹,
	 *            세글자 미만인 경우 모두 마스킹 처리
	 * @returns : string
	 */
	 public static String emailMasking(String email) throws Exception {
	       String regex = "\\b(\\S+)+@(\\S+.\\S+)";
	       Matcher matcher = Pattern.compile(regex).matcher(email);
	       if (matcher.find()) {
		       String id = matcher.group(1); //기준 userId
		       int length = id.length();
		       if (length < 3) {
			       char[] c = new char[length];
			       Arrays.fill(c, '*');
			       return email.replace(id, String.valueOf(c));
		       } else if (length == 3) {
			       return email.replaceAll("\\b(\\S+)[^@][^@]+@(\\S+)", "$1**@$2");
		       } else {
			       return email.replaceAll("\\b(\\S+)[^@][^@][^@]+@(\\S+)", "$1***@$2");
		       }
	       }
	       return email;
	 }

	 /*
	 * 계좌번호 마스킹
	 * @param   : (계좌번호)
	 *            ex) 1234567890123 → 12345678*****
	 * @특이사항: 뒷 5자리 숫자를 마스킹 처리, 계좌번호는 각 은행마다 자릿수가 다 틀리므로 숫자 패턴만 이용함.
	 * @returns : string
	 */
	 public static String acctNumMasking(String acctNum) throws Exception {
	     String regex = "(^[0-9]+)$";
		 Matcher matcher = Pattern.compile(regex).matcher(acctNum);
		 if(matcher.find()) {
			 int length = acctNum.length();
			 if(length > 5) {
				 char[] c = new char[5];
				 Arrays.fill(c, '*');
				 return acctNum.replace(acctNum, acctNum.substring(0, length-5) + String.valueOf(c));
			 }
		 }
		 return acctNum;
	 }

	 /*
	 * 생년월일 마스킹
	 * @param   : (생년월일)
	 *            ex) 19800101 → ****01**
	 * @특이사항: 생년월일 6자리인 경우 앞 2자리 제외하고 모두 마스킹
	 *                     8자리인 경우 앞 2자리 제외하고 모두 마스킹
	 *                     10자리인 경우(하이픈('-') 또는 점('.') 포함) 형식이면 앞 2자리 제외하고 모두 마스킹 -> 하이픈('-') 또는 점('.')를 제거함
	 * @returns : string
	 */
	 public static String birthMasking(String birthday) throws Exception {
		 String regex = "";
		 int len = birthday.length();
		 if(len == 6) {
			 regex = "^([0-9]{2}(0[1-9]|1[0-2])(0[1-9]|[1,2][0-9]|3[0,1]))$";
		 }
		 if(len == 8) {
			 regex = "^(19[0-9][0-9]|20\\d{2})(0[0-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])$";
		 }
		 //하이픈 or 점등이 있는 경우
		 if(len == 10) {
			 if(birthday.indexOf("-") > -1) {
				 regex = "^(19[0-9][0-9]|20\\d{2})-(0[0-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$";
			 }
			 if(birthday.indexOf(".") > -1) {
				 regex = "^(19[0-9][0-9]|20\\d{2}).(0[0-9]|1[0-2]).(0[1-9]|[1-2][0-9]|3[0-1])$";
			 }
			 if(birthday.indexOf("/") > -1) {
				 regex = "^(19[0-9][0-9]|20\\d{2})/(0[0-9]|1[0-2])/(0[1-9]|[1-2][0-9]|3[0-1])$";
			 }
		 }
		 Matcher matcher = Pattern.compile(regex).matcher(birthday);
		 if(matcher.find()) {
			 if(birthday.length() == 6) {
				 return birthday.substring(0, 2) + "****";
			 }
			 if(birthday.length() == 8 || birthday.length() == 10) {
				 String match = "[^0-9]"; //숫자만
				 String str = birthday.replaceAll(match, "");
				 return str.substring(0, 2) + "******";
			 }
		 }
		 return birthday;
	 }

	 /*
	 * 카드번호 마스킹
	 * @param   : (카드번호)
	 *            ex) 1111222233334444 → 1111********4444
	 * @특이사항: 카드번호 가운데 8자리 마스킹 처리
	 * @returns : string
	 */
	 public static String cardnumMasking(String cardNum) throws Exception {
		 // 카드번호 16자리 또는 15자리 '-'포함/미포함 상관없음
		 String regex = "(\\d{4})-?(\\d{4})-?(\\d{4})-?(\\d{3,4})$";
		 if(cardNum.indexOf("-") > -1) {
			 cardNum = cardNum.replaceAll("-", "");
		 }
		 Matcher matcher = Pattern.compile(regex).matcher(cardNum);
		 if(matcher.find()) {
			 String target = matcher.group(2) + matcher.group(3);
			 int length = target.length();
			 char[] c = new char[length];
			 Arrays.fill(c, '*');
			 return cardNum.replace(target, String.valueOf(c));
		 }
		 return cardNum;
	 }

	 /*
	 * 주소 마스킹
	 * @param   : (신주소 or 구주소 or 도로명주소)
	 *            ex) 서울 구로구 디지털로 243 1208-1210호(구로동, 지하이시티) → 서울 구로구 디지털로 *** ****-****호(구로동, 지하이시티)
	 * @특이사항: 신주소, 구주소, 도로명 주소 숫자만 전부 마스킹
	 * @returns : string
	 */
	 public static String addressMasking(String addr) throws Exception {
		 String regex = "(([가-힣]+(\\d{1,5}|\\d{1,5}(,|.)\\d{1,5}|)+(읍|면|동|가|리))(^구|)((\\d{1,5}(~|-)\\d{1,5}|\\d{1,5})(가|리|)|))([ ](산(\\d{1,5}(~|-)\\d{1,5}|\\d{1,5}))|)|";
		 String newRegx = "(([가-힣]|(\\d{1,5}(~|-)\\d{1,5})|\\d{1,5})+(로|길))";
		 Matcher matcher = Pattern.compile(regex).matcher(addr);
		 Matcher newMatcher = Pattern.compile(newRegx).matcher(addr);
		 if(matcher.find()) {
			 return addr.replaceAll("[0-9]", "*");
		 } else if(newMatcher.find()) {
			 return addr.replaceAll("[0-9]", "*");
		 }
		 return addr;
	 }

	 /*
	 * 주민등록번호 마스킹
	 * @param   : (주민등록번호 13자리숫자)
	 *            ex) 8001011999999 → 8001011******
	 * @특이사항: 주민등록번호 13자리 숫자 중 성별(7자리) 뒤 6자리 마스킹
	 * @returns : string
	 */
	 public static String ssnMasking(String ssn) throws Exception {
		 String regex = "^(\\d{6}\\D?\\d{1})(\\d{6})$";
		 Matcher matcher = Pattern.compile(regex).matcher(ssn);
		 if(matcher.find()) {
			 return new StringBuffer (matcher.group(1)).append("******").toString();
		 }
		 return ssn;
	 }

	 //사용법 시작 *************************************************************************************//
 //	public static void main(String[] args) throws Exception{

 //		//한글이름
 //	    String rtnName = nameMasking("홍길동");
 //	    System.out.println(rtnName);
 //	    String rtnName2 = nameMasking("홍 길동");
 //	    System.out.println(rtnName2);
 //	    String rtnName3 = nameMasking("정철");
 //	    System.out.println(rtnName3);
 //	    String rtnName4 = nameMasking("정   철");
 //	    System.out.println(rtnName4);
 //	    String rtnName5 = nameMasking("제갈공명");
 //	    System.out.println(rtnName5);
 //	    String rtnName6 = nameMasking("제 갈 공 명");
 //	    System.out.println(rtnName6);
 //	    System.out.println("--------------------------------------------------------------------------------");
 //
 //	    //영어이름
 //	    String rtnEngName = nameMasking("Tommy Johnson");
 //	    System.out.println(rtnEngName);
 //	    String rtnEngName2 = nameMasking("Tommy");
 //	    System.out.println(rtnEngName2);
 //	    System.out.println("--------------------------------------------------------------------------------");
 //
 //	    //휴대전화번호
 //	    String rtnPhoneNum = phoneMasking("01012347777");
 //	    System.out.println(rtnPhoneNum);
 //	    System.out.println("--------------------------------------------------------------------------------");
 //
 //	    //전화번호
 //	    String rtntelNum = telMasking("021234567");
 //	    System.out.println(rtntelNum);
 //	    String rtntelNum2 = telMasking("0511234567");
 //	    System.out.println(rtntelNum2);
 //	    System.out.println("--------------------------------------------------------------------------------");
 //
 //
 //	    //이메일주소 - 3자리이상
 //	    String rtnemail1 = emailMasking("sukim@broadcns.com");
 //	    System.out.println(rtnemail1);
 //	    //이메일주소 - 3자리
 //	    String rtnemail2 = emailMasking("kim@broadcns.com");
 //	    System.out.println(rtnemail2);
 //	    //이메일주소 - 3자리미만
 //	    String rtnemail3 = emailMasking("qq@broadcns.com");
 //	    System.out.println(rtnemail3);
 //	    System.out.println("--------------------------------------------------------------------------------");
 //
 //	    //계좌번호
 //	    String rtnacctNo = acctNumMasking("1111222233335555");
 //	    System.out.println(rtnacctNo);
 //	    System.out.println("--------------------------------------------------------------------------------");
 //
 //	    //생년월일 - 6자리
 //	    String rtnbirth1 = birthMasking("800101");
 //	    System.out.println("생년월일 1 ->" + rtnbirth1);
 //	    //생년월일 - 8자리
 //	    String rtnbirth2 = birthMasking("19800101");
 //	    System.out.println("생년월일 2 ->" + rtnbirth2);
 //	    //생년월일 - 10자리 하이픈
 //	    String rtnbirth3 = birthMasking("1980-01-01");
 //	    System.out.println("생년월일 3 ->" + rtnbirth3);
 //	    //생년월일 - 10자리 점
 //	    String rtnbirth4 = birthMasking("1980.01.01");
 //	    System.out.println("생년월일 4 ->" + rtnbirth4);
 //	    //생년월일 - 10자리 슬러쉬
 //	    String rtnbirth5 = birthMasking("1980/01/01");
 //	    System.out.println("생년월일 5 ->" + rtnbirth5);
 //	    System.out.println("--------------------------------------------------------------------------------");
 //
 //
 //	    //카드번호
 //	    String rtnCardNo = cardnumMasking("1111-2222-3333-5555");
 //	    System.out.println("카드번호1 ->" + rtnCardNo);
 //	    String rtnCardNo2 = cardnumMasking("1111222233335555");
 //	    System.out.println("카드번호2 ->" + rtnCardNo2);
 //	    System.out.println("--------------------------------------------------------------------------------");
 //
 //	    //주소
 //	    String rtnAddr = addressMasking("서울 구로구 디지털로 243 1208-1210호(구로동, 지하이시티)");
 //	    System.out.println("도로명주소 ->" + rtnAddr);
 //	    String rtnAddr2 = addressMasking("경기도 부천시 원미구 역곡동 126-77 스카이빌라 1동 602호");
 //	    System.out.println("구주소 ->" + rtnAddr2);
 //	    System.out.println("--------------------------------------------------------------------------------");
 //
 //	    //주민번호
 //	    String rtnSsn = ssnMasking("8001011999999");
 //	    System.out.println(rtnSsn);
 //	    //주민번호 - 하이픈 있는 경우
 //	    String rtnSsn2 = ssnMasking("791212-2999999");
 //	    System.out.println(rtnSsn2);
 //	    System.out.println("--------------------------------------------------------------------------------");


 //	}

	 //사용법 종료 *************************************************************************************//
 }
