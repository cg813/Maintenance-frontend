import React, { FC, useState, useEffect } from 'react';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useLocation, Link } from 'react-router-dom';
import { ISA95EquipmentHierarchyModelElement } from 'shared/common/models';

import { Button, DropdownItem } from '../../atomic';
import styles from './header.module.scss';
import common from '../../../styles/common';
import { showModal } from '../../../core/store/modals/modals.actions';
import { CREATE_EDIT_MAINTENANCE } from '../../../core/store/modals/modal-types';
import { selectCurrentAsset } from '../../../core/store/assets/assets.selectors';
import { selectTileConfigurations } from '../../../core/store/hub/hub.selectors';
import { Dropdown } from '../../core-ui';
import { getUsername, signOut } from '../../../core/services/session.service';
import { getIconUrl } from '../../../core/services/file.service';
import { getTileConfigurations } from '../../../core/store/hub/hub.actions';

const Header: FC = () => {
  const dispatch = useDispatch();
  const username = getUsername();
  const openCreateEditMaintenanceModal = () =>
    dispatch(showModal({ open: true, role: 'create' }, CREATE_EDIT_MAINTENANCE));
  const currentAsset = useSelector(selectCurrentAsset);
  const tileConfigurations = useSelector(selectTileConfigurations);
  const location = useLocation();
  const [menuOpened, setMenuOpened] = useState(false);
  const [languageMenuOpened, setLanguageMenuOpened] = useState(false);
  const [appMenuOpened, setAppMenuOpened] = useState(false);

  const { i18n, t } = useTranslation();

  useEffect(() => {
    dispatch(getTileConfigurations);
  }, [dispatch]);

  const changeLanguage = async (lang: 'en' | 'de') => {
    localStorage.setItem('lang', lang);
    await i18n.changeLanguage(lang);
    setLanguageMenuOpened(false);
  };

  return (
    <div className={classNames(styles.header, 'd-flex', 'align-items-center', 'pl-2')}>
      <Dropdown
        transparent
        open={appMenuOpened}
        onRequestOpen={() => setAppMenuOpened(true)}
        onClose={() => setAppMenuOpened(false)}
        label={
          <div className="d-flex align-items-center">
            <span className={common.icon.burger} />
          </div>
        }
        bodyWidth="auto"
      >
        {tileConfigurations?.length > 0 &&
          tileConfigurations.map((child, i) => (
            <a href={child.appUrl}>
              <DropdownItem key={i}>
                <img
                  src={getIconUrl(child.iconUrl)}
                  className={classNames(styles.icon, 'mr-2')}
                />
                {child.tileName}
              </DropdownItem>
            </a>
          ))}
      </Dropdown>

      <div className="d-flex flex-column">
        <div className={classNames(styles.logoText, 'ml-3')}>
          DIGITAL <b>SUITE</b>
        </div>
        <Link to={''}>
          <span className={classNames(styles.logo, 'ml-3')} />
        </Link>
      </div>

      <Link to={''} className="ml-5">
        <Button
          color="transparent"
          className={classNames(
            styles.link,
            location.pathname.includes('machine') ? styles.active : null,
          )}
        >
          {t('maintenance')}
        </Button>
      </Link>
      <Link to="/documents" className="ml-4">
        <Button
          color="transparent"
          className={classNames(
            styles.link,
            location.pathname.includes('documents') ? styles.active : null,
          )}
        >
          {t('documents')}
        </Button>
      </Link>

      <div className="flex-fill d-flex justify-content-end mr-3">
        {currentAsset?.assetType?.equipmentType ===
          ISA95EquipmentHierarchyModelElement.PRODUCTION_UNIT && (
          <Button className="mr-3" onClick={openCreateEditMaintenanceModal}>
            <span className={classNames(common.icon.plus, 'ml-1 mr-3')} />
            {t('newMaintenancePlan')}
          </Button>
        )}
        <Dropdown
          transparent
          open={languageMenuOpened}
          bodyWidth="auto"
          onRequestOpen={() => setLanguageMenuOpened(true)}
          onClose={() => setLanguageMenuOpened(false)}
          label={
            i18n.language === 'en' ? (
              <span className={common.icon.en} />
            ) : (
              <span className={common.icon.de} />
            )
          }
        >
          <DropdownItem onClick={() => changeLanguage('en')}>
            <span className={classNames(common.icon.en, 'mr-2')} />
            English
          </DropdownItem>
          <DropdownItem onClick={() => changeLanguage('de')}>
            <span className={classNames(common.icon.de, 'mr-2')} />
            German
          </DropdownItem>
        </Dropdown>
        <Dropdown
          transparent
          open={menuOpened}
          onRequestOpen={() => setMenuOpened(true)}
          onClose={() => setMenuOpened(false)}
          label={
            <div className="d-flex align-items-center">
              <span className={classNames(common.icon.avatar, 'mr-2')} />
              {username}
            </div>
          }
        >
          <DropdownItem onClick={() => signOut()}>Log out</DropdownItem>
        </Dropdown>
      </div>
    </div>
  );
};

export default Header;
