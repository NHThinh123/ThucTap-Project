# ThucTap-Project: Web Chia Sẻ Video

Ứng dụng web chia sẻ video sử dụng **MERN stack** (MongoDB, Express.js, React, Node.js), tích hợp hệ thống lọc cộng tác (collaborative filtering) bằng Python, xử lý video với FFmpeg, lưu trữ trên Cloudinary, và bộ nhớ đệm với Upstash Redis.

## Mô tả dự án

- **Frontend**: Giao diện người dùng được xây dựng bằng React (`Frontend`) với Vite.
- **Backend**: API được xây dựng bằng Node.js/Express (`Backend`), kết nối với MongoDB Atlas, Cloudinary, và Upstash Redis.
- **Python**: Hệ thống lọc cộng tác để đề xuất video, sử dụng `scikit-surprise` (`Backend`).
- **FFmpeg**: Xử lý video (chuyển mã, cắt ghép) trong backend.

## Yêu cầu hệ thống

- Hệ điều hành: Windows 10/11.
- Phần mềm:
  - Node.js (v18.x hoặc cao hơn).
  - MongoDB Community Server (v6.x hoặc MongoDB Atlas).
  - Python (v3.11.9).
  - FFmpeg (build `ffmpeg-release-full`).
  - Git (tùy chọn, để clone kho lưu trữ).
