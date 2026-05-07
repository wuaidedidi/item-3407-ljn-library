package com.ljn.library.controller;

import com.ljn.library.common.LjnPageResult;
import com.ljn.library.common.LjnResult;
import com.ljn.library.dto.LjnBookQueryDto;
import com.ljn.library.entity.LjnBook;
import com.ljn.library.service.LjnBookService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ljn/books")
public class LjnBookController {

    private final LjnBookService ljnBookService;

    public LjnBookController(LjnBookService ljnBookService) {
        this.ljnBookService = ljnBookService;
    }

    @GetMapping
    public LjnResult<LjnPageResult<LjnBook>> ljnQueryBooks(LjnBookQueryDto ljnQuery) {
        LjnPageResult<LjnBook> ljnResult = ljnBookService.ljnQueryBooks(ljnQuery);
        return LjnResult.success(ljnResult);
    }

    @GetMapping("/{ljnId}")
    public LjnResult<LjnBook> ljnGetBookById(@PathVariable Long ljnId) {
        LjnBook ljnBook = ljnBookService.ljnGetBookById(ljnId);
        return LjnResult.success(ljnBook);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public LjnResult<Void> ljnAddBook(@RequestBody LjnBook ljnBook) {
        ljnBookService.ljnAddBook(ljnBook);
        return LjnResult.success("图书添加成功", null);
    }

    @PutMapping("/{ljnId}")
    @PreAuthorize("hasRole('ADMIN')")
    public LjnResult<Void> ljnUpdateBook(@PathVariable Long ljnId, @RequestBody LjnBook ljnBook) {
        ljnBook.setLjnId(ljnId);
        ljnBookService.ljnUpdateBook(ljnBook);
        return LjnResult.success("图书更新成功", null);
    }

    @DeleteMapping("/{ljnId}")
    @PreAuthorize("hasRole('ADMIN')")
    public LjnResult<Void> ljnDeleteBook(@PathVariable Long ljnId) {
        ljnBookService.ljnDeleteBook(ljnId);
        return LjnResult.success("图书删除成功", null);
    }
}
