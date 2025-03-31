package org.crm.bizs.GBRD.Util;

import org.crm.config.spring.config.GPropertiesService;
import org.crm.util.string.StringUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.regex.Pattern;

/***********************************************************************************************
* Program Name : NCRM -> OAM out 공통
* Creator      : djjung
* Create Date  : 2023.01.12
* Description  :  NCRM -> OAM out 공통
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2023.01.12     djjung            최초생성
************************************************************************************************/

@Component("GBRDRestUtil")
public class GBRDRestUtil {

	@Autowired
	private GPropertiesService propertiesService;

	@Autowired
	private MessageSource messageSource;

	private RestTemplate restTemplate;

	@Autowired
	public GBRDRestUtil(RestTemplate restTemplate) {
		this.restTemplate = restTemplate;
	}

	private String getOAMServiceUrl(String cloudName){
		return propertiesService.getString(cloudName) + propertiesService.getString("servicComm");
	}

	private String getCallBackServiceUrl(String cloudName,String query){
		return propertiesService.getString(cloudName) + propertiesService.getString("serviceCallBackUpdate") + "?"+query;
	}

	private String getCallBotServiceUrl(){
		return  propertiesService.getString("serviceCallBotList");
	}

	private String getInfoPushServiceUrl(boolean createToken){
		if(createToken){
			return  propertiesService.getString("serviceInfoPush")+propertiesService.getString("serviceInfoPushCreateToken");
		}else{
			return  propertiesService.getString("serviceInfoPush")+propertiesService.getString("serviceInfoPushInvoke");
		}
	}

	private HttpHeaders GetDefaultJsonHeader(){
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(new MediaType("application","json",StandardCharsets.UTF_8));
		headers.setConnection("keep-alive");
		return headers;
	}

	/**
	 * @param       : String body  = json param
	 * @return      : String result  = json request
	 */
	public String CallHttpUrl(String body, String cloudName) throws Exception {
		//통신 전송
		String result = "";
		if (!cloudName.equals("")) {
			try {
				result =  this.restTemplate.postForObject(getOAMServiceUrl(cloudName),new HttpEntity<>(body,GetDefaultJsonHeader()),String.class);
			} catch (Exception e) {
				throw new RuntimeException(e);
			}
		}
		return result;
	}

	public String CallGetHttpUrl(String cloudName,String query) throws Exception {
		String result = "";
		if (!cloudName.equals("")) {
			try {
				result = this.restTemplate.exchange(getCallBackServiceUrl(cloudName,query), HttpMethod.GET,new HttpEntity<>("",GetDefaultJsonHeader()),String.class).getBody();
			} catch (Exception e) {
				throw new RuntimeException(e);
			}
		}
		return result;
	}

	public Map<String,Object> CallHttpUrlToCallBot(String body) throws Exception {
		//통신 전송
		String result = "";
		try {
			result = this.restTemplate.postForObject(getCallBotServiceUrl(),new HttpEntity<>(body,GetDefaultJsonHeader()),String.class);
		} catch (Exception e) {
			throw new RuntimeException(e);
		}
		return new ObjectMapper().readValue(result, Map.class);
	}

	public Map<String,Object> CallHttpUrlToInfoPush(JSONObject body) throws Exception {

		//tenantId,phonenumber,Mesage,Url
		String tenantId = StringUtil.JsonStringNullCheck(body.get("tenantId"));
		String phone = StringUtil.JsonStringNullCheck(body.get("phone"));
		String message = StringUtil.JsonStringNullCheck(body.get("message"));
		String url =StringUtil.JsonStringNullCheck(body.get("url"));

		//통신 전송
		JSONObject result;
		try {
			result = this.restTemplate
					.postForObject(getInfoPushServiceUrl(true),new HttpEntity<>(GetTokenRequest(tenantId),GetDefaultJsonHeader()),JSONObject.class);

			if(result.get("Code").equals("Success")){
				String token = StringUtil.JsonStringNullCheck(result.get("Token"));
				if(token != null){
					result = this.restTemplate
							.postForObject(getInfoPushServiceUrl(false),new HttpEntity<>(GetInvokeRequest(token,phone,message,url),GetDefaultJsonHeader()),JSONObject.class);
				}else{
					result = new JSONObject();
					result.put("result","TokenNoFound");
					return result;
				}
			}else{
				result = new JSONObject();
				result.put("result","TokenCreateFail");
				return result;
			}

		} catch (Exception e) {
			throw new RuntimeException(e);
		}
		return result;
	}



