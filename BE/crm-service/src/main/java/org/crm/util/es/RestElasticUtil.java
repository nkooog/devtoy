package org.crm.util.es;

import org.crm.config.spring.config.PropertiesService;
import org.crm.util.es.jsonObject.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.Resource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.util.ObjectUtils;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.lang.reflect.Field;
import java.nio.charset.StandardCharsets;
import java.util.*;

/***********************************************************************************************
 * Program Name : Elastic 통신 모듈
 * Creator      : djjung
 * Create Date  : 2022.10.06
 * Description  : Elastic
 * Modify Desc  :
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.10.06     djjung            최초생성
 ************************************************************************************************/

@Component("RestElasticUtil")
public class RestElasticUtil {
	private static final Logger LOGGER = LoggerFactory.getLogger(RestElasticUtil.class);

	@Autowired
	private ObjectMapper objectMapper;

	@Autowired
	private RestTemplate restTemplate;

	/** Context-Properties.xml 참고*/
	@Resource( name = "propertiesService" )
	private PropertiesService propertiesService;

	private String GetUrl(String functionUrl) {
		return propertiesService.getString("elkUrl") + functionUrl;
	}
	private String GetAuthorization(){
		String id = propertiesService.getString("elkId");
		String pw = propertiesService.getString("elkPw");
//		return "Basic " + new BASE64Encoder().encode((id + ":" + pw).getBytes());
		return "Basic " + Base64.getEncoder().encodeToString((id + ":" + pw).getBytes());
	}

	/**
	 * RestFull 통신
	 * @param functionUrl : Elastic Seach 호출 함수 (ex http://domain:port/+"functionUrl")
	 * @param method  : HTTP 요청 함수 (ex GET,PUT,POST,DELET
	 * @param body : PUT,POST 함수시 필수
	 */
	private String CallHttpUrl(String functionUrl , HttpMethod method ,String body){
		//해더 설정
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(new MediaType("application","json",StandardCharsets.UTF_8));
		headers.setConnection("keep-alive");
		headers.set("Authorization",GetAuthorization());


		if (method.equals(HttpMethod.GET) || method.equals(HttpMethod.DELETE)) {
			return this.restTemplate.exchange(GetUrl(functionUrl), method, new HttpEntity<>(body, headers), String.class).getBody();
		} else if (method.equals(HttpMethod.POST)) {
			return this.restTemplate.postForEntity(GetUrl(functionUrl), new HttpEntity<>(body, headers), String.class).getBody();
		} else if (method.equals(HttpMethod.PUT)) {
			return this.restTemplate.exchange(GetUrl(functionUrl), HttpMethod.PUT, new HttpEntity<>(body, headers), String.class).getBody();
		}
		return "";
	}
	/**
	 * 문서 조건 검색 쿼리
	 * @param tenantId : tenatID
	 * @param serviceName  : 호출 인덱스 (KMST or CMMT)
	 * @param search : 검색 조건
	 */
	public ResultObject SearchBoolQuery(String tenantId, String serviceName, SearchObject search) throws Exception {
		String url = tenantId.toLowerCase()+"_"+serviceName.replaceAll("[0-9]", "").toLowerCase()+"/_search";

		String shoud = ShoudTextSearch(search);
		String filter = FilterText(search);

		String body;
		StringBuilder buffer = new StringBuilder();
;		if(shoud.equals("")){
			body = "{\n" +
					"    \"query\":\n" +
					"    {\n" +
					"        \"bool\": \n" +
					"        {\n" +
					"            "+filter+"\n"+
					"        }\n" +
					"    },\n" +
					"    \"size\": 1000,\n" +
					"    \"highlight\": {\n" +
					"    \"pre_tags\" : [\"<span>\"],\n" +
					"    \"post_tags\" : [\"</span>\"],\n" +
					"    \"fields\" : {\n" +
					"    \"title\" : {}\n" +
					"       }\n" +
					"   }\n" +
					"}";
		}else{
			body =  "{\n" +
					"    \"query\":\n" +
					"    {\n" +
					"        \"bool\": \n" +
					"        {\n" +
					"           "+shoud+",\n"+
					"        \n"+
					"            "+filter+"\n"+
					"        }\n" +
					"    },\n" +
					"    \"highlight\": {\n" +
					"    \"pre_tags\" : [\"<span style=background-color:#ADDDFB;>\"],\n" +
					"    \"post_tags\" : [\"</span>\"],\n" +
					"    \"fields\" : {\n" +
					"    \"title\" : {},\n" +
					"    \"mokti.moktiCttTxt\" : {}\n" +
					"       }\n" +
					"   },\n" +
					"    \"size\": 1000\n" +
					"}";
		}
		LOGGER.debug("######### body ::: " + body);
		String result= CallHttpUrl(url, HttpMethod.POST,body);
		return this.objectMapper.readValue(result, ResultObject.class);
	}

