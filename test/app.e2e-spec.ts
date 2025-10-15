import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('should be defined', () => {
    expect(app).toBeDefined();
  });

  describe('/candidates (POST)', () => {
    it('should create a candidate successfully', () => {
      const candidateData = {
        firstName: 'Jan',
        lastName: 'Kowalski',
        email: `jan.kowalski.${Date.now()}@example.com`,
        phoneNumber: '+48123456789',
        yearsOfExperience: 5,
        notes: 'Great candidate',
        consentDate: '2024-01-01T00:00:00.000Z',
        jobOfferIds: [1, 2],
      };

      return request(app.getHttpServer())
        .post('/candidates')
        .send(candidateData)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.firstName).toBe(candidateData.firstName);
          expect(res.body.lastName).toBe(candidateData.lastName);
          expect(res.body.email).toBe(candidateData.email);
          expect(res.body.jobOffers).toHaveLength(2);
        });
    });

    it('should return 400 for invalid email', () => {
      const candidateData = {
        firstName: 'Jan',
        lastName: 'Kowalski',
        email: 'invalid-email',
        phoneNumber: '+48123456789',
        yearsOfExperience: 5,
        consentDate: '2024-01-01T00:00:00.000Z',
        jobOfferIds: [1],
      };

      return request(app.getHttpServer())
        .post('/candidates')
        .send(candidateData)
        .expect(400);
    });

    it('should return 400 for missing required fields', () => {
      const candidateData = {
        firstName: 'Jan',
        email: `jan.kowalski.${Date.now()}@example.com`,
        phoneNumber: '+48123456789',
        yearsOfExperience: 5,
        consentDate: '2024-01-01T00:00:00.000Z',
        jobOfferIds: [1],
      };

      return request(app.getHttpServer())
        .post('/candidates')
        .send(candidateData)
        .expect(400);
    });

    it('should return 400 for invalid years of experience', () => {
      const candidateData = {
        firstName: 'Jan',
        lastName: 'Kowalski',
        email: `jan.kowalski.${Date.now()}@example.com`,
        phoneNumber: '+48123456789',
        yearsOfExperience: -1,
        consentDate: '2024-01-01T00:00:00.000Z',
        jobOfferIds: [1],
      };

      return request(app.getHttpServer())
        .post('/candidates')
        .send(candidateData)
        .expect(400);
    });

    it('should return 400 for non-existent job offers', () => {
      const candidateData = {
        firstName: 'Jan',
        lastName: 'Kowalski',
        email: 'jan.kowalski@example.com',
        phoneNumber: '+48123456789',
        yearsOfExperience: 5,
        consentDate: '2024-01-01T00:00:00.000Z',
        jobOfferIds: [999, 998],
      };

      return request(app.getHttpServer())
        .post('/candidates')
        .send(candidateData)
        .expect(400);
    });
  });

  describe('/candidates (GET)', () => {
    it('should return paginated candidates', () => {
      return request(app.getHttpServer())
        .get('/candidates')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('candidates');
          expect(res.body).toHaveProperty('total');
          expect(res.body).toHaveProperty('page');
          expect(res.body).toHaveProperty('limit');
          expect(Array.isArray(res.body.candidates)).toBe(true);
        });
    });

    it('should return candidates with custom pagination', () => {
      return request(app.getHttpServer())
        .get('/candidates?page=1&limit=5')
        .expect(200)
        .expect((res) => {
          expect(res.body.page).toBe('1');
          expect(res.body.limit).toBe('5');
        });
    });
  });

  describe('/candidates/:id (GET)', () => {
    it('should return 404 for non-existent candidate', () => {
      return request(app.getHttpServer())
        .get('/candidates/999')
        .expect(404);
    });
  });

  describe('/candidates/email/:email (GET)', () => {
    it('should return 404 for non-existent email', () => {
      return request(app.getHttpServer())
        .get('/candidates/email/nonexistent@example.com')
        .expect(404);
    });
  });
});
