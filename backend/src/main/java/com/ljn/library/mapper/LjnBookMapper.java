package com.ljn.library.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.ljn.library.entity.LjnBook;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface LjnBookMapper extends BaseMapper<LjnBook> {

    @Select("<script>" +
            "SELECT b.*, t.ljn_type_name FROM ljn_book b " +
            "LEFT JOIN ljn_book_type t ON b.ljn_type_id = t.ljn_id " +
            "<where>" +
            "  <if test='bookCode != null and bookCode != \"\"'> AND b.ljn_book_code LIKE CONCAT('%', #{bookCode}, '%')</if>" +
            "  <if test='bookName != null and bookName != \"\"'> AND b.ljn_book_name LIKE CONCAT('%', #{bookName}, '%')</if>" +
            "  <if test='typeId != null'> AND b.ljn_type_id = #{typeId}</if>" +
            "  <if test='priceMin != null'> AND b.ljn_price &gt;= #{priceMin}</if>" +
            "  <if test='priceMax != null'> AND b.ljn_price &lt;= #{priceMax}</if>" +
            "</where>" +
            " ORDER BY b.ljn_create_time DESC" +
            "</script>")
    IPage<LjnBook> ljnSelectBookPage(Page<LjnBook> page,
                                      @Param("bookCode") String bookCode,
                                      @Param("bookName") String bookName,
                                      @Param("typeId") Long typeId,
                                      @Param("priceMin") java.math.BigDecimal priceMin,
                                      @Param("priceMax") java.math.BigDecimal priceMax);
}
