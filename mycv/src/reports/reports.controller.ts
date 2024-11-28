import {
    Body,
    Controller,
    Get,
    Post,
    UseGuards,
    Patch,
    Param,
    Query,
} from '@nestjs/common';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { AuthGuard } from '../guards/auth.guard';
import { AdminGuard } from '../guards/admin.guard';
import { CurrentUserDecorator } from '../users/decorators/current-user.decorator';
import { UserEntity } from '../users/user.entity';
import { RepostDto } from './dto/report.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { ApprovedReportDto } from './dto/approved-report.dto';
import { GetEstimateDto } from './dto/get-estimate.dto';

@Controller('reports')
export class ReportsController {
    constructor(private reportService: ReportsService) {}

    @Get()
    getEstimate(@Query() query: GetEstimateDto) {
        return this.reportService.createEstimate(query);
    }

    @Post()
    @UseGuards(AuthGuard)
    // RepostDto - setting of how out respone will be look like
    @Serialize(RepostDto) // doesn't share with user information (it's was added because of ManyToOne technic)
    createReport(
        @Body() body: CreateReportDto,
        @CurrentUserDecorator() user: UserEntity,
    ) {
        return this.reportService.create(body, user);
    }

    @Patch('/:id')
    @UseGuards(AdminGuard)
    approveReport(@Param('id') id: string, @Body() body: ApprovedReportDto) {
        return this.reportService.changeApproval(id, body.approved);
    }
}
