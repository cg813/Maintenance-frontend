import React, { FC, useEffect, useState } from 'react';
import classNames from 'classnames';
import { FormContextValues } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import common from '../../../styles/common';
import { Button, Collapse, Datepicker, DropdownItem, LeftCharacters } from '../../atomic';
import { Dropdown } from '../../core-ui';
import { IntervalUnit, Maintenance, Document, TimeUnit } from '../../../core/models';
import { internalExternal, intervalLabels, intervals } from '../../../core/utils/constants';
import AssignFileToMaintenance from '../assign-file-to-maintenance/assign-file-to-maintenance.component';
import { isWeekend, not } from '../../../core/utils/filters';
import DocumentManager from '../document-manager/document-manager.component';

interface Constraint {
  min: number;
  max: number;
}

const categories = ['Machine stop', 'Machine running'];

const constraints: { [key: string]: Constraint } = {
  [IntervalUnit.yearly]: { min: 1, max: 100 },
  [IntervalUnit.monthly]: { min: 1, max: 12 },
  [IntervalUnit.weekly]: { min: 1, max: 4 },
  [IntervalUnit.daily]: { min: 1, max: 30 },
  [IntervalUnit.hourly]: { min: 1, max: 24 },
  [IntervalUnit.km]: { min: 1, max: 100000 },
  [IntervalUnit.no]: { min: 1, max: 1000000 },
};

interface Props {
  form: FormContextValues<Maintenance>;
  dueDate: Date|null;
  setDueDate: React.Dispatch<React.SetStateAction<Date|null>>;
  earliestExecTime: Date|null;
  setEarliestExecTime: React.Dispatch<React.SetStateAction<Date|null>>;
  category: string;
  setCategory: React.Dispatch<React.SetStateAction<string>>;
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  responsible: string;
  setResponsible: React.Dispatch<React.SetStateAction<string>>;
  description: string;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
  interval: number;
  setRepeatInterval: React.Dispatch<React.SetStateAction<number>>;
  intervalUnit: number;
  setIntervalUnit: React.Dispatch<React.SetStateAction<number>>;
  documents: Document[];
  setDocuments: React.Dispatch<React.SetStateAction<Document[]>>;
  isInternal: boolean;
  setIsInternal: React.Dispatch<React.SetStateAction<boolean>>;
  useOperatingHours: boolean;
  setUseOperatingHours: React.Dispatch<React.SetStateAction<boolean>>;
  dueAt: number|undefined;
  setDueAt: React.Dispatch<React.SetStateAction<number|undefined>>;
  useDistance: boolean;
  setUseDistance: React.Dispatch<React.SetStateAction<boolean>>;
  useStrokes: boolean;
  setUseStrokes: React.Dispatch<React.SetStateAction<boolean>>;
  earliestProcessing: number|undefined;
  setEarliestProcessing: React.Dispatch<React.SetStateAction<number|undefined>>;
  hasDeviceKey: boolean;
}