	private JSONObject GetTokenRequest(String tenantId){
		JSONObject obj = new JSONObject();
		obj.put("RequestID","");
		obj.put("Name","");
		obj.put("Token","");
		obj.put("Method","Create");

		JSONObject parameter = new JSONObject();
		parameter.put("TenantPrefix",tenantId);
		parameter.put("AgentId","nCRM");
		obj.put("Parameter",parameter);
		return obj;
	}

	private JSONObject GetInvokeRequest(String token,String phoneNumber,String message,String url){
		JSONObject obj = new JSONObject();
		obj.put("RequestID","1");
		obj.put("Name","Callgate");
		obj.put("Token",token);
		obj.put("Method","Create");

		JSONObject parameter = new JSONObject();
		parameter.put("ServiceType","P");
		parameter.put("PhoneNumber",phoneNumber);
		parameter.put("MessageContents",message);
		parameter.put("Url",url);
		obj.put("Parameter",parameter);
		return obj;
	}

	/**
	 *	api 요청 시 input 값의 유효성 체크
	 *  해당 key 값에 속성값 정의
	 * @작성일      : 2024.04.17
	 * @작성자      : shpark
	 * @param key
	 * @param mdty
	 * @param vald
	 * @param reg
	 * @param regVul
	 * @return
	 */

	public Map<String,Object> ApiParamVrbsInfo(String key, String mdty, String vald, String reg, String regVul){
		/*
		 * 예시)
		 * 		vrbsInfos.add( GBRDRestUtil.ApiParamVrbsInfo("procCd","1","1","","")  );					//procCd 	, 필수 , 값 1
		 * 		vrbsInfos.add( GBRDRestUtil.ApiParamVrbsInfo("sttcTyp","1","usr,grp,typ","","")  );			//sttcTyp 	, 필수 , 값 usr,grp,typ
		 * 		vrbsInfos.add( GBRDRestUtil.ApiParamVrbsInfo("startDate","1","","\\d{8}","yyyymmdd")  );	//startDate , 필수 ,  ,정규식 \\d{8} , yyyymmdd 형태
		 */
		Map<String,Object> vrbsInfo = new HashMap<String, Object>();
		vrbsInfo.put("key"  	, key);  						// key 값.
		vrbsInfo.put("mdty" 	, mdty);		  				// 필수 여부  1이면 필수 이외는 전부 필수 아님.
		vrbsInfo.put("vald" 	, vald);						// 정해진 값이 있을 시 복수의 경우 ,로 구분
		vrbsInfo.put("reg"  	, reg);							// partten 의 형태인 경우 정규식에 해당하는 값  ex) "\\d{8}"
		vrbsInfo.put("regVul" 	, regVul);						// partten 의 형태인 경우 err시 표현해 줄 값.  ex) yyyymmdd
		return vrbsInfo;
	}

	/**
	 *
	 *	api 요청 시 input 값의 유효성 체크
	 *  해당 key 값에 속성값 정의
	 *  배열형태로 한번에 처리 할 수 있음.
	 * @작성일      : 2024.04.17
	 * @작성자      : shpark
	 * @param vrbsInfosArray
	 * @return
	 */
	public List<Map<String,Object>> ArrayToVrbsInfos(String[][] vrbsInfosArray){
		/*
		 *    예시 )
		 * 		String[][] vrbsInfosArray = {
		 *               {"procCd"		,"1"	,"1"				,""			,""			}
		 * 				,{"sttcTyp"		,"1"	,"usr,grp,typ"		,""			,""			}
		 * 				,{"startDate"	,"1"	,""					,"\\d{8}"	,"yyyymmdd"	}
		 * 				,{"searchType"	,"1"	,"TZ,DY,MN"			,""			,""			}
		 * 		};
		 * 		vrbsInfos = GBRDRestUtil.ArrayToVrbsInfos(vrbsInfosArray);
		 */
		List<Map<String,Object>> vrbsInfos = new ArrayList<Map<String,Object>>();

		for(String[] vrbsInfo : vrbsInfosArray){
			vrbsInfos.add(ApiParamVrbsInfo(vrbsInfo[0],vrbsInfo[1],vrbsInfo[2],vrbsInfo[3],vrbsInfo[4]));
		}
		return vrbsInfos;
	}

