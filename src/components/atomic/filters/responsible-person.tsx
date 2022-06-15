import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

import Dropdown from '../../core-ui/dropdown/dropdown.component';
import DropdownItem from '../dropdown-item/dropdown-item.component';

interface Props {
  person: string;
  summarize: { responsible: string; count: string }[];
  setPerson: (person: string) => void;
  persons: string[];
  className?: string;
}

const PersonResponsible: FC<Props> = ({ person, summarize, setPerson, persons, className }) => {
  const { t } = useTranslation();

  return (
    <Dropdown
      label={
        <>
          <strong>{t('responsible')}:</strong> {person || t('all')}
        </>
      }
      className={className}
    >
      <DropdownItem selected={!person} onClick={() => setPerson('')}>
        {t('all')}
      </DropdownItem>
      {persons
        .filter((p) => !!p)
        .map((p) => (
          <DropdownItem
            key={p}
            selected={p === person}
            disabled={!summarize?.find((sum) => sum.responsible === p)}
            onClick={() => setPerson(p)}
          >
            {p}
          </DropdownItem>
        ))}
    </Dropdown>
  );
};

export default PersonResponsible;
