import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Document} from "./entity/document.entity";
import {Model} from "mongoose";
import {UploadService} from "../upload/upload.service";
import {SaveDocumentDto} from "./dto/save-document.dto";

@Injectable()
export class DocumentService {
    constructor(
       @InjectModel(Document.name) private readonly documentModel: Model<Document>,
       private readonly uploadService: UploadService,
    ) {}

    async saveDocument(payload: SaveDocumentDto): Promise<Document> {
        const fileSaved = await this.uploadService.uploadSingleFile({
            file: payload.file,
            isPublic: payload.isPublic,
        })

        return await this.documentModel.create({
            isPublic: fileSaved.isPublic,
            data_upload: payload.data_upload,
            descricao: payload.descricao,
            nome_arquivo: payload.nome_arquivo,
            key: fileSaved.key,
            tamanho_arquivo: payload.tamanho_arquivo,
            tipo_arquivo: payload.tipo_arquivo,
        })
    }

    async getDocument(id: string) {
        const doc = await this.documentModel.findById(id);
        if (!doc) {
            throw new NotFoundException("Document not found");
        }
        if (doc.isPublic !== true) {
            return this.uploadService.getPresignedSignedUrl(doc.key)
        }
        return this.uploadService.getFileUrl(doc.key)
    }

    async getDocumentsByQuery() {
        return this.documentModel.find();
    }
}
