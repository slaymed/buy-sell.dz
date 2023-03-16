import { GoogleAuthService } from "./google-auth.service";
import { Controller, Post, Body, UseGuards, Req } from "@nestjs/common";

import { ConfigService } from "@nestjs/config";
import { GoogleAuthGuard } from "./guards/google-auth.guard";
import { GetUser } from "src/users/decorators";
import { GetSerializedUserPayload } from "../decorators";
import { SerializedUserPayload } from "../types";

@Controller("auth/google")
export class GoogleAuthController {
    public constructor(
        private readonly configService: ConfigService,
        private readonly googleAuthService: GoogleAuthService
    ) {}

    @Post("authenticate")
    @UseGuards(GoogleAuthGuard)
    public authenticate(
        @GetSerializedUserPayload() serializedUserPayload: SerializedUserPayload
    ): SerializedUserPayload {
        return serializedUserPayload;
    }
}
