require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Competition = require('../models/Competition');
const User = require('../models/User');
const Registration = require('../models/Registration');

async function seed() {
  await connectDB();

  await Promise.all([Competition.deleteMany({}), User.deleteMany({}), Registration.deleteMany({})]);

  const passwordHash = await User.hashPassword('password123');
  const demoUser = await User.create({
    name: 'Aaru',
    email: 'demo@feedants.test',
    passwordHash,
    referralCode: 'demo1234',
  });

  const now = Date.now();
  const days = (n) => new Date(now + n * 24 * 60 * 60 * 1000);

  const competition = await Competition.create({
    title: 'Feedants Classical Dance',
    tags: ['Dance', 'Multi-Win'],
    highlightNote: 'Winners get certificate',
    prizePoolTotal: 1500,
    entryFee: 99,
    maxSpots: 20,
    spotsBooked: 1,
    judge: {
      name: 'Manju Dubey',
      title: 'Judge',
      subtitle: 'Professional Kathak Dancer',
      experienceLabel: '12+ Years of Experience',
      photoUrl: 'https://example.com/judges/manju-dubey.jpg',
      introVideoUrl: 'https://example.com/videos/manju-dubey-intro.mp4',
    },
    dates: {
      registrationOpensAt: days(-5),
      registrationClosesAt: days(1.27), // ~ "01d:06h:28m" left, like the design
      submissionStartsAt: days(-1),
      submissionEndsAt: days(20),
      resultDate: days(22),
    },
    about:
      'This is an online classical dance competition open for all age groups. Participate from anywhere and showcase your talent. Express your passion through traditional dance.',
    judgingParameters: 'Technique, expression, originality and adherence to classical form are each weighted equally.',
    rulesAndEligibility:
      'Open to all age groups. One submission per participant. Entry fee is non-refundable once the submission window opens.',
    rewards: [
      { position: 1, label: '1st Winner', amount: 550 },
      { position: 2, label: '2nd Winner', amount: 300 },
      { position: 3, label: '3rd Winner', amount: 240 },
      { position: 4, label: '4th Winner', amount: 200 },
      { position: 5, label: '5th Winner', amount: 130 },
      { position: 6, label: '6th Winner', amount: 80 },
    ],
    previousWinners: [
      { name: 'Riya Shah', position: 1, label: '1st Winner', thumbnailUrl: '', videoUrl: '' },
      { name: 'Aarav Mehta', position: 1, label: '1st Winner', thumbnailUrl: '', videoUrl: '' },
      { name: 'Neha Verma', position: 2, label: '2nd Winner', thumbnailUrl: '', videoUrl: '' },
      { name: 'Ishita Chopra', position: 3, label: '3rd Winner', thumbnailUrl: '', videoUrl: '' },
    ],
    disclaimer: 'Only contributions from paid participants will be considered for judging.',
    refundPolicyUrl: 'https://feedants.com/refund-policy',
    paymentProvider: 'razorpay',
    referral: { enabled: true, earnAmountPerSignup: 10 },
  });

  await Registration.create({
    competition: competition._id,
    user: demoUser._id,
    status: 'confirmed',
    entryFeePaid: 99,
    payment: { provider: 'razorpay', paymentId: 'seed_payment_1', status: 'paid' },
  });

  console.log('Seeded competition id:', competition._id.toString());
  console.log('Demo user: demo@feedants.test / password123');

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
