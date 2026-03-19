const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  const services = [
    { name: 'Menage complet', description: 'Nettoyage en profondeur de toutes les pièces.', category: 'Menage', basePrice: 150, duration: 120, rating: 4.8 },
    { name: 'Plomberie urgence', description: 'Intervention rapide pour fuites et débouchage.', category: 'Plomberie', basePrice: 300, duration: 60, rating: 4.9 },
    { name: 'Electricité réparation', description: 'Diagnostic et réparation de pannes électriques.', category: 'Electricite', basePrice: 200, duration: 90, rating: 4.7 },
    { name: 'Jardinage tonte', description: 'Tonte de pelouse et entretien basique.', category: 'Jardinage', basePrice: 100, duration: 60, rating: 4.5 },
    { name: 'Demenagement camion', description: 'Aide au déménagement avec camion 20m3.', category: 'Demenagement', basePrice: 500, duration: 240, rating: 4.6 },
    { name: 'Peinture murs', description: 'Peinture murale au m².', category: 'Peinture', basePrice: 250, duration: 180, rating: 4.8 },
    { name: 'Menage standard', description: 'Nettoyage régulier et dépoussiérage.', category: 'Menage', basePrice: 100, duration: 90, rating: 4.6 },
    { name: 'Installation chauffe-eau', description: 'Pose et raccordement de chauffe-eau.', category: 'Plomberie', basePrice: 400, duration: 120, rating: 4.9 },
    { name: 'Pose luminaire', description: 'Installation de plafonniers et appliques.', category: 'Electricite', basePrice: 80, duration: 45, rating: 4.7 },
    { name: 'Nettoyage terrasse', description: 'Nettoyage haute pression de terrasse.', category: 'Jardinage', basePrice: 120, duration: 60, rating: 4.5 },
  ];

  for (const service of services) {
    const existingService = await prisma.service.findFirst({
      where: { name: service.name }
    });

    if (!existingService) {
      const createdService = await prisma.service.create({
        data: service
      });
      console.log(`Created service: ${createdService.name}`);
    }
  }

  console.log('Seeding finished.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
