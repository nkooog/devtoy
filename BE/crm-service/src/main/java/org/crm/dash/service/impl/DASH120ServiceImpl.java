package org.crm.dash.service.impl;

import org.crm.comm.VO.COMM120VO;
import org.crm.config.spring.config.PropertiesService;
import org.crm.dash.VO.DASH120VO;
import org.crm.dash.service.DASH120Service;
import org.crm.dash.service.dao.DASHCommDAO;
import org.crm.util.com.ComnFun;
import org.crm.util.file.FileUtils;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/***********************************************************************************************
 * Program Name : 대시보드 항목관리 Serviceimpl
 * Creator      : 강동우
 * Create Date  : 2022.05.17
 * Description  : 대시보드 항목관리 Serviceimpl
 * Modify Desc  :
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.05.17     강동우           최초생성
 * 2022.09.20     김보영           수정
 ************************************************************************************************/
@Service("DASH120Service")
public class DASH120ServiceImpl implements DASH120Service {

    @Resource( name = "propertiesService" )
    private PropertiesService propertiesService;

    @Resource(name="DASHCommDAO")
    private DASHCommDAO DASH120DAO;

    @Override
    public List<DASH120VO> DASH120SEL01(DASH120VO vo) throws Exception {
        return DASH120DAO.selectByList("DASH120SEL01", vo);
    }

    @Override
    public List<DASH120VO> DASH120SEL02(DASH120VO vo) throws Exception {
        return DASH120DAO.selectByList("DASH120SEL02", vo);
    }

    @Override
    public List<DASH120VO> DASH120SEL03(DASH120VO vo) throws Exception {
        return DASH120DAO.selectByList("DASH120SEL03", vo);
    }

    @Override
    public List<DASH120VO> DASH120SEL04(DASH120VO vo) throws Exception {
        return DASH120DAO.selectByList("DASH120SEL04", vo);
    }

    @Override
    public List<DASH120VO> DASH120SEL05(DASH120VO vo) throws Exception {
        return DASH120DAO.selectByList("DASH120SEL05", vo);
    }

    @Override
    public List<DASH120VO> DASH120SEL06(DASH120VO vo) throws Exception {
        return DASH120DAO.selectByList("DASH120SEL06", vo);
    }

    @Override
    public int DASH120INS00(List<DASH120VO> dash120voList) throws Exception {
        for (DASH120VO vo : dash120voList) {
            if (vo.getBeforeDvCd().isEmpty()) {
                continue;
            }
            DASH120VO checkList = (DASH120VO) DASH120DAO.selectByOne("DASH120PltDvCheck",vo);
            List<DASH120VO> deleteVo = new ArrayList<DASH120VO>();
            if (!ComnFun.isEmptyObj(checkList)) {
                deleteVo.add(checkList);
                int rtn = this.DASH120DEL00(deleteVo);
            }
        }
        return DASH120DAO.sqlInsert("DASH120INS00", dash120voList);
    }

    @Override
    public Integer DASH120INS01(List<DASH120VO> dash120voList) throws Exception {
        return DASH120DAO.sqlInsert("DASH120INS01",dash120voList);
    }

    @Override
    public Integer DASH120INS02(List<DASH120VO> dash120voList) throws Exception {
        return DASH120DAO.sqlInsert("DASH120INS02",dash120voList);
    }

    @Override
    public Integer DASH120DEL01(List<DASH120VO> dash120voList) throws Exception {
        DASH120DAO.sqlDelete("DASH120DEL02", dash120voList);
        return DASH120DAO.sqlDelete("DASH120DEL01",dash120voList);
    }

    @Override
    public Integer DASH120DEL02(List<DASH120VO> dash120voList) throws Exception {
        return DASH120DAO.sqlDelete("DASH120DEL02",dash120voList);
    }

