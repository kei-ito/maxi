import {IFont} from '../types';
import {AvailableFonts} from './constants';
export const isAvailableFont = (font: string): font is IFont => AvailableFonts.includes(font as IFont);
