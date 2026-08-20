# 타일런트 캐릭터 — 중후한(묵직한) 걷기 애니메이션 스프라이트 시트 프롬프트

첨부해주신 원본 레퍼런스 이미지를 기준으로 작성한 프롬프트입니다. CODEX / MANUS에 **원본 이미지 파일을 함께 첨부**하고, 아래 텍스트 프롬프트를 그대로 붙여넣어 사용하시면 됩니다.

---

## 0. 원본 캐릭터 분석 (레퍼런스 기준)

- 종류: 돌/석고 재질의 골렘형 몬스터 ("타일런트")
- 머리: 둥글고 울퉁불퉁한 돌 재질, 표면에 균열과 이끼색 반점, 한쪽 눈은 작고 동그랗게 뜸 / 반대쪽 눈은 감긴 듯한 상처 자국
- 몸통: 회보라색(그레이-퍼플) 돌 텍스처 상체, 그 위에 낡고 헤진 보라색 조끼(하단이 지그재그로 찢어진 형태) 착용
- 팔: 좌우 비대칭 — 오른팔(이미지 기준 화면 오른쪽)이 훨씬 크고 두꺼운 근육질 팔, 왼팔은 상대적으로 얇고 작음
- 하의: 갈색/황토색 누더기 반바지, 밑단이 지그재그로 헤짐
- 다리/발: 회색 돌 재질 다리, 발가락이 4개인 뭉툭한 맨발
- 텍스처: 전신에 걸쳐 크고 작은 원형 반점(돌 표면의 이끼/얼룩) 랜덤 배치
- 아트 스타일: 플랫 셰이딩 카툰풍(cel-shaded), 두꺼운 검은 외곽선, 단순한 그림자 처리, 모바일 게임 몬스터 아이콘 스타일
- 배경: 완전한 검정/투명 배경, 그림자 없음

---

## 1. 바로 붙여넣는 마스터 프롬프트

```
[스프라이트 시트 생성 요청 — 첨부 이미지의 캐릭터를 그대로 유지할 것]

캐릭터 (첨부 레퍼런스 이미지 기준, 디자인 100% 동일하게 유지):
- 돌/석고 재질의 골렘형 몬스터. 이름: 타일런트
- 둥글고 울퉁불퉁한 돌 머리, 표면 전체에 균열과 이끼색 반점
- 한쪽 눈은 작고 동그랗게 뜬 상태, 반대쪽 눈은 감기거나 상처난 형태 (레퍼런스와 동일하게 유지)
- 상체는 회보라색 돌 텍스처, 그 위에 낡고 헤진 보라색 조끼(하단 지그재그로 찢어짐) 착용
- 팔은 좌우 비대칭: 한쪽은 두껍고 큰 근육질 팔, 반대쪽은 얇고 작은 팔 (레퍼런스의 비대칭 비율 그대로 유지)
- 하의는 갈색/황토색 누더기 반바지, 밑단 지그재그로 헤짐
- 다리와 발은 회색 돌 재질, 발가락 4개의 뭉툭한 맨발
- 전신에 랜덤한 크기의 원형 반점(이끼/얼룩) 텍스처 유지
- 아트 스타일: 플랫 셰이딩 카툰풍, 두꺼운 검은 외곽선, 단순 그림자, 모바일 게임 몬스터 아이콘 스타일 (레퍼런스와 완전히 동일한 스타일 유지)

동작: '중후한(묵직한) 걷기' 사이클
- 골렘 특유의 느리고 무거운 보폭, 한 걸음마다 땅을 짓누르는 듯한 무게감
- 큰 쪽 팔은 거의 흔들리지 않고 묵직하게 아래로 늘어진 채 이동, 작은 쪽 팔만 절제된 폭으로 스윙
- 상체(머리~몸통)는 크게 출렁이지 않고, 둔중하게 살짝만 상하로 움직임
- 걸음마다 착지 시 무게 중심이 쿵 하고 내려앉는 듯한 느낌의 포즈 강조
- 급하거나 가벼운 느낌 절대 금지 — 크고 무겁고 위압적인 인상 유지

시점: 완전 측면(side-view, 2D 게임용), 오른쪽을 향해 걷는 방향

프레임 구성 (8프레임 걷기 사이클, 대칭 구조):
1. Contact — 앞발 착지, 몸 전체가 가장 낮게 짓눌린 자세
2. Down/Recoil — 착지 충격이 흡수되는 순간, 무게가 가장 낮은 지점
3. Passing — 다리가 교차하는 중간 자세, 신체가 가장 높은 지점
4. Up — 다음 착지를 준비하며 살짝 상승
5. Contact — 반대발 착지 (1번의 좌우 반전)
6. Down/Recoil (2번의 좌우 반전)
7. Passing (3번의 좌우 반전)
8. Up (4번의 좌우 반전)

기술 사양:
- 프레임 크기: 128x128px (여백 포함), 캐릭터 실제 높이는 프레임의 약 80%
- 시트 레이아웃: 가로 1행 x 8열 스프라이트 스트립, 각 프레임 동일 앵커/스케일
- 배경: 완전 투명(PNG, alpha channel)
- 조명/그림자: 레퍼런스와 동일하게 그림자 없는 플랫 셰이딩, 모든 프레임 동일한 광원 각도
- 프레임 간 캐릭터 비율/텍스처/색상/비대칭 팔 구조 완전히 동일하게 유지 (일관성 최우선)

금지 사항 (Negative):
- 레퍼런스와 다른 색상, 다른 반점 패턴, 다른 팔 비대칭 비율로 바뀌는 것 금지
- 프레임마다 캐릭터 크기/비율이 달라지는 것 금지
- 배경 오브젝트, 그림자, 워터마크, 텍스트 삽입 금지
- 잘린 팔다리, 여분의 팔다리/손가락 금지
- 모션 블러, 잔상 효과 금지
- 가볍고 빠른 걸음걸이 금지 — 반드시 무겁고 둔중한 골렘 특유의 걸음걸이 유지

출력: 위 8프레임을 하나의 스프라이트 시트 이미지(가로 1024x128px, 128px 그리드)로 배치해서 생성.
```

