/* FUNNATION 공용 스크립트 — index.html(홈) · live.html(라이브 방송) 에서 함께 사용 */
(function () {
  var KEY = "funnation-theme";
  var root = document.documentElement;
  var btn = document.getElementById("theme-toggle");

  function apply(theme) {
    root.setAttribute("data-theme", theme);
    btn.setAttribute("aria-checked", theme === "light" ? "true" : "false");
  }

  var saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) {}
  // ?theme=light / ?theme=dark 로 강제 지정 가능 (공유·검수용)
  var forced = new URLSearchParams(location.search).get("theme");
  apply(forced === "light" || forced === "dark" ? forced
        : saved === "light" ? "light" : "dark");

  btn.addEventListener("click", function () {
    var next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
    try { localStorage.setItem(KEY, next); } catch (e) {}
    // 지원 브라우저에선 이전·다음 화면을 교차 페이드 (그라디언트 배경·아이콘 교체까지 부드럽게)
    if (document.startViewTransition && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.startViewTransition(function () { apply(next); });
    } else {
      apply(next);
    }
  });
})();

/* LNB 열기 / 접기 — GNB 햄버거 버튼
   데스크톱: 펼침(full) ↔ 아이콘 레일(mini), 선택 저장
   모바일(767px 이하): 좌측 드로어 열기 ↔ 닫기, 저장하지 않음 */
(function () {
  var KEY = "funnation-lnb";
  var root = document.documentElement;
  var btn = document.getElementById("lnb-toggle");
  var btnMo = document.getElementById("lnb-toggle-mo");
  var backdrop = document.getElementById("lnb-backdrop");
  var mobile = matchMedia("(max-width: 767px)");

  // 접힌 상태에선 라벨이 숨으므로 툴팁으로 메뉴 이름 노출
  var items = document.querySelectorAll(".lnb__item, .creator");
  for (var k = 0; k < items.length; k++) {
    var label = items[k].querySelector(".creator__name") || items[k];
    items[k].title = label.textContent.trim();
  }

  var saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) {}
  // ?lnb=mini / ?lnb=full 로 강제 지정 가능 (공유·검수용)
  var forced = new URLSearchParams(location.search).get("lnb");
  var desktopState = forced === "mini" || forced === "full" ? forced
                   : saved === "mini" ? "mini" : "full";
  var drawerOpen = false;
  // 영상 상세(watch.html)는 LNB 를 숨겨 두고 햄버거로 영상 위에 겹쳐 엶 (펼침/접힘 저장과 무관)
  var watch = root.getAttribute("data-page") === "watch";

  function render() {
    if (watch) {
      root.setAttribute("data-lnb", "full");
      root.setAttribute("data-drawer", drawerOpen ? "open" : "closed");
      btn.setAttribute("aria-expanded", drawerOpen ? "true" : "false");
      btn.setAttribute("aria-label", drawerOpen ? "메뉴 닫기" : "메뉴 열기");
      return;
    }
    if (mobile.matches) {
      // 모바일 드로어는 항상 펼친 LNB 를 보여준다
      root.setAttribute("data-lnb", "full");
      root.setAttribute("data-drawer", drawerOpen ? "open" : "closed");
      btnMo.setAttribute("aria-expanded", drawerOpen ? "true" : "false");
      btnMo.setAttribute("aria-label", drawerOpen ? "메뉴 닫기" : "메뉴 열기");
    } else {
      drawerOpen = false;
      root.removeAttribute("data-drawer");
      root.setAttribute("data-lnb", desktopState);
      btn.setAttribute("aria-expanded", desktopState === "full" ? "true" : "false");
      btn.setAttribute("aria-label", desktopState === "full" ? "메뉴 접기" : "메뉴 펼치기");
    }
  }

  // 데스크톱 펼침 ↔ 접힘 — 클릭으로 바꿀 때만 트랜지션 (첫 로드·화면 폭 변경 땐 바로 적용)
  var lnb = document.getElementById("lnb");
  var reduced = matchMedia("(prefers-reduced-motion: reduce)");
  function endAnim(e) {
    if (e && (e.target !== lnb || e.propertyName !== "width")) return;
    root.removeAttribute("data-lnb-anim");
  }
  lnb.addEventListener("transitionend", endAnim);
  lnb.addEventListener("transitioncancel", endAnim);

  btn.addEventListener("click", function () {
    if (watch) {
      drawerOpen = !drawerOpen;
      render();
      return;
    }
    desktopState = desktopState === "mini" ? "full" : "mini";
    try { localStorage.setItem(KEY, desktopState); } catch (e) {}
    if (!reduced.matches) {
      // 연달아 누르면 내용 페이드를 처음부터 다시 재생
      root.removeAttribute("data-lnb-anim");
      void lnb.offsetWidth;
      root.setAttribute("data-lnb-anim", "");
    }
    render();
  });
  // 모바일 헤더 우측 메뉴 버튼 — 드로어 열기/닫기
  btnMo.addEventListener("click", function () {
    drawerOpen = !drawerOpen;
    render();
  });
  function close() {
    if (!drawerOpen) return;
    drawerOpen = false;
    render();
  }
  backdrop.addEventListener("click", close);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") close();
  });
  mobile.addEventListener("change", render);
  render();
})();

/* 로그인 / 로그아웃 상태 */
(function () {
  var KEY = "funnation-auth";
  var root = document.documentElement;

  function apply(state) {
    root.setAttribute("data-auth", state);
    try { localStorage.setItem(KEY, state); } catch (e) {}
  }

  var saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) {}
  var forced = new URLSearchParams(location.search).get("auth");
  root.setAttribute("data-auth",
    forced === "out" || forced === "in" ? forced : saved === "out" ? "out" : "in");

  // 플로팅 버튼 — 현재 상태의 반대로 전환
  document.getElementById("auth-btn").addEventListener("click", function () {
    var next = root.getAttribute("data-auth") === "out" ? "in" : "out";
    apply(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* 로그인 화면 — 주소 #login 일 때 본문 대신 로그인 폼을 보여준다.
     PC: 상단 로그인 버튼 / 모바일: 하단 내비 사람 아이콘(로그아웃 상태) */
  // 섹션 id 를 "login" 으로 두면 #login 앵커 스크롤이 .page 를 밀어 GNB 가 잘린다
  var view = document.getElementById("login-view");
  var form = document.getElementById("login-form");
  var moTitle = document.getElementById("mo-title");
  // 홈 앱바 제목은 로고 이미지라 innerHTML 로 보관했다가 되돌린다 (검색·알림 화면도 같은 값을 씀)
  var pageTitle = moTitle.innerHTML;
  moTitle.setAttribute("data-page-title", pageTitle);
  var bnLive = document.querySelector('.bottom-nav__item[aria-current="page"]');
  var pushed = false;

  function render() {
    var open = location.hash === "#login" && root.getAttribute("data-auth") === "out";
    var was = root.getAttribute("data-view") === "login";
    view.hidden = !open;
    // 검색·알림 화면이 쓰는 data-view·앱바 제목은 건드리지 않음 — 로그인 화면이 열려 있던 경우만 되돌림
    if (open) {
      root.setAttribute("data-view", "login");
      moTitle.textContent = "로그인";
    } else if (was) {
      root.removeAttribute("data-view");
      moTitle.innerHTML = pageTitle;
    }
    // 시안처럼 로그인 화면에서는 하단 내비에 선택 표시 없음
    // 영상 상세처럼 하단 내비에 해당 메뉴가 없는 페이지는 건너뜀
    if (bnLive) bnLive.classList.toggle("is-active", !open);
    form.classList.remove("is-error");
  }
  function openLogin() {
    if (location.hash !== "#login") {
      location.hash = "login";
      pushed = true;
    }
    render();
    window.scrollTo(0, 0);
    form.elements.id.focus({ preventScroll: true });
  }
  function closeLogin() {
    if (location.hash !== "#login") return;
    if (pushed) {
      pushed = false;
      history.back();
    } else {
      history.replaceState(null, "", location.pathname + location.search);
      render();
    }
  }
  function signIn() {
    apply("in");
    closeLogin();
    render();
  }

  document.getElementById("login-btn").addEventListener("click", openLogin);
  // 하단 내비 "내 정보" — 로그아웃이면 로그인 화면, 로그인 상태면 프로필·등급이 있는 메뉴 드로어
  document.getElementById("bn-account").addEventListener("click", function (e) {
    e.preventDefault();
    if (root.getAttribute("data-auth") === "out") openLogin();
    else document.getElementById("lnb-toggle-mo").click();
  });
  var backs = document.querySelectorAll("[data-login-back]");
  for (var b = 0; b < backs.length; b++) {
    backs[b].addEventListener("click", function (e) {
      // 로그인 화면이면 로그인만 닫는다. 아니면 라이브 방송은 홈 링크, 홈은 브라우저 뒤로 가기
      // 회원가입 화면은 회원가입 스크립트가 단계별로 처리
      if (root.getAttribute("data-view") === "signup") return;
      if (root.getAttribute("data-view") === "login") {
        e.preventDefault();
        closeLogin();
      } else if (this.hasAttribute("data-history-back") && history.length > 1) {
        history.back();
      }
    });
  }
  window.addEventListener("hashchange", function () {
    if (location.hash !== "#login") pushed = false;
    render();
    if (!view.hidden) window.scrollTo(0, 0);
  });

  // 서버 연동 전 데모 — 아이디만 있으면 비밀번호와 상관없이 로그인
  // (틀린 비밀번호 화면 64316:166222 의 is-error 스타일은 서버 연동 때 쓰도록 남겨 둠)
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var id = form.elements.id;
    if (!id.value.trim()) { id.focus(); return; }
    form.elements.password.removeAttribute("aria-invalid");
    form.reset();
    signIn();
  });
  // 입력칸 오른쪽 버튼 — 값이 있을 때만 지우기, 비밀번호 보기 토글. 누르는 동안 입력칸 포커스 유지
  var fields = form.querySelectorAll(".field");
  for (var f = 0; f < fields.length; f++) (function (field) {
    var input = field.querySelector(".field__input");
    var clear = field.querySelector(".field__clear");
    var reveal = field.querySelector(".field__reveal");
    function sync() {
      if (clear) clear.classList.toggle("has-value", !!input.value);
    }
    input.addEventListener("input", sync);
    form.addEventListener("reset", function () {
      setTimeout(sync);
      if (reveal) {
        input.type = "password";
        reveal.setAttribute("aria-pressed", "false");
        reveal.setAttribute("aria-label", "비밀번호 보기");
      }
    });
    field.addEventListener("mousedown", function (e) {
      if (e.target.closest(".field__action")) e.preventDefault();
    });
    if (clear) clear.addEventListener("click", function () {
      input.value = "";
      sync();
      input.focus();
    });
    if (reveal) reveal.addEventListener("click", function () {
      var show = input.type === "password";
      input.type = show ? "text" : "password";
      reveal.setAttribute("aria-pressed", show ? "true" : "false");
      reveal.setAttribute("aria-label", show ? "비밀번호 숨기기" : "비밀번호 보기");
      input.focus();
    });
    sync();
  })(fields[f]);

  form.elements.password.addEventListener("input", function () {
    form.classList.remove("is-error");
    this.removeAttribute("aria-invalid");
  });
  var sns = form.querySelectorAll("[data-sns]");
  for (var n = 0; n < sns.length; n++) sns[n].addEventListener("click", signIn);

  // 플로팅 버튼 등으로 로그인 상태가 바뀌면 로그인 화면도 다시 판단
  new MutationObserver(render).observe(root, { attributes: true, attributeFilter: ["data-auth"] });
  render();
  if (!view.hidden) window.scrollTo(0, 0);
})();

