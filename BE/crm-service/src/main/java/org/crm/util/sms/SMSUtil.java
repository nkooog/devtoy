package org.crm.util.sms;

import jakarta.ws.rs.HttpMethod;
import org.crm.config.spring.config.PropertiesService;
import org.crm.util.sms.jsonObject.SendObject;
import org.crm.util.string.StringUtil;
import com.google.gson.Gson;
import lombok.NoArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLConnection;
import java.net.URLEncoder;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;

@Component
@NoArgsConstructor
public class SMSUtil {

	@Autowired
	private PropertiesService propertiesService;

	private static final Logger LOGGER = LoggerFactory.getLogger(SMSUtil.class);
	private String hosturl;

    private static final String charset= "UTF-8";
    private static final String CRLF= "\r\n";
    private PrintWriter writer;
    private OutputStream output = null;
    
    public StringBuilder strBuilder = new StringBuilder();
    
    private HashMap<String,Object> responseBody = new HashMap<String,Object>();
    
    private void setHttpStatus(int httpStatus){
        this.responseBody.put("httpStatus", httpStatus);
    }
    private void setResponseBody(HashMap<String,String> responseBody){
        this.responseBody.putAll(responseBody);
    }

	public SMSUtil(String _hostUrl){
		try {
//			EgovEnvCryptoService cryptoService = new ClassPathXmlApplicationContext(new String[]{"classpath:/egovframework/spring/context-crypto.xml"}).getBean(EgovEnvCryptoServiceImpl.class);
//			Properties properties = new Properties();
//
//			properties.load(Resources.getResourceAsReader("egovframework/egovProps/globals.properties"));

//			hosturl = cryptoService.decrypt(properties.getProperty(cldDv+".sms.url"));
			

			
			hosturl = _hostUrl;

		}catch(Exception e) {
			LOGGER.error("["+e.getClass()+"] Exception : " + e.getMessage());
			e.printStackTrace();
		}
	}

	private String getElurl() {return "http://" +hosturl+"/";}

	/**
	 * Http RestFull Call
	 * @param functionUrl : Elastic Seach 호출 함수 (ex http://domain:port/+"functionUrl")
	 * @param method  : HTTP 요청 함수 (ex GET,POST)
	 */
	public String CallHttpUrl(String functionUrl , String method) throws Exception{
		String reults;
		//JDJ 나중에 sout 삭제
		URL url = new URL(getElurl() + functionUrl);

		HttpURLConnection con = (HttpURLConnection) url.openConnection();
		con.setRequestMethod(method);
		con.setDoInput(true);
		con.setDoOutput(true);

		//HTTP REQUEST Head 선언
//		con.setRequestProperty("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
		con.setRequestProperty("Content-Type", "application/octet-stream; charset=UTF-8");
		con.setRequestProperty("Connection", "keep-alive");
		con.setRequestProperty("Accept-Encoding", "gzip, deflate, br");
		//추후 필요시 추가
		//con.setConnectTimeout();       //커넥션 timeout
		//con.setReadTimeout();          //컨텐츠 조회 timeout

		OutputStreamWriter writers = new OutputStreamWriter(con.getOutputStream());
		writers.write("{}"); //body
		writers.flush();

		try(BufferedReader br = new BufferedReader(new InputStreamReader(con.getInputStream()))) {
			StringBuilder response = new StringBuilder();
			String responseLine;
			while ((responseLine = br.readLine()) != null) { response.append(responseLine.trim());	}
			reults = response.toString();
		}
		finally {
			con.disconnect();
		}
		return reults;
	}

