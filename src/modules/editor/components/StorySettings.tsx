import React from 'react';
import styled, { css } from 'styled-components';
import tw from 'tailwind.macro';
import { MdClose, MdAddAPhoto, MdDelete } from 'react-icons/md';
import { DialogContent, DialogOverlay } from '@reach/dialog';
import '@reach/dialog/styles.css';
import { animated, useTransition } from 'react-spring';
import format from 'date-fns/format';
import { DropzoneRootProps, DropzoneInputProps } from 'react-dropzone';
import { FormikProps } from 'formik';
import { Story } from '../../../types';
import { Button } from '../../../components';
import { StorySettingsValues } from '../containers/StorySettings';

const StyledDialogOverlay = styled(DialogOverlay)`
  z-index: 11;
`;

const StyledDialogContent = styled(DialogContent)`
  ${tw`fixed top-0 right-0 bottom-0 overflow-y-auto w-full max-w-md m-0 px-8 py-4 bg-white`};
`;

const TitleContainer = styled.div`
  ${tw`py-4 flex justify-between items-center`};
`;

const Title = styled.div`
  ${tw`text-2xl`};
`;

const CloseButton = styled.div`
  ${tw`p-2 -mr-2 flex items-center cursor-pointer`};
`;

const ImageEmpty = styled.div<{ haveImage: boolean }>`
  ${tw`flex items-center justify-center bg-grey py-16 mb-4 cursor-pointer rounded-lg relative border border-solid border-grey focus:outline-none`};

  ${props =>
    props.haveImage &&
    css`
      ${tw`py-0`};
    `}

  span {
    ${tw`py-1 px-2 text-sm text-grey-darker`};
  }
`;

const ImageEmptyIcon = styled.div`
  ${tw`absolute bottom-0 right-0 p-2 flex items-center text-grey-dark`};
`;

const Image = styled.img`
  ${tw`cursor-pointer w-full`};
`;

const FormRow = styled.div`
  ${tw`py-3`};
`;

const FormLabel = styled.label`
  ${tw`w-full block tracking-wide font-bold text-black mb-2`};
`;

const FormInput = styled.input`
  ${tw`appearance-none block w-full bg-white border border-grey rounded py-3 px-3 text-sm leading-tight focus:outline-none`};
`;

const FormTextarea = styled.textarea`
  ${tw`appearance-none block w-full bg-white border border-grey rounded py-3 px-3 text-sm leading-tight focus:outline-none`};
`;

const FormHelper = styled.p<{ error?: boolean }>`
  ${tw`text-sm text-grey-darker mt-1`};

  ${props =>
    props.error &&
    css`
      ${tw`text-pink`};
    `}
`;

const SaveRow = styled.div`
  ${tw`py-3 flex justify-between`};
`;

const ButtonLink = styled.button`
  ${tw`flex items-center text-pink text-sm mt-2`};
  &:focus {
    outline: 0;
  }

  span {
    ${tw`ml-1`};
  }
`;

interface Props {
  story: Story;
  open: boolean;
  onClose: () => void;
  loadingDelete: boolean;
  getRootProps(props?: DropzoneRootProps): DropzoneRootProps;
  getInputProps(props?: DropzoneInputProps): DropzoneInputProps;
  coverFile?: Blob & { preview: string };
  formik: FormikProps<StorySettingsValues>;
  onDelete: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const AnimatedDialogOverlay = animated(StyledDialogOverlay);
const AnimatedDialogContent = animated(StyledDialogContent);

export const StorySettings = ({
  open,
  onClose,
  story,
  loadingDelete,
  getRootProps,
  getInputProps,
  coverFile,
  formik,
  onDelete,
}: Props) => {
  const transitions = useTransition(open, null, {
    from: { opacity: 0, transform: 'translateX(100%)' },
    enter: { opacity: 1, transform: 'translateX(0)' },
    leave: { opacity: 0, transform: 'translateX(100%)' },
    config: {
      duration: 250,
    },
  });

  const coverImageUrl = coverFile ? coverFile.preview : story.coverImage;

  return transitions.map(
    ({ item, key, props: styles }) =>
      item && (
        <AnimatedDialogOverlay
          key={key}
          onDismiss={onClose}
          style={{ opacity: styles.opacity }}
        >
          <AnimatedDialogContent
            style={{
              transform: styles.transform,
            }}
            aria-label="Story settings"
          >
            <TitleContainer>
              <Title>Settings</Title>
              <CloseButton onClick={onClose}>
                <MdClose />
              </CloseButton>
            </TitleContainer>

            <form onSubmit={formik.handleSubmit}>
              <FormRow>
                <FormLabel>Cover image</FormLabel>

                <ImageEmpty
                  {...getRootProps({ tabIndex: undefined })}
                  haveImage={!!coverImageUrl}
                >
                  {coverImageUrl && <Image src={coverImageUrl} />}
                  {!coverImageUrl && <span>Upload cover image</span>}
                  <input {...getInputProps()} />
                  <ImageEmptyIcon>
                    <MdAddAPhoto />
                  </ImageEmptyIcon>
                </ImageEmpty>
              </FormRow>

              <FormRow>
                <FormLabel>Created on</FormLabel>
                <FormInput
                  type="date"
                  value={format(formik.values.createdAt, 'yyyy-MM-dd')}
                  name="createdAt"
                  onChange={e => {
                    if (e.target.value) {
                      formik.setFieldValue(
                        'createdAt',
                        new Date(e.target.value).getTime()
                      );
                    }
                  }}
                />
              </FormRow>

              <FormRow>
                <FormLabel>Slug url</FormLabel>
                <FormInput
                  value={formik.values.slug || ''}
                  name="slug"
                  onChange={formik.handleChange}
                  maxLength={100}
                />
                <FormHelper error>{formik.errors.slug}</FormHelper>
              </FormRow>

              <FormRow>
                <FormLabel>Meta title</FormLabel>
                <FormInput
                  value={formik.values.metaTitle || ''}
                  name="metaTitle"
                  onChange={formik.handleChange}
                  maxLength={100}
                />
                <FormHelper>
                  Recommended: 70 characters. You have used{' '}
                  {formik.values.metaTitle ? formik.values.metaTitle.length : 0}{' '}
                  characters.
                </FormHelper>
              </FormRow>

              <FormRow>
                <FormLabel>Meta description</FormLabel>
                <FormTextarea
                  rows={3}
                  value={formik.values.metaDescription || ''}
                  name="metaDescription"
                  onChange={formik.handleChange}
                  maxLength={250}
                />
                <FormHelper>
                  Recommended: 156 characters. You have used{' '}
                  {formik.values.metaDescription
                    ? formik.values.metaDescription.length
                    : 0}{' '}
                  characters.
                </FormHelper>
              </FormRow>

              <SaveRow>
                <Button disabled={formik.isSubmitting} type="submit">
                  {formik.isSubmitting ? 'Saving...' : 'Save'}
                </Button>

                {loadingDelete ? (
                  <ButtonLink disabled>
                    <MdDelete />
                    <span>Deleting ...</span>
                  </ButtonLink>
                ) : (
                  <ButtonLink onClick={onDelete}>
                    <MdDelete />
                    <span>Delete this story</span>
                  </ButtonLink>
                )}
              </SaveRow>
            </form>
          </AnimatedDialogContent>
        </AnimatedDialogOverlay>
      )
  ) as any;
};
