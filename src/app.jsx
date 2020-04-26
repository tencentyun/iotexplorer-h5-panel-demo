import React from 'react';
import ReactDOM from 'react-dom';
import {
	HashRouter as Router,
	Switch,
	Route,
	Link
} from "react-router-dom";
import { DevicePanel } from './DevicePanel';
import { BluetoothSearch } from './BluetoothSearch';
import { Index } from './Index';

import './style.less';

function App() {
	return (
		<Router>
			<div>
				{/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
				<Switch>
					{/*<Route path="/about">*/}
					{/*	<About/>*/}
					{/*</Route>*/}
					{/*<Route path="/users">*/}
					{/*	<Users/>*/}
					{/*</Route>*/}
					<Route path="/panel">
						<DevicePanel/>
					</Route>
					<Route path="/bluetooth-search">
						<BluetoothSearch/>
					</Route>
					<Route path="/">
						<Index/>
					</Route>
				</Switch>
			</div>
		</Router>
	)
}

ReactDOM.render(<App/>, document.getElementById('app'));