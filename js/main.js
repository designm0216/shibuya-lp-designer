/* ============================================
   js/main.js
   エントリーポイント: slider.js と vh.js の内容をまとめて記述
   ============================================ */

/* ============================================
   ローディングアニメーション
   ============================================ */
(function () {
  var html       = document.documentElement;
  var loader     = document.getElementById('jsLoading');
  var bar        = document.getElementById('jsLoadingBar');
  var progress   = 0;
  var fakeTimer  = null;
  var MIN_DISPLAY_MS = 1800;
  var startTime  = Date.now();

  html.classList.add('is-loading');

  function tickFake() {
    if (progress >= 90) return;
    var remaining = 90 - progress;
    var step = Math.max(0.5, remaining * 0.08);
    progress = Math.min(progress + step, 90);
    bar.style.width = progress + '%';
    fakeTimer = requestAnimationFrame(tickFake);
  }

  fakeTimer = requestAnimationFrame(tickFake);

  function onReady() {
    if (fakeTimer) cancelAnimationFrame(fakeTimer);
    progress = 100;
    bar.style.width = '100%';

    var elapsed = Date.now() - startTime;
    var wait = Math.max(0, MIN_DISPLAY_MS - elapsed);

    setTimeout(function () {
      loader.classList.add('is-hidden');
      html.classList.remove('is-loading');

      setTimeout(function () {
        if (loader.parentNode) {
          loader.parentNode.removeChild(loader);
        }
      }, 700);
    }, wait + 400);
  }

  window.addEventListener('load', onReady);

  setTimeout(function () {
    if (!loader.classList.contains('is-hidden')) {
      onReady();
    }
  }, 8000);
})();

/* ============================================
   ローディング（ロゴフェード）
   ============================================ */
(function () {
  var html   = document.documentElement;
  var loader = document.getElementById('jsLoading');

  html.classList.add('is-loading');

  window.addEventListener('load', function () {
    setTimeout(function () {
      loader.classList.add('is-hidden');
      html.classList.remove('is-loading');

      setTimeout(function () {
        if (loader.parentNode) loader.parentNode.removeChild(loader);
      }, 900);
    }, 1600);
  });

  setTimeout(function () {
    if (!loader.classList.contains('is-hidden')) {
      loader.classList.add('is-hidden');
      html.classList.remove('is-loading');
    }
  }, 6000);
})();

/* ============================================
   センターモードスライダーJS（ふわっとクロスフェード）
   ============================================ */
(function() {
  var images = [
    './img/main/img_01.jpeg',
    './img/main/img_02.jpeg',
    './img/main/img_03.jpeg'
  ];
  var total = images.length;
  var current = 0;
  var isAnimating = false;

  var cardPrev   = document.getElementById('cardPrev');
  var cardCenter = document.getElementById('cardCenter');
  var cardNext   = document.getElementById('cardNext');
  var catches    = document.querySelectorAll('.catch-slide');
  var slidesWrap = document.querySelector('.catch-slides-wrap');


  function idx(offset) {
    return (current + offset + total) % total;
  }

  function updateImages(animate) {
    var prevIdx = idx(-1);
    var nextIdx = idx(1);

    if (animate) {
      isAnimating = true;

      // フェーズ1: 全画像をふわっとフェードアウト
      var prevImg   = cardPrev.querySelector('img');
      var centerImg = cardCenter.querySelector(':scope > img');
      var nextImg   = cardNext.querySelector('img');

      prevImg.style.transition   = 'opacity 0.7s cubic-bezier(0.4, 0, 0.2, 1)';
      centerImg.style.transition = 'opacity 0.7s cubic-bezier(0.4, 0, 0.2, 1)';
      nextImg.style.transition   = 'opacity 0.7s cubic-bezier(0.4, 0, 0.2, 1)';

      prevImg.style.opacity   = '0';
      centerImg.style.opacity = '0';
      nextImg.style.opacity   = '0';

      // フェーズ2: 画像差し替え → ふわっとフェードイン
      setTimeout(function() {
        prevImg.src   = images[prevIdx];
        centerImg.src = images[current];
        nextImg.src   = images[nextIdx];

        // ズームアウト再トリガー
        centerImg.classList.remove('zoom-active');
        void centerImg.offsetWidth;
        centerImg.classList.add('zoom-active');

        // 少し待ってフェードイン
        requestAnimationFrame(function() {
          prevImg.style.opacity   = '1';
          centerImg.style.opacity = '1';
          nextImg.style.opacity   = '1';

          setTimeout(function() {
            isAnimating = false;
          }, 700);
        });
      }, 700);

    } else {
      // 初期表示（アニメーションなし）
      cardPrev.querySelector('img').src   = images[prevIdx];
      cardCenter.querySelector(':scope > img').src = images[current];
      cardNext.querySelector('img').src   = images[nextIdx];
    }
  }

  function updateUI() {
    catches.forEach(function(c, i) {
      if (i === current) {
        c.classList.add('is-active');
      } else {
        c.classList.remove('is-active');
      }
    });
    if (slidesWrap && window.innerWidth <= 767) {
      var activeSlide = catches[current];
      if (activeSlide) {
        requestAnimationFrame(function() {
          slidesWrap.style.height = activeSlide.offsetHeight + 'px';
        });
      }
    }
  }


  function goTo(index, animate) {
    if (isAnimating) return;
    current = index;
    updateImages(animate !== false);
    updateUI();
  }

  function next() {
    goTo(idx(1), true);
  }

  // 自動再生
  var duration = 6000;
  var timer = setInterval(next, duration);

  function resetTimer() {
    clearInterval(timer);
    timer = setInterval(next, duration);
  }



  // サイドカードクリック
  cardPrev.addEventListener('click', function() {
    goTo(idx(-1), true);
    resetTimer();
  });

  cardNext.addEventListener('click', function() {
    goTo(idx(1), true);
    resetTimer();
  });

  // 初期表示
  updateImages(false);
  updateUI();
})();

/* ============================================
   スマホバー対応: 実際のビューポート高さをCSS変数に設定
   ============================================ */
(function() {
  function setVH() {
    var vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', vh + 'px');
  }
  setVH();
  window.addEventListener('resize', setVH);
})();



/* ============================================
   スクロールアニメーション監視
   ============================================ */
(function () {
  // 監視対象を一括取得
  var targets = document.querySelectorAll(
    '.js-fade-up, .js-fade-left, .js-fade-right, .js-scale-in, .js-observe'
  );

  if (!targets.length) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  targets.forEach(function (el) {
    observer.observe(el);
  });
})();

/* ============================================
   ヘッダー スクロール時の背景表示
   ============================================ */
(function () {
  var header = document.querySelector('.site-header');
  if (!header) return;

  var lastY = 0;
  var ticking = false;

  function onScroll() {
    lastY = window.scrollY;
    if (!ticking) {
      requestAnimationFrame(function () {
        if (lastY > 80) {
          header.classList.add('is-scrolled');
        } else {
          header.classList.remove('is-scrolled');
        }
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
})();
