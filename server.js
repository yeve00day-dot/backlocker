const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// 정적 파일 서버 (확장프로그램 폴더 자체를 루트로 설정)
// tutorial.html, tutorial.js, tutorial/*.PNG 등을 서빙합니다.
app.use(express.static(path.join(__dirname)));

// 기본 경로 설정
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`-----------------------------------------------`);
    console.log(`Back Button Locker Server is running!`);
    console.log(`Tutorial Page: http://localhost:${PORT}`);
    console.log(`-----------------------------------------------`);
});
