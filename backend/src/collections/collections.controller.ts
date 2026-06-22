import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
} from '@nestjs/common';
import { CollectionsService } from './collections.service';
import { CreateCollectionDto, UpdateCollectionDto } from './dto/collection.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('collections')
@UseGuards(JwtAuthGuard)
export class CollectionsController {
  constructor(private collectionsService: CollectionsService) {}

  @Get()
  list(
    @Request() req: { user: { laundromatId: string } },
    @Query('page') page?: string,
    @Query('status') status?: string,
  ) {
    return this.collectionsService.list(req.user.laundromatId, {
      page: page ? parseInt(page, 10) : undefined,
      status,
    });
  }

  @Get(':id')
  get(@Request() req: { user: { laundromatId: string } }, @Param('id') id: string) {
    return this.collectionsService.get(req.user.laundromatId, id);
  }

  @Post()
  @HttpCode(201)
  create(
    @Request() req: { user: { laundromatId: string } },
    @Body() dto: CreateCollectionDto,
  ) {
    return this.collectionsService.create(req.user.laundromatId, dto);
  }

  @Patch(':id')
  update(
    @Request() req: { user: { laundromatId: string } },
    @Param('id') id: string,
    @Body() dto: UpdateCollectionDto,
  ) {
    return this.collectionsService.update(req.user.laundromatId, id, dto);
  }

  @Delete(':id')
  remove(@Request() req: { user: { laundromatId: string } }, @Param('id') id: string) {
    return this.collectionsService.remove(req.user.laundromatId, id);
  }
}
