package com.ljn.library.controller;

import com.ljn.library.common.LjnPageResult;
import com.ljn.library.common.LjnResult;
import com.ljn.library.entity.LjnBookType;
import com.ljn.library.service.LjnBookTypeService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ljn/book-types")
public class LjnBookTypeController {

    private final LjnBookTypeService ljnBookTypeService;

    public LjnBookTypeController(LjnBookTypeService ljnBookTypeService) {
        this.ljnBookTypeService = ljnBookTypeService;
    }

    @GetMapping("/all")
    public LjnResult<List<LjnBookType>> ljnGetAllTypes() {
        List<LjnBookType> ljnTypes = ljnBookTypeService.ljnGetAllTypes();
        return LjnResult.success(ljnTypes);
    }

    @GetMapping
    public LjnResult<LjnPageResult<LjnBookType>> ljnGetTypePage(
            @RequestParam(defaultValue = "1") Integer ljnPageNum,
            @RequestParam(defaultValue = "10") Integer ljnPageSize,
            @RequestParam(required = false) String ljnKeyword) {
        LjnPageResult<LjnBookType> ljnResult = ljnBookTypeService.ljnGetTypePage(ljnPageNum, ljnPageSize, ljnKeyword);
        return LjnResult.success(ljnResult);
    }

    @GetMapping("/{ljnId}")
    public LjnResult<LjnBookType> ljnGetTypeById(@PathVariable Long ljnId) {
        LjnBookType ljnType = ljnBookTypeService.ljnGetTypeById(ljnId);
        return LjnResult.success(ljnType);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public LjnResult<Void> ljnAddType(@RequestBody LjnBookType ljnBookType) {
        ljnBookTypeService.ljnAddType(ljnBookType);
        return LjnResult.success("图书类型添加成功", null);
    }

    @PutMapping("/{ljnId}")
    @PreAuthorize("hasRole('ADMIN')")
    public LjnResult<Void> ljnUpdateType(@PathVariable Long ljnId, @RequestBody LjnBookType ljnBookType) {
        ljnBookType.setLjnId(ljnId);
        ljnBookTypeService.ljnUpdateType(ljnBookType);
        return LjnResult.success("图书类型更新成功", null);
    }

    @DeleteMapping("/{ljnId}")
    @PreAuthorize("hasRole('ADMIN')")
    public LjnResult<Void> ljnDeleteType(@PathVariable Long ljnId) {
        ljnBookTypeService.ljnDeleteType(ljnId);
        return LjnResult.success("图书类型删除成功", null);
    }
}
