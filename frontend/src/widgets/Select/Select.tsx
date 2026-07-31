import React, { useState } from 'react';
import { IoMdMore } from 'react-icons/io';
import { IconType } from 'react-icons/lib';

type Props = {
  items: SelectItem[],
  classNameBtn?: string,
}

type SelectItem = {
  isContent?: boolean,
  content?: React.ReactNode;

  name?: string,
  Icon?: IconType,
  onClick?: () => void,
}

export const Select: React.FC<Props> = ({ items, classNameBtn }) => {
  const [isShow, setShow] = useState(false);

  return (
    <>
      <button
        onBlur={() => setShow(false)}
        onClick={() => setShow(prev => !prev)}
        className={classNameBtn ?? ''}
      >
        <IoMdMore size={32} />
      </button>

      {isShow && (
        <div className="rounded-[8px] mt-[10px] p-[3px] bg-black/50 absolute backdrop-filter">
          <ul>
            {items.map(item => {
              const { isContent = false } = item;

              if (isContent) {
                return item.content;
              }

              return ( 
                <li
                  key={item.name}
                  onMouseDown={() => {
                    if (item.onClick) item.onClick();
                    setShow(false);
                  }}
                  className="flex gap-[10px] items-center min-w-[250px] hover:bg-white/5 px-[12px] py-[8px] rounded-[8px]"
                >
                  { item.Icon && <item.Icon color="white" size={24} /> }
                  <span>{item.name}</span>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </>
  );
};
