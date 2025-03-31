package org.crm.dash.web;

import org.crm.cmmt.VO.CMMT440VO;
import org.crm.cmmt.service.CMMT400Service;
import org.crm.dash.VO.DASH100VO;
import org.crm.dash.service.DASH100Service;
import org.crm.frme.VO.FRME290VO;
import org.crm.frme.service.FRME290Service;
import org.crm.lgin.VO.LGIN000VO;
import org.crm.util.com.ComnFun;
import org.crm.util.string.StringUtil;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.ModelAndView;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.ProtocolException;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

/***********************************************************************************************
 * Program Name : 대시보드 메인 Controller
 * Creator      : 강동우
 * Create Date  : 2022.05.17
 * Description  : 대시보드 메인
 * Modify Desc  :
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.05.17     강동우           최초생성
 ************************************************************************************************/
@Slf4j
@Controller
@RequestMapping("/dash/*")
public class DASH100Controller {

    @Resource(name = "DASH100Service")
    private DASH100Service dash100Service;

    @Resource(name = "FRME290Service")
    private FRME290Service frme290Service;

    @Resource(name = "CMMT400Service")
    private CMMT400Service CMMT400Service;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private RestTemplate restTemplate;
    
    @Autowired
	private MessageSource messageSource;

    @GetMapping("/DASH100M")
    public String DASH100M(ModelMap model, HttpSession session) {
        try {
            LGIN000VO user = (LGIN000VO) session.getAttribute("user");

            // 주업무 확인
            FRME290VO frme290VO = new FRME290VO();
            frme290VO.setTenantId(user.getTenantId());
            frme290VO.setUsrId(user.getUsrId());
            List<FRME290VO> list = frme290Service.FRME290SEL01(frme290VO);
            // usrAthtList 필터링
            List<FRME290VO> usrAthtList = list.stream()
                    .filter(item -> !ComnFun.isEmpty(item.getBizChoYn()))
                    .collect(Collectors.toList());
            // usrAthtList가 존재하는 경우 usrGrd 설정
            int usrGrd = 0;
            if (!usrAthtList.isEmpty()) {
                usrGrd = usrAthtList.stream()
                        .mapToInt(item -> Integer.parseInt(item.getUsrGrd()))
                        .max()
                        .getAsInt();
            }
            DASH100VO dash100VO = new DASH100VO();
            dash100VO.setTenantId(user.getTenantId());
            dash100VO.setUsrGrd(String.valueOf(usrGrd));
            List<DASH100VO> basePlt = dash100Service.DASH100SEL00(dash100VO);
            List<DASH100VO> baseItems = dash100Service.DASH100SEL02(dash100VO);
            List<DASH100VO> topPlt = basePlt.stream().filter(x->x.getPltDvCd().equals("T")).collect(Collectors.toList());
            List<DASH100VO> leftSidePlt = basePlt.stream().filter(x->x.getPltDvCd().equals("LS")).collect(Collectors.toList());
            List<DASH100VO> rightSidePlt = basePlt.stream().filter(x->x.getPltDvCd().equals("RS")).collect(Collectors.toList());
            List<DASH100VO> bodyPlt = basePlt.stream().filter(x->x.getPltDvCd().equals("B")).collect(Collectors.toList());

            model.addAttribute("DASH_BASE_PLT",basePlt);
            model.addAttribute("DASH_BASE_ITEMS",baseItems);
            model.addAttribute("DASH_BASE_TOP",topPlt);
            model.addAttribute("DASH_BASE_LEFT",leftSidePlt);
            model.addAttribute("DASH_BASE_RIGHT",rightSidePlt);
            model.addAttribute("DASH_BASE_BODY",bodyPlt);

            model.addAttribute("DASH_PLT_JSON", this.objectMapper.writeValueAsString(basePlt));
            model.addAttribute("DASH_ITEMS_JSON", this.objectMapper.writeValueAsString(baseItems));

        } catch (Exception e) {
            e.printStackTrace();
            log.error("[" + e.getClass() + "] Exception : " + e.getMessage());
        }
        return "th/dash/DASH100M_new";
    }

    @RequestMapping("/DASH120P")
    public ModelAndView DASH120P() {
        ModelAndView mav = new ModelAndView("dash/DASH120P");
        return mav;
    }
    