const FirstStep: FC<Props> = ({
  form,
  dueDate,
  setDueDate,
  earliestExecTime,
  setEarliestExecTime,
  category,
  setCategory,
  interval,
  setRepeatInterval,
  intervalUnit,
  setIntervalUnit,
  title,
  setTitle,
  responsible,
  setResponsible,
  description,
  setDescription,
  documents,
  setDocuments,
  isInternal,
  setIsInternal,
  useOperatingHours,
  setUseOperatingHours,
  dueAt,
  setDueAt,
  useDistance,
  setUseDistance,
  useStrokes,
  setUseStrokes,
  earliestProcessing,
  setEarliestProcessing,
  hasDeviceKey
}) => {
  const [intervalOpened, setIntervalOpened] = useState(false);
  const [documentsOpened, setDocumentsOpened] = useState<boolean>();
  const [isAssignDocumentOpened, setAssignDocumentOpened] = useState<boolean>(false);
  const [documentToEdit, setDocumentToEdit] = useState<Document>();

  const { t } = useTranslation();

  const updateDocument = (document: Document) => {
    const index = documents.findIndex(({ id }) => id === document.id);
    documents[index].title = document.title;

    setDocuments([...documents]);
    setDocumentToEdit(undefined);
  };

  const deleteDocument = (document: Document) => {
    const newDocuments = [...documents];
    newDocuments.splice(newDocuments.findIndex(({ id }) => id === document.id), 1);
    setDocuments(newDocuments);
  };

  const updateInterval = (constraint: Constraint, quantity: number) => {
    if (!useOperatingHours && quantity > constraint.max) {
      setRepeatInterval(constraint.max);
    } else if (!useOperatingHours && quantity < constraint.min) {
      setRepeatInterval(constraint.min);
    } else {
      setRepeatInterval(quantity);
    }
  };

  return (
    <>
      <div className='mt-3 position-relative'>
        <span className={common.forms.label}>{t('title')} *</span>
        <input
          value={title}
          className={classNames(
            common.forms.input,
            (form.errors.title || title.length > 100) ? common.forms.error : '',
            'w-100',
          )}
          onChange={(event) => setTitle(event.target.value)}
        />
        <LeftCharacters total={100} entered={title.length} className='mr-3' style={{ bottom: -2 }} />
      </div>
      <div className='d-flex justify-content-between mt-3'>
        <div className={classNames(common.forms.w230, 'mr-3')}>
          <span className={common.forms.label}>{t('repeatInterval')}</span>
          <Dropdown
            label={
              intervalUnit
                ? `${interval > 1 ? `${!useOperatingHours ? t('every') : ''} ${interval}` : ''} ${t(
                  useOperatingHours ? 'operatingHours' : useDistance ? 'km' : useStrokes ? 'strokes' : intervalLabels[intervalUnit],
                )}`
                : ''
            }
            open={intervalOpened}
            onRequestOpen={() => setIntervalOpened(true)}
            onClose={() => setIntervalOpened(false)}
          >
            {intervalUnit ? (
              <>
                <DropdownItem>
                  <div className='d-flex w-100 justify-content-between align-items-center'>
                    {t(intervalLabels[intervalUnit])}
                    <input
                      className={classNames('w-50', common.forms.input)}
                      value={Number(interval) || ''}
                      onChange={(event) => updateInterval(constraints[intervalUnit], Number(event.target.value))}
                      min={!useOperatingHours && intervalUnit && constraints[intervalUnit].min || 0}
                      max={!useOperatingHours && intervalUnit && constraints[intervalUnit].max || Infinity}
                      type='number'
                    />
                  </div>
                </DropdownItem>

                <DropdownItem disabled>
                  <div className='d-flex w-100 justify-content-between align-items-center'>
                    <Button
                      width='auto'
                      className='flex-fill mr-3'
                      color='red'
                      onClick={() => {
                        setRepeatInterval(1);
                        setIntervalUnit(0);
                        setUseOperatingHours(false);
                        setUseDistance(false);
                        setUseStrokes(false);
                      }}
                    >
                      {t('clear')}
                    </Button>
                    <Button
                      width='auto'
                      className='w-50'
                      onClick={() => setIntervalOpened(false)}
                    >
                      {t('save')}
                    </Button>
                  </div>
                </DropdownItem>
              </>
            ) : null}
            {!intervalUnit
            && (
              <>
                { intervals.filter((unit) => unit !== intervalUnit)
                  .map((unit) => (
                    <DropdownItem
                      key={unit}
                      onClick={() => {
                        setIntervalUnit(unit);
                      }}
                    >
                      {t(intervalLabels[unit])}
                    </DropdownItem>
                  ))
                }
                { hasDeviceKey && (
                  <>
                    <DropdownItem
                      onClick={() => {
                        setIntervalUnit(IntervalUnit.hourly);
                        setUseOperatingHours(true);
                      }}
                    >
                      {t('operatingHours')}
                    </DropdownItem>
                    <DropdownItem
                      onClick={() => {
                        setIntervalUnit(IntervalUnit.km);
                        setUseDistance(true);
                      }}
                    >
                      {t('distance')}
                    </DropdownItem>
                    <DropdownItem
                      onClick={() => {
                        setIntervalUnit(IntervalUnit.no);
                        setUseStrokes(true);
                      }}
                    >
                      {t('strokes')}
                    </DropdownItem>
                  </>
                )}
              </>
            )}
          </Dropdown>
        </div>
        { useOperatingHours && (
          <>
            <div className='flex-fill mr-3 position-relative'>
              <span className={common.forms.label}>{t('dueAt')}</span>
              <input
                value={Number(dueAt) || ''}
                type='number'
                className={classNames(
                  common.forms.input,
                  'w-100',
                  form.errors.dueAt ? common.forms.error : '',
                )}
                onChange={(event) => setDueAt(Number(event.target.value))}
              />
              <span
                style={{ bottom: 1, right: 10 }}
                className={classNames('position-absolute', common.forms.label)}
              >{t('hours')}</span>
            </div>
            <div className='flex-fill mr-3 position-relative'>
              <span className={common.forms.label}>{t('earliestProcessing')}</span>
              <input
                value={Number(earliestProcessing) || ''}
                type='number'
                className={classNames(
                  common.forms.input,
                  'w-100',
                  form.errors.earliestProcessing ? common.forms.error : '',
                )}
                onChange={(event) => setEarliestProcessing(Number(event.target.value))}
              />
              <span
                style={{ bottom: 1, right: 10 }}
                className={classNames('position-absolute', common.forms.label)}
              >{t('hours')}</span>
            </div>
          </>
        ) }
        { useDistance && (
          <>
            <div className='flex-fill mr-3 position-relative'>
              <span className={common.forms.label}>{t('dueAt')}</span>
              <input
                value={Number(dueAt) || ''}
                type='number'
                className={classNames(
                  common.forms.input,
                  'w-100',
                  form.errors.dueAt ? common.forms.error : '',
                )}
                onChange={(event) => setDueAt(Number(event.target.value))}
              />
              <span
                style={{ bottom: 1, right: 10 }}
                className={classNames('position-absolute', common.forms.label)}
              >{t('kilometers')}</span>
            </div>
            <div className='flex-fill mr-3 position-relative'>
              <span className={common.forms.label}>{t('earliestProcessing')}</span>
              <input
                value={Number(earliestProcessing) || ''}
                type='number'
                className={classNames(
                  common.forms.input,
                  'w-100',
                  form.errors.earliestProcessing ? common.forms.error : '',
                )}
                onChange={(event) => setEarliestProcessing(Number(event.target.value))}
              />
              <span
                style={{ bottom: 1, right: 10 }}
                className={classNames('position-absolute', common.forms.label)}
              >{t('kilometers')}</span>
            </div>
          </>
        ) }
        { useStrokes && (
          <>
            <div className='flex-fill mr-3 position-relative'>
              <span className={common.forms.label}>{t('dueAt')}</span>
              <input
                value={Number(dueAt) || ''}
                type='number'
                className={classNames(
                  common.forms.input,
                  'w-100',
                  form.errors.dueAt ? common.forms.error : '',
                )}
                onChange={(event) => setDueAt(Number(event.target.value))}
              />
              <span
                style={{ bottom: 1, right: 10 }}
                className={classNames('position-absolute', common.forms.label)}
              >{t('no')}</span>
            </div>
            <div className='flex-fill mr-3 position-relative'>
              <span className={common.forms.label}>{t('earliestProcessing')}</span>
              <input
                value={Number(earliestProcessing) || ''}
                type='number'
                className={classNames(
                  common.forms.input,
                  'w-100',
                  form.errors.earliestProcessing ? common.forms.error : '',
                )}
                onChange={(event) => setEarliestProcessing(Number(event.target.value))}
              />
              <span
                style={{ bottom: 1, right: 10 }}
                className={classNames('position-absolute', common.forms.label)}
              >{t('no')}</span>
            </div>
          </>
        ) }
        <div className='flex-fill'>
          <span className={common.forms.label}>{t(useOperatingHours ? 'dueNoLaterThan' : 'validTill')}</span>
          <Datepicker
            error={form.errors.dueDate}
            calendarIcon
            selected={dueDate}
            onChange={setDueDate}
            minDate={earliestExecTime}
            filterDate={not.isWeekend}
          />
        </div>
        { (!useOperatingHours && !useDistance && !useStrokes) && (
          <div className='flex-fill ml-3'>
            <span className={common.forms.label}>{t('earliestPossibleProcessing')}</span>
            <Datepicker
              calendarIcon
              selected={earliestExecTime}
              onChange={setEarliestExecTime}
              filterDate={not.isWeekend}
              maxDate={dueDate}
            />
          </div>
        ) }
      </div>

      <div className='d-flex justify-content-between mt-4'>
        <div className={common.forms.w230}>
          <span className={common.forms.label}>{t('responsible')} *</span>
          <input
            value={responsible}
            className={classNames(
              common.forms.input,
              'w-100',
              form.errors.responsible ? common.forms.error : '',
            )}
            onChange={(event) => setResponsible(event.target.value)}
          />
        </div>
        <div className={common.forms.w230}>
          <span className={common.forms.label}>{t(internalExternal[1])}/{t(internalExternal[0])}</span>
          <Dropdown width='auto' label={t(internalExternal[Number(isInternal)]) as string}>
            <DropdownItem onClick={() => setIsInternal(true)}>
              {t(internalExternal[1])}
            </DropdownItem>
            <DropdownItem onClick={() => setIsInternal(false)}>
              {t(internalExternal[0])}
            </DropdownItem>
          </Dropdown>
        </div>
        <div className={common.forms.w230}>
          <span className={common.forms.label}>{t('category')}</span>
          <Dropdown label={`${t(category)}`}>
            {category && (
              <DropdownItem onClick={() => setCategory('')}>
                <strong>clear</strong>
              </DropdownItem>
            )}
            {categories
              .filter((c) => c !== category)
              .map((c) => (
                <DropdownItem key={c} onClick={() => setCategory(c)}>
                  <span className='text-nowrap'>{t(c)}</span>
                </DropdownItem>
              ))}
          </Dropdown>
        </div>
      </div>

      <div className='mt-4 mb-2 position-relative'>
        <span className={common.forms.label}>{t('description')} *</span>
        <div className='d-flex justify-content-between'>
          <textarea
            value={description}
            className={classNames(
              common.forms.textarea,
              'w-100',
              (form.errors.description || description.length > 100) ? common.forms.error : '',
            )}
            onChange={(event) => setDescription(event.target.value)}
          />
        </div>
        <LeftCharacters total={100} entered={description.length} className='mr-3' />
      </div>

      <Collapse
        open={!!documentsOpened}
        label={t('addFiles')}
        onToggle={() => setDocumentsOpened(!documentsOpened)}
        className={classNames(common.modal.hdiv, 'border-0')}
      >
        <div className={classNames(common.modal.body, 'w-100')}>
          <table className='w-100'>
            <thead className={classNames(common.table.header, common.table.small)}>
            <tr>
              <td>{t('documents')}</td>
              <td>{t('type')}</td>
              <td>
                <div className='d-flex justify-content-end'>
                  <Button
                    className='px-4'
                    color='dark'
                    onClick={() => setAssignDocumentOpened(true)}
                  >
                    <span className={classNames(common.icon.attach, 'mr-4')} />
                   { t('addFiles')}
                  </Button>
                </div>
              </td>
            </tr>
            </thead>
            <tbody className={classNames(common.table.body, common.table.nowrap)}>
            {documents.map((document) => (
              <tr key={`create-edit-maintenance-document-${document.id}`}>
                <td valign='middle'>{document.title}</td>
                <td valign='middle'>
                  <span className='text-uppercase'>
                    {document.ext}
                  </span>
                </td>
                <td>
                  <div className='d-flex justify-content-end'>
                    { !!document.archive && (
                      <Button
                        variant='square'
                        className='mr-2'
                        color='dark'
                        onClick={() => setDocumentToEdit(document)}
                      >
                        <span className={common.icon.edit} />
                      </Button>
                    ) }
                    <Button
                      variant='square'
                      color='red'
                      onClick={() => deleteDocument(document)}
                    >
                      <span className={common.icon.cross} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>
      </Collapse>
      <AssignFileToMaintenance
        onAccept={(selectedDocuments) => {
          setDocuments(selectedDocuments as Document[]);
          setAssignDocumentOpened(false);
        }}
        initialDocuments={documents}
        isOpen={isAssignDocumentOpened}
        onRequestClose={() => setAssignDocumentOpened(false)}
      />
      <DocumentManager
        isOpen={!!documentToEdit}
        document={documentToEdit}
        save={false}
        onUpdate={updateDocument}
        onRequestClose={() => setDocumentToEdit(undefined)}
      />
    </>
  );
};

export default FirstStep;
