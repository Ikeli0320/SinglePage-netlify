// 等待整個網頁內容都載入完成後再執行
document.addEventListener('DOMContentLoaded', function () {

    // --- 搜尋表單功能 ---
    const searchForm = document.querySelector('.search-form');

    if (searchForm) {
        // 監聽表單的 "submit" (提交) 事件
        searchForm.addEventListener('submit', function (event) {
            // 1. 防止表單的預設送出行為 (避免頁面重新整理)
            event.preventDefault();

            // 2. 獲取輸入框的DOM元素和使用者輸入的值
            const searchInput = document.querySelector('.search-form input[type="text"]');
            const query = searchInput.value.trim(); // .trim()可以移除頭尾的空白

            // 3. 檢查使用者是否有輸入內容
            if (query) {
                // 如果有輸入，顯示一個提示訊息，並模擬跳轉到搜尋結果頁
                alert('您正在搜尋關鍵字："' + query + '"\n\n(此為範例功能，將為您導向首頁)');
                // 在真實的網站中，這裡會跳轉到一個搜尋結果頁面
                // window.location.href = '/search-results.html?q=' + encodeURIComponent(query);
                window.location.href = 'index.html'; // 範例中先跳回首頁
            } else {
                // 如果沒有輸入，提示使用者
                alert('請輸入您想搜尋的關鍵字！');
            }
        });
    }


    // --- 物件詳細頁面：縮圖點擊功能 ---
    const gallery = document.querySelector('.image-gallery');
    if (gallery) {
        const mainImage = gallery.querySelector('.main-image img');
        const thumbnails = gallery.querySelectorAll('.thumbnail-images img');

        thumbnails.forEach(function (thumbnail) {
            thumbnail.addEventListener('click', function () {
                // 當縮圖被點擊時，將主圖的 src 換成這張縮圖的大圖 src
                // 為了更好的畫質，我們假設大圖和小圖的 URL 有規律
                // 這裡我們用一個簡單的替換來模擬，實際應用中 URL 可能不同
                let highResSrc = this.src.replace('&w=400', '&w=1260&h=750&dpr=2');
                mainImage.src = highResSrc;
                mainImage.alt = this.alt;

                // 移除所有縮圖的 'active' class
                thumbnails.forEach(t => t.classList.remove('active'));
                // 再為被點擊的縮圖加上 'active' class
                this.classList.add('active');
            });
        });
    }
});