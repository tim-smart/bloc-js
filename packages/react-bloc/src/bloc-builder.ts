import { Component, ReactNode } from "react";
import { Bloc } from "@bloc-js/bloc";
import { Subscription } from "rxjs";

export interface IBlocBuilderProps<S> {
  bloc: Bloc<any, S>;
  builder: (state: S) => ReactNode;
}

export interface IBlocBuilderState<S> {
  data: S;
}

export class BlocBuilder<S> extends Component<
  IBlocBuilderProps<S>,
  IBlocBuilderState<S>
> {
  constructor(props: IBlocBuilderProps<S>) {
    super(props);
    this.state = { data: this.props.bloc.currentState };
    this.subscription = Subscription.EMPTY;
  }

  private subscription: Subscription;

  componentDidMount() {
    this.subscription = this.props.bloc.state$.subscribe(data => {
      this.setState({ data });
    });
  }

  public componentWillUnmount() {
    this.subscription.unsubscribe();
  }

  public render() {
    return this.props.builder(this.state.data);
  }
}
