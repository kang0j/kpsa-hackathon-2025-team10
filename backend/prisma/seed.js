const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding started...');

  // 1. 데이터 클린업 (외래 키 제약 조건을 고려하여 순서대로 삭제)
  // ----------------------------------------------------------------
  console.log('Cleaning up existing data...');
  await prisma.consultationMessage.deleteMany({});
  await prisma.friendship.deleteMany({});
  await prisma.goal.deleteMany({});
  await prisma.rewardPointHistory.deleteMany({});
  await prisma.userGood.deleteMany({});
  await prisma.transactionItem.deleteMany({});
  await prisma.consultation.deleteMany({});
  await prisma.transaction.deleteMany({});
  await prisma.myDataTransaction.deleteMany({});
  await prisma.goods.deleteMany({});
  await prisma.partner.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.pharmacist.deleteMany({});
  await prisma.user.deleteMany({});
  console.log('Cleanup complete.');

  // 2. 기본 데이터 생성 (관계가 없는 모델부터)
  // ----------------------------------------------------------------
  console.log('Creating base data...');

  // 비밀번호 해싱
  const hashedPassword = await bcrypt.hash('password123', 10);

  // 사용자 생성
  const user1 = await prisma.user.create({
    data: {
      email: 'user1@example.com',
      password: hashedPassword,
      name: '김건강',
      birthdate: new Date('1990-05-15'),
      gender: 'MALE',
      rewardPoints: 1000,
      level: 5,
      exp: 450,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'user2@example.com',
      password: hashedPassword,
      name: '이튼튼',
      birthdate: new Date('1995-11-20'),
      gender: 'FEMALE',
      rewardPoints: 500,
    },
  });

  // 약사 생성
  const pharmacist1 = await prisma.pharmacist.create({
    data: {
      email: 'pharmacist@example.com',
      password: hashedPassword,
      name: '박상담',
      licenseNumber: 'PHARM-12345',
      profile: '20년 경력의 전문 약사입니다.',
    },
  });

  // 카테고리 생성
  const categoryFruit = await prisma.category.create({ data: { name: '과일' } });
  const categoryVegetable = await prisma.category.create({ data: { name: '채소' } });
  const categorySnack = await prisma.category.create({ data: { name: '과자' } });
  const categoryDrink = await prisma.category.create({ data: { name: '음료' } });

  // 파트너사 생성
  const partnerCompany = await prisma.partner.create({
    data: {
      name: '헬시푸드',
      type: 'COMPANY',
    },
  });

  console.log('Base data created.');

  // 3. 관계가 있는 데이터 생성
  // ----------------------------------------------------------------
  console.log('Creating relational data...');

  // 상품(Goods) 생성
  const good1 = await prisma.goods.create({
    data: {
      title: '유기농 샐러드 교환권',
      description: '헬시푸드 매장에서 사용할 수 있는 샐러드 교환권입니다.',
      pointsRequired: 500,
      type: 'COUPON',
      partnerId: partnerCompany.id,
    },
  });

  const good2 = await prisma.goods.create({
    data: {
      title: '프로틴바 1개',
      description: '운동 전후에 좋은 프로틴바입니다.',
      pointsRequired: 200,
      type: 'PRODUCT',
      partnerId: partnerCompany.id,
    },
  });

  // 거래(Transaction) 및 거래 항목(TransactionItem) 생성
  const transaction1 = await prisma.transaction.create({
    data: {
      userId: user1.id,
      storeName: '행복마트',
      totalAmount: 15000,
      transactionDate: new Date(),
      status: 'PENDING',
      items: {
        create: [
          {
            itemName: '유기농 바나나',
            price: 3000,
            quantity: 1,
            categoryId: categoryFruit.id,
            isHealthy: true,
          },
          {
            itemName: '신선한 토마토',
            price: 5000,
            quantity: 1,
            categoryId: categoryVegetable.id,
            isHealthy: true,
          },
          {
            itemName: '감자칩',
            price: 2000,
            quantity: 1,
            categoryId: categorySnack.id,
            isHealthy: false,
          },
          {
            itemName: '콜라',
            price: 1500,
            quantity: 2,
            categoryId: categoryDrink.id,
            isHealthy: false,
          },
        ],
      },
    },
  });
  
  // MyData 거래 생성 (위 거래와 매칭될 데이터)
  await prisma.myDataTransaction.create({
    data: {
        userIdentifier: user1.id, // 실제로는 사용자를 식별할 수 있는 다른 값이 될 수 있습니다.
        cardCompany: "행복카드",
        cardNumberLastFour: "1234",
        merchantName: "행복마트",
        amount: 15000,
        transactionTimestamp: transaction1.transactionDate,
    }
  });


  // 리워드 포인트 적립 내역 생성
  await prisma.rewardPointHistory.create({
    data: {
      userId: user1.id,
      points: 50, // 건강한 상품 구매로 50포인트 적립
      reason: '건강한 상품 구매',
      transactionId: transaction1.id,
    },
  });
  // 사용자의 총 포인트 업데이트
  await prisma.user.update({
    where: { id: user1.id },
    data: { rewardPoints: { increment: 50 } },
  });


  // 사용자가 획득한 혜택 생성
  await prisma.userGood.create({
    data: {
      userId: user1.id,
      goodId: good2.id,
      couponCode: `COUPON-${Date.now()}`,
    },
  });
  // 사용자의 포인트 차감
  await prisma.user.update({
    where: { id: user1.id },
    data: { rewardPoints: { decrement: good2.pointsRequired } },
  });


  // 상담(Consultation) 및 메시지 생성
  const consultation1 = await prisma.consultation.create({
    data: {
      userId: user2.id,
      pharmacistId: pharmacist1.id,
      topic: '영양제 복용 관련 문의',
      status: 'REQUESTED',
      messages: {
        create: {
          content: '안녕하세요, 비타민D 영양제 추천 부탁드립니다.',
          senderType: 'USER',
        },
      },
    },
  });

  // 친구 관계 생성
  await prisma.friendship.create({
    data: {
      userId: user1.id,
      friendId: user2.id,
      status: 'ACCEPTED',
    },
  });
  
  // 목표 생성
  await prisma.goal.create({
    data: {
        userId: user1.id,
        title: "주 3회 샐러드 먹기",
        description: "점심은 가급적 샐러드로 먹어서 건강을 챙기자.",
        startDate: new Date(),
        endDate: new Date(new Date().setDate(new Date().getDate() + 30)), // 30일 목표
    }
  })


  console.log('Relational data created.');
  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
