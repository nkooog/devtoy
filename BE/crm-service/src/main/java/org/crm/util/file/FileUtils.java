package org.crm.util.file;

import org.crm.comm.VO.COMM120VO;
import org.crm.util.date.DateUtil;
import org.crm.util.json.JsonUtil;
import org.apache.commons.io.FilenameUtils;
import org.json.simple.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.UUID;
/***********************************************************************************************
 * Program Name : 파일 Utils
 * Creator      : 이민호
 * Create Date  : 2022.05.10
 * Description  : 폴더생성, 파일 업로드, 파일 삭제
 * Modify Desc  :
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.05.10      이민호          최초생성
 * 2022.05.17      sukim           전반적인 개선
 * 2022.07.07      djjung          복사기능 추가
 ************************************************************************************************/
public class FileUtils {

    private static final Logger LOGGER = LoggerFactory.getLogger(FileUtils.class);
    
    static COMM120VO comm120Vo = new COMM120VO();
    
    /**
     * @Method Name : makeDirectory
     * @작성일      : 2022.05.17
     * @작성자      : sukim
     * @변경이력    : 
     * @Method 설명 : 디렉토리 생성
	 * @param       : 파일경로
	 * @return      : 없음
     */      
    public static void makeDirectory(String path) {
        LOGGER.info("=== 폴더 생성 ============");
        File dirPath = new File(path);
        if (!dirPath.isDirectory()) {
            dirPath.mkdirs();
        }
    }
    
    /**
     * @Method Name : uploadPreJob
     * @작성일      : 2022.05.17
     * @작성자      : sukim
     * @변경이력    : 
     * @Method 설명 : 파일 업로드 전처리(파일업로드 & DB 저장용 List<VO> 생성)
	 * @param       : 파일경로, 저장구분(B:통합게시판, N:쪽지관리, K:지식관리), Json정보, 멀티파트정보
	 * @return      : List<COMM120VO>
     */  
    public static List<COMM120VO> uploadPreJob(String pathName, JSONObject obj, List<MultipartFile> files) throws Exception{
        LOGGER.info("=== 파일 업로드 전처리 ============");
        String targetFilePath = pathName + obj.get("tenantId");
        List<COMM120VO> attatchFileList = new ArrayList<COMM120VO>();
        int seqNo = 0;
        if (files.size() > 0) {
            for (MultipartFile getFile : files) {
            	seqNo++;
            	comm120Vo = new COMM120VO();
                String originFileName = getFile.getOriginalFilename();
                String originFileExt = FilenameUtils.getExtension(originFileName);
                //String saveFileName = UUID.randomUUID().toString().replaceAll("-", "") + "-" + originFileName;
                String strDate = DateUtil.TimestampTostr(DateUtil.getTimeStamp()).toString();
                String saveFileName = UUID.randomUUID().toString().replaceAll("-", "") + "_" + strDate + "." + originFileExt;
                
                uploadFile(targetFilePath, saveFileName, getFile);
                
                //공통항목
                comm120Vo.setTenantId((String) obj.get("tenantId"));
                comm120Vo.setApndFileSeq(seqNo);
                comm120Vo.setApndFileNm(originFileName);
                comm120Vo.setApndFileIdxNm(saveFileName);
                comm120Vo.setApndFilePsn(targetFilePath);
                comm120Vo.setRegrId((String) obj.get("regrId"));
                comm120Vo.setRegrOrgCd((String) obj.get("regrOrgCd"));
                
                attatchFileList.add(comm120Vo);
            }
        }
        return attatchFileList;
    }

	/**
	 * @Method Name : uploadPreJob
	 * @작성일      : 2022.07.22
	 * @작성자      : djjung
	 * @변경이력    :
	 * @Method 설명 : 파일 업로드 전처리(파일업로드 & DB 저장용 List<VO> 생성)
	 * @param       : 파일경로, Json정보, 멀티파트정보
	 * @return      : List<COMM120VO>
	 */
	public static List<COMM120VO> uploadPreJob(String pathName, String obj, List<MultipartFile> files) throws Exception{
		JSONObject jsonObject = JsonUtil.parseJSONString(obj);
		return uploadPreJob(pathName,jsonObject,files);
	}

