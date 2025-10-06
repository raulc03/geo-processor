import { Controller, Post, Body, UsePipes, ValidationPipe, HttpCode, ServiceUnavailableException } from '@nestjs/common';
import { AppService } from './app.service';
import { IsArray, ValidateNested, IsNumber, IsDefined, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';

export class PointDto {
    @IsDefined()
    @IsNumber()
    lat: number;

    @IsDefined()
    @IsNumber()
    lng: number;
}

export class PointsDto {
    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => PointDto)
    points: PointDto[];
}
@Controller()
export class AppController {
    constructor(private readonly appService: AppService) { }

    @Post("/points")
    @HttpCode(200)
    @UsePipes(new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
    }))
    async postPointsToApi(@Body() body: PointsDto): Promise<any> {
        const result = await this.appService.callApiWithPoints(body);
        if (result && result.error) {
            throw new ServiceUnavailableException(result);
        }
        return result;
    }
}
