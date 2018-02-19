import * as React from "react";
import Link from "redux-first-router-link";
import * as Index from "../Index";
export const Header = () => {
	return <header>
        <nav>
            <Link to={{ type: Index.routesEnum.HOME }} > Dashboard</Link>
            < br />
            <Link to={{ type: Index.routesEnum.NEWTASK }}>Add New Task</Link>
		</nav>
	</header>;
}
