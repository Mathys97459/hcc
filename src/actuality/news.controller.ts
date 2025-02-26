import { Controller, Post, Body, Get, Param, Patch, Delete, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { NewsService } from './news.service';
import { Roles } from '../auth/roles.decorator';

@Controller('news')
export class NewsController {
  constructor(private readonly NewsService: NewsService) {}

  @Post('/create')
  @Roles('contributeur')
  async createNews(@Body() newsData, @Request() req) {
    return this.NewsService.createNews(newsData, req.headers.authorization);
  }

  @Get()
  async getAllNews() {
    return this.NewsService.getAllNews();
  }

  @Get(':id')
  async getNewsById(@Param('id') id: number) {
    return this.NewsService.getNewsById(id);
  }
}
