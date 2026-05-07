package com.ljn.library.dto;

import lombok.Data;
import javax.validation.constraints.NotBlank;

@Data
public class LjnLoginDto {

    @NotBlank(message = "用户名不能为空")
    private String ljnUsername;

    @NotBlank(message = "密码不能为空")
    private String ljnPassword;
}