    /**
     * @param : HttpServletRequest Restful param
     * @return : ModelAndView HashMap
     * @Method Name : 
     * @작성일 : 2023.02.20
     * @작성자 : 김운
     * @변경이력 :
     * @Method 설명 : 채널별 통계 조회
     */
    @PostMapping(value = "/DASH100SEL13")
    @ResponseBody
    public Map<String, Object> DASH100SEL13(Locale locale, ModelAndView mav, @RequestBody String req) {
        HashMap<String, Object> resultMap = new HashMap<String, Object>();
        JSONParser parser = new JSONParser();
        try {

            JSONObject jsonObject = (JSONObject) parser.parse(req);
            List<DASH100VO> list = dash100Service.DASH100SEL13(this.objectMapper.convertValue(jsonObject, DASH100VO.class));

            resultMap.put("count", list.size());
            resultMap.put("list", this.objectMapper.writeValueAsString(list));
            resultMap.put("msg", messageSource.getMessage("success.common.select", null, "success.common.select", locale));

        } catch (Exception e) {
            log.error("[" + e.getClass() + "] Exception : " + e.getMessage());
        }
        return resultMap;
    }
    
    /**
     * @param : HttpServletRequest Restful param
     * @return : ModelAndView HashMap
     * @Method Name : 
     * @작성일 : 2023.04.05
     * @작성자 : 김운
     * @변경이력 :
     * @Method 설명 : 유형별 통계 조회
     */
    @PostMapping(value = "/DASH100SEL14")
    @ResponseBody
    public Map<String, Object> DASH100SEL14(@RequestBody String req, Locale locale) {
        HashMap<String, Object> resultMap = new HashMap<String, Object>();
        JSONParser parser = new JSONParser();
        try {
            JSONObject jsonObject = (JSONObject) parser.parse(req);
            List<DASH100VO> list = dash100Service.DASH100SEL14(this.objectMapper.convertValue(jsonObject, DASH100VO.class));

            resultMap.put("count", list.size());
            resultMap.put("list", this.objectMapper.writeValueAsString(list));
            resultMap.put("msg", messageSource.getMessage("success.common.select", null, "success.common.select", locale));

        } catch (Exception e) {
            log.error("[" + e.getClass() + "] Exception : " + e.getMessage());
        }
        return resultMap;
    }
    //kw-------------------------------------------------//

    /**
     * @param : HttpServletRequest Restful param
     * @return : ModelAndView HashMap
     * @Method Name : CARD TEST
     * @작성일 : 2023.01.18
     * @작성자 : 이민호
     * @변경이력 :
     * @Method 설명 : 대시보드 카드 view Set
     */
    @GetMapping(value = "/DASH_CARD_SEL")
    public String DASH_CARD_SEL(
              @RequestParam("pltDvCd")   String pltDvCd
            , @RequestParam("pltItemCd") String pltItemCd
            , @RequestParam("pltItemSeq")String pltItemSeq
            , @RequestParam("dataFrmId") String dataFrmId
            , @RequestParam("pltItemNo") String pltItemNo, HttpServletRequest request, ModelMap model
    ) {

        try {
            StringBuffer buffer = new StringBuffer();
            buffer.append(pltDvCd);
            buffer.append(pltItemCd);
            buffer.append(pltItemSeq);
            buffer.append(pltItemNo);

            String createID = buffer.toString();

            model.addAttribute("ID", (StringUtil.isEmpty(createID)) ? ComnFun.getRandomString() : createID);
            model.addAttribute("pltDvCd", pltDvCd);
        }catch (Exception e) {
            e.printStackTrace();
        }

        return "th/dash/" + dataFrmId;
    }

    /**
     * @param : HttpServletRequest Restful param
     * @return : ModelAndView HashMap
     * @Method Name : DASH100SEL01
     * @작성일 : 2023.02.03
     * @작성자 : 강동우
     * @변경이력 :
     * @Method 설명 : TOP팔레트 조회
     */
    @PostMapping(value = "/DASH100SEL01")
    @ResponseBody
    public Map<String, Object> DASH100SEL01(@RequestBody String req,Locale locale) {
        HashMap<String, Object> resultMap = new HashMap<String, Object>();
        JSONParser parser = new JSONParser();
        try {
            JSONObject jsonObject = (JSONObject) parser.parse(req);
            List<DASH100VO> list = dash100Service.DASH100SEL01(this.objectMapper.convertValue(jsonObject, DASH100VO.class));

            resultMap.put("count", list.size());
            resultMap.put("list", objectMapper.writeValueAsString(list));
            resultMap.put("msg", messageSource.getMessage("success.common.select", null, "success.common.select", locale));

        } catch (Exception e) {
            log.error("[" + e.getClass() + "] Exception : " + e.getMessage());
        }
        return resultMap;
    }