	/**
	 * @Method Name : uploadPreJob
	 * @작성일      : 2022.07.22
	 * @작성자      : djjung
	 * @변경이력    :
	 * @Method 설명 : 파일 업로드 전처리(파일업로드 & DB 저장용 List<VO> 생성)
	 * @param       : 파일경로, Json정보, 멀티파트정보
	 * @return      : List<COMM120VO>
	 */
	public static List<COMM120VO> uploadPreJob(String pathName, String obj, MultipartFile file) throws Exception{
		JSONObject jsonObject = JsonUtil.parseJSONString(obj);
		List<MultipartFile> files = new ArrayList<>();
		files.add(file);
		return uploadPreJob(pathName,jsonObject,files);
	}

    /**
     * @Method Name : uploadFile
     * @작성일      : 2022.05.17
     * @작성자      : sukim
     * @변경이력    : 
     * @Method 설명 : 파일업로드
	 * @param       : 업로드경로,업로드파일, 멀티파트파일 
	 * @return      : 없음
     */      
    private static void uploadFile(String targetFilePath, String saveFileName, MultipartFile files) {
        LOGGER.info("=== 파일 업로드 저장 ============");
        makeDirectory(targetFilePath);
        File uploadFile = new File(targetFilePath + "/" + saveFileName);
        try {
            files.transferTo(uploadFile);
            Thread.sleep(100); //0.1 초 대기
            LOGGER.info(targetFilePath + "/" + saveFileName +" 업로드완료~");
        } catch (Exception e) {
            LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
        }
    }
    
    /**
     * @Method Name : removeFile
     * @작성일      : 2022.05.17
     * @작성자      : sukim
     * @변경이력    : 
     * @Method 설명 : 파일 삭제
	 * @param       : 파일경로, 파일명
	 * @return      : 없음
     */
    public static void removeFile(String uploadPath, String indexName) throws Exception {
        File deleteFile = new File(uploadPath + "/" + indexName);
        if (deleteFile.exists()) {
            try {
                deleteFile.delete();
                LOGGER.info("=== 파일명: " + uploadPath + "/" + indexName + "삭제 성공 ===");
            } catch (Exception e) {
                LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
            }
        }
    }

    /**
     * @Method Name : downloadFileInfo
     * @작성일      : 2022.05.17
     * @작성자      : sukim
     * @변경이력    : 
     * @Method 설명 : 다운로드 파일정보
	 * @param       : HashMap<Object, Object> params
	 * @return      : 다운로드 File
     */    
    public static File downloadFileInfo(HashMap<Object, Object> params) {
        LOGGER.info("=== 다운로드 파일정보 가져오기 ============");
        File file = null;
        try {
	    	String FILE_SERVER_PATH=(String) params.get("urlPath");
	    	String fileName = (String) params.get("fileName");
	    	String fullPath = FILE_SERVER_PATH +"/"+fileName;
	    	file = new File(fullPath);
        } catch (Exception e) {
            LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
        }
    	return file;
    }

	/**
	 * @Method Name : copyToFile
	 * @작성일      : 2022.07.07
	 * @작성자      : djjung
	 * @변경이력    :
	 * @Method 설명 : 파일 복사
	 * @param       :
	 * @return      :
	 */
	public static List<COMM120VO> copyToFile(List<COMM120VO> files) throws Exception{

		LOGGER.info("=== 파일 복사 ============");
		List<COMM120VO> outFilesInfo = new ArrayList<>();

		for(COMM120VO file : files){
			String FILE_SERVER_PATH = file.getApndFilePsn();

			String inFileFullPath =FILE_SERVER_PATH + "/" +file.getApndFileIdxNm();
			String outFileName = UUID.randomUUID().toString().replaceAll("-", "") + "-" + file.getApndFileNm();
			String outFileFullPath = FILE_SERVER_PATH + "/"+outFileName;

			File in = new File(inFileFullPath);
			File out = new File(outFileFullPath);
			int result = FileCopyUtils.copy(in, out);

			if(result>0){//성공
				COMM120VO outFile = new COMM120VO();
				outFile.setApndFileSeq(file.getApndFileSeq());
				outFile.setApndFileIdxNm(outFileName);
				outFilesInfo.add(outFile);
			}
		}
		return outFilesInfo;
	}

}
