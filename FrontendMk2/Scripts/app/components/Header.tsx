import * as React from "react";
import Link from "redux-first-router-link";

export const Header = () => {
	return <header>
		<nav>
			<Link to="/scenario/123">Scenario 123</Link>
			< br />
			<Link to={{ type: 'QUESTIONS' }}>Update Questions</Link>
		</nav>
	</header>;
}
