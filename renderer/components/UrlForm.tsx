import { FC } from 'react';
import { Input } from '@chakra-ui/react';
import { useValidation } from '~/hooks/useValidation';
import { UseFormMethods } from 'react-hook-form';
import { Inputs, Page } from '~/pages';

type Props = {
  register: UseFormMethods<Inputs>['register'];
  index: number;
  value: Page['Url'];
};

export const UrlForm: FC<Props> = ({ register, index, value }) => {
  const { url } = useValidation();

  return (
    <Input
      name={`Pages[${index}].Url`}
      defaultValue={value}
      placeholder="URL"
      ref={register({
        validate: {
          ...url(),
        },
      })}
    />
  );
};
