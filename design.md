# 펀네이션 v2.0 — 디자인 구현 규칙

기준일: 2026-10-27  
대상: 펀네이션 v2.0 디자인 시스템 + 홈 UI  
테마: Dark

이 문서는 UI 구현 시 항상 적용할 핵심 디자인 규칙이다.

전체 색상 토큰, 전체 텍스트 스타일, 세부 Figma 실측값과 원본 차이는 `design-reference.md`를 필요한 경우 확인한다.

---

# 1. 기준 Figma

## 디자인 시스템

https://www.figma.com/design/7zkpaY37QfFiFvikeX9P6J/펀네이션-v2.0?node-id=64800-100375

## 홈 화면

https://www.figma.com/design/7zkpaY37QfFiFvikeX9P6J/펀네이션-v2.0?node-id=65092-44587

## 주요 기준 프레임

PC Home

- 로그인 상태 프레임: `65161:72175`
- 지갑·스튜디오 상태 프레임: `65183:66457`

Mobile Home

- `65183:130577`

공통 스타일은 디자인 시스템의 Theme / Font / Spacing / Layout을 따른다.

실제 화면 배치와 화면별 override는 Home 프레임을 따른다.

---

# 2. 적용 우선순위

디자인을 적용할 때 아래 순서를 따른다.

1. 기존 코드 구조 확인
2. 폰트
3. 색상
4. 스페이싱
5. radius
6. 공통 UI 요소
7. GNB / LNB
8. Hero
9. 퀵카드
10. 콘텐츠 카드
11. Footer
12. 모바일
13. 실제 브라우저 검수

기존 기능과 DOM 구조를 불필요하게 변경하지 않는다.

---

# 3. 핵심 색상

## Brand

| 역할 | 값 |
|---|---|
| Primary | `#4A92FF` |
| Secondary | `#4962FF` |
| Tertial | `#A72FC5` |

## Background

| 역할 | 값 |
|---|---|
| BG 100 | `#0E0E14` |
| BG 200 | `#12131A` |
| BG 300 | `#191B24` |
| BG 400 | `#1F212E` |
| BG Cancel | `#2A2D3F` |

## Text / On-Surface

| 역할 | 값 |
|---|---|
| Strong | `#FFFFFF` |
| Normal | `#DFE5ED` |
| Depth 300 | `#969DA8` |
| Depth 400 | `#7C8594` |
| Depth 500 | `#515E71` |

## Border

| 역할 | 값 |
|---|---|
| Border 100 | `#1F212E` |
| Border 200 | `#262838` |
| Border 300 | `#2A2D3F` |
| Border 400 | `#31354F` |

## Interaction

| 역할 | 값 |
|---|---|
| Primary | `#4A92FF` |
| Hovered | `#3569D1` |
| Pressed | `#2C5DBB` |
| Focus | `#81B3FF` |

## Overlay (반투명)

2026-11-09 추가. 화면 위에 반투명하게 덮는 색. Figma 변수 `Semantic/Overlay/*`, 투명도는 변수 값 안에 들어 있다.

| 역할 | 값 | 사용처 |
|---|---|---|
| White 10 | `#FFFFFF` 10% | 설명 박스 바탕 |
| White 70 | `#FFFFFF` 70% | 썸네일 위 보조 글자 · 배지 글자 |
| Black 50 | `#000000` 50% | 플레이어 원형 컨트롤 버튼 |
| Black 65 | `#000000` 65% | 모바일 아래 시트 뒤 딤 |
| Gray 70 | `#121212` 70% | 썸네일 시청자 배지 바탕 |
| Live 70 | `#FF4242` 70% | 썸네일 LIVE 배지 바탕 |

반투명 색은 이 변수로 연결한다. 불투명 색 변수에 칠 투명도를 따로 얹지 않는다 (Figma 에서 변수를 다시 연결하면 칠 투명도가 1로 돌아감).

## Common

Figma 변수 `Atomic/Common/*`. 역할 없는 기본색.

