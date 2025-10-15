import { DataSource } from 'typeorm';
import { seedJobOffers } from './job-offers.seed';
import { Candidate } from '../entities/candidate.entity';
import { JobOffer } from '../entities/job-offer.entity';

async function runSeeds() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '5432'),
    username: process.env.DATABASE_USERNAME || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'postgres',
    database: process.env.DATABASE_NAME || 'candidate_management',
    entities: [Candidate, JobOffer],
    synchronize: true,
  });

  try {
    await dataSource.initialize();
    console.log('Database connection established');

    await seedJobOffers(dataSource);
    console.log('Seeding completed successfully');

    await dataSource.destroy();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
}

runSeeds();
