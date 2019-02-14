// @flow

import * as React from 'react';

// TODO refactor this component. It's a bit slow when rendering; not sure why; need to dig.

type Props = {
  accordionPosition?: string | number,
  children: any,
  className: string,
  classParentString: string,
  contentInnerClassName: string,
  contentOuterClassName: string,
  easing: string,
  handleTriggerClick?: Function,
  lazyRender: boolean,
  onClose: Function,
  onClosing: Function,
  onOpen: Function,
  onOpening: Function,
  open: boolean,
  openedClassName: string,
  overflowWhenOpen: | 'hidden'
    | 'visible'
    | 'auto'
    | 'scroll'
    | 'inherit'
    | 'initial'
    | 'unset',
  transitionTime: number,
  trigger: string,
  triggerSibling: any,
  triggerWhenOpen?: boolean,
  triggerClassName: string,
  triggerDisabled: boolean,
  triggerOpenedClassName: string,
  triggerSibling: ?boolean,
};

type State = {
  hasBeenOpened: boolean,
  height: number | 'auto',
  inTransition: boolean,
  isClosed: boolean,
  overflow: string,
  shouldOpenOnNextCycle: boolean,
  shouldSwitchAutoOnNextCycle: boolean,
  transition: string,
};

export default class Collapsible extends React.Component<Props, State> {
  static defaultProps = {
    transitionTime: 400,
    easing: 'linear',
    open: false,
    classParentString: 'Collapsible',
    triggerDisabled: false,
    lazyRender: false,
    overflowWhenOpen: 'hidden',
    openedClassName: '',
    triggerClassName: '',
    triggerOpenedClassName: '',
    contentOuterClassName: '',
    contentInnerClassName: '',
    className: '',
    triggerSibling: null,
    onOpen: () => {},
    onClose: () => {},
    onOpening: () => {},
    onClosing: () => {},
  };

  refInner: {current: null | HTMLDivElement} = React.createRef();

  constructor(props: Props) {
    super(props);

    // Bind class methods
    const self: any = this;
    self.handleTriggerClick = this.handleTriggerClick.bind(this);
    self.handleTransitionEnd = this.handleTransitionEnd.bind(this);
    self.continueOpenCollapsible = this.continueOpenCollapsible.bind(this);

    // Defaults the dropdown to be closed
    if (this.props.open) {
      this.state = {
        hasBeenOpened: true,
        height: 'auto',
        inTransition: false,
        isClosed: false,
        overflow: this.props.overflowWhenOpen,
        shouldOpenOnNextCycle: false, // should be true??
        shouldSwitchAutoOnNextCycle: false,
        transition: 'none',
      };
    } else {
      this.state = {
        hasBeenOpened: false,
        height: 0,
        inTransition: false,
        isClosed: true,
        overflow: 'hidden',
        shouldOpenOnNextCycle: false, // should be true??
        shouldSwitchAutoOnNextCycle: false,
        transition: `height ${this.props.transitionTime}ms ${
          this.props.easing
        }`,
      };
    }
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (this.state.shouldOpenOnNextCycle) {
      this.continueOpenCollapsible();
    }

    if (
      prevState.height === 'auto' &&
      this.state.shouldSwitchAutoOnNextCycle === true
    ) {
      window.setTimeout(() => {
        // Set small timeout to ensure a true re-render
        this.setState({
          height: 0,
          overflow: 'hidden',
          isClosed: true,
          shouldSwitchAutoOnNextCycle: false,
        });
      }, 50);
    }

    // If there has been a change in the open prop (controlled by accordion)
    if (prevProps.open !== this.props.open) {
      if (this.props.open === true) {
        this.openCollapsible();
      } else {
        this.closeCollapsible();
      }
    }
  }

  closeCollapsible() {
    const ref = this.refInner.current;

    this.setState({
      shouldSwitchAutoOnNextCycle: true,
      height: (ref ? ref.offsetHeight : 0),
      transition: `height ${this.props.transitionTime}ms ${this.props.easing}`,
      inTransition: true,
    });
  }

  openCollapsible() {
    this.setState({
      inTransition: true,
      shouldOpenOnNextCycle: true,
    });
  }

  continueOpenCollapsible() {
    const ref = this.refInner.current;

    this.setState({
      height: (ref ? ref.offsetHeight : 0),
      transition: `height ${this.props.transitionTime}ms ${this.props.easing}`,
      isClosed: false,
      hasBeenOpened: true,
      inTransition: true,
      shouldOpenOnNextCycle: false,
    });
  }

  handleTriggerClick(event: SyntheticEvent<*>) {
    event.preventDefault();

    if (this.props.triggerDisabled) {
      return;
    }

    if (this.props.handleTriggerClick && this.props.accordionPosition) {
      this.props.handleTriggerClick(this.props.accordionPosition);
    } else {
      if (this.state.isClosed === true) {
        this.openCollapsible();
        this.props.onOpening();
      } else {
        this.closeCollapsible();
        this.props.onClosing();
      }
    }
  }

  renderNonClickableTriggerElement() {
    if (
      this.props.triggerSibling &&
      typeof this.props.triggerSibling === 'string'
    ) {
      return (
        <span className={`${this.props.classParentString}__trigger-sibling`}>
          {this.props.triggerSibling}
        </span>
      );
    } else if (this.props.triggerSibling) {
      const {triggerSibling} = this.props;
      return <triggerSibling />;
    }

    return null;
  }

  handleTransitionEnd() {
    // Switch to height auto to make the container responsive
    if (!this.state.isClosed) {
      this.setState({height: 'auto', inTransition: false});
      this.props.onOpen();
    } else {
      this.setState({inTransition: false});
      this.props.onClose();
    }
  }

  render() {
    const dropdownStyle = {
      height: this.state.height,
      WebkitTransition: this.state.transition,
      msTransition: this.state.transition,
      transition: this.state.transition,
      overflow: this.state.overflow,
    };

    const openClass = this.state.isClosed ? 'is-closed' : 'is-open';
    const disabledClass = this.props.triggerDisabled ? ' is-disabled' : '';

    //If user wants different text when tray is open
    const trigger =
      this.state.isClosed === false && !!this.props.triggerWhenOpen
        ? this.props.triggerWhenOpen
        : this.props.trigger;

    // Don't render children until the first opening of the Collapsible if lazy rendering is enabled
    const children =
      this.state.isClosed && !this.state.inTransition
        ? null
        : this.props.children;

    // Construct CSS classes strings
    const triggerClassString = `${
      this.props.classParentString
    }__trigger ${openClass}${disabledClass} ${
      this.state.isClosed
        ? this.props.triggerClassName
        : this.props.triggerOpenedClassName
    }`;
    const parentClassString = `${this.props.classParentString} ${
      this.state.isClosed ? this.props.className : this.props.openedClassName
    }`;
    const outerClassString = `${this.props.classParentString}__contentOuter ${
      this.props.contentOuterClassName
    }`;
    const innerClassString = `${this.props.classParentString}__contentInner ${
      this.props.contentInnerClassName
    }`;

    return (
      <div className={parentClassString.trim()}>
        <span
          className={triggerClassString.trim()}
          onClick={this.handleTriggerClick}>
          {trigger}
        </span>

        {this.renderNonClickableTriggerElement()}

        <div
          className={outerClassString.trim()}
          style={dropdownStyle}
          onTransitionEnd={this.handleTransitionEnd}>
          <div className={innerClassString.trim()} ref={this.refInner}>
            {children}
          </div>
        </div>
      </div>
    );
  }
}