    /**
     * @param : HttpServletRequest Restful param
     * @return : ModelAndView HashMap
     * @Method Name : DASH100SEL02
     * @작성일 : 2022.05.18
     * @작성자 : 강동우
     * @변경이력 :
     * @Method 설명 : TOP팔레트 조회
     */
    @PostMapping(value = "/DASH100SEL02")
    @ResponseBody
    public Map<String, Object> DASH100SEL02(@RequestBody String req, HttpSession session,Locale locale) {
        HashMap<String, Object> resultMap = new HashMap<String, Object>();
        JSONParser parser = new JSONParser();
        try {
            JSONObject jsonObject = (JSONObject) parser.parse(req);
            List<DASH100VO> list = dash100Service.DASH100SEL02(this.objectMapper.convertValue(jsonObject, DASH100VO.class));
            resultMap.put("count", list.size());
            resultMap.put("list", objectMapper.writeValueAsString(list));
            resultMap.put("msg", messageSource.getMessage("success.common.select", null, "success.common.select", locale));

        } catch (Exception e) {
            log.error("[" + e.getClass() + "] Exception : " + e.getMessage());
        }
        return resultMap;
    }

    /**
     * @param : HttpServletRequest Restful param
     * @return : ModelAndView HashMap
     * @Method Name : DASH600SEL01
     * @작성일 : 2022.05.25
     * @작성자 : 강동우
     * @변경이력 :
     * @Method 설명 : 날씨 1시간 단위 조회
     */
    @PostMapping(value = "/DASH600SEL01")
    @ResponseBody
    public String resrApiGetWeather(@RequestBody String req) throws Exception {

        JSONParser parser = new JSONParser();
        JSONObject obj = (JSONObject) parser.parse(req);

        String strX = (String) obj.get("strX");
        String strY = (String) obj.get("strY");

        String latitude = strX.trim();
        String longitude = strY.trim();

        // 현재 날짜 구하기
        LocalDate date = LocalDate.now();
        // 포맷 정의
        DateTimeFormatter formatter01 = DateTimeFormatter.ofPattern("yyyyMMdd");
        // 포맷 적용
        String dateNow = date.format(formatter01);

//		// 현재 시간        
//		LocalTime time = LocalTime.now();      
//		// 포맷 정의하기        
//		DateTimeFormatter formatter02 = DateTimeFormatter.ofPattern("HHmm");         
//		// 포맷 적용하기       
//		String timeNow = time.format(formatter02);
//		// 정각으로 만
//		//String timeStrNow = timeNow+"00";
//		// 포맷 적용된 현재 시간 출력       
//		System.out.println(timeNow);


        Date date1 = new Date();

        SimpleDateFormat sdformat = new SimpleDateFormat("MM/dd/yyyy HH:mm:ss");
        Calendar cal = Calendar.getInstance();

        cal.setTime(date1);

        cal.add(Calendar.HOUR, -1);

        String time = sdformat.format(cal.getTime());


        String timeNow = time.substring(11, 13);

        String timeStrNow = timeNow + "30"; // 포맷 적용된 현재 시간 출력


        String url = "http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst"
                + "?serviceKey=9ZP2vPEY85WpLkBEYnTl44zSJ0xpgjXNPoIi8ABau47ouStzVQC9KtchLEDuvetbGtO2ARIucTHym87eLg2zLw%3D%3D"
                + "&dataType=JSON"
                + "&numOfRows=40"
                + "&pageNo=1"
                + "&base_date=" + dateNow
                + "&base_time=" + timeStrNow
                + "&nx=" + latitude
                + "&ny=" + longitude;
        HashMap<String, Object> resultMap = getDataFromJson(url, "UTF-8", "get", "");

        JSONObject jsonObj = new JSONObject();

        jsonObj.put("result", resultMap);

        return jsonObj.toString();
    }

    private HashMap<String, Object> getDataFromJson(String url, String encoding, String type, String jsonStr)
            throws Exception {
        // TODO Auto-generated method stub

        boolean isPost = false;

        if ("post".equals(type)) {
            isPost = true;
        } else {
            url = "".equals(jsonStr) ? url : url + "?request=" + jsonStr;
        }
        return getStringFrom(url, encoding, isPost, jsonStr, "application/json");
    }

