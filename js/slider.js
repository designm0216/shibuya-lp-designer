/* ============================================
   js/slider.js
   センターモードスライダー制御（ふわっとクロスフェード）
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
      c.classList.toggle('is-active', i === current);
    });


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