/* 검색(64162:201098)·알림(64162:200698) 화면 — 모바일 시안. 로그인 화면처럼 주소 #search · #notice 로 열고
   앱바 왼쪽 뒤로(검색)·닫기(알림) 버튼이나 브라우저 뒤로 가기로 닫는다 */
(function () {
  var root = document.documentElement;
  var VIEWS = { search: "검색", notice: "알림" };
  var moTitle = document.getElementById("mo-title");
  var pageTitle = moTitle.getAttribute("data-page-title");
  var pushed = false;

  function current() {
    var name = location.hash.slice(1);
    return VIEWS.hasOwnProperty(name) ? name : null;
  }
  function render() {
    var name = current();
    var was = root.getAttribute("data-view");
    for (var key in VIEWS) document.getElementById(key + "-view").hidden = key !== name;
    if (name) {
      root.setAttribute("data-view", name);
      moTitle.textContent = VIEWS[name];
    } else if (VIEWS.hasOwnProperty(was)) {
      root.removeAttribute("data-view");
      moTitle.innerHTML = pageTitle;
    }
  }
  function open(name) {
    if (location.hash !== "#" + name) {
      // 검색 → 알림처럼 화면끼리 옮길 때는 기록을 쌓지 않아 닫기 한 번에 본문으로 돌아감
      if (current()) history.replaceState(null, "", "#" + name);
      else { location.hash = name; pushed = true; }
    }
    render();
    window.scrollTo(0, 0);
  }
  function close() {
    if (!current()) return;
    if (pushed) {
      pushed = false;
      history.back();
    } else {
      history.replaceState(null, "", location.pathname + location.search);
      render();
    }
  }

  var search = document.querySelector(".mo-appbar__search");
  if (search) search.addEventListener("click", function () {
    open("search");
    document.querySelector("#search-form input").focus({ preventScroll: true });
  });
  var bells = document.querySelectorAll(".mo-appbar__bell");
  for (var i = 0; i < bells.length; i++) bells[i].addEventListener("click", function () { open("notice"); });
  var closes = document.querySelectorAll("[data-subview-close]");
  for (var c = 0; c < closes.length; c++) closes[c].addEventListener("click", close);
  window.addEventListener("hashchange", function () {
    if (!current()) pushed = false;
    render();
  });

  // 최근 검색어 — 서버 연동 전 데모: 검색하면 맨 위에 추가, X 로 하나씩 / 전체삭제로 모두 지움 (저장 안 함)
  var form = document.getElementById("search-form");
  var list = document.getElementById("recent-list");
  var template = list.firstElementChild.cloneNode(true);
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var q = form.elements.q.value.trim();
    if (!q) return;
    var items = list.querySelectorAll("a > span:last-child");
    for (var k = 0; k < items.length; k++) {
      if (items[k].textContent === q) list.removeChild(items[k].closest("li"));
    }
    var li = template.cloneNode(true);
    li.querySelector("a > span:last-child").textContent = q;
    li.querySelector("[data-recent-remove]").setAttribute("aria-label", q + " 삭제");
    list.insertBefore(li, list.firstChild);
    form.reset();
  });
  // 지우기(reset) 뒤에도 바로 이어서 입력할 수 있게
  form.addEventListener("reset", function () {
    setTimeout(function () { form.elements.q.focus(); });
  });
  list.addEventListener("click", function (e) {
    var remove = e.target.closest("[data-recent-remove]");
    if (remove) list.removeChild(remove.closest("li"));
    else if (e.target.closest("a")) {
      e.preventDefault();
      form.elements.q.value = e.target.closest("a").textContent;
      form.elements.q.focus();
    }
  });
  document.querySelector("#search-view [data-recent-clear]").addEventListener("click", function () {
    list.innerHTML = "";
  });

  render();
})();

/* PC 상단 검색 (64299:162675) — 누르면 포커스 상태 + 최근 검색어 패널, 입력하면 지우기 버튼.
   바깥을 누르거나 Esc 로 닫는다. 최근 검색어는 모바일과 같은 데모 동작 (저장 안 함) */
(function () {
  var form = document.getElementById("nav-search");
  if (!form) return;
  var input = form.elements.q;
  var clear = form.querySelector(".nav-search__clear");
  var panel = form.querySelector(".nav-search__panel");
  var list = form.querySelector(".nav-search__list");
  var template = list.firstElementChild.cloneNode(true);
  var placeholder = input.placeholder;

  function sync() {
    clear.hidden = !input.value;
    panel.hidden = !list.children.length;
  }
  function open() {
    form.classList.add("is-open");
    input.placeholder = input.getAttribute("data-focus-placeholder");
  }
  function close() {
    form.classList.remove("is-open");
    input.placeholder = placeholder;
  }

  input.addEventListener("focus", open);
  input.addEventListener("input", sync);
  input.addEventListener("keydown", function (e) {
    if (e.key === "Escape") { close(); input.blur(); }
  });
  // 패널·지우기 버튼을 눌러도 인풋 포커스(=열린 상태)가 유지되도록
  form.addEventListener("mousedown", function (e) {
    if (e.target !== input) e.preventDefault();
  });
  form.addEventListener("click", function (e) {
    if (e.target === form || e.target.closest(".nav-search__icon")) input.focus();
  });
  document.addEventListener("mousedown", function (e) {
    if (!form.contains(e.target)) close();
  });
  input.addEventListener("blur", function () {
    // 탭 키로 빠져나갈 때도 닫힘
    setTimeout(function () { if (!form.contains(document.activeElement)) close(); });
  });

  clear.addEventListener("click", function () {
    input.value = "";
    sync();
    input.focus();
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var q = input.value.trim();
    if (!q) return;
    var items = list.querySelectorAll("a > span:last-child");
    for (var k = 0; k < items.length; k++) {
      if (items[k].textContent === q) list.removeChild(items[k].closest("li"));
    }
    var li = template.cloneNode(true);
    li.querySelector("a > span:last-child").textContent = q;
    li.querySelector("[data-recent-remove]").setAttribute("aria-label", q + " 삭제");
    list.insertBefore(li, list.firstChild);
    input.value = "";
    sync();
  });
  list.addEventListener("click", function (e) {
    var remove = e.target.closest("[data-recent-remove]");
    if (remove) list.removeChild(remove.closest("li"));
    else if (e.target.closest("a")) {
      e.preventDefault();
      input.value = e.target.closest("a").textContent;
    }
    sync();
    input.focus();
  });
  form.querySelector("[data-recent-clear]").addEventListener("click", function () {
    list.innerHTML = "";
    sync();
    input.focus();
  });

  sync();
})();

