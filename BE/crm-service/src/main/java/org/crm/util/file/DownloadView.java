package org.crm.util.file;

import org.crm.util.string.StringUtil;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.URLEncoder;

@Slf4j
@Component
public class DownloadView {

	private final int BUFFER_SIZE = 2048;
	private final String ENCODE = "UTF-8";

	public void downloadFile(File file, HttpServletResponse response)throws Exception {

		log.debug("file name :  " + file.getName());
		log.debug( "file len : " + file.length());

		response.setHeader("Content-Disposition", "attachment; fileName=" + URLEncoder.encode(file.getName(), ENCODE));
		response.setContentType(MediaType.APPLICATION_OCTET_STREAM_VALUE);
		response.setContentLength((int) file.length());

		try (InputStream in = new FileInputStream(file);
		     OutputStream out = response.getOutputStream()) {

			byte[] buffer = new byte[BUFFER_SIZE];
			int bytesRead;

			while ((bytesRead = in.read(buffer)) != -1) {
				out.write(buffer, 0, bytesRead);
			}
			out.flush();
		}catch (Exception e) {
			e.printStackTrace();
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
		}
	}

	public void downloadFile(File file, HttpServletResponse response, String oriFileName)throws Exception {

		log.debug("file name :  " + file.getName());
		log.debug( "file len : " + file.length());

		String fileName = file.getName();

	    if(!"".equals(StringUtil.nullToBlank(oriFileName))) {
			fileName = oriFileName;
		}
		response.setHeader("Content-Disposition", "attachment; fileName=" + URLEncoder.encode(fileName, ENCODE));
		response.setContentType(MediaType.APPLICATION_OCTET_STREAM_VALUE);
		response.setContentLength((int) file.length());

		try (InputStream in = new FileInputStream(file);
		     OutputStream out = response.getOutputStream()) {

			byte[] buffer = new byte[BUFFER_SIZE];
			int bytesRead;

			while ((bytesRead = in.read(buffer)) != -1) {
				out.write(buffer, 0, bytesRead);
			}
			out.flush();
		}catch (Exception e) {
			e.printStackTrace();
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
		}
	}

}