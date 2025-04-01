package org.crm.util.xlsx;

import org.apache.commons.io.FilenameUtils;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;

/***********************************************************************************************
* Program Name : apache.poi 유틸(ExcelFileType.java)
* Creator      : sukim
* Create Date  : 2021.12.20
* Description  : ExcelUtil
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2021.12.20     sukim            최초생성
************************************************************************************************/
public class ExcelFileType {
    public static Workbook getWorkbook(String filePath) {
        FileInputStream fis = null;
        try {
            fis = new FileInputStream(filePath);
        } catch (FileNotFoundException e) {
            throw new RuntimeException(e.getMessage(), e);
        }
        
        Workbook wb = null;
        
        if(filePath.toUpperCase().endsWith(".XLS")) {
            try {
                wb = new HSSFWorkbook(fis);
            } catch (IOException e) {
                throw new RuntimeException(e.getMessage(), e);
            }
        }
        else if(filePath.toUpperCase().endsWith(".XLSX")) {
            try {
                wb = new XSSFWorkbook(fis);
            } catch (IOException e) {
                throw new RuntimeException(e.getMessage(), e);
            }
        }
        return wb;
    }
    
    public static Workbook getWorkbook(MultipartFile upFile) {

		String excelExt = FilenameUtils.getExtension(upFile.getOriginalFilename());
		Workbook workbook = null;
	
		if(excelExt.toUpperCase().equals("XLS")) {
			try {
				workbook = new HSSFWorkbook(upFile.getInputStream());
			} catch (IOException e) {
				throw new RuntimeException(e.getMessage(), e);
			}
		} else if(excelExt.toUpperCase().equals("XLSX")) {
			try {
				workbook = new XSSFWorkbook(upFile.getInputStream());
				
			} catch (IOException e) {
				throw new RuntimeException(e.getMessage(), e);
			}
		}
	

		return workbook;

	}
}