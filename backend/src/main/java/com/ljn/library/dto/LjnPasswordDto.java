package com.ljn.library.dto;

import lombok.Data;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@Data
public class LjnPasswordDto {

    @NotBlank(message = "旧密码不能为空")
    private String ljnOldPassword;

    @NotBlank(message = "新密码不能为空")
    @Size(min = 6, max = 20, message = "密码长度必须在6-20之间")
    private String ljnNewPassword;
}
