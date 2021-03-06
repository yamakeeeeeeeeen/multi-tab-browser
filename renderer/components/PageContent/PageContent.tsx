import { FC, memo, useCallback, useEffect, useState } from 'react';
import { useFormContext, UseFormMethods } from 'react-hook-form';
import { Box, Button, FormControl, FormErrorMessage, Input } from '@chakra-ui/react';
import { WebviewTag } from 'electron';
import { Inputs, Page } from '~/pages';
import { useValidation, UseValidationMethods } from '~/hooks/useValidation';

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
  urlValidate: UseValidationMethods['url'];
  handleSubmit: UseFormMethods<Inputs>['handleSubmit'];
  register: UseFormMethods<Inputs>['register'];
};

const formHeight = '80px';
const webViewWrapperHeight = `calc(90% - ${formHeight})`;

const Component: FC<ComponentProps> = ({
  url,
  errorMessage,
  BrowserRouteOperation,
  search,
  index,
  urlValidate,
  handleSubmit,
  register,
}) => (
  <Box h="100%">
    {url !== undefined && (
      <FormControl as="form" onSubmit={handleSubmit(search)} isInvalid={!!errorMessage}>
        <Input
          name={`Pages[${index}].Url`}
          defaultValue={url}
          placeholder="URL"
          ref={register({
            validate: {
              ...urlValidate(),
            },
          })}
        />
        <FormErrorMessage>{errorMessage}</FormErrorMessage>
      </FormControl>
    )}
    <Button onClick={() => BrowserRouteOperation('back')}>◀</Button>
    <Button onClick={() => BrowserRouteOperation('forward')}>▶</Button>
    <Box style={{ height: webViewWrapperHeight }}>
      <webview id={`webview-${index}`} src={url} style={{ height: '100%' }} />
    </Box>
  </Box>
);

export const PageContent: FC<Props> = memo(({ pageData, index }) => {
  const [url, setUrl] = useState<UrlState>(pageData.Url);
  const { url: urlValidate } = useValidation();
  const { errors, handleSubmit, register, setValue, getValues } = useFormContext<Inputs>();
  const errorMessage = errors?.Pages?.[index]?.Url?.message;

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
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

  return (
    <Component {...{ url, errorMessage, BrowserRouteOperation, search, index, urlValidate, handleSubmit, register }} />
  );
});

PageContent.displayName = 'PageContent';
