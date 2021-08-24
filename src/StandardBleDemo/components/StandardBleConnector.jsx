import React, { useEffect, forwardRef, useImperativeHandle } from "react";
import classNames from "classnames";
import {
	StandardBleConnectStatus,
	useStandardBleConnector,
} from "../hooks/useStandardBleConnector";
import { Loading } from "../../components/Loading";

import "./StandardBleConnector.less";

export const StandardBleConnector = forwardRef(
	({ deviceId, familyId }, ref) => {
		const [
			connectStatusInfo,
			{
				deviceAdapter,
				connectDevice,
				deleteDevice,
				controlDevice,
				disconnectDevice,
				controlAction,
			},
		] = useStandardBleConnector({
			deviceId,
			familyId,
		});

		useImperativeHandle(ref, () => ({
			deleteDevice,
			disconnectDevice,
		}));

		const renderLinkBtn = (status) => {
			switch (status) {
				case StandardBleConnectStatus.DISCONNECTED: {
					return (
						<div
							className="device-action-link device-action-text"
							onClick={connectDevice}
						>
							<span className="text link">立即连接</span>
						</div>
					);
				}
				case StandardBleConnectStatus.CONNECTING: {
					return (
						<div className="device-action-connecting">
							<Loading
								type="rotate-grey"
								className="icon-loading item-icon"
								size={24}
							/>
						</div>
					);
				}

				case StandardBleConnectStatus.CONNECTED: {
					return (
						<div
							className="device-action-btn device-action-text"
							onClick={disconnectDevice}
						>
							<span className="text">断开</span>
						</div>
					);
				}

				case StandardBleConnectStatus.ERROR: {
					return (
						<div
							className="device-action-btn device-action-text"
							onClick={connectDevice}
						>
							<span className="text">重试</span>
						</div>
					);
				}
			}
		};

		return (
			<div
				className={classNames("blue-tooth-connector", connectStatusInfo.status)}
			>
				<div className="blue-tooth-content">
					<div
						className={classNames(
							"standard-blue-tooth-icon",
							connectStatusInfo.status
						)}
					/>
					<div className="device-status-text">
						<span className="text">{connectStatusInfo.msg}</span>
					</div>
					<div className="device-action">
						{renderLinkBtn(connectStatusInfo.status)}
					</div>
				</div>
			</div>
		);
	}
);
