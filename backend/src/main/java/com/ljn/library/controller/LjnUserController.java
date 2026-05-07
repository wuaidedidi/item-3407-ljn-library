package com.ljn.library.controller;

import com.ljn.library.common.LjnPageResult;
import com.ljn.library.common.LjnResult;
import com.ljn.library.dto.LjnPasswordDto;
import com.ljn.library.dto.LjnUserUpdateDto;
import com.ljn.library.entity.LjnUser;
import com.ljn.library.service.LjnUserService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping("/api/ljn/users")
public class LjnUserController {

    private final LjnUserService ljnUserService;

    public LjnUserController(LjnUserService ljnUserService) {
        this.ljnUserService = ljnUserService;
    }

    @GetMapping("/me")
    public LjnResult<LjnUser> ljnGetCurrentUser(Authentication authentication) {
        Long ljnUserId = (Long) authentication.getPrincipal();
        LjnUser ljnUser = ljnUserService.ljnGetUserById(ljnUserId);
        return LjnResult.success(ljnUser);
    }

    @PutMapping("/me")
    public LjnResult<Void> ljnUpdateProfile(Authentication authentication,
                                              @RequestBody LjnUserUpdateDto ljnDto) {
        Long ljnUserId = (Long) authentication.getPrincipal();
        ljnUserService.ljnUpdateProfile(ljnUserId, ljnDto);
        return LjnResult.success("个人信息更新成功", null);
    }

    @PutMapping("/me/password")
    public LjnResult<Void> ljnChangePassword(Authentication authentication,
                                               @Valid @RequestBody LjnPasswordDto ljnDto) {
        Long ljnUserId = (Long) authentication.getPrincipal();
        ljnUserService.ljnChangePassword(ljnUserId, ljnDto);
        return LjnResult.success("密码修改成功", null);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public LjnResult<LjnPageResult<LjnUser>> ljnGetUserPage(
            @RequestParam(defaultValue = "1") Integer ljnPageNum,
            @RequestParam(defaultValue = "10") Integer ljnPageSize,
            @RequestParam(required = false) String ljnKeyword) {
        LjnPageResult<LjnUser> ljnResult = ljnUserService.ljnGetUserPage(ljnPageNum, ljnPageSize, ljnKeyword);
        return LjnResult.success(ljnResult);
    }

    @GetMapping("/{ljnId}")
    @PreAuthorize("hasRole('ADMIN')")
    public LjnResult<LjnUser> ljnGetUserById(@PathVariable Long ljnId) {
        LjnUser ljnUser = ljnUserService.ljnGetUserById(ljnId);
        return LjnResult.success(ljnUser);
    }

    @PutMapping("/{ljnId}")
    @PreAuthorize("hasRole('ADMIN')")
    public LjnResult<Void> ljnUpdateUser(@PathVariable Long ljnId,
                                           @RequestBody LjnUserUpdateDto ljnDto,
                                           Authentication authentication) {
        Long ljnCurrentUserId = (Long) authentication.getPrincipal();
        ljnDto.setLjnId(ljnId);
        ljnUserService.ljnUpdateUser(ljnDto, ljnCurrentUserId);
        return LjnResult.success("用户信息更新成功", null);
    }

    @DeleteMapping("/{ljnId}")
    @PreAuthorize("hasRole('ADMIN')")
    public LjnResult<Void> ljnDeleteUser(@PathVariable Long ljnId, Authentication authentication) {
        Long ljnCurrentUserId = (Long) authentication.getPrincipal();
        ljnUserService.ljnDeleteUser(ljnId, ljnCurrentUserId);
        return LjnResult.success("用户删除成功", null);
    }
}
