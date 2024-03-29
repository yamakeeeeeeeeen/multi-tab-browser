import { Box, Button, Flex, FormControl, FormErrorMessage, Input } from '@chakra-ui/react'
import type { WebviewTag } from 'electron'
import type { VFC } from 'react'
import { memo, useCallback, useEffect, useState } from 'react'
import type { UseFormHandleSubmit, UseFormRegister } from 'react-hook-form'
import { useFormContext } from 'react-hook-form'

import { PROCESS_CLIENT } from '~/constants'
import type { UseValidationMethods } from '~/hooks/useValidation'
import { useValidation } from '~/hooks/useValidation'
import type { Inputs, Page } from '~/pages'

type UrlState = string | undefined

type Props = {
  pageData: Partial<Page & Record<'id', string>>
  index: number
}
type ComponentProps = Pick<Props, 'index'> & {
  url: UrlState
  errorMessage: string | undefined
  BrowserRouteOperation: (operate: 'back' | 'forward') => void
  search: (formValues: Inputs) => void
  urlValidate: UseValidationMethods['url']
  handleSubmit: UseFormHandleSubmit<Inputs>
  register: UseFormRegister<Inputs>
}

const formHeight = '40px'
const webViewWrapperHeight = `calc(100% - ${formHeight})`

const Component: VFC<ComponentProps> = ({
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
      <Flex>
        <Button onClick={() => BrowserRouteOperation('back')}>◀</Button>
        <Button onClick={() => BrowserRouteOperation('forward')}>▶</Button>
        <FormControl as="form" onSubmit={handleSubmit(search)} isInvalid={!!errorMessage}>
          <Input
            value={url}
            placeholder="URL"
            {...register(`Pages.${index}.Url` as const, {
              validate: {
                ...urlValidate(),
              },
            })}
          />
          <FormErrorMessage>{errorMessage}</FormErrorMessage>
        </FormControl>
      </Flex>
    )}
    <Box style={{ height: webViewWrapperHeight }}>
      <webview id={`webview-${index}`} src={url} style={{ height: '100%' }} />
    </Box>
  </Box>
)

export const PageContent: VFC<Props> = memo(({ pageData, index }) => {
  const [webView, setWebView] = useState<WebviewTag | null>(null)
  const [url, setUrl] = useState<UrlState>(pageData.Url)
  const { url: urlValidate } = useValidation()
  const {
    formState: { errors },
    handleSubmit,
    register,
    setValue,
    getValues,
  } = useFormContext<Inputs>()
  const errorMessage = errors?.Pages?.[index]?.Url?.message

  const search = useCallback(
    (formValues: Inputs) => {
      setValue(`Pages.${index}.Url` as `Pages.0.Url`, formValues.Pages[index].Url)
      setUrl(getValues(`Pages.${index}.Url` as const))
    },
    [getValues, index, setValue]
  )
  const BrowserRouteOperation = useCallback(
    (operate: 'back' | 'forward') => {
      if (!webView) return

      switch (operate) {
        case 'back':
          webView.goBack()
          break
        case 'forward':
          webView.goForward()
          break
      }
    },
    [webView]
  )

  useEffect(() => {
    if (PROCESS_CLIENT) {
      setWebView(document.getElementById(`webview-${index}`) as WebviewTag | null)
    }
  }, [index])
  useEffect(() => {
    if (!webView) return
    webView.addEventListener('did-navigate-in-page', (_event) => {
      if (PROCESS_CLIENT) {
        setUrl(webView.getURL())
      }
    })
  }, [webView])
  useEffect(() => {
    if (webView) {
      webView.addEventListener('did-fail-load', () => {
        setUrl('/404')
      })
    }
  }, [webView])

  return (
    <Component
      {...{
        url,
        errorMessage,
        BrowserRouteOperation,
        search,
        index,
        urlValidate,
        handleSubmit,
        register,
      }}
    />
  )
})

PageContent.displayName = 'PageContent'
