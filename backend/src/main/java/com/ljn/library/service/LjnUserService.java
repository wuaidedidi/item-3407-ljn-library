package com.ljn.library.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.ljn.library.common.LjnPageResult;
import com.ljn.library.dto.LjnLoginDto;
import com.ljn.library.dto.LjnPasswordDto;
import com.ljn.library.dto.LjnRegisterDto;
import com.ljn.library.dto.LjnUserUpdateDto;
import com.ljn.library.entity.LjnUser;
import com.ljn.library.exception.LjnBusinessException;
import com.ljn.library.mapper.LjnUserMapper;
import com.ljn.library.security.LjnJwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.HashMap;
import java.util.Map;

@Service
public class LjnUserService {

    private static final Logger ljnLogger = LoggerFactory.getLogger(LjnUserService.class);

    private final LjnUserMapper ljnUserMapper;
    private final PasswordEncoder ljnPasswordEncoder;
    private final LjnJwtUtil ljnJwtUtil;

    public LjnUserService(LjnUserMapper ljnUserMapper, PasswordEncoder ljnPasswordEncoder, LjnJwtUtil ljnJwtUtil) {
        this.ljnUserMapper = ljnUserMapper;
        this.ljnPasswordEncoder = ljnPasswordEncoder;
        this.ljnJwtUtil = ljnJwtUtil;
    }

    public Map<String, Object> ljnLogin(LjnLoginDto ljnLoginDto) {
        LambdaQueryWrapper<LjnUser> ljnWrapper = new LambdaQueryWrapper<>();
        ljnWrapper.eq(LjnUser::getLjnUsername, ljnLoginDto.getLjnUsername());
        LjnUser ljnUser = ljnUserMapper.selectOne(ljnWrapper);

        if (ljnUser == null) {
            throw new LjnBusinessException(400, "用户名或密码错误");
        }

        if (!ljnPasswordEncoder.matches(ljnLoginDto.getLjnPassword(), ljnUser.getLjnPassword())) {
            throw new LjnBusinessException(400, "用户名或密码错误");
        }

        if (ljnUser.getLjnStatus() != null && ljnUser.getLjnStatus() == 0) {
            throw new LjnBusinessException(400, "账号已被禁用，请联系管理员");
        }

        String ljnToken = ljnJwtUtil.generateToken(ljnUser.getLjnId(), ljnUser.getLjnUsername(), ljnUser.getLjnRole());

        Map<String, Object> ljnResult = new HashMap<>();
        ljnResult.put("ljnToken", ljnToken);
        ljnResult.put("ljnUserId", ljnUser.getLjnId());
        ljnResult.put("ljnUsername", ljnUser.getLjnUsername());
        ljnResult.put("ljnNickname", ljnUser.getLjnNickname());
        ljnResult.put("ljnRole", ljnUser.getLjnRole());

        ljnLogger.info("用户登录成功: {}", ljnUser.getLjnUsername());
        return ljnResult;
    }

    public void ljnRegister(LjnRegisterDto ljnRegisterDto) {
        LambdaQueryWrapper<LjnUser> ljnWrapper = new LambdaQueryWrapper<>();
        ljnWrapper.eq(LjnUser::getLjnUsername, ljnRegisterDto.getLjnUsername());
        Long ljnCount = ljnUserMapper.selectCount(ljnWrapper);

        if (ljnCount > 0) {
            throw new LjnBusinessException(400, "用户名已存在");
        }

        LjnUser ljnUser = new LjnUser();
        ljnUser.setLjnUsername(ljnRegisterDto.getLjnUsername());
        ljnUser.setLjnPassword(ljnPasswordEncoder.encode(ljnRegisterDto.getLjnPassword()));
        ljnUser.setLjnNickname(StringUtils.hasText(ljnRegisterDto.getLjnNickname())
                ? ljnRegisterDto.getLjnNickname() : ljnRegisterDto.getLjnUsername());
        ljnUser.setLjnRole(1);
        ljnUser.setLjnStatus(1);

        ljnUserMapper.insert(ljnUser);
        ljnLogger.info("用户注册成功: {}", ljnUser.getLjnUsername());
    }

    public LjnUser ljnGetUserById(Long ljnId) {
        LjnUser ljnUser = ljnUserMapper.selectById(ljnId);
        if (ljnUser == null) {
            throw new LjnBusinessException(404, "用户不存在");
        }
        ljnUser.setLjnPassword(null);
        return ljnUser;
    }

