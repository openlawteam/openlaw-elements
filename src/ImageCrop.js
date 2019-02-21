// @flow

import * as React from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

type CallAllType = (
  (Array<any>) => mixed
);

type CropParametersType = {
  height: number,
  width: number,
  x: number,
  y: number,
};

type CropPropsType = {
  src?: string,
  crop?: CropParametersType,
  imageStyle?: any,
  keepSelection?: boolean,
  onChange?: CallAllType,
  onComplete?: CallAllType,
  onImageLoaded?: CallAllType,
};

type GetPropsFunctionType = (?CropPropsType) => CropPropsType;

type ChildParameterTypes = {
  Crop: ReactCrop,
  croppedImage: string,
  getCropProps: (?CropPropsType) => {},
  onSelectFile: (SyntheticInputEvent<HTMLInputElement>) => mixed,
};

type PropTypes = {
  children?: (ChildParameterTypes) => React.Element<any>,
  crop?: CropParametersType,
  dataURL?: string,
  onImageCrop: (string) => mixed,
  onImageDelete?: (string) => mixed,
  targetHeight?: number,
  targetWidth?: number,
  showDeleteButton: boolean,
};

type StateTypes = {
  crop: ?CropParametersType,
  croppedImage: string,
  image: ?HTMLImageElement,
  src: string,
};

const { Component } = React;

const styles = {
  cropWrap: {
    position: 'relative',
    display: 'inline-block',
  },
  cropDeleteOverlay: {
    cursor: 'pointer',
    position: 'absolute',
    right: -16,
    top: -16,
  },
};

const callAll = (...fns) => (...args: Array<any>) => fns.forEach(fn => fn && fn(...args));

// https://github.com/DominicTobias/react-image-crop#what-about-showing-the-crop-on-the-client
const getCroppedImage = (image: HTMLImageElement, pixelCrop: CropParametersType) => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  if (image) {
    // $FlowFixMe - Flow doesn't have this correct?
    context.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height,
    );
  }

  return canvas.toDataURL();
};

const resizeImageToDataURL = ({ image, height, width }: {image: Image, height: number, width: number}): string => {
  // create an off-screen canvas
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  // set its dimension to target size
  canvas.width = width;
  canvas.height = height;

  // set background color
  context.fillStyle = 'white';
  context.fillRect(0, 0, canvas.width, canvas.height);

  // draw source image into the off-screen canvas:
  context.drawImage(image, 0, 0, width, height);

  // encode image to data-uri with base64 version of compressed image
  return canvas.toDataURL();
};

const renderDeleteOverlayButton = ({ onClick, ...props }: {onClick: (any) => mixed}) => (
  <svg
    {...props}
    id="imagecrop-clear"
    onClick={onClick}
    height="16"
    width="16"
    viewBox="0 0 150 150"
    xmlns="http://www.w3.org/2000/svg">
    <g fill="none">
      <circle cx="75" cy="75" fill="#000" fillOpacity="0.15" r="75" />
      <g stroke="#fff" strokeLinecap="round" strokeWidth="16">
        <path
          d="m.395.395 77.9479421 77.9479421"
          transform="translate(36 36)"
        />
        <path d="m0 0 79 79" transform="rotate(-90 75.5 39.5)" />
      </g>
    </g>
  </svg>
);

export default class ImageCrop extends Component<PropTypes, StateTypes> {
  static defaultProps = {
    showDeleteButton: true,
  };

  state = {
    crop: this.props.crop || {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
    },
    croppedImage: '',
    image: null,
    src: this.props.dataURL || '',
  };

  componentDidUpdate({ dataURL: dataURLPrev }: {dataURL?: string}, prevState: StateTypes) {
    const { children, dataURL } = this.props;

    // existing image we want to remove from state
    if (!dataURL && dataURLPrev && prevState.src) {
      this.setState({ src: '' });
      return;
    }

    // initial image (e.g. loaded from a server)
    if (dataURL && dataURL !== dataURLPrev && !prevState.src) {
      this.setImageSource(dataURL);
    }

    if (!children && dataURL && (dataURL !== dataURLPrev) && prevState.src) {
      this.setImageSource(dataURL);
    }
  }

  getDimensionsFromTarget = ({ height, width }: {height: number, width: number}) => {
    const { targetHeight, targetWidth } = this.props;
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
  };

  getReactCropProps: GetPropsFunctionType = (props) => {
    const {
      crop,
      onChange,
      onComplete,
      onImageLoaded,
      ...reactCropProps
    } = props || {};

    return {
      src: this.state.src,
      crop: this.state.crop || crop,
      imageStyle: { background: 'white' },
      keepSelection: true,
      onChange: callAll(onChange, this.onCropChange),
      onComplete: callAll(onComplete, this.onComplete),
      onImageLoaded: callAll(onImageLoaded, this.onImageLoaded),
      ...reactCropProps,
    };
  };

  setImageSource = (dataURL: string) => {
    const image = new Image();

    image.addEventListener('load', () => {
      const { height: imageHeight, width: imageWidth } = image;
      const { height, width } = this.getDimensionsFromTarget({
        height: imageHeight,
        width: imageWidth,
      });
      const src = resizeImageToDataURL({
        image,
        height,
        width,
      });

      this.setState({
        src,
      });
    });

    image.src = dataURL;
  };

  onSelectFile = (event: SyntheticInputEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length) {
      const reader = new window.FileReader();

      reader.addEventListener(
        'load',
        () => {
          this.setImageSource(reader.result.toString());
        },
        false,
      );

      reader.readAsDataURL(event.target.files[0]);
    }
  };

  onCropChange = (crop: CropParametersType) => {
    this.setState({ crop });
  };

  onComplete = (crop: CropParametersType, pixelCrop: CropParametersType) => {
    if (this.state.image) {
      this.setState(
        {
          croppedImage: getCroppedImage(this.state.image, pixelCrop),
        },
        () => {
          this.props.onImageCrop(this.state.croppedImage);
        },
      );
    }
  };

  onImageDelete = () => {
    this.setState({ src: '' }, () => {
      if (this.props.onImageDelete) this.props.onImageDelete(this.state.src);
    });
  };

  onImageLoaded = (image: HTMLImageElement, pixelCrop: CropParametersType) => {
    this.setState(
      {
        croppedImage: getCroppedImage(image, pixelCrop),
        image,
      },
      () => {
        this.props.onImageCrop(this.state.croppedImage);
      },
    );
  };

  renderReactComp = (props: CropPropsType) => {
    const CropDeleteOverlay = renderDeleteOverlayButton;
    return this.state.src ? (
      <div style={styles.cropWrap}>
        <ReactCrop {...props} />
        {this.props.showDeleteButton && (
          <CropDeleteOverlay
            onClick={this.onImageDelete}
            style={styles.cropDeleteOverlay}
          />
        )}
      </div>
    ) : null;
  };

  render() {
    return (
      <div>
        {this.props.children ? (
          this.props.children({
            Crop: this.renderReactComp,
            croppedImage: this.state.croppedImage,
            getCropProps: this.getReactCropProps,
            onSelectFile: this.onSelectFile,
          })
        ) : (
          this.renderReactComp(this.getReactCropProps())
        )}
      </div>
    );
  }
}
