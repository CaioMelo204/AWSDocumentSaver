export class SaveDocumentDto {
    nome_arquivo: string;
    tipo_arquivo: string;
    tamanho_arquivo: string;
    data_upload: string;
    descricao: string;
    file?: Express.Multer.File;
    isPublic: boolean;
}