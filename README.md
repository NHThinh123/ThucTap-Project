ThucTap-Project: Web Chia Sẻ Video
Ứng dụng web chia sẻ video sử dụng MERN stack (MongoDB, Express.js, React, Node.js), tích hợp hệ thống lọc cộng tác (collaborative filtering) bằng Python, xử lý video với FFmpeg, lưu trữ trên Cloudinary, và bộ nhớ đệm với Upstash Redis.
Mô tả dự án

Frontend: Giao diện người dùng được xây dựng bằng React (Frontend) với Vite.
Backend: API được xây dựng bằng Node.js/Express (Backend), kết nối với MongoDB Atlas, Cloudinary, và Upstash Redis.
Python: Hệ thống lọc cộng tác để đề xuất video, sử dụng scikit-surprise (Backend).
FFmpeg: Xử lý video (chuyển mã, cắt ghép) trong backend.

Yêu cầu hệ thống

Hệ điều hành: Windows 10/11.
Phần mềm:
Node.js (v18.x hoặc cao hơn).
MongoDB Community Server (v6.x hoặc MongoDB Atlas).
Python (v3.11.9).
FFmpeg (build ffmpeg-release-full).
Git (tùy chọn, để clone kho lưu trữ).

Công cụ bổ sung: Microsoft Visual C++ Build Tools (cho Python).
Dịch vụ bên ngoài:
Cloudinary (lưu trữ video/hình ảnh).
Upstash Redis (bộ nhớ đệm).

Dung lượng ổ đĩa: Tối thiểu 2GB.
RAM: Tối thiểu 4GB.

Cài đặt
Bước 1: Sao chép dự án

Clone kho lưu trữ từ GitHub:git clone https://github.com/NHThinh123/ThucTap-Project.git
cd ThucTap-Project

Nếu không dùng Git, tải file ZIP từ GitHub và giải nén.

Bước 2: Cài đặt Node.js và npm

Tải và cài đặt Node.js (LTS, v18.x hoặc cao hơn) từ nodejs.org.
Kiểm tra cài đặt:node -v
npm -v

Bước 3: Cài đặt MongoDB

Tùy chọn 1: Sử dụng MongoDB Atlas (khuyến nghị, vì dự án dùng mongodb+srv):
Tạo tài khoản tại mongodb.com.
Tạo cluster và lấy MONGO_URI từ dashboard.

Tùy chọn 2: Cài MongoDB Community Server local:
Tải từ mongodb.com.
Chạy MongoDB:mongod

(Tùy chọn) Cài MongoDB Compass để quản lý cơ sở dữ liệu.

Bước 4: Cài đặt Python

Tải Python v3.11.9 từ python.org.
Đảm bảo chọn tùy chọn Add Python to PATH trong trình cài đặt.
Kiểm tra:python --version
pip --version

Bước 5: Cài đặt FFmpeg

Tải FFmpeg (build ffmpeg-release-full) từ gyan.dev.
Giải nén file và thêm thư mục bin vào biến môi trường PATH:
Mở Control Panel > System > Advanced system settings > Environment Variables.
Trong System Variables, tìm Path, thêm đường dẫn (ví dụ: C:\ffmpeg\bin).

Kiểm tra:ffmpeg -version

Bước 6: Cài đặt Dependencies
a. Backend (Node.js/Express)

Di chuyển vào thư mục Backend:cd Backend
npm install

Đảm bảo thư viện fluent-ffmpeg được cài đặt:npm install fluent-ffmpeg

Tạo file .env trong thư mục Backend dựa trên .env.example:PORT=3000
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

Thay các giá trị your-... bằng thông tin thật từ tài khoản Cloudinary, Upstash Redis, và email của bạn.
Nếu dùng MongoDB Atlas, thay MONGO_URI bằng URI từ dashboard.

b. Frontend (React)

Di chuyển vào thư mục Frontend:cd Frontend
npm install

Tạo file .env trong thư mục Frontend:VITE_API_URL=http://localhost:3000

Lưu ý: Vì frontend dùng Vite (cổng 5173), biến môi trường bắt đầu bằng VITE\_.

c. Python (Lọc cộng tác)

Di chuyển vào thư mục Backend:cd Backend

