// @flow

import * as React from 'react';

import ImageCrop from './ImageCrop';
import { FieldError } from './FieldError';
import { onBlurValidation, onChangeValidation } from './validation';
import { CSS_CLASS_NAMES } from './constants';
import { singleSpaceString } from './utils';
import type {
  FieldEnumType,
  FieldPropsValueType,
  OnChangeFuncType,
  OnValidateFuncType,
  ValidityFuncType,
} from './flowTypes';

type Props = {
  cleanName: string,
  description: string,
  getValidity: ValidityFuncType,
  inputProps: ?FieldPropsValueType,
  name: string,
  onChange: OnChangeFuncType,
  onValidate: ?OnValidateFuncType,
  savedValue: string,
  variableType: FieldEnumType,
};

type State = {
  currentValue: string,
  croppedValue: string,
  disableEditRemoteImage: boolean,
  errorMessage: string,
  shouldShowError: boolean,
  showCropper: boolean,
  showModal: boolean,
};

type DrawImageType = {
  image: Image,
  height: number,
  width: number,
};

type DimensionsType = {
  height: number,
  width: number,
  targetHeight?: number,
  targetWidth?: number,
};

const { Fragment } = React;
// 600: good for document width and preview rendering
const IMG_MAX_WIDTH = 600;

export class ImageInput extends React.PureComponent<Props, State> {
  fileRef: {current: null | HTMLInputElement} = React.createRef();

  state = {
    currentValue: this.props.savedValue,
    croppedValue: '',
    disableEditRemoteImage: false,
    errorMessage: '',
    shouldShowError: false,
    showCropper: false,
    showModal: false,
  };

  constructor(props: Props) {
    super(props);

    const self: any = this;
    self.handleFileChange = this.handleFileChange.bind(this);
    self.handleImageCancel = this.handleImageCancel.bind(this);
    self.handleImageCrop = this.handleImageCrop.bind(this);
    self.handleImageDelete = this.handleImageDelete.bind(this);
    self.handleShowCropper = this.handleShowCropper.bind(this);
    self.handleToggleModal = this.handleToggleModal.bind(this);
    self.updateImage = this.updateImage.bind(this);
  }

  componentDidMount() {
    const { currentValue } = this.state;

    if (currentValue) {
      this.maybeDisableEditButton(currentValue);
    }
  }

  componentDidUpdate({ savedValue: prevSavedValue }: {savedValue: string}) {
    if (this.props.savedValue !== prevSavedValue) {
      this.setState({
        currentValue: this.props.savedValue,
      });
    }
  }

  maybeDisableEditButton(image: string) {
    const isFromRemote = /^http.+\.(gif|png|tiff|bmp|jpg|svg)/.test(image);

    // if image is from remote then disable edit button
    if (isFromRemote) {
      this.setState({
        disableEditRemoteImage: true,
      });
    }
  }

  drawImageToDataURL({ image, height, width }: DrawImageType): string {
    // create an off-screen canvas
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    // set its dimension to target size
    canvas.width = width;
    canvas.height = height;

    // set background color
    context.fillStyle = 'transparent';
    context.fillRect(0, 0, canvas.width, canvas.height);

    // draw source image into the off-screen canvas:
    context.drawImage(image, 0, 0, width, height);
    // encode image to data-uri with base64 version of compressed image
    return canvas.toDataURL();
  }

  getDimensions({ height, width, targetHeight, targetWidth }: DimensionsType) {
    const safeHeight =
      targetHeight && height >= targetHeight ? targetHeight : height;
    const safeWidth = targetWidth && width >= targetWidth ? targetWidth : width;

    // explicit dimensions
    if (targetHeight && targetWidth) {
      return {
        height: safeHeight,
        width: safeWidth,
      };
    }

    // explicit height, proportional width
    if (targetHeight && !targetWidth) {
      return {
        height: safeHeight,
        width: (safeHeight * width) / height,
      };
    }

    // explicit width, proportional height
    if (targetWidth && !targetHeight) {
      return {
        height: (safeWidth * height) / width,
        width: safeWidth,
      };
    }

    // no target props set
    return {
      height: safeHeight,
      width: safeWidth,
    };
  }

  handleFileChange(event: SyntheticEvent<HTMLInputElement>) {
    const file = event.currentTarget.files[0];
    const reader = new window.FileReader();

    reader.onload = () => {
      const url = (typeof reader.result === 'string') ? reader.result : reader.result.toString();

      const { errorData: { errorMessage }, shouldShowError } = onChangeValidation(
        { file, value: url },
        this.props,
        this.state,
      );

      this.setState({
        currentValue: url,
        errorMessage,
        shouldShowError,
        showModal: true,
      });
    };

    if (file) reader.readAsDataURL(file);

    if (!file) {
      this.setState({
        showModal: false,
      });
    }
  }

  handleImageCancel(event: SyntheticEvent<HTMLAnchorElement>) {
    event.preventDefault();

    const fileInputRef = this.fileRef.current;
    if (fileInputRef) fileInputRef.value = '';

    const { errorData: { errorMessage }, shouldShowError } = onBlurValidation(
      '',
      this.props,
      this.state,
    );

    if (shouldShowError && errorMessage) {
      this.setState({
        errorMessage,
        shouldShowError,
      });
    }

    this.handleToggleModal();
  }

