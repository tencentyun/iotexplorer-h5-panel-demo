import React from 'react';
import ReactDOM from 'react-dom';
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Link
} from "react-router-dom";
import { DevicePanel } from './DevicePanel';
import { BluetoothSearch } from './BluetoothSearch/BluetoothSearch';
import { Index } from './index';

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
					{/*	<Users/>xww*/}
					{/*</Route>*/}	
                    <Route path="/h5panel/developing/bluetooth-search">
						<BluetoothSearch/>
					</Route>
					<Route path="/h5panel/developing">
						<DevicePanel/>
					</Route>
					<Route path="/h5panel">
						<Index/>
					</Route>
				</Switch>
			</div>
		</Router>
	)
}

ReactDOM.render(<App/>, document.getElementById('app'));