---

## 2. 영문 키워드 보조 프롬프트 (이미지 생성 백엔드 호환용)

```
Style keywords: flat cel-shaded cartoon monster, mobile game creature icon style,
stone/clay golem creature, cracked rocky skin with moss-colored spots,
one small round eye + one scarred/closed eye, gray-purple stone torso,
tattered purple ragged vest with jagged hem, asymmetric arms
(one oversized muscular arm, one thin small arm), tattered brown ragged shorts
with jagged hem, gray stone legs, blunt four-toed bare feet,
thick black outlines, simple flat shading, no background shadow.

Animation keywords: heavy lumbering golem walk cycle, slow ponderous stomping gait,
minimal torso bounce, oversized arm barely swinging, small arm restrained swing,
weighty ground-pounding footsteps, side view facing right,
8-frame walking animation, horizontal sprite strip, 128x128px per frame,
transparent background, flat consistent lighting, no motion blur,
consistent proportions and asymmetry across all frames, keep character design
identical to the attached reference image.

Negative prompt: blurry, motion blur, inconsistent character design,
different color palette, different spot pattern, symmetric arms,
extra limbs, cropped body, watermark, text, background scenery, drop shadow,
fast/light/bouncy walk, running pose, front-facing pose, photorealistic, 3D render.
```

---

## 3. CODEX / MANUS 사용 가이드라인

1. **원본 이미지 첨부 필수**: 텍스트 설명만으로는 돌 반점 패턴, 팔 비대칭 비율, 눈 모양 같은 디테일이 매번 달라집니다. 반드시 원본 레퍼런스 이미지 파일을 함께 업로드하고 "이 캐릭터 디자인을 그대로 유지"라고 명시하세요.
2. **한 번에 전체 시트 요청**: 8프레임을 개별로 나눠 요청하면 매 프레임마다 반점 위치나 팔 비율이 미세하게 달라집니다. "8프레임을 한 장의 그리드 이미지로" 라고 명시해 한 번의 생성 호출로 처리하세요.
3. **비대칭 팔 강조**: 골렘 캐릭터의 핵심 특징인 좌우 비대칭 팔(한쪽만 크고 근육질)이 걷기 동작 중에도 항상 같은 쪽에 유지되도록 프롬프트에서 반복 강조하세요. 이 부분이 가장 깨지기 쉬운 디테일입니다.
4. **후처리 검수**: 생성된 시트는 Aseprite, Photoshop 등으로 128px 그리드 기준 슬라이스 후, 특히 3번(Passing)/7번 프레임에서 팔 비대칭이 반대로 뒤집히지 않았는지, 반점 패턴이 유지됐는지 확인하세요.
5. **재생성 시 참고 문구**: 걸음걸이가 너무 가볍거나 빨라 보이면 "더 느리고 무겁게, 땅을 짓누르는 듯한 골렘 특유의 걸음걸이로"라고 재요청 문구를 덧붙이세요.
6. **애니메이션 검수**: 슬라이스한 프레임을 6~8fps로 재생해 확인하세요. 골렘의 '중후함'을 살리려면 일반 캐릭터보다 낮은 프레임레이트(6fps 권장)가 더 무게감 있게 보입니다.
