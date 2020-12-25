import { FC, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { UrlForm } from '~/components/UrlForm';
import { Inputs, Page } from '~/pages';

type Props = {
  pageData: Partial<Page & Record<'id', string>>;
  index: number;
};

export const PageContent: FC<Props> = ({ pageData, index }) => {
  const [url, setUrl] = useState<string | undefined>(pageData.Url);
  const { errors, handleSubmit, register, setValue, getValues } = useFormContext<Inputs>();
  const errorMessage = errors?.Pages?.[index]?.Url?.message;

  const search = (formValues: Page) => {
    setValue('Pages[index].Url', formValues.Url);
    setUrl(getValues(`Pages[${index}].Url`));
  };

  return (
    <div>
      <form onSubmit={handleSubmit(search)}>
        {url !== undefined && <UrlForm {...{ register, index }} value={url} />}

        {errorMessage && <p>{errorMessage}</p>}
      </form>
      <div id="view-container" style={{ display: 'flex', width: '100%', height: '100%' }}>
        <webview id="view" src={url} style={{ width: '50%', height: '50%' }} />
      </div>
    </div>
  );
};
