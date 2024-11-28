import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReportsEntity } from './reports.entity';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dto/create-report.dto';
import { UserEntity } from '../users/user.entity';
// import { Serialize } from 'src/interceptors/serialize.interceptor';
// import { UserDto } from 'src/users/dto/user.dto';
import { GetEstimateDto } from './dto/get-estimate.dto';

@Injectable()
export class ReportsService {
    constructor(
        @InjectRepository(ReportsEntity)
        private repo: Repository<ReportsEntity>,
    ) {}

    getSmth() {
        return this.repo.find;
    }

    create(reportDto: CreateReportDto, user: UserEntity) {
        const report = this.repo.create(reportDto);
        report.user = user;

        return this.repo.save(report);
    }

    async changeApproval(id: string, approved: boolean) {
        const report = await this.repo.findOne({ where: { id: parseInt(id) } });
        if (!report) {
            throw new NotFoundException('report not found');
        }

        report.approved = approved;
        return this.repo.save(report);
    }

    createEstimate(estimateDto: GetEstimateDto) {
        return this.repo
            .createQueryBuilder()
            .select('AVG(price)', 'price')
            .where('make = :make', { make: estimateDto.make })
            .andWhere('model =:model', { model: estimateDto.model })
            .andWhere('lng - :lng BETWEEN -5 AND 5', { lng: estimateDto.lng })
            .andWhere('lat - :lat BETWEEN -5 AND 5', { lat: estimateDto.lat })
            .andWhere('year - :year BETWEEN -3 AND 3', {
                year: estimateDto.year,
            })
            .andWhere('approved IS TRUE')
            .orderBy('ABS(mileage - :mileage)', 'DESC')
            .setParameters({ mileage: estimateDto.mileage })
            .limit(3)
            .getRawOne();
    }
}
