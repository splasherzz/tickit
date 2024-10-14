import { Controller, Get } from '@nestjs/common';
import { LinkedInService, Job } from './linkedin.service';

@Controller('linkedin')
export class LinkedInController {
  constructor(private readonly linkedInService: LinkedInService) {}

  @Get('test')
  async getHello(): Promise<Job> {
    const url = 'https://ph.linkedin.com/jobs/view/customer-service-officer-at-rcbc-4046114408?refId=VZ0GYZGzqT3ZGY2ZfySl0w%3D%3D&trackingId=Y0ClYhWjTTJCYMG316NbkQ%3D%3D&original_referer=https%3A%2F%2Fwww.linkedin.com%2F'
    const res = await this.linkedInService.test(url);
    console.log(res);
    return res;
  }
}
