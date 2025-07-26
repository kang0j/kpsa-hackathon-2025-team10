import { PrismaClient } from '@prisma/client';

// prisma client 인스턴스 생성
const prisma = new PrismaClient();

// 실행할 메인 함수
async function main() {
  console.log('Seeding MyData transactions...');

  // 더미 데이터 정의
  const dummyData = [
    {
      userIdentifier: 'user_12345', // 실제로는 암호화된 사용자 식별자
      cardCompany: '신한카드',
      cardNumberLastFour: '1234',
      merchantName: '올리브영 강남점',
      amount: 25000,
      transactionTimestamp: new Date('2025-07-25T10:30:00Z'),
    },
    {
      userIdentifier: 'user_12345',
      cardCompany: 'KB국민카드',
      cardNumberLastFour: '5678',
      merchantName: '(주)이마트',
      amount: 87000,
      transactionTimestamp: new Date('2025-07-24T18:45:10Z'),
    },
    {
      userIdentifier: 'user_67890',
      cardCompany: '현대카드',
      cardNumberLastFour: '9988',
      merchantName: '스타벅스코리아',
      amount: 6500,
      transactionTimestamp: new Date('2025-07-23T08:15:30Z'),
    },
     {
      userIdentifier: 'user_12345',
      cardCompany: '신한카드',
      cardNumberLastFour: '1234',
      merchantName: '서울정형외과의원',
      amount: 15000,
      transactionTimestamp: new Date('2025-07-22T14:00:00Z'),
    },
  ];

  // createMany를 사용하여 한번에 모든 데이터 삽입
  const result = await prisma.myDataTransaction.createMany({
    data: dummyData,
    skipDuplicates: true, // 혹시 모를 중복 실행 시 에러 방지
  });

  console.log(`Successfully seeded ${result.count} MyData transactions.`);
}

// 메인 함수 실행 및 종료 처리
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // 데이터베이스 연결 종료
    await prisma.$disconnect();
  });