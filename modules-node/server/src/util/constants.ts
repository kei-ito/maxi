import {URL} from 'url';
export const developMode = process.env.AWS_SAM_LOCAL === 'true';
export const baseTitle = 'MAXI GSC Data Viewer';
export const viewerBaseURL = new URL('https://maxi.wemo.me/');
export const cdnBaseURL = new URL('https://cdn.maxi.wemo.me/');
export const siteImageURL = new URL('https://cdn.maxi.wemo.me/images/sample-lightcurve.png');
