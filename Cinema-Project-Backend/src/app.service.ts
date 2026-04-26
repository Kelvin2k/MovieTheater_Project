import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}
  getHello(): string {
    return 'Hello World!';
  }
  async createSeat(): Promise<any> {
    const cinemas = await this.prisma.cinema.findMany();
    let allSeatsData: {
      seat_name: string;
      seat_type: string;
      cinema_id: number;
      seat_price: number;
    }[] = [];

    for (const cinema of cinemas) {
      const seatsData = Array.from({ length: 160 }, (_, i) => {
        const index = i + 1;
        const seatName = index.toString().padStart(2, '0');
        const isVip = index > 40 && index <= 80;

        return {
          seat_name: seatName,
          seat_type: isVip ? 'VIP' : 'Standard',
          cinema_id: cinema.cinema_id,
          seat_price: isVip ? 30 : 20,
        };
      });
      allSeatsData = allSeatsData.concat(seatsData);
    }

    const result = await this.prisma.seat.createMany({
      data: allSeatsData,
      skipDuplicates: true,
    });
    return result;
  }
}
