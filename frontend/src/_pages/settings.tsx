'use client'

import { disable2FA } from '@/shared/hooks/settings/disable2FA';
import { enable2FA } from '@/shared/hooks/settings/enable2FA';
import { Button, Input, QRCode, Space, Switch } from 'antd';
import { useState, useRef } from 'react';
import { Typography } from 'antd';

const { Title } = Typography;

const SettingsPage = () => {
  const [code, setCode] = useState('');
  const [checked, setChecked] = useState(false);
  const [qrCode, setQRCode] = useState('');
  const [secretCode, setSecretCode] = useState('');
  const isLoadingRef = useRef(false);

  const onChange = async (checked: any) => {
    
    const value = checked;

    if (isLoadingRef.current) return;

    isLoadingRef.current = true;
    setChecked(value);

    try {
      if (checked) {
        const result = await enable2FA();
        setQRCode(result.qrCode)
        setSecretCode(result.secret)
        console.log(result)
      }
      else {
        await disable2FA(secretCode);
      }
    } catch (err) {
      setChecked(prev => !prev);
    } finally {
      isLoadingRef.current = false;
    }
  };

  return (
    <section className='mt-[20px]'>
        <div className='flex gap-[10px] items-center'>
            <Switch title='2FA Enable' defaultChecked checked={checked} onChange={onChange} />
            <span>2FA Enabled</span>
        </div>

        <div className='mt-[10px] flex flex-col gap-[10px]'>
          {
              (qrCode && qrCode != '') &&
              <Space align="center">
                  <QRCode   color="#000000"
                    bgColor="#ffffff" value={qrCode || '-'} />
              </Space>
          }

          {
              (secretCode && secretCode != '') &&
              <Space align="center">
                  <Title level={2}>{secretCode}</Title>
              </Space>
          }
        </div>
    </section>
  );
};

export default SettingsPage;
