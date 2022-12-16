import React, { useEffect } from "react";
import {
  HeadBoolPanel,
  HeadEnumPanel,
  HeadNumberPanel,
} from "../components/HeadPanels";
const sdk = window.h5PanelSdk;
import { useDeviceData } from "../hooks/useDeviceData";
import { DeviceDetailBtn } from "../DeviceDetailBtn/DeviceDetailBtn";
import { PropertyCard } from "../PropertyCard/PropertyCard";
import { DataTemplateProperty } from "../dataTemplate";
import "./DevicePanel.less";
const windowHeight =
  window.innerHeight || document.documentElement.clientHeight;

export function DevicePanel() {
  const [state, { onDeviceDataChange, onDeviceStatusChange }] = useDeviceData(
    sdk
  );

  // WebSocket 监听
  useEffect(() => {
    const handleWsControl = ({ deviceId, deviceData }: {
      deviceId: string;
      deviceData: Record<string, { Value: unknown; LastUpdate: number }>;
    }) => {
      if (deviceId === sdk.deviceId) {
        // 设备收到控制指令
      }
    };

    const handleWsReport = ({ deviceId, deviceData }: {
      deviceId: string;
      deviceData: Record<string, { Value: unknown; LastUpdate: number }>;
    }) => {
      if (deviceId === sdk.deviceId) {
        // 设备属性上报
        onDeviceDataChange(deviceData);
      }
    };

    const handleWsStatusChange = ({ deviceId, deviceStatus }: {
      deviceId: string;
      deviceStatus: number;
    }) => {
      if (deviceId === sdk.deviceId) {
        // 设备在线状态变化（蓝牙设备无效）
        onDeviceStatusChange(deviceStatus);
      }
    };

    // 可监听的事件列表参考文档 https://cloud.tencent.com/document/product/1081/67452
    sdk
      .on("wsControl", handleWsControl)
      .on("wsReport", handleWsReport)
      .on("wsStatusChange", handleWsStatusChange);

    return () => {
      sdk
        .off("wsControl", handleWsControl)
        .off("wsReport", handleWsReport)
        .off("wsStatusChange", handleWsStatusChange);
    };
  }, []);

  useEffect(() => {
    // 检查固件更新，若有可升级固件，且设备在线，则弹出提示
    const doCheckFirmwareUpgrade = async () => {
      try {
        const upgradeInfo = await sdk.checkFirmwareUpgrade({
          silent: false, // 设置为 true 则只检查，不弹出提示
        });
        console.log("firmware upgrade info", upgradeInfo);
      } catch (err) {
        console.error("checkFirmwareUpgrade fail", err);
      }
    };

    doCheckFirmwareUpgrade();
  }, []);

  // 设备属性控制
  const doControlDeviceProperty = async (propertyId: string, value: unknown) => {
    // 控制报文
    const payload = {
      [propertyId]: value,
    };

    try {
      const res = await sdk.controlDeviceData(payload);

      console.log("[controlDeviceData]", payload, "成功", res);
    } catch (err) {
      console.log("[controlDeviceData]", payload, "失败", err);
    }
  };

  // 一般非在线状态（state.deviceStatus === 0）需要禁止控制
  const disabled = false; // !state.deviceStatus;

  // 指定要展示大按钮的属性标识符，为 null 则取第一个属性
  let headPanelPropertyId: string | null = null;
  if (!headPanelPropertyId
    && state.propertyList.length > 0
    && [
      "int",
      "float",
      "bool",
      "enum",
    ].includes(state.propertyList[0].define.type)
  ) {
    headPanelPropertyId = state.propertyList[0].id;
  }

  // 渲染顶部大按钮
  const renderHeadPanel = () => {
    if (!headPanelPropertyId) return null;

    const headTemplateConfig = state.propertyMap[headPanelPropertyId];
    if (!headTemplateConfig) return null;

    const {
      id,
      define: { type },
    } = headTemplateConfig;
    const value = state.deviceData[id];

    switch (type) {
      case "bool":
        return (
          <HeadBoolPanel
            templateConfig={headTemplateConfig}
            onChange={(value) => doControlDeviceProperty(id, value)}
            value={value as number}
            disabled={disabled}
          />
        );
      case "enum":
        return (
          <HeadEnumPanel
            templateConfig={headTemplateConfig}
            onChange={(value) => doControlDeviceProperty(id, value)}
            value={value as number}
            disabled={disabled}
          />
        );
      case "int":
      case "float":
        return (
          <HeadNumberPanel
            templateConfig={headTemplateConfig}
            onChange={(value) => doControlDeviceProperty(id, value)}
            value={value as number}
            disabled={disabled}
          />
        );
      default:
        return null;
    }
  };

  // 渲染属性卡片
  const renderProperty = (property: DataTemplateProperty) => {
    return (
      <PropertyCard
        key={property.id}
        property={property}
        value={state.deviceData[property.id]}
        disabled={disabled}
        onChange={(value) => {
          doControlDeviceProperty(property.id, value);
        }}
      />
    );
  };

  return (
    <div>
      <div
        className="device-panel clear-margin"
        style={{ minHeight: `${windowHeight}px` }}
      >
        <DeviceDetailBtn />

        {renderHeadPanel()}

        {state.propertyList.length > 0 && (
          <div className="card-layout">
            {state.propertyList.map((property) => renderProperty(property))}
          </div>
        )}
      </div>
    </div>
  );
}
