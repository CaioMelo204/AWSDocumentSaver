import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type documentDocument = HydratedDocument<Document>;

@Schema()
export class Document {
    @Prop()
    nome_arquivo: string;

    @Prop()
    tipo_arquivo: string;

    @Prop()
    tamanho_arquivo: string;

    @Prop()
    data_upload: string;

    @Prop()
    key: string;

    @Prop()
    descricao: string;

    @Prop()
    isPublic: boolean;
}

export const DocumentSchema = SchemaFactory.createForClass(Document);