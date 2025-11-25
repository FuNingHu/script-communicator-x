/// <reference lib="webworker" />
import {
    ApplicationBehaviors,
    ApplicationNode, OptionalPromise,
    registerApplicationBehavior,
    ScriptBuilder
} from '@universal-robots/contribution-api';
import { ScriptCommunicatorApplicationNode } from './script-communicator-application.node';
import { URCAP_ID, VENDOR_ID } from 'src/generated/contribution-constants';

// factory is required
const createApplicationNode = (): OptionalPromise<ScriptCommunicatorApplicationNode> => ({
    type: 'funh-script-communicator-x-script-communicator-application',    // type is required
    version: '1.0.0',     // version is required
    popupText: 'customizedText'
});

// generatePreamble is optional
const generatePreambleScriptCode = (node: ScriptCommunicatorApplicationNode): OptionalPromise<ScriptBuilder> => {
    const builder = new ScriptBuilder();
    // const url = `servicegateway/${VENDOR_ID}/${URCAP_ID}/script-communicator-x-backend/xmlrpc`;
    // builder.assign('script_communicator', `rpc_factory("xmlrpc", "${location.protocol}//${url}/")`);
    // builder.addStatements(`script_communicator.popup()`);
    return builder;
};

// upgradeNode is optional
const upgradeApplicationNode
  = (loadedNode: ApplicationNode, defaultNode: ScriptCommunicatorApplicationNode): ScriptCommunicatorApplicationNode =>
      defaultNode;

// downgradeNode is optional
const downgradeApplicationNode
  = (loadedNode: ApplicationNode, defaultNode: ScriptCommunicatorApplicationNode): ScriptCommunicatorApplicationNode =>
      defaultNode;

const behaviors: ApplicationBehaviors = {
    factory: createApplicationNode,
    generatePreamble: generatePreambleScriptCode,
    upgradeNode: upgradeApplicationNode,
    downgradeNode: downgradeApplicationNode
};

registerApplicationBehavior(behaviors);