| 역할 | 값 |
|---|---|
| Black | `#000000` |
| White | `#FFFFFF` |
| Transparent | 투명 (색 없음 — 보이지 않는 테두리 · 자리 표시) |

Transparent 는 Overlay 가 아니다. "가장 연한 오버레이"로 쓰지 않는다.

## 시안 색 → 디자인시스템 색

시안에 디자인시스템 변수에 없는 색이 있으면 가장 가까운 디자인시스템 색으로 맞춘다 (2026-11-09 결정).

동일한 HEX라도 역할이 다르면 하나의 토큰으로 합치지 않는다.

---

# 4. PC Home 배경

PC 홈 Body는 단색이 아니다.

다음 방사형 그라데이션을 기준으로 한다.

```css
radial-gradient(
  /* Figma 원본의 위치와 범위 확인 */
  #1a2a4a 0%,
  #0e1428 40%,
  #07070d 75%
)
```

단순 `#0E0E14` 배경으로 대체하지 않는다.

---

# 5. 타이포그래피

## 기본 원칙

기본 UI 폰트는 `Pretendard`.

Display와 일부 Headline에는 별도 서체가 사용된다.

- Pretendard
- Sandoll Mapssi
- Sandoll Gyeokdonggulim
- S-Core Dream

실제 프로젝트에서 폰트 파일 또는 웹폰트 로딩 여부를 확인한 뒤 적용한다.

fallback 상태를 최종 구현이라고 판단하지 않는다.

## 위 4개 외 서체는 쓰지 않는다

2026-11-09 결정. 시안 · 코드 모두 아래 4개 서체만 쓴다.

- Pretendard (Regular · Medium · SemiBold · Bold · ExtraBold · Black)
- S-Core Dream
- Sandoll Mapssi
- Sandoll Gyeokdonggulim

시안에 Inter · Roboto · Noto Sans(KR) · Pretendard GOV · Pretendard Variable 이 있으면 **같은 두께의 Pretendard** 로 바꿔 구현한다.

예외: 이미지로 내보내는 배너 안의 글자(예: LNB 카카오 배너의 NanumSquare Neo)는 이미지라 규칙 밖이다.

참고: 코드의 S-Core Dream 웹폰트는 7 ExtraBold 만 있다. 시안의 3 Light · 6 Bold · 8 Heavy 는 코드에서 7 ExtraBold 로 보인다.

## 주요 스타일

| 역할 | Font | Size | Weight | Line-height | Letter-spacing |
|---|---|---:|---:|---|---|
| PC Hero / D1 | Sandoll Mapssi | 40px | Regular | `0.8` | `-0.01em` |
| 띠광고 / D2 | Sandoll Gyeokdonggulim | 26px | Regular | `29px` | `-0.01em` |
| Page Title / H5 | S-Core Dream | 28px | 700 | `1` | `-0.01em` |
| Section Title / H6 | S-Core Dream | 19px | 700 | `1` | `-0.01em` |
| Card Title / S1 | Pretendard | 16px | 700 | `20px` | `0` |
| Hero Small / S2 | Pretendard | 16px | 600 | `1` | `-0.01em` |
| Hero Description / S3 | Pretendard | 14px | 600 | `1.6` | `-0.01em` |
| Quick Card Description / S4 | Pretendard | 13px | 600 | `1.6` | `-0.01em` |
| Body / B1 | Pretendard | 14px | 400 | `1.5` | `0` |
| Search / I5 | Pretendard | 14px | 500 | `22px` | `0.25px` |
| GNB Button / L | Pretendard | 15px | 600 | `13.235294px` | `0` |
| See All / M+ | Pretendard | 14px | 600 | `1` | `-0.01em` |
| Filter / Meta | Pretendard | 12px | 500 | `16px` | `0` |
| Footer | Pretendard | 12px | 400 | `1.6` | `-0.01em` |

Figma의 `-1%` letter-spacing은 CSS `-0.01em`이다.

`-1px`로 바꾸지 않는다.

---

# 6. 스페이싱

## 기본 규칙

기본 spacing unit:

```text
4px
```

