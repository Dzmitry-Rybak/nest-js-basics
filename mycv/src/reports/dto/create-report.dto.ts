import {
    IsNumber,
    IsString,
    Min,
    Max,
    IsLongitude,
    IsLatitude,
} from 'class-validator';

export class CreateReportDto {
    @IsNumber()
    @Min(0)
    @Max(1000000)
    price: number;

    @IsString()
    make: string;

    @IsString()
    model: string;

    @Max(2050)
    @Min(1930)
    @IsNumber()
    year: number;

    @IsLongitude()
    @IsNumber()
    lng: number;

    @IsLatitude()
    @IsNumber()
    lat: number;

    @Min(0)
    @Max(1000000)
    @IsNumber()
    mileage: number;
}
