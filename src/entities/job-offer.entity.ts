import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

export enum JobOfferStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  CLOSED = 'closed',
}

@Entity('job_offers')
export class JobOffer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  requirements: string;

  @Column({
    type: 'enum',
    enum: JobOfferStatus,
    default: JobOfferStatus.ACTIVE,
  })
  status: JobOfferStatus;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @OneToMany('Candidate', 'jobOffers')
  candidates: any[];
}