기본적으로 4px 배수를 사용한다.

시각 보정:

```text
2px
```

불가피한 미세 조정:

```text
1px
```

실제 Figma 화면에 `10px`, `14px` 등이 있으면 임의로 8px 또는 16px로 정규화하지 않는다.

---

# 7. Radius

기본 radius scale:

```text
4
6
8
10
12
16
20
```

큰 radius:

```text
24
50
99
```

Pill / Circle(알약 · 원형)은 **9999** 로 통일한다.

Figma 변수: `Radius` 컬렉션 (이름은 숫자 — `4` · `6` · `8` · `10` · `12` · `16` · `20` · `24` · `50` · `99` · `9999`).

## 규칙 (2026-11-09 결정)

- 4의 배수를 기본으로 한다. `6` · `10` 은 시각 보정용으로 허용.
- 단계 밖 값은 가장 가까운 4의 배수로 맞춘다 — `1` · `2` · `3` → `4`, `9` → `8`, `11` → `12`, `18` · `19` → `20`.
- `100` 이상(100 · 999 · 1000 · 9999 · 16777200 등)은 `9999` 로 통일한다.
- 아이콘 안 도형의 소수값(1.33 · 2.67 등)은 아이콘 모양이라 바꾸지 않는다.

스페이싱(6장)의 "실제 Figma 값을 임의로 정규화하지 않는다"는 간격 규칙이다. radius 는 위 규칙대로 맞춘다.

---

# 8. Grid / Breakpoint

## Mobile

```text
< 768px
```

기본:

- 2 columns
- 좌우 16px
- gutter 16px

이 grid가 홈 추천카드 2열을 의미하는 것은 아니다.

## Desktop

```text
768px – 1599px
```

기본:

- 12 columns
- 좌우 28px
- gutter 20px

## XL

```text
>= 1600px
```

- 콘텐츠 최대 폭: 1480px
- 좌우 28px 포함 container 최대: 1536px

---

# 9. Navigation

## GNB

PC:

```text
height: 64px
padding-x: 16px
padding-y: 8px
```

Menu:

```text
40 × 40px
```

Logo:

```text
191 × 30px
```

Search:

```text
396 × 36px
radius: 99px
padding-x: 16px
background: BG400
border: Border400 1px
```

## LNB

```text
Expanded: 260px
Collapsed: 70px
```

자동 collapse가 시작되는 breakpoint는 현재 확정되지 않았다.

임의로 확정하지 않는다.

---

# 10. PC Home Layout

기준 viewport:

```text
1440px
```

구조:

```text
전체 1440
- LNB 260
= 1180

1180
- 좌측 28
- 우측 28
= content 1124
```

따라서 PC 홈 주요 콘텐츠 기준 폭:

```text
1124px
```

---

# 11. Hero

## PC

```text
width: 1124px
height: 320px
radius: 10px
padding-left/right: 50px
main gap: 20px
```

CTA:

```text
약 139 × 42px
padding: 14px 24px
radius: 8px

font:
Pretendard
SemiBold
14px
line-height: 1
letter-spacing: -0.01em
```

## Mobile

```text
height: 220px
padding-left/right: 50px
main gap: 10px
```

Hero title:

```text
Sandoll Mapssi
32px
line-height: 0.8
```

CTA:

```text
약 138 × 42px
padding: 14px 24px
radius: 8px

Pretendard ExtraBold
14px
```

모바일 CTA는 원본에서 `#4782FF`를 직접 사용한다.

전역 Primary `#4A92FF`와 다른 화면별 override로 유지한다.

---

# 12. Quick Cards

PC:

```text
3 columns
gap: 20px
height: 90px
padding-x: 16px
radius: 10px
background: BG400
```

Title:

```text
S-Core Dream
19px
700
```

Description:

```text
Pretendard
13px
600
line-height: 1.6
```

---

# 13. PC 주요 Section 간격

다음 큰 구역의 기본 간격:

```text
Hero
↓ 28px

Quick Cards
↓ 28px

띠광고
↓ 28px

추천 토크 채널
```

