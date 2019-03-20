// @flow

import * as React from 'react';

import ImageCrop from './ImageCrop';

type Props = {
  cleanName: string,
  description: string,
  getValidity: (string, string) => string | false,
  name: string,
  onChange: (string, string) => mixed,
  savedValue: string,
};

type State = {
  currentValue: string,
  croppedValue: string,
  disableEditRemoteImage: boolean,
  showCropper: boolean,
  showModal: boolean,
  validationError: boolean
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
const IMG_MAX_WIDTH = 600;

export class ImageInput extends React.PureComponent<Props, State> {
  fileRef: {current: null | HTMLInputElement} = React.createRef();

  state = {
    currentValue: this.props.savedValue,
    croppedValue: '',
    disableEditRemoteImage: false,
    showCropper: false,
    showModal: false,
    validationError: false
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
    if (this.state.currentValue) {
      this.shouldDisableEditButton(this.state.currentValue);
    }
  }

  componentDidUpdate({ savedValue: prevSavedValue }: {savedValue: string}) {
    if (
      !this.state.validationError &&
      (this.props.savedValue !== prevSavedValue)
    ) {
      this.setState({
        currentValue: this.props.savedValue,
      });
    }
  }

  shouldDisableEditButton(image: string) {
    const isFromRemote = /^http.+\.(gif|png|tiff|bmp|jpg)/.test(image);

    // if image is from remote,
    //  or `Image` argument string is malformed,
    //  or `Image` argument string is empty,
    // disable edit button
    if (isFromRemote || (!isFromRemote && image.trim()) || !image.trim()) {
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

  getModalDisplayStyle() {
    return {
      display: this.state.showModal ? 'block' : 'none',
    };
  }

  handleFileChange(event: SyntheticEvent<HTMLInputElement>) {
    const file = event.currentTarget.files[0];
    const reader = new window.FileReader();

    reader.onload = () => {
      const url = (typeof reader.result === 'string') ? reader.result : reader.result.toString();

      this.setState({
        currentValue: url,
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

    this.handleToggleModal();
  }

  handleImageCrop(croppedValue: string) {
    this.setState({ croppedValue });
  }

  handleImageDelete() {
    this.setState({
      croppedValue: '',
      currentValue: '',
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

  resizeImageSource(dataURL: string): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!dataURL) {
        reject('');
        return;
      }

      const image = new Image();

      image.addEventListener('load', () => {
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
      });

      image.src = dataURL;
    });
  }

  async updateImage() {
    const { getValidity, name } = this.props;
    const { croppedValue, currentValue } = this.state;
    const imageDataURL = croppedValue || currentValue;

    let resizedImageDataURL;

    try {
      resizedImageDataURL = await this.resizeImageSource(imageDataURL);
    } catch (error) {
      resizedImageDataURL = '';
    }

    const validity = getValidity(name, resizedImageDataURL);

    // if the valid string either has length, or is empty, it's valid
    const isImageDataValid = (validity && validity.length > 0) || (validity === '' && validity.length === 0);

    if (isImageDataValid) {
      if (resizedImageDataURL) {
        this.setState({
          croppedValue: '',
          showModal: false,
          validationError: false,
        }, () => {
          this.props.onChange(name, resizedImageDataURL);
        });
      } else {
        this.props.onChange(name, '');
      }
    } else {
      this.setState({
        validationError: true,
      });
    }
  }

  render() {
    const { cleanName, description } = this.props;
    const { disableEditRemoteImage } = this.state;

    /* eslint-disable complexity */
    return (
      <div className="contract-variable file">
        {this.props.savedValue
          ? (
            <button
              className="image"
              onClick={this.handleToggleModal}
              disabled={disableEditRemoteImage}
            >
              {`Edit ${description}`}
            </button>
          ) : (
            <Fragment>
              <label
                htmlFor={`image-${cleanName}`}
              >
                <span>{`Select ${description}`}</span>

                <input
                  accept="image/png, image/jpeg, image/tiff, image/bmp, image/gif"
                  id={`image-${cleanName}`}
                  className="image"
                  onChange={this.handleFileChange}
                  ref={this.fileRef}
                  type="file"
                />
              </label>
            </Fragment>
          )
        }

        {
          (this.state.showModal && this.state.currentValue) && (
            <div className="modal" style={this.getModalDisplayStyle()}>
              <div className="modal-form">
                <Fragment>
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

                  <div className="ol-modalconfirm-buttons">
                    <button
                      className="ol-modalconfirm-primary button is-info-new"
                      onClick={() => this.updateImage()}
                    >
                      Save
                    </button>
                    <div className="ol-modalconfirm-buttons">
                      {this.props.savedValue && (
                        <a
                          className="ol-modalconfirm-secondary"
                          onClick={this.handleImageDelete}
                          style={{ marginRight: 24 }}
                        >
                          Delete
                        </a>
                      )}
                      <a
                        className="ol-modalconfirm-secondary"
                        href=""
                        onClick={this.handleImageCancel}
                      >
                        Cancel
                      </a>
                    </div>
                  </div>
                </Fragment>
              </div>
            </div>
          )
          /* eslint-enable complexity */
        }
      </div>
    );
  }
}
