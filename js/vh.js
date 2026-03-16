/* ============================================
   js/vh.js
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
