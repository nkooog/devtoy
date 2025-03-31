package org.crm.cmmt.web;

import org.crm.cmmt.VO.CMMT500VO;
import org.crm.cmmt.service.CMMT500Service;
import org.crm.util.com.ComnFun;
import org.crm.util.file.FileUtils;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpSession;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.support.SessionStatus;
import org.springframework.web.servlet.ModelAndView;

import java.io.File;
import java.nio.file.Files;
import java.util.*;


/***********************************************************************************************
 * Program Name : 쪽지관리 Controller
 * Creator      : 이민호
 * Create Date  : 2022.04.27
 * Description  : 쪽지관리 메인
 * Modify Desc  :
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.04.27      이민호           최초생성
 * 2024.12.05      박준영           egov -> boot mig
 ************************************************************************************************/
@Controller
@RequestMapping("/cmmt/*")
public class CMMT500Controller {

    @Resource(name = "CMMT500Service")
    private CMMT500Service CMMT500Service;

    @Autowired
    private MessageSource messageSource;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private NoteFileUtils fileUtils;

    private static final Logger LOGGER = LoggerFactory.getLogger(CMMT500Controller.class);


    /**
     * @param :
     * @return : sysm/SYSM500M.jsp
     * @Method Name : CMMT500M
     * @작성일 : 2022.04.27
     * @작성자 : 이민호
     * @변경이력 :
     * @Method 설명 : cmmt/CMMT500M 웹 페이지 열기
     */
    @RequestMapping("/CMMT500M")
    public String CMMT500M() {
        return "th/cmmt/CMMT500M";
    }

    /**
     * @param : HttpServletRequest Restful param
     * @return : ModelAndView HashMap
     * @Method Name : CMMT500MSEL01
     * @작성일 : 2022.04.27
     * @작성자 : 이민호
     * @변경이력 :
     * @Method 설명 : 쪽지관리 통합 목록 조회
     */
    @PostMapping(value = "/CMMT500SEL01")
    @ResponseBody
    public Map<String, Object> CMMT500SEL01(ModelAndView mav, @RequestBody String req) {

        HashMap<String, Object> hashMap = new HashMap<String, Object>();
        HashMap<String, Object> paramMap = new HashMap<String, Object>();
        JSONParser parser = new JSONParser();
        try {

            JSONObject jsonObject = (JSONObject) parser.parse(req);
            CMMT500VO vo = this.objectMapper.convertValue(jsonObject, CMMT500VO.class);
            paramMap.put("vo", vo);

            List<CMMT500VO> CMMT500List = CMMT500Service.CMMT500SEL03(paramMap);

            // 유저 검색조건
            if (!ComnFun.isEmpty(vo.getRecvrId()))
                noteTypeClass(CMMT500List, 1, vo.getRecvrId());
            if (!ComnFun.isEmpty(vo.getDpchmnId()))
                noteTypeClass(CMMT500List, 2, vo.getDpchmnId());

            // 쪽지타입 조건
            if (vo.getSrchNoteType().size() > 0) {
                String user = vo.getUsrId();
                int noteTypeSum = vo.getSrchNoteType().stream().mapToInt(Integer::intValue).sum();
                noteTypeClass(CMMT500List, noteTypeSum, user);
            }
            hashMap.put("CMMT500M", this.objectMapper.writeValueAsString(CMMT500List));
        } catch (Exception e) {
            LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
        }
        return hashMap;
    }


    @PostMapping(value = "/CMMT500SEL02")
    @ResponseBody
    public Map<String, Object> CMMT500SEL02(ModelAndView mav, @RequestBody String req) {
        HashMap<String, Object> hashMap = new HashMap<String, Object>();
        JSONParser parser = new JSONParser();
        try {
            JSONObject jsonObject = (JSONObject) parser.parse(req);
            CMMT500VO vo = CMMT500Service.CMMT500SEL02(this.objectMapper.convertValue(jsonObject, CMMT500VO.class));

            hashMap.put("CMMT500M", this.objectMapper.writeValueAsString(vo));
            hashMap.put("msg", "정상적으로 조회하였습니다.");
        } catch (Exception e) {
            LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
        }
        return hashMap;
    }