/* 히어로 슬라이더 — 로그인 상태와 무관하게 순환 */
(function () {
  var hero = document.getElementById("hero");
  if (!hero) return; // 라이브 방송 페이지에는 히어로가 없음
  var slides = hero.querySelectorAll(".hero__slide");
  var i = 0, timer;

  // ?slide=N 으로 특정 슬라이드 고정 (공유·검수용)
  var forced = new URLSearchParams(location.search).get("slide");

  function go(n) {
    i = (n + slides.length) % slides.length;
    for (var k = 0; k < slides.length; k++) {
      slides[k].classList.toggle("is-active", k === i);
    }
  }
  function start() {
    stop();
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    timer = setInterval(function () { go(i + 1); }, 5000);
  }
  function stop() { clearInterval(timer); }

  hero.addEventListener("click", function (e) {
    var dot = e.target.closest("[data-slide]");
    var arrow = e.target.closest("[data-dir]");
    if (dot) go(Number(dot.dataset.slide));
    else if (arrow) go(i + Number(arrow.dataset.dir));
    else return;
    start();
  });
  hero.addEventListener("mouseenter", stop);
  hero.addEventListener("mouseleave", start);

  if (forced !== null) {
    go(Number(forced));
  } else {
    start();
  }
})();

/* 히어로 배경 효과 — Predictive Arc (Originkit) 를 바닐라 WebGL 로 옮김.
   기본은 꺼 둠 — ?fx=on 일 때만 켬. WebGL 이 없거나 셰이더가 실패하면 캔버스만 숨기고 기존 배너 그대로 */
(function () {
  var hero = document.getElementById("hero");
  if (!hero) return;
  // 모바일(767px 이하)에서는 배경 효과를 켜지 않음 — WebGL 자체를 만들지 않아 성능 부담도 없앰
  if (matchMedia("(max-width: 767px)").matches) {
    hero.classList.add("hero--no-fx");
    return;
  }
  var canvases = hero.querySelectorAll(".hero__arc");
  if (new URLSearchParams(location.search).get("fx") !== "on") {
    hero.classList.add("hero--no-fx");
    return;
  }

  // 프리셋 (원본 __originkitPresetProps 를 셰이더 값으로 환산)
  var P = {
    bg: [0, 0, 0],                       // 화면 합성(screen)이라 검정 = 투명
    base: hex("#494FE7"),
    accent: hex("#A4A7F3"),
    high: hex("#494FE7"),
    density: 78,
    dotSize: 137 / 100,
    speed: 100 / 50,
    peak: 100 / 100,
    archHeight: 0 / 100,
    thickness: 206 / 100,
    falloff: 600 / 100,
    pointerRadius: 236,
    pointerStrength: 34 / 100
  };
  var MAX_DPR = 2;

  var VERT = "attribute vec2 a_pos;void main(){gl_Position=vec4(a_pos,0.0,1.0);}";
  var FRAG = [
    "#ifdef GL_FRAGMENT_PRECISION_HIGH",
    "precision highp float;",
    "#else",
    "precision mediump float;",
    "#endif",
    "uniform vec2 uRes;",
    "uniform float uTime,uDpr,uCell,uDot;",
    "uniform float uPeak,uHeight,uThick,uFall;",
    "uniform vec3 uBg,uBase,uAccent,uHigh;",
    "uniform vec2 uMouse;",
    "uniform float uMouseRadius,uMouseStrength;",
    "void main(){",
    "  float cs=max(uCell,2.0);",
    "  vec2 ci=floor(gl_FragCoord.xy/cs);",
    "  vec2 cc=(ci+0.5)*cs;",
    "  float x=cc.x/uDpr;",
    "  float y=(uRes.y-cc.y)/uDpr;",
    "  float w=uRes.x/uDpr;",
    "  float h=uRes.y/uDpr;",
    "  float normX=(x-w*0.5)/(w*0.75);",
    "  float curveY=h*uPeak+normX*normX*(h*uHeight);",
    "  float mdx=x-uMouse.x;",
    "  float influence=uMouseStrength*exp(-(mdx*mdx)/(2.0*uMouseRadius*uMouseRadius+1.0));",
    "  curveY=mix(curveY,uMouse.y,influence);",
    "  float dist=abs(y-curveY);",
    "  float th=(140.0+(1.0-abs(normX))*80.0)*uThick;",
    "  vec3 col=uBg;",
    "  if(dist<th){",
    "    float i=1.0-dist/th;",
    "    float waveX=sin(x*0.015+uTime);",
    "    float waveY=cos(y*0.02+uTime);",
    "    i=i*0.7+waveX*waveY*0.3*i;",
    "    i*=max(0.0,1.0-pow(abs(normX),uFall));",
    "    if(i>0.02){",
    "      float side=uDot*i*uDpr;",
    "      vec2 d=abs(gl_FragCoord.xy-cc);",
    "      float cov=1.0-smoothstep(side*0.5-1.0,side*0.5+1.0,max(d.x,d.y));",
    "      vec3 ink=mix(uBase,uAccent,clamp(pow(i,1.1),0.0,1.0));",
    "      ink=mix(ink,uHigh,smoothstep(0.72,1.0,i));",
    "      col=mix(uBg,ink,cov*clamp(i*1.6,0.0,1.0));",
    "    }",
    "  }",
    "  gl_FragColor=vec4(col,1.0);",
    "}"
  ].join("\n");

  function hex(s) {
    return [1, 3, 5].map(function (k) { return parseInt(s.substr(k, 2), 16) / 255; });
  }

  function setup(canvas) {
    var gl = canvas.getContext("webgl", { alpha: false, antialias: false, depth: false });
    if (!gl) return null;
    function compile(type, src) {
      var sh = gl.createShader(type);
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        console.error("PredictiveArc shader:", gl.getShaderInfoLog(sh));
        return null;
      }
      return sh;
    }
    var vs = compile(gl.VERTEX_SHADER, VERT);
    var fs = compile(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return null;
    var prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error("PredictiveArc link:", gl.getProgramInfoLog(prog));
      return null;
    }
    gl.useProgram(prog);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    var aPos = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    var locs = {};
    function u(name) {
      if (!(name in locs)) locs[name] = gl.getUniformLocation(prog, name);
      return locs[name];
    }
    gl.uniform3fv(u("uBg"), P.bg);
    gl.uniform3fv(u("uBase"), P.base);
    gl.uniform3fv(u("uAccent"), P.accent);
    gl.uniform3fv(u("uHigh"), P.high);
    gl.uniform1f(u("uPeak"), P.peak);
    gl.uniform1f(u("uHeight"), P.archHeight);
    gl.uniform1f(u("uThick"), P.thickness);
    gl.uniform1f(u("uFall"), P.falloff);
    gl.uniform1f(u("uMouseRadius"), P.pointerRadius);
    return { canvas: canvas, gl: gl, u: u };
  }

  var views = [];
  for (var k = 0; k < canvases.length; k++) {
    var v = setup(canvases[k]);
    if (v) views.push(v);
  }
  if (!views.length) {
    hero.classList.add("hero--no-fx");
    return;
  }

  // 포인터 — 원본은 y 를 아래 기준으로 넘겨 곡선이 커서 반대쪽으로 갔음. 셰이더와 같은 위 기준으로 맞춤
  var ps = { x: 0, y: 0, tx: 0, ty: 0, a: 0, ta: 0 };
  hero.addEventListener("pointermove", function (e) {
    var r = hero.getBoundingClientRect();
    ps.tx = e.clientX - r.left;
    ps.ty = e.clientY - r.top;
    ps.ta = 1;
  });
  hero.addEventListener("pointerleave", function () { ps.ta = 0; });
  hero.addEventListener("pointercancel", function () { ps.ta = 0; });

  var reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var raf = 0, last = performance.now(), clock = 0, visible = true;

  function draw(view, dpr) {
    var gl = view.gl, u = view.u, c = view.canvas;
    var bw = Math.max(1, Math.round(c.clientWidth * dpr));
    var bh = Math.max(1, Math.round(c.clientHeight * dpr));
    if (c.width !== bw || c.height !== bh) {
      c.width = bw;
      c.height = bh;
    }
    gl.viewport(0, 0, bw, bh);
    var pitch = Math.min(bw, bh) / dpr / P.density;
    gl.uniform2f(u("uRes"), bw, bh);
    gl.uniform1f(u("uTime"), clock);
    gl.uniform1f(u("uDpr"), dpr);
    gl.uniform1f(u("uCell"), Math.max(2, pitch * dpr));
    gl.uniform1f(u("uDot"), pitch * 1.2 * P.dotSize);
    gl.uniform2f(u("uMouse"), ps.x, ps.y);
    gl.uniform1f(u("uMouseStrength"), P.pointerStrength * ps.a);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  function frame(now) {
    var dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    clock = (clock + dt * 0.9 * P.speed) % 6283;
    var posLerp = Math.min(1, dt * 12), actLerp = Math.min(1, dt * 6);
    ps.x += (ps.tx - ps.x) * posLerp;
    ps.y += (ps.ty - ps.y) * posLerp;
    ps.a += (ps.ta - ps.a) * actLerp;
    var dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    for (var k = 0; k < views.length; k++) draw(views[k], dpr);
    raf = visible && !reduced ? requestAnimationFrame(frame) : 0;
  }

  // 화면 밖이거나 탭이 숨겨지면 멈춤
  function resume() {
    if (raf || !visible || reduced || document.hidden) return;
    last = performance.now();
    raf = requestAnimationFrame(frame);
  }
  function pause() {
    cancelAnimationFrame(raf);
    raf = 0;
  }
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
      visible ? resume() : pause();
    }).observe(hero);
  }
  document.addEventListener("visibilitychange", function () {
    document.hidden ? pause() : resume();
  });
  // 움직임 줄이기 설정이면 정지된 한 프레임만
  if (reduced) {
    frame(performance.now());
    window.addEventListener("resize", function () { frame(performance.now()); });
  } else {
    resume();
  }
})();

