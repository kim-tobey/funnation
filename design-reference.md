# 펀네이션 v2.0 — 상세 디자인 근거

기준일: 2026-10-27 (Asia/Seoul). 사용자가 지정한 디자인 시스템과 홈 UI를 읽기 전용으로 확인했다.
핵심 실행 규칙은 [design.md](design.md)를 따른다. 이 파일은 필요한 항목만 찾아 읽는 상세 참조이며 CLAUDE.md에서 전체 import할 필요는 없다.

## 자료의 적용 범위

- 공통 색상: Color의 현재 Theme Dark 표. 공통 서체: Typography의 Font 표와 실제 TextStyle 단위를 대조했다.
- 간격·레이아웃: 활성 Spacing·Radius·Layout·Screen 설명과 렌더를 확인했다. 진열판 자체의 여백은 제외했다.
- PC 홈: 로그인 버튼 상태 65161:72175, 지갑·스튜디오 상태 65183:66457.
- 모바일 홈: 65183:130577. 검색 65183:135805·65183:136304, 알림 65183:136807은 별도 화면이다.
- 값은 확인된 원본 기준이다. 표/스타일/실제 인스턴스가 다른 경우 각각의 근거와 차이를 남겼다.
- 기존 코드·폰트·자산 파일은 미제공이므로 실제 코드 경로와 props·CSS 변수 매핑은 확정하지 않았다.
- 프레임 치수는 해당 시안의 측정값이다. 고정 viewport·페이지 높이·CSS absolute 배치로 자동 변환하지 않는다.
- Figma 문서 이름이나 레이어명과 실제 글자가 다른 경우, 렌더와 실제 text/style 속성을 우선 대조했다.

## A. 색상과 타이포그래피

- 조사 방식: 읽기 전용 Figma MCP 고정밀 context, 변수 정의, 스크린샷, native TextStyle/PaintStyle. 원본 수정 없음.
- 아래 값은 제공된 파일에서 직접 확인한 값이다. 실제 저장소의 CSS 변수/컴포넌트명/폰트 파일 경로는 아직 조사하지 않았다.
- 역할 명칭은 원본 Figma 철자를 보존한다. 예: `Tertial`, `Depth Disable`.

### 1. 핵심 결론

1. 현재 색상 근거는 **Color > Theme의 Dark 표**다. `Semantic/Brand/Primary=#4A92FF`. Theme에 light 팔레트는 확인되지 않았다.
2. 기본 UI 글꼴은 **Pretendard**라고 Font 소개에 명시되어 있다. 하지만 실제 Display와 강조 제목에는 **Sandoll Mapssi, Sandoll Gyeokdonggulim, S-Core Dream**이 사용된다. 모든 글자를 Pretendard로 통일하면 시안을 재현하지 못한다.
3. 원본 **Typography > Font** 표의 `Display/D1`, `Headline/H5`, `Body/B1` 등의 스타일을 사용해야 한다. 옆의 **Typography Example**은 `Display 1/Bold` 56px, `Body 1/Normal - Medium` 16px, Pretendard JP 등 별도 스타일 체계다. 이를 현재 제품 토큰과 합치지 않는다.
4. **Color Example은 완료된 규칙으로 보기 어렵다.** 머리말에 “나중에 작성할 내용”이 명시되어 있고, 예시의 `Semantic/Primary/Normal=#0066FF`는 현재 Theme의 브랜드 값과 다르다. Strong/Heavy 설명에는 현재 사용하지 않는다는 문구도 있다. 따라서 예제에서 색을 자동 채택하면 안 된다.
5. `get_variable_defs`의 숫자만 보고 CSS 단위를 정하면 오류가 난다. 원본 TextStyle API로 단위를 검증했다. 예: 자간 `-1`은 **-1% = -0.01em**, `Body/B2`의 `-0.75`는 **-0.75% = -0.0075em**이다.

### 2. 근거 노드