    /**
     * @param : HttpServletRequest Restful param
     * @return : ModelAndView HashMap
     * @Method Name : CMMT500MSEL03
     * @작성일 : 2022.07.22
     * @작성자 : 이민호
     * @변경이력 :
     * @Method 설명 : 쪽지조회 테스트
     */
    @PostMapping(value = "/CMMT500SEL03")
    @ResponseBody
    public Map<String, Object> CMMT500SEL03(ModelAndView mav, @RequestBody String req) {

        HashMap<String, Object> hashMap = new HashMap<String, Object>();
        HashMap<String, Object> param = new HashMap<String, Object>();
        JSONParser parser = new JSONParser();
        try {

            JSONObject jsonObject = (JSONObject) parser.parse(req);
            param.put("vo", this.objectMapper.convertValue(jsonObject, CMMT500VO.class));
            List<CMMT500VO> CMMT500List = CMMT500Service.CMMT500SEL03(param);

            hashMap.put("CMMT500M", this.objectMapper.writeValueAsString(CMMT500List));
        } catch (Exception e) {
            LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
        }
        return hashMap;
    }

    /**
     * @param : ModelAndView, HttpServletRequest Restful param
     * @return : ModelAndView HashMap
     * @Method Name : CMMT500UPT02
     * @작성일 : 2022.07.18
     * @작성자 : 이민호
     * @변경이력 :
     * @Method 설명 : 쪽지 열람
     */

    @PostMapping(value = "/CMMT500UPT02")
    @ResponseBody
    public Map<String, Object> CMMT500UPT02(ModelAndView mav, @RequestBody String req, SessionStatus status, Locale locale) {

        HashMap<String, Object> hashMap = new HashMap<String, Object>();
        JSONParser parser = new JSONParser();

        try {
            JSONObject jsonObject = (JSONObject) parser.parse(req);

            int result = CMMT500Service.CMMT500UPT02(this.objectMapper.convertValue(jsonObject, CMMT500VO.class));

            String message = "";

            if (result > 0) {
                status.setComplete();
                messageSource.getMessage("success.common.update", null, "success update", locale);
            } else {
                message = "Error";
            }
            hashMap.put("msg", message);

        } catch (Exception e) {
            LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
        }
        return hashMap;

    }

    /**
     * @param : ModelAndView, HttpServletRequest Restful param
     * @return : ModelAndView HashMap
     * @Method Name : CMMT500UPT03
     * @작성일 : 2022.04.29
     * @작성자 : 이민호
     * @변경이력 :
     * @Method 설명 : 쪽지 보관
     */

    @PostMapping(value = "/CMMT500UPT03")
    @ResponseBody
    public Map<String, Object> CMMT500UPT03(ModelAndView mav, @RequestBody String req, SessionStatus status, Locale locale) {

        HashMap<String, Object> hashMap = new HashMap<String, Object>();
        JSONParser parser = new JSONParser();

        try {
            JSONObject jsonObject = (JSONObject) parser.parse(req);
            CMMT500VO vo = this.objectMapper.convertValue(jsonObject, CMMT500VO.class);
            int result = CMMT500Service.CMMT500UPT03(vo);

            String message = "";
            String noteDv = vo.getNoteType();
            String noteStCd;
            if (noteDv.equals("D")) noteStCd = String.valueOf(vo.getDpchNoteStCd());
            else noteStCd = String.valueOf(vo.getRecvNoteStCd());

            if (result > 0) {
                status.setComplete();
                message = noteStCd.equals("9") ?
                        messageSource.getMessage("success.common.delete", null, "success delete", locale) :
                        messageSource.getMessage("success.common.update", null, "success update", locale);
            } else {
                message = "Error";
            }

            hashMap.put("msg", message);

        } catch (Exception e) {
            LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
        }
        return hashMap;

    }

