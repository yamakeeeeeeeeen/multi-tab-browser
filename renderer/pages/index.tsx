import { Box, Flex } from '@chakra-ui/react'
import type { FC } from 'react'
import { FormProvider, useFieldArray, useForm } from 'react-hook-form'

import { PageContent } from '~/components/PageContent'
import type { ArrayElement } from '~/types/ArrayElement'

const initialUrl = 'https://google.com/'

export type Inputs = {
  Pages: { Url: string }[]
}
export type Page = ArrayElement<Inputs['Pages']>

const IndexPage: FC = () => {
  const methods = useForm<Inputs>({
    defaultValues: {
      Pages: [{ Url: initialUrl }, { Url: initialUrl }],
    },
  })
  const { fields } = useFieldArray<Inputs>({
    control: methods.control,
    name: 'Pages',
  })

  return (
    <div style={{ height: '100vh' }}>
      <FormProvider {...methods}>
        <Flex h="100%">
          {fields.map((page, index) => (
            <Box key={page.id} w={1 / fields.length}>
              <PageContent pageData={page} index={index} />
            </Box>
          ))}
        </Flex>
      </FormProvider>
    </div>
  )
}

// eslint-disable-next-line import/no-default-export
export default IndexPage
