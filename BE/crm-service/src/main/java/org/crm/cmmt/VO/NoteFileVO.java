package org.crm.cmmt.VO;

import org.crm.comm.VO.COMM120VO;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class NoteFileVO extends COMM120VO {

    private String regYr;           //등록년도
    private int    noteNo;          //쪽지번호
    private long   inputApndFileSz;

}
