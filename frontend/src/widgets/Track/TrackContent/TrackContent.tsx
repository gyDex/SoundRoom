import React from 'react'

type Props = {
    description: string,
}

const TrackContent:React.FC<Props> = ({description}) => {
  return (
    <section className='track-content'>
        {
            description ??
            <span className='track-content__description'>
                {description}
            </span>
        }
    </section>
  )
}

export default TrackContent