Tạo môi trường ảo (khuyến nghị):python -m venv venv
.\venv\Scripts\activate

Cài đặt các thư viện Python:pip install -r requirements.txt

Nội dung file requirements.txt (tạo trong thư mục Backend):pandas==2.2.3
numpy==1.26.4
scikit-learn==1.6.1
scipy==1.15.3
scikit-surprise==1.1.4
flask==3.0.3

Bước 7: Cài đặt bổ sung cho Python
Một số thư viện (scipy, scikit-surprise) yêu cầu công cụ xây dựng trên Windows:

Cài đặt Microsoft Visual C++ Build Tools:
Tải từ visualstudio.microsoft.com.
Chọn Desktop development with C++ trong trình cài đặt.

Cập nhật pip:pip install --upgrade pip

Cài đặt wheel (nếu gặp lỗi với scipy hoặc scikit-surprise):pip install wheel

Bước 8: Khởi tạo dữ liệu (nếu cần)

Nếu dự án yêu cầu dữ liệu mẫu (video, người dùng, đánh giá):
Kiểm tra thư mục Backend để tìm script khởi tạo (ví dụ: init-db.js hoặc ratings.csv).
Chạy script khởi tạo cơ sở dữ liệu:mongo video_sharing init-db.js

Nếu dùng MongoDB Atlas, sử dụng MongoDB Compass hoặc lệnh mongo với URI.

Import dữ liệu cho lọc cộng tác:cd Backend
python import_data.py

Đảm bảo file dữ liệu (ví dụ: ratings.csv) có định dạng: user_id, item_id, rating.

Bước 9: Chạy dự án

Khởi động MongoDB:

Nếu dùng local:mongod

Nếu dùng MongoDB Atlas, bỏ qua bước này.

Chạy backend:
cd Backend
npm run dev

Chạy frontend:
cd Frontend
npm run dev

Ứng dụng sẽ mở trên http://localhost:5173.

Chạy Python (lọc cộng tác):

Nếu dùng Flask API:cd Backend
python app.py

API chạy trên http://localhost:5001.

Nếu dùng script độc lập:cd Backend
python recommendation_engine.py

Kiểm tra FFmpeg:

Gọi API xử lý video (nếu có) bằng Postman hoặc curl:curl http://localhost:3000/api/videos

Bước 10: Xử lý lỗi phổ biến

MongoDB:
"Connection refused": Kiểm tra mongod đang chạy hoặc MONGO_URI đúng.

Node.js:
"Module not found": Chạy lại npm install trong Backend hoặc Frontend.
Lỗi CORS: Đảm bảo backend đã bật CORS hoặc proxy trong Frontend/vite.config.js.

Python:
"Module not found": Cài lại dependencies bằng pip install -r requirements.txt.
Lỗi biên dịch: Cài Microsoft Visual C++ Build Tools.
Cổng xung đột: Đảm bảo cổng 5001 (Python) không bị chiếm dụng.

FFmpeg:
"ffmpeg is not recognized": Kiểm tra PATH hoặc cài lại FFmpeg.
Lỗi định dạng video: Đảm bảo video đầu vào là MP4, AVI, hoặc định dạng tương thích.

Cloudinary/Upstash:
Lỗi kết nối: Kiểm tra thông tin trong .env (Cloudinary, Upstash Redis).

Bước 11: Kiểm tra toàn bộ hệ thống

Mở trình duyệt và truy cập http://localhost:5173 để kiểm tra frontend.
Gọi API backend (ví dụ: http://localhost:3000/api/videos) để kiểm tra kết nối.
Gọi API Python (nếu có, ví dụ: http://localhost:5001/recommend?user_id=1) để kiểm tra đề xuất.

Lưu ý triển khai

Bảo mật: Không đẩy file .env lên GitHub. Sử dụng .env.example để hướng dẫn cấu hình.
Dữ liệu mẫu: Cung cấp file ratings.csv hoặc init-db.js nếu cần.
Triển khai server: Nếu triển khai trên server (không phải local), cài gunicorn cho Python:pip install gunicorn
gunicorn -w 4 app:app

Liên hệ
Nếu gặp vấn đề, liên hệ qua email: your-email@example.com.