	public ResultObject SearchRandomQuery(String tenantId, String serviceName, SearchObject search) throws Exception {
		String url = tenantId.toLowerCase()+"_"+serviceName.replaceAll("[0-9]", "").toLowerCase()+"/_search";

		String ctgrMgntNo =ShoudTearmQuery(search,"ctgrMgntNo");
		String range = RangeText(search);
		String now = NowText();
		String stCdOk = StCdOKText();

		String body = "{\n" +
					  "  \"query\":{\n" +
					  "    \"function_score\": {\n" +
					  "      \"query\" : {\n" +
					  "        \"bool\": {\n" +
					  "          \"must\":[\n" +
					  "             "+ctgrMgntNo+isNull(ctgrMgntNo)+
					  "             "+range+isNull(range)+
					  "             "+now+isNull(now)+
					  "             "+stCdOk+
					  "          ]\n" +
					  "        }\n" +
					  "      },\n" +
					  "      \"functions\": [{\"random_score\": {}}]\n" +
					  "    }\n" +
					  "  },\n" +
					  "  \"size\": 10\n" +
					  "}";
		String result= CallHttpUrl(url, HttpMethod.POST,body);
		return new ObjectMapper().readValue(result, ResultObject.class);
	}

	public ResultObject AllDocRead(String tenantId, String serviceName, SearchObject search) throws Exception {
		String url = tenantId.toLowerCase()+"_"+serviceName.replaceAll("[0-9]", "").toLowerCase()+"/_search";

		String ctgrMgntNo =ShoudTearmQuery(search,"ctgrMgntNo");
		String range = RangeText(search);
		String now = NowText();
		String stCdOk = StCdOKText();

		String body = "{\n" +
				"  \"query\":{\n" +
				"    \"bool\": {\n" +
				"      \"must\":[\n" +
				"         "+ctgrMgntNo+isNull(ctgrMgntNo)+
				"         "+range+isNull(range)+
				"         "+now+isNull(now)+
				"         "+stCdOk+
				"      ]\n" +
				"    }\n" +
				"  },\n" +
				"  \"size\": 1000\n" +
				"}";
		LOGGER.info(body);
		String result= CallHttpUrl(url, HttpMethod.POST,body);
		return new ObjectMapper().readValue(result, ResultObject.class);
	}

