import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
    S3Client,
    PutObjectCommand,
    DeleteObjectCommand,
    GetObjectCommand,
} from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import * as process from "node:process";
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class UploadService {
    private client: S3Client;
    private bucketName = process.env.S3_BUCKET_NAME;

    constructor() {
        const s3_region = process.env.S3_REGION;

        if (!s3_region) {
            throw new Error('S3_REGION not found in environment variables');
        }

        this.client = new S3Client({
            region: s3_region,
            forcePathStyle: true,
        });

    }

    async uploadSingleFile({
                               file,
                               isPublic = true,
                           }: {
        file: Express.Multer.File;
        isPublic: boolean;
    }) {
        try {
            const key = `${uuidv4()}`;
            const command = new PutObjectCommand({
                Bucket: this.bucketName,
                Key: key,
                Body: file.buffer,
                ContentType: file.mimetype,
                ACL: isPublic ? 'public-read' : 'private',

                Metadata: {
                    originalName: file.originalname,
                },
            });

            const uploadResult = await this.client.send(command);


            return {
                url: isPublic
                    ? (await this.getFileUrl(key)).url
                    : (await this.getPresignedSignedUrl(key)).url,
                key,
                isPublic,
            };
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }

    async getFileUrl(key: string) {
        return { url: `https://${this.bucketName}.s3.amazonaws.com/${key}` };
    }

    async getPresignedSignedUrl(key: string) {
        try {
            const command = new GetObjectCommand({
                Bucket: this.bucketName,
                Key: key,
            });

            const url = await getSignedUrl(this.client, command, {
                expiresIn: 60 * 60 * 24, // 24 hours
            });

            return { url };
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }
}