    private HashMap<String, Object> getStringFrom(String url, String encoding, boolean isPost, String parameter,
                                                  String contentType) throws Exception {
        // TODO Auto-generated method stub

        URL apiURL = new URL(url);

        HttpURLConnection conn = null;
        BufferedReader br = null;
        BufferedWriter bw = null;

        HashMap<String, Object> resultMap = new HashMap<String, Object>();


        try {
            conn = (HttpURLConnection) apiURL.openConnection();
            conn.setConnectTimeout(5000);
            conn.setReadTimeout(5000);
            conn.setDoOutput(true);

            if (isPost) {
                conn.setRequestMethod("POST");
                conn.setRequestProperty("Content-Type", contentType);
                conn.setRequestProperty("Accept", "*/*");
            } else {
                conn.setRequestMethod("GET");
            }

            conn.connect();

            if (isPost) {
                bw = new BufferedWriter(new OutputStreamWriter(conn.getOutputStream(), StandardCharsets.UTF_8));
                bw.write(parameter);
                bw.flush();
                bw = null;
            }

            br = new BufferedReader(new InputStreamReader(conn.getInputStream(), encoding));

            String line = null;

            StringBuffer result = new StringBuffer();

            while ((line = br.readLine()) != null)
                result.append(line);

            ObjectMapper mapper = new ObjectMapper();

            resultMap = mapper.readValue(result.toString(), HashMap.class);
        } catch (JsonMappingException e) {
            // TODO Auto-generated catch block
            System.out.println("에러 : " + e.getMessage());
        } catch (JsonProcessingException e) {
            // TODO Auto-generated catch block
            System.out.println("에러 : " + e.getMessage());
        } catch (ProtocolException e) {
            // TODO Auto-generated catch block
            System.out.println("에러 : " + e.getMessage());
        } catch (UnsupportedEncodingException e) {
            // TODO Auto-generated catch block
            System.out.println("에러 : " + e.getMessage());
        } catch (IOException e) {
            // TODO Auto-generated catch block
            System.out.println("에러 : " + e.getMessage());
        } catch (Exception e) {
            // TODO Auto-generated catch block
            System.out.println("Exception 날씨 1시간 단위 : " + e.getMessage());
        } finally {
            if (conn != null)
                conn.disconnect();
            if (br != null)
                br.close();
            if (bw != null)
                bw.close();
        }

        return resultMap;
    }

    /**
     * @param : HttpServletRequest Restful param
     * @return : ModelAndView HashMap
     * @Method Name : DASH700SEL01
     * @작성일 : 2022.05.25
     * @작성자 : 강동우
     * @변경이력 :
     * @Method 설명 : 날씨 최고, 최저 기온 조회
     */
    @PostMapping(value = "/DASH700SEL01")
    @ResponseBody
    public String resrApiGetWeather0(@RequestBody String req) throws Exception {

        JSONParser parser = new JSONParser();
        JSONObject obj = (JSONObject) parser.parse(req);
        String strX = (String) obj.get("strX");
        String strY = (String) obj.get("strY");

        // 현재 날짜 구하기
		LocalDateTime now = ComnFun.getNowDateTime();
		String dateNow = now.format(DateTimeFormatter.ofPattern("yyyyMMdd"));
		String time = now.format(DateTimeFormatter.ofPattern("HHmm"));
        // 포맷 정의
//        DateTimeFormatter formatter01 = DateTimeFormatter.ofPattern("yyyyMMdd");
        // 포맷 적용
//        String dateNow = now.format(formatter01);
        // 결과 출력

        SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd");
        Calendar c1 = Calendar.getInstance();
        c1.add(Calendar.DATE, -1); // 오늘날짜로부터 -1
        String yesterday = sdf.format(c1.getTime()); // String으로 저장

        String url = "http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst"
                + "?serviceKey=9ZP2vPEY85WpLkBEYnTl44zSJ0xpgjXNPoIi8ABau47ouStzVQC9KtchLEDuvetbGtO2ARIucTHym87eLg2zLw%3D%3D"
                + "&dataType=JSON"
                + "&numOfRows=1000"
                + "&pageNo=1"
                + "&base_date=" + dateNow
                + "&base_time=0210"
                + "&nx=" + strX.trim()
                + "&ny=" + strY.trim();
        HashMap<String, Object> resultMap = getDataFromJson0(url, "UTF-8", "get", "");

        JSONObject jsonObj = new JSONObject();

        jsonObj.put("result", resultMap);

        return jsonObj.toString();
    }

    private HashMap<String, Object> getDataFromJson0(String url, String encoding, String type, String jsonStr)
            throws Exception {
        // TODO Auto-generated method stub

        boolean isPost = false;

        if ("post".equals(type)) {
            isPost = true;
        } else {
            url = "".equals(jsonStr) ? url : url + "?request=" + jsonStr;
        }
        return getStringFrom0(url, encoding, isPost, jsonStr, "application/json");
    }