	/**
	 * 문서 생성및 수정 쿼리
	 * @param tenantId : tenatID
	 * @param serviceName  : 호출 인덱스 (KMST or CMMT)
	 * @param docId : "ctgrMgntNo"_"blthgMgntNo"
     * @param doc : 추가할 문서
	 */
	public String insertQuery(String tenantId, String serviceName, String docId , docObject doc) throws Exception {
		String url = tenantId.toLowerCase()+"_"+serviceName.replaceAll("[0-9]", "").toLowerCase()+"/_doc/"+docId;
		String jsonInString = this.objectMapper.writeValueAsString(doc);

		return CallHttpUrl(url, HttpMethod.PUT,jsonInString);
	}
	/**
	 * 문서 내용 수정 쿼리
	 * @param tenantId : tenatID
	 * @param serviceName  : 호출 인덱스 (KMST or CMMT)
	 * @param docId : "ctgrMgntNo"_"blthgMgntNo"
	 * @param doc : 추가할 내용
	 */
	public String UpdateQuery(String tenantId,String serviceName, String docId ,docObject doc) throws Exception {
		String url = tenantId.toLowerCase()+"_"+serviceName.replaceAll("[0-9]", "").toLowerCase()+"/_update/"+docId;
		String updatelist = GetUpdateText(doc);
		updatelist = updatelist.substring(0,updatelist.length()-2);
		try {
			String body = "{\n" +"  \"doc\": { "+updatelist+" }\n" +	"}";
			return CallHttpUrl(url, HttpMethod.POST,body);
			/**
			 * Elastic 없는 문서 삭제시 404 반환
			 * RestTempalte에서 400~500 번떄 응답시 아래와 같이 Exception 반환
			 * 4~~  HttpClientErrorException,
			 * 5~~  HttpServerErrorException  */
		}
		catch (HttpClientErrorException e){
			String result = e.getResponseBodyAsString();
			if(result.contains("document missing")){//문서 없음
				return "doc not exist";
			}else{
				throw new HttpClientErrorException(e.getStatusCode(),e.getStatusText(),e.getResponseHeaders(),
						e.getResponseBodyAsByteArray(),e.getResponseHeaders().getContentType().getCharset());
			}
		}
	}
	/**
	 * 문서 삭제 쿼리
	 * @param tenantId : tenatID
	 * @param serviceName  : 호출 인덱스 (KMST or CMMT)
	 * @param docId : "ctgrMgntNo"_"blthgMgntNo"
	 */
	public String DeleteQuery(String tenantId,String serviceName, String docId) throws Exception{
		String url = tenantId.toLowerCase()+"_"+serviceName.replaceAll("[0-9]", "").toLowerCase()+"/_doc/"+docId;
		try {
			String reults = CallHttpUrl(url, HttpMethod.DELETE,null);
			if(reults.contains("not_found")){//문서 없음
				return "doc not exist";
			}
			else{//문서 있는데 삭제함
				return "docID = "+docId+" Delete Complete";
			}
			/**
			 * Elastic 없는 문서 삭제시 404 반환
			 * RestTempalte에서 400~500 번떄 응답시 아래와 같이 Exception 반환
			 * 4~~  HttpClientErrorException,
			 * 5~~  HttpServerErrorException  */
		}catch(HttpClientErrorException e){ //문서 없음 //
			String result = e.getResponseBodyAsString();
			if(result.contains("not_found")){//문서 없음
				return "doc not exist";
			}else{
				throw new HttpClientErrorException(e.getStatusCode(),e.getStatusText(),e.getResponseHeaders(),
						e.getResponseBodyAsByteArray(),e.getResponseHeaders().getContentType().getCharset());
			}
		}

	}
	/**
	 * 문서 번호로 조회 쿼리
	 * @param tenantId : tenatID
	 * @param serviceName  : 호출 인덱스 (KMST or CMMT)
	 * @param docId : 문서번호
	 */
	public GetDocObject DocGetQuery(String tenantId, String serviceName, String docId) throws Exception{
		String url = tenantId.toLowerCase()+"_"+serviceName.replaceAll("[0-9]", "").toLowerCase()+"/_doc/"+docId;
		String result = CallHttpUrl(url, HttpMethod.GET,null);
		return new ObjectMapper().readValue(result, GetDocObject.class); //--수정필요
	}

	/** 카테고리별 문서 갯수 조회
	 *  @param resultObject : 검색 결과
	 */
	public Map<String, Integer> getCatgoryCount(ResultObject resultObject){
		List<String> ctgrmgntArray = new ArrayList<>();
		for(Hit t : resultObject.getHits().getHits()){ctgrmgntArray.add(t.get_source().getCtgrMgntNo());}
		Set<String> set = new HashSet<>(ctgrmgntArray);
		Map<String, Integer> CatagoryCount = new HashMap<>();
		for (String str : set){	CatagoryCount.put(str,Collections.frequency(ctgrmgntArray, str));}
		return CatagoryCount;
	}

