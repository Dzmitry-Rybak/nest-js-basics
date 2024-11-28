import { Expose, Transform } from 'class-transformer';

export class RepostDto {
    @Expose()
    id: number;
    @Expose()
    price: number;
    @Expose()
    year: number;
    @Expose()
    lng: number;
    @Expose()
    lat: number;
    @Expose()
    make: string;
    @Expose()
    model: string;
    @Expose()
    mileage: number;
    @Expose()
    approved: boolean;

    @Transform(({ obj }) => obj.user.id) // take the original report entity, take value user.id and assign it to userId
    @Expose()
    userId: number;
}
