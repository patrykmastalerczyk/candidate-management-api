import { DataSource } from 'typeorm';
import { JobOffer, JobOfferStatus } from '../entities/job-offer.entity';

export async function seedJobOffers(dataSource: DataSource): Promise<void> {
  const jobOfferRepository = dataSource.getRepository(JobOffer);

  const jobOffers = [
    {
      title: 'Senior Full Stack Developer',
      description: 'Full-stack developer position',
      requirements: '5+ years React, Node.js, PostgreSQL',
      status: JobOfferStatus.ACTIVE,
    },
    {
      title: 'Frontend Developer',
      description: 'Frontend developer position',
      requirements: '3+ years React, JavaScript, CSS',
      status: JobOfferStatus.ACTIVE,
    },
    {
      title: 'Backend Developer',
      description: 'Backend developer position',
      requirements: '4+ years Node.js, Express, databases',
      status: JobOfferStatus.ACTIVE,
    },
    {
      title: 'DevOps Engineer',
      description: 'DevOps engineer position',
      requirements: '3+ years AWS, Docker, Kubernetes',
      status: JobOfferStatus.ACTIVE,
    },
    {
      title: 'Product Manager',
      description: 'Product manager position',
      requirements: '5+ years product management experience',
      status: JobOfferStatus.ACTIVE,
    },
  ];

  for (const jobOfferData of jobOffers) {
    const existingJobOffer = await jobOfferRepository.findOne({
      where: { title: jobOfferData.title },
    });

    if (!existingJobOffer) {
      const jobOffer = jobOfferRepository.create(jobOfferData);
      await jobOfferRepository.save(jobOffer);
      console.log(`Created job offer: ${jobOfferData.title}`);
    }
  }
}
