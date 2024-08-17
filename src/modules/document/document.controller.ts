import {Controller, Param, Query} from '@nestjs/common';
import {DocumentService} from "./document.service";
import {
    Body,
    FileTypeValidator,
    Get,
    MaxFileSizeValidator,
    ParseFilePipe,
    Post,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {SaveDocumentDto} from "./dto/save-document.dto";

@Controller('document')
export class DocumentController {
    constructor(private readonly documentService: DocumentService) {}

    @Post('/file')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
                ],
                fileIsRequired: true,
            }),
        )
            file: Express.Multer.File,
        @Body() body: SaveDocumentDto,
    ) {
        return this.documentService.saveDocument({
            ...body,
            file: file,
        });
    }

    @Get('/file/:id')
    async getFile(@Param('id') id: string) {
        return this.documentService.getDocument(id)
    }

    @Get('/file')
    async getFileByName() {
        return this.documentService.getDocumentsByQuery();
    }
}
