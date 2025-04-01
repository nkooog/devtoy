package org.crm.cmmt.web;

import org.crm.cmmt.VO.CMMT500VO;
import org.crm.cmmt.VO.NoteFileVO;
import org.crm.cmmt.service.NoteFileService;
import org.crm.util.com.ComnFun;
import org.crm.util.crypto.AES256Crypt;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.Resource;
import org.json.simple.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/***********************************************************************************************
 * Program Name : 파일 Utils
 * Creator      : 이민호
 * Create Date  : 2022.05.10
 * Description  : 폴더생성, 파일 업로드, 파일 삭제
 * Modify Desc  :
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.05.10      mhlee           최초생성
 * 2022.05.17      sukim           전반적인 개선
 * 2022.05.26      mhlee           제네릭 메소드 추가
 ************************************************************************************************/
@Component
public class NoteFileUtils {

    @Autowired
    private ObjectMapper objectMapper;

    @Resource(name = "NoteFileService")
    private NoteFileService noteFileService;

    private static final Logger LOGGER = LoggerFactory.getLogger(NoteFileUtils.class);

    /**
     * @param : 파일경로
     * @return : 없음
     * @Method Name : makeDirectory
     * @작성일 : 2022.05.17
     * @작성자 : sukim
     * @변경이력 :
     * @Method 설명 : 디렉토리 생성
     */
    private void makeDirectory(String path) {
        LOGGER.info("=== 폴더 생성 ============");
        File dirPath = new File(path);
        if (!dirPath.isDirectory()) {
            dirPath.mkdirs();
        }
    }

    public List<NoteFileVO> uploadPreJobAndGetFileVOList(String pathName, JSONObject obj, List<MultipartFile> files) throws Exception {
        LOGGER.info("=== 파일 업로드 전처리 ============");
        String targetFilePath = pathName + obj.get("tenantId");
        List<NoteFileVO> VOList = new ArrayList<NoteFileVO>();

        for (MultipartFile getFile : files) {
            NoteFileVO targetVO = new NoteFileVO();
            String originFileName = getFile.getOriginalFilename();
            String saveFileName = UUID.randomUUID().toString().replaceAll("-", "") + "-" + originFileName;
            long FileSize = getFile.getSize();
            System.out.println(FileSize);
            uploadFile(targetFilePath, saveFileName, getFile);

            //공통항목
            targetVO.setTenantId((String) obj.get("tenantId"));
            targetVO.setApndFileNm(originFileName);
            targetVO.setInputApndFileSz(FileSize);
            targetVO.setApndFileIdxNm(saveFileName);
            targetVO.setApndFilePsn(targetFilePath);
            targetVO.setRegrId((String) obj.get("dpchmnId"));
            targetVO.setRegrOrgCd((String) obj.get("dpchmnOrgCd"));

            VOList.add(targetVO);
        }

        return VOList;
    }

    /**
     * @param : 업로드경로,업로드파일, 멀티파트파일
     * @return : 없음
     * @Method Name : uploadFile
     * @작성일 : 2022.05.17
     * @작성자 : sukim
     * @변경이력 :
     * @Method 설명 : 파일업로드
     */
    private void uploadFile(String targetFilePath, String saveFileName, MultipartFile files) {
        LOGGER.info("=== 파일 업로드 저장 ============");
        makeDirectory(targetFilePath);
        File uploadFile = new File(targetFilePath + "/" + saveFileName);
        try {
            files.transferTo(uploadFile);
            Thread.sleep(100); //0.1 초 대기
            LOGGER.info(targetFilePath + "/" + saveFileName + " 업로드완료~");
        } catch (Exception e) {
            LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
        }
    }

