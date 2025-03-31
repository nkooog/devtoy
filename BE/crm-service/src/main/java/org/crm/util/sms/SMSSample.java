package org.crm.util.sms;

public class SMSSample {

	public static void main(String[] args) {
		System.out.println("dd");
	}
}
//		try {
//			System.out.println(sendtest());
//		}
//		catch (Exception e)
//		{
//			System.err.println(e);
//		}


		//getSMSMonitor();
//		try {
//			System.out.println(new SMSUtil().getSMSMonitor("DMO"));
//		}
//		catch (Exception e)
//		{
//			System.err.println(e);
//		}

		//return
		//http://211.61.156.4:7999/Sms/getSMSMonitor?tenantPrefix=DMO Start
		//{"tenantPrefix":"DMO","callbackNumber":"15992745","smsMaxCount":"0","smsCount":"37","smsCost":"40","lmsCost":"50","mmsCost":"100"}

		//smsUsingYnAuth();
//		try {
//			System.out.println(new SMSUtil().smsUsingYnAuth("DMO"));
//		}
//		catch (Exception e)
//		{
//			System.err.println(e);
//		}

		//return
		//http://211.61.156.4:7999/Sms/smsUsingYnAuth?tenantPrefix=DMO Start
		//{"IsUsing":1}




//	public static String sendtest() throws UnsupportedEncodingException {

//		SendObject sendobj = new SendObject();
//		sendobj.setTenantPrefix("DMO");
//		sendobj.setSysPrefix("BONA");
//		sendobj.setPhone("01093448608");
//		sendobj.setCallback("15779966");
//		sendobj.setMsg(URLEncoder.encode("Test Message 발송", "utf-8"));
//		sendobj.setAgentId("DMO_A01");
//		sendobj.setCustomerId("ttt");

//		try {
//			return new SMSUtil().Send(sendobj);
//		}
//		catch (Exception e)
//		{
//			return e.toString();
//		}
//	}
//
//}