/* 광고 배너 "오늘 그만 보기" — PC 상단 배너·모바일 프로모 배너 공용.
   시안 검수용이라 누르면 숨기기만 하고 저장하지 않음 → 새로고침하면 다시 나옴 */
(function () {
  try { localStorage.removeItem("funnation-ad-hidden"); } catch (e) {} // 예전 버전에서 저장한 기록 정리
  var btns = document.querySelectorAll("[data-ad-close]");
  for (var k = 0; k < btns.length; k++) {
    btns[k].addEventListener("click", function () {
      document.documentElement.setAttribute("data-ad", "hidden");
    });
  }
})();

/* 후원 컨텐츠 영상 카드 (투표) — 올림·포커스 중에만 영상 재생, 설명 문구는 글자마다 지연을 줘 차례로 떠오르게.
   글자 나누기는 흐르는 목록이 카드를 복제하기 전에 해 둠(복제본도 같은 구조) · 이벤트는 목록에 위임 */
(function () {
  var list = document.querySelector(".donation-list");
  if (!list) return;
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  var splits = list.querySelectorAll("[data-split]");
  for (var s = 0; s < splits.length; s++) {
    var el = splits[s];
    var text = el.textContent.trim();
    var n = 0;
    el.textContent = "";
    text.split(" ").forEach(function (word, wi) {
      if (wi) el.appendChild(document.createTextNode(" "));
      var w = document.createElement("span");
      w.className = "w";
      Array.prototype.forEach.call(word, function (ch) {
        var c = document.createElement("span");
        c.className = "c";
        c.style.setProperty("--i", n++);
        c.textContent = ch;
        w.appendChild(c);
      });
      el.appendChild(w);
    });
  }
  function activate(card, on) {
    if (card.classList.contains("is-active") === on) return;
    card.classList.toggle("is-active", on);
    var video = card.querySelector("video");
    clearTimeout(card._rewind);
    if (on) {
      if (!reduced.matches) {
        var p = video.play();
        if (p && p.catch) p.catch(function () {});
      }
    } else {
      // 영상이 사라진 뒤(0.3초) 멈추고 처음으로
      card._rewind = setTimeout(function () {
        video.pause();
        video.currentTime = 0;
      }, 300);
    }
  }
  function cardOf(node) {
    return node && node.closest ? node.closest(".donation-card--video") : null;
  }
  list.addEventListener("mouseover", function (e) {
    var card = cardOf(e.target);
    if (card && !card.contains(e.relatedTarget)) activate(card, true);
  });
  list.addEventListener("mouseout", function (e) {
    var card = cardOf(e.target);
    if (card && !card.contains(e.relatedTarget)) activate(card, false);
  });
  list.addEventListener("focusin", function (e) {
    var card = cardOf(e.target);
    if (card) activate(card, true);
  });
  list.addEventListener("focusout", function (e) {
    var card = cardOf(e.target);
    if (card) activate(card, false);
  });
})();

/* 후원 컨텐츠 카드 — 폭이 좁아 가려지는 카드가 있을 때만 왼쪽으로 계속 흐름.
   카드를 한 벌 복제해 뒤에 붙이고, 한 벌만큼 지나가면 처음 위치로 되돌려 끊김 없이 반복.
   마우스 올림·터치·포커스 중엔 멈추고(손으로 넘기기 가능), 화면 밖·다른 탭·동작 줄이기 설정이면 움직이지 않음 */
(function () {
  var list = document.querySelector(".donation-list");
  if (!list) return;
  var SPEED = 30; // px/초
  var originals = Array.prototype.slice.call(list.children);
  var clones = [];
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  var pos = 0, last = 0, raf = 0;
  var paused = false, visible = true, on = false;

  function overflowing() {
    var cs = getComputedStyle(list);
    var room = list.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    var first = originals[0], end = originals[originals.length - 1];
    return end.offsetLeft + end.offsetWidth - first.offsetLeft > room + 1;
  }
  // 복제본 첫 카드까지의 거리 = 한 벌 폭(카드 사이 간격 포함)
  function loopWidth() {
    return clones[0].offsetLeft - originals[0].offsetLeft;
  }
  function frame(t) {
    raf = 0;
    if (!running()) return;
    if (last) {
      pos += (t - last) / 1000 * SPEED;
      var w = loopWidth();
      if (pos >= w) pos -= w;
      list.scrollLeft = pos;
    }
    last = t;
    raf = requestAnimationFrame(frame);
  }
  function running() {
    return on && !paused && visible && !reduced.matches && !document.hidden;
  }
  function kick() {
    if (running() && !raf) {
      pos = list.scrollLeft; // 손으로 넘긴 위치에서 이어서
      last = 0;
      raf = requestAnimationFrame(frame);
    }
  }
  function update() {
    var need = overflowing();
    if (need && !on) {
      originals.forEach(function (li) {
        var c = li.cloneNode(true);
        c.setAttribute("aria-hidden", "true");
        if (c.hasAttribute("tabindex")) c.setAttribute("tabindex", "-1");
        list.appendChild(c);
        clones.push(c);
      });
      on = true;
      list.classList.add("is-marquee");
    } else if (!need && on) {
      clones.forEach(function (c) { c.remove(); });
      clones = [];
      on = false;
      list.classList.remove("is-marquee");
      list.scrollLeft = 0;
    }
    kick();
  }

  function pause() { paused = true; }
  function resume() { paused = false; kick(); }
  list.addEventListener("mouseenter", pause);
  list.addEventListener("mouseleave", resume);
  list.addEventListener("touchstart", pause, { passive: true });
  list.addEventListener("touchend", function () { setTimeout(resume, 1500); });
  list.addEventListener("focusin", pause);
  list.addEventListener("focusout", resume);
  // 손으로 넘기다 끝(복제본 구간)에 닿아도 이어지도록 한 벌 폭만큼 되감기
  list.addEventListener("scroll", function () {
    if (on && paused && list.scrollLeft >= loopWidth()) list.scrollLeft -= loopWidth();
  }, { passive: true });

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (es) {
      visible = es[0].isIntersecting;
      kick();
    }).observe(list);
  }
  document.addEventListener("visibilitychange", kick);
  if (reduced.addEventListener) reduced.addEventListener("change", kick);
  if ("ResizeObserver" in window) new ResizeObserver(update).observe(list);
  else window.addEventListener("resize", update);
  update();
})();

