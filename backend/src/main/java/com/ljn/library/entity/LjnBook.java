package com.ljn.library.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@TableName("ljn_book")
public class LjnBook {

    @TableId(type = IdType.AUTO)
    private Long ljnId;

    private String ljnBookCode;

    private String ljnBookName;

    private Long ljnTypeId;

    @TableField(exist = false)
    private String ljnTypeName;

    private BigDecimal ljnPrice;

    private String ljnCoverImage;

    private String ljnAuthor;

    private String ljnPublisher;

    private String ljnDescription;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime ljnCreateTime;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime ljnUpdateTime;
}
