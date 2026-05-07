package com.ljn.library.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("ljn_book_type")
public class LjnBookType {

    @TableId(type = IdType.AUTO)
    private Long ljnId;

    private String ljnTypeName;

    private String ljnDescription;

    private Integer ljnSortOrder;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime ljnCreateTime;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime ljnUpdateTime;
}