  handleImageCrop(croppedValue: string) {
    this.setState({ croppedValue });
  }

  handleImageDelete() {
    const { errorData: { errorMessage }, shouldShowError } = onBlurValidation(
      '',
      this.props,
      this.state,
    );

    this.setState({
      croppedValue: '',
      currentValue: '',
      errorMessage,
      shouldShowError,
      showModal: false,
    }, () => {
      const fileInputRef = this.fileRef.current;
      if (fileInputRef) fileInputRef.value = '';

      this.updateImage();
    });
  }

  handleShowCropper() {
    this.setState({ showCropper: true });
  }

  handleToggleModal() {
    this.setState({ showModal: !(this.state.showModal) });
  }

  resizeImageSource(dataURL: string): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!dataURL) {
        reject('');
        return;
      }

      const image = new Image();

      image.onload = () => {
        const { height: imageHeight, width: imageWidth } = image;
        const { height, width } = this.getDimensions({
          height: imageHeight,
          width: imageWidth,
          targetWidth: IMG_MAX_WIDTH,
        });

        const src = this.drawImageToDataURL({
          image,
          height,
          width,
        });

        src ? resolve(src) : reject(src);
      };

      image.src = dataURL;
    });
  }

  async updateImage() {
    const { name, onChange } = this.props;
    const { croppedValue, currentValue } = this.state;
    const imageDataURL = croppedValue || currentValue;
    let resizedImageDataURL;

    try {
      resizedImageDataURL = await this.resizeImageSource(imageDataURL);
    } catch (error) {
      resizedImageDataURL = '';
    }

    const { errorData, shouldShowError } = onBlurValidation(resizedImageDataURL, this.props, this.state);

    this.setState({
      croppedValue: '',
      errorMessage: errorData.errorMessage,
      shouldShowError,
      showModal: false,
    }, () => {
      onChange(
        name,
        resizedImageDataURL || undefined,
        errorData,
      );
    });
  }

  render() {
    const { cleanName, description, inputProps, savedValue, variableType } = this.props;
    const { currentValue, disableEditRemoteImage, errorMessage, shouldShowError, showModal } = this.state;
    const inputPropsClassName = (inputProps && inputProps.className) ? ` ${inputProps.className}` : '';
    const isInputDisabled = (inputProps && inputProps.disabled);

    return (
      <div className={`${CSS_CLASS_NAMES.field} ${CSS_CLASS_NAMES.fieldTypeToLower(variableType)}`}>
        {savedValue
          ? (
            <Fragment>
              <button
                className={CSS_CLASS_NAMES.button}
                onClick={this.handleToggleModal}
                disabled={disableEditRemoteImage}
              >
                {`Edit ${description}`}
              </button>

              <FieldError
                cleanName={cleanName}
                errorMessage={errorMessage}
                shouldShowError={shouldShowError}
              />
            </Fragment>
          ) : (
            <Fragment>
              <label
                htmlFor={`image-${cleanName}`}
              >
                <span
                  className={singleSpaceString(
                    `${CSS_CLASS_NAMES.button}
                    ${isInputDisabled ? CSS_CLASS_NAMES.buttonDisabled : ''}`
                  )}>
                  {`Select ${description}`}
                </span>

                <input
                  accept="image/png, image/jpeg, image/svg+xml, image/tiff, image/bmp, image/gif"

                  {...inputProps}

                  className={singleSpaceString(`${CSS_CLASS_NAMES.fieldInput} ${inputPropsClassName}`)}
                  id={`image-${cleanName}`}
                  onChange={this.handleFileChange}
                  ref={this.fileRef}
                  type="file"
                />

                <FieldError
                  cleanName={cleanName}
                  errorMessage={errorMessage}
                  shouldShowError={shouldShowError}
                />
              </label>
            </Fragment>
          )
        }

        {(showModal && currentValue) && (
          <div className={CSS_CLASS_NAMES.fieldImageEditor}>
            <ImageCrop
              crop={{
                x: 0,
                y: 0,
                width: 100,
                height: 100,
              }}
              dataURL={this.state.currentValue}
              onImageCrop={this.handleImageCrop}
              showDeleteButton={false}
            />

            <div className={
              singleSpaceString(
                `${CSS_CLASS_NAMES.fieldImageEditorActions}
                ${savedValue && CSS_CLASS_NAMES.fieldImageEditorActionsStacked}`
              )}>
              <button
                className={`${CSS_CLASS_NAMES.button}`}
                onClick={this.updateImage}
              >
                Save
              </button>

              <div>
                <a
                  className={CSS_CLASS_NAMES.buttonSecondary}
                  onClick={this.handleImageCancel}
                >
                  Cancel
                </a>
                
                {savedValue && (
                  <a
                    className={CSS_CLASS_NAMES.buttonSecondary}
                    onClick={this.handleImageDelete}
                  >
                    Delete
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}
