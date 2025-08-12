import {render} from 'preact';
import './main.scss';
import 'sanitize.css';
import 'sanitize.css/typography.css';
import 'sanitize.css/forms.css';
import './config.js'
import 'animate.css'
import {debounce} from "./utils/CommonUtils.jsx";
import {App} from "./components/App.jsx";


function updateSize() {
    const width = Math.max(window.innerWidth, window.innerHeight)
    document.documentElement.style.fontSize = width / 100 + 'px'
}

updateSize()
//rem
window.addEventListener('resize', () => {
    debounce('resize', updateSize, 500)
})


render(<App/>, document.getElementById('app'));
