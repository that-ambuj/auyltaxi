/* eslint-disable */
export default async () => {
    const t = {};
    return { "@nestjs/swagger": { "models": [[import("./auth/dto/signup.dto"), { "SignInDto": { phone_number: { required: true, type: () => String }, name: { required: false, type: () => String } } }], [import("./auth/dto/verification.dto"), { "VerificationDto": { otp: { required: true, type: () => String } } }]], "controllers": [[import("./app.controller"), { "AppController": { "getHello": { type: String } } }], [import("./health/health.controller"), { "HealthController": { "check": { type: Object } } }], [import("./auth/auth.controller"), { "AuthController": { "sendOtp": {}, "verifyOtp": {} } }]] } };
};