    private HashMap<String, Object> getStringFrom0(String url, String encoding, boolean isPost, String parameter,
                                                   String contentType) throws Exception {
        // TODO Auto-generated method stub

        URL apiURL = new URL(url);

        HttpURLConnection conn = null;
        BufferedReader br = null;
        BufferedWriter bw = null;

        HashMap<String, Object> resultMap = new HashMap<String, Object>();

        try {
            conn = (HttpURLConnection) apiURL.openConnection();
            conn.setConnectTimeout(5000);
            conn.setReadTimeout(5000);
            conn.setDoOutput(true);

            if (isPost) {
                conn.setRequestMethod("POST");
                conn.setRequestProperty("Content-Type", contentType);
                conn.setRequestProperty("Accept", "*/*");
            } else {
                conn.setRequestMethod("GET");
            }

            conn.connect();

            if (isPost) {
                bw = new BufferedWriter(new OutputStreamWriter(conn.getOutputStream(), StandardCharsets.UTF_8));
                bw.write(parameter);
                bw.flush();
                bw = null;
            }

            br = new BufferedReader(new InputStreamReader(conn.getInputStream(), encoding));

            String line = null;

            StringBuffer result = new StringBuffer();

            while ((line = br.readLine()) != null)
                result.append(line);

            ObjectMapper mapper = new ObjectMapper();

            resultMap = mapper.readValue(result.toString(), HashMap.class);

        } catch (JsonMappingException e) {
            // TODO Auto-generated catch block
            System.out.println("에러 : " + e.getMessage());
        } catch (JsonProcessingException e) {
            // TODO Auto-generated catch block
            System.out.println("에러 : " + e.getMessage());
        } catch (ProtocolException e) {
            // TODO Auto-generated catch block
            System.out.println("에러 : " + e.getMessage());
        } catch (UnsupportedEncodingException e) {
            // TODO Auto-generated catch block
            System.out.println("에러 : " + e.getMessage());
        } catch (IOException e) {
            // TODO Auto-generated catch block
            System.out.println("에러 : " + e.getMessage());
        } catch (Exception e) {
            // TODO Auto-generated catch block
            System.out.println("Exception최고 최저  : " + e.getMessage());
        } finally {
            if (conn != null)
                conn.disconnect();
            if (br != null)
                br.close();
            if (bw != null)
                bw.close();
        }

        return resultMap;
    }

