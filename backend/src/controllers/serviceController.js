const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getServices = async (req, res, next) => {
  try {
    const { search, category, minPrice, maxPrice, rating } = req.query;

    const whereClause = {};

    if (search) {
      whereClause.name = {
        contains: search,
        mode: 'insensitive',
      };
    }

    if (category) {
      whereClause.category = category;
    }

    if (minPrice || maxPrice) {
      whereClause.basePrice = {};
      if (minPrice) whereClause.basePrice.gte = parseFloat(minPrice);
      if (maxPrice) whereClause.basePrice.lte = parseFloat(maxPrice);
    }

    if (rating) {
      whereClause.rating = {
        gte: parseFloat(rating),
      };
    }

    const services = await prisma.service.findMany({
      where: whereClause,
      orderBy: { rating: 'desc' }
    });

    res.json(services);
  } catch (error) {
    next(error);
  }
};

const getServiceById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const service = await prisma.service.findUnique({
      where: { id: parseInt(id) }
    });

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.json(service);
  } catch (error) {
    next(error);
  }
};

const createService = async (req, res, next) => {
  try {
    const { name, description, category, basePrice, duration, available } = req.body;

    const service = await prisma.service.create({
      data: {
        name,
        description,
        category,
        basePrice: parseFloat(basePrice),
        duration: parseInt(duration),
        available: available !== undefined ? available : true,
      }
    });

    res.status(201).json(service);
  } catch (error) {
    next(error);
  }
};

const updateService = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, category, basePrice, duration, available } = req.body;

    const existingService = await prisma.service.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingService) {
      return res.status(404).json({ message: 'Service not found' });
    }

    const service = await prisma.service.update({
      where: { id: parseInt(id) },
      data: {
        name,
        description,
        category,
        basePrice: basePrice ? parseFloat(basePrice) : undefined,
        duration: duration ? parseInt(duration) : undefined,
        available
      }
    });

    res.json(service);
  } catch (error) {
    next(error);
  }
};

const deleteService = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existingService = await prisma.service.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingService) {
      return res.status(404).json({ message: 'Service not found' });
    }

    await prisma.service.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
};