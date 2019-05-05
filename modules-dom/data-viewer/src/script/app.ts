import {createElement} from 'react';
import * as ReactDOM from 'react-dom';
import {App} from './components/App';

const appContainerElement = document.createElement('div');
document.body.appendChild(appContainerElement);
ReactDOM.render(createElement(App), appContainerElement);

[
    'https://cdn.maxi.wemo.me/fonts/Serif/cmun-serif.css',
    'https://cdn.maxi.wemo.me/fonts/Sans/cmun-sans.css',
    'https://cdn.maxi.wemo.me/fonts/Typewriter/cmun-typewriter-light.css',
].forEach((cssURL) => {
    const linkElement = document.createElement('link');
    linkElement.rel = 'stylesheet';
    linkElement.href = cssURL;
    document.head.appendChild(linkElement);
});