/* 카테고리 탭(칩) — 누른 탭으로 선택 표시만 옮김. 탭별 콘텐츠 전환은 추후 연동 */
(function () {
  var groups = document.querySelectorAll(".chips");
  for (var g = 0; g < groups.length; g++) {
    (function (group) {
      var buttons = group.querySelectorAll("button");
      for (var i = 0; i < buttons.length; i++) {
        buttons[i].setAttribute("aria-pressed", buttons[i].classList.contains("is-active") ? "true" : "false");
      }
      group.addEventListener("click", function (e) {
        var btn = e.target.closest("button");
        if (!btn || !group.contains(btn) || btn.classList.contains("is-active")) return;
        for (var j = 0; j < buttons.length; j++) {
          buttons[j].classList.remove("is-active");
          buttons[j].setAttribute("aria-pressed", "false");
        }
        btn.classList.add("is-active");
        btn.setAttribute("aria-pressed", "true");
      });
    })(groups[g]);
  }
})();

/* 라이브 방송 서브탭 — 인기라이브 ↔ 전체라이브(64586:116579) 화면 전환.
   새로고침 없이 바꾸고 주소에 ?tab=all 을 남겨 공유·새로고침해도 같은 탭이 열림 */
(function () {
  var tabs = document.querySelectorAll("[data-live-tab]");
  var views = document.querySelectorAll("[data-live-view]");
  if (!tabs.length || !views.length) return;

  function show(name) {
    for (var i = 0; i < tabs.length; i++) {
      var on = tabs[i].getAttribute("data-live-tab") === name;
      tabs[i].classList.toggle("subnav__tab--active", on);
      if (on) tabs[i].setAttribute("aria-current", "page");
      else tabs[i].removeAttribute("aria-current");
    }
    for (var j = 0; j < views.length; j++) {
      views[j].hidden = views[j].getAttribute("data-live-view") !== name;
    }
  }

  var params = new URLSearchParams(location.search);
  show(params.get("tab") === "all" ? "all" : "popular");

  for (var k = 0; k < tabs.length; k++) {
    tabs[k].addEventListener("click", function (e) {
      e.preventDefault();
      var name = this.getAttribute("data-live-tab");
      show(name);
      var p = new URLSearchParams(location.search);
      if (name === "all") p.set("tab", "all");
      else p.delete("tab");
      var q = p.toString();
      history.replaceState(history.state, "", location.pathname + (q ? "?" + q : "") + location.hash);
      window.scrollTo(0, 0);
    });
  }
})();

/* 회원가입 (64454:202039) — 주소 #signup 일 때 본문 대신 표시. 로그인 화면의 "회원가입" 링크로 열림.
   약관동의 → 본인인증 → 정보입력 → 가입완료 4단계는 주소를 바꾸지 않고 화면 안에서 넘김.
   앱바 뒤로 가기: 2·3단계는 이전 단계, 1·4단계는 회원가입 닫기. 서버 연동 전 데모라 입력값은 저장하지 않음 */
