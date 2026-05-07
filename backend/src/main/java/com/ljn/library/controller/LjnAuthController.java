package com.ljn.library.controller;

import com.ljn.library.common.LjnResult;
import com.ljn.library.dto.LjnLoginDto;
import com.ljn.library.dto.LjnRegisterDto;
import com.ljn.library.service.LjnUserService;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.Map;

@RestController
@RequestMapping("/api/ljn/auth")
public class LjnAuthController {

    private final LjnUserService ljnUserService;

    public LjnAuthController(LjnUserService ljnUserService) {
        this.ljnUserService = ljnUserService;
    }

    @PostMapping("/login")
    public LjnResult<Map<String, Object>> ljnLogin(@Valid @RequestBody LjnLoginDto ljnLoginDto) {
        Map<String, Object> ljnData = ljnUserService.ljnLogin(ljnLoginDto);
        return LjnResult.success("登录成功", ljnData);
    }

    @PostMapping("/register")
    public LjnResult<Void> ljnRegister(@Valid @RequestBody LjnRegisterDto ljnRegisterDto) {
        ljnUserService.ljnRegister(ljnRegisterDto);
        return LjnResult.success("注册成功", null);
    }
}
