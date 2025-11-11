import { mergeApplicationConfig, ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideServerRendering, ServerTransferStateModule } from '@angular/platform-server';
import { appConfig } from './app.config';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    // This is the fix:
    // This explicitly provides the server-side implementation of TransferState,
    // overriding the browser version that was pulled in from app.config.ts.
    importProvidersFrom(ServerTransferStateModule)
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);