(function () {
  var root = document.documentElement;
  var view = document.getElementById("signup-view");
  if (!view) return;
  var moTitle = document.getElementById("mo-title");
  var bnAccount = document.getElementById("bn-account");
  var bnPage = document.querySelector('.bottom-nav__item[aria-current="page"]');
  var pages = view.querySelectorAll("[data-signup-step]");
  var steps = view.querySelectorAll(".steps__item");
  var form = document.getElementById("signup-form");
  var step = 1;
  // 비밀번호 보기 — 버튼마다 같은 칸의 입력값을 보이고 숨김
  var reveals = form.querySelectorAll(".sfield__reveal");
  function setReveal(btn, show) {
    var input = btn.parentNode.querySelector(".sfield__input");
    var label = btn.getAttribute("aria-label").replace(/ (보기|숨기기)$/, "");
    input.type = show ? "text" : "password";
    btn.setAttribute("aria-pressed", show ? "true" : "false");
    btn.setAttribute("aria-label", label + (show ? " 숨기기" : " 보기"));
  }
  for (var rv = 0; rv < reveals.length; rv++) {
    reveals[rv].addEventListener("mousedown", function (e) { e.preventDefault(); });
    reveals[rv].addEventListener("click", function () {
      setReveal(this, this.getAttribute("aria-pressed") !== "true");
    });
  }
  var pushed = false;

  function isOpen() {
    return location.hash === "#signup" && root.getAttribute("data-auth") === "out";
  }
  function setStep(n) {
    step = n;
    view.setAttribute("data-step", n);
    for (var i = 0; i < pages.length; i++) pages[i].hidden = +pages[i].getAttribute("data-signup-step") !== n;
    for (var j = 0; j < steps.length; j++) {
      steps[j].classList.toggle("is-reached", j < n);
      steps[j].classList.toggle("is-current", j === n - 1);
      steps[j].classList.toggle("is-passed", j < n - 1);
      if (j === n - 1) steps[j].setAttribute("aria-current", "step");
      else steps[j].removeAttribute("aria-current");
    }
    window.scrollTo(0, 0);
  }
  function reset() {
    var inputs = view.querySelectorAll("input");
    for (var i = 0; i < inputs.length; i++) {
      if (inputs[i].type === "checkbox" || inputs[i].type === "radio") inputs[i].checked = false;
      else inputs[i].value = "";
    }
    dupChecked.id = dupChecked.nickname = false;
    view.querySelector(".verified").hidden = true;
    for (var r = 0; r < reveals.length; r++) setReveal(reveals[r], false);
    var fs = form.querySelectorAll(".sfield");
    for (var k = 0; k < fs.length; k++) setMsg(fs[k], null);
    syncTerms();
    syncVerify();
    setStep(1);
  }
  function render() {
    var open = isOpen();
    var was = root.getAttribute("data-view") === "signup";
    view.hidden = !open;
    if (open) {
      if (!was) reset();
      root.setAttribute("data-view", "signup");
      moTitle.textContent = "회원가입";
    } else if (was) {
      root.removeAttribute("data-view");
      moTitle.innerHTML = moTitle.getAttribute("data-page-title");
    }
    // 시안: 회원가입 화면에서는 하단 내비 "내 정보"가 선택됨
    if (bnAccount) bnAccount.classList.toggle("is-active", open);
    if (bnPage && (open || was)) bnPage.classList.toggle("is-active", !open);
  }
  function close() {
    if (location.hash !== "#signup") return;
    if (pushed) {
      pushed = false;
      history.back();
    } else {
      history.replaceState(null, "", location.pathname + location.search);
      render();
    }
  }

  var opens = document.querySelectorAll("[data-signup-open]");
  for (var o = 0; o < opens.length; o++) opens[o].addEventListener("click", function (e) {
    e.preventDefault();
    if (location.hash !== "#signup") {
      location.hash = "signup";
      pushed = true;
    }
  });
  window.addEventListener("hashchange", function () {
    if (location.hash !== "#signup") pushed = false;
    render();
  });
  new MutationObserver(render).observe(root, { attributes: true, attributeFilter: ["data-auth"] });

  // 앱바 뒤로 가기
  var backs = document.querySelectorAll("[data-login-back]");
  for (var b = 0; b < backs.length; b++) backs[b].addEventListener("click", function (e) {
    if (root.getAttribute("data-view") !== "signup") return;
    e.preventDefault();
    if (step === 2 || step === 3) setStep(step - 1);
    else close();
  });
  var prevs = view.querySelectorAll("[data-signup-prev]");
  for (var p = 0; p < prevs.length; p++) prevs[p].addEventListener("click", function () { setStep(step - 1); });

  /* 1. 약관 — 전체 동의는 전부 켜고 끔, 필수 4개가 모두 켜져야 다음 */
  var all = view.querySelector("[data-terms-all]");
  var terms = view.querySelectorAll("[data-terms]");
  var next1 = pages[0].querySelector("[data-signup-next]");
  function syncTerms() {
    var every = true, required = true;
    for (var i = 0; i < terms.length; i++) {
      if (!terms[i].checked) {
        every = false;
        if (terms[i].required) required = false;
      }
    }
    all.checked = every;
    next1.disabled = !required;
  }
  all.addEventListener("change", function () {
    for (var i = 0; i < terms.length; i++) terms[i].checked = all.checked;
    syncTerms();
  });
  for (var t = 0; t < terms.length; t++) terms[t].addEventListener("change", syncTerms);
  next1.addEventListener("click", function () { setStep(2); });

  /* 2. 본인인증 — 수단을 고르면 다음. 데모: 실제 인증 창 없이 바로 인증 완료로 표시 */
  var methods = view.querySelectorAll('input[name="verify"]');
  var next2 = pages[1].querySelector("[data-signup-next]");
  var verified = view.querySelector(".verified");
  function syncVerify() {
    var picked = false;
    for (var i = 0; i < methods.length; i++) if (methods[i].checked) picked = true;
    next2.disabled = !picked;
    verified.hidden = !picked;
  }
  for (var m = 0; m < methods.length; m++) methods[m].addEventListener("change", syncVerify);
  next2.addEventListener("click", function () {
    setStep(3);
    form.elements.id.focus({ preventScroll: true });
  });

  /* 3. 정보 입력 — 칸을 벗어날 때와 가입하기를 누를 때 검사 */
  // 아이디·닉네임은 중복 확인을 눌러야 통과. 값을 고치면 다시 확인
  var dupChecked = { id: false, nickname: false };
  var TAKEN = { // 데모용 이미 쓰는 값
    id: ["admin", "funnation", "test", "guest"],
    nickname: ["펀네", "운영자", "관리자"]
  };
  var RULES = {
    id: function (v) {
      if (!v) return "아이디를 입력해주세요.";
      if (!/^[a-z0-9]{4,16}$/.test(v)) return "영문 소문자, 숫자 4~16자로 입력해주세요.";
      if (!dupChecked.id) return "아이디 중복 확인을 해주세요.";
      return "";
    },
    password: function (v) {
      if (!v) return "비밀번호를 입력해주세요.";
      if (v.length < 8 || !/[A-Za-z]/.test(v) || !/[0-9]/.test(v) || !/[^A-Za-z0-9]/.test(v))
        return "영문·숫자·특수문자를 모두 포함해 8~20자로 입력해주세요.";
      return "";
    },
    password2: function (v) {
      if (!v) return "비밀번호를 한 번 더 입력해주세요.";
      if (v !== form.elements.password.value) return "비밀번호가 일치하지 않아요.";
      return "";
    },
    nickname: function (v) {
      if (!v) return "닉네임을 입력해주세요.";
      if (!/^[가-힣A-Za-z0-9]{2,10}$/.test(v)) return "한글, 영문, 숫자 2~10자로 입력해주세요.";
      if (!dupChecked.nickname) return "닉네임 중복 확인을 해주세요.";
      return "";
    },
    email: function (v) {
      if (v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "이메일 형식이 올바르지 않아요.";
      return "";
    }
  };
  var OK = {
    id: "사용 가능한 아이디예요.",
    password: "사용 가능한 비밀번호예요.",
    password2: "비밀번호가 일치해요.",
    nickname: "사용 가능한 닉네임이에요."
  };
  var hints = {};
  var sfields = form.querySelectorAll(".sfield");
  for (var h = 0; h < sfields.length; h++) {
    var msg = sfields[h].querySelector(".sfield__msg");
    hints[sfields[h].querySelector("input").name] = msg.textContent;
  }
  // state: null = 안내 문구, "error" = 빨강, "ok" = 파랑
  function setMsg(field, state, text) {
    var input = field.querySelector("input");
    var msg = field.querySelector(".sfield__msg");
    field.classList.toggle("is-error", state === "error");
    field.classList.toggle("is-ok", state === "ok");
    if (state === "error") input.setAttribute("aria-invalid", "true");
    else input.removeAttribute("aria-invalid");
    msg.textContent = text != null ? text : hints[input.name];
  }
  function check(input) {
    var field = input.closest(".sfield");
    // 비밀번호는 공백도 문자로 취급, 나머지는 앞뒤 공백 무시
    var v = input.name.indexOf("password") === 0 ? input.value : input.value.trim();
    var err = RULES[input.name](v);
    if (err) setMsg(field, "error", err);
    else if (OK[input.name] && input.value) setMsg(field, "ok", OK[input.name]);
    else setMsg(field, null);
    return !err;
  }
  var inputs = form.querySelectorAll(".sfield__input");
  // 아래 버튼을 누르는 중이면 칸을 벗어날 때 검사하지 않음 — 문구가 새로 생겨 버튼이 밀리면 클릭이 빠짐.
  // 다음은 누를 때 전체를 검사하고, 뒤로가기는 검사할 필요 없음
  var pressing = false;
  var actions3 = form.querySelector(".signup__actions");
  actions3.addEventListener("pointerdown", function () { pressing = true; });
  document.addEventListener("pointerup", function () { pressing = false; });
  document.addEventListener("pointercancel", function () { pressing = false; });
  for (var q = 0; q < inputs.length; q++) {
    inputs[q].addEventListener("blur", function () {
      // 비어 있는 칸을 그냥 지나칠 땐 혼내지 않음
      if (this.value && !pressing) check(this);
    });
    inputs[q].addEventListener("input", function () {
      var field = this.closest(".sfield");
      if (this.name in dupChecked) dupChecked[this.name] = false;
      if (field.classList.contains("is-error")) check(this);
      if (this.name === "password" && form.elements.password2.value) check(form.elements.password2);
    });
  }
  // 중복 확인 — 형식이 맞으면 데모 목록과 비교
  var dups = view.querySelectorAll("[data-dup-check]");
  for (var u = 0; u < dups.length; u++) dups[u].addEventListener("click", function () {
    var name = this.getAttribute("data-dup-check");
    var input = form.elements[name];
    var field = input.closest(".sfield");
    var v = input.value.trim();
    dupChecked[name] = true; // 형식 검사만 보려고 잠시 통과로 둠
    var err = RULES[name](v);
    dupChecked[name] = false;
    if (!err && TAKEN[name].indexOf(v) !== -1)
      err = name === "id" ? "이미 사용 중인 아이디예요." : "이미 사용 중인 닉네임이에요.";
    if (err) {
      setMsg(field, "error", err);
      input.focus();
      return;
    }
    dupChecked[name] = true;
    setMsg(field, "ok", OK[name]);
  });
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    // 시안 확인용: 필수 칸이 모두 채워져 있으면 형식·중복 확인 오류가 있어도 다음으로 넘김
    var filled = true;
    for (var f = 0; f < inputs.length; f++) {
      if (inputs[f].required && !inputs[f].value) filled = false;
    }
    if (filled) { finish(); return; }
    var first = null;
    for (var i = 0; i < inputs.length; i++) {
      if (!check(inputs[i]) && !first) first = inputs[i];
    }
    if (first) { first.focus(); return; }
    finish();
  });

  /* 4. 가입 완료 — 시작하기를 누르면 로그인 상태로 홈 화면 */
  function finish() {
    setStep(4);
  }
  view.querySelector("[data-signup-finish]").addEventListener("click", function () {
    history.replaceState(null, "", location.pathname + location.search);
    pushed = false;
    root.setAttribute("data-auth", "in");
    try { localStorage.setItem("funnation-auth", "in"); } catch (e) {}
    render();
    window.scrollTo(0, 0);
  });

  render();
})();

/* 홈 · 라이브 방송 — 방송/영상 썸네일을 누르면 영상 상세(watch.html)로 이동.
   서버 연동 전이라 어떤 썸네일이든 같은 데모 영상을 연다. 광고 카드는 제외 */
(function () {
  var thumbs = document.querySelectorAll(".card:not(.card--ad) .card__thumb, .vod-card .vod-card__thumb");
  for (var i = 0; i < thumbs.length; i++) {
    var card = thumbs[i].closest(".card, .vod-card");
    var title = card && card.querySelector(".card__title, .vod-card__title");
    thumbs[i].setAttribute("role", "link");
    thumbs[i].setAttribute("tabindex", "0");
    thumbs[i].setAttribute("aria-label", (title ? title.textContent.trim() + " " : "") + "영상 보기");
    thumbs[i].classList.add("is-link");
    thumbs[i].addEventListener("click", go);
    thumbs[i].addEventListener("keydown", function (e) {
      if (e.key === "Enter") go();
    });
  }
  function go() {
    location.href = "watch.html";
  }
})();