    /**
     * @param : ModelAndView, HttpServletRequest Restful param
     * @return : ModelAndView HashMap
     * @Method Name : CMMT500DEL01
     * @작성일 : 2022.07.22
     * @작성자 : 이민호
     * @변경이력 :
     * @Method 설명 : 쪽지 삭제 (임시저장 전용)
     */

    @PostMapping(value = "/CMMT500DEL01")
    @ResponseBody
    public Map<String, Object> CMMT500DEL01(ModelAndView mav, @RequestBody String req, SessionStatus status) {

        HashMap<String, Object> hashMap = new HashMap<String, Object>();
        JSONParser parser = new JSONParser();

        try {

            JSONObject jsonObject = (JSONObject) parser.parse(req);
            int result = CMMT500Service.CMMT500DEL01(this.objectMapper.convertValue(jsonObject, CMMT500VO.class));

            String message = "";
            if (result > 0) {
                status.setComplete();
                message = "쪽지를 삭제 하었습니다.";
            } else {
                message = "Error";
            }

            hashMap.put("msg", message);

        } catch (Exception e) {
            LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
        }
        return hashMap;

    }

    /**
     * @Method Name : CMMT500SEL11
     * @작성일 : 2022.10.14
     * @작성자 : 이민호
     * @변경이력 :
     * @Method 설명 : (대시보드)받은쪽지함 조회
     * @param : HttpServletRequest Restful param
     * @return : ModelAndView HashMap
     */
    @PostMapping(value = "/CMMT500SEL11")
    @ResponseBody
    public Map<String, Object> CMMT500SEL11(ModelAndView mav, @RequestBody String req) {

        HashMap<String, Object> resultMap = new HashMap<String, Object>();
        JSONParser parser = new JSONParser();
        try {

            JSONObject jsonObject = (JSONObject) parser.parse(req);

            List<CMMT500VO> list = CMMT500Service.CMMT500SEL11(this.objectMapper.convertValue(jsonObject, CMMT500VO.class));
            resultMap.put("count", list.size());
            resultMap.put("list", objectMapper.writeValueAsString(list));
        } catch (Exception e) {
            LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
        }
        return resultMap;
    }

    /**
     * @Method Name : CMMT500SEL12
     * @작성일 : 2022.10.14
     * @작성자 : 이민호
     * @변경이력 :
     * @Method 설명 : (대시보드)보낸쪽지함 조회
     * @param : HttpServletRequest Restful param
     * @return : ModelAndView HashMap
     */
    @PostMapping(value = "/CMMT500SEL12")
    @ResponseBody
    public Map<String, Object> CMMT500SEL12(ModelAndView mav, @RequestBody String req) {

        HashMap<String, Object> resultMap = new HashMap<String, Object>();
        JSONParser parser = new JSONParser();

        try {
            JSONObject jsonObject = (JSONObject) parser.parse(req);
            List<CMMT500VO> list = CMMT500Service.CMMT500SEL12(this.objectMapper.convertValue(jsonObject, CMMT500VO.class));

            resultMap.put("count", list.size());
            resultMap.put("list", objectMapper.writeValueAsString(list));
        } catch (Exception e) {
            LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
        }
        return resultMap;
    }

    /**
     * @Method Name : CMMT500SEL13
     * @작성일 : 2022.10.14
     * @작성자 : 강동우
     * @변경이력 :
     * @Method 설명 : (대시보드)보관함 쪽지조회
     * @param : HttpServletRequest Restful param
     * @return : ModelAndView HashMap
     */
    @PostMapping(value = "/CMMT500SEL13")
    @ResponseBody
    public Map<String, Object> CMMT500SEL13(ModelAndView mav, @RequestBody String req, HttpSession session) {
        HashMap<String, Object> resultMap = new HashMap<String, Object>();
        JSONParser parser = new JSONParser();
        try {
            JSONObject jsonObject = (JSONObject) parser.parse(req);
            List<CMMT500VO> list = CMMT500Service.CMMT500SEL13(this.objectMapper.convertValue(jsonObject, CMMT500VO.class));
            resultMap.put("count", list.size());
            resultMap.put("list", this.objectMapper.writeValueAsString(list));
        } catch (Exception e) {
            LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
        }
        return resultMap;
    }
    
