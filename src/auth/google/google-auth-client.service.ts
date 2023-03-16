import { ConfigService } from "@nestjs/config";
import { Injectable, BadRequestException } from "@nestjs/common";
import { LoginTicket, OAuth2Client } from "google-auth-library";

import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from "./constants";

@Injectable()
export class GoogleAuthClientService {
    public constructor(private readonly configService: ConfigService) {}

    private client = new OAuth2Client({
        clientId: this.configService.get<string>(GOOGLE_CLIENT_ID),
        clientSecret: this.configService.get<string>(GOOGLE_CLIENT_SECRET),
    });

    public async verifyIdToken(credntial: string): Promise<LoginTicket> {
        try {
            const ticket = await this.client.verifyIdToken({
                idToken: credntial,
                audience: this.configService.get<string>(GOOGLE_CLIENT_ID),
            });

            return ticket;
        } catch (error) {
            throw new BadRequestException("Token Verification Failed");
        }
    }
}
