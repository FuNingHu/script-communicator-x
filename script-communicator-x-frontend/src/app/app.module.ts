import { DoBootstrap, Injector, NgModule, ErrorHandler } from '@angular/core';
import { ScriptCommunicatorApplicationComponent } from './components/script-communicator-application/script-communicator-application.component';
import { UIAngularComponentsModule } from '@universal-robots/ui-angular-components';
import { BrowserModule } from '@angular/platform-browser';
import { createCustomElement } from '@angular/elements';
import { HttpBackend, HttpClientModule } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import {MultiTranslateHttpLoader} from 'ngx-translate-multi-http-loader';
import { PATH } from '../generated/contribution-constants';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";


export const httpLoaderFactory = (http: HttpBackend) =>
    new MultiTranslateHttpLoader(http, [
        { prefix: PATH + '/assets/i18n/', suffix: '.json' },
        { prefix: './ui/assets/i18n/', suffix: '.json' },
    ]);

@NgModule({
    declarations: [
        ScriptCommunicatorApplicationComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        UIAngularComponentsModule,
        HttpClientModule,
        TranslateModule.forRoot({
            loader: { provide: TranslateLoader, useFactory: httpLoaderFactory, deps: [HttpBackend] },
            useDefaultLang: false,
        })
    ],
    providers: [],
})

export class AppModule implements DoBootstrap {
    constructor(private injector: Injector) {
    }

    ngDoBootstrap() {
        const scriptcommunicatorapplicationComponent = createCustomElement(ScriptCommunicatorApplicationComponent, {injector: this.injector});
        customElements.define('funh-script-communicator-x-script-communicator-application', scriptcommunicatorapplicationComponent);
    }

    // This function is never called, because we don't want to actually use the workers, just tell webpack about them
    registerWorkersWithWebPack() {
        new Worker(new URL('./components/script-communicator-application/script-communicator-application.behavior.worker.ts'
            /* webpackChunkName: "script-communicator-application.worker" */, import.meta.url), {
            name: 'script-communicator-application',
            type: 'module'
        });
    }
}

