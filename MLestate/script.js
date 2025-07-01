// 等待整個網頁內容都載入完成後再執行
document.addEventListener('DOMContentLoaded', function () {

    // --- 平滑滾動功能 ---
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
    smoothScrollLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // --- 首頁搜尋表單功能 ---
    const searchForm = document.querySelector('.search-form');
    if (searchForm) {
        const searchButton = searchForm.querySelector('.search-button');

        if (searchButton) {
            searchButton.addEventListener('click', function (e) {
                e.preventDefault();

                // 獲取所有搜尋條件
                const searchInputs = searchForm.querySelectorAll('.search-input');
                const searchCriteria = {};

                searchInputs.forEach(input => {
                    if (input.value) {
                        searchCriteria[input.name || input.placeholder] = input.value;
                    }
                });

                // 檢查是否有選擇任何條件
                if (Object.keys(searchCriteria).length === 0) {
                    alert('請至少選擇一個搜尋條件！');
                    return;
                }

                // 顯示搜尋結果（模擬）
                let criteriaText = Object.entries(searchCriteria)
                    .map(([key, value]) => `${key}: ${value}`)
                    .join('\n');

                alert(`搜尋條件：\n${criteriaText}\n\n正在為您搜尋符合條件的物件...`);

                // 在真實應用中，這裡會發送AJAX請求或跳轉到搜尋結果頁面
                // 這裡我們模擬跳轉到物件詳情頁面
                setTimeout(() => {
                    window.location.href = 'property-detail.html';
                }, 1000);
            });
        }
    }

    // --- 聯絡表單功能 ---
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // 獲取表單資料
            const formData = new FormData(this);
            const name = this.querySelector('input[type="text"]').value;
            const phone = this.querySelector('input[type="tel"]').value;
            const email = this.querySelector('input[type="email"]').value;
            const message = this.querySelector('textarea').value;

            // 基本驗證
            if (!name || !phone) {
                alert('請填寫姓名和聯絡電話！');
                return;
            }

            // 電話號碼格式驗證
            const phoneRegex = /^09\d{8}$|^0\d{8,9}$/;
            if (!phoneRegex.test(phone)) {
                alert('請輸入正確的電話號碼格式！');
                return;
            }

            // 電子郵件格式驗證（如果填寫了的話）
            if (email) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    alert('請輸入正確的電子郵件格式！');
                    return;
                }
            }

            // 顯示成功訊息
            alert('感謝您的諮詢！我們會盡快與您聯絡。');
            this.reset();
        });
    }

    // --- 物件卡片互動效果 ---
    const propertyCards = document.querySelectorAll('.property-card');
    propertyCards.forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-10px)';
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0)';
        });
    });

    // --- 服務卡片互動效果 ---
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-5px)';
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0)';
        });
    });

    // --- 導覽列滾動效果 ---
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 100) {
                navbar.style.backgroundColor = 'rgba(49, 77, 72, 0.95)';
                navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
            } else {
                navbar.style.backgroundColor = '#314D48';
                navbar.style.boxShadow = 'none';
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

    // --- 載入動畫效果 ---
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // 為各個區塊添加載入動畫
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });

    // --- 返回頂部按鈕 ---
    const backToTopButton = document.createElement('button');
    backToTopButton.innerHTML = '↑';
    backToTopButton.className = 'back-to-top';
    backToTopButton.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: #CC9A87;
        color: white;
        border: none;
        font-size: 20px;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    `;

    document.body.appendChild(backToTopButton);

    // 監聽滾動事件
    window.addEventListener('scroll', function () {
        if (window.scrollY > 300) {
            backToTopButton.style.opacity = '1';
            backToTopButton.style.visibility = 'visible';
        } else {
            backToTopButton.style.opacity = '0';
            backToTopButton.style.visibility = 'hidden';
        }
    });

    // 點擊返回頂部
    backToTopButton.addEventListener('click', function () {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // --- 響應式導覽列 ---
    const navToggle = document.createElement('button');
    navToggle.innerHTML = '☰';
    navToggle.className = 'nav-toggle';
    navToggle.style.cssText = `
        display: none;
        background: none;
        border: none;
        color: white;
        font-size: 24px;
        cursor: pointer;
        padding: 10px;
    `;

    const navigationLinks = document.querySelector('.nav-links');
    if (navigationLinks) {
        navigationLinks.parentNode.insertBefore(navToggle, navigationLinks);

        navToggle.addEventListener('click', function () {
            navigationLinks.classList.toggle('active');
        });

        // 在小螢幕上隱藏導覽列
        if (window.innerWidth <= 768) {
            navigationLinks.style.display = 'none';
            navToggle.style.display = 'block';
        }

        // 監聽視窗大小變化
        window.addEventListener('resize', function () {
            if (window.innerWidth <= 768) {
                navigationLinks.style.display = 'none';
                navToggle.style.display = 'block';
            } else {
                navigationLinks.style.display = 'flex';
                navToggle.style.display = 'none';
                navigationLinks.classList.remove('active');
            }
        });
    }
});