import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Clear existing
  await prisma.payment.deleteMany();
  await prisma.session.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.package.deleteMany();
  await prisma.patient.deleteMany();
  await prisma.user.deleteMany();

  // Create Admin
  const hashedPassword = await bcrypt.hash('password123', 10);
  await prisma.user.create({
    data: {
      name: 'Dr. Admin',
      email: 'admin@clinic.com',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  // Create Patient
  const patient1 = await prisma.patient.create({
    data: {
      fullName: 'Rahul Sharma',
      phone: '+91 9876543210',
      status: 'ACTIVE',
      diagnosis: 'Knee Post-op Rehab',
    }
  });

  // Create Appointment
  const apt = await prisma.appointment.create({
    data: {
      patientId: patient1.id,
      date: new Date(),
      startTime: '10:30',
      endTime: '11:30',
      type: 'CLINIC',
      status: 'SCHEDULED'
    }
  });

  // Create Exercises
  await prisma.exercise.createMany({
    data: [
      { name: 'Heel Slides', targetBodyPart: 'Knee', description: 'Slide heel towards glutes keeping foot on ground.', defaultSets: 3, defaultReps: 15 },
      { name: 'Straight Leg Raise', targetBodyPart: 'Knee', description: 'Lift straight leg up while lying on back.', defaultSets: 3, defaultReps: 10 },
      { name: 'Wall Angels', targetBodyPart: 'Shoulder', description: 'Slide arms up and down wall while maintaining contact.', defaultSets: 3, defaultReps: 12 },
    ]
  });

  console.log('Database seeded!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
