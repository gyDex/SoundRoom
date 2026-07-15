import { Select, Space } from 'antd';
import style from './SwitchLanguages.module.scss'

const SwitchLanguages = () => {
  return (
    <Select
      className={style['switch-languages']}
      popupClassName={style['switch-languages-dropdown']}
      optionFilterProp="label"
      placeholder="Select language"
      options={[
        {
          value: 'en',
          label: (
            <Space className='!flex items-center'>
              <img className='object-cover rounded-full' src="/images/flags/gb.svg" width={20} />
              English
            </Space>
          ),
        },
        {
          value: 'ru',
          label: (
            <Space className='!flex items-center'>
              <img className='object-cover rounded-full' src="/images/flags/ru.svg" width={20} />
              Русский
            </Space>
          ),
        },
      ]}
    />
  );
};


export default SwitchLanguages;
