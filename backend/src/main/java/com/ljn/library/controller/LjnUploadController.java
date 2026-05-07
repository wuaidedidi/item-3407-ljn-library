package com.ljn.library.controller;

import com.ljn.library.common.LjnResult;
import com.ljn.library.exception.LjnBusinessException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/ljn/upload")
public class LjnUploadController {

    private static final Logger ljnLogger = LoggerFactory.getLogger(LjnUploadController.class);
    private static final String LJN_UPLOAD_DIR = "/app/uploads/";

    @PostMapping("/image")
    public LjnResult<Map<String, String>> ljnUploadImage(@RequestParam("file") MultipartFile ljnFile) {
        if (ljnFile.isEmpty()) {
            throw new LjnBusinessException(400, "请选择要上传的文件");
        }

        String ljnOriginalFilename = ljnFile.getOriginalFilename();
        if (ljnOriginalFilename == null) {
            throw new LjnBusinessException(400, "文件名不能为空");
        }

        int ljnDotIndex = ljnOriginalFilename.lastIndexOf(".");
        if (ljnDotIndex < 0) {
            throw new LjnBusinessException(400, "文件缺少扩展名，仅支持 jpg、jpeg、png、gif、webp 格式的图片");
        }
        String ljnSuffix = ljnOriginalFilename.substring(ljnDotIndex).toLowerCase();
        if (!".jpg".equals(ljnSuffix) && !".jpeg".equals(ljnSuffix)
                && !".png".equals(ljnSuffix) && !".gif".equals(ljnSuffix) && !".webp".equals(ljnSuffix)) {
            throw new LjnBusinessException(400, "仅支持 jpg、jpeg、png、gif、webp 格式的图片");
        }

        String ljnNewFilename = UUID.randomUUID().toString().replace("-", "") + ljnSuffix;

        File ljnDir = new File(LJN_UPLOAD_DIR);
        if (!ljnDir.exists()) {
            ljnDir.mkdirs();
        }

        try {
            ljnFile.transferTo(new File(LJN_UPLOAD_DIR + ljnNewFilename));
            ljnLogger.info("文件上传成功: {}", ljnNewFilename);

            Map<String, String> ljnData = new HashMap<>();
            ljnData.put("ljnUrl", "/uploads/" + ljnNewFilename);
            return LjnResult.success("上传成功", ljnData);
        } catch (IOException e) {
            ljnLogger.error("文件上传失败: ", e);
            throw new LjnBusinessException(500, "文件上传失败，请稍后重试");
        }
    }
}
