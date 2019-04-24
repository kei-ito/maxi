import {PlotType} from '../types';
import {AvailablePlotTypes} from './constants';
export const isAvailablePlotType = (plot: any): plot is PlotType => AvailablePlotTypes.includes(plot as PlotType);
