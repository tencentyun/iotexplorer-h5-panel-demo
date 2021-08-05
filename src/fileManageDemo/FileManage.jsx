import React, { useState, useRef, useEffect, useContext } from 'react';
import sdk from 'qcloud-iotexplorer-h5-panel-sdk';
import './FileManage.less';
import { useHistory } from "react-router-dom";


import moment from 'moment';
import { useLocation } from 'react-router-dom';

// USER_283271511001796608_RES_5fcffa29793daa1f9d6203f967b9b2a7
export function FileManage() {
  const history = useHistory();
  const location = useLocation();
  const { state } = location;
  const [Resource, setResource] = useState(state ? state.Resource : '');

  const handleAddFile = async () => {
    history.push('addfile');
  }
  const keys = {
    ResourceName: '文件名称',
    ResourceType: '文件类型',
    DeviceName: '设备名称',
    ProductId: '产品ID',
    CreateTime: '创建时间',
    UpdateTime: '更新时间',
  }

  return (
    <div className='file-card'>
      <button className='file-button'  onClick={handleAddFile}>上传文件</button>
      <ul className='file-list'>
        {
          Resource ? Object.keys(Resource).map((item, index) => {
            if(keys.hasOwnProperty(item)) {
              const keyValue = keys[`${item}`];
              let value = Resource[`${item}`]
              if (item === 'CreateTime' || item === 'UpdateTime') {
                value = moment(value * 1000).format('YYYY-MM-DD HH:mm:ss');
              }
              return  (
                <div className='file-item' key={index}>
                  <span style={{ marginLeft: '10px' }}>{keyValue}</span>
                  <span className='file-item-config'> {value}</span>
                </div>
              )
            }
          
          })
            : '未上传文件，请先上传文件'
        }
      </ul>
    </div>
  )
}