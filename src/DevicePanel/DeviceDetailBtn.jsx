import React from 'react';
import { useHistory } from 'react-router-dom';
import sdk from 'qcloud-iotexplorer-h5-panel-sdk';
import { RawBtn } from '../components/Btn';

import './DeviceDetailBtn.less';

export function DeviceDetailBtn() {
  const history = useHistory();
  const showDeviceDetail = async () => {
    const isConfirm = await sdk.tips.confirm('是否展示H5设备详情？');

    if (isConfirm) {
      await sdk.tips.alert('当前选择H5设备详情');

      sdk.showDeviceDetail({
        labelWidth: 120,
        marginTop: 8,
        shareParams: {
          a: 'a',
          b: 'b',
        },
        extendItems: [
          {
            labelIcon: 'https://main.qcloudimg.com/raw/be1d876d55ec2479d384e17c94df0e69.svg',
            label: '自定义菜单',
            content: '自定义菜单内容（可选）',
            onClick: () => console.log('点击自定义菜单'),
          },
        ],
        extendButtons: [
          {
            text: '自定义按钮',
            type: 'warning',
            onClick: () => console.log('点击自定义按钮'),
          },
          {
            text: '获取自定义分享参数',
            onClick: async () => {
              const shareParams = await sdk.getShareParams();
              console.log('自定义分享参数: ', shareParams);
            }
          },
          {
            text: '文件资源管理',
            onClick: () => {
              sdk.hideDeviceDetail()
              history.push('/addfile')
            }
          },
          {
            text: '关闭设备详情',
            type: '',
            onClick: () => sdk.hideDeviceDetail(),
          },
        ],
      });
    } else {
      await sdk.tips.alert('当前选择原生设备详情');

      sdk.goDeviceDetailPage();
    }
  };

  return (
    <RawBtn
      className="panel-more-btn"
      onClick={showDeviceDetail}
    >
      <div className="more-btn-icon" />
    </RawBtn>
  );
}
