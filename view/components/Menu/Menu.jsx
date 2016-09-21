import style from './Menu.css';
import {Link} from 'react-router';

export default () => (
    <div>
        <div className={style.nav_button}>
        </div>
        <nav className={style.nav}>
            <Link to="#">wtf</Link>
        </nav>
    </div>
);