	//#region SearchQuery Sub Function
	private String GetUpdateText(Object object) throws Exception {
		StringBuilder result = new StringBuilder();
		for(Field field : object.getClass().getDeclaredFields()){
			field.setAccessible(true);
			String name = field.getName();
			Object value = field.get(object);


			//해당 조건 null Point 에러
			if(value ==null){ continue;}

			if(value.toString().equals("0")){continue;}

			if(name.equals("mokit")){continue;	}

			if(!ObjectUtils.isEmpty(value)){
				result.append("\"").append(name).append("\":\"").append(value).append("\", ");
			}
		}
		return result.toString();
	}

	private String ShoudTextSearch(SearchObject search){
		String result="";

		if (!search.getSearchText().equals("")) {
			switch (search.getSearchType()){
				case "ALL":
					result= "\t\t\t\"must\":\n" +
							"\t\t\t[\n" +
							"\t\t\t    {\n" +
							"\t\t\t        \"bool\":\n" +
							"\t\t\t        {\n" +
							"\t\t\t            \"should\":\n" +
							"\t\t\t            [\n" +
							"\t\t\t                {\n" +
							"\t\t\t                    \"match\": { \"title\" : {\"query\": \""+search.getSearchText()+"\"}}\n" +
							"\t\t\t                },\n" +
							"\t\t\t                {\n" +
							"\t\t\t                    \"nested\":\n" +
							"\t\t\t                    {\n" +
							"\t\t\t                        \"path\": \"mokti\",\n" +
							"\t\t\t                        \"query\": \n" +
							"\t\t\t                        {\n" +
							"\t\t\t                            \"match\": { \"mokti.moktiCttTxt\" : {\"query\": \""+search.getSearchText()+"\"} } \n" +
							"\t\t\t                        }\n" +
							"\t\t\t                    }\n" +
							"\t\t\t                }\n" +
							"\t\t\t            ]\n" +
							"\t\t\t        }\n" +
							"\t\t\t    }\n" +
							"\t\t\t]";
					break;
				case "TITLE":
					result= "\t\t\t\"must\":\n" +
							"\t\t\t[\n" +
							"\t\t\t    {\n" +
							"\t\t\t        \"match\": {\"title\" : {\"query\": \""+search.getSearchText()+"\"}}\n" +
							"\t\t\t    }\n" +
							"\t\t\t]";
					break;
				case "CONTENT":
					result= "\t\t\t\"must\": \n" +
							"\t\t\t[\n" +
							"\t\t\t    {\n" +
							"\t\t\t        \"nested\":\n" +
							"\t\t\t        {\n" +
							"\t\t\t            \"path\": \"mokti\",\n" +
							"\t\t\t            \"query\":\n" +
							"\t\t\t            {\n" +
							"\t\t\t                \"match\": { \"mokti.moktiCttTxt\" : {\"query\": \""+search.getSearchText()+"\"}}\n" +
							"\t\t\t            }\n" +
							"\t\t\t        }\n" +
							"\t\t\t    }\n" +
							"\t\t\t]";
					break;
			}
		}

		return result;
	}

