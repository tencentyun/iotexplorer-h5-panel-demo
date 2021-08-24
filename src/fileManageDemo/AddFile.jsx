import React, { useRef, useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import './FileManage.less';
import sdk from 'qcloud-iotexplorer-h5-panel-sdk';
import { ResourceNameContext } from '../app';
import './AddFile.less';
import { FileSdkForH5 } from 'tencentcloud-file-resource-sdk';
const fileSdk = new FileSdkForH5(sdk);


export function AddFile() {
  const history = useHistory();
  const [fileName, setFileName] = useState('');
  const ResourceInfo = useContext(ResourceNameContext);
  const { ResourceName, upDateResourceName } = ResourceInfo;
  const hasUpload = useRef(false);

  const AppGetResourceUploadURL = async () =>{
    const file = document.getElementById('file').files[0];
    const { ResourceName } = await fileSdk.appGetResourceUploadURL(file);
    upDateResourceName(ResourceName);
    hasUpload.current = true;
  }


  // 下发到设备端
  const handelDownToDevice = async () => {
    try {
      if(!hasUpload.current) {
        sdk.tips.showError('请先上传文件');
        return;
      }
      const result =  fileSdk.handelDownToDevice(ResourceName);
      result.then((Resource) => {
        if (!Resource) {
          sdk.tips.hideLoading();
          sdk.tips.alert('下发失败,设备不在线');
        } else {
          sdk.tips.hideLoading();
          history.push({
            pathname: '/file-manage',
            state: {
              Resource: Resource,
            },
          });
        }
      })
    } catch(e) {
      console.log('ERROR', e);
      history.push({
        pathname: '/error',
        state: {
          ErrorMessage: e,
        }
      })
      
    }
  }

  return(
    <div className='file-add-wrapper'>
       <div className='file-add'>
        <a className='file-upload'>
          <span className="upload-icon">
            选择文件
          </span>
          
          <input type="file" id='file' 
            onClick={(e) =>{ 
              e.target.value = null;
              setFileName('')
            }} 
           onChange={(value) => {
            const fileName = value.target.files[0].name;
            if (fileName) {
              setFileName(fileName);
            }
          }}/>
        </a>
        {
            fileName ? <span className='file-name'>{fileName}</span> : ''
        }
      </div>
      <div className='btn-groups'>
          <button className='btn-upload' onClick={AppGetResourceUploadURL}>上传</button>
          <button className='btn-upload' onClick={handelDownToDevice} style={{color: '#006eff', backgroundColor: 'rgb(212 212 212 / 36%)'}}>下发到设备端</button>
      </div>
    </div>
   
  )
}