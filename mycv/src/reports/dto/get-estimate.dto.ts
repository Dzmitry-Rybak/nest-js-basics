import {
    IsNumber,
    IsString,
    Min,
    Max,
    IsLongitude,
    IsLatitude,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class GetEstimateDto {
    @IsString()
    make: string;

    @IsString()
    model: string;

    @Transform((obj) => {
        // obj - object with all incoming instructions
        // so we can get not full obj, but just destructure of { value }
        return parseInt(obj.value);
    }) // transform out query string Year value into number
    @Max(2050)
    @Min(1930)
    @IsNumber()
    year: number;

    @Transform(({ value }) => parseFloat(value))
    @IsLongitude()
    @IsNumber()
    lng: number;

    @Transform(({ value }) => parseFloat(value))
    @IsLatitude()
    @IsNumber()
    lat: number;

    @Transform(({ value }) => parseInt(value))
    @Min(0)
    @Max(1000000)
    @IsNumber()
    mileage: number;
}