    /**
     * @param : 파일경로, 파일명
     * @return : 없음
     * @Method Name : removeFile
     * @작성일 : 2022.05.17
     * @작성자 : sukim
     * @변경이력 :
     * @Method 설명 : 파일 삭제
     */
    public void removeFile(String uploadPath, String indexName) throws Exception {
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
     * @param : HashMap<Object, Object> params
     * @return : 다운로드 File
     * @Method Name : downloadFileInfo
     * @작성일 : 2022.05.17
     * @작성자 : sukim
     * @변경이력 :
     * @Method 설명 : 다운로드 파일정보
     */
    public File downloadFileInfo(HashMap<Object, Object> params) {
        LOGGER.info("=== 다운로드 파일정보 가져오기 ============");
        File file = null;
        try {
            String FILE_SERVER_PATH = (String) params.get("urlPath");
            String fileName = (String) params.get("fileName");
            String fullPath = FILE_SERVER_PATH + "/" + fileName;
            file = new File(fullPath);
        } catch (Exception e) {
            LOGGER.error("[" + e.getClass() + "] Exception : " + e.getMessage());
        }
        return file;
    }

    public void checkExistFileAndDelete(List<NoteFileVO> noteFileList) throws Exception {
        for (NoteFileVO noteFile : noteFileList) {
            this.removeFile(noteFile.getApndFilePsn(), noteFile.getApndFileIdxNm());
        }
    }

    /**
     * @param :
     * @return :
     * @Method Name : copyToNoteFile
     * @작성일 : 2022.07.27
     * @작성자 : mhlee
     * @변경이력 :
     * @Method 설명 : 파일 복사
     */
    public List<NoteFileVO> copyToNoteFile(List<Object> list) throws Exception {

        List<NoteFileVO> convertList = this.objectMapper.convertValue(list, new TypeReference<List<NoteFileVO>>() {});
        List<NoteFileVO> outFilesInfo = new ArrayList<>();
        try {
            for (NoteFileVO vo : convertList) {
                String FILE_SERVER_PATH = vo.getApndFilePsn();

                String inFileFullPath = FILE_SERVER_PATH + "/" + vo.getApndFileIdxNm();
                String outFileName = UUID.randomUUID().toString().replaceAll("-", "") + "-" + vo.getApndFileNm();
                String outFileFullPath = FILE_SERVER_PATH + "/" + outFileName;

                File in = new File(inFileFullPath);
                File out = new File(outFileFullPath);
                int result = FileCopyUtils.copy(in, out);
                if (result > 0) {//성공
                    NoteFileVO outFile = new NoteFileVO();
                    outFile.setApndFileIdxNm(outFileName);
                    outFile.setApndFileNm(vo.getApndFileNm());
                    outFile.setInputApndFileSz(vo.getInputApndFileSz());
                    outFile.setApndFilePsn(vo.getApndFilePsn());
                    outFilesInfo.add(outFile);
                }
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
        return outFilesInfo;
    }

    /**
     * @param : List<T> params
     * @return : List<T>
     * @Method Name : DuplicatesAndMergeUsrInfo
     * @작성일 : 2022.07.01
     * @작성자 : mhlee
     * @변경이력 :
     * @Method 설명 : 쪽지번호를 기준으로 중복 제거 후 수신자 정보(아이디,이름,조직코드) 병합 후 리스트 반환
     */
    public <T extends CMMT500VO> List<T> DuplicatesAndMergeUsrInfo(final List<T> noteList) throws Exception {
        ConcurrentHashMap<Integer, T> tempMap = new ConcurrentHashMap<Integer, T>();
        for (T vo : noteList) {
            int noteNo = vo.getNoteNo();
            if (tempMap.containsKey(noteNo)) {
                vo.setRecvrId(tempMap.get(noteNo).getRecvrId() + "," + vo.getRecvrId());
                vo.setRecvrOrgCd(tempMap.get(noteNo).getRecvrOrgCd() + "," + vo.getRecvrOrgCd());
                vo.setRecvNoteStCd(tempMap.get(noteNo).getRecvNoteStCd() + "," + vo.getRecvNoteStCd());
                vo.setRecvrNm(tempMap.get(noteNo).getRecvrNm() + "," + AES256Crypt.decrypt(vo.getRecvrNm()));
            } else {
                vo.setRecvrNm(AES256Crypt.decrypt(vo.getRecvrNm()));
            }
            tempMap.put(noteNo, vo);
        }
        List<T> mergeList = new ArrayList<T>();

        for (int key : tempMap.keySet()) {
            tempMap.get(key).setDpchmnNm(AES256Crypt.decrypt(tempMap.get(key).getDpchmnNm()));
            tempMap.get(key).setRecvrIdList(Arrays.asList(tempMap.get(key).getRecvrId().split(",")));
            tempMap.get(key).setRecvrNmList(Arrays.asList(tempMap.get(key).getRecvrNm().split(",")));
            tempMap.get(key).setRecvrOrgCdList(Arrays.asList(tempMap.get(key).getRecvrOrgCd().split(",")));
            tempMap.get(key).setRecvNoteStCdList(Arrays.asList(tempMap.get(key).getRecvNoteStCd().split(",")));
            if (!ComnFun.isEmpty(tempMap.get(key).getApndSeq()))
                tempMap.get(key).setApndFileSeqList(Arrays.asList(tempMap.get(key).getApndSeq().split(",")));
            if (!ComnFun.isEmpty(tempMap.get(key).getApndFileNm()))
                tempMap.get(key).setApndFileNmList(Arrays.asList(tempMap.get(key).getApndFileNm().split(",")));
            if (!ComnFun.isEmpty(tempMap.get(key).getApndFileIdxNm()))
                tempMap.get(key).setApndFileIdxNmList(Arrays.asList(tempMap.get(key).getApndFileIdxNm().split(",")));
            if (!ComnFun.isEmpty(tempMap.get(key).getApndFilePsn()))
                tempMap.get(key).setApndFilePsnList(Arrays.asList(tempMap.get(key).getApndFilePsn().split(",")));
            mergeList.add(tempMap.get(key));
        }
        return mergeList;
    }
}