	private String FilterText(SearchObject search){

		String ctgrMgntNo =ShoudTearmQuery(search,"ctgrMgntNo");
		String regrId =ShoudTearmQuery(search,"regrId");
		String range = RangeText(search);
		String now = NowText();
		String stCdOk = StCdOKText();

		String filter  = "";
		if(search.getServiceName().equals("kmst300")){ //통합검색
			filter  =
					"\t\t\t\"filter\":\n" +
					"\t\t\t[\n" +
					"\t\t\t     "+ctgrMgntNo+isNull(ctgrMgntNo)+
					"\t\t\t     "+regrId+ isNull(regrId)+
					"\t\t\t     "+range+isNull(range)+
					"\t\t\t     "+now+isNull(now)+
					"\t\t\t     "+stCdOk+
					"\t\t\t]\n";
		}else{
			String stCd =ShoudTearmQuery(search,"stCd");
			if(search.getAdmin()){ // 관리페이지 - 관리자
				filter  =
						"\t\t\t\"filter\":\n" +
						"\t\t\t[\n" +
						"\t\t\t     "+ctgrMgntNo + isNull(ctgrMgntNo) +
						"\t\t\t     "+stCd + isNull(stCd) +
						"\t\t\t     "+regrId+ isNull(regrId)+
						"\t\t\t     "+range+
						"\t\t\t]\n";
			}else{ // 관리페이지 - 사용자
				String login =LoginIdText(search);
				filter  =
						"\t\t\t\"filter\":\n" +
						"\t\t\t[\n" +
						"\t\t\t     "+ctgrMgntNo+isNull(ctgrMgntNo)+
						"\t\t\t     {\n"+
						"\t\t\t         \"bool\":\n"+
						"\t\t\t          {\n"+
						"\t\t\t             \"should\":\n"+
						"\t\t\t              [\n"+
						"\t\t\t                     {\n"+
						"\t\t\t                         \"bool\":\n"+
						"\t\t\t                         {\n"+
						"\t\t\t                             \"must\":\n"+
						"\t\t\t                             [\n"+
						"\t\t\t                                 "+login+isNull(login)+
						"\t\t\t                                 "+stCd+isNull(stCd)+
						"\t\t\t                                 "+range+"\n"+
						"\t\t\t                             ]\n"+
						"\t\t\t                         }\n"+
						"\t\t\t                     },\n"+
						"\t\t\t                     {\n"+
						"\t\t\t                         \"bool\":\n"+
						"\t\t\t                         {\n"+
						"\t\t\t                             \"must\":\n"+
						"\t\t\t                             [\n"+
						"\t\t\t                                 "+regrId+isNull(regrId)+
						"\t\t\t                                 "+stCdOk+isNull(stCdOk)+
						"\t\t\t                                 "+range+isNull(range)+
						"\t\t\t                                 "+now+
						"\t\t\t                             ]\n"+
						"\t\t\t                         }\n"+
						"\t\t\t                     }\n"+
						"\t\t\t              ]\n"+
						"\t\t\t          }\n"+
						"\t\t\t     }\n"+
						"\t\t\t]\n";
			}
		}
		return  filter;
	}

	private String ShoudTearmQuery(SearchObject search, String type){
		String result ="";
		switch(type){
			case "ctgrMgntNo": { result = ShoudTearmText( new ArrayList<>(search.getCtgrMgntNo()),type);}break;
			case "stCd": {result = ShoudTearmText(new ArrayList<>(search.getStCds()),type);}break;
			case "regrId": {result = ShoudTearmText(new ArrayList<>(search.getRegrIds()),type);}break;
		}
		return result;
	}

	private String ShoudTearmText(List<Object> item,String name){
		String result ="";
		if(!item.isEmpty()){
			for (int i = 0; i < item.size(); i++) {
				result +="{\"term\": {\""+name+"\": "+item.get(i).toString()+"}}";
				if(i<item.size()-1){
					result += ",\n";
				}else{
					result += "\n";
				}
			}
			return "{\n" +
					"   \"bool\": \n" +
					"   {\n" +
					"      \"should\": \n" +
					"       [\n" +
					"           "+result+
					"       ]\n" +
					"   }\n" +
					"}";
		}
		return result;
	}

	private String RangeText(SearchObject search){
		return
		"{\n" +
		"\t\"range\": \n" +
		"\t{\n" +
		"\t\t\"regDtm\": \n" +
		"\t\t{\t\n" +
		"\t\t\t\"gte\": \""+search.getSearchStartDate()+"\",\t\n" +
		"\t\t\t\"lte\": \""+search.getSearchEndDate()+"\",\n" +
		"\t\t\t\"relation\": \"within\"\n" +
		"\t\t}\n" +
		"\t}\n" +
		"}";
	}

	private String LoginIdText(SearchObject search){
		return "{\"term\":{\"regrId\":\""+search.getLoginId()+"\"}}";
	}

	private String NowText(){
		return "{\"range\": {\"bltnStrDd\": { \"lte\": \"now\"}}}" ;
	}

	private String StCdOKText(){
		return "{\"bool\":{\"should\":[{\"term\": { \"stCd\": \"12\"}}, {\"term\": { \"stCd\": \"15\"}}]}}";
//		return "{ \"term\":{\"stCd\":\"12\" }},{ \"term\":{\"stCd\":\"15\" }}";
	}

