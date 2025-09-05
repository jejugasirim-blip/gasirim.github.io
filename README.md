# gasirim.github.io
가시림 웹사이트

/main
  index.html                    ← landing page (uses landing header)
  /assets
    /css
      styleguide.css
      globals.css
      style.css
    /js
      includes.js
      main.js
    /img
      (your images…)
  /partials
    header-landing.html         ← current landing-only header (rename your existing one)
    header-site.html            ← NEW universal header for all inner pages
    footer.html                 ← universal footer (already have)
  /pages
    /about                      ← 소개
      index.html                ← default tab (e.g., 가시림)
      space.html                ← 공간 소개
      map.html                  ← 수목원 지도
      tour.html                 ← 둘러보기
    /visit                      ← 방문
      index.html                ← 이용 안내 (or overview)
      directions.html           ← 오시는 길
      group.html                ← 단체 문의
    /programs                   ← 프로그램
      index.html                ← overview
      walk.html                 ← 산책 명상
      meditation.html           ← 명상
      gardening.html            ← 원예
    /shop
      index.html                ← Shop (stub for now)