	/**
	 * 위에서 유효성 체크를 위해 만든 값을 이용해
	 * 유효성 체크.
	 * 여러건의 에러라도 한건만 처리.
	 * @작성일      : 2024.04.17
	 * @작성자      : shpark
	 * @param obj
	 * @param vrbsInfos
	 * @return
	 */
	public Map<String, Object> ApiParamChk (JSONObject obj , List<Map<String,Object>> vrbsInfos){
		Map<String,Object> errMap = new HashMap<>();

		for(Map<String,Object> vrbsInfo  : vrbsInfos ){

			if(vrbsInfo.get("mdty").toString().equals("1")){
				if(!obj.containsKey(vrbsInfo.get("key"))){
					errMap.put("code" , "100");
					errMap.put("textArr" , new String[]{vrbsInfo.get("key").toString()});
					break;
				}
			}
			if(!vrbsInfo.get("vald").toString().equals("")){
				//특정 값이
				String[] valds = vrbsInfo.get("vald").toString().split(",");
				ArrayList<String> valdsList = new ArrayList<>(Arrays.asList(valds));

				if( !valdsList.contains(obj.get(vrbsInfo.get("key")))  ){
					errMap.put("code" , "200");
					errMap.put("textArr" , new String[]{vrbsInfo.get("key").toString() , vrbsInfo.get("vald").toString()});
					break;
				}

			}

			if(!vrbsInfo.get("reg").toString().equals("")){
				//정규식에 부합하지 않는 경우 에러
				if( !Pattern.matches( vrbsInfo.get("reg").toString(), obj.get(vrbsInfo.get("key")).toString() )  ){
					errMap.put("textArr" , new String[]{vrbsInfo.get("key").toString() , vrbsInfo.get("regVul").toString()});
					errMap.put("code" , "300");
					break;
				}
			}
		}
		return errMap;

	}


	/**
	 *
	 * @param propertie		message.properties에서 메시지 가져 오기 위한 변수
	 * @param obj			input 값
	 * @param map			result(결과값) , errCd(에러코드) , request(메시지에 들어갈 변수 배열) 형태로 이루어진 맵
	 * @param locale		나라 언어
	 * @작성일      : 2024.04.17
	 * @작성자      : shpark
	 * @return
	 *
	 * 코드에 맞게 값 출력 위해 사용.
	 * ex )
	 * GBRD100.errMsg200={0}는 ({1}) 중 하나의 값만 올 수 있습니다.
	 * messageSource.getMessage("GBRD100.errMsg" , {"prsLvlCd" , "L1,L2,L3,L4,L5"}, "200", locale));
	 * 								=> 				prsLvlCd는    (L1,L2,L3,L4,L5) 중 하나의 값만 올 수 있습니다.
	 */
	public HashMap<String, Object> ResultSet(String propertie ,JSONObject obj ,HashMap<String, Object> map , Locale locale) {
		String messagePropNm = "";
		HashMap<String, Object> result = new HashMap<>();

		if(map == null){
			messagePropNm = propertie+"999";
			result.put("result", 	messageSource.getMessage(messagePropNm , null, "999", locale));
			result.put("errCd", 	"999");
			result.put("request", 	obj);
		}else{
			if(map.get("errCd").equals("success")){
				result.put("result", 	map.get("result"));
				result.put("errCd", 	map.get("errCd").toString());
				result.put("request", 	obj);
			}else{

				messagePropNm = propertie+ map.get("errCd").toString();
				result.put("result", 	messageSource.getMessage(messagePropNm, (String[]) map.get("request"), map.get("errCd").toString(), locale));
				result.put("errCd", 	map.get("errCd").toString());
				result.put("request", 	obj);
			}
		}
		return result;
	}

	/**
	 * 예상치 못한 Exception 에러시 공통 처리
	 * @작성일      : 2024.04.17
	 * @작성자      : shpark
	 * @param msg
	 * @return
	 */
	public String ResultException(String msg  ,JSONObject obj ){
		return "{\"result\" : \""+msg+"\" , \"errCd\" : \"800\" , \"request\" : "+obj+" }";

	}

}
