import {PlotType} from '../types';
import {dateToMJD} from './mjd';

export const SVGNS = 'http://www.w3.org/2000/svg';
export const developMode = !document.querySelector('base');
export const APIBaseURL = new URL(developMode ? `${location.protocol}//${location.hostname}:3000` : `${location.protocol}//${location.host}/`);
export const AvailablePlotTypes: Array<PlotType> = [PlotType.Point, PlotType.Line];
export enum URLParameterKey {
    mjdRange = 'mjd',
    binSize = 'bin',
    plotType = 'plot',
}
export const epochMJD = dateToMJD(new Date('2009-08-01T00:00:00Z'));
export const nowMJD = dateToMJD(new Date());
export const pageTitle = 'MAXI GSC Data Viewer';
export const mainTickSize = 10;
export const subTickSize = 5;
export const getAreaHeight = () => window.innerHeight * 0.2;
export const bandCount = 4;
