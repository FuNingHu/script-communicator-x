import { ApplicationNode } from '@universal-robots/contribution-api';

export interface ScriptCommunicatorApplicationNode extends ApplicationNode {
  type: string;
  version: string;
  popupText: string;
}
