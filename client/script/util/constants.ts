import {IFont} from '../types';

// export const developMode = location.hostname === 'localhost';
export const developMode = true;
export const APIBaseURL = new URL(developMode ? `http://${location.hostname}:3000` : '');
export const AvailableFonts: Array<IFont> = ['Serif', 'Sans', 'Monospace'];
export enum URLParameterKey {
    font = 'font',
    selected = 'objects',
    binSize = 'bin',
    scale = 'scale',
}
