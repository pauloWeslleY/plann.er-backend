interface LinkProps {
  title: string;
  url: string;
  tripId: string;
}

export class Link {
  private constructor(
    public readonly id: string,
    private props: LinkProps,
  ) {}

  static restore(props: LinkProps & { id: string }): Link {
    return new Link(props.id, props);
  }

  static create(id: string, props: LinkProps): Link {
    return new Link(id, props);
  }

  get title(): string {
    return this.props.title;
  }

  get url(): string {
    return this.props.url;
  }

  get tripId(): string {
    return this.props.tripId;
  }
}
