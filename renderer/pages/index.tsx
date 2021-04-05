import { Box, Flex } from '@chakra-ui/react'
import type { NextPage } from 'next'
import { FormProvider, useFieldArray, useForm } from 'react-hook-form'

import { PageContent } from '~/components/PageContent'
import { INITIAL_URL } from '~/constants'
import type { ArrayElement } from '~/types/ArrayElement'

export type Inputs = {
  Pages: { Url: string }[]
}
export type Page = ArrayElement<Inputs['Pages']>

const IndexPage: NextPage = () => {
  const methods = useForm<Inputs>({
    defaultValues: {
      Pages: [{ Url: INITIAL_URL }, { Url: INITIAL_URL }],
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
