package org.crm.util.json;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.RequestBody;

import jakarta.servlet.http.HttpServletRequest;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

/***********************************************************************************************
* Program Name : 공통 JSON유틸(JsonUtil.java)
* Creator      : sukim
* Create Date  : 2021.12.20
* Description  : 공통 JSON유틸
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2021.12.20     sukim            최초생성
************************************************************************************************/
public class JsonUtil {
	
	private static final Logger LOGGER = LoggerFactory.getLogger(JsonUtil.class);
	
    public String readJsonBody(HttpServletRequest request) throws IOException {
        BufferedReader input = new BufferedReader(new InputStreamReader(request.getInputStream()));
        StringBuilder builder = new StringBuilder();
        String buffer;
        while ((buffer = input.readLine()) != null) {
            if (builder.length() > 0) {
                builder.append("\n");
            }
            builder.append(buffer);
        }
        return builder.toString();
    }    
    
    public static JSONObject parseJSON(HttpServletRequest request) throws IOException {
    	JSONObject jsonObject = null;
       	try {
        	JsonUtil jsonUtils = new JsonUtil();
        	JSONParser jsonParser = new JSONParser();
        	jsonObject = (JSONObject) jsonParser.parse(jsonUtils.readJsonBody(request));
       	}catch(Exception e) {
       		LOGGER.error("["+e.getClass()+"] Exception : " + e.getMessage());
       	}
		return jsonObject;
    }
    
    public static JSONArray parseJSONArray(@RequestBody String body, String listKeyword) throws IOException {
    	JSONArray jsonArray = null;
       	try {
       		JSONParser jsonParser = new JSONParser();
       		JSONObject jsonObject = (JSONObject)jsonParser.parse(body);
    		jsonArray = (JSONArray) jsonObject.get(listKeyword);  //ex) listKeyword → list
       	}catch(Exception e) {
       		LOGGER.error("["+e.getClass()+"] Exception : " + e.getMessage());
       	}
		return jsonArray;
    } 
    
    public static JSONObject parseJSONString(String jsonData) throws IOException {
    	JSONObject jsonObject = null;
       	try {
			JSONParser jsonParser = new JSONParser();
			Object object = jsonParser.parse(jsonData.toString());
			jsonObject = (JSONObject) object;
       	}catch(Exception e) {
       		LOGGER.error("["+e.getClass()+"] Exception : " + e.getMessage());
       	}
		return jsonObject;
    }      
    
    public static JSONObject stringToJson(String strJson){
    	 JSONObject jsonObj = null;
    	 try {
    		 JSONParser jsonParser = new JSONParser();
    	     Object obj = jsonParser.parse(strJson);
    	     jsonObj = (JSONObject) obj;		 
    	 }catch(Exception e) {
        		LOGGER.error("["+e.getClass()+"] Exception : " + e.getMessage());
         }
    	 return jsonObj;
    }

}
