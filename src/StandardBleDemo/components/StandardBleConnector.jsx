import React, { useEffect, forwardRef, useImperativeHandle } from "react";
import classNames from "classnames";
import {
  DEVICE_DISCONNECTED,
  DEVICE_CONNECTING,
  DEVICE_CONNECTED,
  DEVICE_CONNECT_ERROR,
  useStandardBleConnector,
} from "../hooks/useStandardBleConnector";
import { Loading } from "../../components/Loading";

import "./StandardBleConnector.less";

export const StandardBleConnector = forwardRef(
  ({ deviceId, familyId }, ref) => {
    const {
      deviceConnectInfo,
      disconnectDevice,
      connectDevice,
      deleteDevice,
    } = useStandardBleConnector({
      deviceId,
      familyId,
    });

    useImperativeHandle(ref, () => ({
      deleteDevice,
      disconnectDevice,
    }));

    const renderLinkBtn = (status) => {
      switch (status) {
        case DEVICE_DISCONNECTED: {
          return (
            <div
              className="device-action-link device-action-text"
              onClick={connectDevice}
            >
              <span className="link text">立即连接</span>
            </div>
          );
        }
        case DEVICE_CONNECTING: {
          return (
            <div className="device-action-connecting">
              <Loading
                type="rotate-grey"
                className="icon-loading item-icon"
                size={48}
              ></Loading>
            </div>
          );
        }

        case DEVICE_CONNECTED: {
          return (
            <div
              className="device-action-btn device-action-text"
              onClick={disconnectDevice}
            >
              <span className="text">断开</span>
            </div>
          );
        }

        case DEVICE_CONNECT_ERROR: {
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
        className={classNames("blue-tooth-connector", deviceConnectInfo.status)}
      >
        <div className="blue-tooth-content">
          <div
            className={classNames(
              "standard-blue-tooth-icon",
              deviceConnectInfo.status
            )}
          ></div>
          <div className="device-status-text">
            <span className="text">{deviceConnectInfo.msg}</span>
          </div>
          <div className="device-action">
            {renderLinkBtn(deviceConnectInfo.status)}
          </div>
        </div>
      </div>
    );
  }
);