    @Override
    public Integer DASH120INS03(String uploadPath, String stringVo, List<DASH120VO> dash120voList) throws Exception {
//        List<String> fileIdxList = new ArrayList<>();
        for (DASH120VO vo : dash120voList) {
            DASH120VO imgCheckVO = (DASH120VO) DASH120DAO.selectByOne("DASH120imgCheck", vo);

            if (imgCheckVO != null && vo.getPltItemImg() != null) {
                // 업데이트 이미지
                deleteImg(uploadPath, imgCheckVO);
                makeImgVO(uploadPath, stringVo, vo);
            } else if (imgCheckVO != null && vo.getImgExist().equals("N")) {
                // 이미지 삭제 - 텍스트 변경
                deleteImg(uploadPath, imgCheckVO);
                DASH120DAO.sqlDelete("DASH120DEL07", vo);
            } else if (vo.getPltItemImg() != null) {
                // 신규 이미지
                makeImgVO(uploadPath, stringVo, vo);
            }
        }

        return DASH120DAO.sqlInsert("DASH120INS03", dash120voList);
    }

    private static void makeImgVO(String uploadPath, String stringVo, DASH120VO vo) throws Exception {
        List<COMM120VO> comm120List = FileUtils.uploadPreJob(uploadPath, stringVo, vo.getPltItemImg());
        for (COMM120VO commVo : comm120List) {
            vo.setFileNm(commVo.getApndFileNm());
            vo.setFileNmIdx(commVo.getApndFileIdxNm());
            vo.setFilePsn(commVo.getApndFilePsn());
        }
    }

    private static void deleteImg(String uploadPath, DASH120VO imgCheckVO) throws Exception {
        String targetPath = uploadPath + imgCheckVO.getTenantId();
        FileUtils.removeFile(targetPath, imgCheckVO.getFileNmIdx());
    }

    @Override
    public Integer DASH120DEL03(List<DASH120VO> dash120voList, String uploadPath) throws Exception {
        imgCheckAndDelete(dash120voList);
        DASH120DAO.sqlDelete("DASH120DEL02", dash120voList);
        return DASH120DAO.sqlDelete("DASH120DEL03", dash120voList);
    }

    @Override
    public Integer DASH120DEL04(List<DASH120VO> dash120voList) throws Exception {
        return DASH120DAO.sqlDelete("DASH120DEL04", dash120voList);
    }

    @Override
    public Integer DASH120INS04(List<DASH120VO> dash120voList) throws Exception {
        DASH120DAO.sqlInsert("DASH120INS05", dash120voList);
        return DASH120DAO.sqlInsert("DASH120INS04", dash120voList);
    }

    @Override
    public Integer DASH120DEL05(List<DASH120VO> dash120voList) throws Exception {
        // 퀵링크 삭제
        return DASH120DAO.sqlDelete("DASH120DEL05", dash120voList);
    }

    @Override
    public Integer DASH120DEL06(List<DASH120VO> dash120voList) throws Exception {
        // pltItemCd 에 의한 아이템, 디테일 테이블 삭제
        imgCheckAndDelete(dash120voList);
        DASH120DAO.sqlDelete("DASH120DeleteSubTableByItemCd", dash120voList);
        return DASH120DAO.sqlDelete("DASH120DEL06", dash120voList);
    }

    @Override
    public Integer DASH120DEL00(List<DASH120VO> dash120voList) throws Exception {
        // pltDvCd 에 의한 모든 템플릿(템플릿,아이템,디테일) 테이블 삭제
        imgCheckAndDelete(dash120voList);
        DASH120DAO.sqlDelete("DASH120DeleteSubTableByDvCd", dash120voList);
        return DASH120DAO.sqlDelete("DASH120DEL00", dash120voList);
    }

    private void imgCheckAndDelete(List<DASH120VO> dash120voList) throws Exception {
        List<DASH120VO> topPlt = dash120voList.stream()
                .filter(x -> x.getPltDvCd().equals("T"))
                .filter(x -> x.getPltItemCd().equals("T02") || x.getPltItemCd().equals("T05"))
                .collect(Collectors.toList());
        if (topPlt.size() > 0) {
            for (DASH120VO vo : topPlt) {
                DASH120VO imgCheckVO = (DASH120VO) DASH120DAO.selectByOne("DASH120imgCheck", vo);

                if (imgCheckVO != null) {
                    String uploadPath = imgCheckVO.getPltItemCd().equals("T05")
                            ? propertiesService.getString("DASH_IMG")
                            : propertiesService.getString("DASH");
                    deleteImg(uploadPath, imgCheckVO);
                }
            }
        }
    }
}