세부 section 내부 spacing은 해당 Figma 프레임 또는 `design-reference.md`를 확인한다.

---

# 14. 추천 채널

Section title → Filter:

```text
20px
```

Filter → Cards:

```text
20px
```

Cards:

```text
4 columns
horizontal gap: 20px
row gap: 40px
```

Card 기준 폭:

```text
약 266px
```

Thumbnail:

```text
266 × 163px
radius: 8px
```

Thumbnail → Body:

```text
14px
```

Avatar:

```text
40px
```

Body internal gap:

```text
5px
```

---

# 15. Filter

```text
height: 28px
radius: 24px
gap between filters: 8px
```

기본 typography:

```text
Pretendard
12px
Medium
line-height: 16px
```

`전체`와 같이 활성 상태는 Bold override가 존재할 수 있다.

디자인 시스템의 큰 Chip과 홈 작은 Filter는 서로 다른 variant다.

---

# 16. Tag

```text
height: 20px
padding: 2px 8px
radius: 20px
gap: 5px
background: #31354F
```

---

# 17. Footer

```text
padding: 44px
group gap: 24px
top border: Border100 1px
```

---

# 18. PC Home Section 순서

```text
Hero

Quick Cards

띠광고

추천 토크 채널

라이브 탑50

신입 스트리머

후원 콘텐츠

Footer
```

Figma 화면 전체 높이 `2972px`는 고정 page height가 아니다.

콘텐츠의 자연스러운 flow와 scroll을 유지한다.

---

# 19. Mobile Home

기준 시안:

```text
375 × 868
```

이 값은 breakpoint가 아니라 비교용 Figma viewport다.

Top Nav:

```text
height: 56px
button slot: 48px
icon: 24px
```

Hero:

```text
height: 220px
horizontal padding: 50px
gap: 10px
```

Ad:

```text
margin-left/right: 10px
width: 약 355px
height: 약 42px
radius: 10px
Hero와 gap: 10px
```

Bottom Navigation:

```text
시안 기준 약 84px
```

단, Figma 안의 Home Indicator 영역을 웹 콘텐츠로 직접 구현하지 않는다.

---

# 20. 모바일에서 구현하지 말아야 할 기기 표현

다음은 웹 UI로 복제하지 않는다.

- Status Bar
- Dynamic Island
- Device Frame
- Home Indicator

실제 브라우저에서는 `safe-area-inset-*`가 필요한지만 확인한다.

---

# 21. 모바일 피드

제공된 Mobile Home Figma에는 추천 피드 / 추천 카드의 실제 배치가 없다.

따라서:

- 기존 구현이 있다면 기능을 유지한다.
- 새로운 배치를 임의로 Figma 확정 규칙이라고 만들지 않는다.
- 새 제안이 필요하면 "제안"으로 구분한다.

---

# 22. Search / Notification 프레임 구분

다음 프레임은 Home 본문이 아니다.

```text
65183:135805 = Search Default
65183:136304 = Search Input
65183:136807 = Notification
```

프레임 이름에 `메인홈`이 포함되어 있어도 홈 본문으로 합치지 않는다.

---

# 23. 확인된 디자인 예외

다음 차이는 실수로 일괄 통일하지 않는다.

## Primary

Global:

```text
#4A92FF
```

Mobile Hero CTA:

```text
#4782FF
```

Search / Notification 일부 selected:

```text
#6CA6FF
```

## Button

DS Button/S:

```text
Pretendard Bold 14px
letter-spacing: 0
```

PC Hero CTA:

```text
Pretendard SemiBold 14px
letter-spacing: -0.01em
```

Mobile Hero CTA:

```text
Pretendard ExtraBold 14px
letter-spacing: -0.01em
```

이들은 서로 다른 사용 사례다.

---

# 24. 현재 미확정 항목

다음은 코드 또는 추가 Figma 확인이 필요하다.

