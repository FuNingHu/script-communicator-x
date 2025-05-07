import { TranslateService } from '@ngx-translate/core';
import { first } from 'rxjs/operators';
import { ChangeDetectionStrategy, ChangeDetectorRef, 
    Component, Input, OnChanges, OnDestroy, SimpleChanges,
    HostListener } from '@angular/core';
import { ApplicationPresenterAPI, ApplicationPresenter, RobotSettings } from '@universal-robots/contribution-api';
import { ScriptCommunicatorApplicationNode } from './script-communicator-application.node';
import { URCAP_ID, VENDOR_ID } from 'src/generated/contribution-constants';
import { XmlRpcClient } from '../xmlrpc/xmlrpc-client';

@Component({
    templateUrl: './script-communicator-application.component.html',
    styleUrls: ['./script-communicator-application.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class ScriptCommunicatorApplicationComponent implements ApplicationPresenter, OnChanges {
    // applicationAPI is optional
    @Input() applicationAPI: ApplicationPresenterAPI;
    // robotSettings is optional
    @Input() robotSettings: RobotSettings;
    // applicationNode is required
    @Input() applicationNode: ScriptCommunicatorApplicationNode;

    private xmlrpc: XmlRpcClient;
    public zPose: string;

    constructor(
        protected readonly translateService: TranslateService,
        protected readonly cd: ChangeDetectorRef
    ) {
        
    }
    ngOnDestroy(){
        if (this.xmlrpc) {
            this.xmlrpc.methodCall('close_socket').then(res => console.log(res));
            console.log('[Component] ScriptCommunicator daemon close socket!');
        }
    }
    async ngOnChanges(changes: SimpleChanges): Promise<void> {
        if (changes?.robotSettings) {
            if (!changes?.robotSettings?.currentValue) {
                return;
            }

            if (changes?.robotSettings?.isFirstChange()) {
                if (changes?.robotSettings?.currentValue) {
                    this.translateService.use(changes?.robotSettings?.currentValue?.language);
                }
                this.translateService.setDefaultLang('en');
            }

            this.translateService
                .use(changes?.robotSettings?.currentValue?.language)
                .pipe(first())
                .subscribe(() => {
                    this.cd.detectChanges();
                });
            const url = this.applicationAPI.getContainerContributionURL(
                VENDOR_ID, 
                URCAP_ID, 
                'script-communicator-x-backend',
                'xmlrpc');
            console.log("[Component] Script communicator daemon URL: ",url);
            this.xmlrpc = new XmlRpcClient(`${location.protocol}//${url}/`);

            try{
                await this.xmlrpc.methodCall('setup_socket');
                console.log("[Component] ScriptCommunicator daemon open socket!");
                console.log("[Component] popupText value: ", this.applicationNode.popupText);
                await this.xmlrpc.methodCall('popup', this.applicationNode.popupText);
                
                this.zPose = await this.xmlrpc.methodCall('get_actual_joint_positions');
                
            } catch(error){
                console.error('[Component] error in XML-RPC calls: ', error);
            }
            this.cd.detectChanges();
        }
    } 



    // call saveNode to save node parameters
    saveNode() {
        this.cd.detectChanges();
        this.applicationAPI.applicationNodeService.updateNode(this.applicationNode);
    }

    
        
}
