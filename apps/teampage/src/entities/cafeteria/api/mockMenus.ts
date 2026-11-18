/**
 * 학식 편집기 개발용 GET /cafeterias/menus 응답 스냅샷.
 *
 * 2026-11-10에 운영 apis에서 날짜별로 한 번씩 받아 둔 값이다(2026-11-02 ~ 2026-11-15, 11/14 이후는 빈 응답).
 * 개발 중 매번 운영 apis를 부르지 않으려고 둔다. 형식 검사는 쓰는 쪽에서 `menusResponseSchema.parse`로 한다.
 */
export const MOCK_MENUS: Record<string, unknown> = {
  '2026-11-02': {
    date: '2026-11-02',
    hasNextWeekData: true,
    availableTimes: ['BREAKFAST', 'LUNCH', 'DINNER'],
    menusByMealTime: {
      BREAKFAST: {
        cafeterias: [
          {
            id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
            name: '학생회관',
            isPinned: false,
            menus: [
              {
                corner: 'B코너',
                items: [
                  {
                    role: 'MAIN',
                    name: '청국장찌개',
                    side: ['어묵양파볶음', '우엉채조림', '아삭이고추무침', '깍두기'],
                    price: 1000,
                    isPopular: false,
                  },
                ],
              },
            ],
            extra: [],
          },
        ],
      },
      LUNCH: {
        cafeterias: [
          {
            id: '1e207d14-d2ea-4275-8f41-7230cf7a1aa3',
            name: '이룸라운지',
            isPinned: false,
            menus: [
              {
                corner: null,
                items: [
                  {
                    role: 'MAIN',
                    name: '아쿠아돈까스',
                    side: ['잡곡밥', '야채스프', '핫타이쫄면', '참나물겉절이', '오복지'],
                    price: 7000,
                    isPopular: false,
                  },
                ],
              },
            ],
            extra: [],
          },
          {
            id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
            name: '학생회관',
            isPinned: false,
            menus: [
              {
                corner: 'B코너',
                items: [
                  {
                    role: 'MAIN',
                    name: '로제찜닭',
                    side: ['미역국', '주키니호박볶음', '치커리레몬무침', '깍두기'],
                    price: 5000,
                    isPopular: false,
                  },
                ],
              },
              {
                corner: 'C코너',
                items: [
                  {
                    role: 'MAIN',
                    name: '햄감자짜글이',
                    side: ['표고느타리볶음', '깻잎무침', '김치'],
                    price: 3800,
                    isPopular: false,
                  },
                ],
              },
            ],
            extra: ['A코너: 라면(2,500원), 오징어해장라면(3,300원), 삶은계란(400원)'],
          },
          {
            id: 'f262ad60-0ed7-4591-b411-1a96ceefd30e',
            name: '양식당',
            isPinned: false,
            menus: [
              {
                corner: null,
                items: [
                  {
                    role: 'MAIN',
                    name: '상하이스파게티',
                    side: [],
                    price: 7000,
                    isPopular: true,
                  },
                  {
                    role: 'MAIN',
                    name: '통삼겹스테이크',
                    side: [],
                    price: 8000,
                    isPopular: false,
                  },
                  {
                    role: 'SUB',
                    name: '고구마치즈돈까스',
                    side: [],
                    price: 6000,
                    isPopular: false,
                  },
                  {
                    role: 'SUB',
                    name: '브런치',
                    side: [],
                    price: 6000,
                    isPopular: false,
                  },
                  {
                    role: 'SUB',
                    name: '쏘이까스',
                    side: [],
                    price: 5500,
                    isPopular: false,
                  },
                  {
                    role: 'SUB',
                    name: '치즈볼 (5개)',
                    side: [],
                    price: 3000,
                    isPopular: false,
                  },
                  {
                    role: 'SUB',
                    name: '치킨까스',
                    side: [],
                    price: 6000,
                    isPopular: false,
                  },
                  {
                    role: 'SUB',
                    name: '치킨텐더샐러드',
                    side: [],
                    price: 5000,
                    isPopular: false,
                  },
                  {
                    role: 'SUB',
                    name: '탄산음료',
                    side: [],
                    price: 1000,
                    isPopular: false,
                  },
                ],
              },
            ],
            extra: [],
          },
          {
            id: 'f69af299-de24-4bed-a6f0-77c5e12982cc',
            name: '자연과학관',
            isPinned: false,
            menus: [
              {
                corner: null,
                items: [
                  {
                    role: 'MAIN',
                    name: '순대오징어두루치기',
                    side: ['시골된장찌개', '브로컬리피망볶음', '얼갈이겉절이', '건파래자반', '깍두기'],
                    price: 6000,
                    isPopular: true,
                  },
                ],
              },
            ],
            extra: [],
          },
        ],
      },
      DINNER: {
        cafeterias: [
          {
            id: '1e207d14-d2ea-4275-8f41-7230cf7a1aa3',
            name: '이룸라운지',
            isPinned: false,
            menus: [
              {
                corner: null,
                items: [
                  {
                    role: 'MAIN',
                    name: '대파육개장',
                    side: ['잡곡밥', '훈제오리스크램블에그', '햄감자조림', '아삭이고추된장무침', '유채나물'],
                    price: 7000,
                    isPopular: false,
                  },
                ],
              },
            ],
            extra: [],
          },
          {
            id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
            name: '학생회관',
            isPinned: false,
            menus: [
              {
                corner: 'B코너',
                items: [
                  {
                    role: 'MAIN',
                    name: '나주곰탕',
                    side: ['우엉채조림', '도라지무침', '마늘쫑장아찌', '깍두기'],
                    price: 5000,
                    isPopular: false,
                  },
                ],
              },
              {
                corner: 'C코너',
                items: [
                  {
                    role: 'MAIN',
                    name: '열정국밥',
                    side: ['미역줄기볶음', '미나리숙주무침', '김치'],
                    price: 3800,
                    isPopular: false,
                  },
                ],
              },
            ],
            extra: [],
          },
          {
            id: 'f69af299-de24-4bed-a6f0-77c5e12982cc',
            name: '자연과학관',
            isPinned: false,
            menus: [
              {
                corner: null,
                items: [
                  {
                    role: 'MAIN',
                    name: '삼치구이',
                    side: ['돈육짜글이', '메추리알조림', '오이양파무침', '명엽채볶음', '김치'],
                    price: 6000,
                    isPopular: false,
                  },
                ],
              },
            ],
            extra: [],
          },
        ],
      },
    },
  },
  '2026-11-03': {
    date: '2026-11-03',
    hasNextWeekData: true,
    availableTimes: ['BREAKFAST', 'LUNCH', 'DINNER'],
    menusByMealTime: {
      BREAKFAST: {
        cafeterias: [
          {
            id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
            name: '학생회관',
            isPinned: false,
            menus: [
              {
                corner: 'B코너',
                items: [
                  {
                    role: 'MAIN',
                    name: '짬뽕국',
                    side: ['고추돼지튀김', '브로컬리볶음', '숙주무침', '김치'],
                    price: 1000,
                    isPopular: false,
                  },
                ],
              },
            ],
            extra: [],
          },
        ],
      },
      LUNCH: {
        cafeterias: [
          {
            id: '1e207d14-d2ea-4275-8f41-7230cf7a1aa3',
            name: '이룸라운지',
            isPinned: false,
            menus: [
              {
                corner: 'A코너',
                items: [
                  {
                    role: 'MAIN',
                    name: '굽네 갈비치킨(뼈o)',
                    side: ['잡곡밥', '김치국', '김말이강정', '숙주나물', '크랜베리콘샐러드'],
                    price: 7000,
                    isPopular: true,
                  },
                ],
              },
              {
                corner: 'B코너',
                items: [
                  {
                    role: 'MAIN',
                    name: '일본st규카레동',
                    side: ['잡곡밥', '김치국', '왕새우튀김', '버섯그린빈스볶음', '크랜베리콘샐러드'],
                    price: 7000,
                    isPopular: false,
                  },
                ],
              },
            ],
            extra: [
              '고급식A(25,000원): 찜닭정식+솥밥',
              '고급식B(25,000원): 들깨미역국+고등어구이+솥밥, - 고급식C : 30,000원 -, 곤드레솥밥+구운채소, - 고급식D : 30,000원 -, 채끝스테이크+구운채소',
            ],
          },
          {
            id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
            name: '학생회관',
            isPinned: false,
            menus: [
              {
                corner: 'B코너',
                items: [
                  {
                    role: 'MAIN',
                    name: '소시지오므라이스',
                    side: ['미니우동', '우거지지짐', '오복지무침', '김치'],
                    price: 5000,
                    isPopular: false,
                  },
                ],
              },
              {
                corner: 'C코너',
                items: [
                  {
                    role: 'MAIN',
                    name: '순두부찌개',
                    side: ['들깨무나물', '고들빼기무침', '깍두기'],
                    price: 3800,
                    isPopular: false,
                  },
                ],
              },
            ],
            extra: ['A코너: 라면(2,500원), 오징어해장라면(3,300원), 삶은계란(400원)'],
          },
          {
            id: 'f262ad60-0ed7-4591-b411-1a96ceefd30e',
            name: '양식당',
            isPinned: false,
            menus: [
              {
                corner: null,
                items: [
                  {
                    role: 'MAIN',
                    name: '가쓰오볶음우동',
                    side: [],
                    price: 7000,
                    isPopular: false,
                  },
                  {
                    role: 'MAIN',
                    name: '데리야끼핫치킨스테이크',
                    side: [],
                    price: 7000,
                    isPopular: true,
                  },
                  {
                    role: 'SUB',
                    name: '고구마치즈돈까스',
                    side: [],
                    price: 6000,
                    isPopular: false,
                  },
                  {
                    role: 'SUB',
                    name: '고추마요치킨',
                    side: [],
                    price: 6000,
                    isPopular: false,
                  },
                  {
                    role: 'SUB',
                    name: '쏘이까스',
                    side: [],
                    price: 5500,
                    isPopular: false,
                  },
                  {
                    role: 'SUB',
                    name: '치즈볼 (5개)',
                    side: [],
                    price: 3000,
                    isPopular: false,
                  },
                  {
                    role: 'SUB',
                    name: '치킨까스',
                    side: [],
                    price: 6000,
                    isPopular: false,
                  },
                  {
                    role: 'SUB',
                    name: '탄산음료',
                    side: [],
                    price: 1000,
                    isPopular: false,
                  },
                  {
                    role: 'SUB',
                    name: '파스타샐러드',
                    side: [],
                    price: 5000,
                    isPopular: false,
                  },
                ],
              },
            ],
            extra: [],
          },
          {
            id: 'f69af299-de24-4bed-a6f0-77c5e12982cc',
            name: '자연과학관',
            isPinned: false,
            menus: [
              {
                corner: null,
                items: [
                  {
                    role: 'MAIN',
                    name: '얼큰닭볶음탕',
                    side: ['미역국', '고기만두찜', '콩나물무침', '양배추찜&쌈장', '김치'],
                    price: 6000,
                    isPopular: false,
                  },
                ],
              },
            ],
            extra: [],
          },
        ],
      },
      DINNER: {
        cafeterias: [
          {
            id: '1e207d14-d2ea-4275-8f41-7230cf7a1aa3',
            name: '이룸라운지',
            isPinned: false,
            menus: [
              {
                corner: null,
                items: [
                  {
                    role: 'MAIN',
                    name: '짜장면',
                    side: ['후리가케밥', '짬뽕국', '탕수육', '짜사이무침', '요구르트'],
                    price: 7000,
                    isPopular: false,
                  },
                ],
              },
            ],
            extra: [
              '고급식A(25,000원): 찜닭정식+솥밥',
              '고급식B(25,000원): 들깨미역국+고등어구이+솥밥, - 고급식C : 30,000원 -, 곤드레솥밥+구운채소, - 고급식D : 30,000원 -, 채끝스테이크+구운채소',
            ],
          },
          {
            id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
            name: '학생회관',
            isPinned: false,
            menus: [
              {
                corner: 'B코너',
                items: [
                  {
                    role: 'MAIN',
                    name: '돈까스&김치나베',
                    side: ['느타리버섯볶음', '청경채나물무침', '콘샐러드', '깍두기'],
                    price: 5000,
                    isPopular: false,
                  },
                ],
              },
              {
                corner: 'C코너',
                items: [
                  {
                    role: 'MAIN',
                    name: '짜장덮밥',
                    side: ['유부우동국', '구슬로제떡볶이', '김치'],
                    price: 3800,
                    isPopular: false,
                  },
                ],
              },
            ],
            extra: [],
          },
          {
            id: 'f69af299-de24-4bed-a6f0-77c5e12982cc',
            name: '자연과학관',
            isPinned: false,
            menus: [
              {
                corner: null,
                items: [
                  {
                    role: 'MAIN',
                    name: '돼지국밥',
                    side: ['두부조림', '미니새송이볶음', '부추겉절이', '오복채지', '깍두기'],
                    price: 6000,
                    isPopular: false,
                  },
                ],
              },
            ],
            extra: [],
          },
        ],
      },
    },
  },
  '2026-11-04': {
    date: '2026-11-04',
    hasNextWeekData: true,
    availableTimes: ['BREAKFAST', 'LUNCH', 'DINNER'],
    menusByMealTime: {
      BREAKFAST: {
        cafeterias: [
          {
            id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
            name: '학생회관',
            isPinned: false,
            menus: [
              {
                corner: 'B코너',
                items: [
                  {
                    role: 'MAIN',
                    name: '매콤된장찌개',
                    side: ['메추리알장조림', '맛살채소볶음', '바나나', '김치'],
                    price: 1000,
                    isPopular: false,
                  },
                ],
              },
            ],
            extra: [],
          },
        ],
      },
      LUNCH: {
        cafeterias: [
          {
            id: '1e207d14-d2ea-4275-8f41-7230cf7a1aa3',
            name: '이룸라운지',
            isPinned: false,
            menus: [
              {
                corner: null,
                items: [
                  {
                    role: 'MAIN',
                    name: '파채간장불고기',
                    side: ['잡곡밥', '콩비지찌개', '두부양념조림', '청경채유자청겉절이', '양배추쌈'],
                    price: 7000,
                    isPopular: false,
                  },
                ],
              },
            ],
            extra: [
              '고급식A(25,000원): 찜닭정식+솥밥',
              '고급식B(25,000원): 들깨미역국+고등어구이+솥밥, - 고급식C : 30,000원 -, 곤드레솥밥+구운채소, - 고급식D : 30,000원 -, 채끝스테이크+구운채소',
            ],
          },
          {
            id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
            name: '학생회관',
            isPinned: false,
            menus: [
              {
                corner: 'B코너',
                items: [
                  {
                    role: 'MAIN',
                    name: '매콤제육새송이볶음',
                    side: ['배추된장국', '볼어묵조림', '천사채무침', '깍두기'],
                    price: 5000,
                    isPopular: false,
                  },
                ],
              },
              {
                corner: 'C코너',
                items: [
                  {
                    role: 'MAIN',
                    name: '육개장',
                    side: ['교자만두튀김', '도토리묵채소무침', '김치'],
                    price: 3800,
                    isPopular: false,
                  },
                ],
              },
            ],
            extra: ['A코너: 라면(2,500원), 오징어해장라면(3,300원), 삶은계란(400원)'],
          },
          {
            id: 'f262ad60-0ed7-4591-b411-1a96ceefd30e',
            name: '양식당',
            isPinned: false,
            menus: [
              {
                corner: null,
                items: [
                  {
                    role: 'MAIN',
                    name: '게살크림스파게티',
                    side: [],
                    price: 7500,
                    isPopular: true,
                  },
                  {
                    role: 'MAIN',
                    name: '목살 스테이크&라이스',
                    side: [],
                    price: 8000,
                    isPopular: false,
                  },
                  {
                    role: 'SUB',
                    name: '고구마치즈돈까스',
                    side: [],
                    price: 6000,
                    isPopular: false,
                  },
                  {
                    role: 'SUB',
                    name: '소시지&함박스테이크',
                    side: [],
                    price: 8000,
                    isPopular: false,
                  },
                  {
                    role: 'SUB',
                    name: '쏘이까스',
                    side: [],
                    price: 5500,
                    isPopular: false,
                  },
                  {
                    role: 'SUB',
                    name: '요거트아이스샐러드',
                    side: [],
                    price: 6000,
                    isPopular: false,
                  },
                  {
                    role: 'SUB',
                    name: '치즈볼 (5개)',
                    side: [],
                    price: 3000,
                    isPopular: false,
                  },
                  {
                    role: 'SUB',
                    name: '탄산음료',
                    side: [],
                    price: 1000,
                    isPopular: false,
                  },
                  {
                    role: 'SUB',
                    name: '페퍼로니 피자(2인)',
                    side: [],
                    price: 9900,
                    isPopular: false,
                  },
                ],
              },
            ],
            extra: [],
          },
          {
            id: 'f69af299-de24-4bed-a6f0-77c5e12982cc',
            name: '자연과학관',
            isPinned: false,
            menus: [
              {
                corner: null,
                items: [
                  {
                    role: 'MAIN',
                    name: '순살돈갈비찜',
                    side: ['콩가루배추국', '부추전', '호박새우젓볶음', '양파장아찌', '깍두기'],
                    price: 6000,
                    isPopular: true,
                  },
                ],
              },
            ],
            extra: [],
          },
        ],
      },
      DINNER: {
        cafeterias: [
          {
            id: '1e207d14-d2ea-4275-8f41-7230cf7a1aa3',
            name: '이룸라운지',
            isPinned: false,
            menus: [
              {
                corner: null,
                items: [
                  {
                    role: 'MAIN',
                    name: '김밥볶음밥',
                    side: ['된장찌개', '계란후라이', '빨간꼬치어묵', '호박야채볶음', '청포묵무침'],
                    price: 7000,
                    isPopular: false,
                  },
                ],
              },
            ],
            extra: [
              '고급식A(25,000원): 찜닭정식+솥밥',
              '고급식B(25,000원): 들깨미역국+고등어구이+솥밥, - 고급식C : 30,000원 -, 곤드레솥밥+구운채소, - 고급식D : 30,000원 -, 채끝스테이크+구운채소',
            ],
          },
          {
            id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
            name: '학생회관',
            isPinned: false,
            menus: [
              {
                corner: 'B코너',
                items: [
                  {
                    role: 'MAIN',
                    name: '설렁탕&소면',
                    side: ['볼어묵볶음', '시래기된장지짐', '상추겉절이', '깍두기'],
                    price: 5000,
                    isPopular: false,
                  },
                ],
              },
              {
                corner: 'C코너',
                items: [
                  {
                    role: 'MAIN',
                    name: '햄김치찌개',
                    side: ['생선까스&타르', '부추양파무침', '깍두기'],
                    price: 3800,
                    isPopular: false,
                  },
                ],
              },
            ],
            extra: [],
          },
          {
            id: 'f69af299-de24-4bed-a6f0-77c5e12982cc',
            name: '자연과학관',
            isPinned: false,
            menus: [
              {
                corner: null,
                items: [
                  {
                    role: 'MAIN',
                    name: '새우관자볶음밥',
                    side: ['파계란국', '짜조', '어묵볶음', '미나리겉절이', '깍두기'],
                    price: 6000,
                    isPopular: false,
                  },
                ],
              },
            ],
            extra: [],
          },
        ],
      },
    },
  },
  '2026-11-05': {
    date: '2026-11-05',
    hasNextWeekData: true,
    availableTimes: ['BREAKFAST', 'LUNCH', 'DINNER'],
    menusByMealTime: {
      BREAKFAST: {
        cafeterias: [
          {
            id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
            name: '학생회관',
            isPinned: false,
            menus: [
              {
                corner: 'B코너',
                items: [
                  {
                    role: 'MAIN',
                    name: '강릉초당순두부*양념장',
                    side: ['메밀전병', '탕평채', '콩나물무침', '김치'],
                    price: 1000,
                    isPopular: false,
                  },
                ],
              },
            ],
            extra: [],
          },
        ],
      },
      LUNCH: {
        cafeterias: [
          {
            id: '1e207d14-d2ea-4275-8f41-7230cf7a1aa3',
            name: '이룸라운지',
            isPinned: false,
            menus: [
              {
                corner: 'A코너',
                items: [
                  {
                    role: 'MAIN',
                    name: '미트소스스파게티',
                    side: ['잡곡밥', '유부장국', '오징어핫바*머스타드', '얼갈이시저샐러드', '피클락교무침'],
                    price: 7000,
                    isPopular: false,
                  },
                ],
              },
              {
                corner: 'B코너',
                items: [
                  {
                    role: 'MAIN',
                    name: '치킨마요덮밥',
                    side: ['잡곡밥', '유부장국', '미니핫도그*케찹', '얼갈이시저샐러드', '피클락교무침'],
                    price: 7000,
                    isPopular: true,
                  },
                ],
              },
            ],
            extra: [
              '고급식A(25,000원): 찜닭정식+솥밥',
              '고급식B(25,000원): 들깨미역국+고등어구이+솥밥, - 고급식C : 30,000원 -, 곤드레솥밥+구운채소, - 고급식D : 30,000원 -, 채끝스테이크+구운채소',
            ],
          },
          {
            id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
            name: '학생회관',
            isPinned: false,
            menus: [
              {
                corner: 'B코너',
                items: [
                  {
                    role: 'MAIN',
                    name: '바지락살칼국수',
                    side: ['김치전', '느타리양파볶음', '연근참깨무침', '깍두기'],
                    price: 5000,
                    isPopular: false,
                  },
                ],
              },
              {
                corner: 'C코너',
                items: [
                  {
                    role: 'MAIN',
                    name: '마파두부덮밥',
                    side: ['유부국', '마카로니샐러드', '김치'],
                    price: 3800,
                    isPopular: false,
                  },
                ],
              },
            ],
            extra: ['A코너: 라면(2,500원), 오징어해장라면(3,300원), 삶은계란(400원)'],
          },
          {
            id: 'f262ad60-0ed7-4591-b411-1a96ceefd30e',
            name: '양식당',
            isPinned: false,
            menus: [
              {
                corner: null,
                items: [
                  {
                    role: 'MAIN',
                    name: '상하이스파게티',
                    side: [],
                    price: 7000,
                    isPopular: true,
                  },
                  {
                    role: 'MAIN',
                    name: '통삼겹스테이크',
                    side: [],
                    price: 8000,
                    isPopular: false,
                  },
                  {
                    role: 'SUB',
                    name: '고구마치즈돈까스',
                    side: [],
                    price: 6000,
                    isPopular: false,
                  },
                  {
                    role: 'SUB',
                    name: '고추마요치킨',
                    side: [],
                    price: 6000,
                    isPopular: false,
                  },
                  {
                    role: 'SUB',
                    name: '쏘이까스',
                    side: [],
                    price: 5500,
                    isPopular: false,
                  },
                  {
                    role: 'SUB',
                    name: '치즈볼 (5개)',
                    side: [],
                    price: 3000,
                    isPopular: false,
                  },
                  {
                    role: 'SUB',
                    name: '치킨까스',
                    side: [],
                    price: 6000,
                    isPopular: false,
                  },
                  {
                    role: 'SUB',
                    name: '탄산음료',
                    side: [],
                    price: 1000,
                    isPopular: false,
                  },
                ],
              },
            ],
            extra: [],
          },
          {
            id: 'f69af299-de24-4bed-a6f0-77c5e12982cc',
            name: '자연과학관',
            isPinned: false,
            menus: [
              {
                corner: null,
                items: [
                  {
                    role: 'MAIN',
                    name: '전복톳밥&양념장',
                    side: ['시금치된장국', '떡갈비함박', '열무나물무침', '도라지생채', '김치'],
                    price: 6000,
                    isPopular: false,
                  },
                ],
              },
            ],
            extra: [],
          },
        ],
      },
      DINNER: {
        cafeterias: [
          {
            id: '1e207d14-d2ea-4275-8f41-7230cf7a1aa3',
            name: '이룸라운지',
            isPinned: false,
            menus: [
              {
                corner: null,
                items: [
                  {
                    role: 'MAIN',
                    name: '순대탕',
                    side: ['잡곡밥', '메밀전병', '총알새송이볶음', '콩나물맛살냉채', '야채스틱*쌈장'],
                    price: 7000,
                    isPopular: false,
                  },
                ],
              },
            ],
            extra: [
              '고급식A(25,000원): 찜닭정식+솥밥',
              '고급식B(25,000원): 들깨미역국+고등어구이+솥밥, - 고급식C : 30,000원 -, 곤드레솥밥+구운채소, - 고급식D : 30,000원 -, 채끝스테이크+구운채소',
            ],
          },
          {
            id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
            name: '학생회관',
            isPinned: false,
            menus: [
              {
                corner: 'B코너',
                items: [
                  {
                    role: 'MAIN',
                    name: '제육볶음',
                    side: ['팽이된장국', '감자채볶음', '양념깻잎지', '깍두기'],
                    price: 5000,
                    isPopular: false,
                  },
                ],
              },
              {
                corner: 'C코너',
                items: [
                  {
                    role: 'MAIN',
                    name: '순대국밥',
                    side: ['애호박나물볶음', '적채채소무침', '김치'],
                    price: 3800,
                    isPopular: false,
                  },
                ],
              },
            ],
            extra: [],
          },
          {
            id: 'f69af299-de24-4bed-a6f0-77c5e12982cc',
            name: '자연과학관',
            isPinned: false,
            menus: [
              {
                corner: null,
                items: [
                  {
                    role: 'MAIN',
                    name: '닭개장',
                    side: ['소시지야채볶음', '참나물무침', '연근흑임자샐러드', '오그락지', '김치'],
                    price: 6000,
                    isPopular: false,
                  },
                ],
              },
            ],
            extra: [],
          },
        ],
      },
    },
  },
  '2026-11-06': {
    date: '2026-11-06',
    hasNextWeekData: true,
    availableTimes: ['BREAKFAST', 'LUNCH', 'DINNER'],
    menusByMealTime: {
      BREAKFAST: {
        cafeterias: [
          {
            id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
            name: '학생회관',
            isPinned: false,
            menus: [
              {
                corner: 'B코너',
                items: [
                  {
                    role: 'MAIN',
                    name: '콩나물국밥',
                    side: ['물만두강정', '취나물무침', '건파래볶음', '김치'],
                    price: 1000,
                    isPopular: false,
                  },
                ],
              },
            ],
            extra: [],
          },
        ],
      },
      LUNCH: {
        cafeterias: [
          {
            id: '1e207d14-d2ea-4275-8f41-7230cf7a1aa3',
            name: '이룸라운지',
            isPinned: false,
            menus: [
              {
                corner: null,
                items: [
                  {
                    role: 'MAIN',
                    name: '팔보채덮밥',
                    side: ['잡곡밥', '쌀국수국물', '사모사*춘권&칠리s', '햄마늘쫑볶음', '궁채장아찌'],
                    price: 7000,
                    isPopular: false,
                  },
                ],
              },
            ],
            extra: [
              '고급식A(25,000원): 찜닭정식+솥밥',
              '고급식B(25,000원): 들깨미역국+고등어구이+솥밥, - 고급식C : 30,000원 -, 곤드레솥밥+구운채소, - 고급식D : 30,000원 -, 채끝스테이크+구운채소',
            ],
          },
          {
            id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
            name: '학생회관',
            isPinned: false,
            menus: [
              {
                corner: 'B코너',
                items: [
                  {
                    role: 'MAIN',
                    name: '소고기마라탕',
                    side: ['동그랑땡&', '멸치견과류볶음', '무짠지채', '깍두기'],
                    price: 5000,
                    isPopular: true,
                  },
                ],
              },
              {
                corner: 'C코너',
                items: [
                  {
                    role: 'MAIN',
                    name: '만두전골',
                    side: ['미트볼조림', '참나물겉절이', '깍두기'],
                    price: 3800,
                    isPopular: false,
                  },
                ],
              },
            ],
            extra: ['A코너: 라면(2,500원), 오징어해장라면(3,300원), 삶은계란(400원)'],
          },
          {
            id: 'f262ad60-0ed7-4591-b411-1a96ceefd30e',
            name: '양식당',
            isPinned: false,
            menus: [
              {
                corner: null,
                items: [
                  {
                    role: 'MAIN',
                    name: '마제파스타',
                    side: [],
                    price: 7000,
                    isPopular: true,
                  },
                  {
                    role: 'MAIN',
                    name: '팟타이(땅콩함유)',
                    side: [],
                    price: 6500,
                    isPopular: false,
                  },
                  {
                    role: 'SUB',
                    name: '고구마치즈돈까스',
                    side: [],
                    price: 6000,
                    isPopular: false,
                  },
                  {
                    role: 'SUB',
                    name: '브런치',
                    side: [],
                    price: 6000,
                    isPopular: false,
                  },
                  {
                    role: 'SUB',
                    name: '소시지&함박스테이크',
                    side: [],
                    price: 8000,
                    isPopular: false,
                  },
                  {
                    role: 'SUB',
                    name: '쏘이까스',
                    side: [],
                    price: 5500,
                    isPopular: false,
                  },
                  {
                    role: 'SUB',
                    name: '치즈볼 (5개)',
                    side: [],
                    price: 3000,
                    isPopular: false,
                  },
                  {
                    role: 'SUB',
                    name: '치킨텐더샐러드',
                    side: [],
                    price: 5000,
                    isPopular: false,
                  },
                  {
                    role: 'SUB',
                    name: '탄산음료',
                    side: [],
                    price: 1000,
                    isPopular: false,
                  },
                ],
              },
            ],
            extra: [],
          },
          {
            id: 'f69af299-de24-4bed-a6f0-77c5e12982cc',
            name: '자연과학관',
            isPinned: false,
            menus: [
              {
                corner: null,
                items: [
                  {
                    role: 'MAIN',
                    name: '고추장제육',
                    side: ['조랭이떡국', '콩나물잡채', '상추&쌈장', '진미채볶음', '깍두기'],
                    price: 6000,
                    isPopular: true,
                  },
                ],
              },
            ],
            extra: [],
          },
        ],
      },
      DINNER: {
        cafeterias: [
          {
            id: '1e207d14-d2ea-4275-8f41-7230cf7a1aa3',
            name: '이룸라운지',
            isPinned: false,
            menus: [
              {
                corner: null,
                items: [
                  {
                    role: 'MAIN',
                    name: '제육볶음',
                    side: ['잡곡밥', '무채국', '크림치즈볼(2p)', '쥐어채볶음', '콩자반'],
                    price: 7000,
                    isPopular: true,
                  },
                ],
              },
            ],
            extra: [
              '고급식A(25,000원): 찜닭정식+솥밥',
              '고급식B(25,000원): 들깨미역국+고등어구이+솥밥, - 고급식C : 30,000원 -, 곤드레솥밥+구운채소, - 고급식D : 30,000원 -, 채끝스테이크+구운채소',
            ],
          },
          {
            id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
            name: '학생회관',
            isPinned: false,
            menus: [
              {
                corner: 'B코너',
                items: [
                  {
                    role: 'MAIN',
                    name: '부대찌개&라면',
                    side: ['감자고로케&케찹', '맛살채소볶음', '깻순나물', '깍두기'],
                    price: 5000,
                    isPopular: false,
                  },
                ],
              },
              {
                corner: 'C코너',
                items: [
                  {
                    role: 'MAIN',
                    name: '황태해장국',
                    side: ['연근조림', '마늘쫑볶음', '김치'],
                    price: 3800,
                    isPopular: false,
                  },
                ],
              },
            ],
            extra: [],
          },
          {
            id: 'f69af299-de24-4bed-a6f0-77c5e12982cc',
            name: '자연과학관',
            isPinned: false,
            menus: [
              {
                corner: null,
                items: [
                  {
                    role: 'MAIN',
                    name: '소고기카레라이스',
                    side: ['얼큰콩나물국', '오징어까스', '취나물볶음', '단무지무침', '김치'],
                    price: 6000,
                    isPopular: false,
                  },
                ],
              },
            ],
            extra: [],
          },
        ],
      },
    },
  },
  '2026-11-07': {
    date: '2026-11-07',
    hasNextWeekData: true,
    availableTimes: ['BREAKFAST', 'LUNCH', 'DINNER'],
    menusByMealTime: {
      BREAKFAST: {
        cafeterias: [
          {
            id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
            name: '학생회관',
            isPinned: false,
            menus: [],
            extra: [],
          },
        ],
      },
      LUNCH: {
        cafeterias: [
          {
            id: '1e207d14-d2ea-4275-8f41-7230cf7a1aa3',
            name: '이룸라운지',
            isPinned: false,
            menus: [],
            extra: [],
          },
          {
            id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
            name: '학생회관',
            isPinned: false,
            menus: [],
            extra: [],
          },
          {
            id: 'f262ad60-0ed7-4591-b411-1a96ceefd30e',
            name: '양식당',
            isPinned: false,
            menus: [],
            extra: [],
          },
          {
            id: 'f69af299-de24-4bed-a6f0-77c5e12982cc',
            name: '자연과학관',
            isPinned: false,
            menus: [],
            extra: [],
          },
        ],
      },
      DINNER: {
        cafeterias: [
          {
            id: '1e207d14-d2ea-4275-8f41-7230cf7a1aa3',
            name: '이룸라운지',
            isPinned: false,
            menus: [],
            extra: [],
          },
          {
            id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
            name: '학생회관',
            isPinned: false,
            menus: [],
            extra: [],
          },
          {
            id: 'f69af299-de24-4bed-a6f0-77c5e12982cc',
            name: '자연과학관',
            isPinned: false,
            menus: [],
            extra: [],
          },
        ],
      },
    },
  },
  '2026-11-08': {
    date: '2026-11-08',
    hasNextWeekData: true,
    availableTimes: ['BREAKFAST', 'LUNCH', 'DINNER'],
    menusByMealTime: {
      BREAKFAST: {
        cafeterias: [
          {
            id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
            name: '학생회관',
            isPinned: false,
            menus: [],
            extra: [],
          },
        ],
      },
      LUNCH: {
        cafeterias: [
          {
            id: '1e207d14-d2ea-4275-8f41-7230cf7a1aa3',
            name: '이룸라운지',
            isPinned: false,
            menus: [],
            extra: [],
          },
          {
            id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
            name: '학생회관',
            isPinned: false,
            menus: [],
            extra: [],
          },
          {
            id: 'f262ad60-0ed7-4591-b411-1a96ceefd30e',
            name: '양식당',
            isPinned: false,
            menus: [],
            extra: [],
          },
          {
            id: 'f69af299-de24-4bed-a6f0-77c5e12982cc',
            name: '자연과학관',
            isPinned: false,
            menus: [],
            extra: [],
          },
        ],
      },
      DINNER: {
        cafeterias: [
          {
            id: '1e207d14-d2ea-4275-8f41-7230cf7a1aa3',
            name: '이룸라운지',
            isPinned: false,
            menus: [],
            extra: [],
          },
          {
            id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
            name: '학생회관',
            isPinned: false,
            menus: [],
            extra: [],
          },
          {
            id: 'f69af299-de24-4bed-a6f0-77c5e12982cc',
            name: '자연과학관',
            isPinned: false,
            menus: [],
            extra: [],
          },
        ],
      },
    },
  },
  '2026-11-09': {
    date: '2026-11-09',
    hasNextWeekData: false,
    availableTimes: ['BREAKFAST', 'LUNCH', 'DINNER'],
    menusByMealTime: {
      BREAKFAST: {
        cafeterias: [
          {
            id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
            name: '학생회관',
            isPinned: false,
            menus: [
              {
                corner: 'B코너',
                items: [
                  {
                    role: 'MAIN',
                    name: '모듬어묵탕',
                    side: ['교자만두튀김', '맛살버섯볶음', '쑥갓당근무침', '김치'],
                    price: 1000,
                    isPopular: false,
                  },
                ],
              },
            ],
            extra: [],
          },
        ],
      },
      LUNCH: {
        cafeterias: [
          {
            id: '1e207d14-d2ea-4275-8f41-7230cf7a1aa3',
            name: '이룸라운지',
            isPinned: false,
            menus: [
              {
                corner: null,
                items: [
                  {
                    role: 'MAIN',
                    name: '소불고기양송이덮밥',
                    side: ['잡곡밥', '맑은콩나물국', '군만두*초간장', '사각어묵볶음', '부주적채겉절이'],
                    price: 7000,
                    isPopular: false,
                  },
                ],
              },
            ],
            extra: [
              '고급식A(25,000원): 철판소불고기',
              '고급식B(25,000원): 한방돼지갈비찜, - 고급식C : 30,000원 -, 소고기김치두부전골+코다리조림, - 고급식D : 30,000원 -, 채끝스테이크',
            ],
          },
          {
            id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
            name: '학생회관',
            isPinned: false,
            menus: [
              {
                corner: 'B코너',
                items: [
                  {
                    role: 'MAIN',
                    name: '아비꼬카레&새우튀김',
                    side: ['미소두부국', '감자볶음', '천사채무침', '깍두기'],
                    price: 5000,
                    isPopular: false,
                  },
                ],
              },
              {
                corner: 'C코너',
                items: [
                  {
                    role: 'MAIN',
                    name: '묵은지찌개',
                    side: ['떡산적스테이크', '부추겉절이', '깍두기'],
                    price: 3800,
                    isPopular: false,
                  },
                ],
              },
            ],
            extra: ['A코너: 라면(2,500원), 오징어해장라면(3,300원), 삶은계란(400원)'],
          },
          {
            id: 'f262ad60-0ed7-4591-b411-1a96ceefd30e',
            name: '양식당',
            isPinned: false,
            menus: [
              {
                corner: null,
                items: [
                  {
                    role: 'MAIN',
                    name: '상하이스파게티',
                    side: [],
                    price: 7000,
                    isPopular: true,
                  },
                  {
                    role: 'MAIN',
                    name: '통삼겹스테이크',
                    side: [],
                    price: 8000,
                    isPopular: false,
                  },
                  {
                    role: 'SUB',
                    name: '고구마치즈돈까스',
                    side: [],
                    price: 6000,
                    isPopular: false,
                  },
                  {
                    role: 'SUB',
                    name: '고추마요치킨',
                    side: [],
                    price: 6000,
                    isPopular: false,
                  },
                  {
                    role: 'SUB',
                    name: '쏘이까스',
                    side: [],
                    price: 5500,
                    isPopular: false,
                  },
                  {
                    role: 'SUB',
                    name: '치즈볼 (5개)',
                    side: [],
                    price: 3000,
                    isPopular: false,
                  },
                  {
                    role: 'SUB',
                    name: '치킨까스',
                    side: [],
                    price: 6000,
                    isPopular: false,
                  },
                  {
                    role: 'SUB',
                    name: '치킨텐더샐러드',
                    side: [],
                    price: 5000,
                    isPopular: false,
                  },
                  {
                    role: 'SUB',
                    name: '탄산음료',
                    side: [],
                    price: 1000,
                    isPopular: false,
                  },
                ],
              },
            ],
            extra: [],
          },
          {
            id: 'f69af299-de24-4bed-a6f0-77c5e12982cc',
            name: '자연과학관',
            isPinned: false,
            menus: [
              {
                corner: null,
                items: [
                  {
                    role: 'MAIN',
                    name: '온메밀국수',
                    side: ['돈까스', '어묵볶음', '시금치나물무침', '단무지', '김치'],
                    price: 6000,
                    isPopular: false,
                  },
                ],
              },
            ],
            extra: [],
          },
        ],
      },
      DINNER: {
        cafeterias: [
          {
            id: '1e207d14-d2ea-4275-8f41-7230cf7a1aa3',
            name: '이룸라운지',
            isPinned: false,
            menus: [
              {
                corner: null,
                items: [
                  {
                    role: 'MAIN',
                    name: '포장마차잔치국수',
                    side: ['잡곡밥', '고기산적채소볶음', '브로컬리볶음', '열무나물', '오복지무침'],
                    price: 7000,
                    isPopular: false,
                  },
                ],
              },
            ],
            extra: [
              '고급식A(25,000원): 철판소불고기',
              '고급식B(25,000원): 한방돼지갈비찜, - 고급식C : 30,000원 -, 소고기김치두부전골+코다리조림, - 고급식D : 30,000원 -, 채끝스테이크',
            ],
          },
          {
            id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
            name: '학생회관',
            isPinned: false,
            menus: [
              {
                corner: 'B코너',
                items: [
                  {
                    role: 'MAIN',
                    name: '얼큰소고기국밥',
                    side: ['미트볼브로콜리조림', '햄채소볶음', '무말랭이무침', '김치'],
                    price: 5000,
                    isPopular: false,
                  },
                ],
              },
              {
                corner: 'C코너',
                items: [
                  {
                    role: 'MAIN',
                    name: '우렁된장찌개',
                    side: ['연근조림', '콩나물무침', '김치'],
                    price: 3800,
                    isPopular: false,
                  },
                ],
              },
            ],
            extra: [],
          },
          {
            id: 'f69af299-de24-4bed-a6f0-77c5e12982cc',
            name: '자연과학관',
            isPinned: false,
            menus: [
              {
                corner: null,
                items: [
                  {
                    role: 'MAIN',
                    name: '닭볶음탕',
                    side: ['바지락수제비국', '청포묵무침', '양배추찜&쌈장', '간장궁채절임', '김치'],
                    price: 6000,
                    isPopular: false,
                  },
                ],
              },
            ],
            extra: [],
          },
        ],
      },
    },
  },
  '2026-11-10': {
    date: '2026-11-10',
    hasNextWeekData: false,
    availableTimes: ['BREAKFAST', 'LUNCH', 'DINNER'],
    menusByMealTime: {
      BREAKFAST: {
        cafeterias: [
          {
            id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
            name: '학생회관',
            isPinned: false,
            menus: [
              {
                corner: 'B코너',
                items: [
                  {
                    role: 'MAIN',
                    name: '8시~11시 식권 판매',
                    side: [
                      '10시부터 식사 제공',
                      '(*8시 식사 제공 없음)',
                      '육회비빔밥',
                      '우동국',
                      '미역줄기볶음',
                      '오그락지무침',
                      '김치',
                    ],
                    price: 1000,
                    isPopular: false,
                  },
                ],
              },
            ],
            extra: [],
          },
        ],
      },
      LUNCH: {
        cafeterias: [
          {
            id: '1e207d14-d2ea-4275-8f41-7230cf7a1aa3',
            name: '이룸라운지',
            isPinned: false,
            menus: [
              {
                corner: 'A코너',
                items: [
                  {
                    role: 'MAIN',
                    name: '꿔바로우탕수육',
                    side: ['잡곡밥', '시금치장국', '마파두부덮밥소스', '천사채마요샐러드', '짜사이볶음'],
                    price: 7000,
                    isPopular: true,
                  },
                ],
              },
              {
                corner: 'B코너',
                items: [
                  {
                    role: 'MAIN',
                    name: '눈꽃치즈제육덮밥',
                    side: ['잡곡밥', '시금치장국', '허니버터감자튀김', '천사채마요샐러드', '짜사이볶음'],
                    price: 7000,
                    isPopular: true,
                  },
                ],
              },
            ],
            extra: [
              '고급식A(25,000원): 철판소불고기',
              '고급식B(25,000원): 한방돼지갈비찜, - 고급식C : 30,000원 -, 소고기김치두부전골+코다리조림, - 고급식D : 30,000원 -, 채끝스테이크',
            ],
          },
          {
            id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
            name: '학생회관',
            isPinned: false,
            menus: [
              {
                corner: 'B코너',
                items: [
                  {
                    role: 'MAIN',
                    name: '육회비빔밥',
                    side: ['우동국', '미역줄기볶음', '오그락지무침', '김치'],
                    price: 5000,
                    isPopular: true,
                  },
                ],
              },
            ],
            extra: ['A코너: 라면(2,500원), 오징어해장라면(3,300원), 삶은계란(400원)'],
          },
          {
            id: 'f262ad60-0ed7-4591-b411-1a96ceefd30e',
            name: '양식당',
            isPinned: false,
            menus: [
              {
                corner: null,
                items: [
                  {
                    role: 'MAIN',
                    name: '가쓰오볶음우동',
                    side: [],
                    price: 7000,
                    isPopular: false,
                  },
                  {
                    role: 'MAIN',
                    name: '데리야끼핫치킨스테이크',
                    side: [],
                    price: 7000,
                    isPopular: true,
                  },
                  {
                    role: 'SUB',
                    name: '고구마치즈돈까스',
                    side: [],
                    price: 6000,
                    isPopular: false,
                  },
                  {
                    role: 'SUB',
                    name: '쏘이까스',
                    side: [],
                    price: 5500,
                    isPopular: false,
                  },
                  {
                    role: 'SUB',
                    name: '치즈볼 (5개)',
                    side: [],
                    price: 3000,
                    isPopular: false,
                  },
                  {
                    role: 'SUB',
                    name: '치킨까스',
                    side: [],
                    price: 6000,
                    isPopular: false,
                  },
                  {
                    role: 'SUB',
                    name: '탄산음료',
                    side: [],
                    price: 1000,
                    isPopular: false,
                  },
                  {
                    role: 'SUB',
                    name: '파스타샐러드',
                    side: [],
                    price: 5000,
                    isPopular: false,
                  },
                  {
                    role: 'SUB',
                    name: '페퍼로니 피자(2인)',
                    side: [],
                    price: 9900,
                    isPopular: false,
                  },
                ],
              },
            ],
            extra: [],
          },
          {
            id: 'f69af299-de24-4bed-a6f0-77c5e12982cc',
            name: '자연과학관',
            isPinned: false,
            menus: [
              {
                corner: null,
                items: [
                  {
                    role: 'MAIN',
                    name: '곤드레나물밥',
                    side: ['열무된장국', '돈육김치볶음', '감자조림', '마늘쫑무침', '깍두기'],
                    price: 6000,
                    isPopular: false,
                  },
                ],
              },
            ],
            extra: [],
          },
        ],
      },
      DINNER: {
        cafeterias: [
          {
            id: '1e207d14-d2ea-4275-8f41-7230cf7a1aa3',
            name: '이룸라운지',
            isPinned: false,
            menus: [
              {
                corner: null,
                items: [
                  {
                    role: 'MAIN',
                    name: '사골떡국',
                    side: ['잡곡밥', '야채계란찜', '한식잡채', '느타리볶음', '오징어젓무말랭이'],
                    price: 7000,
                    isPopular: false,
                  },
                ],
              },
            ],
            extra: [
              '고급식A(25,000원): 철판소불고기',
              '고급식B(25,000원): 한방돼지갈비찜, - 고급식C : 30,000원 -, 소고기김치두부전골+코다리조림, - 고급식D : 30,000원 -, 채끝스테이크',
            ],
          },
          {
            id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
            name: '학생회관',
            isPinned: false,
            menus: [
              {
                corner: 'B코너',
                items: [
                  {
                    role: 'MAIN',
                    name: '돼지순대국밥',
                    side: ['애호박양파볶음', '도라지무침', '콩조림', '김치'],
                    price: 5000,
                    isPopular: false,
                  },
                ],
              },
              {
                corner: 'C코너',
                items: [
                  {
                    role: 'MAIN',
                    name: '짬뽕해물순두부찌개',
                    side: ['생선까스&타르소스', '숙주미나리무침', '깍두기'],
                    price: 3800,
                    isPopular: false,
                  },
                ],
              },
            ],
            extra: [],
          },
          {
            id: 'f69af299-de24-4bed-a6f0-77c5e12982cc',
            name: '자연과학관',
            isPinned: false,
            menus: [
              {
                corner: null,
                items: [
                  {
                    role: 'MAIN',
                    name: '만두국',
                    side: ['불닭메알조림', '애새송이볶음', '콩나물무침', '해초샐러드', '김치'],
                    price: 6000,
                    isPopular: false,
                  },
                ],
              },
            ],
            extra: [],
          },
        ],
      },
    },
  },
  '2026-11-11': {
    date: '2026-11-11',
    hasNextWeekData: false,
    availableTimes: ['BREAKFAST', 'LUNCH', 'DINNER'],
    menusByMealTime: {
      BREAKFAST: {
        cafeterias: [
          {
            id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
            name: '학생회관',
            isPinned: false,
            menus: [
              {
                corner: 'B코너',
                items: [
                  {
                    role: 'MAIN',
                    name: '우리쌀시리얼&우유',
                    side: ['허니브레드&휘핑크림', '양배추샐러드', '빼뺴로(300명 한정)', '모듬야채지'],
                    price: 1000,
                    isPopular: false,
                  },
                ],
              },
            ],
            extra: [],
          },
        ],
      },
      LUNCH: {
        cafeterias: [
          {
            id: '1e207d14-d2ea-4275-8f41-7230cf7a1aa3',
            name: '이룸라운지',
            isPinned: false,
            menus: [
              {
                corner: null,
                items: [
                  {
                    role: 'MAIN',
                    name: '부대찌개',
                    side: ['잡곡밥', '함박찹스테이크', '국물떡볶이', '명엽채볶음', '오이지'],
                    price: 7000,
                    isPopular: false,
                  },
                ],
              },
            ],
            extra: [
              '고급식A(25,000원): 철판소불고기',
              '고급식B(25,000원): 한방돼지갈비찜, - 고급식C : 30,000원 -, 소고기김치두부전골+코다리조림, - 고급식D : 30,000원 -, 채끝스테이크',
            ],
          },
          {
            id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
            name: '학생회관',
            isPinned: false,
            menus: [
              {
                corner: 'B코너',
                items: [
                  {
                    role: 'MAIN',
                    name: '순살감자탕',
                    side: ['도토리묵&간장', '우엉조림', '콩나물무침', '깍두기'],
                    price: 5000,
                    isPopular: false,
                  },
                ],
              },
              {
                corner: 'C코너',
                items: [
                  {
                    role: 'MAIN',
                    name: '언양식불고기&불갈비',
                    side: ['두부된장국', '햄채소볶음', '김치'],
                    price: 3800,
                    isPopular: false,
                  },
                ],
              },
            ],
            extra: ['A코너: 라면(2,500원), 오징어해장라면(3,300원), 삶은계란(400원)'],
          },
          {
            id: 'f262ad60-0ed7-4591-b411-1a96ceefd30e',
            name: '양식당',
            isPinned: false,
            menus: [
              {
                corner: null,
                items: [
                  {
                    role: 'MAIN',
                    name: '목살 스테이크&라이스',
                    side: [],
                    price: 8000,
                    isPopular: false,
                  },
                  {
                    role: 'MAIN',
                    name: '투움바파스타(베이컨)',
                    side: [],
                    price: 7500,
                    isPopular: true,
                  },
                  {
                    role: 'SUB',
                    name: '고구마치즈돈까스',
                    side: [],
                    price: 6000,
                    isPopular: false,
                  },
                  {
                    role: 'SUB',
                    name: '고추마요치킨',
                    side: [],
                    price: 6000,
                    isPopular: false,
                  },
                  {
                    role: 'SUB',
                    name: '소시지&함박스테이크',
                    side: [],
                    price: 8000,
                    isPopular: false,
                  },
                  {
                    role: 'SUB',
                    name: '쏘이까스',
                    side: [],
                    price: 5500,
                    isPopular: false,
                  },
                  {
                    role: 'SUB',
                    name: '치즈볼 (5개)',
                    side: [],
                    price: 3000,
                    isPopular: false,
                  },
                  {
                    role: 'SUB',
                    name: '치킨텐더샐러드',
                    side: [],
                    price: 5000,
                    isPopular: false,
                  },
                  {
                    role: 'SUB',
                    name: '탄산음료',
                    side: [],
                    price: 1000,
                    isPopular: false,
                  },
                ],
              },
            ],
            extra: [],
          },
          {
            id: 'f69af299-de24-4bed-a6f0-77c5e12982cc',
            name: '자연과학관',
            isPinned: false,
            menus: [
              {
                corner: null,
                items: [
                  {
                    role: 'MAIN',
                    name: '훈제오리볶음',
                    side: ['황태채무국', '비엔나볶음', '가지나물', '부추겉절이', '김치'],
                    price: 6000,
                    isPopular: false,
                  },
                ],
              },
            ],
            extra: [],
          },
        ],
      },
      DINNER: {
        cafeterias: [
          {
            id: '1e207d14-d2ea-4275-8f41-7230cf7a1aa3',
            name: '이룸라운지',
            isPinned: false,
            menus: [
              {
                corner: null,
                items: [
                  {
                    role: 'MAIN',
                    name: '지코바닭볶음(뼈)',
                    side: ['잡곡밥', '미역국', '찹쌀꽈배기', '숙주겨자나물', '요구르트'],
                    price: 7000,
                    isPopular: false,
                  },
                ],
              },
            ],
            extra: [
              '고급식A(25,000원): 철판소불고기',
              '고급식B(25,000원): 한방돼지갈비찜, - 고급식C : 30,000원 -, 소고기김치두부전골+코다리조림, - 고급식D : 30,000원 -, 채끝스테이크',
            ],
          },
          {
            id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
            name: '학생회관',
            isPinned: false,
            menus: [
              {
                corner: 'B코너',
                items: [
                  {
                    role: 'MAIN',
                    name: '고추장제육볶음',
                    side: ['유부우동국', '미역줄기볶음', '무생채무침', '김치'],
                    price: 5000,
                    isPopular: false,
                  },
                ],
              },
              {
                corner: 'C코너',
                items: [
                  {
                    role: 'MAIN',
                    name: '소고기미역국',
                    side: ['어묵볶음', '오이무침', '깍두기'],
                    price: 3800,
                    isPopular: false,
                  },
                ],
              },
            ],
            extra: [],
          },
          {
            id: 'f69af299-de24-4bed-a6f0-77c5e12982cc',
            name: '자연과학관',
            isPinned: false,
            menus: [
              {
                corner: null,
                items: [
                  {
                    role: 'MAIN',
                    name: '청양풍돈불고기',
                    side: ['팽이두부국', '김치전', '치커리사과무침', '우엉조림', '깍두기'],
                    price: 6000,
                    isPopular: false,
                  },
                ],
              },
            ],
            extra: [],
          },
        ],
      },
    },
  },
  '2026-11-12': {
    date: '2026-11-12',
    hasNextWeekData: false,
    availableTimes: ['BREAKFAST', 'LUNCH', 'DINNER'],
    menusByMealTime: {
      BREAKFAST: {
        cafeterias: [
          {
            id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
            name: '학생회관',
            isPinned: false,
            menus: [
              {
                corner: 'B코너',
                items: [
                  {
                    role: 'MAIN',
                    name: '두부된장찌개',
                    side: ['소시지전', '어묵양파볶음', '무짠지채', '김치'],
                    price: 1000,
                    isPopular: false,
                  },
                ],
              },
            ],
            extra: [],
          },
        ],
      },
      LUNCH: {
        cafeterias: [
          {
            id: '1e207d14-d2ea-4275-8f41-7230cf7a1aa3',
            name: '이룸라운지',
            isPinned: false,
            menus: [
              {
                corner: 'A코너',
                items: [
                  {
                    role: 'MAIN',
                    name: '야끼파스타',
                    side: ['잡곡밥', '대파계란국', '생선까스*콘소스s', '마카로니콘샐러드', '할라피뇨피클'],
                    price: 7000,
                    isPopular: true,
                  },
                ],
              },
              {
                corner: 'B코너',
                items: [
                  {
                    role: 'MAIN',
                    name: '김치카츠나베',
                    side: ['잡곡밥', '대파계란국', '타코야끼*데리s', '마카로니콘샐러드', '할라피뇨피클'],
                    price: 7000,
                    isPopular: false,
                  },
                ],
              },
            ],
            extra: [
              '고급식A(25,000원): 철판소불고기',
              '고급식B(25,000원): 한방돼지갈비찜, - 고급식C : 30,000원 -, 소고기김치두부전골+코다리조림, - 고급식D : 30,000원 -, 채끝스테이크',
            ],
          },
          {
            id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
            name: '학생회관',
            isPinned: false,
            menus: [
              {
                corner: 'B코너',
                items: [
                  {
                    role: 'MAIN',
                    name: '만두버섯전골',
                    side: ['해물완자전', '고사리들깨볶음', '도라지무침', '김치'],
                    price: 5000,
                    isPopular: false,
                  },
                ],
              },
              {
                corner: 'C코너',
                items: [
                  {
                    role: 'MAIN',
                    name: '마제덮밥',
                    side: ['배추우거지국', '숙주나물무침', '깍두기'],
                    price: 3800,
                    isPopular: false,
                  },
                ],
              },
            ],
            extra: ['A코너: 라면(2,500원), 오징어해장라면(3,300원), 삶은계란(400원)'],
          },
          {
            id: 'f262ad60-0ed7-4591-b411-1a96ceefd30e',
            name: '양식당',
            isPinned: false,
            menus: [
              {
                corner: null,
                items: [
                  {
                    role: 'MAIN',
                    name: '데리야끼핫치킨스테이크',
                    side: [],
                    price: 7000,
                    isPopular: true,
                  },
                  {
                    role: 'MAIN',
                    name: '상하이스파게티',
                    side: [],
                    price: 7000,
                    isPopular: true,
                  },
                  {
                    role: 'SUB',
                    name: '고구마치즈돈까스',
                    side: [],
                    price: 6000,
                    isPopular: false,
                  },
                  {
                    role: 'SUB',
                    name: '고추마요치킨',
                    side: [],
                    price: 6000,
                    isPopular: false,
                  },
                  {
                    role: 'SUB',
                    name: '쏘이까스',
                    side: [],
                    price: 5500,
                    isPopular: false,
                  },
                  {
                    role: 'SUB',
                    name: '요거트아이스샐러드',
                    side: [],
                    price: 6000,
                    isPopular: false,
                  },
                  {
                    role: 'SUB',
                    name: '치즈볼 (5개)',
                    side: [],
                    price: 3000,
                    isPopular: false,
                  },
                  {
                    role: 'SUB',
                    name: '치킨까스',
                    side: [],
                    price: 6000,
                    isPopular: false,
                  },
                  {
                    role: 'SUB',
                    name: '탄산음료',
                    side: [],
                    price: 1000,
                    isPopular: false,
                  },
                ],
              },
            ],
            extra: [],
          },
          {
            id: 'f69af299-de24-4bed-a6f0-77c5e12982cc',
            name: '자연과학관',
            isPinned: false,
            menus: [
              {
                corner: null,
                items: [
                  {
                    role: 'MAIN',
                    name: '춘천식닭갈비',
                    side: ['냉이된장국', '메밀전병', '주키니호박볶음', '양배추장아찌', '깍두기'],
                    price: 6000,
                    isPopular: true,
                  },
                ],
              },
            ],
            extra: [],
          },
        ],
      },
      DINNER: {
        cafeterias: [
          {
            id: '1e207d14-d2ea-4275-8f41-7230cf7a1aa3',
            name: '이룸라운지',
            isPinned: false,
            menus: [
              {
                corner: null,
                items: [
                  {
                    role: 'MAIN',
                    name: '소고기콩나물밥*양념장',
                    side: ['호박새우젓국', '맛쵸킹강정', '감자채볶음', '배추된장나물', '파래김*양념장'],
                    price: 7000,
                    isPopular: false,
                  },
                ],
              },
            ],
            extra: [
              '고급식A(25,000원): 철판소불고기',
              '고급식B(25,000원): 한방돼지갈비찜, - 고급식C : 30,000원 -, 소고기김치두부전골+코다리조림, - 고급식D : 30,000원 -, 채끝스테이크',
            ],
          },
          {
            id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
            name: '학생회관',
            isPinned: false,
            menus: [
              {
                corner: 'B코너',
                items: [
                  {
                    role: 'MAIN',
                    name: '돈육새송이볶음',
                    side: ['콩나물국', '주키니건새우볶음', '깻잎양념지', '김치'],
                    price: 5000,
                    isPopular: false,
                  },
                ],
              },
              {
                corner: 'C코너',
                items: [
                  {
                    role: 'MAIN',
                    name: '오모리김치찌개',
                    side: ['느타리버섯볶음', '고들빼기무침', '깍두기'],
                    price: 3800,
                    isPopular: false,
                  },
                ],
              },
            ],
            extra: [],
          },
          {
            id: 'f69af299-de24-4bed-a6f0-77c5e12982cc',
            name: '자연과학관',
            isPinned: false,
            menus: [
              {
                corner: null,
                items: [
                  {
                    role: 'MAIN',
                    name: '고등어구이',
                    side: ['순두부찌개', '고로케', '그린샐러드', '찢은건파래볶음', '김치'],
                    price: 6000,
                    isPopular: false,
                  },
                ],
              },
            ],
            extra: [],
          },
        ],
      },
    },
  },
  '2026-11-13': {
    date: '2026-11-13',
    hasNextWeekData: false,
    availableTimes: ['BREAKFAST', 'LUNCH', 'DINNER'],
    menusByMealTime: {
      BREAKFAST: {
        cafeterias: [
          {
            id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
            name: '학생회관',
            isPinned: false,
            menus: [
              {
                corner: 'B코너',
                items: [
                  {
                    role: 'MAIN',
                    name: '돼지고기고추장찌개',
                    side: ['갈비만두', '느타리양파볶음', '우엉채조림', '깍두기'],
                    price: 1000,
                    isPopular: false,
                  },
                ],
              },
            ],
            extra: [],
          },
        ],
      },
      LUNCH: {
        cafeterias: [
          {
            id: '1e207d14-d2ea-4275-8f41-7230cf7a1aa3',
            name: '이룸라운지',
            isPinned: false,
            menus: [
              {
                corner: null,
                items: [
                  {
                    role: 'MAIN',
                    name: '불맛고추장불고기',
                    side: ['잡곡밥', '순두부국', '들기름막국수', '도토리묵야채무침', '이색쌈무'],
                    price: 7000,
                    isPopular: false,
                  },
                ],
              },
            ],
            extra: [
              '고급식A(25,000원): 철판소불고기',
              '고급식B(25,000원): 한방돼지갈비찜, - 고급식C : 30,000원 -, 소고기김치두부전골+코다리조림, - 고급식D : 30,000원 -, 채끝스테이크',
            ],
          },
          {
            id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
            name: '학생회관',
            isPinned: false,
            menus: [
              {
                corner: 'B코너',
                items: [
                  {
                    role: 'MAIN',
                    name: '돼지고기뚝불고기',
                    side: ['메밀전병튀김', '죽순채들깨볶음', '콩조림', '깍두기'],
                    price: 5000,
                    isPopular: false,
                  },
                ],
              },
              {
                corner: 'C코너',
                items: [
                  {
                    role: 'MAIN',
                    name: '계란새우볶음밥',
                    side: ['김치국', '물만두강정', '깍두기'],
                    price: 3800,
                    isPopular: false,
                  },
                ],
              },
            ],
            extra: ['A코너: 라면(2,500원), 오징어해장라면(3,300원), 삶은계란(400원)'],
          },
          {
            id: 'f262ad60-0ed7-4591-b411-1a96ceefd30e',
            name: '양식당',
            isPinned: false,
            menus: [
              {
                corner: null,
                items: [
                  {
                    role: 'MAIN',
                    name: '마제파스타',
                    side: [],
                    price: 7000,
                    isPopular: true,
                  },
                  {
                    role: 'MAIN',
                    name: '팟타이(땅콩함유)',
                    side: [],
                    price: 6500,
                    isPopular: false,
                  },
                  {
                    role: 'SUB',
                    name: '고구마치즈돈까스',
                    side: [],
                    price: 6000,
                    isPopular: false,
                  },
                  {
                    role: 'SUB',
                    name: '소시지&함박스테이크',
                    side: [],
                    price: 8000,
                    isPopular: false,
                  },
                  {
                    role: 'SUB',
                    name: '쏘이까스',
                    side: [],
                    price: 5500,
                    isPopular: false,
                  },
                  {
                    role: 'SUB',
                    name: '치즈볼 (5개)',
                    side: [],
                    price: 3000,
                    isPopular: false,
                  },
                  {
                    role: 'SUB',
                    name: '치킨텐더샐러드',
                    side: [],
                    price: 5000,
                    isPopular: false,
                  },
                  {
                    role: 'SUB',
                    name: '탄산음료',
                    side: [],
                    price: 1000,
                    isPopular: false,
                  },
                  {
                    role: 'SUB',
                    name: '페퍼로니 피자(2인)',
                    side: [],
                    price: 9900,
                    isPopular: false,
                  },
                ],
              },
            ],
            extra: [],
          },
          {
            id: 'f69af299-de24-4bed-a6f0-77c5e12982cc',
            name: '자연과학관',
            isPinned: false,
            menus: [
              {
                corner: null,
                items: [
                  {
                    role: 'MAIN',
                    name: '목살두루치기',
                    side: ['콩나물국', '단호박찜', '오이도라지무침', '양념깻잎지', '김치'],
                    price: 6000,
                    isPopular: true,
                  },
                ],
              },
            ],
            extra: [],
          },
        ],
      },
      DINNER: {
        cafeterias: [
          {
            id: '1e207d14-d2ea-4275-8f41-7230cf7a1aa3',
            name: '이룸라운지',
            isPinned: false,
            menus: [
              {
                corner: null,
                items: [
                  {
                    role: 'MAIN',
                    name: '닭곰탕&소면사리',
                    side: ['잡곡밥', '새우까스*타르타르s', '그린빈스맛살볶음', '간장무조림', '사과주스'],
                    price: 7000,
                    isPopular: false,
                  },
                ],
              },
            ],
            extra: [
              '고급식A(25,000원): 철판소불고기',
              '고급식B(25,000원): 한방돼지갈비찜, - 고급식C : 30,000원 -, 소고기김치두부전골+코다리조림, - 고급식D : 30,000원 -, 채끝스테이크',
            ],
          },
          {
            id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
            name: '학생회관',
            isPinned: false,
            menus: [
              {
                corner: 'B코너',
                items: [
                  {
                    role: 'MAIN',
                    name: '가츠동',
                    side: ['팽이된장국', '맛살채소볶음', '사과치커리유자무침', '김치'],
                    price: 5000,
                    isPopular: false,
                  },
                ],
              },
              {
                corner: 'C코너',
                items: [
                  {
                    role: 'MAIN',
                    name: '동태매운탕',
                    side: ['감자채볶음', '표고양파볶음', '깍두기'],
                    price: 3800,
                    isPopular: false,
                  },
                ],
              },
            ],
            extra: [],
          },
          {
            id: 'f69af299-de24-4bed-a6f0-77c5e12982cc',
            name: '자연과학관',
            isPinned: false,
            menus: [
              {
                corner: null,
                items: [
                  {
                    role: 'MAIN',
                    name: '게살볶음밥&자장소스',
                    side: ['유부우동국', '군만두', '짜사이볶음', '요구르트', '김치'],
                    price: 6000,
                    isPopular: false,
                  },
                ],
              },
            ],
            extra: [],
          },
        ],
      },
    },
  },
  '2026-11-14': {
    date: '2026-11-14',
    hasNextWeekData: false,
    availableTimes: ['BREAKFAST', 'LUNCH', 'DINNER'],
    menusByMealTime: {
      BREAKFAST: {
        cafeterias: [
          {
            id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
            name: '학생회관',
            isPinned: false,
            menus: [],
            extra: [],
          },
        ],
      },
      LUNCH: {
        cafeterias: [
          {
            id: '1e207d14-d2ea-4275-8f41-7230cf7a1aa3',
            name: '이룸라운지',
            isPinned: false,
            menus: [],
            extra: [],
          },
          {
            id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
            name: '학생회관',
            isPinned: false,
            menus: [],
            extra: [],
          },
          {
            id: 'f262ad60-0ed7-4591-b411-1a96ceefd30e',
            name: '양식당',
            isPinned: false,
            menus: [],
            extra: [],
          },
          {
            id: 'f69af299-de24-4bed-a6f0-77c5e12982cc',
            name: '자연과학관',
            isPinned: false,
            menus: [],
            extra: [],
          },
        ],
      },
      DINNER: {
        cafeterias: [
          {
            id: '1e207d14-d2ea-4275-8f41-7230cf7a1aa3',
            name: '이룸라운지',
            isPinned: false,
            menus: [],
            extra: [],
          },
          {
            id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
            name: '학생회관',
            isPinned: false,
            menus: [],
            extra: [],
          },
          {
            id: 'f69af299-de24-4bed-a6f0-77c5e12982cc',
            name: '자연과학관',
            isPinned: false,
            menus: [],
            extra: [],
          },
        ],
      },
    },
  },
  '2026-11-15': {
    date: '2026-11-15',
    hasNextWeekData: false,
    availableTimes: ['BREAKFAST', 'LUNCH', 'DINNER'],
    menusByMealTime: {
      BREAKFAST: {
        cafeterias: [
          {
            id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
            name: '학생회관',
            isPinned: false,
            menus: [],
            extra: [],
          },
        ],
      },
      LUNCH: {
        cafeterias: [
          {
            id: '1e207d14-d2ea-4275-8f41-7230cf7a1aa3',
            name: '이룸라운지',
            isPinned: false,
            menus: [],
            extra: [],
          },
          {
            id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
            name: '학생회관',
            isPinned: false,
            menus: [],
            extra: [],
          },
          {
            id: 'f262ad60-0ed7-4591-b411-1a96ceefd30e',
            name: '양식당',
            isPinned: false,
            menus: [],
            extra: [],
          },
          {
            id: 'f69af299-de24-4bed-a6f0-77c5e12982cc',
            name: '자연과학관',
            isPinned: false,
            menus: [],
            extra: [],
          },
        ],
      },
      DINNER: {
        cafeterias: [
          {
            id: '1e207d14-d2ea-4275-8f41-7230cf7a1aa3',
            name: '이룸라운지',
            isPinned: false,
            menus: [],
            extra: [],
          },
          {
            id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
            name: '학생회관',
            isPinned: false,
            menus: [],
            extra: [],
          },
          {
            id: 'f69af299-de24-4bed-a6f0-77c5e12982cc',
            name: '자연과학관',
            isPinned: false,
            menus: [],
            extra: [],
          },
        ],
      },
    },
  },
};
