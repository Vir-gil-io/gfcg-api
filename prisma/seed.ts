import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';
import 'dotenv/config';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log(' Iniciando seed...');

  // ── Usuarios ──────────────────────────────────────────────
  const adminPwd = await bcrypt.hash('Admin@1234!', 10);
  const userPwd = await bcrypt.hash('User@1234!', 10);

  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      name: 'Administrador',
      lastname: 'Sistema',
      username: 'admin',
      password: adminPwd,
      role: 'ADMIN',
    },
  });

  const juan = await prisma.user.upsert({
    where: { username: 'juan.perez' },
    update: {},
    create: {
      name: 'Juan',
      lastname: 'Pérez',
      username: 'juan.perez',
      password: userPwd,
      role: 'USER',
    },
  });

  const maria = await prisma.user.upsert({
    where: { username: 'maria.lopez' },
    update: {},
    create: {
      name: 'María',
      lastname: 'López',
      username: 'maria.lopez',
      password: userPwd,
      role: 'USER',
    },
  });

  // ── Tareas ────────────────────────────────────────────────
  await prisma.task.createMany({
    skipDuplicates: true,
    data: [
      {
        name: 'Revisar documentación',
        description: 'Revisar la documentación del proyecto backend',
        priority: true,
        user_id: juan.id,
      },
      {
        name: 'Escribir pruebas unitarias',
        description: 'Cubrir los servicios con tests de Jest',
        priority: false,
        user_id: juan.id,
      },
      {
        name: 'Diseñar wireframes',
        description: 'Crear mockups de la interfaz en Figma',
        priority: true,
        user_id: maria.id,
      },
      {
        name: 'Implementar frontend',
        description: 'Desarrollar la aplicación React conectada a la API',
        priority: true,
        user_id: maria.id,
      },
    ],
  });

  // ── Log de ejemplo ────────────────────────────────────────
  await prisma.logs.create({
    data: {
      statusCode: 200,
      timeStamp: new Date(),
      path: '/api/auth/login',
      error: '',
      errorCode: 'SEED',
      event: 'Base de datos poblada con datos de prueba',
      severity: 'INFO',
      session_id: admin.id,
    },
  });

  console.log(' Seed completado');
  console.log('   admin     → usuario: admin      | contraseña: Admin@1234!');
  console.log('   usuario 1 → usuario: juan.perez | contraseña: User@1234!');
  console.log('   usuario 2 → usuario: maria.lopez| contraseña: User@1234!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