    public LjnPageResult<LjnUser> ljnGetUserPage(Integer ljnPageNum, Integer ljnPageSize, String ljnKeyword) {
        Page<LjnUser> ljnPage = new Page<>(ljnPageNum, ljnPageSize);
        LambdaQueryWrapper<LjnUser> ljnWrapper = new LambdaQueryWrapper<>();

        if (StringUtils.hasText(ljnKeyword)) {
            ljnWrapper.like(LjnUser::getLjnUsername, ljnKeyword)
                    .or().like(LjnUser::getLjnNickname, ljnKeyword);
        }

        ljnWrapper.orderByDesc(LjnUser::getLjnCreateTime);
        IPage<LjnUser> ljnResult = ljnUserMapper.selectPage(ljnPage, ljnWrapper);

        ljnResult.getRecords().forEach(u -> u.setLjnPassword(null));

        return new LjnPageResult<>(ljnResult.getRecords(), ljnResult.getTotal(),
                ljnResult.getSize(), ljnResult.getCurrent());
    }

    public void ljnUpdateUser(LjnUserUpdateDto ljnDto, Long ljnCurrentUserId) {
        LjnUser ljnExisting = ljnUserMapper.selectById(ljnDto.getLjnId());
        if (ljnExisting == null) {
            throw new LjnBusinessException(404, "用户不存在");
        }

        if (ljnDto.getLjnRole() != null && ljnExisting.getLjnRole() == 0
                && ljnDto.getLjnId().equals(ljnCurrentUserId)) {
            if (ljnDto.getLjnRole() != 0) {
                throw new LjnBusinessException(400, "管理员不能修改自己的角色");
            }
        }

        if (ljnDto.getLjnStatus() != null && ljnDto.getLjnId().equals(ljnCurrentUserId)) {
            if (ljnDto.getLjnStatus() == 0) {
                throw new LjnBusinessException(400, "不能禁用自己的账号");
            }
        }

        if (StringUtils.hasText(ljnDto.getLjnUsername())) {
            LambdaQueryWrapper<LjnUser> ljnWrapper = new LambdaQueryWrapper<>();
            ljnWrapper.eq(LjnUser::getLjnUsername, ljnDto.getLjnUsername())
                    .ne(LjnUser::getLjnId, ljnDto.getLjnId());
            Long ljnCount = ljnUserMapper.selectCount(ljnWrapper);
            if (ljnCount > 0) {
                throw new LjnBusinessException(400, "用户名已存在");
            }
            ljnExisting.setLjnUsername(ljnDto.getLjnUsername());
        }

        if (StringUtils.hasText(ljnDto.getLjnPassword())) {
            ljnExisting.setLjnPassword(ljnPasswordEncoder.encode(ljnDto.getLjnPassword()));
        }

        if (StringUtils.hasText(ljnDto.getLjnNickname())) {
            ljnExisting.setLjnNickname(ljnDto.getLjnNickname());
        }

        if (ljnDto.getLjnRole() != null) {
            ljnExisting.setLjnRole(ljnDto.getLjnRole());
        }

        if (ljnDto.getLjnStatus() != null) {
            ljnExisting.setLjnStatus(ljnDto.getLjnStatus());
        }

        ljnUserMapper.updateById(ljnExisting);
        ljnLogger.info("用户信息更新成功: id={}", ljnDto.getLjnId());
    }

    public void ljnDeleteUser(Long ljnId, Long ljnCurrentUserId) {
        if (ljnId.equals(ljnCurrentUserId)) {
            throw new LjnBusinessException(400, "不能删除自己的账号");
        }

        LjnUser ljnUser = ljnUserMapper.selectById(ljnId);
        if (ljnUser == null) {
            throw new LjnBusinessException(404, "用户不存在");
        }

        ljnUserMapper.deleteById(ljnId);
        ljnLogger.info("用户删除成功: id={}", ljnId);
    }

    public void ljnChangePassword(Long ljnUserId, LjnPasswordDto ljnDto) {
        LjnUser ljnUser = ljnUserMapper.selectById(ljnUserId);
        if (ljnUser == null) {
            throw new LjnBusinessException(404, "用户不存在");
        }

        if (!ljnPasswordEncoder.matches(ljnDto.getLjnOldPassword(), ljnUser.getLjnPassword())) {
            throw new LjnBusinessException(400, "旧密码错误");
        }

        ljnUser.setLjnPassword(ljnPasswordEncoder.encode(ljnDto.getLjnNewPassword()));
        ljnUserMapper.updateById(ljnUser);
        ljnLogger.info("用户密码修改成功: id={}", ljnUserId);
    }

    public void ljnUpdateProfile(Long ljnUserId, LjnUserUpdateDto ljnDto) {
        LjnUser ljnUser = ljnUserMapper.selectById(ljnUserId);
        if (ljnUser == null) {
            throw new LjnBusinessException(404, "用户不存在");
        }

        if (StringUtils.hasText(ljnDto.getLjnNickname())) {
            ljnUser.setLjnNickname(ljnDto.getLjnNickname());
        }

        ljnUserMapper.updateById(ljnUser);
        ljnLogger.info("个人信息更新成功: id={}", ljnUserId);
    }
}
