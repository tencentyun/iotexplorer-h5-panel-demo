import React, { useRef, useState } from 'react'
import { noop } from '../../../utils'
import { Modal } from '../../Modal'
import './AsrPanelControl.less'
import sdk from 'qcloud-iotexplorer-h5-panel-sdk'

export interface IAsrPanelControlProps {
  visible: boolean;
  templateConfig: TemplatePropertyConfig;
  onClose?: () => void;
}

export function AsrPanelControl ({
  visible,
  templateConfig,
  onClose = noop
}: IAsrPanelControlProps) {
  const $input = useRef(null)
  const [valueArr, setValueArr] = useState<Array<any>>([])
  const onConfirm = async () => {
    // @ts-ignore
    const file = $input.current.files[0]

    if (!file) {
      return sdk.tips.showError('请选择音频文件')
    }

    sdk.tips.showLoading('正在识别，请稍后')

    // 监听ws查询结果，必须放在sdk.voiceRecognition前面，因为有可能websocket更快地返回结果
    let receiveTotal = 0
    let resArr: Array<any> = []
    let onReceive = ({ deviceId, data: asrData }) => {
      console.log('asrData', asrData)

      if (asrData.result_code !== 0) {
        sdk.tips.showError(asrData.res_text || '语音识别失败')
        sdk.off('asrResponse', onReceive)
      }

      try {
        if (!resArr[asrData.seq - 1]) {
          resArr[asrData.seq - 1] = asrData.res_text
          receiveTotal++
          setValueArr(resArr.slice(0))
        }

        // 接受完成
        if (receiveTotal === asrData.total_num) {
          sdk.off('asrResponse', onReceive)
          // @ts-ignore
          $input.current.value = null
          sdk.tips.hideLoading()
        }
      } catch (e) {
        console.error(e)
      }
    }
    sdk.on('asrResponse', onReceive)

    try {
      await sdk.voiceRecognition({
        DeviceId: sdk.deviceId,
        AudioType: 'file',
        ResourceName: file.name,
        Data: file
      })
    } catch (e) {
      sdk.off('asrResponse', onReceive)
      sdk.tips.showError(e && e.msg || '语音识别失败')
    }
  }

  return Boolean(visible) && (
    <Modal
      className="asr-model"
      visible={true}
      fixedBottom={true}
      onClose={onClose}
      title="ASR识别"
      showBackBtn={false}
    >
      <Modal.Body>
        <div className="asr-control-modal">
          <label>
            <input
              type="file"
              ref={$input}
            />
          </label>
          <div className="mod-result-wrap">
            <div className="mod-result-title">识别结果</div>
            <div className="mod-result">{valueArr.join('')}</div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Modal.FooterConfirmBtnGroup
          confirmText="确定"
          cancelText="取消"
          cancelBtnType="cancel"
          isInFixedBottomModal={true}
          onConfirm={onConfirm}
          onCancel={onClose}
        />
      </Modal.Footer>
    </Modal>
  )
}
