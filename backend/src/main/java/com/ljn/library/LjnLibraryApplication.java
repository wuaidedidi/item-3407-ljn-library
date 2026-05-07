package com.ljn.library;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.ljn.library.mapper")
public class LjnLibraryApplication {
    public static void main(String[] args) {
        SpringApplication.run(LjnLibraryApplication.class, args);
    }
}
