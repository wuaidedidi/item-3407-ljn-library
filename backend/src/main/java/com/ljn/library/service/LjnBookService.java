package com.ljn.library.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.ljn.library.common.LjnPageResult;
import com.ljn.library.dto.LjnBookQueryDto;
import com.ljn.library.entity.LjnBook;
import com.ljn.library.exception.LjnBusinessException;
import com.ljn.library.mapper.LjnBookMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
public class LjnBookService {

    private static final Logger ljnLogger = LoggerFactory.getLogger(LjnBookService.class);

    private final LjnBookMapper ljnBookMapper;

    public LjnBookService(LjnBookMapper ljnBookMapper) {
        this.ljnBookMapper = ljnBookMapper;
    }

    public LjnPageResult<LjnBook> ljnQueryBooks(LjnBookQueryDto ljnQuery) {
        Page<LjnBook> ljnPage = new Page<>(ljnQuery.getLjnPageNum(), ljnQuery.getLjnPageSize());

        IPage<LjnBook> ljnResult = ljnBookMapper.ljnSelectBookPage(
                ljnPage,
                ljnQuery.getLjnBookCode(),
                ljnQuery.getLjnBookName(),
                ljnQuery.getLjnTypeId(),
                ljnQuery.getLjnPriceMin(),
                ljnQuery.getLjnPriceMax()
        );

        return new LjnPageResult<>(ljnResult.getRecords(), ljnResult.getTotal(),
                ljnResult.getSize(), ljnResult.getCurrent());
    }

    public LjnBook ljnGetBookById(Long ljnId) {
        LjnBook ljnBook = ljnBookMapper.selectById(ljnId);
        if (ljnBook == null) {
            throw new LjnBusinessException(404, "图书不存在");
        }
        return ljnBook;
    }

    public void ljnAddBook(LjnBook ljnBook) {
        if (StringUtils.hasText(ljnBook.getLjnBookCode())) {
            LambdaQueryWrapper<LjnBook> ljnWrapper = new LambdaQueryWrapper<>();
            ljnWrapper.eq(LjnBook::getLjnBookCode, ljnBook.getLjnBookCode());
            Long ljnCount = ljnBookMapper.selectCount(ljnWrapper);
            if (ljnCount > 0) {
                throw new LjnBusinessException(400, "图书编号已存在");
            }
        }

        ljnBookMapper.insert(ljnBook);
        ljnLogger.info("图书添加成功: {}", ljnBook.getLjnBookName());
    }

    public void ljnUpdateBook(LjnBook ljnBook) {
        LjnBook ljnExisting = ljnBookMapper.selectById(ljnBook.getLjnId());
        if (ljnExisting == null) {
            throw new LjnBusinessException(404, "图书不存在");
        }

        if (StringUtils.hasText(ljnBook.getLjnBookCode())) {
            LambdaQueryWrapper<LjnBook> ljnWrapper = new LambdaQueryWrapper<>();
            ljnWrapper.eq(LjnBook::getLjnBookCode, ljnBook.getLjnBookCode())
                    .ne(LjnBook::getLjnId, ljnBook.getLjnId());
            Long ljnCount = ljnBookMapper.selectCount(ljnWrapper);
            if (ljnCount > 0) {
                throw new LjnBusinessException(400, "图书编号已存在");
            }
        }

        ljnBookMapper.updateById(ljnBook);
        ljnLogger.info("图书更新成功: id={}", ljnBook.getLjnId());
    }

    public void ljnDeleteBook(Long ljnId) {
        LjnBook ljnBook = ljnBookMapper.selectById(ljnId);
        if (ljnBook == null) {
            throw new LjnBusinessException(404, "图书不存在");
        }

        ljnBookMapper.deleteById(ljnId);
        ljnLogger.info("图书删除成功: id={}", ljnId);
    }
}