/* 영상 상세 ver.3 (64795:14999) — 채팅 · 후원 패널 4종. 서버 연동 전 데모라 보내거나 결제하지 않음 */
(function () {
  var root = document.documentElement;
  var watch = document.querySelector(".watch");
  if (!watch) return;

  // 채팅 입력 — 엔터로 목록 맨 아래에 내 메시지 추가
  var list = document.getElementById("wchat-list");
  var chatForm = document.getElementById("wchat-form");
  list.scrollTop = list.scrollHeight;
  chatForm.addEventListener("submit", function (e) {
    e.preventDefault();
    var input = chatForm.elements.msg;
    var text = input.value.trim();
    if (!text) return;
    var li = document.createElement("li");
    li.className = "wmsg wmsg--mine";
    li.innerHTML = '<span class="wmsg__avatar wmsg__avatar--white" aria-hidden="true"></span><p><span class="wmsg__name">@나</span><span class="wmsg__text"></span></p>';
    li.querySelector(".wmsg__text").textContent = text;
    list.appendChild(li);
    input.value = "";
    list.scrollTop = list.scrollHeight;
  });

  // 이모티콘 — 입력칸에 😊 추가 / 좋아요 — 누를 때마다 켜고 끔
  watch.querySelector("[data-chat-emoji]").addEventListener("click", function () {
    var input = chatForm.elements.msg;
    input.value += "😊";
    input.focus();
  });
  watch.querySelector("[data-chat-like]").addEventListener("click", function () {
    this.setAttribute("aria-pressed", this.getAttribute("aria-pressed") === "true" ? "false" : "true");
  });

  /* 플레이어 버튼 (샘플) — 음소거 · 자막 · 나중에 볼 동영상은 켜고 끔, 전체화면은 플레이어만 꽉 채움 */
  var ytToggles = watch.querySelectorAll("[data-yt-toggle]");
  for (var y = 0; y < ytToggles.length; y++) ytToggles[y].addEventListener("click", function () {
    this.setAttribute("aria-pressed", this.getAttribute("aria-pressed") === "true" ? "false" : "true");
  });
  var yt = watch.querySelector(".yt");
  watch.querySelector("[data-yt-fs]").addEventListener("click", function () {
    if (document.fullscreenElement) document.exitFullscreen();
    else if (yt.requestFullscreen) yt.requestFullscreen();
  });

  /* 채팅 ↔ 후원하기 탭 — 후원하기는 종류 탭(일반후원·시그니처·영상·미션) + 패널, 마지막에 고른 종류를 기억.
     입력줄 $ 버튼도 후원하기로 넘어감. show(null) 은 채팅으로 돌아감 */
  var chat = document.getElementById("wchat");
  var modeTabs = watch.querySelectorAll(".wchat__mode-tab");
  var tabs = watch.querySelectorAll("[data-donate]");
  var panels = watch.querySelectorAll("[data-donate-panel]");
  var current = null;
  var lastKind = "general";
  function show(key) {
    current = key;
    if (key) lastKind = key;
    chat.setAttribute("data-mode", key ? "donate" : "chat");
    for (var m = 0; m < modeTabs.length; m++) modeTabs[m].setAttribute("aria-selected", (modeTabs[m].getAttribute("data-chat-tab") === "donate") === !!key ? "true" : "false");
    for (var i = 0; i < panels.length; i++) panels[i].hidden = panels[i].getAttribute("data-donate-panel") !== key;
    for (var j = 0; j < tabs.length; j++) tabs[j].setAttribute("aria-pressed", tabs[j].getAttribute("data-donate") === key ? "true" : "false");
    if (!key) list.scrollTop = list.scrollHeight;
  }
  var modeBtns = watch.querySelectorAll("[data-chat-tab]");
  for (var b = 0; b < modeBtns.length; b++) modeBtns[b].addEventListener("click", function () {
    show(this.getAttribute("data-chat-tab") === "donate" ? lastKind : null);
  });
  for (var k = 0; k < tabs.length; k++) tabs[k].addEventListener("click", function () {
    show(this.getAttribute("data-donate"));
  });

  // 글자 수 표시 (0/200) — 200자를 넘겨 입력할 수 있고, 넘으면 오류 문구로 알림
  var counted = watch.querySelectorAll("[data-count]");
  for (var n = 0; n < counted.length; n++) counted[n].addEventListener("input", function () {
    var box = this.closest(".dmsg__box, .dmission__field");
    box.querySelector(".dmsg__count, .dmission__count").textContent = this.value.length + "/200";
  });

  // 익명 — 켜면 닉네임 자리에 "익명"
  var anons = watch.querySelectorAll("[data-donate-anon]");
  for (var a = 0; a < anons.length; a++) anons[a].addEventListener("change", function () {
    this.closest(".dmsg").querySelector("[data-donate-nick]").textContent = this.checked ? "익명" : "토비라마";
  });

  // 음성 읽기 켜기/끄기 · 목소리 바꾸기
  var VOICES = ["야옹이", "유나", "민준", "서연"];
  var vols = watch.querySelectorAll("[data-donate-vol]");
  for (var v = 0; v < vols.length; v++) vols[v].addEventListener("click", function () {
    var on = this.getAttribute("aria-pressed") !== "true";
    this.setAttribute("aria-pressed", on ? "true" : "false");
  });
  var voices = watch.querySelectorAll("[data-donate-voice]");
  for (var w = 0; w < voices.length; w++) voices[w].addEventListener("click", function () {
    var label = this.querySelector("span");
    label.textContent = VOICES[(VOICES.indexOf(label.textContent) + 1) % VOICES.length];
  });

  /* 후원 금액 — 숫자만 받아 천 단위 쉼표, 칩은 더하기, 전액은 내 펀캐시 전부. 0원이면 지우기 버튼 숨김 */
  var BALANCE = 100000;
  function fmt(n) { return n.toLocaleString("ko-KR"); }
  function setAmount(input, n, typing) {
    input.value = n || !typing ? fmt(n) : "";
    input.closest(".damount__box").classList.toggle("is-empty", !n);
  }
  function amountOf(input) { return +input.value.replace(/[^0-9]/g, "") || 0; }
  watch.addEventListener("click", function (e) {
    var chip = e.target.closest("[data-add]");
    var clear = e.target.closest("[data-donate-clear]");
    if (!chip && !clear) return;
    var input = (chip || clear).closest(".damount").querySelector("[data-donate-amount]");
    if (clear) setAmount(input, 0);
    else {
      var add = chip.getAttribute("data-add");
      setAmount(input, add === "all" ? BALANCE : Math.min(amountOf(input) + +add, 99999999));
    }
    var sig = input.closest(".donate").querySelector('.dsig__item[aria-pressed="true"]');
    if (sig) sig.setAttribute("aria-pressed", "false");
    check(input.closest(".donate"));
  });
  var amounts = watch.querySelectorAll("[data-donate-amount]");
  for (var m = 0; m < amounts.length; m++) amounts[m].addEventListener("input", function () {
    setAmount(this, Math.min(amountOf(this), 99999999), true);
  });

  // 시그니처 — 고르면 그 금액이 들어감, 오른쪽 화살표로 다음 묶음. 항목이 없으면 "등록된 시그니처 없음"
  var sigs = watch.querySelectorAll(".dsig__item");
  for (var g = 0; g < sigs.length; g++) sigs[g].addEventListener("click", function () {
    for (var i = 0; i < sigs.length; i++) sigs[i].setAttribute("aria-pressed", sigs[i] === this ? "true" : "false");
    setAmount(this.closest(".donate").querySelector("[data-donate-amount]"), +this.getAttribute("data-price"));
    check(this.closest(".donate"));
  });
  var grid = watch.querySelector("[data-sig-grid]");
  watch.querySelector("[data-sig-next]").addEventListener("click", function () {
    var end = grid.scrollLeft + grid.clientWidth >= grid.scrollWidth - 2;
    grid.scrollLeft = end ? 0 : grid.scrollLeft + 188;
  });
  if (!sigs.length) {
    grid.parentNode.hidden = true;
    watch.querySelector("[data-sig-empty]").hidden = false;
  }

  // 영상 시작·종료 시간 — 숫자만, mm:ss 로 맞춤
  var times = watch.querySelectorAll("[data-time]");
  for (var h = 0; h < times.length; h++) times[h].addEventListener("input", function () {
    var d = this.value.replace(/[^0-9]/g, "").slice(0, 4);
    this.value = d.length > 2 ? d.slice(0, d.length - 2) + ":" + d.slice(-2) : d;
  });

  /* 입력 확인 (64617:28170) — 서버 연동 전 데모 규칙.
     글자 수·금지어·금액은 입력하는 대로, 빈 필수 항목은 후원하기를 누른 뒤부터 알림.
     최소 금액은 영상 후원 10,000원(시안 "최소금액표시"), 나머지 1,000원 */
  var BANNED = ["씨발", "시발", "병신", "개새끼"];
  var MAX_CLIP = 300; // 영상 후원 최대 재생 시간(초)
  function secOf(input) {
    var d = input.value.replace(/[^0-9]/g, "");
    if (!d) return null;
    return (d.length > 2 ? +d.slice(0, -2) : 0) * 60 + +d.slice(-2);
  }
  function warn(el, msg, field) {
    el.textContent = msg ? "⚠️ " + msg : "";
    el.hidden = !msg;
    if (field) for (var i = 0; i < field.length; i++) field[i].classList.toggle("is-warn", !!msg);
    return !msg;
  }
  function check(panel, all) {
    if (panel.hasAttribute("data-tried")) all = true;
    var ok = true;
    var msg = panel.querySelector("[data-donate-msg]");
    var text = msg.value;
    ok = warn(msg.closest(".dmsg").querySelector("[data-warn]"),
      text.length > 200 ? "후원메세지는 200자 이내로 입력해주세요"
        : BANNED.some(function (b) { return text.indexOf(b) > -1; }) ? "후원메세지에 사용할 수 없는 표현이 포함되어 있어요" : "",
      [msg.closest(".dmsg__box")]) && ok;

    var amount = panel.querySelector("[data-donate-amount]");
    var won = amountOf(amount);
    var min = panel.getAttribute("data-donate-panel") === "video" ? 10000 : 1000;
    ok = warn(amount.closest(".damount").querySelector("[data-warn]"),
      won > BALANCE ? "보유캐시가 부족합니다" : (won || all) && won < min ? "최소 " + fmt(min) + "원 이상" : "",
      [amount.closest(".damount__box")]) && ok;

    var key = panel.getAttribute("data-donate-panel");
    if (key === "signature") {
      var picked = panel.querySelector('.dsig__item[aria-pressed="true"]');
      ok = warn(panel.querySelector("[data-warn-sig]"),
        picked && picked.hasAttribute("data-unavailable") ? "선택한 시그니처를 사용할 수 없습니다. 다른 항목을 선택해주세요"
          : all && !picked && sigs.length ? "후원할 시그니처를 선택해주세요" : "") && ok;
    }
    if (key === "video") {
      var url = panel.querySelector("[data-video-url]");
      var u = url.value.trim();
      ok = warn(panel.querySelector("#d-video-url-warn"),
        !u ? (all ? "영상 URL을 입력해주세요" : "")
          : /^(https?:\/\/)?(www\.|m\.)?(youtube\.com\/(watch\?v=|shorts\/|live\/)|youtu\.be\/)[\w-]{6,}/.test(u) ? ""
          : "지원되는 Youtube 영상 URL을 입력해주세요",
        [url.closest(".dfield")]) && ok;
      var start = panel.querySelector("[data-video-start]");
      var end = panel.querySelector("[data-video-end]");
      var s0 = secOf(start), s1 = secOf(end);
      ok = warn(panel.querySelector("#d-video-time-warn"),
        s0 === null || s1 === null ? ""
          : s1 <= s0 ? "종료 시간은 시작 시간보다 늦어야 합니다"
          : s1 - s0 > MAX_CLIP ? "허용된 영상 재생 시간을 초과했습니다" : "",
        [start.closest(".dfield"), end.closest(".dfield")]) && ok;
    }
    if (key === "mission") {
      var title = panel.querySelector("[data-mission-title]");
      var body = panel.querySelector("[data-mission-body]");
      var LONG = "입력 가능한 글자 수를 초과했습니다";
      ok = warn(panel.querySelector("#d-mission-title-warn"),
        title.value.length > 200 ? LONG : all && !title.value.trim() ? "미션 제목을 입력해주세요" : "",
        [title.closest(".dmission__box")]) && ok;
      ok = warn(panel.querySelector("#d-mission-body-warn"), body.value.length > 200 ? LONG : "",
        [body.closest(".dmission__box")]) && ok;
    }
    panel.querySelector("[data-warn-form]").hidden = ok || !panel.hasAttribute("data-tried");
    return ok;
  }
  for (var q = 0; q < panels.length; q++) {
    panels[q].addEventListener("input", function () { check(this); });
    check(panels[q]);
  }

  /* 후원하기 — 확인을 통과하면 펀캐시를 빼고 채팅에 후원 메시지를 남긴 뒤 패널을 닫음.
     실패 화면(64624:81159)은 주소에 ?donate=fail 을 붙이면 첫 시도에서 한 번 보여줌 (오프라인이면 늘) */
  var fail = watch.querySelector("#donate-fail");
  var failOnce = /[?&]donate=fail\b/.test(location.search);
  var pending = null;
  function reset(panel) {
    panel.removeAttribute("data-tried");
    var fields = panel.querySelectorAll("textarea, input[type=text]:not([data-donate-amount]), input[type=url]");
    for (var i = 0; i < fields.length; i++) {
      fields[i].value = "";
      fields[i].dispatchEvent(new Event("input", { bubbles: true }));
    }
    setAmount(panel.querySelector("[data-donate-amount]"), 5000);
    var picked = panel.querySelector('.dsig__item[aria-pressed="true"]');
    if (picked) picked.setAttribute("aria-pressed", "false");
    check(panel);
  }
  function donate(panel) {
    if (failOnce || !navigator.onLine) {
      failOnce = false;
      pending = panel;
      fail.hidden = false;
      fail.querySelector("[data-donate-retry]").focus();
      return;
    }
    var won = amountOf(panel.querySelector("[data-donate-amount]"));
    BALANCE -= won;
    var bals = watch.querySelectorAll("[data-donate-balance]");
    for (var i = 0; i < bals.length; i++) bals[i].textContent = fmt(BALANCE);
    var li = document.createElement("li");
    li.className = "wmsg wmsg--mine";
    li.innerHTML = '<span class="wmsg__avatar wmsg__avatar--white" aria-hidden="true"></span><p><span class="wmsg__name"></span><span class="wmsg__text"></span></p>';
    li.querySelector(".wmsg__name").textContent = "@" + panel.querySelector("[data-donate-nick]").textContent;
    var note = panel.querySelector("[data-donate-msg]").value.trim();
    li.querySelector(".wmsg__text").textContent = "💰 " + fmt(won) + "원 후원" + (note ? " · " + note : "");
    list.appendChild(li);
    list.scrollTop = list.scrollHeight;
    reset(panel);
    show(null);
  }
  var submits = watch.querySelectorAll("[data-donate-submit]");
  for (var t = 0; t < submits.length; t++) submits[t].addEventListener("click", function () {
    var panel = this.closest(".donate");
    panel.setAttribute("data-tried", "");
    if (check(panel)) donate(panel);
    else {
      var bad = panel.querySelector(".is-warn input, .is-warn textarea, .dwarn:not([hidden])");
      if (bad) bad.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  });
  function closeFail() {
    fail.hidden = true;
    var panel = pending;
    pending = null;
    return panel;
  }
  fail.querySelector("[data-donate-retry]").addEventListener("click", function () {
    var panel = closeFail();
    if (panel) donate(panel);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !fail.hidden) {
      e.stopImmediatePropagation();
      var panel = closeFail();
      if (panel) panel.querySelector("[data-donate-submit]").focus();
    }
  }, true);
})();

