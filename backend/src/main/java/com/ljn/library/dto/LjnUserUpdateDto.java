package com.ljn.library.dto;

import lombok.Data;

@Data
public class LjnUserUpdateDto {

    private Long ljnId;

    private String ljnUsername;

    private String ljnPassword;

    private String ljnNickname;

    private Integer ljnRole;

    private Integer ljnStatus;
}
