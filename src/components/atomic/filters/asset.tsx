import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { AssetDto } from 'shared/common/models';

import Dropdown from '../../core-ui/dropdown/dropdown.component';
import DropdownItem from '../dropdown-item/dropdown-item.component';

interface Props {
  assetId: string;
  summarize: { assetId: string; count: string }[];
  setAssetId: (assetId: string) => void;
  assets: AssetDto[];
  className?: string;
}

const Asset: FC<Props> = ({ assetId, summarize, setAssetId, assets, className }) => {
  const { t } = useTranslation();

  let label = t('all');

  if (assetId) {
    const asset = assets.find((a) => a.id === assetId);
    if (asset) {
      label = asset.name.en_EN;
    } else {
      label = assetId;
    }
  }

  return (
    <Dropdown
      label={
        <div className='text-nowrap'>
          <strong>{t('asset')}:</strong> {label}
        </div>
      }
      className={className}
    >
      <DropdownItem selected={!assetId} onClick={() => setAssetId('')}>
        {t('all')}
      </DropdownItem>
      {assets.map((a) => (
        <DropdownItem
          key={a.id}
          selected={a.id === assetId}
          disabled={!summarize?.find((sum) => sum.assetId === a.id)}
          onClick={() => setAssetId(a.id)}
        >
          {a.name.en_EN}
        </DropdownItem>
      ))}
    </Dropdown>
  );
};

export default Asset;
