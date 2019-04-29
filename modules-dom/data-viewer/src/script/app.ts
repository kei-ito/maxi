import {createElement} from 'react';
import * as ReactDOM from 'react-dom';
import {App} from './components/App';

const appContainerElement = document.createElement('div');
document.body.appendChild(appContainerElement);
ReactDOM.render(createElement(App), appContainerElement);
