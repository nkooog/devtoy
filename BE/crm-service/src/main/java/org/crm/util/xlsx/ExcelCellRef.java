package org.crm.util.xlsx;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.DataFormatter;
import org.apache.poi.ss.usermodel.DateUtil;
import org.apache.poi.ss.util.CellReference;

import java.text.SimpleDateFormat;

/***********************************************************************************************
* Program Name : apache.poi 유틸(ExcelCellRef.java)
* Creator      : sukim
* Create Date  : 2021.12.20
* Description  : ExcelUtil
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2021.12.20     sukim            최초생성
************************************************************************************************/
public class ExcelCellRef {
	
    static DataFormatter formatter = new DataFormatter();
	static SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");	
	
    public static String getName(Cell cell, int cellIndex) {
        int cellNum = 0;
        if(cell != null) {
            cellNum = cell.getColumnIndex();
        }
        else {
            cellNum = cellIndex;
        }
        
        return CellReference.convertNumToColString(cellNum);
    }
    
	public static String getValue(Cell cell) {
        String value = "";
        
        if(cell == null) {
            value = "";
        }
        else {
            if( cell.getCellType() == CellType.FORMULA ) {
                value = cell.getCellFormula();
            }
            else if( cell.getCellType() == CellType.NUMERIC ) {
            	if (DateUtil.isInternalDateFormat(cell.getCellStyle().getDataFormat())) {
            		value = sdf.format(cell.getDateCellValue());
            	}else {
        			value = formatter.formatCellValue(cell).toString();
            	}            	
            }
            else if( cell.getCellType() == CellType.STRING ) {
                value = cell.getStringCellValue();
            }
            else if( cell.getCellType() == CellType.BOOLEAN ) {
                value = cell.getBooleanCellValue() + "";
            }
            else if( cell.getCellType() == CellType.ERROR ) {
                value = cell.getErrorCellValue() + "";
            }
            else if( cell.getCellType() == CellType.BLANK ) {
                value = "";
            }
            else {
                value = cell.getStringCellValue();
            }
        }
        return value;
    }
}