	/**
	 * Http RestFull Call for POST
	 * @param functionUrl : POST 형식의  함수 호출 (ex http://domain:port/+"functionUrl")
	 * @param params  : Map<String,Object>
	 */
	public String CallHttpUrlPost(String functionUrl, Map<String,Object> params) throws Exception{
		//기능 url 생성
		URL url = new URL(getElurl() + functionUrl + "?");
		String result = "";
		
        StringBuilder postData = new StringBuilder();
        
        //key value 분리 후 UTF-8 인코딩 처리
        for (Map.Entry<String,Object> param : params.entrySet()) {
            if (postData.length() != 0) postData.append('&');
            postData.append(URLEncoder.encode(param.getKey(), "UTF-8"));
            postData.append('=');
            postData.append(URLEncoder.encode(String.valueOf(param.getValue()), "UTF-8"));
        }
        
        //LOGGER.error("========== smsHistoryPost url : " + url.toString() + postData.toString());
        
        //전체 데이터 
        byte[] postDataBytes = postData.toString().getBytes("UTF-8");

        HttpURLConnection conn = (HttpURLConnection)url.openConnection();        
        conn.setRequestMethod("POST");
        conn.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
//        conn.setRequestProperty("Content-Type", "application/octet-stream");
        conn.setRequestProperty("Content-Length", String.valueOf(postDataBytes.length));
        conn.setDoOutput(true);
        conn.getOutputStream().write(postDataBytes);
        conn.setConnectTimeout(1000*5);
        
//        LOGGER.error("====== getResponseCode : "+ String.valueOf(conn.getResponseCode()));
//        LOGGER.error("====== responseCode : "+ conn.getResponseMessage());
        
        try {        	
	        Reader in = new BufferedReader(new InputStreamReader(conn.getInputStream(), "UTF-8"));
	
	        StringBuilder sb = new StringBuilder();
	        
	        for (int c; (c = in.read()) >= 0;) {
	            sb.append((char)c);
	        }
	        
	        result = sb.toString();
	        
        } catch(Exception e) {
        	LOGGER.error("====== CallHttpUrlPost : "+ e.getLocalizedMessage());
        } finally {
			conn.disconnect();
		}
        
//        LOGGER.error("===== result : " + result);
        
        return result;
	}
	
	/**
	 * Http RestFull Call for POST
	 * @param functionUrl : POST 형식의  함수 호출 (ex http://domain:port/+"functionUrl")
	 * @param params  : Map<String,Object>
	 */
	public String CallHttpUrlPostMMS(String functionUrl, Map<String,Object> params) throws Exception{
		
		String result = "";
		try {
		    String boundaryTime = Long.toHexString(System.currentTimeMillis()); // Just generate some unique random value.
	        String boundary = "----"+boundaryTime;

//			URL url = new URL("http://14.192.90.244:7999/Sms/send?");
	        URL url = new URL(getElurl() + functionUrl + "?");
			HttpURLConnection connection;
			connection = (HttpURLConnection) url.openConnection();	
			
			connection.setRequestProperty("Content-Type", "multipart/form-data; boundary=" + boundary);
            connection.setRequestMethod("POST");
            connection.setDoInput(true);
            connection.setDoOutput(true);
            connection.setUseCaches(false);
            connection.setConnectTimeout(10000);
            
            this.output  = connection.getOutputStream();
            this.writer = new PrintWriter(new OutputStreamWriter(output, charset), true);
            
            addString(boundary, "tenantPrefix", params.get("tenantPrefix").toString());
            addString(boundary, "sitename", params.get("sitename").toString());
            addString(boundary, "sysPrefix", params.get("sysPrefix").toString());
            addString(boundary, "phone", params.get("phone").toString());
            addString(boundary, "callback", params.get("callback").toString());
            addString(boundary, "msg", params.get("msg").toString());
            addString(boundary, "agentId", params.get("agentId").toString());
            addString(boundary, "customerId", params.get("customerId").toString()); 
            
            //양지병원 템플릿 추가
            if("YJI".equals(StringUtil.nullToBlank(params.get("tenantPrefix")))) {
            	addString(boundary, "templateId", StringUtil.nullToBlank(params.get("tmplMgntNo")));
            }
            
            if(params.get("filePath") != null) {
            	 String[] filePath = (String[]) params.get("filePath");
                 if(filePath.length > 0) {
                 	for(int i=0; i<filePath.length; i++) {

                 		String f = filePath[i];
                 		if(f != null && !"".equals(f)) {
                 			File file = new File(f);
							addFile(boundary, "uploadFiles", file);
                 		}
                 		
//                     	File file = new File(filePath[i].toString());
//                         addFile(boundary, "uploadFiles", file);
                     }
                 }
            }
            
            addEnd(boundary);
            strBuilder.append("--" + boundary + "--").append(CRLF);
            
            
            int httpStatus = connection.getResponseCode();
            
            BufferedReader br = new BufferedReader(new InputStreamReader(connection.getInputStream(), charset));
            StringBuilder sb = new StringBuilder();
            String line = "";
            while ((line = br.readLine()) != null) {
                sb.append(line);
            }
            
            result = sb.toString();
            
            setHttpStatus(httpStatus);
            Gson gson = new Gson();
            
//            System.out.println(strBuilder);
//            System.out.println(result);

		} catch(Exception e) {
			e.printStackTrace();
		} finally {
			this.writer.close();
		}

		
        return result;
	}
	
