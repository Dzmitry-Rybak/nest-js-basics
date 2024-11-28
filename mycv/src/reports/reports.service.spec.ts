import { Test, TestingModule } from '@nestjs/testing';
import { ReportsService } from './reports.service';

describe('ReportsService', () => {
    let service: ReportsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ReportsService],
        }).compile();

        service = module.get<ReportsService>(ReportsService); // <RepostsService> - sad that result must be an instance class of RepostsService type
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
