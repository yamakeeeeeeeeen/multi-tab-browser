import { FC, useCallback, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Box, Button } from '@chakra-ui/react';
import { WebviewTag } from 'electron';
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

  const formHeight = '40px';
  const webViewWrapperHeight = `calc(100% - ${formHeight})`;

  const search = (formValues: Page) => {
    setValue('Pages[index].Url', formValues.Url);
    setUrl(getValues(`Pages[${index}].Url`));
  };

  const webView = process.browser && (document.getElementById(`webview-${index}`) as WebviewTag);

  const BrowserRouteOperation = useCallback(
    (operate: 'back' | 'forward') => {
      if (webView) {
        switch (operate) {
          case 'back':
            webView.goBack();
            break;
          case 'forward':
            webView.goForward();
            break;
          default:
            break;
        }
      }
    },
    [webView],
  );

  useEffect(() => {
    if (webView) {
      webView.addEventListener('did-fail-load', () => {
        setUrl('/404');
      });
    }
  }, [webView]);

  return (
    <Box h="100%">
      <form onSubmit={handleSubmit(search)} style={{ height: formHeight }}>
        {url !== undefined && <UrlForm {...{ register, index }} value={url} />}
        {errorMessage && <p>{errorMessage}</p>}
        <Button onClick={() => BrowserRouteOperation('back')}>◀</Button>
        <Button onClick={() => BrowserRouteOperation('forward')}>▶</Button>
      </form>
      <Box style={{ height: webViewWrapperHeight }}>
        <webview id={`webview-${index}`} src={url} style={{ height: '100%' }} />
      </Box>
    </Box>
  );
};