- 실제 폰트 파일 위치
- `@font-face` 구성
- 기존 CSS token 구조
- 기존 공통 UI 구조
- 실제 홈 route
- LNB 자동 collapse breakpoint
- 모바일 추천 feed
- 인증 상태별 모바일 메뉴
- Light theme

미확정 항목 때문에 이미 확인된 색상·간격·타이포그래피 적용을 중단하지 않는다.

---

# 25. 구현 규칙

기존 저장소를 먼저 확인한다.

현재 값과 Figma 기준을 비교한 뒤 수정한다.

다음은 유지한다.

- 기존 HTML 구조
- 기존 JavaScript 동작
- API
- 인증
- 링크
- 라우팅
- 실제 콘텐츠

디자인 때문에 기능을 제거하지 않는다.

---

# 26. Assets

로고, 배너, 아이콘, 썸네일은 기존 프로젝트에 정확한 자산이 있으면 우선 재사용한다.

Figma MCP에서 제공하는 asset URL은 임시 URL일 수 있다.

그 URL을 최종 HTML/CSS/JS의 런타임 소스로 저장하지 않는다.

---

# 27. 완료 기준

## Figma 기준 화면

아래 viewport는 실제 Figma 시안과 비교하는 기준이다.

### Desktop
- 1440px

### Mobile
- 375px

이 두 값만 Figma 시안 비교 기준으로 사용한다.

## 반응형 안정성 QA

아래 viewport는 Figma 디자인 규칙이 아니라 구현 안정성 확인용이다.

- 767px
- 768px
- 1599px
- 1600px

이 값들은 breakpoint 경계에서 다음 문제를 확인하기 위한 테스트값이다.

- horizontal overflow
- 요소 겹침
- fixed / sticky 요소 충돌
- 레이아웃 전환 오류

이 QA viewport를 Figma에서 정의한 화면 규격, 디자인 토큰, 고정 레이아웃 값으로 해석하지 않는다.

검수 시에는 다음을 확인한다.

- 실제 font-family
- font-weight
- font-size
- line-height
- letter-spacing
- 색상
- 배경
- border
- radius
- padding
- gap
- width
- height
- 줄바꿈
- overflow
- fixed navigation overlap

빌드 성공만으로 디자인 검수가 완료됐다고 판단하지 않는다.

Figma와 비교할 때는 1440px과 375px을 기준으로 하고,
767/768/1599/1600은 반응형 안정성 확인에만 사용한다.

---

# 28. 설정 페이지 (계정 · 알림 · 보안)

2026-11-10 추가. Figma 작업창(토비) "설정" 보드 `66318:13684`, 구현 `settings.html`.

## 프레임

| 화면 | PC | 모바일 |
|---|---|---|
| 계정 | `66318:13685` | `66318:15349` |
| 알림 | `66318:14007` | `66318:15477` |
| 보안 | `66318:14655` | `66318:15950` |
| 모달 · 토스트 · 시트 모음 | `66318:16989` | 〃 |

## PC 레이아웃

- 2뎁스 탭 줄(← 설정 ㅣ 계정 · 알림 · 보안)은 시스템 UI라 왼쪽 정렬 그대로 둔다. 선택 탭은 Primary 글자 + 2px 밑줄, 나머지 Depth 300.
- 본문은 폭 **800px 가운데 정렬**. 섹션 사이 40px.
- 페이지 제목: `Headline/H6` (S-Core Dream 19). 설명 14 / 21 Depth 300.
- 섹션 소제목: `Subtitle/S1` (Pretendard Bold 16 / 20). 페이지 제목과 위계를 나눈다.
- 섹션은 **제목 · 설명이 위, 카드가 아래** (좌우로 나누지 않음). 설명 → 카드 16px.
- 카드: BG300 · Border100 1px · radius 12 · 안쪽 24 · 줄 사이 24. 목록 카드는 위아래 8.
- 입력칸 높이 **48px** (시안대로), BG200 · Border300 · radius 8. 바꿀 수 없는 칸은 BG300 · Border200 · 자물쇠.
- LNB 는 세로 100%, 푸터 위치에 영향을 주지 않는다 (푸터는 본문 열 아래).

