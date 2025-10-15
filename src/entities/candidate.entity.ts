import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { JobOffer } from './job-offer.entity';

export enum CandidateStatus {
  NEW = 'nowy',
  IN_PROGRESS = 'w trakcie rozmów',
  ACCEPTED = 'zaakceptowany',
  REJECTED = 'odrzucony',
}

@Entity('candidates')
export class Candidate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  phoneNumber: string;

  @Column({ type: 'int' })
  yearsOfExperience: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({
    type: 'enum',
    enum: CandidateStatus,
    default: CandidateStatus.NEW,
  })
  status: CandidateStatus;

  @Column({ type: 'timestamp' })
  consentDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany(() => JobOffer, (jobOffer) => jobOffer.candidates)
  @JoinTable({
    name: 'candidate_job_offers',
    joinColumn: { name: 'candidateId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'jobOfferId', referencedColumnName: 'id' },
  })
  jobOffers: JobOffer[];
}
