package com.ljn.library.exception;

import com.ljn.library.common.LjnResult;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.validation.BindException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

@RestControllerAdvice
public class LjnGlobalExceptionHandler {

    private static final Logger ljnLogger = LoggerFactory.getLogger(LjnGlobalExceptionHandler.class);

    @ExceptionHandler(LjnBusinessException.class)
    public LjnResult<?> handleBusinessException(LjnBusinessException e) {
        ljnLogger.warn("业务异常: {}", e.getMessage());
        return LjnResult.error(e.getCode(), e.getMessage());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public LjnResult<?> handleValidationException(MethodArgumentNotValidException e) {
        FieldError ljnFieldError = e.getBindingResult().getFieldError();
        String ljnMessage = ljnFieldError != null ? ljnFieldError.getDefaultMessage() : "参数校验失败";
        ljnLogger.warn("参数校验失败: {}", ljnMessage);
        return LjnResult.error(400, ljnMessage);
    }

    @ExceptionHandler(BindException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public LjnResult<?> handleBindException(BindException e) {
        FieldError ljnFieldError = e.getBindingResult().getFieldError();
        String ljnMessage = ljnFieldError != null ? ljnFieldError.getDefaultMessage() : "参数绑定失败";
        ljnLogger.warn("参数绑定失败: {}", ljnMessage);
        return LjnResult.error(400, ljnMessage);
    }

    @ExceptionHandler(AccessDeniedException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    public LjnResult<?> handleAccessDeniedException(AccessDeniedException e) {
        ljnLogger.warn("权限不足: {}", e.getMessage());
        return LjnResult.error(403, "权限不足，无法执行此操作");
    }

    @ExceptionHandler(MaxUploadSizeExceededException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public LjnResult<?> handleMaxUploadSizeExceededException(MaxUploadSizeExceededException e) {
        ljnLogger.warn("文件上传超过限制: {}", e.getMessage());
        return LjnResult.error(400, "文件大小超过限制（最大10MB）");
    }

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public LjnResult<?> handleException(Exception e) {
        ljnLogger.error("系统异常: ", e);
        return LjnResult.error(500, "服务器错误，请稍后重试");
    }
}