## 모바일 레이아웃

- 바탕 BG100. 카드 없이 펼치고 섹션 사이에 **8px 띠(#07070D)**, 띠 위아래 32px.
- 페이지 제목은 앱바 "설정"이 대신한다. 탭 3개 균등, 선택 Bold + Primary 2px 밑줄.
- 입력칸 56px · 글자 19 Regular. 닉네임 칸과 "변경" 버튼은 붙인다.
- 계정 탭: 위에 사진 96 + 카메라 버튼 · 닉네임 · 역할 배지. 저장 버튼(50px)은 하단 내비 위에 고정.
- 시안의 모바일 문구가 PC 보다 짧은 곳은 모바일 문구를 쓴다.

## 공통 요소

- 토글: DS 컴포넌트 `토글` (`66332:17843`). 44×24, Off = BG Cancel, On = Primary.
- 체크박스: DS 컴포넌트 `체크박스` (`66332:17851`). 20×20 · radius 4 · 테두리 1.5. Off = 투명 + Border400, On = Primary, Disabled = Border400 바탕 + Depth 400 체크.
- 위험 색: 글자 `Atomic/Red/60` #FF6363, 버튼 · 테두리 `Semantic/Sys/Fill/Error` #CD0C0C.
- 닉네임 재변경 안내 문구는 PC · 모바일 모두 Depth 500.
- 역할 배지: Primary 14% 바탕 · #6CA6FF 글자 · 높이 24 · 9999.

## 모달 · 시트 · 토스트

- 모달(Alert): 폭 363 · BG400 · Border400 · radius 12 · 안쪽 32 / 20 / 20. 제목 H6 가운데, 설명 14 / 21 Depth 300. 버튼 50 · radius 10 · 사이 9 (취소 #2A2D3F · 확인 Primary · 위험 Error).
- 아이콘(67px)은 **비밀번호 변경 완료(성공)** 와 **회원 탈퇴 최종 확인(X)** 에만 넣는다. "탈퇴가 완료됐어요" 에는 아이콘을 넣지 않는다.
- 바닥 시트는 모바일 전용: 위 모서리 20 · 손잡이 40×4 · 제목 S-Core Dream 19 · 항목 52.
- 토스트: 폭 344 · BG400 · Border400 · radius 4 · 화면 아래 가운데 · 3초. 알림 탭은 바꿀 때마다 저장 토스트.
- 시안에 토스트 문구가 없는 동작(SNS 연결 해제 등)은 토스트를 띄우지 않아도 된다.
- 방해금지 시간은 30분 단위. PC 는 드롭다운("오후 9:00" 표기), 모바일은 오전/오후 · 시 · 분 휠 시트.

---

# 29. 페이지 제목 크기 — 2뎁스 메뉴 유무

2026-11-10 추가.

- 2뎁스 메뉴(← 제목 ㅣ 탭)가 **있는** 페이지의 본문 제목은 `Headline/H6` (S-Core Dream 19). 예: 크리에이터 찾기 · 설정.
- 2뎁스 메뉴가 **없는** 페이지의 본문 제목은 `Headline/H5` (S-Core Dream 28 · 행간 1 · −1%). 예: 내 지갑(65468:108947) · 펀네이션 정책안내(65571:109879).
- 크리에이터 찾기 2뎁스 메뉴(66339:56393): ← 크리에이터 찾기 ㅣ 크리에이터, 메뉴 아래 → 제목 32px.
- 크리에이터 찾기 모바일: 정렬 칩 대신 2뎁스 탭(라이브 · 인기순 · 최신순, 균등 분할)을 쓴다. 모바일 시안은 없고 사용자 지시(2026-11-10).
- 즐겨찾기(66305:94467): 시안엔 2뎁스가 빠져 있어 HTML 에만 "← 즐겨찾기 ㅣ 즐겨찾기"를 넣고 제목은 H6. 모바일은 보기 칩(전체 · 라이브 · 최근 동영상)을 2뎁스 탭으로 (2026-11-10, Figma 는 수정하지 않음).
