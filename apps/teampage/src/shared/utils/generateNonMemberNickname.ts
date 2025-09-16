export const generateNonMemberNickName = () => {
  const randomAdjective =
    adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomAnimal = animals[Math.floor(Math.random() * animals.length)];

  return `${randomAdjective} ${randomAnimal}`;
};

const adjectives = [
  '멋있는',
  '귀여운',
  '용감한',
  '똑똑한',
  '친근한',
  '활발한',
  '조용한',
  '밝은',
  '상냥한',
  '신비로운',
  '강인한',
  '부드러운',
  '빠른',
  '느긋한',
  '장난스러운',
  '진지한',
  '유쾌한',
  '차분한',
  '열정적인',
  '온화한',
  '대담한',
  '섬세한',
  '자유로운',
] as const;

const animals = [
  '사자',
  '수달',
  '토끼',
  '고양이',
  '강아지',
  '펭귄',
  '다람쥐',
  '여우',
  '늑대',
  '곰',
  '호랑이',
  '코끼리',
  '기린',
  '펜더',
  '오리',
  '닭',
  '돼지',
  '소',
  '말',
  '양',
  '염소',
  '원숭이',
  '코알라',
  '캥거루',
] as const;
