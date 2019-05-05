import {Font} from '../types';
import {AvailableFonts} from './constants';
export const isAvailableFont = (font: any): font is Font => AvailableFonts.includes(font as Font);
