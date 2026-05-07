package com.ljn.library.common;

import lombok.Data;

@Data
public class LjnResult<T> {

    private int code;
    private String message;
    private T data;

    private LjnResult() {}

    public static <T> LjnResult<T> success(T data) {
        LjnResult<T> ljnResult = new LjnResult<>();
        ljnResult.setCode(200);
        ljnResult.setMessage("操作成功");
        ljnResult.setData(data);
        return ljnResult;
    }

    public static <T> LjnResult<T> success(String message, T data) {
        LjnResult<T> ljnResult = new LjnResult<>();
        ljnResult.setCode(200);
        ljnResult.setMessage(message);
        ljnResult.setData(data);
        return ljnResult;
    }

    public static <T> LjnResult<T> success() {
        return success(null);
    }

    public static <T> LjnResult<T> error(int code, String message) {
        LjnResult<T> ljnResult = new LjnResult<>();
        ljnResult.setCode(code);
        ljnResult.setMessage(message);
        return ljnResult;
    }

    public static <T> LjnResult<T> error(String message) {
        return error(500, message);
    }
}