    /**
     * @param : HttpServletRequest Restful param
     * @return : ModelAndView HashMap
     * @Method Name : dashGetWeather
     * @작성일 : 2022.05.25
     * @작성자 : 강동우
     * @변경이력 :
     * @Method 설명 : 날씨 최고, 최저 기온 조회
     */
    @PostMapping(value = "/dashGetWeather" ,produces = "application/json; charset=utf8")
    public @ResponseBody String dashGetWeather(@RequestBody String req) throws Exception {
        JSONParser parser = new JSONParser();
        JSONObject obj = (JSONObject) parser.parse(req);

        LocalDateTime now = LocalDateTime.now();

        String strX = (String) obj.get("strX");
        String strY = (String) obj.get("strY");
        String tmp = (String) obj.get("getTmp");

        // 최고, 최저 기온 조회 추가 (dateNow = 0500)
        String apiUltraUrl = "http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst";
        String apiVilageUrl = "http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst";
        String apiUrl;
        String baseTime;
        String rows;

        // 초단기예보조회
        apiUrl = apiUltraUrl;
        int baseHour = now.getHour();

        if(baseHour < 7) {
            now = now.minusDays(1);
        }

        if(now.getMinute() <= 30) {
            baseHour -= 1;
        }

        String strBaseHour = Integer.toString(baseHour);
        if(baseHour < 10) {
            strBaseHour = "0" + strBaseHour;
        }

        baseTime = strBaseHour + now.getMinute();

        rows = "100";

        String serviceKey = "9ZP2vPEY85WpLkBEYnTl44zSJ0xpgjXNPoIi8ABau47ouStzVQC9KtchLEDuvetbGtO2ARIucTHym87eLg2zLw%3D%3D";
        String dataType = "JSON";	                                                //데이터 타입
        String numOfRows = rows;	                                                //한 페이지 결과 수
        String pageNo = "1";	                                                    //페이지 번호
        String base_date = now.format(DateTimeFormatter.ofPattern("yyyyMMdd"));	    //조회날짜
        String base_time = baseTime;                                                //조회시간
        String nx = strX.trim();	                                                //경도
        String ny = strY.trim();	                                                //위도

        String urlBuilder = apiUrl + "?" + URLEncoder.encode("serviceKey", "UTF-8") + "=" + serviceKey +
                "&" + URLEncoder.encode("dataType", "UTF-8") + "=" + URLEncoder.encode(dataType, "UTF-8") +
                "&" + URLEncoder.encode("numOfRows", "UTF-8") + "=" + URLEncoder.encode(numOfRows, "UTF-8") +
                "&" + URLEncoder.encode("pageNo", "UTF-8") + "=" + URLEncoder.encode(pageNo, "UTF-8") +
                "&" + URLEncoder.encode("base_date", "UTF-8") + "=" + URLEncoder.encode(base_date, "UTF-8") +
                "&" + URLEncoder.encode("base_time", "UTF-8") + "=" + URLEncoder.encode(base_time, "UTF-8") +
                "&" + URLEncoder.encode("nx", "UTF-8") + "=" + URLEncoder.encode(nx, "UTF-8") +
                "&" + URLEncoder.encode("ny", "UTF-8") + "=" + URLEncoder.encode(ny, "UTF-8");

        /*
         * GET방식으로 전송해서 파라미터 받아오기
         */

        URL url = new URL(urlBuilder);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("GET");
        conn.setRequestProperty("Content-type", "application/json");
        StringBuilder sb = new StringBuilder();

//        log.debug(" ###### " + urlBuilder);

        try (BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream(), StandardCharsets.UTF_8))) {
            String line; // head 떼기
            while ((line = br.readLine()) != null) {
                sb.append(line);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

        return sb.toString();
    }

    /**
     * @param : HttpServletRequest Restful param
     * @return : ModelAndView HashMap
     * @Method Name : DASH100SEL03
     * @작성일 : 2022.05.27
     * @작성자 : 강동우
     * @변경이력 :
     * @Method 설명 : 사내게시판 조회
     */
    @PostMapping(value = "/DASH100SEL03")
    @ResponseBody
    public Map<String, Object> DASH100SEL03(@RequestBody String req, HttpSession session,Locale locale) {
        HashMap<String, Object> resultMap = new HashMap<String, Object>();
        JSONParser parser = new JSONParser();
        try {
            JSONObject jsonObject = (JSONObject) parser.parse(req);
            List<DASH100VO> list = dash100Service.DASH100SEL03(this.objectMapper.convertValue(jsonObject, DASH100VO.class));

            resultMap.put("count", list.size());
            resultMap.put("list", this.objectMapper.writeValueAsString(list));
            resultMap.put("msg", messageSource.getMessage("success.common.select", null, "success.common.select", locale));

        } catch (Exception e) {
            log.error("[" + e.getClass() + "] Exception : " + e.getMessage());
        }
        return resultMap;
    }

    /**
     * @param : HttpServletRequest Restful param
     * @return : ModelAndView HashMap
     * @Method Name : DASH100SEL05
     * @작성일 : 2022.05.30
     * @작성자 : 강동우
     * @변경이력 :
     * @Method 설명 : IVR 콜백 조회
     */
    @PostMapping(value = "/DASH100SEL05")
    @ResponseBody
    public Map<String, Object> DASH100SEL05(@RequestBody String req, HttpSession session, Locale locale) {
        HashMap<String, Object> resultMap = new HashMap<String, Object>();
        JSONParser parser = new JSONParser();
        try {
            LGIN000VO user = (LGIN000VO) session.getAttribute("user");
            JSONObject jsonObject
                    = (JSONObject) parser.parse(req);
            List<DASH100VO> list = dash100Service.DASH100SEL05(this.objectMapper.convertValue(jsonObject, DASH100VO.class), user.getPersonInfoMask());

            resultMap.put("count", list.size());
            resultMap.put("list", this.objectMapper.writeValueAsString(list));
            resultMap.put("msg", messageSource.getMessage("success.common.select", null, "success.common.select", locale));

        } catch (Exception e) {
            log.error("[" + e.getClass() + "] Exception : " + e.getMessage());
        }
        return resultMap;
    }

    /**
     * @param : HttpServletRequest Restful param
     * @return : ModelAndView HashMap
     * @Method Name : DASH100SEL06
     * @작성일 : 2022.05.30
     * @작성자 : 강동우
     * @변경이력 :
     * @Method 설명 : 통화예약 조회
     */
    @PostMapping(value = "/DASH100SEL06")
    @ResponseBody
    public Map<String, Object> DASH100SEL06(@RequestBody String req, HttpSession session, Locale locale) {
        HashMap<String, Object> resultMap = new HashMap<String, Object>();
        JSONParser parser = new JSONParser();
        try {
            JSONObject jsonObject
                    = (JSONObject) parser.parse(req);
            List<DASH100VO> list = dash100Service.DASH100SEL06(this.objectMapper.convertValue(jsonObject, DASH100VO.class));

            resultMap.put("count", list.size());
            resultMap.put("list", this.objectMapper.writeValueAsString(list));
            resultMap.put("msg", messageSource.getMessage("success.common.select", null, "success.common.select", locale));

        } catch (Exception e) {
            log.error("[" + e.getClass() + "] Exception : " + e.getMessage());
        }
        return resultMap;
    }

    /**
     * @param : HttpServletRequest Restful param
     * @return : ModelAndView HashMap
     * @Method Name : DASH100SEL07
     * @작성일 : 2022.05.30
     * @작성자 : 강동우
     * @변경이력 :
     * @Method 설명 : 웹 콜백 조회
     */
    @PostMapping(value = "/DASH100SEL07")
    @ResponseBody
    public Map<String, Object> DASH100SEL07(@RequestBody String req, HttpSession session, Locale locale) {
        HashMap<String, Object> resultMap = new HashMap<String, Object>();
        JSONParser parser = new JSONParser();
        try {
            LGIN000VO user = (LGIN000VO) session.getAttribute("user");
            JSONObject jsonObject
                    = (JSONObject) parser.parse(req);
            List<DASH100VO> list = dash100Service.DASH100SEL07(this.objectMapper.convertValue(jsonObject, DASH100VO.class), user.getPersonInfoMask());

            resultMap.put("count", list.size());
            resultMap.put("list", this.objectMapper.writeValueAsString(list));
            resultMap.put("msg", messageSource.getMessage("success.common.select", null, "success.common.select", locale));

        } catch (Exception e) {
            log.error("[" + e.getClass() + "] Exception : " + e.getMessage());
        }
        return resultMap;
    }

    /**
     * @param : HttpServletRequest Restful param
     * @return : ModelAndView HashMap
     * @Method Name : DASH100SEL08
     * @작성일 : 2022.05.30
     * @작성자 : 강동우
     * @변경이력 :
     * @Method 설명 : 업무이관 조회
     */
    @PostMapping(value = "/DASH100SEL08")
    @ResponseBody
    public Map<String, Object> DASH100SEL08(@RequestBody String req, HttpSession session, Locale locale) {
        HashMap<String, Object> resultMap = new HashMap<String, Object>();
        JSONParser parser = new JSONParser();
        try {
            JSONObject jsonObject
                    = (JSONObject) parser.parse(req);
            List<DASH100VO> list = dash100Service.DASH100SEL08(this.objectMapper.convertValue(jsonObject, DASH100VO.class));

            resultMap.put("count", list.size());
            resultMap.put("list", objectMapper.writeValueAsString(list));
            resultMap.put("msg", messageSource.getMessage("success.common.select", null, "success.common.select", locale));
        } catch (Exception e) {
            log.error("[" + e.getClass() + "] Exception : " + e.getMessage());
        }
        return resultMap;
    }

    /**
     * @param : HttpServletRequest Restful param
     * @return : ModelAndView HashMap
     * @Method Name : DASH100SEL09
     * @작성일 : 2022.06.03
     * @작성자 : 강동우
     * @변경이력 :
     * @Method 설명 : 월 카렌더 조회
     */
    @PostMapping(value = "/DASH100SEL09")
    @ResponseBody
    public Map<String, Object> DASH100SEL09(Locale locale, @RequestBody String req, HttpSession session) {
    	HashMap<String, Object> resultMap = new HashMap<String, Object>();

		try {
			CMMT440VO CMMT440VO = this.objectMapper.readValue(req, CMMT440VO.class);

			List<DASH100VO> list0 = CMMT400Service.CMMT400SEL01(CMMT440VO);

			resultMap.put("count", list0.size());
			resultMap.put("list", this.objectMapper.writeValueAsString(list0));
			resultMap.put("totalList", this.objectMapper.writeValueAsString(CMMT400Service.CMMT400SEL01(CMMT440VO)));
			resultMap.put("msg", messageSource.getMessage("success.common.select", null, "success.common.select", locale));

		} catch (Exception e) {
			log.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}
		return resultMap;
    }

    /**
     * @param : HttpServletRequest Restful param
     * @return : ModelAndView HashMap
     * @Method Name : DASH100SEL11
     * @작성일 : 2022.07.20
     * @작성자 : 강동우
     * @변경이력 :
     * @Method 설명 : 팔렛트 조회
     */
    @PostMapping(value = "/DASH100SEL11")
    @ResponseBody
    public Map<String, Object> DASH100SEL11(@RequestBody String req, HttpSession session, Locale locale) {
        HashMap<String, Object> resultMap = new HashMap<String, Object>();
        JSONParser parser = new JSONParser();
        try {
            JSONObject jsonObject
                    = (JSONObject) parser.parse(req);
            List<DASH100VO> list = dash100Service.DASH100SEL11(this.objectMapper.convertValue(jsonObject, DASH100VO.class));

            resultMap.put("count", list.size());
            resultMap.put("list", objectMapper.writeValueAsString(list));
            resultMap.put("msg", messageSource.getMessage("success.common.select", null, "success.common.select", locale));

        } catch (Exception e) {
            log.error("[" + e.getClass() + "] Exception : " + e.getMessage());
        }
        return resultMap;
    }

    /**
     * @param : HttpServletRequest Restful param
     * @return : ModelAndView HashMap
     * @Method Name : DASH100SEL12
     * @작성일 : 2022.07.20
     * @작성자 : 강동우
     * @변경이력 :
     * @Method 설명 : 팔렛트 상세 조회
     */
    @PostMapping(value = "/DASH100SEL12")
    @ResponseBody
    public Map<String, Object> DASH100SEL12(@RequestBody String req, HttpSession session, Locale locale) {
        HashMap<String, Object> resultMap = new HashMap<String, Object>();
        JSONParser parser = new JSONParser();
        try {
            JSONObject jsonObject
                    = (JSONObject) parser.parse(req);
            List<DASH100VO> list = dash100Service.DASH100SEL12(this.objectMapper.convertValue(jsonObject, DASH100VO.class));

            resultMap.put("count", list.size());
            resultMap.put("list", objectMapper.writeValueAsString(list));
            resultMap.put("msg", messageSource.getMessage("success.common.select", null, "success.common.select", locale));
        } catch (Exception e) {
            log.error("[" + e.getClass() + "] Exception : " + e.getMessage());
        }
        return resultMap;
    }

    /**
     * @param : HttpServletRequest Restful param
     * @return : ModelAndView HashMap
     * @Method Name : DASH100SEL19
     * @작성일 : 2023.11.17
     * @작성자 : wkim
     * @변경이력 :
     * @Method 설명 : 데시보드-뉴스레터
     */
    @PostMapping(value = "/DASH100SEL19")
    @ResponseBody
    public Map<String, Object> DASH100SEL19(@RequestBody String req, HttpSession session, Locale locale) {
        HashMap<String, Object> resultMap = new HashMap<String, Object>();
        JSONParser parser = new JSONParser();
        try {
            JSONObject jsonObject
                    = (JSONObject) parser.parse(req);
            List<DASH100VO> list = dash100Service.DASH100SEL19(this.objectMapper.convertValue(jsonObject, DASH100VO.class));

            resultMap.put("count", list.size());
            resultMap.put("list", objectMapper.writeValueAsString(list));
            resultMap.put("msg", messageSource.getMessage("success.common.select", null, "success.common.select", locale));
        } catch (Exception e) {
            log.error("[" + e.getClass() + "] Exception : " + e.getMessage());
        }
        return resultMap;
    }
    
    
    /**
	 * @Method Name : "DASH100INS19"
	 * @작성일      	: 2023.11.17
	 * @작성자      	: wkim
	 * @변경이력   	:
	 * @Method 설명 	: 뉴스레터 확인 여부 추가
	 * @param       : ModelAndView
	 * @return      : ModelAndView HashMap
	 */
	@PostMapping(value = "/DASH100INS19")
	@ResponseBody
	public Map<String, Object> DASH100INS19(@RequestBody String request, Locale locale) {
        HashMap<String, Object> resultMap = new HashMap<>();
        JSONParser parser = new JSONParser();

		try {
            JSONObject jsonObject
                    = (JSONObject) parser.parse(request);
            DASH100VO vo = this.objectMapper.convertValue(jsonObject, DASH100VO.class);
			
			int result = dash100Service.DASH100INS19(vo);
			
			if(result > 0) {
				resultMap.put("result", new ObjectMapper().writeValueAsString(result));
				resultMap.put("msg", messageSource.getMessage("success.common.select", null, "success.common.select", locale));				
			} else {
				resultMap.put("result", new ObjectMapper().writeValueAsString(result));
				resultMap.put("msg", messageSource.getMessage("fail.request.msg", null, "fail.request.msg", locale));
			}

		} catch (Exception e) {
			log.error("[" + e.getClass() + "] Exception : " + e.getMessage());
		}

		return resultMap;
	}
}


