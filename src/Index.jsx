import React, { useEffect, useState, useReducer } from 'react';
import { Link } from 'react-router-dom';

export function Index() {
	return (
		<nav>
			<ul>
				<li>
					<Link to="/panel">设备面板</Link>
				</li>
				<li>
					<Link to="/bluetooth-search">蓝牙搜索页</Link>
				</li>
				<li>
					<Link to="/bluetooth-panel">蓝牙设备面板</Link>
				</li>
			</ul>
		</nav>
	)
}