    /**
     * @Method Name : CMMT500SEL14
     * @작성일      : 2025.03.18
     * @작성자      : wkim
     * @변경이력    :
     * @Method 설명 : FRME100M.js 에서 실시간 쪽지 확인
     * @param       : 
     * @return      : ResponseEntity<String>
     */
    @PostMapping(value ="/CMMT500SEL14")
  	@ResponseBody
  	public ResponseEntity<String> CMMT500SEL14(@RequestBody String request, Locale locale) {
  		LOGGER.info("=== 통화이력 탭 조회 ===");
  		HashMap<String, Object> resultMap = new HashMap<String, Object>();
   		String resultStr = null;
   		
   		try {
  			JSONParser parser1 = new JSONParser();
  			JSONObject obj = (JSONObject) parser1.parse(request);
  			CMMT500VO param = new CMMT500VO();
  			
  			param.setTenantId(String.valueOf(obj.get("tenantId")));
  			param.setRecvrId(String.valueOf(obj.get("recvrId")));
  			param.setRecvNoteStCd(String.valueOf(obj.get("recvNoteStCd")));
  			param.setStartDate(String.valueOf(obj.get("startDate")));
  			param.setEndDate(String.valueOf(obj.get("endDate")));

  			List<CMMT500VO> CMMT500SEL14List = CMMT500Service.CMMT500SEL14(param);
  			
  			resultMap.put("CMMT500SEL14", this.objectMapper.writeValueAsString(CMMT500SEL14List));
			resultMap.put("msg", "정상적으로 조회하였습니다.");

			resultStr = this.objectMapper.writeValueAsString(resultMap);
  			
   		} catch (Exception e) {
  			LOGGER.error("["+e.getClass()+"] Exception : " + e.getMessage());
  		}
  		return ResponseEntity.ok().body(resultStr);
      }

    /**
     * @param : HttpServletRequest Restful param
     * @return : ModelAndView HashMap
     * @Method Name : CMMT500SEL10
     * @작성일 : 2022.07.05
     * @작성자 : mhlee
     * @변경이력 :
     * @Method 설명  : 쪽지 파일 다운로드
     */
    @RequestMapping(value = "/CMMT500SEL10")
    @ResponseBody
    public ResponseEntity<byte[]> download(@RequestParam HashMap<Object, Object> params) {
		try {
			File file = FileUtils.downloadFileInfo(params);
			byte[] fileContent = Files.readAllBytes(file.toPath());

			HttpHeaders headers = new HttpHeaders();
			headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
			headers.setContentDispositionFormData("attachment", file.getName());

			return new ResponseEntity<>(fileContent, headers, HttpStatus.OK);
		} catch (Exception e) {
            LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}


    /**
     * @param : List, noteType, usrId
     * @return :
     * @Method Name : noteTypeClass
     * @작성일 : 2022.07.07
     * @작성자 : mhlee
     * @변경이력 :
     * @Method 설명  : 쪽지 타입에 따른 분류 메서드
     */
    private void noteTypeClass(List<CMMT500VO> CMMT500List, int noteTypeSum, String user) {
        switch (noteTypeSum) {
            case 1:
                CMMT500List.removeIf(temp -> !temp.getRecvrIdList().contains(user));
                break;
            case 2:
                CMMT500List.removeIf(temp -> !temp.getDpchmnId().contains(user));
                break;
            case 6:
                Iterator<CMMT500VO> it = CMMT500List.iterator();
                while (it.hasNext()) {
                    CMMT500VO obj = it.next();
                    if (obj.getNoteType().equals("R")) {
                        int i = obj.getRecvrIdList().indexOf(user);
                        if (!obj.getRecvNoteStCdList().get(i).equals("3")) {
                            it.remove();
                        }
                    }
                    if (obj.getNoteType().equals("D")) {
                        if (!obj.getDpchNoteStCd().equals("3")) {
                            it.remove();
                        }
                    }
                }
                break;
        }
    }
    
    
}
