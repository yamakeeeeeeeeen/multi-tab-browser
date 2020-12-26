import { FC, memo, useCallback, useEffect, useState } from 'react';
import { useFormContext, UseFormMethods } from 'react-hook-form';
import { Box, Button } from '@chakra-ui/react';
import { WebviewTag } from 'electron';
import { UrlForm } from '~/components/UrlForm';
import { Inputs, Page } from '~/pages';

type UrlState = string | undefined;

type Props = {
  pageData: Partial<Page & Record<'id', string>>;
  index: number;
};
type ComponentProps = Pick<Props, 'index'> & {
  url: UrlState;
  errorMessage: string | undefined;
  BrowserRouteOperation: (operate: 'back' | 'forward') => void;
  search: (formValues: Inputs) => void;
  handleSubmit: UseFormMethods<Inputs>['handleSubmit'];
  register: UseFormMethods<Inputs>['register'];
};

const formHeight = '40px';
const webViewWrapperHeight = `calc(100% - ${formHeight})`;

const Component: FC<ComponentProps> = ({
  url,
  errorMessage,
  BrowserRouteOperation,
  search,
  index,
  handleSubmit,
  register,
}) => (
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

export const PageContent: FC<Props> = memo(({ pageData, index }) => {
  const [url, setUrl] = useState<UrlState>(pageData.Url);
  const { errors, handleSubmit, register, setValue, getValues } = useFormContext<Inputs>();
  const errorMessage = errors?.Pages?.[index]?.Url?.message;
  const webView = process.browser && (document.getElementById(`webview-${index}`) as WebviewTag);

  const search = useCallback(
    (formValues: Inputs) => {
      setValue('Pages[index].Url', formValues.Pages[index].Url);
      setUrl(getValues(`Pages[${index}].Url`));
    },
    [getValues, index, setValue],
  );
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

  return <Component {...{ url, errorMessage, BrowserRouteOperation, search, index, handleSubmit, register }} />;
});

PageContent.displayName = 'PageContent';
