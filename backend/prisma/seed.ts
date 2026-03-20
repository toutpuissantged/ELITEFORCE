import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.booking.deleteMany();
  await prisma.service.deleteMany();
  await prisma.user.deleteMany();

  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash('Password123!', salt);

  // Create Admin
  await prisma.user.create({
    data: {
      firstName: 'Admin',
      lastName: 'Elite',
      email: 'admin@eliteforce.global',
      password: hashedPassword,
      phone: '+212600000000',
      role: 'ADMIN',
    },
  });

  // Create Client
  await prisma.user.create({
    data: {
      firstName: 'Test',
      lastName: 'Client',
      email: 'client@example.com',
      password: hashedPassword,
      phone: '+212611111111',
      role: 'CLIENT',
    },
  });

  // Create Services (10 minimum)
  const services = [
    {
      name: 'Nettoyage Complet',
      description: 'Nettoyage professionnel de toute la maison.',
      category: 'Ménage',
      basePrice: 300,
      duration: 120,
      image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6954?w=800&q=80',
    },
    {
      name: 'Réparation de Fuite',
      description: 'Intervention rapide pour fuites d\'eau.',
      category: 'Plomberie',
      basePrice: 200,
      duration: 60,
      image: 'https://images.unsplash.com/photo-1585704032915-c3400ca1f963?w=800&q=80',
    },
    {
      name: 'Installation Luminaire',
      description: 'Installation de plafonniers et appliques.',
      category: 'Électricité',
      basePrice: 150,
      duration: 45,
      image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80',
    },
    {
      name: 'Taille de Haies',
      description: 'Entretien de vos espaces verts.',
      category: 'Jardinage',
      basePrice: 250,
      duration: 90,
      image: 'https://images.unsplash.com/photo-1558905734-b8301138833b?w=800&q=80',
    },
    {
      name: 'Déménagement Appartement',
      description: 'Aide au transport et emballage.',
      category: 'Déménagement',
      basePrice: 1200,
      duration: 300,
      image: 'https://images.unsplash.com/photo-1520038410233-7141be7e6f97?w=800&q=80',
    },
    {
      name: 'Peinture Murale',
      description: 'Rafraîchissement de vos murs (par m²).',
      category: 'Peinture',
      basePrice: 50,
      duration: 60,
      image: 'https://images.unsplash.com/photo-1562592306-4533036e7638?w=800&q=80',
    },
    {
      name: 'Lavage de Vitres',
      description: 'Nettoyage éclatant pour vos fenêtres.',
      category: 'Ménage',
      basePrice: 100,
      duration: 45,
      image: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=800&q=80',
    },
    {
      name: 'Débouchage Canalisation',
      description: 'Intervention d\'urgence plomberie.',
      category: 'Plomberie',
      basePrice: 350,
      duration: 90,
      image: 'https://images.unsplash.com/photo-1542013936693-884638332954?w=800&q=80',
    },
    {
      name: 'Mise en Conformité',
      description: 'Vérification de votre tableau électrique.',
      category: 'Électricité',
      basePrice: 500,
      duration: 180,
      image: 'https://images.unsplash.com/photo-1544724569-5f546fa602b5?w=800&q=80',
    },
    {
      name: 'Pose de Gazon',
      description: 'Création de pelouse sur mesure.',
      category: 'Jardinage',
      basePrice: 800,
      duration: 240,
      image: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?w=800&q=80',
    },
  ];

  for (const service of services) {
    await prisma.service.create({
      data: service,
    });
  }

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