	private  String isNull(String json){
		return json.equals("") ? "" : ", \n";
	}
	//#endregion SearchQuery Sub Function


	//ELK INDEX CRD QUERY
	/**
	 * 인덱스 검색 쿼리
	 * @param tenantId : tenatID
	 * @param serviceName  : 호출 인덱스 (KMST or CMMT) 
	 */
	public boolean GetIndexInfo(String tenantId,String serviceName) {
		String url = tenantId.toLowerCase()+"_"+serviceName.replaceAll("[0-9]", "").toLowerCase();
		try {
			return !CallHttpUrl(url, HttpMethod.GET, null).contains("Error");

		}catch (Exception e){
			e.printStackTrace();
			return false;
		}
	}
	/**
	 * 인덱스 생성 쿼리
	 * @param tenantId : tenatID
	 * @param serviceName  : 호출 인덱스 (KMST or CMMT) 
	 */
	public String CreateIndex(String tenantId,String serviceName) throws Exception{
		String url = tenantId.toLowerCase()+"_"+serviceName.replaceAll("[0-9]", "").toLowerCase();
		boolean checkIndex = GetIndexInfo(tenantId,serviceName);

		if(checkIndex){//인덱스 있음
			return "Index already exist";
		}
		else{
			//인덱스 없음
			String jsonInString = "{\n" +
					"  \"settings\": {\n" +
					"    \"number_of_shards\": \"1\",\n" +
					"    \"number_of_replicas\": \"1\",\n" +
					"    \"analysis\": {\n" +
					"      \"tokenizer\": {\n" +
					"        \"nori_none\": {\n" +
					"          \"type\": \"nori_tokenizer\",\n" +
					"          \"decompound_mode\": \"none\"\n" +
					"        },\n" +
					"        \"nori_discard\": {\n" +
					"          \"type\": \"nori_tokenizer\",\n" +
					"          \"decompound_mode\": \"discard\"\n" +
					"        },\n" +
					"        \"nori_mixed\": {\n" +
					"          \"type\": \"nori_tokenizer\",\n" +
					"          \"decompound_mode\": \"mixed\"\n" +
					"        }\n" +
					"      },\n" +
					"      \"analyzer\": {\n" +
					"        \"korean_none\": {\n" +
					"          \"type\": \"custom\",\n" +
					"          \"tokenizer\": \"nori_none\"\n" +
					"        },\n" +
					"        \"korean_discard\": {\n" +
					"          \"type\": \"custom\",\n" +
					"          \"tokenizer\": \"nori_discard\"\n" +
					"        },\n" +
					"        \"korean_mixed\": {\n" +
					"          \"type\": \"custom\",\n" +
					"          \"tokenizer\": \"nori_mixed\"\n" +
					"        }\n" +
					"      }\n" +
					"    }  \n" +
					"  },\n" +
					"  \"mappings\": {\n" +
					"    \"properties\": {\n" +
					"      \"tenantId\": {\n" +
					"        \"type\": \"keyword\"\n" +
					"      },\n" +
					"      \"ctgrMgntNo\": {\n" +
					"        \"type\": \"long\"\n" +
					"      },\n" +
					"      \"blthgMgntNo\": {\n" +
					"        \"type\": \"long\"\n" +
					"      },\n" +
					"      \"title\": {\n" +
					"        \"type\": \"text\",\n" +
					"        \"analyzer\": \"korean_mixed\",\n" +
					"        \"search_analyzer\": \"korean_mixed\"\n" +
					"      },\n" +
					"      \"stCd\": {\n" +
					"        \"type\": \"keyword\"\n" +
					"      },\n" +
					"      \"typCd\": {\n" +
					"        \"type\": \"keyword\"\n" +
					"      },\n" +
					"      \"rpsImgIdxNm\": {\n" +
					"        \"type\": \"keyword\"\n" +
					"      },\n" +
					"      \"rpsImgPsn\": {\n" +
					"        \"type\": \"keyword\"\n" +
					"      },\n" +
					"      \"bltnStrDd\": {\n" +
					"        \"type\": \"date\",\n" +
					"        \"format\": \"yyyy-MM-dd HH:mm:ss||yyyyMMdd||yyyy/MM/dd\"\n" +
					"      },\n" +
					"      \"bltnEndDd\": {\n" +
					"        \"type\": \"date\",\n" +
					"        \"format\": \"yyyy-MM-dd HH:mm:ss||yyyyMMdd||yyyy/MM/dd\"\n" +
					"      },\n" +
					"      \"permUseYn\": {\n" +
					"        \"type\": \"keyword\"\n" +
					"      },\n" +
					"      \"apvDtm\": {\n" +
					"        \"type\": \"keyword\"\n" +
					"      },\n" +
					"      \"apprId\": {\n" +
					"        \"type\": \"keyword\"\n" +
					"      },\n" +
					"      \"apprOrgCd\": {\n" +
					"        \"type\": \"keyword\"\n" +
					"      },\n" +
					"      \"regDtm\": {\n" +
					"        \"type\": \"date\",\n" +
					"        \"format\": \"yyyy-MM-dd HH:mm:ss||yyyyMMdd||yyyy/MM/dd\"\n" +
					"      },\n" +
					"      \"regrNm\": {\n" +
					"        \"type\": \"keyword\"\n" +
					"      },\n" +
					"      \"regrId\": {\n" +
					"        \"type\": \"keyword\"\n" +
					"      },\n" +
					"      \"regrOrgCd\": {\n" +
					"        \"type\": \"keyword\"\n" +
					"      },\n" +
					"      \"lstCorcDtm\": {\n" +
					"        \"type\": \"date\",\n" +
					"        \"format\": \"yyyy-MM-dd HH:mm:ss||yyyyMMdd||yyyy/MM/dd\"\n" +
					"      },\n" +
					"      \"lstCorprId\": {\n" +
					"        \"type\": \"keyword\"\n" +
					"      },\n" +
					"      \"lstCorpOrgCd\": {\n" +
					"        \"type\": \"keyword\"\n" +
					"      },\n" +
					"      \"appendFileCount\": {\n" +
					"        \"type\": \"long\"\n" +
					"      },\n" +
					"      \"assocKeyword\": {\n" +
					"        \"type\": \"keyword\"\n" +
					"      },\n" +
					"      \"assocContent\": {\n" +
					"        \"type\": \"keyword\"\n" +
					"      },\n" +
					"      \"mokti\": {\n" +
					"        \"type\": \"nested\",\n" +
					"        \"properties\": {\n" +
					"          \"moktiNo\": {\n" +
					"            \"type\": \"long\"\n" +
					"          },\n" +
					"          \"moktiTite\": {\n" +
					"            \"type\": \"text\"\n" +
					"          },\n" +
					"          \"moktiPrsLvl\": {\n" +
					"            \"type\": \"long\"\n" +
					"          },\n" +
					"          \"hgrkMoktiNo\": {\n" +
					"            \"type\": \"long\"\n" +
					"          },\n" +
					"          \"moktiCtt\": {\n" +
					"            \"type\": \"text\"\n" +
					"          },\n" +
					"          \"moktiCttTxt\": {\n" +
					"            \"type\": \"text\",\n" +
					"            \"analyzer\": \"korean_mixed\",\n" +
					"            \"search_analyzer\": \"korean_mixed\"\n" +
					"          }\n" +
					"        }\n" +
					"      }\n" +
					"    }\n" +
					"  }\n" +
					"}";
			//노리 X
//			String jsonInString = "{\n" +
//					"    \"settings\": {\n" +
//					"        \"number_of_shards\": 1,\n" +
//					"        \"number_of_replicas\": 1\n" +
//					"    },\n" +
//					"    \"mappings\": {\n" +
//					"        \"properties\": {\n" +
//					"            \"tenantId\": {\"type\": \"keyword\"},\n" +
//					"            \"ctgrMgntNo\": {\"type\": \"long\"},\n" +
//					"            \"blthgMgntNo\": {\"type\": \"long\"},\n" +
//					"            \"title\": {\"type\": \"text\"},\n" +
//					"            \"stCd\": {\"type\": \"keyword\"},\n" +
//					"            \"typCd\": {\"type\": \"keyword\"},\n" +
//					"            \"rpsImgIdxNm\": {\"type\": \"keyword\"},\n" +
//					"            \"rpsImgPsn\": {\"type\": \"keyword\"},\n" +
//					"            \"bltnStrDd\": {\"type\": \"date\",\"format\": \"yyyy-MM-dd HH:mm:ss||yyyyMMdd||yyyy/MM/dd\"},\n" +
//					"            \"bltnEndDd\": {\"type\": \"date\",\"format\": \"yyyy-MM-dd HH:mm:ss||yyyyMMdd||yyyy/MM/dd\"},\n" +
//					"            \"permUseYn\": {\"type\": \"keyword\"},\n" +
//					"            \"apvDtm\": {\"type\": \"keyword\"},\n" +
//					"            \"apprId\": {\"type\": \"keyword\"},\n" +
//					"            \"apprOrgCd\": {\"type\": \"keyword\"},\n" +
//					"            \"regDtm\": {\"type\": \"date\",\"format\": \"yyyy-MM-dd HH:mm:ss||yyyyMMdd||yyyy/MM/dd\"},\n" +
//					"            \"regrNm\": {\"type\": \"keyword\"},\n" +
//					"            \"regrId\": {\"type\": \"keyword\"},\n" +
//					"            \"regrOrgCd\": {\"type\": \"keyword\"},\n" +
//					"            \"lstCorcDtm\": {\"type\": \"date\",\"format\": \"yyyy-MM-dd HH:mm:ss||yyyyMMdd||yyyy/MM/dd\"},\n" +
//					"            \"lstCorprId\": {\"type\": \"keyword\"},\n" +
//					"            \"lstCorpOrgCd\": {\"type\": \"keyword\"},\n" +
//					"            \"appendFileCount\": {\"type\": \"long\"},\n" +
//					"            \"assocKeyword\": {\"type\": \"keyword\"},\n" +
//					"            \"assocContent\": {\"type\": \"keyword\"},\n" +
//					"            \"mokti\": {\n" +
//					"                \"type\": \"nested\",\n" +
//					"                \"properties\": {\n" +
//					"                    \"moktiNo\": {\"type\": \"long\"},\n" +
//					"                    \"moktiTite\": {\"type\": \"text\"},\n" +
//					"                    \"moktiPrsLvl\": {\"type\": \"long\"},\n" +
//					"                    \"hgrkMoktiNo\": {\"type\": \"long\"},\n" +
//					"                    \"moktiCtt\": {\"type\": \"text\"},\n" +
//					"                    \"moktiCttTxt\": {\"type\": \"text\"}\n" +
//					"                }\n" +
//					"            }\n" +
//					"        }\n" +
//					"    }\n" +
//					"}\n";
			return CallHttpUrl(url, HttpMethod.PUT,jsonInString);
		}
	}
	/**
	 * 인덱스 삭제 쿼리
	 * @param tenantId : tenatID
	 * @param serviceName  : 호출 인덱스 (KMST or CMMT)
	 */
	public String DeleteIndex(String tenantId,String serviceName) throws Exception{
		String url = tenantId.toLowerCase()+"_"+serviceName.replaceAll("[0-9]", "").toLowerCase();
		boolean checkIndex = GetIndexInfo(tenantId,serviceName);

		if (checkIndex) {//인덱스 있음
			return CallHttpUrl(url, HttpMethod.DELETE,null);
		} else {//인덱스 없음
			return "Index not exist";
		}
	}

	//ELK SYSTEM QUERY
	/**엘라스틱 상태 조회 쿼리*/
	public String GetCatHelath() throws Exception{
		return CallHttpUrl("_cat/health?v", HttpMethod.GET, null);
	}
	/**엘라스틱 노드 상태 조회 쿼리*/
	public String GetCatNodes() throws Exception{
		return CallHttpUrl("_cat/nodes?v", HttpMethod.GET, null);
	}
	/**엘라스틱 인덱스 상태 조회 쿼리*/
	public String GetCatIndices() throws Exception{
		return CallHttpUrl("_cat/indices?v", HttpMethod.GET, null);
	}
}
