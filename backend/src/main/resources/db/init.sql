SET NAMES utf8mb4;

CREATE DATABASE IF NOT EXISTS ljn_library CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE ljn_library;

-- 用户表
CREATE TABLE IF NOT EXISTS ljn_user (
    ljn_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    ljn_username VARCHAR(50) NOT NULL UNIQUE COMMENT '用户名',
    ljn_password VARCHAR(255) NOT NULL COMMENT '密码',
    ljn_nickname VARCHAR(50) COMMENT '昵称',
    ljn_role INT NOT NULL DEFAULT 1 COMMENT '权限: 0-管理员, 1-普通用户',
    ljn_status INT NOT NULL DEFAULT 1 COMMENT '状态: 0-禁用, 1-启用',
    ljn_create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    ljn_update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- 图书类型表
CREATE TABLE IF NOT EXISTS ljn_book_type (
    ljn_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    ljn_type_name VARCHAR(100) NOT NULL UNIQUE COMMENT '类型名称',
    ljn_description VARCHAR(500) COMMENT '类型描述',
    ljn_sort_order INT DEFAULT 0 COMMENT '排序',
    ljn_create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    ljn_update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='图书类型表';

-- 图书表
CREATE TABLE IF NOT EXISTS ljn_book (
    ljn_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    ljn_book_code VARCHAR(50) UNIQUE COMMENT '图书编号',
    ljn_book_name VARCHAR(200) NOT NULL COMMENT '图书名称',
    ljn_type_id BIGINT NOT NULL COMMENT '图书类型ID',
    ljn_price DECIMAL(10,2) DEFAULT 0.00 COMMENT '图书价格',
    ljn_cover_image VARCHAR(500) COMMENT '封面图片',
    ljn_author VARCHAR(100) COMMENT '作者',
    ljn_publisher VARCHAR(200) COMMENT '出版社',
    ljn_description TEXT COMMENT '图书描述',
    ljn_create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    ljn_update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    CONSTRAINT fk_ljn_book_type FOREIGN KEY (ljn_type_id) REFERENCES ljn_book_type(ljn_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='图书表';

-- 初始化管理员用户 (密码会在应用启动时由DataInitializer重新加密)
INSERT INTO ljn_user (ljn_username, ljn_password, ljn_nickname, ljn_role, ljn_status) VALUES
('admin', '$2a$10$placeholder_will_be_fixed_by_app_init', '系统管理员', 0, 1),
('user', '$2a$10$placeholder_will_be_fixed_by_app_init', '普通用户', 1, 1);

-- 初始化图书类型
INSERT INTO ljn_book_type (ljn_type_name, ljn_description, ljn_sort_order) VALUES
('文学小说', '包含国内外经典文学作品、现代小说等', 1),
('科技计算机', '计算机科学、编程技术、人工智能等', 2),
('历史传记', '历史纪实、人物传记、回忆录等', 3),
('艺术设计', '绘画、摄影、平面设计、建筑艺术等', 4),
('经济管理', '经济学、管理学、市场营销、投资理财等', 5),
('儿童绘本', '适合儿童阅读的绘本、故事书等', 6),
('生活百科', '烹饪、健康、旅行、手工等生活类书籍', 7),
('教育考试', '教材辅导、考试真题、学习方法等', 8);

-- 初始化图书数据
INSERT INTO ljn_book (ljn_book_code, ljn_book_name, ljn_type_id, ljn_price, ljn_cover_image, ljn_author, ljn_publisher, ljn_description) VALUES
('LJN-BK-001', '红楼梦', 1, 68.00, '/covers/cover-001.png', '曹雪芹', '人民文学出版社', '中国古典四大名著之一，以贾宝玉、林黛玉、薛宝钗的爱情婚姻为线索，展现了封建大家族的兴衰史。'),
('LJN-BK-002', '百年孤独', 1, 55.00, '/covers/cover-002.png', '加西亚·马尔克斯', '南海出版公司', '魔幻现实主义代表作，讲述布恩迪亚家族七代人的传奇故事。'),
('LJN-BK-003', '深入理解Java虚拟机', 2, 129.00, '/covers/cover-003.png', '周志明', '机械工业出版社', '全面深入讲解JVM的经典之作，Java开发者必读书籍。'),
('LJN-BK-004', 'Python编程从入门到实践', 2, 89.00, '/covers/cover-004.png', 'Eric Matthes', '人民邮电出版社', '零基础Python入门经典教材，理论与实践结合。'),
('LJN-BK-005', '明朝那些事儿', 3, 198.00, '/covers/cover-005.png', '当年明月', '浙江人民出版社', '以通俗幽默的语言讲述明朝三百年历史，深受读者喜爱。'),
('LJN-BK-006', '设计中的设计', 4, 48.00, '/covers/cover-006.png', '原研哉', '广西师范大学出版社', '日本设计大师原研哉关于设计理念的经典著作。'),
('LJN-BK-007', '经济学原理', 5, 88.00, '/covers/cover-007.png', '曼昆', '北京大学出版社', '全球最受欢迎的经济学入门教材，语言通俗易懂。'),
('LJN-BK-008', '小王子', 6, 32.00, '/covers/cover-008.png', '安托万·德·圣-埃克苏佩里', '人民文学出版社', '一部写给成年人的童话，关于爱与责任的永恒经典。'),
('LJN-BK-009', '活着', 1, 45.00, '/covers/cover-009.png', '余华', '作家出版社', '讲述一个普通人在时代洪流中的悲欢离合，感人至深。'),
('LJN-BK-010', 'Spring Boot实战', 2, 79.00, '/covers/cover-010.png', 'Craig Walls', '人民邮电出版社', 'Spring Boot框架入门与实战指南，适合Java Web开发者。'),
('LJN-BK-011', '三体', 1, 93.00, '/covers/cover-011.png', '刘慈欣', '重庆出版社', '中国科幻文学的里程碑作品，获得雨果奖。'),
('LJN-BK-012', '算法导论', 2, 128.00, '/covers/cover-012.png', 'Thomas H.Cormen', '机械工业出版社', '计算机算法领域的经典教材，全球高校广泛使用。');
