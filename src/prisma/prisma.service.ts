import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';


@Injectable()
export class PrismaService extends PrismaClient{
    constructor() {
        super({
            datasources: {
                db: {
                    url: "postgresql://omer:OmerFad@localhost:5434/datingApp?schema=public"
                },
            },
        });
    }
}
