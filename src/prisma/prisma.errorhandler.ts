import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

@Injectable()
export class PrismaErrorHandler {

    handleError(error: Error): never {
        if (error instanceof PrismaClientKnownRequestError) {
            switch (error.code) {
                // Unique constraint violations
                case 'P2002':
                    throw new ConflictException(
                        `Record already exists with this ${error.meta?.target as string}`
                    );

                // Not found during required relation lookups or updates
                case 'P2025':
                    throw new NotFoundException(
                        'Record not found'
                    );

                // Foreign key constraint violations
                case 'P2003':
                    throw new BadRequestException(
                        `Invalid reference to ${error.meta?.field_name as string}`
                    );

                // Invalid data type for field
                case 'P2006':
                    throw new BadRequestException(
                        'Invalid data type provided for one or more fields'
                    );

                // Required field constraints
                case 'P2011':
                    throw new BadRequestException(
                        'Required field is missing'
                    );

                // NULL constraint violation
                case 'P2012':
                    throw new BadRequestException(
                        'Missing required fields'
                    );

                // Invalid multi-field unique constraint
                case 'P2014':
                    throw new ConflictException(
                        'Invalid combination of field values'
                    );

                // Data validation errors
                case 'P2007':
                    throw new BadRequestException(
                        'Data validation failed'
                    );

                // Foreign key not found
                case 'P2018':
                    throw new BadRequestException(
                        'Related record not found'
                    );

                // Input string too long
                case 'P2000':
                    throw new BadRequestException(
                        'Input value exceeds maximum length'
                    );
                default:
                    throw new InternalServerErrorException('Unexpected database error.');
            }
        }
        throw error;
    }
}