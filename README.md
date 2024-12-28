# Exam Room Management App (App quản lí phòng thi)

## Mô tả
- Một app quản lí sở phòng thi đơn giản.

## Chức năng: 
- Tạo các phòng thi, sơ đồ thí sinh.
- Đặt mật khẩu cho các phòng thi.
- In ra danh sách các phòng thi.
- Phát thông báo khi đến một mốc thời gian nào đó trong khi thi.
- Hiện hình ảnh của học sinh và số báo danh.
- Đánh vắng học sinh.
- SO DO TONG chứa thông tin tất cả các phòng thi.
- Có thanh thời gian chạy theo thời gian thực.  
...

## Tech stack
- Ngôn ngữ lập trình: JS
- front-end: HTML, CSS, JS
- back-end: NodeJS (ExpressJS)

## Cách chạy 
-- Tải nodejs
### 1. Setup
- Đặt repo vào ổ đĩa D
- Chạy `npm install –global http-server`
### 2. Chạy server bên front-end (có đến tận 2 server vì lúc code tôi bị ngu)
- `Chạy `http-server`
- Lúc này dưới dòng "Available on: " có 2 URL, vào 1 trong 2 URL đó.
- Trên màn hình hiện một cây thư mục, nhấp vào `client`
- Vào 1 trong 2 folder được hiện.
- Mở file `.html` trong folder đó.
- Giao diện tạo phòng thi hiện ra.

### 3. Chạy server
- `cd` vào folder `/server`
- Chạy `node node.js`
- Hiện ra "Server is running on ..." thì bạn đã thành công.
- Xem hướng dẫn sử dụng hoặc tự mò.