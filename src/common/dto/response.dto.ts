import { applyDecorators, Type } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class ErrorResponse {
  @ApiPropertyOptional({ description: 'field associated with the error' })
  field?: string;

  @ApiProperty({ description: 'message about the error' })
  message: string;
}

export class ResponseDto<T> {
  @ApiPropertyOptional({ description: 'message about the request' })
  @IsString()
  @IsOptional()
  message?: string;

  @ApiProperty({ type: Number, description: 'http status code of the request' })
  @IsNumber()
  statusCode: number;

  @ApiPropertyOptional({ description: 'response data' })
  data?: T;
}

export const ApiDataResponse = <TModel extends Type<any>>(model: TModel, description?: string) => {
  return applyDecorators(
    ApiResponse({
      status: 200,
      description,
      schema: {
        title: model.name,
        allOf: [
          { $ref: getSchemaPath(ResponseDto) },
          {
            properties: {
              data: {
                $ref: getSchemaPath(model),
              },
            },
          },
        ],
      },
    })
  );
};
