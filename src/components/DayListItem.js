import React from 'react';

import 'components/DayListItem.scss'
import classNames from 'classnames';



export default function DayListItem(props) {
  const {
    name, spots, selected, setDay
  } = props;

  const ItemClassNames = classNames("day-list__item", {
    "day-list__item--selected": selected,
    "day-list__item--full": !spots
  });

  const formatSpots = (spots) => {
    return `${spots ? spots : 'no'} spot${spots === 1 ? '' :'s'} remaining`;
  }
  return (
    <li data-testid="day" className={ItemClassNames} onClick={setDay}>
      <h2 className='text--regular'>{name}</h2>
      <h3 className='text--light'>{formatSpots(spots)}</h3>
    </li>
  );
};