| 대상 | 노드 ID | 링크 |
|---|---|---|
| DS 페이지 | `64800:100375` | [Figma](https://www.figma.com/design/7zkpaY37QfFiFvikeX9P6J/%ED%8E%80%EB%84%A4%EC%9D%B4%EC%85%98-v2.0?node-id=64800-100375) |
| Color Theme | `65095:90606` | [Figma](https://www.figma.com/design/7zkpaY37QfFiFvikeX9P6J/%ED%8E%80%EB%84%A4%EC%9D%B4%EC%85%98-v2.0?node-id=65095-90606) |
| Color Example | `65026:22178` | [Figma](https://www.figma.com/design/7zkpaY37QfFiFvikeX9P6J/%ED%8E%80%EB%84%A4%EC%9D%B4%EC%85%98-v2.0?node-id=65026-22178) |
| Color Example 미완성 메모 | `65026:22184` | [Figma](https://www.figma.com/design/7zkpaY37QfFiFvikeX9P6J/%ED%8E%80%EB%84%A4%EC%9D%B4%EC%85%98-v2.0?node-id=65026-22184) |
| Color Example Primary | `65026:22251` | [Figma](https://www.figma.com/design/7zkpaY37QfFiFvikeX9P6J/%ED%8E%80%EB%84%A4%EC%9D%B4%EC%85%98-v2.0?node-id=65026-22251) |
| Typography Font | `64986:50972` | [Figma](https://www.figma.com/design/7zkpaY37QfFiFvikeX9P6J/%ED%8E%80%EB%84%A4%EC%9D%B4%EC%85%98-v2.0?node-id=64986-50972) |
| Font 기본 글꼴 설명 | `64986:50980` | [Figma](https://www.figma.com/design/7zkpaY37QfFiFvikeX9P6J/%ED%8E%80%EB%84%A4%EC%9D%B4%EC%85%98-v2.0?node-id=64986-50980) |
| Display 표 | `64986:51007` | [Figma](https://www.figma.com/design/7zkpaY37QfFiFvikeX9P6J/%ED%8E%80%EB%84%A4%EC%9D%B4%EC%85%98-v2.0?node-id=64986-51007) |
| Headline 표 | `64986:51040` | [Figma](https://www.figma.com/design/7zkpaY37QfFiFvikeX9P6J/%ED%8E%80%EB%84%A4%EC%9D%B4%EC%85%98-v2.0?node-id=64986-51040) |
| Subtitle 표 | `64986:51088` | [Figma](https://www.figma.com/design/7zkpaY37QfFiFvikeX9P6J/%ED%8E%80%EB%84%A4%EC%9D%B4%EC%85%98-v2.0?node-id=64986-51088) |
| Body 표 | `64986:51144` | [Figma](https://www.figma.com/design/7zkpaY37QfFiFvikeX9P6J/%ED%8E%80%EB%84%A4%EC%9D%B4%EC%85%98-v2.0?node-id=64986-51144) |
| Inputs 표 | `64986:51244` | [Figma](https://www.figma.com/design/7zkpaY37QfFiFvikeX9P6J/%ED%8E%80%EB%84%A4%EC%9D%B4%EC%85%98-v2.0?node-id=64986-51244) |
| Button/Nav 표 | `64986:51344` | [Figma](https://www.figma.com/design/7zkpaY37QfFiFvikeX9P6J/%ED%8E%80%EB%84%A4%EC%9D%B4%EC%85%98-v2.0?node-id=64986-51344) |
| Label/Caption 표 | `65007:30052` | [Figma](https://www.figma.com/design/7zkpaY37QfFiFvikeX9P6J/%ED%8E%80%EB%84%A4%EC%9D%B4%EC%85%98-v2.0?node-id=65007-30052) |
| Typography Example | `65026:204649` | [Figma](https://www.figma.com/design/7zkpaY37QfFiFvikeX9P6J/%ED%8E%80%EB%84%A4%EC%9D%B4%EC%85%98-v2.0?node-id=65026-204649) |
| Typography Example Display1 | `65026:204665` | [Figma](https://www.figma.com/design/7zkpaY37QfFiFvikeX9P6J/%ED%8E%80%EB%84%A4%EC%9D%B4%EC%85%98-v2.0?node-id=65026-204665) |

### 3. 확인된 현재 색상 토큰

근거: Color Theme 고정밀 context 및 `get_variable_defs(65095:90606)`. 아래의 8자리 hex는 alpha를 포함한다. `#191B24E5`, `#515E71E5`처럼 알파가 있는 값을 불투명색으로 바꾸지 않는다.

#### Brand

공통 경로: `Semantic/Brand/`

| 토큰 suffix | 확인값 |
|---|---|
| `Primary` | `#4A92FF` |
| `Secondary` | `#4962FF` |
| `Tertial` | `#A72FC5` |

#### Surface Background

공통 경로: `Semantic/Surface/Background/`

| 토큰 suffix | 확인값 |
|---|---|
| `BG 100` | `#0E0E14` |
| `BG 200` | `#12131A` |
| `BG 300` | `#191B24` |
| `BG 400` | `#1F212E` |
| `BG Elevation` | `#191B24E5` |
| `BG Cancel` | `#2A2D3F` |
| `BG Disabled` | `#191B24` |
| `BG Chips` | `#2A2D3F` |
| `BG Label 100` | `#262838` |
| `BG Label 200` | `#1F212E` |
| `BG Label Live` | `#B2071D` |

#### Surface Border

공통 경로: `Semantic/Surface/Border/`

| 토큰 suffix | 확인값 |
|---|---|
| `Border 300` | `#2A2D3F` |
| `Border 100` | `#1F212E` |
| `Border 200` | `#262838` |
| `Border 400` | `#31354F` |
| `Border Strong` | `#7C8594` |

#### Surface On-Surface

공통 경로: `Semantic/Surface/On-Surface/`

| 토큰 suffix | 확인값 |
|---|---|
| `Strong` | `#FFFFFF` |
| `Depth 300` | `#969DA8` |
| `Normal` | `#DFE5ED` |
| `Depth 400` | `#7C8594` |
| `Depth 500` | `#515E71` |
| `Depth Cancel` | `#DFE5ED` |
| `Depth Disable` | `#515E71E5` |

#### Interaction Fill

공통 경로: `Semantic/Interaction/Fill/`

| 토큰 suffix | 확인값 |
|---|---|
| `Primary/Primary` | `#4A92FF` |
| `Primary/Hovered` | `#3569D1` |
| `Primary/Pressed` | `#2C5DBB` |
| `Primary/Disabled` | `#191B24` |
| `Neutral/Neutral` | `#2A2D3F` |
| `Neutral/Hovered` | `#1F212E` |
| `Neutral/Pressed` | `#31354F` |
| `Neutral/Disabled` | `#191B24` |
| `Inverse/White` | `#FFFFFF` |
| `Inverse/Hovered` | `#F6F9FE` |
| `Inverse/Pressed` | `#E7F0FD` |

#### Interaction Border

공통 경로: `Semantic/Interaction/Border/`

| 토큰 suffix | 확인값 |
|---|---|
| `Option` | `#4A92FF` |
| `Focus` | `#81B3FF` |

#### Interaction On-Primary

공통 경로: `Semantic/Interaction/On-Primary/`

| 토큰 suffix | 확인값 |
|---|---|
| `Normal` | `#FFFFFF` |
| `Hovered` | `#DFE5ED` |
| `Pressed` | `#C2C9D1` |
| `Disabled` | `#515E71` |

#### Interaction On-Inverse

공통 경로: `Semantic/Interaction/On-Inverse/`

| 토큰 suffix | 확인값 |
|---|---|
| `Normal` | `#0E0E14` |
| `Hovered` | `#0E0E14` |
| `Pressed` | `#0E0E14` |

#### System

공통 경로: `Semantic/Sys/`

| 토큰 suffix | 확인값 |
|---|---|
| `Fill/Error` | `#CD0C0C` |
| `Fill/Info` | `#3363DB` |
| `Fill/Success` | `#48D481` |
| `Fill/Warning` | `#F7DF4E` |
| `On-Sys/Light` | `#FFFFFF` |
| `On-Sys/Dark` | `#12131A` |

#### 단일 hex로 표현되지 않는 paint styles

| Paint style | 실제 구조 | 근거 |
|---|---|---|
| `Brand/Gradation` | 위→아래 선형 그라데이션: `#01B1FB` 0% → `#016BFF` 100% | Style + Theme swatch `65095:90646` |
| `Surface/Background/Body` | 방사형 그라데이션: `#1A2A4A` 0%, `#0E1428` 40%, `#07070D` 75%. 단색 아님 | Style + swatch `65095:90683` |
| `Brand/Primary-Btn-L` | `#4A92FF` 단색 paint + 이미지 paint 조합. 이미지 hash `0b5df726c175741fca4ddbf9f14b2a988d2de762` | Style + swatch `65095:90642` |

- `Brand/Primary-Btn-L`의 변수 응답 `#4A92FF,`는 완전한 배경 명세가 아니다. 일반 2색 그라데이션으로 임의 대체하지 않는다. 이미지 paint의 원본 asset과 적용 crop을 보존해야 한다.
- Body radial gradient의 native transform은 `[[0.555555582,0,0.416666657],[0,1,-0.5]]`. 64×64 swatch 고정밀 출력은 center=(9.6,64), radius=(57.6,32)였다. 즉 정규화하면 중심 15% 100%, 반경 90% 50%. 실제 화면의 배경 레이어 및 적용 영역도 함께 확인해야 한다.
- 위 transform 수치는 단독 CSS 구현값이 아니라 Figma paint 분석값이다. 실제 홈 배경을 구현할 때 이 값만으로 CSS를 확정하지 않는다. PC 홈 프레임의 추가 조명 레이어, 적용 영역, 전체 배경 구조를 함께 확인한다.
- `Interaction/Fill/Inverse/Disabled`와 `Interaction/On-Inverse/Disabled`라는 별도 변수는 이 Theme 응답에서 확인되지 않았다. 샘플 disabled는 각각 Primary disabled / On-Primary disabled 값을 재사용한다. 존재하지 않는 Figma 변수명을 만들어 문서에 넣지 않는다.
- `Line/Normal/Neutral=#70737C29`와 paint style `Semantic/Line/Normal/Neutral=#70737C`도 함께 나타나지만 이는 표본 swatch의 경계 등 별도 근거다. 현재 Surface Border 역할 토큰을 이 값으로 대체하지 않는다.

### 4. 타이포그래피 — 원본 TextStyle 단위 확인

- 컬럼의 font-size는 px다.
- line-height가 %이면 CSS 단위 없는 배율로 변환할 수 있다. PIXELS이면 고정 px를 유지한다.
- letter-spacing이 %이면 CSS em으로 변환한다. PIXELS이면 px를 유지한다.
- H1~H7은 Figma **스타일명**이다. HTML h1~h7 태그를 그대로 만드는 지시가 아니다. 문서 의미 구조에 맞는 h1~h6 등을 선택하고 스타일은 별도로 매핑한다.
- `Button/S_`, `Button/3XS_`는 실제 underline 스타일이다.
- 아래 `_a`, `3XS+`는 local TextStyle 정의까지 확인했으나 해당 Font 표에서 각각 독립 preview를 전부 확인한 것은 아니다. 실제 화면에 적용된 styleId로 선택한다.

| Figma 스타일 | 폰트 / 스타일 | 크기 | line-height | letter-spacing | 원본 사용 예 |
|---|---|---:|---|---|---|
| `Display/D1` | Sandoll Mapssi / Regular | 40 | 80.000001% (CSS 0.8) | -1% (CSS -0.01em) | 히어로 슬라이더 |
| `Display/D2` | Sandoll Gyeokdonggulim / Regular | 26 | 29px | -1% (CSS -0.01em) | 띠 광고 배너 |
| `Display/D3` | Sandoll Gyeokdonggulim / Regular | 22 | 30px | -1% (CSS -0.01em) | LNB 광고 배너 |
| `Display/D4` | Pretendard / SemiBold | 16 | 19px | -1% (CSS -0.01em) | 가로 스크롤 카드 제목 |
| `Display/D5` | Pretendard / Regular | 12 | 120.000005% (CSS 1.2) | -1% (CSS -0.01em) | 가로 스크롤 카드 설명 |
| `Headline/H1` | Pretendard / SemiBold | 22 | 28px | 0px | 모바일 NAV 제목 |
| `Headline/H2` | Pretendard / Medium | 18 | 24px | 0% (CSS 0em) | 2 Depth 제목, LNB 제목 |
| `Headline/H2_a` | Pretendard / Bold | 18 | 24px | 0% (CSS 0em) | 동일 계열 Bold 변형; local style 정의 확인 |
| `Headline/H3` | Pretendard / Bold | 14 | 22px | 0.25px | 3 Depth 제목 |
| `Headline/H4` | Pretendard / Medium | 10 | 100% (CSS 1) | 0% (CSS 0em) | 모바일 하단 내비게이션 |
| `Headline/H4_a` | Pretendard / SemiBold | 10 | 100% (CSS 1) | 0% (CSS 0em) | 동일 계열 SemiBold 변형; local style 정의 확인 |
| `Headline/H5` | S-Core Dream / 7 ExtraBold | 28 | 100% (CSS 1) | -1% (CSS -0.01em) | 페이지 제목 |
| `Headline/H6` | S-Core Dream / 7 ExtraBold | 19 | 100% (CSS 1) | -1% (CSS -0.01em) | 콘텐츠 제목, 퀵 카드 3장의 제목 |
| `Headline/H7` | Pretendard / Bold | 25 | 30px | 0% (CSS 0em) | 충전 5,000 등 표시 예 |
| `Subtitle/S1` | Pretendard / Bold | 16 | 20px | 0% (CSS 0em) | 섹션 제목, 썸네일 제목 |
| `Subtitle/S2` | Pretendard / SemiBold | 16 | 100% (CSS 1) | -1% (CSS -0.01em) | 후원이 즐거워지는 등 인사말 |
| `Subtitle/S3` | Pretendard / SemiBold | 14 | 160.000002% (CSS 1.6) | -1% (CSS -0.01em) | 보조 안내 문장 예 |
| `Subtitle/S4` | Pretendard / SemiBold | 13 | 160.000002% (CSS 1.6) | -1% (CSS -0.01em) | 짧은 보조 안내 문장 예 |
| `Body/B1` | Pretendard / Regular | 14 | 150% (CSS 1.5) | 0% (CSS 0em) | 기본 바탕체(원본 별표 표시) |
| `Body/B2` | Pretendard / SemiBold | 13 | 150% (CSS 1.5) | -0.75% (CSS -0.0075em) | 내 펀캐시 |
| `Body/B3` | Pretendard / Bold | 12 | 150% (CSS 1.5) | 0px | 크리에이터/닉네임 예 |
| `Body/B4` | Pretendard / Regular | 12 | 150% (CSS 1.5) | 0px | 24,561회 등 수치 |
| `Inputs/I1` | Pretendard / Regular | 19 | 150% (CSS 1.5) | 0px | 텍스트 필드 기본 |
| `Inputs/I2` | Pretendard / Regular | 18 | 24px | 0.15px | 로그인 텍스트 필드 |
| `Inputs/I3` | Pretendard / Medium | 12 | 16px | 0.4px | 로그인 라벨, 알림/오류 메시지 |
| `Inputs/I4` | Pretendard / Bold | 16 | 19px | 0% (CSS 0em) | 라벨 |
| `Inputs/I5` | Pretendard / Medium | 14 | 22px | 0.25px | 검색바: 크리에이터/동영상 검색 |
| `Button/3XL` | Pretendard / Bold | 18 | 20px | 0px | 큰 로그인 버튼 |
| `Button/2XL` | Pretendard / SemiBold | 16 | 100% (CSS 1) | -1% (CSS -0.01em) | 뒤로가기/다음 |
| `Button/XL` | Pretendard / Regular | 16 | 19px | 0% (CSS 0em) | 채팅 등 비활성 탭 |
| `Button/XL+` | Pretendard / Bold | 16 | 19px | 0% (CSS 0em) | 후원하기 등 활성 탭 |
| `Button/L` | Pretendard / SemiBold | 15 | 13.235294px | 0% (CSS 0em) | 작은 로그인 버튼 |
| `Button/M` | Pretendard / Medium | 14 | 100% (CSS 1) | -1% (CSS -0.01em) | 내비게이션/탭 기본 |
| `Button/M+` | Pretendard / SemiBold | 14 | 100% (CSS 1) | -1% (CSS -0.01em) | 내비게이션/탭 활성 |
| `Button/S` | Pretendard / Bold | 14 | 100% (CSS 1) | 0% (CSS 0em) | 사용 가이드 보기/텍스트 액션; 아래 충돌 참고 |
| `Button/S_` | Pretendard / Bold | 14 | 100% (CSS 1) | 0% (CSS 0em) | 전체보기 등 밑줄 텍스트 액션 · 밑줄 |
| `Button/XS` | Pretendard / SemiBold | 13 | 100% (CSS 1) | -1% (CSS -0.01em) | 방송 시작하기 |
| `Button/XXS` | S-Core Dream / 8 Heavy | 16 | 19px | -1% (CSS -0.01em) | 라이브 pill; 아래 충돌 참고 |
| `Button/3XS` | Pretendard / Medium | 12 | 16px | 0px | 작은 필터 기본 |
| `Button/3XS+` | Pretendard / Bold | 12 | 16px | 0px | 작은 필터 Bold; local style 정의 확인 |
| `Button/3XS_` | Pretendard / Bold | 12 | 16px | 0px | 더 알아보기 등 밑줄 액션 · 밑줄 |
| `Label/L1` | Pretendard / Bold | 14 | 14px | 0% (CSS 0em) | 펀네이션 라벨 |
| `Label/L2` | Pretendard / Bold | 11 | 16px | 0.5px | 광고 라벨 |
| `Label/C1` | Pretendard / Medium | 12 | 16px | 0px | 시청자 수 등 캡션 |
| `Label/C2` | Pretendard / Bold | 12 | 16px | 0px | 강조 캡션 |
| `Label/C3` | Pretendard / Regular | 12 | 160.000002% (CSS 1.6) | -1% (CSS -0.01em) | copyright |

#### weight 및 특수 표기

- Pretendard Regular=400, Medium=500, SemiBold=600, Bold=700은 Font의 스타일 metadata에서 확인된다.
- Sandoll Mapssi/Gyeokdonggulim Regular는 metadata상 weight=400이다.
- S-Core Dream `7 ExtraBold`는 metadata상 weight=700, `8 Heavy`는 weight=800이다. 표기의 “ExtraBold”만 보고 임의로 800으로 치환하지 않는다. 실제 웹폰트 파일과 CSS 선언을 확인하여 동일 face를 로딩한다.
- Figma/MCP 응답에서 `Sandoll Mapssi`와 `Sandoll_Mapssi`처럼 family 표기가 다르게 나타날 수 있다. 실제 CSS `font-family` 이름은 저장소의 `@font-face`, 웹폰트 로딩 설정, 실제 font-family 선언을 확인한 뒤 사용한다. 이 문서의 표기만으로 CSS family명을 확정하지 않는다.
- H5/H6의 표에는 **`L: -1% / W: -0.12em`**이 적혀 있다. native letterSpacing은 -1% 확인. `word-spacing:-0.12em`은 문서화된 표의 지시이며 Figma TextStyle의 별도 속성으로 반환된 값은 아니다. 코드 매핑 시 이 차이를 명시한다.
- `Button/L`의 line-height는 실제 style에 **13.235294342px**로 저장되어 있다. 표의 숫자는 13.2로 반올림되어 있다. 일반적인 20/24px로 자동 정규화하지 않는다. 재현 후 clipping 여부를 확인할 항목이다.
- `Static/Label Large/Size=14`가 Subtitle/S3에, `font-size/label/large=19`가 Inputs/I1에, `item spacing/14=14`가 Label/L1의 font-size와 line-height에 연결되어 있다. 변수 이름이 뜻밖의 범주여도 실제 resolved 값과 style를 보존한다.

### 5. 확인된 충돌/미확정 사항

1. **Example와 Font/Theme가 서로 다른 체계를 사용한다.** 예시 페이지를 정식 규칙에 섞지 않는다. 현재 product 시안에서 쓰인 styleId 및 Theme/Font 표를 우선 교차 확인한다. Example 전체가 전부 폐기되었다고 단정하지는 않는다.
2. **Button/S 자간:** 사용 가이드 보기 행의 표기(`65016:28731`)에는 -1%, native `Button/S` style과 실제 preview 텍스트(`65016:28764`)는 0이다. 해당 preview 재현에는 0을 사용하며, 다른 target node에 override가 있으면 별도 기록한다.
3. **Button/XXS 자간:** 표기(`64986:51396`)에는 0, native `Button/XXS` style과 live pill preview(`I65032:209412;1361:46213`)는 -1%이다. preview 고정밀 CSS도 `tracking-[-0.16px]`(16px × -1%)를 확인했다. 재현값은 -0.01em이다.
4. **Label/L2 자간:** 표기(`65007:30070`)에는 0, native `Label/L2` style과 광고 preview(`65022:28809`)는 0.5px다. preview 고정밀 CSS에서도 `tracking-[0.5px]`를 확인했다. 재현값은 0.5px다.
5. **폰트 파일은 확보하지 않았다.** Figma상 family/style은 확인되었지만 실제 저장소의 폰트 파일, CSS family 이름, 로딩 경로는 미확인이다. Pretendard로 일괄 fallback하여 “완료” 처리하지 않는다.
6. **현재 Theme에서 light mode는 확인하지 않았다.** Example의 흰색 배경 토큰을 light theme로 자동 채택하면 안 된다.
7. **UI 스페이싱은 아래 B절의 별도 Spacing·Layout 근거를 따른다.** 표를 꾸미는 64px padding/32px gap 등은 디자인 시스템 문서의 레이아웃일 수 있으므로 제품 전체 spacing token으로 승격하지 않는다.
8. 현재 수집은 코드 저장소와의 mapping을 확정하는 작업이 아니다. 문서에는 Figma 원래 토큰명을 보존하고, code token/utility/class 이름은 구현자가 실제 저장소를 조사한 뒤 매핑하도록 해야 한다.

## B. 스페이싱·그리드·공통 컴포넌트

### 1. 스페이싱

출처: [Spacing 64858:31519](https://www.figma.com/design/7zkpaY37QfFiFvikeX9P6J/%ED%8E%80%EB%84%A4%EC%9D%B4%EC%85%98-v2.0?node-id=64858-31519).

- 간격은 **기본 4px 배수**로 구성하는 것을 권장한다.
- **시각 보정은 2px 단위**, 불가피한 경우 **1px 단위**로 조정한다.
- 56px 높이 내비게이션 바깥에 1px 선이 더해져 57px처럼 보이는 경우처럼, 요소의 본체와 테두리를 구분해 설명한다.
- 따라서 모든 값을 8px 배수로 반올림하거나, 10·14·18px 등을 무조건 오류로 취급하지 않는다.
- 스페이싱 소개 그래프에는 0.5, 1, 2, 4, 6, 8, 10, 12, 16, 18, 20, 24, 32, 36, 40, 42, 48, 64px가 표시되지만, 이는 기본·보정 예시가 혼합된 그래프다. 모든 숫자를 동일한 지위의 권장 spacing token scale로 단정하지 않는다.
- 가이드 판넬 자체의 padding64/gap64와 컴포넌트 진열판 padding80/gap50은 문서 전시 레이아웃이다. 서비스 UI 규칙으로 복제하지 않는다.

### 2. 모서리 반경

출처: [Radius 64858:31601](https://www.figma.com/design/7zkpaY37QfFiFvikeX9P6J/%ED%8E%80%EB%84%A4%EC%9D%B4%EC%85%98-v2.0?node-id=64858-31601).

가이드에 제시된 반경: **4, 6, 8, 10, 12, 16, 20px**.

- 이것은 일반 반경 예시이다. pill 컴포넌트에는 별도의 24/50/99px 등이 실제 사용되므로 모두 20px 이하로 제한하지 않는다.
- 의미 있는 토큰 이름은 확인된 것만 사용한다. 예: Input의 `radius/medium3 = 8px`는 변수 조회로 확인됨.
- XS·S 같은 크기 명칭과 radius 이름을 새로 지어 기존 Figma 정의처럼 기록하지 않는다.

### 3. 반응형과 그리드

#### 활성 기준

| 구간/항목 | 확인된 규칙 | 근거 |
| --- | --- | --- |
| xs | 너비 768px 미만, 모바일 환경 | Screen 설명 노드 65161:82399 full context |
| 일반 Desktop | 768–1599px | Layout 설명 65161:81272 full context |
| xl | 너비 1600px 이상, 데스크톱 환경 | Screen 설명 65161:82530 full context |
| 모바일 그리드 | 2 columns | 설명 65161:81068 및 실물 예시 65161:80643 |
| 모바일 여백/거터 | 좌우 16px, gutter16px (375px 예시) | 65161:80643 full context + 렌더의 측정표시 |
| Desktop 그리드 | 12 columns, gutter20px, 좌우 margin28px | 65161:81074/65161:81170 full context + 렌더 |
| LNB 펼침 | 260px | 65161:81272 |
| LNB 접힘 | 70px | 65161:81272 |
| LNB 접힘 시 확보되는 추가 폭 | +190px (260px → 70px 차이) | 65161:81272 |
| 최대 콘텐츠 그리드 폭 | 1480px | 65161:81683 full context |
| 최대 컨테이너 폭 | 1536px = 1480 + 좌우28 | 65161:81683 full context |
| 기본 Web Desktop 아트보드 | 1440×960px | Screen 가이드의 예시와 설명; breakpoint와 별개 |

출처:
- [Layout 65161:80576](https://www.figma.com/design/7zkpaY37QfFiFvikeX9P6J/%ED%8E%80%EB%84%A4%EC%9D%B4%EC%85%98-v2.0?node-id=65161-80576)
- [Screen 65161:81862](https://www.figma.com/design/7zkpaY37QfFiFvikeX9P6J/%ED%8E%80%EB%84%A4%EC%9D%B4%EC%85%98-v2.0?node-id=65161-81862)
- [Mobile Grid 65161:80643](https://www.figma.com/design/7zkpaY37QfFiFvikeX9P6J/%ED%8E%80%EB%84%A4%EC%9D%B4%EC%85%98-v2.0?node-id=65161-80643)
- [Desktop Grid 65161:81074](https://www.figma.com/design/7zkpaY37QfFiFvikeX9P6J/%ED%8E%80%EB%84%A4%EC%9D%B4%EC%85%98-v2.0?node-id=65161-81074)
- [Max Width 65161:81683](https://www.figma.com/design/7zkpaY37QfFiFvikeX9P6J/%ED%8E%80%EB%84%A4%EC%9D%B4%EC%85%98-v2.0?node-id=65161-81683)

#### 해석과 제외 사항

1. Layout 첫 설명에는 일반적으로 “간격 20px”이라고 적혀 있지만 모바일 실물 그리드는 **16px gutter / 16px margin**이다. 20px를 모바일 전체에 일괄 적용하지 않는다.
2. 메타데이터의 text `name`은 실제 글자 내용과 다를 수 있다. 예를 들어 65161:81171의 layer name은 `Grid 1124px`인데 실제 full context와 렌더에는 `LNB 260px / Grid 1180px / Viewport 1440px`가 쓰여 있다.
3. 1440 − 260 = **1180px**는 LNB를 제외한 영역이고, 1180 − 28×2 = **1124px**는 안쪽 콘텐츠 폭이다. 두 용어가 혼용된 것으로 보이므로 문서에서는 'LNB 제외 영역 1180 / 실제 콘텐츠1124'로 분명히 구분한다. 홈 프레임 65161:72175의 실제 레이아웃 속성과도 일치한다.
4. 최대폭 가이드에 근거한 구현 제안식: 컨테이너 `min(가용 영역, 1536px)`, 그 안쪽 콘텐츠는 좌우28px 제외. 실제 프로젝트에 적용할 CSS 이름은 미확정.
5. Screen 내부 `65161:82406` Item은 **hidden=true**이다. 그 안의 `lg - 펀네이션 v2 미지원`, `768px~1599px`, `m`, `타블릿 환경` 설명은 활성 규칙에서 제외한다. 렌더에도 보이지 않는다.
6. 768–1599 구간의 실제 명칭은 visible Layout의 `Desktop`을 사용한다. 숨겨진 `m/lg`를 신규 코드 breakpoint 이름으로 자동 채택하지 않는다.
7. LNB를 어떤 폭에서 자동 접을지는 확인되지 않았다. '260/70 두 상태가 있다'와 '특정 너비에 자동 접힘'은 다른 규칙이다.
   - 위 표의 `+190px`은 260px에서 70px로 접힐 때 확보되는 너비 차이일 뿐, 1440px에서 자동으로 접으라는 breakpoint 규칙이 아니다.
8. Desktop 12-column grid를 모든 카드 12열로 구현하라는 뜻으로 해석하지 않는다. 홈 화면은 실제 카드 배열/col span과 대조한다.
9. 모바일 375px은 기준 프레임 너비이며, 작은 화면의 고정 viewport 규칙이 아니다. 화면 높이, 스마트폰 status bar/home indicator 역시 웹 콘텐츠 높이로 무조건 고정하지 않는다.

### 4. 대표 공통 버튼

출처: [Button - Common 65183:60930](https://www.figma.com/design/7zkpaY37QfFiFvikeX9P6J/%ED%8E%80%EB%84%A4%EC%9D%B4%EC%85%98-v2.0?node-id=65183-60930).

컴포넌트의 이름·값은 Figma에서 실제 조회한 값이다. 코드의 props 이름/경로는 실제 저장소 확인 후 매핑해야 한다.

| Figma 컴포넌트 | 확인된 규격/텍스트 | 상태별 차이 |
| --- | --- | --- |
| 버튼 - XXL (65183:129832 등) | 높이50px, radius10px, Pretendard SemiBold16px, line-height1(=16px), tracking -1%(=-0.16px) | 확인: Primary #4A92FF, 취소: BG Cancel #2A2D3F, 옵션: 같은 배경+Primary 1px테두리, 비활성: BG Disabled #191B24 |
| 버튼 - S (65183:129949 등) | px24/py14, radius8, Pretendard Bold14px line-height1; 외곽 높이42px 확인 | 확인/이전/옵션/비활성, 색상은 상태별 semantic token 사용 |
| 버튼 - L 기본 (65183:61136) | 높이36px, px20/py6, radius8, Pretendard SemiBold15px | Primary 배경. line-height13.235px라는 특이값이 실제 스타일에 있음 |
| 버튼 - XS (65183:61917/65367) | 높이36px, radius8, 1px border #3C82F0, Pretendard SemiBold13px, tracking -0.13px | '방송 시작하기' / '관리자 모드'; 예시 폭228px |
| 2 뎁스 - XL (65183:129925) | 높이48px, 16px/19px 텍스트 | 기본 Regular/Depth300; 활성 Bold/Primary, 하단2px indicator |
| FilterChip/S (65183:129998/129999) | px12/py6, radius24, Pretendard12px/16px → 높이28px | 기본 Medium/Depth300+BG Cancel, 활성 Bold/white+Primary |
| FilterChip/M (65183:130000/130001) | px12, pt9/pb8, radius50, S-Core Dream800 16px/19px, tracking -0.16px → 높이36px | 기본 Neutral #2A2D3F+Depth300; 활성 legacy #EEE 배경/#2E2E2E 텍스트 |

주의:
- 위 폭375/333/228px 등은 특정 sample 컴포넌트/상태의 폭이다. 모든 서비스 버튼의 전역 고정 너비로 적용하지 않는다.
- Button/2XL의 `letterSpacing: -1`은 code의 `tracking[-0.16px]`와 대응한다. 이를 -1px로 옮기면 안 된다.
- 버튼 - L line-height13.235px는 15px 글자보다 작다. 실제 Figma 값으로 보존·기록하되 프로젝트 적용시 잘림 여부를 확인한다.
- 'Other (삭제예정)/Title', 'Color/Dark/...' 등 legacy token도 일부 컴포넌트에서 참조한다. 전부 최신 Semantic 토큰으로 동일하다고 가정하지 않는다.

### 5. 별도 Chips 보드

출처: [Chips 65183:61510](https://www.figma.com/design/7zkpaY37QfFiFvikeX9P6J/%ED%8E%80%EB%84%A4%EC%9D%B4%EC%85%98-v2.0?node-id=65183-61510).

FilterChip states: `선택`, `미선택`, `비활성화`.

- 높이36px, 좌우12px, 상하8px, 자식 gap4px, radius50px.
- 좌/우 아이콘 slot은 20×20px.
- 글자 스타일 `Button/XXS`: **S-Core Dream 8 Heavy(800), 16px/19px, -1% 자간(=-0.16px)**.
- 선택: 배경 `Semantic/Surface/On-Surface/Strong #FFFFFF`, 글자 `Depth900 #12131A`.
- 미선택: 배경 `BG Label100 #262838`, 글자 `Normal #DFE5ED`.
- 비활성: 배경 `BG Disabled #191B24`, 글자 `Depth500 #515E71`.

**주의:** Button Common의 FilterChip/M과 이 Chips 보드는 같은 S-Core 글자 스타일을 쓰지만 상태별 색이 다르다. 이름이 비슷하다고 하나로 뭉개지 말고 홈에서 실제 참조하는 인스턴스/스타일을 사용해야 한다. 홈 suggestion_chip은 높이28px·radius24px·Pretendard12px/16px로 확인되었다. 서로 다른 변형이다.

### 6. Input·검색바

출처: [Input 65083:84314](https://www.figma.com/design/7zkpaY37QfFiFvikeX9P6J/%ED%8E%80%EB%84%A4%EC%9D%B4%EC%85%98-v2.0?node-id=65083-84314).

#### 검색바 65183:61282

- 높이36px, 예시 폭396px.
- 좌우 padding16px, 상하2px, radius99px.
- 배경 `Semantic/Surface/Background/BG400 #1F212E`.
- border1px `Semantic/Surface/Border/Border400 #31354F`.
- 텍스트 `Inputs/I5`: Pretendard Medium14px/22px, 자간0.25px.
- placeholder 색 `Depth400 #7C8594`.
- PC 홈 top-nav에서도 동일한 396×36px·좌우16px·Inputs/I5 값을 확인했다.

#### 일반 입력 필드 65156:32394 등

- 입력 박스 높이56px = `size-height/8`.
- 좌우 padding16px = `padding/6`.
- radius8px = `radius/medium3`.
- 기본 내부 gap8px = `gap/3`.
- 기본 border1px = `border-width/variable-regular`.
- 배경 `BG200 #12131A`, 기본 border `Border300 #2A2D3F`.
- 본문 `Inputs/I1`: Pretendard Regular, **19px** (`font-size/label/large`), line-height1.5(=28.5px), 자간0.
- 위 제목 `Inputs/I4`: Pretendard Bold16px/19px.
- label 포함 field wrapper는 보통86px, error 설명 포함108px이다. **입력 박스56px와 전체 wrapper 높이를 구분한다.**
- Hovered: Primary1px border, glow shadow.
- Pressed/Typing: Primary2px border, 0 0 2px Primary glow.
- Error1: 오류아이콘·문구 `Semantic/Sys/Fill/Error #CD0C0C` (박스 테두리는 Border300으로 기록되어 있음).
- Error2: warning border/icon/message `Semantic/Sys/Fill/Warning #F7DF4E`.
- 상태명은 Figma의 variant 이름이다. 키보드 focus 등 실제 웹 동작은 기존 프로젝트와 함께 매핑해야 한다.

#### Login 입력 변형

- 별도 Login 컴포넌트는 54/56px 박스 또는 보조문구 포함72px wrapper를 사용한다.
- 텍스트 `Inputs/I2`: Pretendard Regular18px/24px, 자간0.15px.
- 보조문구 `Inputs/I3`: Pretendard Medium12px/16px, 자간0.4px.
- 일반 입력 필드의 I1=19px를 Login 입력이나 검색바까지 일괄 적용하지 않는다.

## C. PC 홈 실제 적용값

### 화면과 상태

| 노드 | 확인한 역할 | 크기 |
|---|---|---|
| `65161:72175` | PC 메인 홈, GNB 로그인 버튼 표시 | 1440×2972 |
| `65183:66457` | PC 메인 홈, GNB 지갑·스튜디오 표시 | 1440×2972 |
| `65183:133690` | 검색 제안 및 후원 팝업 등 보조 상태를 모은 wrap | 1440×1668 |

두 '메인 홈 (최종)' 프레임은 기본 레이아웃이 같고 GNB 내용이 다르다. 인증 여부의 실제 조건은 코드와 연결해야 한다. `wrap`은 세 개의 상태 보드를 묶은 범위이며 한 화면으로 구현하지 않는다.

### 레이아웃과 간격

| 요소 | 확인값 | 근거 노드 |
|---|---|---|
| GNB | 높이64, 좌우16/상하8, 메뉴40×40, 로고191×30 | `65183:66390` |
| 로그인 버튼 | 높이36, px20/py6, radius8, Pretendard SemiBold15px/13.235px | 위 GNB의 실제 인스턴스 |
| GNB 검색바 | 396×36, radius99, px16, BG400, Border400 1px | 위 GNB의 검색바 인스턴스 |
| LNB | 폭260, BG200 `#12131A` | `65183:66011` |
| LNB 제외 영역 | 1440−260=1180 | `65161:72502` |
| 콘텐츠 | 좌우28, 실제 너비1124 | `65161:72517`, `65161:72555` |
| Hero | 1124×320, top28, radius10, 내부 좌우50, 큰 묶음 gap20 | `65161:72517`~`72519` |
| 퀵 카드 | 3등분, 가로 gap20, 높이90, 내부 px16, radius10, BG400 | `65161:73451` |
| 상단 큰 묶음 사이 | Hero→퀵 카드28 / 퀵 카드→띠배너28 / 띠배너→추천채널28 | 위 노드, `65161:72503`, `65161:72555`의 실제 geometry |
| 띠 광고 | main 영역 전체폭1180, 높이60, 이미지 paint | `65161:72503` |
| 추천채널 제목→필터 | 20 | `65161:72555` itemSpacing |
| 필터→첫 카드행 | 20 | `65161:72555` itemSpacing |
| 추천채널 카드 배열 | 한 줄4개, 각266px, 가로gap20, 행간40 | `65161:72586`, `65161:72587` |
| 추천채널 썸네일 | 266×163, 외곽radius8 | `65161:72590` |
| 썸네일→카드본문 | 14 | `65161:72589` |
| 아바타 | 40×40, 본문과gap5 | `65161:72600`~`72604` |
| 카드 제목→메타 | 8 | `65161:72613` |
| 카드 태그 | 높이20, px8/py2, radius20, gap5, 배경`#31354F` | `65161:72624` |
| 홈 필터 | 높이28, radius24, gap8, LIVE px12/py6 | `65161:72559` |
| Footer | padding44, 그룹gap24, 상단Border100 1px | `65161:72554` |

프레임 높이2972와 각 section의 y는 기준 시안의 측정값이다. 전체 페이지를 2972px로 고정하거나 모든 영역을 해당 y에 absolute 배치하라는 규칙이 아니다. 266×163 썸네일은 해당 추천채널 카드의 실제 값이며 다른 종류 카드로 일반화하지 않는다.

화면 섹션 순서는 Hero, 퀵 카드3개, 띠광고, 추천 토크 채널, 라이브 탑50, 신입 스트리머, 후원 콘텐츠, Footer이다. 신입·후원 카드 등 추가 컴포넌트를 수정할 때는 각각 `65161:73278`, `65161:73401`의 상세 속성을 다시 확인한다.

### 실제 타이포그래피

| 역할 | 실제 적용값 | 근거 |
|---|---|---|
| Hero 제목 | Sandoll Mapssi Regular 40px, line-height0.8, letter-spacing−0.01em | `65161:72539` |
| Hero 인사말 | Pretendard SemiBold16px/1, −0.01em | `65161:72530` |
| Hero 설명 | Pretendard SemiBold14px/1.6, −0.01em | `65161:72541` |
| Hero CTA | Pretendard SemiBold14px/1, −0.01em; 139×42, px24/py14, radius8 | `65161:72544`~`72545` |
| 퀵카드 제목/섹션 제목 | S-Core Dream 7 ExtraBold19px/1, −0.01em | `65161:73455`, `65161:72557` |
| 퀵카드 설명 | Pretendard SemiBold13px/1.6, −0.01em | `65161:73456` |
| 전체보기 | Pretendard SemiBold14px/1, −0.01em, Primary | `65161:72558` |
| 필터 | Pretendard12px/16px. 전체는Bold, LIVE 등은Medium | `65161:72561`, `65161:72563` |
| 추천채널 카드 제목 | Subtitle/S1: Pretendard Bold16px/20px, 자간0 | `65161:72614` |
| 크리에이터명 | Label/C2: Pretendard Bold12px/16px, Depth300 | `65161:72617` |
| 메타정보 | Label/C1: Pretendard Medium12px/16px, Depth400 | `65161:72621`, `72623` |
| Footer | Pretendard Regular12px/1.6, −0.01em, Depth300 | `65161:72554` 내부 텍스트 |

DS Button/S는 Bold14px·자간0이지만 실제 PC Hero CTA는 SemiBold14px·자간−1%이고 모바일은 ExtraBold14px다. 이를 같은 글자 스타일로 덮어쓰지 말고 화면별 적용값을 기록한다.

### 색상과 배경

- GNB: BG100 `#0E0E14`, 경계 Border100 `#1F212E`.
- LNB: BG200 `#12131A`.
- 퀵카드·홈 비선택필터: BG400 `#1F212E`.
- PC Hero CTA·선택 LIVE: Primary `#4A92FF`.
- Home body의 실제 배경은 방사형 그라데이션이다. stop값 `#1A2A4A`0%, `#0E1428`40%, `#07070D`75%를 확인했다. 화면에 적용된 transform·추가 조명 레이어까지 확인하여 재현한다. BG100 단색으로 대체하지 않는다.
- 하단 조명 타원 `65161:72177`: 1374×1374, 단색`#292929`, opacity0.5. 블러 등 전체 효과는 구현 시 원본 컨텍스트에서 확인한다.
- Hero 이미지·띠배너·로고는 별도 자산이다. 본 문서는 자산 파일을 포함하지 않는다.
- 전체 시안 배경 위에 표시되는 투명 컴포넌트를 단독 캡처하면 회색 배경처럼 보일 수 있다. 단독 캡처 바탕색을 해당 컴포넌트의 fill로 오인하지 않는다.

### 영구 출처

- [홈 전체 범위](https://www.figma.com/design/7zkpaY37QfFiFvikeX9P6J/%ED%8E%80%EB%84%A4%EC%9D%B4%EC%85%98-v2.0?node-id=65092-44587)
- [PC 기본](https://www.figma.com/design/7zkpaY37QfFiFvikeX9P6J/%ED%8E%80%EB%84%A4%EC%9D%B4%EC%85%98-v2.0?node-id=65161-72175)
- [PC 지갑·스튜디오](https://www.figma.com/design/7zkpaY37QfFiFvikeX9P6J/%ED%8E%80%EB%84%A4%EC%9D%B4%EC%85%98-v2.0?node-id=65183-66457)
- [Hero](https://www.figma.com/design/7zkpaY37QfFiFvikeX9P6J/%ED%8E%80%EB%84%A4%EC%9D%B4%EC%85%98-v2.0?node-id=65161-72517)
- [퀵카드](https://www.figma.com/design/7zkpaY37QfFiFvikeX9P6J/%ED%8E%80%EB%84%A4%EC%9D%B4%EC%85%98-v2.0?node-id=65161-73451)
- [추천채널 카드](https://www.figma.com/design/7zkpaY37QfFiFvikeX9P6J/%ED%8E%80%EB%84%A4%EC%9D%B4%EC%85%98-v2.0?node-id=65161-72588)

## D. 모바일 홈과 보조 화면

읽기 전용으로 get_design_context의 상세 코드·스타일 및 반환 스크린샷, get_variable_defs를 확인했다. 아래 스타일은 sparse metadata만으로 추측한 값이 아니다. Metadata의 치수는 상세 코드와 대조했다.

### 1. 실제 화면 구분

| 노드 | Figma 이름 | 확인한 실제 용도 | 기준 크기 |
|---|---|---|---|
| `65183:130577` | [A-01] 메인홈 (로그인 전) | 모바일 홈: 상단 내비, Hero, 광고 배너, 하단 내비 | 375 × 868 |
| `65183:135804` | Frame 1428752571 | 검색 화면 2개를 담은 묶음 프레임. 자체가 한 화면이 아니다 | 375 × 1923 |
| `65183:135805` | [A-01] 메인홈 (로그인 전) | 검색 진입 상태: placeholder와 최근 검색어 | 375 × 868 |
| `65183:136304` | [A-01] 메인홈 (로그인 전) | 검색 입력 상태: 입력 문자열과 지우기 버튼 | 375 × 868 |
| `65183:136807` | [A-01] 메인홈 (로그인 전) | 알림 목록 화면 | 375 × 868 |

화면 이름이 복제되어 있어 모두 홈으로 읽으면 안 된다. 실제 홈의 Hero 아래에는 광고 배너 이후 큰 빈 영역이 있고, PC에서 보이는 추천 채널·게시물 피드의 모바일 배치가 이 프레임에는 없다. PC 피드를 어떤 모바일 구조로 옮길지는 추가 규칙/시안 또는 제안으로 구분해야 한다. `375`는 시안 폭이며 CSS breakpoint라고 확정할 수 없다. `868`은 시안 높이이며 전체 앱의 고정 높이로 쓰면 안 된다.

원본 링크:
- [모바일 홈](https://www.figma.com/design/7zkpaY37QfFiFvikeX9P6J/%ED%8E%80%EB%84%A4%EC%9D%B4%EC%85%98-v2.0?node-id=65183-130577)
- [검색 기본](https://www.figma.com/design/7zkpaY37QfFiFvikeX9P6J/%ED%8E%80%EB%84%A4%EC%9D%B4%EC%85%98-v2.0?node-id=65183-135805)
- [검색 입력](https://www.figma.com/design/7zkpaY37QfFiFvikeX9P6J/%ED%8E%80%EB%84%A4%EC%9D%B4%EC%85%98-v2.0?node-id=65183-136304)
- [알림](https://www.figma.com/design/7zkpaY37QfFiFvikeX9P6J/%ED%8E%80%EB%84%A4%EC%9D%B4%EC%85%98-v2.0?node-id=65183-136807)

### 2. 모바일 홈의 확인된 레이아웃·형상

| 요소 | 확인된 값 | 근거 |
|---|---|---|
| 시안 화면 | 375 × 868, 배경 `Color/Dark/Greyscale/Background/Default = #141517` | `65183:130577` |
| 상단 장치 상태바 | 44 높이 | 컴포넌트 `65183:61660` (시안 기기 프레임) |
| 상단 내비 | 폭 375, 높이 56, y=44; padding 4; 하단 1px border | 인스턴스 `65183:130923`, 컴포넌트 `65183:61661` |
| 상단 아이콘 버튼 | 외곽 클릭 슬롯 48 × 48, 내부 40 × 40, 아이콘 24 × 24 | `65183:58891` 이하 |
| 중앙 로고 | 63 × 26 | `65183:58942` |
| Hero | y=101, 폭 375, 높이 220; 좌우 padding 50, 내부 vertical gap 10, bottom padding 10 | `65183:130801`, `65183:130802` |
| Hero 안내 문구 묶음 | gap 5 | `65183:130810` |
| Hero 상단 작은 문구 행 | 가로 gap 4, 좌우 padding 4, 위아래 padding 15 | `65183:130811` |
| Hero 제목 두 줄 사이 | vertical gap 16 | `65183:130820` |
| Hero CTA | 138 × 42, 좌우 padding 24, 위아래 14, radius 8 | `65183:130829` |
| 슬라이드 표시점 | 기본 10 × 10, 선택 40 × 10, gap 6, radius 99 | `65183:130834` 이하 |
| 광고 배너 | 좌우 여백 10, y=331, 355 × 42, radius 10; 내부 좌16/우12/상하8 | `65183:130839` |
| Hero와 광고 배너 | Hero 끝321에서 광고 시작331로 10 간격 | 위 두 상세 노드 및 geometry |
| 광고 레이블 | 좌우 padding 5, 상하1, radius4, 본문과 gap4 | `65183:130844` |
| 하단 내비 전체 시안 | 높이84, 상단1px border, 시안 하단에 배치 | 컴포넌트 `65183:65640` |
| 하단 내비 콘텐츠 | 가로 padding4, 세로8, 아이콘24, 아이콘-레이블 gap4 | `65183:65558` 이하 |
| 하단 내비 레이블 | Pretendard Medium 10px/10px; 마지막 ‘내 정보’는 SemiBold | `65183:65577` 및 `65183:65637` |
| Home Indicator 시안 | 영역높이20, 막대139 × 4 | `65183:65638` |

기기 외곽 radius28, 시간·배터리·Dynamic Island·하단 제스처 막대는 시안의 기기 표현이다. 실제 웹 구현에서는 장치 UI 이미지를 화면 구성요소로 복제하지 않고 브라우저/OS 및 safe-area 처리에 맞춘다. 이 해석은 웹 구현을 위한 권고이며 Figma에서 모든 런타임 동작이 명세된 것은 아니다. 상단44와 하단84 전체를 모든 기기에서 고정 상수로 복제하지 않는다.

### 3. 모바일 홈 타이포그래피

| 역할 | 실제 스타일 | 근거 |
|---|---|---|
| Hero 상단 ‘후원이 즐거워지는’ | Pretendard SemiBold 600, 16px, line-height 1(16px), tracking -0.16px(-1%) | `65183:130813`; `Typography/Label/16SB_Single` |
| Hero 브랜드 빨간 배지 | Pretendard Bold 700, 14px/14px | `65183:130816` |
| Hero ‘펀네이션이’ | Sandoll_Mapssi Regular, 32px, line-height 0.8(25.6px), tracking -0.32px | `65183:130822` |
| Hero ‘처음이세요?’ | Sandoll_Mapssi Regular; 본문32px, 물음표34px; line-height0.8, 노드 tracking -0.34px | `65183:130824` |
| Hero ‘사용 가이드 보기’ | Pretendard ExtraBold 800, 14px/14px, tracking -0.14px | `65183:130830` |
| 광고 ‘광고’ 레이블 | Pretendard Bold700, 11px/16px, tracking +0.5px | `65183:130845` |
| 광고 문구 | Pretendard SemiBold600, 15px, line-height normal, tracking -0.225px | `65183:130847` |
| 하단 내비 | Pretendard Medium500, 10px/10px, tracking0; ‘내 정보’는600 | `Typography/Label/10M_Single`, 위 노드 |

기본 UI를 Pretendard로 통일한다는 규칙이 Hero의 Sandoll_Mapssi까지 자동으로 대체하는 뜻은 아니다. 실제 웹폰트 파일과 로딩·사용 가능 여부는 코드/자산을 받지 않아 미확인이다.

### 4. 모바일 홈 색상과 실제 매핑

get_variable_defs와 상세 컨텍스트에서 함께 확인했다.

| 원본 토큰/용도 | 값 | 구분 |
|---|---|---|
| `Semantic/Surface/Background/BG 100` | `#0E0E14` | 상·하단 내비 |
| `Semantic/Surface/Border/Border 100` | `#1F212E` | 내비 경계 |
| `Semantic/Brand/Primary` | `#4A92FF` | 홈 하단내비 선택 |
| `Semantic/Surface/On-Surface/Normal` | `#DFE5ED` | 내비 기본 텍스트 |
| `Color/Dark/Greyscale/Background/Default` | `#141517` | 모바일 페이지 본문 |
| `Color/Dark/Greyscale/Background/Hero` | `#030F01` | Hero 이미지 배경 |
| `Color/Dark/Text/Primary` | `#EEEEEE` | Hero 텍스트 |
| `Color/Dark/Text/Inverse` | `#FFFFFF` | CTA |
| `Color/Brand/State/State/Live` | `#FF0015` | Hero의 펀네이션 배지 |
| Hero CTA/선택 표시점/광고 레이블 직접 색 | `#4782FF` | Semantic Primary와 다름 |
| 기본 슬라이드 표시점 | `#D9D9D9` | 직접 색 |
| 광고 레이블 글자 | `#E6EAF5` | 직접 색 |
| 광고 배경 | 이미지 asset과 gradient가 함께 적용 | 단색 토큰만으로 대체하면 다른 모습 |

원본은 Semantic/*와 Color/Dark/* 및 직접 hex 값이 혼재한다. Semantic Primary #4A92FF와 Hero CTA #4782FF를 동일하다고 기록하지 말 것. 어떤 쪽으로 표준화할지는 공통 디자인 시스템과 화면별 예외를 비교해 결정해야 한다.

화면에 같은 자리에 App bar 직접색 #0D0E1A/#1E1E30 노드(`65183:130869`)와 이후 Nav 인스턴스(`65183:130923`)가 중첩되어 있다. 마지막 시각적 기준은 Semantic 기반 Nav 스크린샷이다. 원시 코드에 보이는 중복 상단바를 모두 구현하면 안 된다.

### 5. 보조 화면: 검색(홈 본문 규칙과 구분)

검색 기본 `65183:135805`, 검색 입력 `65183:136304`은 각각 독립 화면이다.

| 항목 | 확인값 | 근거 |
|---|---|---|
| 제목 | Pretendard SemiBold600 22px/28px, tracking0, #FEFEFE | `65183:136271`, `65183:136774` |
| 검색 필드 | 335 × 46, 좌우20, y120, 2px #4A92FF, radius99, bg rgba(49,55,64,.5) | `65183:136201`, `65183:136700` |
| 입력/placeholder | Pretendard Medium500 14px/22px, tracking+.25px, #E0E0E0 | `65183:136203`, `65183:136702` |
| 최근검색 묶음 | 좌우20, 시작y186, header-list gap16 | `65183:136207`, `65183:136710` |
| 검색어 행 | vertical padding10, 행간 gap4, 아이콘-텍스트 gap8 | `65183:136212` 이하 |
| 검색어 | Pretendard SemiBold600 16px/16px, tracking-.16px, #BBBBBB | `65183:136219` |
| 입력 지우기 | 기본 상태는 오른쪽 검색 아이콘, 입력 상태는 왼쪽 검색 아이콘 및 오른쪽 지우기 버튼 | 두 상세 화면 비교 |

모든 상태에 검색 필드가 파란 테두리로 그려져 있어, 이 데이터만으로 focus/default/hover의 차이를 확정할 수 없다.

### 6. 보조 화면: 알림(홈 본문 규칙과 구분)

알림 화면 `65183:136807`은 이름과 달리 알림 목록이다.

- 제목: Pretendard SemiBold600 22px/28px, #FEFEFE (`65183:137272`).
- 알림 영역: 좌우20, width335, 첫 묶음 y120, 묶음의 날짜-리스트 gap16 (`65183:137203`).
- 리스트 항목 사이24, avatar34 × 34, avatar-본문 gap12 (`65183:137205`~`137208`).
- 본문: Pretendard Medium500 14px, line-height1.6(22.4px), tracking-.14px, #FFFFFF (`65183:137209`).
- 메타데이터: Pretendard Regular400 14px/14px, #9DA5B6, 항목 gap4 (`65183:137210`~`137213`).
- 날짜: Pretendard Medium500 14px/22.4px, #848484 (`65183:137204`).
- 공지사항 카테고리: #6B8AFF (`65183:137236`).
- 알림 개수 배지: 22 × 22, radius11, #F96217, Inter Bold700 11px (#FFFFFF). 배지는 알림용 보조색이며 서비스 전체 Primary로 일반화하지 않는다 (`65183:137280`~`137281`).

검색·알림 화면의 하단내비 선택색은 직접색 #6CA6FF이고, 모바일 홈의 토큰 #4A92FF와 다르다. 검색·알림의 일부 일반 탭색도 #DFE2EA/#EEEEEE이며 홈의 #DFE5ED와 다르다. 홈 scope에서 모든 화면 값을 섞어 단일 확정값처럼 만들지 않는다.

### 7. 구현 전 확인이 필요한 사항

1. 모바일 홈 피드/카드가 비어 있으므로 PC 하단 콘텐츠의 모바일 표현은 확정되지 않았다.
2. ‘로그인 전’ 프레임명에 비해 홈 하단 마지막 탭은 ‘내 정보’, 검색·알림은 ‘로그인’으로 다르다. 인증 상태별 라벨/동작은 기존 코드와 대조해야 한다.
3. Hero CTA #4782FF와 공통 Primary #4A92FF, 보조 화면 선택색 #6CA6FF의 통일 여부.
4. Sandoll_Mapssi 웹폰트 및 히어로·광고 이미지 자산의 실제 프로젝트 파일.
5. 상태바·Home Indicator는 시안 기기 표현이며 브라우저 실화면의 safe-area 요구조건과 구분.
6. Figma에서 관찰한 높이·위치는 참조 화면의 측정값이다. 콘텐츠 증가/스크롤/고정내비 동작은 별도로 구현해야 한다.
7. 375 시안만으로 breakpoint 및 모든 중간 너비 레이아웃을 확정하지 않는다. 반응형 구간은 B절의 활성 기준을 따른다. 중간 너비의 상세 배치는 추가 검수가 필요하다.
