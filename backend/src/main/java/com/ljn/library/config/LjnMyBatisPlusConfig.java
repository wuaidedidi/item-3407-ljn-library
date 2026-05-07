package com.ljn.library.config;

import com.baomidou.mybatisplus.annotation.DbType;
import com.baomidou.mybatisplus.core.handlers.MetaObjectHandler;
import com.baomidou.mybatisplus.extension.plugins.MybatisPlusInterceptor;
import com.baomidou.mybatisplus.extension.plugins.inner.PaginationInnerInterceptor;
import org.apache.ibatis.reflection.MetaObject;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDateTime;

@Configuration
public class LjnMyBatisPlusConfig implements MetaObjectHandler {

    @Bean
    public MybatisPlusInterceptor ljnMybatisPlusInterceptor() {
        MybatisPlusInterceptor ljnInterceptor = new MybatisPlusInterceptor();
        ljnInterceptor.addInnerInterceptor(new PaginationInnerInterceptor(DbType.MYSQL));
        return ljnInterceptor;
    }

    @Override
    public void insertFill(MetaObject metaObject) {
        this.strictInsertFill(metaObject, "ljnCreateTime", LocalDateTime.class, LocalDateTime.now());
        this.strictInsertFill(metaObject, "ljnUpdateTime", LocalDateTime.class, LocalDateTime.now());
    }

    @Override
    public void updateFill(MetaObject metaObject) {
        this.strictUpdateFill(metaObject, "ljnUpdateTime", LocalDateTime.class, LocalDateTime.now());
    }
}
