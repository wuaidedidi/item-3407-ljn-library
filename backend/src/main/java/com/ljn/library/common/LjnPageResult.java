package com.ljn.library.common;

import lombok.Data;
import java.util.List;

@Data
public class LjnPageResult<T> {

    private List<T> ljnRecords;
    private long ljnTotal;
    private long ljnSize;
    private long ljnCurrent;
    private long ljnPages;

    public LjnPageResult(List<T> ljnRecords, long ljnTotal, long ljnSize, long ljnCurrent) {
        this.ljnRecords = ljnRecords;
        this.ljnTotal = ljnTotal;
        this.ljnSize = ljnSize;
        this.ljnCurrent = ljnCurrent;
        this.ljnPages = (ljnTotal + ljnSize - 1) / ljnSize;
    }
}
