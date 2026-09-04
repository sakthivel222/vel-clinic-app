import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://vel-clinic-app.vercel.app',
    process.env.FRONTEND_URL || ''
  ].filter(Boolean),
  credentials: true
}));
app.use(express.json());

// Auth Middleware
const authenticate = (req: any, res: any, next: any) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Access denied' });
  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ error: 'Invalid token' });
  }
};

// Login Route
app.post('/api/auth/login', async (req: any, res: any) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(400).json({ error: 'Invalid credentials' });
  
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) return res.status(400).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
  res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
});

// Protect all routes below
app.use('/api', authenticate);

// Dashboard stats
app.get('/api/dashboard', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const appointmentsToday = await prisma.appointment.count({
      where: { date: { gte: today } }
    });

    const activePatients = await prisma.patient.count({
      where: { status: 'ACTIVE' }
    });

    res.json({
      appointmentsToday,
      activePatients,
      pendingRevenue: 0,
      completedToday: 0
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
});

// Patients endpoints
app.get('/api/patients', async (req, res) => {
  try {
    const patients = await prisma.patient.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(patients);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch patients' });
  }
});

app.post('/api/patients', async (req, res) => {
  try {
    const patient = await prisma.patient.create({
      data: req.body
    });
    res.status(201).json(patient);
  } catch (error) {
    console.error('PATIENT POST ERROR:', error);
    res.status(500).json({ error: 'Failed to create patient' });
  }
});

app.get('/api/patients/:id', async (req, res) => {
  try {
    const patient = await prisma.patient.findUnique({
      where: { id: req.params.id },
      include: {
        appointments: { orderBy: { date: 'desc' } },
        sessions: { orderBy: { date: 'desc' } },
        payments: { orderBy: { date: 'desc' } }
      }
    });
    if (!patient) return res.status(404).json({ error: 'Patient not found' });
    res.json(patient);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch patient' });
  }
});

// Appointments endpoints
app.get('/api/appointments', async (req, res) => {
  try {
    const appointments = await prisma.appointment.findMany({
      include: { patient: true },
      orderBy: { date: 'asc' }
    });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
});

import { sendWhatsAppReminder } from './whatsapp';

app.post('/api/appointments', async (req, res) => {
  try {
    const appointment = await prisma.appointment.create({
      data: req.body,
      include: { patient: true }
    });
    
    // Trigger WhatsApp automation
    if (appointment.patient?.phone) {
      sendWhatsAppReminder(appointment.patient.fullName, appointment.patient.phone, appointment.startTime);
    }
    
    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create appointment' });
  }
});


// Sessions endpoints
app.get('/api/sessions', async (req, res) => {
  try {
    const sessions = await prisma.session.findMany({
      include: { patient: true },
      orderBy: { date: 'desc' }
    });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
});

app.post('/api/sessions', async (req, res) => {
  try {
    const session = await prisma.session.create({
      data: req.body
    });
    res.status(201).json(session);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create session' });
  }
});

// Payments endpoints
app.get('/api/payments', async (req, res) => {
  try {
    const payments = await prisma.payment.findMany({
      include: { patient: true },
      orderBy: { date: 'desc' }
    });
    res.json(payments);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
});

app.post('/api/payments', async (req, res) => {
  try {
    const payment = await prisma.payment.create({
      data: req.body
    });
    res.status(201).json(payment);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to create payment' });
  }
});

// Exercises endpoints
app.get('/api/exercises', async (req, res) => {
  try {
    const exercises = await prisma.exercise.findMany();
    res.json(exercises);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch exercises' });
  }
});

app.post('/api/exercises', async (req, res) => {
  try {
    const exercise = await prisma.exercise.create({
      data: req.body
    });
    res.status(201).json(exercise);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create exercise' });
  }
});

// Tasks endpoints
app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      include: { patient: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

app.post('/api/tasks', async (req, res) => {
  try {
    const task = await prisma.task.create({
      data: req.body
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// Local dev server
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
