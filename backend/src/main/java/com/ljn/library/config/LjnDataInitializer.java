package com.ljn.library.config;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.ljn.library.entity.LjnUser;
import com.ljn.library.mapper.LjnUserMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class LjnDataInitializer implements CommandLineRunner {

    private static final Logger ljnLogger = LoggerFactory.getLogger(LjnDataInitializer.class);

    private final LjnUserMapper ljnUserMapper;
    private final PasswordEncoder ljnPasswordEncoder;

    public LjnDataInitializer(LjnUserMapper ljnUserMapper, PasswordEncoder ljnPasswordEncoder) {
        this.ljnUserMapper = ljnUserMapper;
        this.ljnPasswordEncoder = ljnPasswordEncoder;
    }

    @Override
    public void run(String... args) {
        ljnFixAdminPassword();
    }

    private void ljnFixAdminPassword() {
        LambdaQueryWrapper<LjnUser> ljnWrapper = new LambdaQueryWrapper<>();
        ljnWrapper.eq(LjnUser::getLjnUsername, "admin");
        LjnUser ljnAdmin = ljnUserMapper.selectOne(ljnWrapper);

        if (ljnAdmin != null && !ljnPasswordEncoder.matches("123456", ljnAdmin.getLjnPassword())) {
            ljnAdmin.setLjnPassword(ljnPasswordEncoder.encode("123456"));
            ljnUserMapper.updateById(ljnAdmin);
            ljnLogger.info("管理员密码已重置为默认密码");
        }

        LambdaQueryWrapper<LjnUser> ljnUserWrapper = new LambdaQueryWrapper<>();
        ljnUserWrapper.eq(LjnUser::getLjnUsername, "user");
        LjnUser ljnUser = ljnUserMapper.selectOne(ljnUserWrapper);

        if (ljnUser != null && !ljnPasswordEncoder.matches("123456", ljnUser.getLjnPassword())) {
            ljnUser.setLjnPassword(ljnPasswordEncoder.encode("123456"));
            ljnUserMapper.updateById(ljnUser);
            ljnLogger.info("普通用户密码已重置为默认密码");
        }

        ljnLogger.info("数据初始化检查完成");
    }
}
