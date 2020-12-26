import { FC, useEffect } from 'react';
import { FormProvider, useForm, useFieldArray } from 'react-hook-form';
import { Box, Flex } from '@chakra-ui/react';
import { PageContent } from '~/components/PageContent';
import { ArrayElement } from '~/types/ArrayElement';

const initialUrl = 'https://google.com/';

export type Inputs = {
  Pages: { Url: string }[];
};
export type Page = ArrayElement<Inputs['Pages']>;

const IndexPage: FC = () => {
  const methods = useForm<Inputs>({
    defaultValues: {
      Pages: [{ Url: initialUrl }, { Url: initialUrl }],
    },
  });
  const { fields } = useFieldArray<Page>({
    control: methods.control,
    name: 'Pages',
  });

  const data = methods.getValues();
  useEffect(() => {
    console.log('data', data);
    console.log('fields', fields);
  }, [data]);

  return (
    <div style={{ height: '100vh' }}>
      <FormProvider {...methods}>
        <Flex h="100%">
          {fields.map((page, index) => (
            <Box w={1 / fields.length}>
              <PageContent key={page.id} pageData={page} index={index} />
            </Box>
          ))}
        </Flex>
      </FormProvider>
    </div>
  );
};

export default IndexPage;
