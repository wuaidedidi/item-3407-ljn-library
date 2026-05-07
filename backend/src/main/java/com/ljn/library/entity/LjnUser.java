package com.ljn.library.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("ljn_user")
public class LjnUser {

    @TableId(type = IdType.AUTO)
    private Long ljnId;

    private String ljnUsername;

    private String ljnPassword;

    private String ljnNickname;

    private Integer ljnRole;

    private Integer ljnStatus;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime ljnCreateTime;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime ljnUpdateTime;
}
