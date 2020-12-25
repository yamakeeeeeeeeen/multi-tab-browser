import { FC, useEffect } from 'react';
import { PageContent } from '~/components/PageContent';
import { FormProvider, useForm, useFieldArray } from 'react-hook-form';
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
        {fields.map((page, index) => (
          <PageContent key={page.id} pageData={page} index={index} />
        ))}
      </FormProvider>
    </div>
  );
};

export default IndexPage;
