import {IFont} from '../types';

export const developMode = 80 < Number(location.port);
export const APIBaseURL = new URL(developMode ? `http://${location.hostname}:3000` : 'https://elgijkhadd.execute-api.ap-northeast-1.amazonaws.com/Prod/');
export const AvailableFonts: Array<IFont> = ['Serif', 'Sans', 'Monospace'];
export enum URLParameterKey {
    font = 'font',
    selected = 'objects',
    binSize = 'bin',
    scale = 'scale',
}