- Công cụ bổ sung: Microsoft Visual C++ Build Tools (cho Python).
- Dịch vụ bên ngoài:
  - [Cloudinary](https://cloudinary.com) (lưu trữ video/hình ảnh).
  - [Upstash Redis](https://upstash.com) (bộ nhớ đệm).
- Dung lượng ổ đĩa: Tối thiểu 2GB.
- RAM: Tối thiểu 4GB.

## Cài đặt

### Bước 1: Sao chép dự án

1. Clone kho lưu trữ từ GitHub:
   ```bash
   git clone https://github.com/NHThinh123/ThucTap-Project.git
   cd ThucTap-Project
   ```
2. Nếu không dùng Git, tải file ZIP từ GitHub và giải nén.

### Bước 2: Cài đặt Node.js và npm

1. Tải và cài đặt Node.js (LTS, v18.x hoặc cao hơn) từ [nodejs.org](https://nodejs.org).
2. Kiểm tra cài đặt:
   ```bash
   node -v
   npm -v
   ```

### Bước 3: Cài đặt MongoDB

1. Tùy chọn 1: Sử dụng MongoDB Atlas (khuyến nghị, vì dự án dùng `mongodb+srv`):
   - Tạo tài khoản tại [mongodb.com](https://www.mongodb.com).
   - Tạo cluster và lấy `MONGO_URI` từ dashboard.
2. Tùy chọn 2: Cài MongoDB Community Server local:
   - Tải từ [mongodb.com](https://www.mongodb.com/try/download/community).
   - Chạy MongoDB:
     ```bash
     mongod
     ```
3. (Tùy chọn) Cài MongoDB Compass để quản lý cơ sở dữ liệu.

### Bước 4: Cài đặt Python

1. Tải Python v3.11.9 từ [python.org](https://www.python.org/ftp/python/3.11.9/python-3.11.9-amd64.exe).
2. Đảm bảo chọn tùy chọn **Add Python to PATH** trong trình cài đặt.
3. Kiểm tra:
   ```bash
   python --version
   pip --version
   ```

### Bước 5: Cài đặt FFmpeg

1. Tải FFmpeg (build `ffmpeg-release-full`) từ [gyan.dev](https://www.gyan.dev/ffmpeg/builds/).
2. Giải nén file và thêm thư mục `bin` vào biến môi trường PATH:
   - Mở **Control Panel > System > Advanced system settings > Environment Variables**.
   - Trong **System Variables**, tìm **Path**, thêm đường dẫn (ví dụ: `C:\ffmpeg\bin`).
3. Kiểm tra:
   ```bash
   ffmpeg -version
   ```

### Bước 6: Cài đặt Dependencies

#### a. Backend (Node.js/Express)

1. Di chuyển vào thư mục `Backend`:
   ```bash
   cd Backend
   npm install
   ```
2. Đảm bảo thư viện `fluent-ffmpeg` được cài đặt:
   ```bash
   npm install fluent-ffmpeg
   ```
3. Tạo file `.env` trong thư mục `Backend` dựa trên `.env.example`:
   ```
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/video_sharing
   BASE_URL=http://localhost:3000
   UPLOAD_PATH=./Uploads
   AUTH_EMAIL=your-email@example.com
   AUTH_PASS=your-email-password
   JWT_SECRET=your-jwt-secret
   JWT_REFRESH_SECRET=your-jwt-refresh-secret
   CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
   CLOUDINARY_API_KEY=your-cloudinary-api-key
   CLOUDINARY_API_SECRET=your-cloudinary-api-secret
   UPSTASH_REDIS_REST_URL=your-upstash-redis-url
   UPSTASH_REDIS_REST_TOKEN=your-upstash-redis-token
   ```
   - Thay các giá trị `your-...` bằng thông tin thật từ tài khoản Cloudinary, Upstash Redis, và email của bạn.
   - Nếu dùng MongoDB Atlas, thay `MONGO_URI` bằng URI từ dashboard.

#### b. Frontend (React)

1. Di chuyển vào thư mục `Frontend`:
   ```bash
   cd Frontend
   npm install
   ```
2. Tạo file `.env` trong thư mục `Frontend`:
   ```
   VITE_API_URL=http://localhost:3000
   ```
   - Lưu ý: Vì frontend dùng Vite (cổng `5173`), biến môi trường bắt đầu bằng `VITE_`.

#### c. Python (Lọc cộng tác)

1. Di chuyển vào thư mục `Backend`:
   ```bash
   cd Backend
   ```
2. Tạo môi trường ảo (khuyến nghị):
   ```bash
   python -m venv venv
   .\venv\Scripts\activate
   ```
3. Cài đặt các thư viện Python:
   ```bash
   pip install -r requirements.txt
   ```
4. Nội dung file `requirements.txt` (tạo trong thư mục `Backend`):
   ```
   pandas==2.2.3
   numpy==1.26.4
   scikit-learn==1.6.1
   scipy==1.15.3
   scikit-surprise==1.1.4
   flask==3.0.3
   ```

### Bước 7: Cài đặt bổ sung cho Python

Một số thư viện (`scipy`, `scikit-surprise`) yêu cầu công cụ xây dựng trên Windows:

1. **Cài đặt Microsoft Visual C++ Build Tools**:
   - Tải từ [visualstudio.microsoft.com](https://visualstudio.microsoft.com/visual-cpp-build-tools/).
   - Chọn **Desktop development with C++** trong trình cài đặt.
2. Cập nhật pip:
   ```bash
   pip install --upgrade pip
   ```
3. Cài đặt `wheel` (nếu gặp lỗi với `scipy` hoặc `scikit-surprise`):
   ```bash
   pip install wheel
   ```

### Bước 8: Khởi tạo dữ liệu (nếu cần)

- Nếu dự án yêu cầu dữ liệu mẫu (video, người dùng, đánh giá):
  1. Kiểm tra thư mục `Backend` để tìm script khởi tạo (ví dụ: `init-db.js` hoặc `ratings.csv`).
  2. Chạy script khởi tạo cơ sở dữ liệu:
     ```bash
     mongo video_sharing init-db.js
     ```
     - Nếu dùng MongoDB Atlas, sử dụng MongoDB Compass hoặc lệnh `mongo` với URI.
  3. Import dữ liệu cho lọc cộng tác:
     ```bash
     cd Backend
     python import_data.py
     ```
     - Đảm bảo file dữ liệu (ví dụ: `ratings.csv`) có định dạng: `user_id`, `item_id`, `rating`.

### Bước 9: Chạy dự án

1. **Khởi động MongoDB**:

   - Nếu dùng local:
     ```bash
     mongod
     ```
   - Nếu dùng MongoDB Atlas, bỏ qua bước này.

2. **Chạy backend**:

   ```bash
   cd Backend
   npm run dev
   ```

3. **Chạy frontend**:

   ```bash
   cd Frontend
   npm run dev
   ```

   - Ứng dụng sẽ mở trên `http://localhost:5173`.

4. **Chạy Python (lọc cộng tác)**:

   - Nếu dùng Flask API:
     ```bash
     cd Backend
     python app.py
     ```
     - API chạy trên `http://localhost:5001`.
   - Nếu dùng script độc lập:
     ```bash
     cd Backend
     python recommendation_engine.py
     ```

5. **Kiểm tra FFmpeg**:
   - Gọi API xử lý video (nếu có) bằng Postman hoặc curl:
     ```bash
     curl http://localhost:3000/api/videos
     ```

### Bước 10: Xử lý lỗi phổ biến

- **MongoDB**:
  - "Connection refused": Kiểm tra `mongod` đang chạy hoặc `MONGO_URI` đúng.
- **Node.js**:
  - "Module not found": Chạy lại `npm install` trong `Backend` hoặc `Frontend`.
  - Lỗi CORS: Đảm bảo backend đã bật CORS hoặc proxy trong `Frontend/vite.config.js`.
- **Python**:
  - "Module not found": Cài lại dependencies bằng `pip install -r requirements.txt`.
  - Lỗi biên dịch: Cài Microsoft Visual C++ Build Tools.
  - Cổng xung đột: Đảm bảo cổng 5001 (Python) không bị chiếm dụng.
- **FFmpeg**:
  - "ffmpeg is not recognized": Kiểm tra PATH hoặc cài lại FFmpeg.
  - Lỗi định dạng video: Đảm bảo video đầu vào là MP4, AVI, hoặc định dạng tương thích.
- **Cloudinary/Upstash**:
  - Lỗi kết nối: Kiểm tra thông tin trong `.env` (Cloudinary, Upstash Redis).

### Bước 11: Kiểm tra toàn bộ hệ thống

1. Mở trình duyệt và truy cập `http://localhost:5173` để kiểm tra frontend.
2. Gọi API backend (ví dụ: `http://localhost:3000/api/videos`) để kiểm tra kết nối.
3. Gọi API Python (nếu có, ví dụ: `http://localhost:5001/recommend?user_id=1`) để kiểm tra đề xuất.

### Lưu ý triển khai

- **Bảo mật**: Không đẩy file `.env` lên GitHub. Sử dụng `.env.example` để hướng dẫn cấu hình.
- **Dữ liệu mẫu**: Cung cấp file `ratings.csv` hoặc `init-db.js` nếu cần.
- **Triển khai server**: Nếu triển khai trên server (không phải local), cài `gunicorn` cho Python:
  ```bash
  pip install gunicorn
  gunicorn -w 4 app:app
  ```

### Liên hệ

Nếu gặp vấn đề, liên hệ qua email: <your-email@example.com>.
