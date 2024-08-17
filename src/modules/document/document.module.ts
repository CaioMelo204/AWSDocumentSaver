import { Module } from '@nestjs/common';
import { DocumentService } from './document.service';
import { DocumentController } from './document.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {Document, DocumentSchema} from "./entity/document.entity";
import {UploadModule} from "../upload/upload.module";

@Module({
  imports: [MongooseModule.forFeature([{ name: Document.name, schema: DocumentSchema }]), UploadModule],
  providers: [DocumentService],
  controllers: [DocumentController],
})
export class DocumentModule {}
