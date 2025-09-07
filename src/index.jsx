import {render} from 'preact';
import './main.scss';
import 'sanitize.css';
import 'sanitize.css/typography.css';
import 'sanitize.css/forms.css';
import 'react-photo-view/dist/react-photo-view.css';
import './config.js'
import 'animate.css'
import {App} from "./components/App.jsx";


render(<App/>, document.getElementById('app'));
