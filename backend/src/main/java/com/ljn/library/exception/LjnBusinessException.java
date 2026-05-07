package com.ljn.library.exception;

public class LjnBusinessException extends RuntimeException {

    private int code;

    public LjnBusinessException(String message) {
        super(message);
        this.code = 500;
    }

    public LjnBusinessException(int code, String message) {
        super(message);
        this.code = code;
    }

    public int getCode() {
        return code;
    }
}
