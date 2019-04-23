import {IFont} from '../types';
import {dateToMJD} from './mjd';

export const developMode = 80 < Number(location.port);
export const APIBaseURL = new URL(developMode ? `http://${location.hostname}:3000` : 'https://elgijkhadd.execute-api.ap-northeast-1.amazonaws.com/Prod/');
export const AvailableFonts: Array<IFont> = ['Serif', 'Sans', 'Monospace'];
export enum URLParameterKey {
    minMJD = 'min',
    maxMJD = 'max',
    selected = 'objects',
    binSize = 'bin',
    font = 'font',
    scale = 'scale',
}
export const epochMJD = dateToMJD(new Date('2009-08-01T00:00:00Z'));
export const nowMJD = dateToMJD(new Date());
