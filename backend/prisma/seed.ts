import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const services = [
  { name: 'Ménage Standard', description: 'Nettoyage complet de votre domicile (3h)', category: 'Ménage', basePrice: 200, duration: 180, rating: 4.5, available: true },
  { name: 'Ménage Profond', description: 'Nettoyage en profondeur, vitres incluses', category: 'Ménage', basePrice: 350, duration: 300, rating: 4.8, available: true },
  { name: 'Réparation Fuite d\'eau', description: 'Intervention rapide pour fuites et tuyauterie', category: 'Plomberie', basePrice: 150, duration: 60, rating: 4.2, available: true },
  { name: 'Installation Chauffe-eau', description: 'Pose et raccordement de chauffe-eau électrique', category: 'Plomberie', basePrice: 400, duration: 120, rating: 4.7, available: true },
  { name: 'Dépannage Électrique', description: 'Recherche de court-circuit et réparation', category: 'Électricité', basePrice: 150, duration: 60, rating: 4.9, available: true },
  { name: 'Installation Prises', description: 'Ajout de 3 prises de courant standards', category: 'Électricité', basePrice: 250, duration: 120, rating: 4.6, available: true },
  { name: 'Entretien Jardin', description: 'Tonte de pelouse et taille de haies', category: 'Jardinage', basePrice: 300, duration: 180, rating: 4.3, available: true },
  { name: 'Déménagement Studio', description: 'Camionnette + 2 déménageurs (Demi-journée)', category: 'Déménagement', basePrice: 800, duration: 240, rating: 4.8, available: true },
  { name: 'Peinture Chambre', description: 'Peinture murs et plafond (max 15m²)', category: 'Peinture', basePrice: 600, duration: 360, rating: 4.7, available: true },
  { name: 'Montage Meuble', description: 'Montage de meubles en kit type IKEA', category: 'Bricolage', basePrice: 150, duration: 120, rating: 4.5, available: true },
];

async function main() {
  console.log('Seeding database...');

  // Seed admin user
  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash('Admin@123', salt);

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@eliteforce.com' },
    update: {},
    create: {
      email: 'admin@eliteforce.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'EliteForce',
      role: 'ADMIN',
      phone: '+212600000000'
    },
  });

  // Seed services
  for (const service of services) {
    await prisma.service.create({
      data: service,
    });
  }
  console.log('Database seeded successfully with 10 services!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