	private void addString(String boundary, String _key, String _value){// Send normal String
		StringBuilder sb = new StringBuilder();
        sb.append("--"+ boundary).append(CRLF);
        sb.append("Content-Disposition: form-data; name=\""+ _key +"\"").append(CRLF);
        sb.append(CRLF).append(_value).append(CRLF);
        
        strBuilder.append("--"+ boundary).append(CRLF);
        strBuilder.append("Content-Disposition: form-data; name=\""+ _key +"\"").append(CRLF);
        strBuilder.append(CRLF).append(_value).append(CRLF);
         
        this.writer.append(sb).flush();
    }
	
	private void addFile(String boundary, String _key, File _file) throws IOException{// Send File
        StringBuilder sb = new StringBuilder();     
        sb.append("--"+ boundary).append(CRLF);
        sb.append("Content-Disposition: form-data; name=\""+ _key +"\"; filename=\"" + _file.getName() + "\"").append(CRLF);
        sb.append("Content-Type: "+ URLConnection.guessContentTypeFromName(_file.getName())).append(CRLF); // Text file itself must be saved in this charset!
        sb.append(CRLF);
        this.writer.append(sb).flush();
        
        strBuilder.append("--"+ boundary).append(CRLF);
        strBuilder.append("Content-Disposition: form-data; name=\""+ _key +"\"; filename=\"" + _file.getName() + "\"").append(CRLF);
        strBuilder.append(CRLF);

        FileInputStream inputStream = new FileInputStream(_file);
        byte[] buffer = new byte[(int)_file.length()];
        int bytesRead = -1;
        while ((bytesRead = inputStream.read(buffer)) != -1) {
        	this.output.write(buffer, 0, bytesRead);
        }
        
        this.output.flush();
        inputStream.close();        

        this.writer.append(CRLF).flush();
        
        strBuilder.append("img");
        strBuilder.append(CRLF);
    }
	
	private void addEnd(String boundary){//End of multipart/form-data.
        StringBuilder sb = new StringBuilder();
        sb.append("--").append(boundary).append("--").append(CRLF);
        this.writer.append(sb).flush();
    }
	
	public String Send(SendObject send) throws Exception{

		String query = "TenantPreFix=" + send.getTenantPrefix();
		String sendMsg = URLEncoder.encode(send.getMsg(), "UTF-8");
		
		query += "&sysPrefix=" + send.getSysPrefix();
		query += "&phone=" + send.getPhone();
		query += "&callback=" + send.getCallback();
		query += "&msg=" + sendMsg;
		query += "&agentId=" + send.getAgentId();
		query += "&customerId=" + send.getCustomerId();

		return CallHttpUrl("Sms/Send?"+query, HttpMethod.POST);
	}
	
	
	/**
	  * @Method Name : sendSms
	  * @작성일 : 2022. 11. 17
	  * @작성자 : sjyang
	  * @변경이력 : 
	  * @Method 설명 : POST방식 SMS 발송 호출
	  * @param : SendObject send
	  * @return : json
	  */
	public String sendSms(SendObject send) throws Exception{
		
        Map<String,Object> params = new LinkedHashMap<>();
        
        params.put("tenantPrefix"	,send.getTenantPrefix());		
		params.put("sysPrefix"		,send.getSysPrefix());
        params.put("phone"			,send.getPhone());
        //params.put("tmplMgntNo"		,send.getTmplMgntNo());
        params.put("msg"			,send.getMsg());
        params.put("callback"		,send.getCallback());
        params.put("agentId"		,send.getAgentId());
        params.put("customerId"		,send.getCustomerId());
        params.put("SiteName"		,"NCRM");
        params.put("jsonList"		, send.getJsonList());
        params.put("sitename"		, send.getSitename());
        params.put("filePath"		, send.getFilePath());
        
        if("BONA2".equals(StringUtil.nullToBlank(send.getCldDv()))) {
        	
        	//양지병원 발송 시 템플릿 번호 추가 : HCRM에서 통계 제공을 위한 값
	        if("YJI".equals(StringUtil.nullToBlank(send.getTenantPrefix()))) {
	        	params.put("templateId" ,StringUtil.nullToBlank(send.getTmplMgntNo()));
	        }
        }
        
        return CallHttpUrlPostMMS("sms/send", params);
        
		
	}
	
	public String getSMSMonitor(String tenantID)throws Exception {
		return CallHttpUrl("Sms/getSMSMonitor?tenantPrefix="+tenantID, HttpMethod.GET);
	}

	public String smsUsingYnAuth(String tenantID) throws Exception{
		return CallHttpUrl("Sms/smsUsingYnAuth?tenantPrefix="+tenantID,HttpMethod.GET);
	}
}
