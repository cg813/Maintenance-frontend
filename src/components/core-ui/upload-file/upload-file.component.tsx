import React, { FC, useState } from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

import common from '../../../styles/common';
import { Button } from '../../atomic';
import styles from './upload-file.module.scss';
import { File as FFile, Document } from '../../../core/models';
import PdfViewer from '../../modals/pdf-viewer/pdf-viewer.component';
import { getFileUrl } from '../../../core/services/file.service';
import { ViewVideo } from '../../modals';
import { fileTypes } from '../../../core/utils/constants';
import TruncateText from '../truncate-text/truncate-text.component';

interface ListProps {
  files?: Array<File|FFile|Document>;
  onDelete?: (file: File|FFile, index: number) => void;
}

interface ButtonProps extends React.InputHTMLAttributes<HTMLInputElement> {
  iconClass?: string;
  buttonText?: string;
}

export const UploadButton: FC<ButtonProps> = ({ iconClass, buttonText, ...props }) => {
  const inputReference = React.createRef<HTMLInputElement>();
  const { t } = useTranslation();

  return (
    <>
      <Button color='dark' className={common.forms.w230} onClick={() => inputReference.current?.click()}>
        <span className={iconClass || classNames(common.icon.plus, 'mr-3')} />
        {buttonText || t('uploadFiles')}
      </Button>
      <input className='d-none' ref={inputReference} type='file' accept='.pdf,image/*,video/*,.xlsx,.xls,.xslx,.doc,.docx,.ppt,.pptx,.txt,.pdf' {...props}/>
    </>
  );
};

export const List: FC<ListProps> = ({
  files,
  onDelete,
}) => {
  const [isPDFOpen, setIsPDFOpen] = useState(false);
  const [fileUrl, setFileUrl] = useState<string|File>('');
  const [videoToView, setVideoToView] = useState<string>();

  const getFileId = (file: Document|FFile) => (
    ('file' in file ? file.file.id : file.id) || ''
  );

  const downloadFile = (file: Document) => {
    const link = document.createElement('a');
    link.href = `${getFileUrl(getFileId(file))}?disposition=attachment`;
    link.target = '_blank';
    document.body.append(link);
    link.click();
    document.body.removeChild(link);
  };

  const openFileAsPdf = (file: File|FFile|Document) => {
    if ((file as Document).ext && (file as Document).ext !== 'pdf') {
      downloadFile(file as Document);
      return;
    }
    if (file instanceof File) {
      setFileUrl(file as File);
    } else {
      setFileUrl(getFileUrl(getFileId(file)));
    }
    setIsPDFOpen(true);
  };

  const openFileToView = (file: File|FFile|Document) => {
    if ('ext' in file && fileTypes.video.includes(file.ext)) {
      setVideoToView(getFileUrl(getFileId(file)));
    } else {
      openFileAsPdf(file);
    }
  };

  return (
    <div className={classNames(styles.file, 'd-flex flex-wrap mb-2')}>
      { files?.map((file, i) => <div
          className={classNames(
            file instanceof File ? null : common.forms.w230,
            'd-flex mt-2 ml-3 align-items-center',
          )}
          key={file instanceof File ? file.name : file.id}
        >
            <a
              href={getFileUrl(getFileId(file as FFile))}
              download
              target='_blank'
              rel='noopener noreferrer'
            >
              <span className={classNames(styles.name, 'mw-106')}>
                { 'title' in file ? file.title : file.name.replace(/\.[^.]*$/, '') }
              </span>
            </a>
          <Button
            color='transparent'
            width='auto'
            className={classNames(styles.name, 'w-auto p-0 m-0')}
            onClick={() => openFileToView(file)}
          >
          </Button>
          <span className='text-uppercase ml-1'>
            ({ 'ext' in file ? file.ext : file.name.replace(/^.*\.([^.]*)$/, '$1')})
          </span>
          <div className='d-flex'>
            { file instanceof File ? null : (
              <Button
                variant='square'
                color='dark'
                className='ml-2'
                onClick={() => openFileToView(file)}
              >
                <span className={common.icon.filedownload} />
              </Button>
            ) }
            <Button
              variant='square'
              color='red'
              className='ml-2'
              onClick={() => onDelete && onDelete('file' in file ? file.file : file, i)}
            >
              <span className={common.icon.trash} />
            </Button>
          </div>
        </div>
      ) || null }
      <PdfViewer isOpen={isPDFOpen} onRequestClose={() => setIsPDFOpen(false)} fileUrl={fileUrl} />
      <ViewVideo url={videoToView || ''} isOpen={!!videoToView} onRequestClose={() => setVideoToView(undefined)} />
    </div>
  );
};
