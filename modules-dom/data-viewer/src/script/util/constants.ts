import {PlotType, Font} from '../types';
import {dateToMJD} from '@maxi-js/date-tools';

export const SVGNS = 'http://www.w3.org/2000/svg';
export const developMode = !document.querySelector('base');
export const APIBaseURL = new URL(developMode ? `${location.protocol}//${location.hostname}:3000` : `${location.protocol}//${location.host}/`);
export const AvailablePlotTypes = [PlotType.Point, PlotType.Line];
export const AvailablePlotTypeTitles = {
    [PlotType.Point]: 'Point',
    [PlotType.Line]: 'Line',
};
export const AvailableFonts = [Font.sans, Font.serif];
export const AvailableFontTitles = {
    [Font.sans]: 'Sans',
    [Font.serif]: 'Serif',
};
export enum URLParameterKey {
    mjdRange = 'mjd',
    binSize = 'bin',
    plotType = 'plot',
    font = 'font',
}
export const epochMJD = dateToMJD(new Date('2009-08-01T00:00:00Z'));
export const pageTitle = 'MAXI GSC Data Viewer';
export const mainTickSize = 10;
export const subTickSize = 5;
export const getAreaHeight = () => window.innerHeight * 0.2;
export const bandCount = 4;