/* PC 알림 팝업 (64686:113964) — GNB 종 아이콘으로 열고 닫음. X · 바깥 클릭 · ESC 로도 닫힘.
   목록은 모바일 알림 화면(#notice-view)과 같은 내용이라 복사해 씀 */
(function () {
  var btn = document.getElementById("notice-btn");
  var pop = document.getElementById("notice-pop");
  if (!btn || !pop) return;
  var body = pop.querySelector("[data-notice-body]");
  var groups = document.querySelectorAll("#notice-view .notice-group");
  for (var i = 0; i < groups.length; i++) {
    var copy = groups[i].cloneNode(true);
    copy.removeAttribute("data-node-id");
    body.appendChild(copy);
  }
  function toggle(open) {
    pop.hidden = !open;
    btn.setAttribute("aria-expanded", open ? "true" : "false");
  }
  btn.addEventListener("click", function () { toggle(pop.hidden); });
  pop.querySelector("[data-notice-close]").addEventListener("click", function () {
    toggle(false);
    btn.focus();
  });
  document.addEventListener("click", function (e) {
    if (!pop.hidden && !pop.contains(e.target) && !btn.contains(e.target)) toggle(false);
  });
  // 캡처 단계에서 먼저 받아, 영상 상세의 후원 패널처럼 ESC 를 쓰는 다른 화면은 함께 닫히지 않게 함
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !pop.hidden) {
      e.stopImmediatePropagation();
      toggle(false);
      btn.focus();
    }
  }, true);
})();
