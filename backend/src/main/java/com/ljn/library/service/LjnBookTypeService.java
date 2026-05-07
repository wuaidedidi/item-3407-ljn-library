package com.ljn.library.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.ljn.library.common.LjnPageResult;
import com.ljn.library.entity.LjnBook;
import com.ljn.library.entity.LjnBookType;
import com.ljn.library.exception.LjnBusinessException;
import com.ljn.library.mapper.LjnBookMapper;
import com.ljn.library.mapper.LjnBookTypeMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;

@Service
public class LjnBookTypeService {

    private static final Logger ljnLogger = LoggerFactory.getLogger(LjnBookTypeService.class);

    private final LjnBookTypeMapper ljnBookTypeMapper;
    private final LjnBookMapper ljnBookMapper;

    public LjnBookTypeService(LjnBookTypeMapper ljnBookTypeMapper, LjnBookMapper ljnBookMapper) {
        this.ljnBookTypeMapper = ljnBookTypeMapper;
        this.ljnBookMapper = ljnBookMapper;
    }

    public List<LjnBookType> ljnGetAllTypes() {
        LambdaQueryWrapper<LjnBookType> ljnWrapper = new LambdaQueryWrapper<>();
        ljnWrapper.orderByAsc(LjnBookType::getLjnSortOrder);
        return ljnBookTypeMapper.selectList(ljnWrapper);
    }

    public LjnPageResult<LjnBookType> ljnGetTypePage(Integer ljnPageNum, Integer ljnPageSize, String ljnKeyword) {
        Page<LjnBookType> ljnPage = new Page<>(ljnPageNum, ljnPageSize);
        LambdaQueryWrapper<LjnBookType> ljnWrapper = new LambdaQueryWrapper<>();

        if (StringUtils.hasText(ljnKeyword)) {
            ljnWrapper.like(LjnBookType::getLjnTypeName, ljnKeyword);
        }

        ljnWrapper.orderByAsc(LjnBookType::getLjnSortOrder);
        IPage<LjnBookType> ljnResult = ljnBookTypeMapper.selectPage(ljnPage, ljnWrapper);

        return new LjnPageResult<>(ljnResult.getRecords(), ljnResult.getTotal(),
                ljnResult.getSize(), ljnResult.getCurrent());
    }

    public LjnBookType ljnGetTypeById(Long ljnId) {
        LjnBookType ljnType = ljnBookTypeMapper.selectById(ljnId);
        if (ljnType == null) {
            throw new LjnBusinessException(404, "图书类型不存在");
        }
        return ljnType;
    }

    public void ljnAddType(LjnBookType ljnBookType) {
        LambdaQueryWrapper<LjnBookType> ljnWrapper = new LambdaQueryWrapper<>();
        ljnWrapper.eq(LjnBookType::getLjnTypeName, ljnBookType.getLjnTypeName());
        Long ljnCount = ljnBookTypeMapper.selectCount(ljnWrapper);

        if (ljnCount > 0) {
            throw new LjnBusinessException(400, "该图书类型名称已存在");
        }

        ljnBookTypeMapper.insert(ljnBookType);
        ljnLogger.info("图书类型添加成功: {}", ljnBookType.getLjnTypeName());
    }

    public void ljnUpdateType(LjnBookType ljnBookType) {
        LjnBookType ljnExisting = ljnBookTypeMapper.selectById(ljnBookType.getLjnId());
        if (ljnExisting == null) {
            throw new LjnBusinessException(404, "图书类型不存在");
        }

        LambdaQueryWrapper<LjnBookType> ljnWrapper = new LambdaQueryWrapper<>();
        ljnWrapper.eq(LjnBookType::getLjnTypeName, ljnBookType.getLjnTypeName())
                .ne(LjnBookType::getLjnId, ljnBookType.getLjnId());
        Long ljnCount = ljnBookTypeMapper.selectCount(ljnWrapper);

        if (ljnCount > 0) {
            throw new LjnBusinessException(400, "该图书类型名称已存在");
        }

        ljnBookTypeMapper.updateById(ljnBookType);
        ljnLogger.info("图书类型更新成功: id={}", ljnBookType.getLjnId());
    }

    public void ljnDeleteType(Long ljnId) {
        LjnBookType ljnType = ljnBookTypeMapper.selectById(ljnId);
        if (ljnType == null) {
            throw new LjnBusinessException(404, "图书类型不存在");
        }

        LambdaQueryWrapper<LjnBook> ljnBookWrapper = new LambdaQueryWrapper<>();
        ljnBookWrapper.eq(LjnBook::getLjnTypeId, ljnId);
        Long ljnBookCount = ljnBookMapper.selectCount(ljnBookWrapper);

        if (ljnBookCount > 0) {
            throw new LjnBusinessException(400, "该类型下有 " + ljnBookCount + " 本图书，无法删除");
        }

        ljnBookTypeMapper.deleteById(ljnId);
        ljnLogger.info("图书类型删除成功: id={}", ljnId);
    }
}
