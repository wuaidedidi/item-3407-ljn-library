package com.ljn.library.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class LjnBookQueryDto {

    private String ljnBookCode;

    private String ljnBookName;

    private Long ljnTypeId;

    private BigDecimal ljnPriceMin;

    private BigDecimal ljnPriceMax;

    private Integer ljnPageNum = 1;

    private Integer ljnPageSize = 10;
}
