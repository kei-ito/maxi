import {PlotType} from '../types';
import {dateToMJD} from './mjd';

export const developMode = 80 < Number(location.port);
export const APIBaseURL = new URL(developMode ? `http://${location.hostname}:3000` : 'https://elgijkhadd.execute-api.ap-northeast-1.amazonaws.com/Prod/');
export const AvailablePlotTypes: Array<PlotType> = [PlotType.Point, PlotType.Line];
export enum URLParameterKey {
    mjdRange = 'mjd',
    selected = 'objects',
    binSize = 'bin',
    plotType = 'plot',
}
export const epochMJD = dateToMJD(new Date('2009-08-01T00:00:00Z'));
export const nowMJD = dateToMJD(new Date());
export const pageTitle = document.title;
